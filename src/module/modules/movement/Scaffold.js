import Module from "../../module";
import hooks from "../../../hooks";

export default class Scaffold extends Module {
    constructor () {
        super("Scaffold", "Movement", null)
    }

    onRender () {
        let blockPos = Object.values(hooks.stores.gameState.gameWorld.player.position).splice(0, 3).map(Math.floor);
        
        blockPos[1]--;

        let holdingBlockID = hooks.stores.gameState.gameWorld.player.currentHandItemId;
        let blockUnderID = hooks.stores.gameState.gameWorld.chunkManager.getBlock(...blockPos);
        let replaceable = hooks.stores.gameState.gameWorld.allItems[blockUnderID]?.replaceable || false;
        
        if ((blockUnderID == 0 || replaceable) && holdingBlockID) {
            hooks.stores.gameState.gameWorld.chunkManager.placeBlockWithMsgSending(...blockPos, holdingBlockID);
        }
    }
};