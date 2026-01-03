import eventListener from "../events"

export default class Module {
    constructor(name, category, options, keybind) {
        this.name = name;
        this.category = category;
        this.options = options;
        this.keybind = keybind;
        this.waitingForBind = false;
        this.isEnabled = false;
        this.modes = {};
        this.toggle = this.toggle.bind(this);
    }

    registerMode(settingName, modeOptions) {
        this.modes[settingName] = modeOptions;
    }

    onEnable () {}
    onDisable() {}
    onRender() {}
    onSettingUpdate() {}
    onChunkAdded() {}
    onChunkRemoved() {}

    onGameEntered() {}
    onGameExited() {}
    onNoaTick () {}

    enable () {
        this.isEnabled = true;
        eventListener.emit("module.update", this);
        eventListener.emit("module.toggle", { name: this.name, enabled: true });
        this.onEnable();
    }

    disable () {
        this.isEnabled = false;
        eventListener.emit("module.update", this);
        eventListener.emit("module.toggle", { name: this.name, enabled: false });
        this.onDisable();
    }

    toggle () {
        if (this.isEnabled) {
            this.disable();
        } else {
            this.enable();
        }
    };
};