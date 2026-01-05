import hooks from "./hooks";
import moduleManager from "./Module/moduleManager";
import shadowWrapper from "./shadowWrapper";

import clickGUICSS from "./module/modules/visual/styles/clickgui.css";
import events from "./events";
import packets from "./packets";
import gameUtils from "./utils/gameUtils";

function loadCSS (css) {
    const style = document.createElement('style');
    style.textContent = css;
    shadowWrapper.wrapper.appendChild(style);
}

loadCSS(clickGUICSS);

moduleManager.init();
packets.init();

document.addEventListener("keydown", (e) => {
    events.emit("keydown", e.code);
});

setInterval(() => {
    events.emit("render");
}, (1000 / 60));

let debug = false;

if (debug) {
    window.fentify = { hooks, shadowWrapper, moduleManager, packets };
    window.fentify.gameUtils = gameUtils;
}