export default function MeasurementDocumentOrderId(context) {
	try {
		if (context.binding.hasOwnProperty('Point')) {
			return context.getClientData().MeasuringPointData[context.binding.Point].OrderId;
		} else {
			return context.getClientData().MeasuringPointData[context.binding.MeasuringPoint.Point].OrderId;
		}
	} catch (exc) {
		return '';
	}
}
