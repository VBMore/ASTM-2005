import libCommon from '../../Common/Library/CommonLibrary';

function roundsQueryOptions(context) {
    let MeasuringPointData = {};

    /* Query options are in the following order:
     * 1. Expand
     *    a. Equipment Measuring Points
     *    b. FLOC Measuring Points
     *
     *    c. Operation Equipment Measuring Points
     *    d. Operation FLOC Measuring Points
     *
     *    e. Sub Operation Equipment Measuring Points
     *    f. Sub Operation FLOC Measuring Points
     *  2. Select
     *    a. Equipment Measuring Points - Point Number
     *    b. FLOC Measuring Points - Point Number
     *
     *    c. Operation Equipment Measuring Points - Point Number
     *    d. Operation FLOC Measuring Points - Point Number
     *
     *    e. Sub Operation Equipment Measuring Points - Point Number
     *    f. Sub Operation FLOC Measuring Points - Point Number
     *
     *    g. Operation ObjectKey
     *    h. Sub-Operation ObjectKey
     *
     *  Equipment/FLOC associated Work Order and Operation is stored on Client Data
     */
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [],
        '$expand=Equipment/MeasuringPoints,FunctionalLocation/MeasuringPoints,' +
        'Operations/EquipmentOperation/MeasuringPoints,Operations/FunctionalLocationOperation/MeasuringPoints,' +
        'Operations/SubOperations/EquipmentSubOperation/MeasuringPoints,Operations/SubOperations/FunctionalLocationSubOperation/MeasuringPoints&' +
        '$select=Equipment/EquipId,Equipment/MeasuringPoints/Point,FunctionalLocation/FuncLocIdIntern,FunctionalLocation/MeasuringPoints/Point,' +
        'Operations/EquipmentOperation/MeasuringPoints/Point,Operations/FunctionalLocationOperation/MeasuringPoints/Point,' +
        'Operations/SubOperations/EquipmentSubOperation/MeasuringPoints/Point,Operations/SubOperations/FunctionalLocationSubOperation/MeasuringPoints/Point,' +
        'Operations/ObjectKey,Operations/SubOperations/ObjectKey,Operations/OperationNo,Operations/SubOperations/OperationNo,Operations/OperationShortText,Operations/SubOperations/OperationShortText'
        ).then(function(result) {
            if (result && result.length > 0) {
                let out = [];
                let results = result.getItem(0);
                var tempOperation;

                // Top-level Equipment?
                if (results.Equipment) {
                    for (let pt in results.Equipment.MeasuringPoints) {
                        out.push(`Point eq '${results.Equipment.MeasuringPoints[pt].Point}'`);
                        MeasuringPointData[results.Equipment.MeasuringPoints[pt].Point] = {'OrderId' : context.binding.ObjectKey, 'Operation': ''};
                    }
                }
                // Top-level FLOC?
                if (results.FunctionalLocation) {
                    for (let pt in results.FunctionalLocation.MeasuringPoints) {
                        out.push(`Point eq '${results.FunctionalLocation.MeasuringPoints[pt].Point}'`);
                        MeasuringPointData[results.FunctionalLocation.MeasuringPoints[pt].Point] = {'OrderId' : context.binding.ObjectKey, 'Operation': ''};
                    }
                }
                // Operations
                for (let op in results.Operations) {
                    // Operation Equipment?
                    if (results.Operations[op].EquipmentOperation) {
                        for (let pt in results.Operations[op].EquipmentOperation.MeasuringPoints) {
                            out.push(`Point eq '${results.Operations[op].EquipmentOperation.MeasuringPoints[pt].Point}'`);
                            tempOperation = results.Operations[op].OperationNo;
                            let item = results.Operations[op].EquipmentOperation.MeasuringPoints[pt].Point;
                            if (MeasuringPointData.hasOwnProperty(item) && MeasuringPointData[item].OperationNo) {  //Multiple operations use this point
                                tempOperation = '*';
                            }
                            MeasuringPointData[results.Operations[op].EquipmentOperation.MeasuringPoints[pt].Point] = {'OrderId' : context.binding.ObjectKey, 'Operation': results.Operations[op].ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': results.Operations[op].OperationShortText};
                        }
                    }
                    // Operation FLOC?
                    if (results.Operations[op].FunctionalLocationOperation) {
                        for (let pt in results.Operations[op].FunctionalLocationOperation.MeasuringPoints) {
                            out.push(`Point eq '${results.Operations[op].FunctionalLocationOperation.MeasuringPoints[pt].Point}'`);
                            tempOperation = results.Operations[op].OperationNo;
                            let item = results.Operations[op].FunctionalLocationOperation.MeasuringPoints[pt].Point;
                            if (MeasuringPointData.hasOwnProperty(item) && MeasuringPointData[item].OperationNo) {  //Multiple operations use this point
                                tempOperation = '*';
                            }
                            MeasuringPointData[results.Operations[op].FunctionalLocationOperation.MeasuringPoints[pt].Point] = {'OrderId' : context.binding.ObjectKey, 'Operation': results.Operations[op].ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': results.Operations[op].OperationShortText};
                        }
                    }
                    // Suboperations
                    for (let sop in results.Operations[op].SubOperations) {
                        // Suboperation Equipment?
                        if (results.Operations[op].SubOperations[sop].EquipmentOperation) {
                            for (let pt in results.Operations[op].SubOperations[sop].EquipmentSubOperation.MeasuringPoints) {
                                out.push(`Point eq '${results.Operations[op].SubOperations[sop].EquipmentSubOperation.MeasuringPoints[pt].Point}'`);
                                tempOperation = results.Operations[op].SubOperations[sop].OperationNo;
                                let item = results.Operations[op].SubOperations[sop].EquipmentSubOperation.MeasuringPoints[pt].Point;
                                if (MeasuringPointData.hasOwnProperty(item) && MeasuringPointData[item].OperationNo) {  //Multiple operations use this point
                                    tempOperation = '*';
                                }
                                MeasuringPointData[results.Operations[op].SubOperations[sop].EquipmentSubOperation.MeasuringPoints[pt].Point] = {'OrderId' : context.binding.ObjectKey, 'Operation': results.Operations[op].SubOperations[sop].ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': results.Operations[op].SubOperations[sop].OperationShortText};
                            }
                        }
                        // Suboperation FLOC?
                        if (results.Operations[op].SubOperations[sop].FunctionalLocationOperation) {
                            for (let pt in results.Operations[op].SubOperations[sop].FunctionalLocationSubOperation.MeasuringPoints) {
                                out.push(`Point eq '${results.Operations[op].SubOperations[sop].FunctionalLocationSubOperation.MeasuringPoints[pt].Point}'`);
                                tempOperation = results.Operations[op].SubOperations[sop].OperationNo;
                                let item = results.Operations[op].SubOperations[sop].FunctionalLocationSubOperation.MeasuringPoints[pt].Point;
                                if (MeasuringPointData.hasOwnProperty(item) && MeasuringPointData[item].OperationNo) {  //Multiple operations use this point
                                    tempOperation = '*';
                                }
                                MeasuringPointData[results.Operations[op].SubOperations[sop].FunctionalLocationSubOperation.MeasuringPoints[pt].Point] = {'OrderId' : context.binding.ObjectKey, 'Operation': results.Operations[op].SubOperations[sop].ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': results.Operations[op].SubOperations[sop].OperationShortText};
                            }
                        }
                    }
                }
                if (out && out.length > 0) {
                    context.getClientData().MeasuringPointData = MeasuringPointData;
                    return '$filter=' + out.join(' or ') + '&$orderby=FuncLocIdIntern,EquipId,SortField';
                } else {
                    return '';
                }
            }  
            return '';
        });
}
export default function MeasuringPointFDCEntitySet(context) {
    let pageProxy = context.getPageProxy();
    if (libCommon.isDefined(pageProxy.binding)) {
        let odataType = pageProxy.binding['@odata.type'];
        let operation = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue();
        let equipment = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue();
        let floc = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/FunctionalLocation.global').getValue();
        let workorder = '#sap_mobile.MyWorkOrderHeader';
        switch (odataType) {
            case workorder:
                return roundsQueryOptions(pageProxy);
            case operation:
                return "$filter=(PRTCategory eq 'P')&$expand=PRTPoint/MeasurementDocs,PRTPoint/MeasurementDocs/MeasuringPoint,WOOperation_Nav&$orderby=PRTPoint/SortField&$select=PRTPoint/Point,PRTPoint/PointDesc,PRTPoint/UoM,PRTPoint/RangeUOM," +
                    'PRTPoint/CounterOverflow,PRTPoint/IsCounter,PRTPoint/CodeGroup,PRTPoint/CatalogType,PRTPoint/IsReverse,PRTPoint/IsLowerRange,PRTPoint/IsLowerRange,PRTPoint/IsUpperRange,PRTPoint/IsCodeSufficient,PRTPoint/LowerRange,PRTPoint/UpperRange,PRTPoint/Decimal,PRTPoint/CharName,PRTPoint/IsCounterOverflow,PRTPoint/LowerRange,PRTPoint/UpperRange,'+
                    'PRTPoint/MeasurementDocs/ReadingDate,PRTPoint/MeasurementDocs/ReadingTime,PRTPoint/MeasurementDocs/CodeGroup,PRTPoint/MeasurementDocs/ValuationCode,PRTPoint/MeasurementDocs/CodeShortText,PRTPoint/MeasurementDocs/ReadingValue,PRTPoint/MeasurementDocs/IsCounterReading,PRTPoint/MeasurementDocs/IsCounterReading,PRTPoint/MeasurementDocs/CounterReadingDifference,PRTPoint/MeasurementDocs/MeasurementDocNum,PRTPoint/MeasurementDocs/MeasuringPoint/CharName,PRTPoint/MeasurementDocs/MeasuringPoint/IsCounter' +
                    ',WOOperation_Nav/OperationShortText,WOOperation_Nav/OperationNo';
            case equipment:
                return '$orderby=SortField';
            case floc:
                return '$orderby=SortField';
            default:
                return '';
        }
    }
}
