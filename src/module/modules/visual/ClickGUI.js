import Module from "../../Module.js";
import moduleManager from "../../moduleManager.js";
import events from "../../../events";
import Panel from "./components/Panel.js";
import colorUtils from "../../../utils/colorUtils.js";
import shadowWrapper from "../../../shadowWrapper.js";

export default class ClickGUI extends Module {
    constructor() {
        super("ClickGUI", "Visual", {
            "Accent Color 1": "#40beffff",
            "Accent Color 2": "#81e1ffff",
            "Button Color": "rgb(40, 40, 40, 0.9)",
            "Hover Color": "rgb(50, 50, 50, 0.9)",
            "Header Color": "rgb(0, 0, 0, 0.85)",
            "Panel Color": "rgb(18 18 18)",
            "Text Color": "#ffffff",
            "Glow Alpha": "0.8",
            "Enable Animations": true
        }, "ShiftRight");

        this.GUILoaded = false;
        this.panels = [];
        this.blurredBackground = null;
        this.updateColors();
    }

    updateAnimations() {
        if (this.options["Enable Animations"]) {
            shadowWrapper.wrapper.classList.add("with-animations");
        } else {
            shadowWrapper.wrapper.classList.remove("with-animations");
        }
    }

    updateColors() {
        const accentGradient = `linear-gradient(90deg, ${this.options["Accent Color 1"]} 0%, ${this.options["Accent Color 2"]} 100%)`;
        
        shadowWrapper.wrapper.style.setProperty('--Fentify-accent-color', accentGradient);
        shadowWrapper.wrapper.style.setProperty('--Fentify-accent-color', accentGradient);
        shadowWrapper.wrapper.style.setProperty('--Fentify-accent-color-1', this.options["Accent Color 1"]);
        shadowWrapper.wrapper.style.setProperty('--Fentify-accent-color-2', this.options["Accent Color 2"]);
        shadowWrapper.wrapper.style.setProperty('--Fentify-button-color', this.options["Button Color"]);
        shadowWrapper.wrapper.style.setProperty('--button-color', this.options["Button Color"]);
        shadowWrapper.wrapper.style.setProperty('--hover-color', this.options["Hover Color"]);
        shadowWrapper.wrapper.style.setProperty('--header-bg', this.options["Header Color"]);
        shadowWrapper.wrapper.style.setProperty('--panel-bg', this.options["Panel Color"]);
        shadowWrapper.wrapper.style.setProperty('--text-color', this.options["Text Color"]);
        shadowWrapper.wrapper.style.setProperty('--glow-color', colorUtils.hexToRGBA(this.options["Accent Color 1"], parseFloat(this.options["Glow Alpha"]), 1.2));
    }

    onEnable() {
        document.pointerLockElement && document.exitPointerLock();

        if (!this.GUILoaded) {
            this.setupBackground();
            this.createPanels();
            this.setupEventListeners();
            this.GUILoaded = true;
            this.updateAnimations();
        } else {
            this.showGUI();
            this.updateAnimations();
        }
    }

    setupBackground() {
        this.blurredBackground = document.createElement("div");
        this.blurredBackground.className = "gui-background";
        shadowWrapper.wrapper.appendChild(this.blurredBackground);
    }

    createPanels() {
        const panelConfigs = [
            { title: "Combat", position: { top: "100px", left: "100px" } },
            { title: "Movement", position: { top: "100px", left: "338px" } },
            { title: "Visual", position: { top: "100px", left: "576px" } },
            { title: "World", position: { top: "100px", left: "814px" } },
            { title: "Misc", position: { top: "100px", left: "1052px" } },
        ];

        this.panels.forEach(panel => {
            if (panel.panel && panel.panel.parentNode) {
                panel.panel.parentNode.removeChild(panel.panel);
            }
        });
        this.panels = [];

        panelConfigs.forEach(config => {
            const panel = new Panel(config.title, config.position);
            this.panels.push(panel);
        });

        const modulesByCategory = {};
        Object.values(moduleManager.modules).forEach(module => {
            if (!modulesByCategory[module.category]) {
                modulesByCategory[module.category] = [];
            }
            modulesByCategory[module.category].push(module);
        });

        Object.entries(modulesByCategory).forEach(([category, modules]) => {
            const panel = this.panels.find(p => p.header.textContent === category);
            if (!panel) return;

            const measure = document.createElement("span");
            measure.style.visibility = "hidden";
            measure.style.position = "absolute";
            measure.style.font = "'Product Sans', sans-serif";
            shadowWrapper.wrapper.appendChild(measure);

            modules.sort((a, b) => {
                measure.textContent = a.name;
                const widthA = measure.getBoundingClientRect().width;
                measure.textContent = b.name;
                const widthB = measure.getBoundingClientRect().width;
                return widthB - widthA;
            });

            measure.remove();
            modules.forEach(module => panel.addButton(module));
        });
    }

    setupEventListeners() {
        events.on("module.update", (module) => {
            const panel = this.panels.find(p => p.header.textContent === module.category);
            if (!panel) return;
            
            const button = panel.buttons.find(btn => btn.textContent === module.name);
            if (button) button.classList.toggle("enabled", module.isEnabled);
        });
    }

    showGUI() {
        this.panels.forEach(panel => panel.show());
        this.blurredBackground.style.display = "block";
    }

    returnToGame() {
        
    }

    onDisable() {
        this.panels.forEach(panel => panel.hide());
        this.blurredBackground.style.display = "none";
        this.returnToGame();
    }

    onSettingUpdate() {
        this.updateColors();
        this.updateAnimations();
    }
}