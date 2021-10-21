/*
Triggered when a remote notification arrived that indicates there is data to be fetched.
https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application
*/
import Logger from '../Log/Logger';
import downloadAlert from './PushNotificationsAlertMessage';

export default function PushNotificationsContentAvailableEventHandler(clientAPI) {
    const appEventData = clientAPI.getAppEventData();
    clientAPI.setApplicationIconBadgeNumber(0);
    if (appEventData.applicationStage === 'Live' ) {
        downloadAlert(clientAPI, appEventData);
    } else {
        Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPushNotification.global').getValue() , 'Content Available Event Handler Called');
    }

}
