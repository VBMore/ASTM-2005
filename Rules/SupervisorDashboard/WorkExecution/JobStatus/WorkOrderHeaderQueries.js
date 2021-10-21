import QueryBuilder from '../../../Common/Query/QueryBuilder';

export default class WorkOrderHeaderQueries {

    constructor(plant = '', mainWorkCenter = '', fromDate = '', toDate = '') {
        this.plant = plant;
        this.mainWorkCenter = mainWorkCenter;
        this.fromDate = fromDate;
        this.toDate = toDate;
    }

    getWOHeaderDataQuery(status) {

        let queryBuilder = new QueryBuilder();
        let filters = [];
        let queryString = "";
        let expand;

        try {
            //alert("getCompletedWODataQuery Data-" + this.plant + "-" + this.mainWorkCenter + "-" + this.fromDate + "-" + this.toDate);

            if (this.plant !== null && this.plant !== "") {
                filters.push("MainWorkCenterPlant eq '" + this.plant + "'");
            }

            if (this.mainWorkCenter !== null && this.mainWorkCenter !== "") {
                filters.push("MainWorkCenter eq '" + this.mainWorkCenter + "'");
            }

            if (this.fromDate !== null && this.fromDate !== "") {
                filters.push("CreationDate ge datetime'" + this.fromDate + "'");
            }

            if (this.toDate !== null && this.toDate !== "") {
                filters.push("CreationDate le datetime'" + this.toDate + "'");
            }

            if (status!=='' && status!==null) {
                expand = "OrderMobileStatus_Nav";
                filters.push("OrderMobileStatus_Nav/MobileStatus eq '" + status + "'");
                queryBuilder.addExpandStatement(expand);
            }

            if (filters.length > 0) {
                queryBuilder.addAllFilters(filters);
                queryString = queryBuilder.build();
            }
            return queryString;

        } catch (error) {
            alert("getWOHeaderDataQuery-" + error)
        }
    }
}
