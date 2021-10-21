export default function MeasuringPointFDCDFilterListIsVisible(context) {
    if (context.getName() === 'Equipment') {
        let equipments = context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().Equipments;
        if (equipments && equipments.length > 0) {
            return true;
        }
        return false;
    }
    if (context.getName() === 'FuncLoc') {
        let FuncLocs = context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().FuncLocs;
        if (FuncLocs && FuncLocs.length > 0) {
           return true;
        }
        return false;
    }
}
