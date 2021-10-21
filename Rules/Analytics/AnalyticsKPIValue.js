import Logger from '../Log/Logger';
import libCom from '../Common/Library/CommonLibrary';
import libPoint from '../Measurements/MeasuringPointLibrary';
import prevReadingQuery from '../Measurements/Points/MeasurementDocumentPreviousReadingQuery';

export default function AnalyticsKPIValue(clientAPI) {
    let clientData = clientAPI.getClientData();
    let context = clientData.context;
    if (context && context.binding) {
        let obj = context.binding;

        if (obj['@odata.type'] === '#sap_mobile.MeasuringPoint') {
            return libPoint.getLatestNonLocalReading(clientAPI, obj, prevReadingQuery()).then( (previousReading) => {
                if (previousReading && previousReading.length > 0) {
                    let previousReadingObj = previousReading.getItem(0);
                    if (previousReadingObj.ValuationCode) {
                        return libPoint.getValuationAndCodeDescription(clientAPI, previousReadingObj.ValuationCode, obj.CodeGroup, obj.CatalogType);
                    } else {
                        let value = previousReadingObj.ReadingValue;
                        if (value) {
                            let floatValue = parseFloat(libCom.convertSapStringToNumber(value));
                            if (floatValue) {
                                return floatValue.toFixed((floatValue % 1 === 0) ? 0 : 2);
                            }
                            Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryAnalytics.global').getValue() , 'AnalyticsKPIValue unable to parse float');
                            return value;
                        }
                    }
                }
                return '-'; 
            });
        }
    }
    return clientData.value;
}
