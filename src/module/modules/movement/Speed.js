import Module from "../../Module";
import hooks from "../../../hooks";

export default class Speed extends Module {
    constructor () {
        super("Speed", "Movement", {
            "Speed": 15
        })
    }

    onRender () {
        hooks.stores.get("gameState").gameWorld.player.velocity.moveSpeed = this.options["Speed"];
        hooks.stores.get("gameState").gameWorld.player.velocity.fastMoveSpeed = this.options["Speed"];
    }

    onDisable () {
        hooks.stores.get("gameState").gameWorld.player.velocity.moveSpeed = 4.5;
        hooks.stores.get("gameState").gameWorld.player.velocity.fastMoveSpeed = 6.4;
    }
};