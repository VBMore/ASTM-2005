import libCommon from '../../Common/Library/CommonLibrary';

export default function MeasurementDocumentCreateForChangeSetSkipCheck(context) {
    let skip = libCommon.getControlProxy(context, 'SkipValue').getValue();
    //let visible = libCommon.getControlProxy(context, 'SkipValue').visible;

    let actionArray = [];
    //if (!skip && visible) {
    if (!skip) {
        actionArray.push('/SAPAssetManager/Actions/Measurements/MeasurementDocumentCreateForChangeSet.action');
    }
    return actionArray;
}
