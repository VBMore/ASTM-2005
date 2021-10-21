import Validate from '../Common/Library/ValidationLibrary';

/**
 * This is a simple rule to get around a race condition
 * @param {PageProxy} context 
 */
export default function MobileStatusSetCompleteObjectKey(context) {

    let mobileStatusObjectKey = context.getClientData().MobileStatusObjectKey;
    if (Validate.evalIsEmpty(mobileStatusObjectKey)) {
        // Retrieve the readlink from the previous page
        // This is because Client data is not read from the same context the action was executed on
        mobileStatusObjectKey = context.evaluateTargetPath('#Page:-Previous/#ClientData/#Property:MobileStatusObjectKey');
    }
    return mobileStatusObjectKey;
}
