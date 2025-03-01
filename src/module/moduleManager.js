import events from "../events";
import ArrayList from "./modules/visual/Arraylist";
import hooks from "../hooks";

import Watermark from "./modules/visual/Watermark";
import ClickGUI from "./modules/visual/ClickGUI";
import Airjump from "./modules/movement/Airjump";
import Instabreak from "./modules/misc/Instabreak";
import SpoofBlock from "./modules/misc/SpoofBlock";
import Nuker from "./modules/misc/Nuker";
import SpoofLevel from "./modules/misc/SpoofLevel";
import Emote from "./modules/misc/Emote";
import AdBypass from "./modules/misc/AdBypass";
import Velocity from "./modules/movement/Velocity";
import NoHitDelay from "./modules/combat/NoHitDelay";
import Fly from "./modules/movement/Fly";
import NoFall from "./modules/movement/NoFall";
import Speed from "./modules/movement/Speed";
import FreeCoupons from "./modules/misc/FreeCoupons";
import Chams from "./modules/visual/Chams";
import Triggerbot from "./modules/combat/Triggerbot";
import Scaffold from "./modules/movement/Scaffold";
import Fill from "./modules/misc/Fill";
import NoClip from "./modules/movement/NoClip";
import Killaura from "./modules/combat/Killaura";
import BlockOutline from "./modules/visual/BlockOutline";
import TPAura from "./modules/combat/TPAura";

export default {
    modules: {},
    addModules: function (...modules) {
        for(const module of modules) this.modules[module.name] = module;
    },
    addModule: function (module) {
        this.modules[module.name] = module;
    },
    handleKeyPress: function (key) {
        for (let name in this.modules) {
            let module = this.modules[name];

            if (module.waitingForBind) {
                module.keybind = key;
                module.waitingForBind = false;
                
            } else if (module.keybind == key) {
                module.toggle();
            }
        }
    },

    init () {
        this.addModules(
            new ArrayList(),
            new Watermark(),
            new ClickGUI(),
            new Airjump(),
            new Instabreak(),
            new SpoofBlock(),
            new Nuker(),
            new SpoofLevel(),
            new Emote(),
            new AdBypass(),
            new Velocity(),
            new NoHitDelay(),
            new Fly(),
            new NoFall(),
            new Speed(),
            new FreeCoupons(),
            new Chams(),
            new Triggerbot(),
            new Scaffold(),
            new Fill(),
            new NoClip(),
            new Killaura(),
            new BlockOutline(),
            new TPAura
        );

        events.on("render", () => {
            for (let name in this.modules) {
                if (this.modules[name].isEnabled) {
                    this.modules[name].onRender();
                }
            }
        });

        events.on("keydown", this.handleKeyPress.bind(this));
        events.on("setting.update", () => {
            for (let name in this.modules) {
                if (this.modules[name].isEnabled) {
                    this.modules[name].onSettingUpdate();
                }
            }
        });

        
        this.modules["Arraylist"].enable();
        this.modules["Watermark"].enable();
    }
};