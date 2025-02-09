import Module from "../../module";
import hooks from "../../../hooks";

export default class SpoofBlock extends Module {
    constructor() {
        super("SpoofBlock", "Misc", {
            "Block ID": 1
        });
        
    }

    onEnable() {
        let itemID = this.options["Block ID"];
        let inventory = hooks.importedModules.find(m => m?.["$id"] == "itemsManager")();
        inventory[1][inventory.selectedItem][0] = itemID;
        hooks.gameWorld.player.currentHandItemId = itemID;
    }
}