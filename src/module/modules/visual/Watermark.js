import shadowWrapper from "../../../shadowWrapper";
import Module from "../../Module";

export default class Watermark extends Module {
    constructor () {
        super("Watermark", "Visual", {
            "Text": "Fentify"
        }, "")
        this.watermarkElement = null;
        this.mainText = null;
    }

    onSettingUpdate() {
        if(this.mainText) this.mainText.textContent = this.options["Text"];
    }

    onEnable() {
        if (!this.watermarkElement) {
            let watermarkElement = document.createElement("div");
            watermarkElement.style.position = "absolute";
            watermarkElement.style.top = "0";
            watermarkElement.style.left = "0";
            watermarkElement.style.padding = "0.5em";
            watermarkElement.style.userSelect = "none";
            watermarkElement.style.display = "flex";
            watermarkElement.style.zIndex = "999999";
            watermarkElement.style.fontFamily = "'Product Sans', sans-serif";
            watermarkElement.style.fontSize = "24px";
            watermarkElement.style.backgroundClip = "text";
            watermarkElement.style.webkitFontSmoothing = "antialiased";
            watermarkElement.style.webkitTextFillColor = "transparent";
            watermarkElement.style.textShadow = "var(--Fentify-accent-color) 0px 0px 10px";
            watermarkElement.style.background = "var(--Fentify-accent-color)";
            watermarkElement.style.backgroundClip = "text";

            this.mainText = document.createElement("span");
            this.mainText.textContent = "Fentify";

            let versionText = document.createElement("span");
            versionText.textContent = "v2";
            versionText.style.fontSize = "14px";
            versionText.style.paddingBottom = "15px";
            versionText.style.marginLeft = "4px";
            versionText.style.alignSelf = "flex-end";

            watermarkElement.appendChild(this.mainText);
            watermarkElement.appendChild(versionText);

            shadowWrapper.wrapper.appendChild(watermarkElement);
            this.watermarkElement = watermarkElement;
        }

        this.watermarkElement.style.display = "flex";
    }

    onDisable() {
        this.watermarkElement.style.display = "none";
    }
};