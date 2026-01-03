import hooks from "../../../hooks";
import Module from "../../Module";

export default class Fly extends Module {
    constructor () {
        super("Fly", "Movement", {
            "Vertical Speed": 5
        })
    }

    onRender () {
        if (!hooks.stores.get("gameState").gameWorld?.player) return;
        
        let gameWorld = hooks.stores.get("gameState").gameWorld;

        gameWorld.player.velocity.gravity = 0;

        if (gameWorld.player.inputs.jump) {
            gameWorld.player.velocity.velVec3.y = this.options["Vertical Speed"];
        } else if (gameWorld.player.inputs.crouch) {
            gameWorld.player.velocity.velVec3.y = -this.options["Vertical Speed"];
        } else {
            gameWorld.player.velocity.velVec3.y = 0;
        }
    }

    onDisable () {
        hooks.stores.get("gameState").gameWorld.player.velocity.gravity = 23;
    }
};