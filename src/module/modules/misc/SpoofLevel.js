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
        if (hooks.stores.user?.user?.lvl) this.ogLevel = hooks.stores.user.user.lvl;
        hooks.stores.user.user = hooks.stores.user.user || {};
        hooks.stores.user.user.lvl = this.options["Level"];
    }

    onDisable() {
        hooks.stores.user.user = hooks.stores.user.user || {};
        hooks.stores.user.user.lvl = this.ogLevel;
    }
}