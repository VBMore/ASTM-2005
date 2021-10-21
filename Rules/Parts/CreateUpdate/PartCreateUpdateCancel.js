import libCom from '../../Common/Library/CommonLibrary';

export default function PartCreateUpdateCancel(clientAPI) {
    libCom.clearFromClientData(clientAPI, 'PartAdd', false);
    if (libCom.isOnChangeset(clientAPI)) {
        libCom.setOnChangesetFlag(clientAPI, false);
    }
    clientAPI.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
}
