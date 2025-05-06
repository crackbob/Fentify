import Module from "../../module";
import hooks from "../../../hooks";
import moduleManager from "../../moduleManager";
import gameUtils from "../../../utils/gameUtils";

export default class Killaura extends Module {
    constructor() {
        super("Killaura", "Combat", {
            "Y Offset": 1.62,
            "Reach": 5,
            "Delay": 100
        });
        this.lastExecutionTime = null;
    }

    onRender() {
        const currentTime = Date.now();
        if (!hooks?.stores?.gameState?.gameWorld?.player) return;
        if (currentTime - this.lastExecutionTime >= this.options["Delay"]) {
            this.lastExecutionTime = currentTime;
            this.tryKill();
        }
    }

    tryKill () {
        let reach = this.options["Reach"];
        let yOffset = this.options["Y Offset"];

        let targetPlayer = gameUtils.getClosestPlayer();
        var playerPosition = {
            x: hooks.stores.gameState.gameWorld.player.position.x,
            y: hooks.stores.gameState.gameWorld.player.position.y + yOffset,
            z: hooks.stores.gameState.gameWorld.player.position.z
        };

        var targetPosition = targetPlayer.position;
        var direction = {
            x: playerPosition.x - targetPosition.x,
            y: playerPosition.y - targetPosition.y,
            z: playerPosition.z - targetPosition.z
        };

        var length = Math.sqrt(direction.x * direction.x + direction.y * direction.y + direction.z * direction.z);

        if (length !== 0) {
            direction.x /= length;
            direction.y /= length;
            direction.z /= length;
        }

        direction.x = -direction.x;
        direction.y = -direction.y;
        direction.z = -direction.z;

        var distance = Math.sqrt(
            Math.pow(playerPosition.x - targetPosition.x, 2) +
            Math.pow(playerPosition.y - targetPosition.y, 2) +
            Math.pow(playerPosition.z - targetPosition.z, 2)
        );

        if (distance < reach) {
            hooks.stores.gameState.gameWorld.server.sendData(61, [
                playerPosition.x,
                playerPosition.y,
                playerPosition.z,
                direction.x,
                direction.y,
                direction.z,
                hooks.stores.gameState.gameWorld.time.localServerTimeMs,
                targetPlayer.id
            ]);
        }
    }
}