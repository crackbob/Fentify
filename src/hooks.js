import events from "./events";

export default {
    init: async function () {
        let safeImport = (src) => eval(`(async () => { return await import("${src}")})()`);
        let mainModule = await safeImport(Object.values(document.scripts).find(script => script?.src?.includes("index")).src);
        let roomManagerModule = await safeImport(Object.values(document.getElementsByTagName("link")).find(link => link?.href?.includes("room")).href);

        this.stores = [...Object.values(mainModule), ...Object.values(roomManagerModule)]
            .filter(exports => exports?.$id)
            .reduce((acc, exports) => (acc[exports.$id] = exports(), acc), {});
    }
}