import FetchRequest from '../../../Common/Query/FetchRequest';
import getDate from './GetDate';
import QueryBuilder from '../../../Common/Query/QueryBuilder';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { TransactionNoteType as TransactionNoteType } from '../../../Notes/NoteLibrary';
import {NoteLibrary as NoteLibrary} from '../../../Notes/NoteLibrary';
import GenerateLocalConfirmationNum from './GenerateLocalConfirmationNum';
import CascadingAction from '../../../Common/Action/CascadingAction';
import CompleteOperationMobileStatusAction from '../../../Operations/MobileStatus/CompleteOperationMobileStatusAction';
import CompleteSubOperationMobileStatusAction from '../../../SubOperations/MobileStatus/CompleteSubOperationMobileStatusAction';
import libMobile from '../../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../../Common/Library/CommonLibrary';


export default class ConfirmationCreateUpdateAction extends CascadingAction {


    constructor(args) {
        super(args);

        if (!this.args.isFinalConfirmation) {
            // This is not a final confirmation
            // Return early
            return;
        }
        // This is a final confirmation
        let nextActionArgs = {
            doCheckWorkOrderComplete: this.args.doCheckWorkOrderComplete,
            WorkOrderId: this.args.WorkOrderId,
            OperationId: this.args.OperationId,
            didCreateFinalConfirmation: true,
        };
        let beforeActions = ['CompleteMobileStatusAction_WorkOrder'];
        if (this.args.SubOperationId !== undefined && this.args.doCheckSubOperationComplete) {
            nextActionArgs.SubOperationId = this.args.SubOperationId;
            nextActionArgs.doCheckOperationComplete = this.args.doCheckOperationComplete;
            beforeActions.push('CompleteMobileStatusAction_Operation');
            this.pushLinkedAction(new CompleteSubOperationMobileStatusAction(nextActionArgs), beforeActions);
        } else if (this.args.SubOperationId === undefined && this.args.doCheckOperationComplete) {
            // Assuming that an Operation must be selected to reach here
            this.pushLinkedAction(new CompleteOperationMobileStatusAction(nextActionArgs), beforeActions);
        }
    }

    getDefaultArgs() {
        return {
            isOnCreate: true,
            isFinalConfirmation: false,
            doCheckWorkOrderComplete: true,
            doCheckOperationComplete: true,
            doCheckSubOperationComplete: true,
        };
    }

    setActionQueue(actionQueue) {
        // Build the action queue at this point
        if (this.args.isOnCreate) {
            actionQueue.push(this.executeConfirmationCreate);
            actionQueue.push(this.executeCaptureDuration);
            actionQueue.push(this.executeNoteCreate);

        } else {
            actionQueue.push(this.executeConfirmationUpdate);
            actionQueue.push(this.executeCaptureDuration);
            actionQueue.push(this.executeNoteUpdate);
        }

        actionQueue.push(this.executeOperationComplete);
        actionQueue.push(this.executeSubOperationComplete);

        super.setActionQueue(actionQueue);
    }

    executeNoteCreate(context) {

        let note = CommonLibrary.getFieldValue(context, 'DescriptionNote', '', null, true);
        if (note) {
            //In order to handle note creation during the changeset action we need to keep a counter of the all the acitons for readlink purposes
            CommonLibrary.incrementChangeSetActionCounter(context);
            NoteLibrary.setNoteTypeTransactionFlag(context, TransactionNoteType.confirmation());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateDuringConfirmationCreate.action');
        }
        return Promise.resolve(true);
    }

    executeNoteUpdate(context) {
        let result = Promise.resolve(true);
        let note = CommonLibrary.getFieldValue(context, 'DescriptionNote', '', null, true);
        if (note) {
            NoteLibrary.setNoteTypeTransactionFlag(context, TransactionNoteType.confirmation());
            if (context.binding.LongText && !Array.isArray(context.binding.LongText)) { //A note already exists so, call the Update action
                result = context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateDuringConfirmationUpdate.action');
            } else {
                result = context.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateDuringConfirmationUpdate.action');
            }
        } else if (context.binding.LongText && !Array.isArray(context.binding.LongText)) { //A note exists, but it's now being removed
            NoteLibrary.setNoteTypeTransactionFlag(context, TransactionNoteType.confirmation());
            result = context.executeAction('/SAPAssetManager/Actions/Notes/Delete/NoteDeleteDuringConfirmationUpdate.action');
        }
        return result.then(function() {
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessageNoClose.action');
        });
    }

