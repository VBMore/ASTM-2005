import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function MeasurementDocumentsCreateChangeSet(pageProxy) {
    libCommon.setOnChangesetFlag(pageProxy, true);
    libCommon.resetChangeSetActionCounter(pageProxy);
    libCommon.setStateVariable(pageProxy, 'TransactionType', 'CREATE');
    let extension = pageProxy.getControl('FormCellContainer')._control;
    pageProxy.getClientData().Points = [];
    pageProxy.getClientData().Equipment = '';
    pageProxy.getClientData().FuncLoc = '';
    pageProxy.getClientData().Segment = ['Error'];
    extension.executeChangeSet('/SAPAssetManager/Actions/Measurements/MeasurementDocumentsCreateChangeSet.action').then(() => {
        let previousPage = pageProxy.evaluateTargetPathForAPI('#Page:-Previous');
        // Filter should only be pushed if we are taking Reading from Work Order Details page
        if (!libVal.evalIsEmpty(pageProxy.getClientData().Points) && libCommon.getPageName(previousPage) === 'WorkOrderDetailsPage') {
            var Filters = [];

            var points = pageProxy.getClientData().Points;
            for (let index in points) {
                Filters.push(
                {
                    'FilterType': 'ValidationError',
                    'FilterProperty': 'Point',
                    'FilterValue': points[index],
                });
            }
            //Pass in an empty controls filter to FDC in order to satisfy the OR clause
            Filters.push(
                {
                    'FilterType': 'Control',
                    'Controls': [],
                });

            pageProxy.getControl('FormCellContainer')._control.applyFilter(Filters);
        }
        return true;
    });
}
