import Module from "../../module";
import hooks from "../../../hooks";

export default class SpoofLevel extends Module {
    constructor() {
        super("SpoofLevel", "Misc", {
            "Level": 999
        });
        this.ogLevel;
    }

    onEnable() {
        let userStore = hooks.importedModules.find(m => m?.["$id"] == "user")();
        if (userStore?.lvl) this.ogLevel = userStore.lvl;
        userStore.user = userStore || {};
        userStore.lvl = this.options["Level"];
    }

    onDisable() {
        let userStore = hooks.importedModules.find(m => m?.["$id"] == "user")();
        userStore.user = userStore || {};
        userStore.lvl = this.ogLevel;
    }
}