
import { WorkOrderHeaderData as woHdrData } from './WorkOrderHeaderData';

export default function WeeklyWorkOrderCountBasedOnFilter(context) {

    try {
        let totalCount = woHdrData.getWorkOrderDataCount(context,"RECEIVED");
        let totalCountWithStatus = woHdrData.getWorkOrderDataCount(context,"COMPLETED");
        let completionPercent = 0;

        return Promise.all([totalCount, totalCountWithStatus]).then(function (resultsArray) {
            let totalWorkOrders = resultsArray[0];
            let totalCompletedWorderOrders = resultsArray[1];

            //alert("totalWorkOrders-" + totalWorkOrders + "-"+totalCompletedWorderOrders);

            if (totalWorkOrders !== null && totalWorkOrders !== 0 && totalWorkOrders !== "") {
                completionPercent = Math.round((totalCompletedWorderOrders / totalWorkOrders) * 100);
            }

            var label = totalCompletedWorderOrders + "/" + totalWorkOrders + " [" + completionPercent + "%]";

            return label;
        });

    } catch (error) {
        alert("Weekly Work Order Error" + error);
    }
}