import libCommon from '../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWo } from './WorkOrderLibrary';

export default function FollowUpWorkOrderCreateNav(clientAPI) {
    //Set the global TransactionType variable to CREATE
    libCommon.setOnCreateUpdateFlag(clientAPI, 'CREATE');

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(clientAPI, true);
    libCommon.setOnWOChangesetFlag(clientAPI, true);
    libCommon.resetChangeSetActionCounter(clientAPI);

    libCommon.removeStateVariable(clientAPI, 'WODefaultPlanningPlant');
    libCommon.removeStateVariable(clientAPI, 'WODefaultWorkCenterPlant');
    libCommon.removeStateVariable(clientAPI, 'WODefaultMainWorkCenter');

    //set the follow up flag
    libWo.setFollowUpFlag(clientAPI, true);

    return libCommon.navigateOnRead(clientAPI, '/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderCreateChangeset.action');
}
