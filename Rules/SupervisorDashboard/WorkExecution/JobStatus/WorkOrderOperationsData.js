import { SupervisorLibrary as libSup } from '../../SupervisorLibrary';
import FetchRequest from '../../../Common/Query/FetchRequest';
import QueryBuilder from '../../../Common/Query/QueryBuilder';
import { WorkOrderHeaderData as woHdrData } from './WorkOrderHeaderData';
import { WorkOrderOperationsData as woOPData } from './WorkOrderOperationsData';

export class WorkOrderOperationsData {

    static getWorkOrderOperationCount(context, status) {
        try {
            let currentWeekDates = libSup.getCurrentWeekDates();
            let orderOperationCounts = [];

            let Day1 = woOPData.getDayWiseWorkOrderOperationCount(context, status, currentWeekDates[0]);
            let Day2 = woOPData.getDayWiseWorkOrderOperationCount(context, status, currentWeekDates[1]);
            let Day3 = woOPData.getDayWiseWorkOrderOperationCount(context, status, currentWeekDates[2]);
            let Day4 = woOPData.getDayWiseWorkOrderOperationCount(context, status, currentWeekDates[3]);
            let Day5 = woOPData.getDayWiseWorkOrderOperationCount(context, status, currentWeekDates[4]);
            let Day6 = woOPData.getDayWiseWorkOrderOperationCount(context, status, currentWeekDates[5]);
            let Day7 = woOPData.getDayWiseWorkOrderOperationCount(context, status, currentWeekDates[6]);

            return Promise.all([Day1, Day2, Day3, Day4, Day5, Day6, Day7]).then(function (resultsArray) {
                try {

                    if (resultsArray === undefined || resultsArray.length === undefined || resultsArray.length === 0) {
                        return []; 
                    }

                    for (var i = 0; i < resultsArray.length; i++) {
                        if (resultsArray[i] === undefined && status=="RECEIVED") {
                            orderOperationCounts.push(6); //Adding dummy data for testing, change it to 0 later
                        } else if (resultsArray[i] === undefined && status=="COMPLETED") {
                            orderOperationCounts.push(2); //Adding dummy data for testing, change it to 0 later
                        } else {
                            orderOperationCounts.push(resultsArray[i]);
                        }
                    }
                    return orderOperationCounts;

                } catch (error) {
                    alert("getWorkOrderOperationCount promise-" + error)
                }
            });
        } catch (error) {
            alert("getWorkOrderOperationCount-" + error)
        }
    }

    static getDayWiseWorkOrderOperationCount(context, status, weekDay) {
        try {
            return woHdrData.getOrderIDAndCreationDate(context, status).then(orderData => {
                try {
                    if (orderData) {
                        let orderIds = orderData[weekDay];
                        let orderIdString="";
                        let queryString = "";
                        let queryBuilder = new QueryBuilder();
                        let filters = [];

                        if (orderIds && orderIds.length > 0) {

                            for (var i = 0; i < orderIds.length; i++) {
                                if (i == (orderIds.length - 1)) {
                                    orderIdString = orderIdString + " OrderId eq '" + orderIds[i] + "'";
                                } else {
                                    orderIdString = orderIdString + " OrderId eq '" + orderIds[i] + "' or ";
                                }
                            }

                            if (orderIdString !== null && orderIdString !== "") {
                                filters.push(orderIdString);
                            }

                            let expand = "OperationMobileStatus_Nav";
                            filters.push("OperationMobileStatus_Nav/MobileStatus eq '" + status + "'");
                            queryBuilder.addExpandStatement(expand);

                            if (filters.length > 0) {
                                queryBuilder.addAllFilters(filters);
                                queryString = queryBuilder.build();
                            }

                            let fetchRequestAllData = new FetchRequest('MyWorkOrderOperations', queryString);
                            return fetchRequestAllData.count(context).then(count => {
                                return count;
                            });
                        }
                    }
                } catch (error) {
                    alert("getDayWiseWorkOrderOperationCount return -" + error);
                }
            });
        } catch (error) {
            alert("getDayWiseWorkOrderOperationCount-" + error);
        }
    }
}


