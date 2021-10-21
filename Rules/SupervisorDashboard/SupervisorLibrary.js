
import { SupervisorLibrary as libSup } from './SupervisorLibrary';

export class SupervisorLibrary {

    // Gets the count of Workorders
    static workOrdersCount(context, queryOption) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', queryOption);
    }


    //current week start date
    static getCurrentWeekDates() {
        var weekDays = [];
        try {
            let currentDate = new Date();
            let firstDayOfWeek = currentDate.getDate() - currentDate.getDay()-7;//added -7 to fetch the test data remove it later
            currentDate.setDate(firstDayOfWeek);
            weekDays.push(("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + currentDate.getDate()).slice(-2));
            currentDate.setDate(firstDayOfWeek + 1);
            weekDays.push(("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + currentDate.getDate()).slice(-2));
            currentDate.setDate(firstDayOfWeek + 2);
            weekDays.push(("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + currentDate.getDate()).slice(-2));
            currentDate.setDate(firstDayOfWeek + 3);
            weekDays.push(("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + currentDate.getDate()).slice(-2));
            currentDate.setDate(firstDayOfWeek + 4);
            weekDays.push(("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + currentDate.getDate()).slice(-2));
            currentDate.setDate(firstDayOfWeek + 5);
            weekDays.push(("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + currentDate.getDate()).slice(-2));
            currentDate.setDate(firstDayOfWeek + 6);
            weekDays.push(("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + currentDate.getDate()).slice(-2));
        } catch (error) {
            alert("getCurrentWeekDates-" + error)
        }
        return weekDays;
    }

    //current week start date
    static getCurrentWeekStartDate() {
        try {
            let currentDate = new Date();
            let firstDayOfWeek = currentDate.getDate() - currentDate.getDay();
            currentDate.setDate(firstDayOfWeek-7);//added -7 to fetch the test data remove it later
            return libSup.formatDate(currentDate);
        } catch (error) {
            alert("getCurrentWeekStartDate-" + error)
        }
    }

    //current week end date
    static getCurrentWeekEndDate() {
        try {
            let currentDate = new Date();
            let lastDayOfWeek = currentDate.getDate() - currentDate.getDay() + 6;
            currentDate.setDate(lastDayOfWeek-7);//added -7 to fetch the test data remove it later
            return libSup.formatDate(currentDate);
        } catch (error) {
            alert("getCurrentWeekEndDate-" + error)
        }
    }

    //format date in yyyy-mm-dd hh:mm:ss
    static formatDate(date) {
        try {
            if (null !== date && date !== "") {
                var d = new Date(date);
                var formattedDate = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + "T" + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
                return formattedDate;
            }
        } catch (error) {
            alert("Date Formatter-" + error)
        }
    }

    static getPlant(context) {
        let Plant;
        try {
            Plant = context.evaluateTargetPath('#Page:SupervisorDashboardFilter/#Control:ListPickerPlant/#SelectedValue');
        } catch (error) {
            Plant = "";
        }
        return Plant;
    }

    static getMainWorkCenter(context) {
        let MainWorkCenter;
        try {
            MainWorkCenter = context.evaluateTargetPath('#Page:SupervisorDashboardFilter/#Control:MainWorkCenterFilter/#SelectedValue');
        } catch (error) {
            MainWorkCenter = "";
        }
        return MainWorkCenter;
    }

    static getFromDate(context) {
        let FromDate;
        try {
            FromDate = context.evaluateTargetPath('#Page:SupervisorDashboardFilter/#Control:FromDateFilter/#Value');
            FromDate = libSup.formatDate(FromDate);
            if (FromDate == null || FromDate == "") {
                FromDate = libSup.getCurrentWeekStartDate();
            }
        } catch (error) {
            FromDate = libSup.getCurrentWeekStartDate();
        }
        return FromDate;
    }

    static getToDate(context) {
        let ToDate;
        try {
            ToDate = context.evaluateTargetPath('#Page:SupervisorDashboardFilter/#Control:ToDateFilter/#Value');
            ToDate = libSup.formatDate(ToDate);
            if (ToDate == null || ToDate == "") {
                ToDate = libSup.getCurrentWeekEndDate();
            }
        } catch (error) {
            ToDate = libSup.getCurrentWeekEndDate();
        }
        return ToDate;
    }

}
