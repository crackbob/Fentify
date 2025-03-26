import Module from "../../module";
import hooks from "../../../hooks";

export default class Triggerbot extends Module {
    constructor() {
        super("Triggerbot", "Combat", {
            "Interval": 50
        });
        this.lastExecutionTime = 0;
    }

    get hitSystem () {
        return hooks.stores.gameState.gameWorld.systemsManager.activeExecuteSystems.find(sys => sys?.lastAttackTimeMs !== undefined);
    }

    onRender() {
        const currentTime = Date.now();

        if (currentTime - this.lastExecutionTime >= this.options["Interval"] && this.hitSystem?.hitPlayers) {
            this.lastExecutionTime = currentTime;
            this.hitSystem.hitPlayers()
        }
    }
}