export default function MeasurementDocumentOperation(context) {
	try {
		if (context.binding.hasOwnProperty('Point')) {
			return context.getClientData().MeasuringPointData[context.binding.Point].Operation;
		} else {
			return context.getClientData().MeasuringPointData[context.binding.MeasuringPoint.Point].Operation;
		}
	} catch (exc) {
		return '';
	}
}
