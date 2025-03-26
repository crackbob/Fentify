import Module from "../../module";
import hooks from "../../../hooks";

export default class Airjump extends Module {
    constructor () {
        super("Airjump", "Movement", null)
    }

    onEnable () {
        hooks.stores.gameState.gameWorld.player.collision.__defineGetter__("isGrounded", () => true);
        hooks.stores.gameState.gameWorld.player.collision.__defineSetter__("isGrounded", () => true);
    }

    onDisable () {
        delete hooks.stores.gameState.gameWorld.player.collision.isGrounded;
        hooks.stores.gameState.gameWorld.player.collision.isGrounded = true;
    }
};