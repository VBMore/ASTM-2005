import libCommon from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import {SubOperationControlLibrary as libSubOpControl} from '../../../SubOperations/SubOperationLibrary';
import Logger from '../../../Log/Logger';

export default function SubOperationCreateUpdateWorkorderChanged(control) {
    try {
        let formCellContainer = control.getPageProxy().getControl('FormCellContainer');
        if (!libVal.evalIsEmpty(formCellContainer)) {
            let WorkOrderLstPkrValue = libCommon.getListPickerValue(formCellContainer.getControl('WorkOrderLstPkr').getValue());
            let OperationLstPkrControl = formCellContainer.getControl('OperationLstPkr');
            var OperationSpecifier = OperationLstPkrControl.getTargetSpecifier();
            let specifierUpdated = false;

            if (!libVal.evalIsEmpty(WorkOrderLstPkrValue)) {
                OperationSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
                OperationSpecifier.setEntitySet(WorkOrderLstPkrValue + '/Operations');
                OperationSpecifier.setDisplayValue('{{#Property:OperationNo}} - {{#Property:OperationShortText}}');
                OperationSpecifier.setReturnValue('{@odata.readLink}');
                OperationSpecifier.setQueryOptions('$orderby=OperationNo');
                OperationLstPkrControl.setEditable(true);
                specifierUpdated = true;
            } else {
                OperationLstPkrControl.setEditable(false);
                OperationLstPkrControl.setValue('');
            }
            let params = {};
            let pageProxy = control.getPageProxy();

            params.funcLocControl = formCellContainer.getControl('FunctionalLocationLstPkr');
            params.equipmentControl = formCellContainer.getControl('EquipmentLstPkr');
            params.descriptionControl = formCellContainer.getControl('DescriptionNote');
            params.equipValue = '';
            params.flocValue = '';
            params.descriptionValue = '';
            params.planningPlant = '';
            params.enable = false;
            params.pageProxy = pageProxy;

            if (WorkOrderLstPkrValue) {
                return control.read('/SAPAssetManager/Services/AssetManager.service', WorkOrderLstPkrValue, ['OrderType', 'PlanningPlant'], '').then(result => {
                    if (result && result.length > 0) {
                        let woRow = result.getItem(0);
                        params.planningPlant = woRow.PlanningPlant;
                        return control.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=OrderType eq '${woRow.OrderType}' and PlanningPlant eq '${woRow.PlanningPlant}'`).then(function(myOrderTypes) {
                            if (myOrderTypes && myOrderTypes.length > 0) {
                                let record = myOrderTypes.getItem(0);
                                params.enable = (record.ObjectListAssignment === '');
                            }
                            return libSubOpControl.updateEquipFuncLocAfterWorkOrderChange(params).then(() => {
                                if (specifierUpdated) {
                                    return OperationLstPkrControl.setTargetSpecifier(OperationSpecifier);
                                }
                                return Promise.Resolve(true);
                            });
                        });
                    }
                    return libSubOpControl.updateEquipFuncLocAfterWorkOrderChange(params).then(() => {
                        if (specifierUpdated) {
                            return OperationLstPkrControl.setTargetSpecifier(OperationSpecifier);
                        }
                        return Promise.Resolve(true);
                    });
                });
            }
            return libSubOpControl.updateEquipFuncLocAfterWorkOrderChange(params).then(() => {
                if (specifierUpdated) {
                    return OperationLstPkrControl.setTargetSpecifier(OperationSpecifier);
                }
                return Promise.Resolve(true);
            });
        }
    } catch (err) {		
        /**Implementing our Logger class*/		 
        Logger.error(control.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), `SubOperationCreateUpdateWorkorderChanged Error: ${err}`);
    }
    return Promise.resolve(false);
}
