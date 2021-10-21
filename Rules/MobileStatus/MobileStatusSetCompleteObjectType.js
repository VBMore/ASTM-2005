import Validate from '../Common/Library/ValidationLibrary';

/**
 * This is a simple rule to get around a race condition
 * @param {PageProxy} context 
 */
export default function MobileStatusSetCompleteObjectType(context) {

    let mobileStatusObjectType = context.getClientData().MobileStatusObjectType;
    if (Validate.evalIsEmpty(mobileStatusObjectType)) {
        // Retrieve the readlink from the previous page
        // This is because Client data is not read from the same context the action was executed on
        mobileStatusObjectType = context.evaluateTargetPath('#Page:-Previous/#ClientData/#Property:MobileStatusObjectType');
    }
    return mobileStatusObjectType;
}
