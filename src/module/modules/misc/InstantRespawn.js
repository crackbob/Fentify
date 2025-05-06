import Module from "../../module";
import hooks from "../../../hooks";

export default class InstantRespawn extends Module {
    constructor() {
        super("InstantRespawn", "Misc", null);
    }

    onRender() {
        if (!hooks?.stores?.gameState?.gameWorld?.player) return;

        if (hooks.stores.playerState.isDeath) {
            hooks.stores.playerState.respawn();
            hooks.stores.playerState.isDeath = false;
        }
    }
}