    /**
     * Execute the Confirmation Create action
     * @param {*} context - Calling context
     */
    executeConfirmationCreate(context) {

        return GenerateLocalConfirmationNum(context).then(confirmationNum => {
            context.getClientData().localConfirmationNum = confirmationNum;
            return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationCreate.action');
        });
    }

    /**
     * Execute the Confirmation Update action
     * @param {*} context
     */
    executeConfirmationUpdate(context) {
        return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationUpdate.action');
    }

    /**
     * Create a new ConfirmationOverviewRow
     * @param {*} context
     */
    createConfirmationOverviewRow(context) {
        return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationOverviewRowCreate.action');
    }

    /**
     * Capture the duration of the Confirmation
     * @param {*} context
     */
    executeCaptureDuration(context, instance) {
        let queryBuilder = new QueryBuilder();
        let postingDate = getDate(context);
        queryBuilder.addFilter(`PostingDate eq datetime'${postingDate}'`);
        queryBuilder.addExtra('top=1');
        let fetchRequest = new FetchRequest('ConfirmationOverviewRows', queryBuilder.build());
        // If the overview is not found, create a new one
        return fetchRequest.execute(context).then(result => {

            if (result === undefined || result.length === 0) {
                return instance.createConfirmationOverviewRow(context);
            } else {
                return Promise.resolve(true);
            }
        });
    }

    executeOperationComplete(context, instance) {

        if (instance.args.doCheckOperationComplete && instance.args.isFinalConfirmation && libMobile.isOperationStatusChangeable(context)) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderOperations(OrderId='${instance.args.WorkOrderId}',OperationNo='${instance.args.OperationId}')/OperationMobileStatus_Nav`, [], '').then(function(result) {
                if (result && result.length > 0) {
                    let mobStatus = result.getItem(0);
                    if (mobStatus.MobileStatus !== libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue())) {
                        return context.executeAction('/SAPAssetManager/Actions/MobileStatus/MobileStatusCompleteOperationDialog.action').then((diagResult) =>  {
                            if (diagResult.data === true) {
                                return instance.executeMobileStatusComplete(context, mobStatus);
                            } else {
                                return Promise.resolve(true);
                            }
                        });
                    }    
                }
                return Promise.resolve(true);
            });
        }
        return Promise.resolve(true);
    }       

    executeSubOperationComplete(context, instance) {

        if (instance.args.doCheckSubOperationComplete && instance.args.SubOperationId && instance.args.isFinalConfirmation && libMobile.isSubOperationStatusChangeable(context)) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderSubOperations(OrderId='${instance.args.WorkOrderId}',OperationNo='${instance.args.OperationId}',SubOperationNo='${instance.args.SubOperationId}')/SubOpMobileStatus_Nav`, [], '').then(function(result) {
                if (result && result.length > 0) {
                    let mobStatus = result.getItem(0);
                    if (mobStatus.MobileStatus !== libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue())) {
                        return context.executeAction('/SAPAssetManager/Actions/MobileStatus/MobileStatusCompleteSubOperationDialog.action').then((diagResult) =>  {
                            if (diagResult.data === true) {
                                return instance.executeMobileStatusComplete(context, mobStatus);
                            } else {
                                return Promise.resolve(true);
                            }
                        });
                    }    
                }
                return Promise.resolve(true);
            });
        }
        return Promise.resolve(true);
    }

    executeMobileStatusComplete(context, mobStatus) {
        context.getClientData().MobileStatusReadLink = mobStatus['@odata.readLink'];
        context.getClientData().MobileStatusObjectKey = mobStatus.ObjectKey;
        context.getClientData().MobileStatusObjectType = mobStatus.ObjectType;
        return context.executeAction('/SAPAssetManager/Actions/Confirmations/MobileStatusSetComplete.action');
    }
}
