import libCommon from '../Common/Library/CommonLibrary';
import Constants from '../Common/Library/ConstantsLibrary';
import libNotifStatus from './MobileStatus/NotificationMobileStatusLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function NotificationUpdateNav(context) {
    let currentReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');
    let isLocal = libCommon.isCurrentReadLinkLocal(currentReadLink);
    let binding = context.getBindingObject();

    binding._MalfunctionStartDate = '';
    binding._MalfunctionStartTime = '';
    binding._MalfunctionEndDate = '';
    binding._MalfunctionEndTime = '';
    binding._MalfunctionStartSwitch = false;
    binding._MalfunctionEndSwitch = false;

    if (binding.MalfunctionStartDate) { //Set up malfunction start date and time if necessary
        binding._MalfunctionStartDate = new OffsetODataDate(context, binding.MalfunctionStartDate, binding.MalfunctionStartTime).date();
        binding._MalfunctionStartTime = binding._MalfunctionStartDate;
        binding._MalfunctionStartSwitch = true;
    }

    if (binding.MalfunctionEndDate) { //Set up malfunction end date and time if necessary
        binding._MalfunctionEndDate = new OffsetODataDate(context, binding.MalfunctionEndDate, binding.MalfunctionEndTime).date();
        binding._MalfunctionEndTime = binding._MalfunctionEndDate;
        binding._MalfunctionEndSwitch = true;
    }
    
    context.setActionBinding(binding);

    if (!isLocal) {
        return libNotifStatus.isNotificationComplete(context).then(status => {
            if (!status) {
                libCommon.setOnCreateUpdateFlag(context, Constants.updateFlag);
                return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationCreateUpdateNav.action');
            }
            return '';
        });
    }
    libCommon.setOnCreateUpdateFlag(context, Constants.updateFlag);
    return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationCreateUpdateNav.action');
}
