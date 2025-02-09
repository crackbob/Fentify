import Module from "../../module";
import hooks from "../../../hooks";
import stores from "../../../utils/stores";

export default class SpoofBlock extends Module {
    constructor() {
        super("SpoofBlock", "Misc", {
            "Block ID": 1
        });
        
    }

    onEnable() {
        let itemID = this.options["Block ID"];
        stores.itemMgrStore[1][stores.itemMgrStore.selectedItem][0] = itemID;
        hooks.gameWorld.player.currentHandItemId = itemID;
    }
}