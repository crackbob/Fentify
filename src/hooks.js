export default {
    async init () {
        let indexPath = Object.values(document.getElementsByTagName("script")).find(script => script.src.includes("index-")).src;
        let indexExports = (await import(indexPath));
        this.storeMap = Object.values(indexExports).find(obj => obj.STORES);

        let provides = app._vnode.component.appContext.provides;
        let appState = provides[Object.getOwnPropertySymbols(provides).find(sym => provides[sym]._s)];
        this._stores = appState._s;
    },

    getStore (storeName) {
        return this._stores.get(this.storeMap[storeName]) || this._stores[storeName];
    },

    get stores () {
        return {
            get: this.getStore.bind(this)
        }
    }
}