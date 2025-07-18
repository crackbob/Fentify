export default {
    get mainIndexUrl () {
        return Object.values(document.scripts).find(script => script?.src?.includes("index")).src
    },

    checkAnticheat (exports) {
        return exports?.__lookupGetter__?.("$id")?.toString?.()?.includes?.("anticheat") || false;
    },
    
    async getAllChunks () {
        let code = await fetch(this.mainIndexUrl)
        .then(res => res.text())
        .then(code => code.split('\n')[0]);

        let __vite__mapDeps = Function(code + `return __vite__mapDeps`)()
        __vite__mapDeps([1]);
        return __vite__mapDeps.f.filter(chunkUrl => chunkUrl.includes("js"));
    },

    safeImport (src) {
        return eval(`(async () => { return await import("${src}")})()`);
    },

    init: async function () {
        let allChunks = (await this.getAllChunks()).map(url => "https://" + location.host + "/" + url);
        allChunks.push(this.mainIndexUrl);
        allChunks = allChunks.filter(url => !url.includes("General")); // causes errors idk wtf
        let importedModules = await Promise.all(allChunks.map(url => this.safeImport(url)));
        let allModuleExports = importedModules.flatMap(module => Object.values(module));
        this.stores = Object.values(allModuleExports).filter(exports => !this.checkAnticheat(exports) && exports?.$id).reduce((acc, exports) => (acc[exports.$id] = exports(), acc), {});
    }
}