import hooks from "../../../hooks";
import packets from "../../../packets";
import gameUtils from "../../../utils/gameUtils";
import Module from "../../Module";

export default class Killaura extends Module {
    constructor() {
        super("Killaura", "Combat", {
            "Y Offset": 1.62,
            "Reach": 10,
            "Delay": 100
        });
        this.lastExecutionTime = null;
    }

    onRender() {
        const currentTime = Date.now();
        let gameWorld = hooks.stores.get("gameState").gameWorld;
        if (!gameWorld?.player) return;
        if (currentTime - this.lastExecutionTime >= this.options["Delay"]) {
            this.lastExecutionTime = currentTime;
            this.tryKill();
        }
    }

    tryKill () {
        let reach = this.options["Reach"];
        let yOffset = this.options["Y Offset"];

        let gameWorld = hooks.stores.get("gameState").gameWorld;

        let targetPlayer = gameUtils.getClosestPlayer();
        let playerPosition = {
            x: gameWorld.player.position.x,
            y: gameWorld.player.position.y + yOffset,
            z: gameWorld.player.position.z
        };

        let targetPosition = targetPlayer?.position;

        if (!targetPosition) return;

        let direction = {
            x: playerPosition.x - targetPosition.x,
            y: playerPosition.y - targetPosition.y,
            z: playerPosition.z - targetPosition.z
        };

        let length = Math.sqrt(direction.x * direction.x + direction.y * direction.y + direction.z * direction.z);

        if (length !== 0) {
            direction.x /= length;
            direction.y /= length;
            direction.z /= length;
        }

        direction.x = -direction.x;
        direction.y = -direction.y;
        direction.z = -direction.z;

        let distance = Math.sqrt(
            Math.pow(playerPosition.x - targetPosition.x, 2) +
            Math.pow(playerPosition.y - targetPosition.y, 2) +
            Math.pow(playerPosition.z - targetPosition.z, 2)
        );

        if (distance < reach) {
            gameWorld.eventEmitter.emit(13); // attack anim
            gameWorld.server.sendData(packets.toServer.HIT, [
                playerPosition.x,
                playerPosition.y,
                playerPosition.z,
                direction.x,
                direction.y,
                direction.z,
                gameWorld.time.localServerTimeMs,
                targetPlayer.id
            ]);
        }
    }
}