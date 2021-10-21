import { WorkOrderComponentsData as woCompData } from './WorkOrderComponentsData';

export default function WeeklyStockItemsCount(context) {

    try {
        let totalStockItems = woCompData.getWorkOrderComponentsCount(context, "L");
        let AvailStockItems = 0
        let completionPercent = 0;

        return Promise.all([totalStockItems, AvailStockItems]).then(function (resultsArray) {
            let totalStockItms = resultsArray[0];
            let AvailStockItms = resultsArray[1];

            //alert("stock items-" + AvailStockItms + "-"+totalStockItms);

            if (totalStockItms !== null && totalStockItms !== 0 && totalStockItms !== "") {
                completionPercent = Math.round((AvailStockItms / totalStockItms) * 100);
            }

            var label = AvailStockItms + "/" + totalStockItms + " [" + completionPercent + "%]";

            return label;
        });

    } catch (error) {
        alert("WeeklyStockItemsCount" + error);
    }
}
