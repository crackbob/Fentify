import Module from "../../module";
import hooks from "../../../hooks";

export default class NoClip extends Module {
    constructor() {
        super("NoClip", "Movement");
        this.realGameMode = 0;
    }

    onEnable() {
        this.realGameMode = hooks.stores.gameState.gameWorld.player.gameMode;
        hooks.stores.gameState.gameWorld.server.switchGameMode(3);
    }

    onDisable() {
        hooks.stores.gameState.gameWorld.server.switchGameMode(this.realGameMode);
    }
}