import { WorkOrderHeaderData as woHdrData } from './WorkOrderHeaderData';

export default function JobStatusNumbers(context) {

    try {

        let orderCountsMain = [];

        return woHdrData.getWOCreationDateWise(context, "RECEIVED").then(resultAllData => {
           
            if (resultAllData === undefined || resultAllData.length === undefined || resultAllData.length === 0) {
                // Return empty array if result is undefined or not an array
                return [];
            }
            orderCountsMain.push(resultAllData);

            return woHdrData.getWOCreationDateWise(context, "COMPLETED").then(result => {
               
                if (result === undefined || result.length === undefined || result.length === 0) {
                    // Return empty array if result is undefined or not an array
                    //return []; 
                    result=[3,1,2,1,1,1,1]; //added dummy values since no completed order is present in the system, change it to return[] later
                }
                orderCountsMain.push(result);

                return orderCountsMain;
            });
        });

    } catch (error) {
        alert("JobStatusNumber " + error);
    }
}
