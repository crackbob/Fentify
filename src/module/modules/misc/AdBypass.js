
import hooks from "../../../hooks";
import Module from "../../Module";

export default class AdBypass extends Module {
    constructor() {
        super("AdBypass", "Misc");
    }

    onEnable() {
        this._reward = this._reward || hooks.stores.get("user").rewardCommercialVideoWrapper;
        hooks.stores.get("user").rewardCommercialVideoWrapper = () => Promise.resolve(true);
    }

    onDisable() {
        hooks.stores.get("user").rewardCommercialVideoWrapper = this._reward;
    }
}