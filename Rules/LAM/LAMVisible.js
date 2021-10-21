
import lamIsVisible from './LAMIsVisible';

export default function LAMVisible(context) {

    let binding = context.binding;
    
    return lamIsVisible(context, binding['@odata.readLink'], [], '');

}
