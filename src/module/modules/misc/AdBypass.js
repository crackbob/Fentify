import Module from "../../module";
import hooks from "../../../hooks";

export default class AdBypass extends Module {
    constructor() {
        super("AdBypass", "Misc");
    }

    onEnable() {
        this._reward = this._reward || hooks.stores.user.rewardCommercialVideoWrapper;
        hooks.stores.user.rewardCommercialVideoWrapper = () => true;
    }

    onDisable() {
        hooks.stores.user.rewardCommercialVideoWrapper = () => this._reward;
    }
}