import Module from "../../module";
import hooks from "../../../hooks";
import stores from "../../../utils/stores";

export default class SpoofBlock extends Module {
    constructor() {
        super("SpoofBlock", "Misc");
        this.blockID = 0;
    }

    onRender () {
        stores.itemMgrStore[1][stores.itemMgrStore.selectedItem][0] = this.blockID;
        hooks.gameWorld.player.currentHandItemId = this.blockID;
    }

    onEnable () {
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
                stores.itemMgrStore[1][stores.itemMgrStore.selectedItem][0] = id;
                hooks.gameWorld.player.currentHandItemId = id;
                this.blockID = id;
                menuContainer.remove();
            });
            itemContainer.appendChild(button);
        }

        Object.keys(hooks.gameWorld.allItems).forEach(key => addButton(key));
    }
}