import libVal from '../Common/Library/ValidationLibrary';

/**
 * Takes string parameters for LAM field and UOM and returns a string concatenated
 * localized number and UOM for display.
 * @param {String} value
 * @param {String} uom
 */
export default function FormatLAMField(value, uom) {
    // LAM field value is a space padded number, so trim spaces
    if (!libVal.evalIsEmpty(value)) {
        value = value.trim();
    } else {
        return '-';
    }

    if (!libVal.evalIsEmpty(uom)) {
        uom = ' ' + uom.trim();
    } else {
        uom = '';
    }

    return `${value} ${uom}`;

}
