import Module from "../../module";
import hooks from "../../../hooks";

export default class NoFall extends Module {
    constructor () {
        super("NoFall", "Movement")
    }

    onRender () {
        if (!hooks?.stores?.gameState?.gameWorld?.player) return;
        
        let blockPos = hooks.stores.gameState.gameWorld.player.position.clone().floor();
        blockPos.y--;
        let blockDirectlyUnderPlayer = !!hooks.stores.gameState.gameWorld.chunkManager.getBlock(...blockPos);
        blockPos.y -= 2;
        let blockUnderPlayer = !!hooks.stores.gameState.gameWorld.chunkManager.getBlock(...blockPos);


        if (blockUnderPlayer && hooks.stores.gameState.gameWorld.player.velocity.velVec3.y < -6 && !blockDirectlyUnderPlayer) {
            hooks.stores.gameState.gameWorld.player.position.y = blockPos.y + 1.5;
            hooks.stores.gameState.gameWorld.player.velocity.velVec3.y = 0.1;
        }
    }
};