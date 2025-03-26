import Module from "../../module";
import hooks from "../../../hooks";

export default class NoHitDelay extends Module {
    constructor() {
        super("NoHitDelay", "Combat");
    }

    get hitSystem () {
        return hooks.stores.gameState.gameWorld.systemsManager.activeExecuteSystems.find(sys => sys?.lastAttackTimeMs !== undefined);
    }

    onEnable() {
        this.hitSystem.__defineGetter__("attackTimeDelayMs", () => 0);
        this.hitSystem.__defineSetter__("attackTimeDelayMs", () => 0);
    }

    onDisable() {
        delete this.hitSystem.attackTimeDelayMs;
        this.hitSystem.attackTimeDelayMs = 750;
    }
}