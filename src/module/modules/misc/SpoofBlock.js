import Module from "../../module";
import hooks from "../../../hooks";

export default class SpoofBlock extends Module {
    constructor() {
        super("SpoofBlock", "Misc");
        this.blockID = 0;
    }

    onRender () {
        if (!hooks?.stores?.gameState?.gameWorld?.player) return;
        hooks.stores.itemsManager[1][hooks.stores.itemsManager.selectedItem][0] = this.blockID;
        hooks.stores.gameState.gameWorld.player.currentHandItemId = this.blockID;
    }

    onEnable () {
        let moduleContext = this;
        let menuContainer = document.createElement("div");
        menuContainer.className = "blockSelector";
        document.body.appendChild(menuContainer);

        let itemContainer = document.createElement("div");
        Object.assign(itemContainer.style, {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center"
        });
        menuContainer.appendChild(itemContainer);

        function addButton(id) {
            let button = document.createElement("button");
            Object.assign(button.style, {
                border: "none",
                background: "none",
                margin: "10px"
            });
            let img = document.createElement("img");
            Object.assign(img.style, {
                width: "40px",
                height: "40px",
                objectFit: "cover"
            });
            img.src = $assetsUrls["defaultSurvival/renderItems/" + id + ".png"];
            button.appendChild(img);
            button.addEventListener("click", () => {
                hooks.stores.itemsManager[1][hooks.stores.itemsManager.selectedItem][0] = id;
                hooks.stores.gameState.gameWorld.player.currentHandItemId = id;
                moduleContext.blockID = id;
                menuContainer.remove();
            });
            itemContainer.appendChild(button);
        }

        Object.keys(hooks.stores.gameState.gameWorld.allItems).forEach(key => addButton(key));
    }
}