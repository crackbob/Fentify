
import hooks from "../../../hooks";
import packets from "../../../packets";
import Module from "../../Module";

export default class NoFall extends Module {
    constructor() {
        super("NoFall", "Misc", null);
    }

    onEnable () {
        if (!hooks.stores.get("gameState").gameWorld?.player) return;

        packets.listeners["NoFall"] = function (packetID, data) {
            if (packetID == packets.toServer.TIME_STEP_INFO) {
                if (data.v) delete data.v; // Y Velocity
            }
        };
    }

    onDisable() {
        delete packets.listeners["NoFall"];
    }
}