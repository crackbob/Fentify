import hooks from "../../../hooks";
import Module from "../../Module";

export default class Timer extends Module {
    constructor() {
        super("Timer", "World", {
            "Multiplier": 1.2
        });
    }

    onRender() {
        const time = hooks.stores.get("gameState").gameWorld.time;
        time.elapsedTimeMs += 20 * this.options.Multiplier;
    }
}