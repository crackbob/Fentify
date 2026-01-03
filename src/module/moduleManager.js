import events from "../events";
import HitMultiplier from "./modules/combat/HitMultiplier";
import Killaura from "./modules/combat/Killaura";
import NoHitDelay from "./modules/combat/NoHitDelay";
import SixSevenExploit from "./modules/misc/67Exploit";
import AdBypass from "./modules/misc/AdBypass";
import FreeCoupons from "./modules/misc/FreeCoupons";
import InstantRespawn from "./modules/misc/InstantRespawn";
import NoFall from "./modules/misc/NoFall";
import NoHunger from "./modules/misc/NoHunger";
import Airjump from "./modules/movement/AirJump";
import AutoSprint from "./modules/movement/AutoSprint";
import Fly from "./modules/movement/Fly";
import HighJump from "./modules/movement/HighJump";
import NoClip from "./modules/movement/NoClip";
import Speed from "./modules/movement/Speed";
import Velocity from "./modules/movement/Velocity";
import ArrayList from "./modules/visual/Arraylist";
import ClickGUI from "./modules/visual/ClickGUI";

import Watermark from "./modules/visual/Watermark";
import Crasher from "./modules/world/Crasher";
import Instabreak from "./modules/world/Instabreak";
import PickupReach from "./modules/world/PickupReach";
import Scaffold from "./modules/world/Scaffold";
import Timer from "./modules/world/Timer";

export default {
    modules: {},
    addModules: function (...modules) {
        for(const module of modules) {
            let moduleInstance = new module;
            this.modules[moduleInstance.name] = moduleInstance;
        }
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
            } else if (key && module.keybind == key) {
                module.toggle();
            }
        }
    },

    init () {
        this.addModules(

            // visual
            Watermark,
            ClickGUI,
            ArrayList,

            // movement
            Fly,
            Airjump,
            Speed,
            Velocity,
            AutoSprint,
            HighJump,
            NoClip,

            // world
            Instabreak,
            Timer,
            Crasher,
            Scaffold,
            PickupReach,

            // combat
            Killaura,
            NoHitDelay,
            HitMultiplier,

            // misc
            SixSevenExploit,
            AdBypass,
            InstantRespawn,
            NoFall,
            NoHunger,
            FreeCoupons
        );

        events.on("render", () => {
            for (let name in this.modules) {
                if (this.modules[name].isEnabled) {
                    this.modules[name].onRender();
                }
            }
        });

        events.on("keydown", this.handleKeyPress.bind(this));
        events.on("setting.update", data => {
            for (let name in this.modules) {
                if (this.modules[name].isEnabled || data.moduleName === name) {
                    this.modules[name].onSettingUpdate(data.moduleName, data.setting, data.value);
                }
            }
        });

        this.modules["Arraylist"].enable();
        this.modules["Watermark"].enable();
    }
};