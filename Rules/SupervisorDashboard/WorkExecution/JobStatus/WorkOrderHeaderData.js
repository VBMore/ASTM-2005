import { SupervisorLibrary as libSup } from '../../SupervisorLibrary';
import FetchRequest from '../../../Common/Query/FetchRequest';
import WorkOrderHeaderQueries from './WorkOrderHeaderQueries';
import { WorkOrderHeaderData as woHdrData } from './WorkOrderHeaderData';

export class WorkOrderHeaderData {

    //Get work order header count based on filters
    static getWorkOrderDataCount(context, status) {
        let workOrderCount = 0;
        try {
            let plant = libSup.getPlant(context);
            let mainWorkCenter = libSup.getMainWorkCenter(context);
            let fromDate = libSup.getFromDate(context);
            let toDate = libSup.getToDate(context);

            let workOrderHeaderQueries = new WorkOrderHeaderQueries(plant, mainWorkCenter, fromDate, toDate);

            let queryString = workOrderHeaderQueries.getWOHeaderDataQuery(status);

            let fetchRequestAllData = new FetchRequest('MyWorkOrderHeaders', queryString);
            workOrderCount = fetchRequestAllData.count(context);

        } catch (error) {
            alert("getWorkOrderDataCount-" + error);
        }
        return workOrderCount;
    }


    //Get work order header count based on filters
    static getWorkOrderData(context, status) {
        let workOrderResult = [];
        try {
            let plant = libSup.getPlant(context);
            let mainWorkCenter = libSup.getMainWorkCenter(context);
            let fromDate = libSup.getFromDate(context);
            let toDate = libSup.getToDate(context);

            let workOrderHeaderQueries = new WorkOrderHeaderQueries(plant, mainWorkCenter, fromDate, toDate);

            let queryString = workOrderHeaderQueries.getWOHeaderDataQuery(status);

            let fetchRequestAllData = new FetchRequest('MyWorkOrderHeaders', queryString);

            return fetchRequestAllData.execute(context).then(result => {
                if (result === undefined || result.length === undefined || result.length === 0) {
                    // Return empty array if result is undefined or not an array
                    return [];
                }
                return result;
            });

        } catch (error) {
            alert("getWorkOrderData-" + error);
        }

        return workOrderResult;
    }

    //Get work order header count based on filters grouped by Creation Date
    static getWOCreationDateWise(context, status) {
        try {
            let currentWeekDates = libSup.getCurrentWeekDates();
            let orderCreationDates = [];
            let orderDatesCount = {};
            let orderCounts = [];

            return woHdrData.getWorkOrderData(context, status).then(resultAllData => {
                //alert("resultAllData.length-" + resultAllData.length);
                if (resultAllData === undefined || resultAllData.length === undefined || resultAllData.length === 0) {
                    // Return empty array if result is undefined or not an array
                    return [];
                }

                for (var i = 0; i < resultAllData.length; i++) {
                    let orderData = resultAllData.getItem(i);
                    let creationDate = orderData.CreationDate;
                    let orderCreationDt = new Date(creationDate);
                    orderCreationDates.push(("0" + (orderCreationDt.getMonth() + 1)).slice(-2) + "-" + ("0" + orderCreationDt.getDate()).slice(-2));
                }

                for (var orderDate of orderCreationDates) {
                    orderDatesCount[orderDate] = orderDatesCount[orderDate] ? orderDatesCount[orderDate] + 1 : 1;
                }

                for (var weekDay of currentWeekDates) {
                    if (orderDatesCount[weekDay]) {
                        orderCounts.push(orderDatesCount[weekDay]);
                    } else {
                        orderCounts.push(9);//added 9 for testing change it back to zero 
                    }
                }
                return orderCounts;
            });

        } catch (error) {
            alert("getWOCreationDateWise " + error);
        }

    }


    //Get Work Order Id  and Creation Date based on filters grouped by Creation Date
    static getOrderIDAndCreationDate(context, status) {
        try {
            let currentWeekDates = libSup.getCurrentWeekDates();
            let orderData = {};

            return woHdrData.getWorkOrderData(context, status).then(resultAllData => {
                try {
                    if (resultAllData === undefined || resultAllData.length === undefined || resultAllData.length === 0) {
                        // Return empty array if result is undefined or not an array
                        return [];
                    }

                    for (var weekDay of currentWeekDates) {
                        var orderIds = []
                        for (var i = 0; i < resultAllData.length; i++) {
                            let orderData = resultAllData.getItem(i);
                            let creationDate = orderData.CreationDate;
                            let orderCreationDt = new Date(creationDate);
                            let orderMonthDate = ("0" + (orderCreationDt.getMonth() + 1)).slice(-2) + "-" + ("0" + orderCreationDt.getDate()).slice(-2);
                            if (weekDay == orderMonthDate) {
                                orderIds.push(orderData.OrderId);
                            }
                        }
                        if (orderIds.length > 0) {
                            orderData[weekDay] = orderIds;
                        }
                    }
                    return orderData;
                } catch (error) {
                    alert("getOrderIDAndCreationDate promise " + error);
                }
            });

        } catch (error) {
            alert("getOrderIDAndCreationDate " + error);
        }

    }


    //Get work order Ids based on filters
    static getWorkOrderIDs(context, status) {
        try {
            let orderIDs = [];

            return woHdrData.getWorkOrderData(context, status).then(resultAllData => {
                //alert("resultAllData.length-" + resultAllData.length);
                if (resultAllData === undefined || resultAllData.length === undefined || resultAllData.length === 0) {
                    // Return empty array if result is undefined or not an array
                    return [];
                }

                for (var i = 0; i < resultAllData.length; i++) {
                    let orderData = resultAllData.getItem(i);
                    let orderID = orderData.OrderId;
                    orderIDs.push(orderID);
                }

                return orderIDs;
            });
        } catch (error) {
            alert("getWorkOrderIDs " + error);
        }

    }
}
