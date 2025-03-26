import events from "./events";

export default {
    init: async function () {
        let safeImport = (src) => eval(`(async () => { return await import("${src}")})()`);
        let mainModule = await safeImport(Object.values(document.scripts).find(script => script?.src?.includes("index")).src);
        this.stores = Object.values(mainModule).filter(exports => exports?.$id).reduce((acc, exports) => (acc[exports.$id] = exports(), acc), {});
    }
}