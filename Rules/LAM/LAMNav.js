import Logger from '../Log/Logger';

export default function LAMNav(context) {
    let pageProxy = context.getPageProxy();
    let actionContext = pageProxy.getActionBinding();

    //Rebind the LAM data
    return context.read('/SAPAssetManager/Services/AssetManager.service', actionContext['@odata.readLink'], [], '$expand=LAMObjectDatum_Nav').then(LAM => {
        pageProxy.setActionBinding(LAM.getItem(0).LAMObjectDatum_Nav);
        return context.executeAction('/SAPAssetManager/Actions/LAM/LAMDetailsNav.action');
    }, error => {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryLAM.global').getValue(), error);
    });
}
