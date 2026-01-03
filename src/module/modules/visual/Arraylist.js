import Module from "../../Module";
import moduleManager from "../../moduleManager";
import events from "../../../events";
import colorUtils from "../../../utils/colorUtils";
import shadowWrapper from "../../../shadowWrapper";

export default class ArrayList extends Module {
    constructor() {
        super("Arraylist", "Visual", {
            "Opacity": 1,
            "Background Opacity": 0.1,
            "Darkness Multiplier": 0.3,
            "Accent Darkness": 0.5,
            "Blur": 1,
        });
        this.namesMap = {};
        this.arraylistContainer = null;
        this.initialized = false;
    }

    getAccentColors() {
        const styles = getComputedStyle(shadowWrapper.wrapper);
        return ['--Fentify-accent-color-1', '--Fentify-accent-color-2'].map(v => styles.getPropertyValue(v).trim());
    }

    update(name, enabled) {
        if (enabled) {
            if (!this.namesMap[name]) {
                let moduleElement = document.createElement("div");

                let accentColors = this.getAccentColors();
                let bgOpacity = parseFloat(this.options["Background Opacity"]);
                let darknessMultiplier = parseFloat(this.options["Darkness Multiplier"]);
                let accentDarkness = parseFloat(this.options["Accent Darkness"]);
                let blur = parseFloat(this.options["Blur"]);

                moduleElement.style.background = `linear-gradient(to right, ${colorUtils.hexToRGBA(accentColors[0], bgOpacity, accentDarkness)}, ${colorUtils.hexToRGBA(accentColors[1], bgOpacity + 0.2, accentDarkness + 0.2)})`;
                moduleElement.style.backdropFilter = `blur(${blur}px) brightness(${darknessMultiplier})`;
                moduleElement.style.color = "white";
                moduleElement.style.padding = "2px 10px";
                moduleElement.style.display = "flex";
                moduleElement.style.alignItems = "center";
                moduleElement.style.boxSizing = "border-box";
                moduleElement.style.margin = "0";
                moduleElement.style.lineHeight = "1"
                moduleElement.style.gap = "0";
                moduleElement.style.fontFamily = "'Product Sans', sans-serif";
                moduleElement.style.boxShadow = "rgb(0, 0, 0, 0.05) -5px 1px";
                moduleElement.style.transition = "opacity 0.2s ease-in-out, max-height 0.2s ease-in-out";
                moduleElement.style.overflow = "hidden";
                moduleElement.style.maxHeight = "0";
                moduleElement.style.opacity = parseFloat(this.options["Opacity"]);

                let textElem = document.createElement("span");
                textElem.style.fontWeight = "800";
                textElem.style.fontSize = "16px";
                textElem.style.backgroundImage = "var(--Fentify-accent-color)";
                textElem.style.color = "transparent";
                textElem.style.backgroundClip = "text";
                textElem.style.webkitBackgroundClip = "text";
                textElem.innerHTML = name;
                moduleElement.appendChild(textElem);

                this.arraylistContainer.appendChild(moduleElement);

                setTimeout(() => {
                    moduleElement.style.maxHeight = "50px";
                    moduleElement.style.opacity = "1";
                }, 1);

                this.namesMap[name] = moduleElement;
            }
        } else {
            if (this.namesMap[name]) {
                const moduleElement = this.namesMap[name];
                moduleElement.style.maxHeight = "0";
                moduleElement.style.opacity = "0";

                setTimeout(() => {
                    if (this.arraylistContainer.contains(moduleElement)) {
                        this.arraylistContainer.removeChild(moduleElement);
                    }
                    delete this.namesMap[name];
                }, 200);
            }
        }

        const sortedElements = Object.values(this.namesMap).sort(
            (a, b) => this.measureElementWidth(b) - this.measureElementWidth(a)
        );

        this.arraylistContainer.innerHTML = '';
        sortedElements.forEach(element => this.arraylistContainer.appendChild(element));
    }

    onEnable() {
        if (!this.initialized) {
            this.arraylistContainer = document.createElement("div");
            this.arraylistContainer.style.flexDirection = "column";
            this.arraylistContainer.style.display = "flex";
            this.arraylistContainer.style.gap = "0";
            this.arraylistContainer.style.lineHeight = "0";
            this.arraylistContainer.style.position = "absolute";
            this.arraylistContainer.style.zIndex = "1000";
            this.arraylistContainer.style.right = "5px";
            this.arraylistContainer.style.top = "5px";
            this.arraylistContainer.style.alignItems = "flex-end";
            this.arraylistContainer.style.pointerEvents = "none";
            this.arraylistContainer.style.textTransform = "lowercase";

            this.arraylistContainer.style.border = "2px solid transparent";
            this.arraylistContainer.style.borderImage = "var(--Fentify-accent-color)";
            this.arraylistContainer.style.borderImageSlice = "1";
            this.arraylistContainer.style.borderBottom = "0";
            this.arraylistContainer.style.borderLeft = "0";

            shadowWrapper.wrapper.appendChild(this.arraylistContainer);

            events.on("module.update", (module) => {
                this.update(module.name, module.isEnabled);
            });

            this.initialized = true;
        } else {
            this.arraylistContainer.style.opacity = "1";
        }
    }

    onSettingUpdate(mod) {
        if (mod == "ClickGUI" || mod == "Arraylist") {
            let accentColors = this.getAccentColors();
            let bgOpacity = parseFloat(this.options["Background Opacity"]);
            let darknessMultiplier = parseFloat(this.options["Darkness Multiplier"]);
            let accentDarkness = parseFloat(this.options["Accent Darkness"]);
            let blur = parseFloat(this.options["Blur"]);

            Object.values(this.namesMap).forEach(element => {
                element.style.background = `linear-gradient(to right, ${colorUtils.hexToRGBA(accentColors[0], bgOpacity, accentDarkness)}, ${colorUtils.hexToRGBA(accentColors[1], bgOpacity + 0.2, accentDarkness + 0.2)})`;
                element.style.backdropFilter = `blur(${blur}px) brightness(${darknessMultiplier})`;
                element.style.opacity = parseFloat(this.options["Opacity"]);
            });
        }
    }

    measureElementWidth(element) {
        return element.getBoundingClientRect().width;
    }

    onDisable() {
        this.arraylistContainer.style.opacity = "0";
    }
}
