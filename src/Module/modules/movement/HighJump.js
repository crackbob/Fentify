import Module from "../../Module";
import hooks from "../../../hooks";

export default class HighJump extends Module {
    constructor () {
        super("HighJump", "Movement", {
            "Jump Height": 25
        })
    }

    onRender () {
        hooks._stores.get("gameState").gameWorld.player.velocity.jumpSpeed = parseFloat(this.options["Jump Height"]);
    }

    onDisable () {
        hooks._stores.get("gameState").gameWorld.player.velocity.jumpSpeed = 7.692307692307692;
    }
};