import hooks from "../hooks";
import mathUtils from "./mathUtils";

export default {
    getClosestPlayer () {
        let localPlayerPos = hooks.gameWorld.player.position;
        let playersData = hooks.gameWorld.server.playerIdToData;
        let playersWithDistances = [];

        playersData.forEach(function(player, playerId) {
            let distance = mathUtils.distanceBetween(
                localPlayerPos,
                { x: player.position.x, y: player.position.y, z: player.position.z }
            );
            player.id = playerId;
            playersWithDistances.push({ player, distance });
        });

        playersWithDistances.sort((a, b) => a.distance - b.distance);

        return playersWithDistances.map(item => item.player)[0];
    }
}