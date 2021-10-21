import { WorkOrderComponentsData as woCompData } from './WorkOrderComponentsData';

export default function SparePartsNumbers(context) {
    try {

        let sparePartsNumbers = [];

        let totalStockItems = woCompData.getWorkOrderComponentsCount(context, "L");
        let totalNonStockItems = woCompData.getWorkOrderComponentsCount(context, "N");

        return Promise.all([totalStockItems, totalNonStockItems]).then(function (resultsArray) {

            let itemCounts = [];
            let availCount =[2,1];
            let unavailCount=[4,2];

            itemCounts.push(resultsArray[0]);
            itemCounts.push(resultsArray[1]);

            sparePartsNumbers.push(itemCounts);
            sparePartsNumbers.push(availCount);
            sparePartsNumbers.push(unavailCount);

            return sparePartsNumbers;
        });

    } catch (error) {
        alert("SparePartsNumbers " + error);
    }
}
