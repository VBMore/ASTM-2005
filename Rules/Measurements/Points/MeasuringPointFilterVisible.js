import libCommon from '../../Common/Library/CommonLibrary';

export default function MeasuringPointFilterVisible(context) {
    try {
        let previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
        if (libCommon.getPageName(previousPage) === 'WorkOrderDetailsPage') {
            return true;
        }
    } catch (exception) {
        /**Implementing our Logger class*/
        return false;
    }
}
