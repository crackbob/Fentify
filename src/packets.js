import events from "./events"
import hooks from "./hooks";

export default {
    toServer: {
        TIME_STEP_INFO: 5,
        PICKUP_DROP_ITEM: 40,
        HIT: 61
    },

    listeners: {},

    packetListener (packetID, data) {
        Object.values(this.listeners).forEach(listener => {
            let result = listener(packetID, data);
            if (result !== null && result !== undefined) {
                data = result;
            }
        });
        hooks.stores.get("gameState").gameWorld.server.msgsToSend.push(packetID, data);
    },

    init () {
        events.on("render", () => {
            if (!hooks?.stores?.get("gameState")?.gameWorld?.server?.sendData) return;
            hooks.stores.get("gameState").gameWorld.server.sendData = this.packetListener.bind(this);
        });
    }
}