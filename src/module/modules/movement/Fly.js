import Module from "../../module";
import hooks from "../../../hooks";

export default class Fly extends Module {
    constructor () {
        super("Fly", "Movement", {
            "Vertical Speed": 5
        })
    }

    onEnable () {
        hooks.stores.gameState.gameWorld.player.velocity.gravity = 0;
    }

    onRender () {
        if (hooks.stores.gameState.gameWorld.player.inputs.jump) {
            hooks.stores.gameState.gameWorld.player.velocity.velVec3.y = this.options["Vertical Speed"];
        } else if (hooks.stores.gameState.gameWorld.player.inputs.crouch) {
            hooks.stores.gameState.gameWorld.player.velocity.velVec3.y = -this.options["Vertical Speed"];;
        } else {
            hooks.stores.gameState.gameWorld.player.velocity.velVec3.y = 0;
        }
    }

    onDisable () {
        hooks.stores.gameState.gameWorld.player.velocity.gravity = 23;
    }
};