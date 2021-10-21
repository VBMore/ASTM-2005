import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import actPickerQueryOptions from './ActivityPickerQueryOptions';
import variancePickerQueryOptions from './VariancePickerQueryOptions';


import SubOperationQueryOptions from './SubOperationPickerQueryOptions';

export default function OnOperationChanged(context) {
    let binding = context.getBindingObject();
    let selection = context.getValue()[0] ? context.getValue()[0].ReturnValue : '';
    binding.Operation = selection;
    let pageProxy = context.getPageProxy();
    pageProxy._context.binding = binding;

     let opControl = libCom.getControlProxy(pageProxy, 'OperationPkr');

    /* Clear the validation if the field is not empty */
    if (!libVal.evalIsEmpty(opControl.getValue())) {
        opControl.clearValidation();
    }
    
    if (selection.length === 0) {
        // Clear Sub Operation Picker
        binding.ActivityType = '';
        binding.VarianceReason = '';
        redrawListControl(pageProxy, 'SubOperationPkr', '', false);
        redrawListControl(pageProxy, 'ActivityTypePkr', '', false);
        redrawListControl(pageProxy, 'VarianceReasonPkr', '', false);
    } else {
        return Promise.all([SubOperationQueryOptions(pageProxy), actPickerQueryOptions(pageProxy), variancePickerQueryOptions(pageProxy)]).then(function(results) {
            redrawListControl(pageProxy, 'SubOperationPkr', results[0], true);
            redrawListControl(pageProxy, 'ActivityTypePkr', results[1], true);
            redrawListControl(pageProxy, 'VarianceReasonPkr', results[2], true);
            binding.ActivityType = '';
            binding.VarianceReason = '';
        });
    }
}

/**
 * Redraw a page control
 * @param {*} pageProxy 
 * @param {*} controlName 
 * @param {*} queryOptions 
 * @param {*} isEditable 
 */
function redrawListControl(pageProxy, controlName, queryOptions, isEditable=true) {
    let control = libCom.getControlProxy(pageProxy,controlName);
    let specifier = control.getTargetSpecifier();

    specifier.setQueryOptions(queryOptions);
    specifier.setService('/SAPAssetManager/Services/AssetManager.service');

    control.setEditable(isEditable);
    control.setTargetSpecifier(specifier);

    control.redraw();
}
