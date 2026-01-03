import Module from "../../Module";
import hooks from "../../../hooks";

export default class AutoSprint extends Module {
    constructor () {
        super("AutoSprint", "Movement", null);
    }

    onRender () {
        if (!hooks.stores.get("gameState").gameWorld?.player) return;
        hooks.stores.get("gameState").gameWorld.player.velocity.speedBoosted = true;
    }
};