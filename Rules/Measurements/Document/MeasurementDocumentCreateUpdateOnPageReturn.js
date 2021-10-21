import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

/**
* Housekeeping for the variables set inside OnLoaded rule
* @param {IClientAPI} context
*/
export default function MeasurementDocumentCreateUpdateOnPageReturn(context) {
    libCom.setStateVariable(context, 'measurementDocumentCreateUpdateOnPageReturn', false);
    let equipId = context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().Equipment;
    let flocId = context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().FuncLoc;
    let segmentValue = context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().Segment;
    let points = context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().Points;
    var Filters= [];
    if (!libVal.evalIsEmpty(equipId)) {
        Filters.push(
        {
            'FilterType': 'Property',
            'FilterProperty': 'EquipId',
            'FilterValue': equipId,
        });
    }
    if (!libVal.evalIsEmpty(flocId)) {
        Filters.push(
        {
            'FilterType': 'Property',
            'FilterProperty': 'FuncLocIdIntern',
            'FilterValue': flocId,
        });
    }
    
    if (!libVal.evalIsEmpty(segmentValue) && segmentValue.length > 0) {
        let controls = [];

        let skipSegment = segmentValue.filter(segment => segment === 'Skip');
        let emptySegment = segmentValue.filter(segment => segment === 'Empty');
        let errorSegment = segmentValue.filter(segment => segment === 'Error');

        if (skipSegment.length > 0) {
            controls.push(
                {
                    'ControlName': 'SkipValue',
                    'ControlValueExits': true,
                    'ControlType': 'Control.Type.FormCell.Switch',
                }
            );
        }
        
        if (emptySegment.length > 0) {
            controls.push(
                {
                    'ControlName': 'ReadingSim',
                    'ControlType': 'Control.Type.FormCell.SimpleProperty',
                    'ControlValueExits' : false,
                    'RequiredFieldsProperty' : 'RequiredFields',
                }
            );

            controls.push(
                {
                    'ControlName': 'ValuationCodeLstPkr',
                    'ControlType': 'Control.Type.FormCell.ListPicker',
                    'ControlValueExits' : false,
                    'RequiredFieldsProperty' : 'RequiredFields',
                }
            );
        }

        if (errorSegment.length > 0 && !libVal.evalIsEmpty(points)) {
            for (let index in points) {
                Filters.push(
                {
                    'FilterType': 'ValidationError',
                    'FilterProperty': 'Point',
                    'FilterValue': points[index],
                });
            }
        } else {
            Filters.push(
                {
                    'FilterType': 'ValidationError',
                    'FilterProperty': 'Point',
                    'FilterValue': '',
                });
        }

        Filters.push(
            {
                'FilterType': 'Control',
                'Controls': controls,
            });
        
    }
    context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getControl('FormCellContainer')._control.applyFilter(Filters);
}
