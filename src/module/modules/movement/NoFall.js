import Module from "../../module";
import hooks from "../../../hooks";

export default class NoFall extends Module {
    constructor () {
        super("NoFall", "Movement")
    }

    onRender () {
        let blockPos = hooks.gameWorld.player.position.clone().floor();
        blockPos.y--;
        let blockDirectlyUnderPlayer = !!hooks.gameWorld.chunkManager.getBlock(...blockPos);
        blockPos.y -= 2;
        let blockUnderPlayer = !!hooks.gameWorld.chunkManager.getBlock(...blockPos);


        if (blockUnderPlayer && hooks.gameWorld.player.velocity.velVec3.y < -6 && !blockDirectlyUnderPlayer) {
            hooks.gameWorld.player.position.y = blockPos.y + 1.5;
            hooks.gameWorld.player.velocity.velVec3.y = 0.1;
        }
    }
};