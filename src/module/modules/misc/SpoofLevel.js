import Module from "../../module";
import hooks from "../../../hooks";
import stores from "../../../utils/stores";

export default class SpoofLevel extends Module {
    constructor() {
        super("SpoofLevel", "Misc", {
            "Level": 999
        });
        this.ogLevel;
    }

    onEnable() {
        if (stores.userStore?.lvl) this.ogLevel = stores.userStore.lvl;
        stores.userStore.user = stores.userStore.user || {};
        stores.userStore.lvl = this.options["Level"];
    }

    onDisable() {
        stores.userStore.user = stores.userStore.user || {};
        stores.userStore.lvl = this.ogLevel;
    }
}