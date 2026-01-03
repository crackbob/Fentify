import hooks from "../../../hooks";
import packets from "../../../packets";
import Module from "../../Module";

export default class PickupReach extends Module {
    constructor() {
        super("PickupReach", "World", {
            "Reach": 5,
            "Delay": 1000
        });

        this.lastExecutionTime = 0;
    }

    onRender() {
        const now = Date.now();
        const delay = parseFloat(this.options["Delay"]);

        if (now - this.lastExecutionTime < delay) return;

        const gameWorld = hooks.stores.get("gameState")?.gameWorld;
        if (!gameWorld?.player) return;

        this.tryPickup(gameWorld);
        this.lastExecutionTime = now;
    }

    get pickupSystem() {
        const gameWorld = hooks.stores.get("gameState")?.gameWorld;
        return gameWorld?.systemsManager?.activeSystems.find(sys => sys?.allDropItems);
    }

    tryPickup(gameWorld) {
        const reach = parseFloat(this.options["Reach"]);
        const reachSq = reach * reach;

        const playerPos = gameWorld.player.position;
        const px = playerPos.x;
        const py = playerPos.y;
        const pz = playerPos.z;

        const drops = this.pickupSystem?.allDropItems;
        if (!drops) return;

        let closest = null;
        let closestId = null;
        let closestDistSq = Infinity;

        for (const [id, obj] of Object.entries(drops)) {
            if (!obj?.pos) continue;

            const dx = obj.pos.x - px;
            const dy = obj.pos.y - py;
            const dz = obj.pos.z - pz;

            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq > reachSq || distSq >= closestDistSq) continue;

            closestDistSq = distSq;
            closest = obj;
            closestId = id;
        }

        if (!closest || closestId == null || closest.pickupRequested) return;

        gameWorld.server.sendData(packets.toServer.TIME_STEP_INFO, { p: [...closest.pos] });
        gameWorld.server.sendData(packets.toServer.PICKUP_DROP_ITEM, closestId);
        gameWorld.server.sendData(packets.toServer.TIME_STEP_INFO, { p: [...playerPos] });

        closest.pickupRequested = true;
    }
}
