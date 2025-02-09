import Module from "../../module";
import hooks from "../../../hooks";

export default class Nuker extends Module {
    constructor() {
        super("Nuker", "Misc", {
            "Radius": 4,
            "Delay": 80
        });
        this.blockIndex = 0;
    }

    onEnable() {
        this.blockIndex = 0;
        let radius = this.options["Radius"];
        let blockPos = Object.values(hooks.gameWorld.player.position).splice(0, 3).map(Math.floor);

        let dx = -radius, dy = -radius, dz = -radius;
        let blocks = [];
        
        while (dx <= radius) {
            while (dy <= radius) {
                while (dz <= radius) {
                    if (Math.sqrt(dx * dx + dy * dy + dz * dz) <= radius) {
                        blocks.push([blockPos[0] + dx, blockPos[1] + dy, blockPos[2] + dz]);
                    }
                    dz++;
                }
                dz = -radius;
                dy++;
            }
            dy = -radius;
            dx++;
        }
        
        let context = this;
        let delay = this.options["Delay"];
        function breakNextBlock() {
            if (context.blockIndex < blocks.length) {
                const [newX, newY, newZ] = blocks[context.blockIndex];
                setTimeout(() => {
                    hooks.gameWorld.chunkManager.placeBlockWithMsgSending(newX, newY, newZ, 0);
                    context.blockIndex++;
                    breakNextBlock();
                }, delay);
            } else {
                context.blockIndex = 0;
            }
        }
        breakNextBlock();
    }
}