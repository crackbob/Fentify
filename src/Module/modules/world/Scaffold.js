import Module from "../../Module";
import hooks from "../../../hooks";

export default class Scaffold extends Module {
    constructor () {
        super("Scaffold", "World", null)
    }

    onRender () {
        let gameWorld = hooks.stores.get("gameState").gameWorld;
        let blockPos = Object.values(gameWorld.player.position).splice(0, 3).map(Math.floor);
        
        blockPos[1]--;

        let holdingBlockID = gameWorld.player.currentHandItemId;
        let blockUnderID = gameWorld.chunkManager.getBlock(...blockPos);
        let replaceable = gameWorld.allItems[blockUnderID]?.replaceable || false;
        
        if ((blockUnderID == 0 || replaceable) && holdingBlockID) {
            gameWorld.chunkManager.placeBlockWithMsgSending(...blockPos, holdingBlockID);
        }
    }
};