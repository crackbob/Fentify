export default {
    async init () {
        let provides = app._vnode.component.appContext.provides;
        let appState = provides[Object.getOwnPropertySymbols(provides).find(sym => provides[sym]._s)];
        this._stores = appState._s;

        let keys =["app","gameState","friends","settings","sounds","itemsManager", "roomManager", "modals", "user", "chat", "playerState", "ads", "alertSystem", "shit", "somePrefabThing", "bub"]

        let values = [...this._stores.values()];
        this.namedStores = Object.fromEntries(
            keys.map((k, i) => [k, values[i]])
        );


    },

    getStore (storeName) {
        return this.namedStores[storeName];
    },

    get stores () {
        return {
            get: this.getStore.bind(this)
        }
    }
}