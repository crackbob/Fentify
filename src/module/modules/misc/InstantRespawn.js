
import hooks from "../../../hooks";
import Module from "../../Module";

export default class InstantRespawn extends Module {
    constructor() {
        super("InstantRespawn", "Misc", null);
    }

    onRender() {
        if (!hooks.stores.get("gameState").gameWorld?.player) return;

        let playerState = hooks.stores.get("playerState");
        if (playerState.isDeath) {
            playerState.respawn();
            playerState.isDeath = false;
        }
    }
}