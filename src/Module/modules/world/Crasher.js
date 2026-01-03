import hooks from "../../../hooks";
import packets from "../../../packets";
import gameUtils from "../../../utils/gameUtils";
import Module from "../../Module";

export default class Crasher extends Module {
    constructor() {
        super("Crasher", "World", {
            "Times": 3
        });
    }

    onEnable () {
        let times = parseInt(this.options["Times"]);
        let gameWorld = hooks.stores.get("gameState").gameWorld;
        let closestPlayer = gameUtils.getClosestPlayer();

        let target = gameWorld.player;

        if (closestPlayer) {
            let distance = Math.sqrt(
                Math.pow(gameWorld.player.position.x - closestPlayer.position.x, 2) +
                Math.pow(gameWorld.player.position.y - closestPlayer.position.y, 2) +
                Math.pow(gameWorld.player.position.z - closestPlayer.position.z, 2)
            );

            if (distance <= 10) {
                target = closestPlayer;
            }
        }

        let payload = [
            ...target.position,
            100000000,
            100000000,
            100000000,
            gameWorld.time.localServerTimeMs,
            target?.id || gameWorld.player.serverId
        ];

        for (let i = 0; i < times - 1; i++) {
            gameWorld.server.sendData(packets.toServer.HIT, payload);
        }

        this.disable();
    }
}