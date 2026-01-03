import hooks from "../../../hooks";
import packets from "../../../packets";
import Module from "../../Module";

export default class Instabreak extends Module {
    constructor() {
        super("Instabreak", "World", {
            "Allow Bedrock": false
        });
    }

    onRender() {
        const gameWorld = hooks.stores.get("gameState").gameWorld;
        if (!gameWorld || !gameWorld?.chunkManager) return;

        const destroyingBlockXYZ = gameWorld.player?.destroyingBlockXYZ;
        if (!destroyingBlockXYZ) return;

        const blockId = gameWorld.chunkManager.getBlock(...destroyingBlockXYZ);

        if (blockId == null) return;

        const blockData = gameWorld.allItems?.[blockId];
        if (!blockData) return;

        if (!this.options["Allow Bedrock"] && blockData.name === "Bedrock") {
            return;
        }

        gameWorld.chunkManager.placeBlockWithMsgSending(...destroyingBlockXYZ, 0);
    }
}
