import libNotif from '../Notifications/NotificationLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import notifCreateChangeSetNav from '../Notifications/CreateUpdate/NotificationCreateChangeSetNav';

export default function WorkOrderNotificationCreateNav(context) {

    //set the follow up flag
    libNotif.setAddFromJobFlag(context, true);

    let bindingObject = {
        '@odata.readLink': context.binding['@odata.readLink'],
        OrderId: context.binding.OrderId,
        HeaderEquipment: context.binding.HeaderEquipment,
        HeaderFunctionLocation: context.binding.HeaderFunctionLocation,
    };

    // Return the result of the change set nav
    libCommon.setStateVariable(context, 'LocalId', ''); //Reset the localid before creating a new notification
    return notifCreateChangeSetNav(context, bindingObject).then(() => {
        //Check if a new notification was added.  if so, update the work order header with NotificationNumber
        let localId = libCommon.getStateVariable(context, 'LocalId');
        if (localId) {
            //Read the new notification to make sure it exists
            return context.read('/SAPAssetManager/Services/AssetManager.service', "MyNotificationHeaders('" + localId + "')", ['NotificationNumber'], '').then(function(notif) {
                if (notif && notif.length > 0) {
                    let binding = context.binding;
                    if (!binding.NotificationNumber) { //Skip if we already have a notification linked to this WO
                        binding.LocalNotificationId = localId;
                        binding.NotificationNumber = localId;
                        binding.OrderHeaderReadLink = "MyWorkOrderHeaders('" + binding.OrderId + "')";
                        binding.LocalNotificationReadLink = "MyNotificationHeaders('" + localId + "')";
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderUpdateNotificationNumber.action');
                    }
                }
                return Promise.resolve(true);
            });
        }
        return Promise.resolve(true);
    });
}
