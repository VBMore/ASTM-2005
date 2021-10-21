{
	"MainPage": "/SAPAssetManager/Pages/SupervisorDashboard/SupervisorDashboard.page",
	"OnLaunch": [
		"/SAPAssetManager/Actions/OData/InitializeOfflineOData.action",
		"/SAPAssetManager/Rules/Log/InitializeLogger.js",
		"/SAPAssetManager/Rules/Sync/InitializeSyncState.js"
	],
	"OnWillUpdate": "/SAPAssetManager/Rules/ApplicationEvents/ApplicationOnWillUpdate.js",
	"OnDidUpdate": "/SAPAssetManager/Rules/ApplicationEvents/ApplicationOnDidUpdate.js",
	"OnReceiveForegroundNotification": "/SAPAssetManager/Rules/PushNotifications/PushNotificationsForegroundNotificationEventHandler.js",
	"OnReceiveFetchCompletion": "/SAPAssetManager/Rules/PushNotifications/PushNotificationsContentAvailableEventHandler.js",
	"OnReceiveNotificationResponse": "/SAPAssetManager/Rules/PushNotifications/PushNotificationsReceiveNotificationResponseEventHandler.js",
	"Styles": "/SAPAssetManager/Styles/Styles.css",
	"SDKStyles": {
		"ios": "/SAPAssetManager/Styles/SDKStyles.nss",
		"android": "/SAPAssetManager/Styles/Styles.json"
	},
	"Version": "1",
	"Localization": "/SAPAssetManager/i18n/i18n.properties",
	"_Name": "SAPAssetManager"
}