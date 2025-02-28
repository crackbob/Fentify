import Module from "../../module";
import hooks from "../../../hooks";

export default class NoClip extends Module {
    constructor() {
        super("NoClip", "Movement");
        this.realGameMode = 0;
    }

    onEnable() {
        this.realGameMode = hooks.gameWorld.player.gameMode;
        hooks.gameWorld.server.switchGameMode(3);
    }

    onDisable() {
        hooks.gameWorld.server.switchGameMode(this.realGameMode);
    }
}