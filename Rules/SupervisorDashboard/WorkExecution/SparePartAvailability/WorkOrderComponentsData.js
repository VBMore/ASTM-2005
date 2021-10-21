import { WorkOrderHeaderData as woHdrData } from '../JobStatus/WorkOrderHeaderData';
import FetchRequest from '../../../Common/Query/FetchRequest';
import QueryBuilder from '../../../Common/Query/QueryBuilder';

export class WorkOrderComponentsData {

    static getWorkOrderComponentsCount(context, itemCategory) {
        try {
            let queryBuilder = new QueryBuilder();
            let filters = [];
            let queryString = "";
            let orderIdString = "";
            let itemCount = 0;

            return woHdrData.getWorkOrderIDs(context, "").then(resultAllData => {
                try {
                    //alert("resultAllData.length-" + resultAllData.length);
                    if (resultAllData === undefined || resultAllData.length === undefined || resultAllData.length === 0) {
                        // Return empty array if result is undefined or not an array
                        return [];
                    }

                    for (var i = 0; i < resultAllData.length; i++) {
                        if (i == (resultAllData.length - 1)) {
                            orderIdString = orderIdString + " OrderId eq '" + resultAllData[i] + "'";
                        } else {
                            orderIdString = orderIdString + " OrderId eq '" + resultAllData[i] + "' or ";
                        }
                    }

                    orderIdString = "OrderId eq '4000384' or OrderId eq '4000387' or OrderId eq '4000000'";

                    filters.push(orderIdString);

                    if (itemCategory !== '' && itemCategory !== null) {
                        filters.push("ItemCategory eq '" + itemCategory + "'");
                    }

                    if (filters.length > 0) {
                        queryBuilder.addAllFilters(filters);
                        queryString = queryBuilder.build();
                    }

                    let fetchRequestAllData = new FetchRequest('MyWorkOrderComponents', queryString);
                    itemCount = fetchRequestAllData.count(context);

                    return itemCount;

                } catch (error) {
                    alert("getWorkOrderComponentsCount return 1-" + error);
                }
            });

        } catch (error) {
            alert("getWorkOrderComponentsCount-" + error);
        }
    }
}
