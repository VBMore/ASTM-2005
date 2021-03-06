
export default class FetchRequest {

    constructor(entitySet = '', queryString = '', service = '/SAPAssetManager/Services/AssetManager.service', options = []) {
        this.service = service;
        this.entitySet = entitySet;
        this.queryString = queryString;
        this.options = options;
    }

    /**
     * Retrieve a count of all matching entities
     * 
     * @param {Context} context- calling context 
     */
    count(context) {
        return context.count(this.service, this.entitySet, this.queryString);
    }

    /**
     * Execute the fetch request
     * Retrieves an array Confirmations
     * 
     * @param {*} context - calling context
     */
    execute(context) {
        return context.read(this.service, this.entitySet, this.options, this.queryString).then(result => {
            try {
                if (result === undefined || result.length === undefined || result.length === 0) {
                    // Return empty array if result is undefined or not an array
                    return [];
                }
                return result;
            } catch (error) {
                alert("Fetch Request -" + error)
            }
        });
    }

    /**
     * Execute a get request on an entity based on an identifier
     * @param {*} context - calling context
     * @param {*} identifier - Entity set identifier
     * @param {boolean} isDecoratedReadlink - true if readlink should not be decorated
     */
    get(context, identifier, isDecoratedReadlink = false) {
        let readlink = isDecoratedReadlink ? identifier : `${this.entitySet}(${identifier})`;
        return context.read(this.service, readlink, this.options, this.queryString);
    }

}
