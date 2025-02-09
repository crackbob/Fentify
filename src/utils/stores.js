import hooks from "../hooks";

export default {
    get userStore () {
        return hooks.importedModules.find(m => m?.["$id"] == "user")();
    },

    get itemMgrStore () {
        return hooks.importedModules.find(m => m?.["$id"] == "itemsManager")();
    },

    get roomMgrStore () {
        return hooks.importedModules.find(m => m?.["$id"] == "roomManager")();
    }
}