import libCommon from '../../Common/Library/CommonLibrary';

export default function NotificationCreateChangeSetNav(context, bindingParams) {
    libCommon.setOnChangesetFlag(context, true);
    libCommon.resetChangeSetActionCounter(context);
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    var assnType = libCommon.getNotificationAssignmentType(context);
    if (assnType !== '1' && assnType !== '5') {
        assnType = 'Default';
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], "$select=PriorityType&$filter=NotifType eq '" + libCommon.getAppParam(context, 'NOTIFICATION', 'NotificationType') + "'").then(function(data) {
        let binding = {'NotifPriority' : {}, 'PriorityType' : data.getItem(0).PriorityType};
        if (bindingParams) {
            Object.assign(binding, bindingParams);
        }
        if (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
            binding.HeaderFunctionLocation = context.binding.FuncLocIdIntern;
        } else if (context.binding['@odata.type'] === '#sap_mobile.MyEquipment') {
            binding.HeaderEquipment = context.binding.EquipId;
            binding.HeaderFunctionLocation = context.binding.FuncLocIdIntern;
        }
        context.setActionBinding(binding);
        
        if (assnType === '1') {
            return context.executeAction('/SAPAssetManager/Actions/Notifications/ChangeSet/NotificationCreateChangesetAssn1.action');
        } else if (assnType === '5') {
            return context.executeAction('/SAPAssetManager/Actions/Notifications/ChangeSet/NotificationCreateChangesetAssn5.action');
        }
        
        return context.executeAction('/SAPAssetManager/Actions/Notifications/ChangeSet/NotificationCreateChangesetAssnDefault.action');
    });
}
