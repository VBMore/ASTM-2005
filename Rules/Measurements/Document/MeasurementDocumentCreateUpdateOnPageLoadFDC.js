import libPoint from '../MeasuringPointLibrary';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import libCommon from '../../Common/Library/CommonLibrary';

export default function MeasurementDocumentCreateUpdateOnPageLoadFDC(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    hideCancel(pageClientAPI);

    libCommon.setStateVariable(pageClientAPI, 'ReadingType','MULTIPLE');

    return libPoint.measurementDocumentCreateUpdateOnPageLoad(pageClientAPI);
}
