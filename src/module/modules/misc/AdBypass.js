import Module from "../../module";
import hooks from "../../../hooks";
import stores from "../../../utils/stores";

export default class AdBypass extends Module {
    constructor() {
        super("AdBypass", "Misc");
    }

    onEnable() {
        this._reward = this._reward || stores.userStore.rewardCommercialVideoWrapper;
        stores.userStore.rewardCommercialVideoWrapper = () => true;
    }

    onDisable() {
        stores.userStore.rewardCommercialVideoWrapper = () => this._reward;
    }
}