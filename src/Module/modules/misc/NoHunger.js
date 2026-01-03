
import hooks from "../../../hooks";
import packets from "../../../packets";
import Module from "../../Module";

export default class NoHunger extends Module {
    constructor() {
        super("NoHunger", "Misc", null);
    }

    onEnable () {
        if (!hooks.stores.get("gameState").gameWorld?.player) return;

        packets.listeners["NoHunger"] = function (packetID, data) {
            if (packetID == packets.toServer.TIME_STEP_INFO) {
                if (data.m) delete data.m; // is Moving
                if (data.j) delete data.j; // is Jumping
                if (data.b) delete data.b; // is Sprinting
            }
        };
    }

    onDisable() {
        delete packets.listeners["NoHunger"];
    }
}