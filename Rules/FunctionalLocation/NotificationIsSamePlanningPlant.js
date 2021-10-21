import libCom from '../Common/Library/CommonLibrary';
import isNotificationCreateEnabled from '../UserAuthorizations/Notifications/EnableNotificationCreate';
export default function NotificationIsSamePlanningPlant(context) {
    return (context.binding.PlanningPlant === libCom.getAppParam(context, 'NOTIFICATION', 'PlanningPlant') && isNotificationCreateEnabled(context));
}
