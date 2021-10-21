import { WorkOrderOperationsData as woOPData } from './WorkOrderOperationsData';

export default function WorkOrderOperationsNumbers(context) {

        try {

        let operationCountsMain = [];

        return woOPData.getWorkOrderOperationCount(context, "RECEIVED").then(resultAllData => {
           
            if (resultAllData === undefined || resultAllData.length === undefined || resultAllData.length === 0) {
                // Return empty array if result is undefined or not an array
                return [];
            }
            operationCountsMain.push(resultAllData);

            return woOPData.getWorkOrderOperationCount(context, "COMPLETED").then(result => {
               
                if (result === undefined || result.length === undefined || result.length === 0) {
                    // Return empty array if result is undefined or not an array
                    return [];
                }
                operationCountsMain.push(result);

                return operationCountsMain;
            });
        });
S
    } catch (error) {
        alert("WorkOrderOperationsNumbers " + error);
    }
}
