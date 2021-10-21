
export default function UpdateWorkCenterFilter(context) {

    try {
        let controls = [];
        var plant = context.evaluateTargetPath("#Page:SupervisorDashboardFilter/#Control:ListPickerPlant/#SelectedValue"); 
        var queryString = "$filter=PlantId eq '" + plant + "'&$orderby=ExternalWorkCenterId";
    
        let formCellContainer = context.getPageProxy().getControl('FormCellContainer');
        if (formCellContainer && formCellContainer.getControls()) {
            controls = formCellContainer.getControls();
        }
        if (controls && controls.length > 0) {

            let specifier = controls[1].getTargetSpecifier();
            specifier.setDisplayValue("{{#Property:PlantId}} - {{#Property:ExternalWorkCenterId}}- {{#Property:WorkCenterDescr}}");
            specifier.setEntitySet("WorkCenters");
            specifier.setReturnValue("{ExternalWorkCenterId}");
            specifier.setService("/SAPAssetManager/Services/AssetManager.service");
            // set the query options for the work center list picker based on plant list picker
            specifier.setQueryOptions(queryString);

            controls[1].setTargetSpecifier(specifier);
        }
    } catch (error) {
        alert("UpdateWorkCenterFilter " + error);
    }
}