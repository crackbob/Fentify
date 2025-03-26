import Module from "../../module";
import hooks from "../../../hooks";
import moduleManager from "../../moduleManager";

export default class Fill extends Module {
    constructor() {
        super("Fill", "Misc", {
            "Radius": 4,
            "Delay": 120
        });
        this.blockIndex = 0;
    }

    onEnable() {
        this.blockIndex = 0;
        let radius = this.options["Radius"];
        let blockUnderPlayer = Object.values(hooks.stores.gameState.gameWorld.player.position).map(Math.floor);
        blockUnderPlayer[1]--;

        let dx = -radius, dy = -radius, dz = -radius;
        let blocks = [];
        
        while (dx <= radius) {
            while (dy <= radius) {
                while (dz <= radius) {
                    if (Math.sqrt(dx * dx + dy * dy + dz * dz) <= radius) {
                        let blockPos = [blockUnderPlayer[0] + dx, blockUnderPlayer[1] + dy, blockUnderPlayer[2] + dz];
                        let blockID = hooks.stores.gameState.gameWorld.chunkManager.getBlock(...blockPos);
                        let replaceable = hooks.stores.gameState.gameWorld.allItems[blockID]?.replaceable || false;

                        if (replaceable || blockID == 0) {
                            blocks.push(blockPos);
                        }
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
        function placeNextBlock() {
            let blockId = hooks.stores.gameState.gameWorld.player.currentHandItemId;
            if (context.blockIndex < blocks.length) {
                const [newX, newY, newZ] = blocks[context.blockIndex];
                setTimeout(() => {
                    hooks.stores.gameState.gameWorld.chunkManager.placeBlockWithMsgSending(newX, newY, newZ, blockId);
                    context.blockIndex++;
                    placeNextBlock();
                }, delay);
            } else {
                context.blockIndex = 0;
                moduleManager.modules["Fill"].disable();
            }
        }
        placeNextBlock();
    }
}