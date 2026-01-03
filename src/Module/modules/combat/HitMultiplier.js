
import hooks from "../../../hooks";
import packets from "../../../packets";
import Module from "../../Module";

export default class HitMultiplier extends Module {
    constructor() {
        super("HitMultiplier", "Combat", {
            "Times": 10
        });
    }

    onEnable () {
        if (!hooks.stores.get("gameState").gameWorld?.player) return;

        packets.listeners["HitMultiplier"] = function (packetID, data) {
            if (packetID == packets.toServer.HIT) {
                for (let i = 0; i < parseInt(this.options.Times); i++) {
                    setTimeout(() => {
                        hooks.stores.get("gameState").gameWorld.server.msgsToSend.push(packets.toServer.HIT, data);
                    }, i * 100);
                }
            }
        };
    }

    onDisable() {
        delete packets.listeners["HitMultiplier"];
    }
}