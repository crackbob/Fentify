import Module from "../../module";

export default class Watermark extends Module {
    constructor () {
        super("Watermark", "Visual", {
            "Text": "Fendihfy"
        })
    }

    onSettingUpdate() {
        let watermarkElement = document.querySelector(".Fendihfy-overlay-title");
        if(watermarkElement) watermarkElement.textContent = this.options["Text"];
    }

    onEnable() {
        let watermarkElement = document.querySelector(".Fendihfy-overlay-title");
        if (!watermarkElement) {
            watermarkElement = document.createElement("div");
            watermarkElement.className = "Fendihfy-overlay-title";
            watermarkElement.textContent = this.options["Text"];
            watermarkElement.style.position = "absolute";
            watermarkElement.style.top = "0";
            watermarkElement.style.left = "0";
            watermarkElement.style.padding = "0.5em";
            watermarkElement.style.userSelect = "none";
            watermarkElement.style.display = "none";
            watermarkElement.style.zIndex = "1000";
            watermarkElement.style.textShadow = "var(--Fendihfy-accent-color) 0px 0px 10px";
            watermarkElement.style.fontFamily = "'Product Sans', sans-serif";
            watermarkElement.style.fontSize = "24px";
            watermarkElement.style.background = "var(--Fendihfy-accent-color)";
            watermarkElement.style.backgroundClip = "text";
            watermarkElement.style.webkitFontSmoothing = "antialiased";
            watermarkElement.style.webkitTextFillColor = "transparent";
            document.body.appendChild(watermarkElement);
        }

        document.querySelector(".Fendihfy-overlay-title").style.display = "flex";
    }

    onDisable() {
        document.querySelector(".Fendihfy-overlay-title").style.display = "none";
    }
};