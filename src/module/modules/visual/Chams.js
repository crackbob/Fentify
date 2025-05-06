import Module from "../../module";
import hooks from "../../../hooks";

export default class Chams extends Module {
    constructor () {
        super("Chams", "Visual", null)
    }

    onRender () {
        if (!hooks?.stores?.gameState?.gameWorld?.player) return;
        hooks.stores.gameState.gameWorld.server.playerIdToData.forEach(player => {
            player.headObj3D.material.depthTest = false;
            player.headObj3D.material.wireframe = true;
        });
    }

    onDisable () {
        if (!hooks?.stores?.gameState?.gameWorld?.player) return;
        hooks.stores.gameState.gameWorld.server.playerIdToData.forEach(player => {
            player.headObj3D.material.depthTest = true;
            player.headObj3D.material.wireframe = false;
        });
    }
};