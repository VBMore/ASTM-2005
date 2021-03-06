
export default function MeasuringPointFDCFilterOnChangeValue(context) {
    if (context.getName() === 'Equipment') {
        if (context.getValue().length > 0) {
            context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().Equipment = context.getValue()[0].ReturnValue;
        } else {
            context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().Equipment = '';
        }
    }
    if (context.getName() === 'FuncLoc') {
        if (context.getValue().length > 0) {
            context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().FuncLoc = context.getValue()[0].ReturnValue;
        } else {
            context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().FuncLoc = '';
        }
    }
    if (context.getName() === 'FilterSeg') {
        let values = [];
        let listPicker = context.getValue();
        for (let i=0 ; i<context.getValue().length ; i++) {
            values.push(listPicker[i].ReturnValue);
        }
        context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().Segment = values;  
    }
}
