import libCom from '../Common/Library/CommonLibrary';

export default function NotificationFLOCFilter(context) {
    if (libCom.getAppParam(context, 'NOTIFICATION', 'PlanningPlant')) {
        return '$filter=PlanningPlant eq \'' + libCom.getAppParam(context, 'NOTIFICATION', 'PlanningPlant') + '\'&$orderby=FuncLocIdIntern';
    } else {
        return '&$orderby=FuncLocIdIntern';
    }
}
