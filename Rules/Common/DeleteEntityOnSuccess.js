export default function DeleteEntityOnSuccess(context) {
    let fromErrorArchive = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive; //save this here before the context changes

    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessage.action').then(() => {
        if (!fromErrorArchive) {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        } else {
            return Promise.resolve(true);
        }
    });
}
