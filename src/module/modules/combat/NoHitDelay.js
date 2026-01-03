import hooks from "../../../hooks";
import Module from "../../Module";

export default class NoHitDelay extends Module {
    constructor() {
        super("NoHitDelay", "Combat");
    }

    onRender() {
        let system = hooks.stores.get("gameState")?.gameWorld?.systemsManager?.activeSystems.find(sys => sys?.lastAttackTimeMs !== undefined);
        if (system) system.attackTimeDelayMs = 0;
    }
}