import { WorkOrderComponentsData as woCompData } from './WorkOrderComponentsData';

export default function WeeklyNonStockItemsCount(context) {

    try {
        let totalNonStockItems = woCompData.getWorkOrderComponentsCount(context, "N");
        let AvailNonStockItems = 0;
        let completionPercent = 0;

        return Promise.all([totalNonStockItems, AvailNonStockItems]).then(function (resultsArray) {
            let totalNonStockItms = resultsArray[0];
            let AvailNonStockItms = resultsArray[1];

            //alert("totalWorkOrders-" + totalWorkOrders + "-"+totalCompletedWorderOrders);

            if (totalNonStockItms !== null && totalNonStockItms !== 0 && totalNonStockItms !== "") {
                completionPercent = Math.round((AvailNonStockItms / totalNonStockItms) * 100);
            }
            
            var label = AvailNonStockItms + "/" + totalNonStockItms + " [" + completionPercent + "%]";

            return label;
        });

    } catch (error) {
        alert("WeeklyNonStockItemsCountemsCount" + error);
    }
}
