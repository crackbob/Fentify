import events from "./events";

export default {
    "init" () {
        this.appendHook = (name, hook) => this[name] = hook;
        let fnString = document.querySelector("#app").__vue_app__._context.config.globalProperties.$router.options.routes[0].children[0].component.toString();
        this.chunks = eval("[" + fnString.split('[')[1].replace(")", "").split(",")).filter(src => src.includes(".js"));
        this.importedModules = [];

        Function(`
            async function initHooks() {
                await Promise.all(this.chunks.map(async (src) => {
                    const module = await import("https://vectaria.io/" + src);
                    Object.values(module).forEach((mod) => {
                        this.importedModules.push(mod);
                    });
                }));
                let targetClass = this.importedModules.find(m => m?.prototype?.execute);
                let _execute = targetClass.prototype.execute;
                let appendHook = this.appendHook;
                targetClass.prototype.execute = function () {
                    appendHook("gameWorld", this.gameWorld);
                    targetClass.prototype.execute = _execute;
                    return _execute.apply(this, arguments);
                };
            }
            initHooks.appendHook = this.appendHook;
            initHooks.chunks = this.chunks;
            initHooks.importedModules = this.importedModules;
            return initHooks;
        `)().bind(this)();
    }
}