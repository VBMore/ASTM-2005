import EquipmentChecklistsCount from './Equipment/EquipmentChecklistsCount';

export default function checklistsListViewOnPageLoad(context) {

    let binding = context.getBindingObject();
    if (binding['@odata.type'] === '#sap_mobile.MyEquipment') {
        return EquipmentChecklistsCount(context).then(count => {
            let params=[count];
            context.setCaption(context.localizeText('checklists_x', params));
        });
    }
    return '';
}

