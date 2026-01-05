(()=>{var a={get stores(){if(this._stores)return this._stores;{let i=app._vnode.component.appContext.provides,e=i[Object.getOwnPropertySymbols(i).find(t=>i[t]._s)];return this._stores=e._s}}};var m={listeners:{},activeKeys:new Set,on:function(i,e){this.listeners[i]||(this.listeners[i]=[]),this.listeners[i].push(e)},remove:function(i,e){this.listeners[i]&&(this.listeners[i]=this.listeners[i].filter(t=>t!==e))},emit:function(i,e){this.listeners[i]&&this.listeners[i].forEach(t=>t(e))},trackKey:function(i,e,t){i==="keydown"&&moduleManager.handleKeyPress(t),i==="keydown"&&!this.activeKeys.has(e)&&(this.activeKeys.add(e),this.emit("keyPress",{key:e,code:t})),i==="keyup"&&this.activeKeys.has(e)&&(this.activeKeys.delete(e),this.emit("keyRelease",{key:e,code:t}))}};var g={toServer:{TIME_STEP_INFO:5,PICKUP_DROP_ITEM:40,HIT:61},listeners:{},packetListener(i,e){Object.values(this.listeners).forEach(t=>{let o=t(i,e);o!=null&&(e=o)}),a.stores.get("gameState").gameWorld.server.msgsToSend.push(i,e)},init(){m.on("render",()=>{a?.stores?.get("gameState")?.gameWorld?.server?.sendData&&(a.stores.get("gameState").gameWorld.server.sendData=this.packetListener.bind(this))})}};var l=class{constructor(e,t,o,r){this.name=e,this.category=t,this.options=o,this.keybind=r,this.waitingForBind=!1,this.isEnabled=!1,this.modes={},this.toggle=this.toggle.bind(this)}registerMode(e,t){this.modes[e]=t}onEnable(){}onDisable(){}onRender(){}onSettingUpdate(){}onChunkAdded(){}onChunkRemoved(){}onGameEntered(){}onGameExited(){}onNoaTick(){}enable(){this.isEnabled=!0,m.emit("module.update",this),m.emit("module.toggle",{name:this.name,enabled:!0}),this.onEnable()}disable(){this.isEnabled=!1,m.emit("module.update",this),m.emit("module.toggle",{name:this.name,enabled:!1}),this.onDisable()}toggle(){this.isEnabled?this.disable():this.enable()}};var E=class extends l{constructor(){super("HitMultiplier","Combat",{Times:10})}onEnable(){a.stores.get("gameState").gameWorld?.player&&(g.listeners.HitMultiplier=function(e,t){if(e==g.toServer.HIT)for(let o=0;o<parseInt(this.options.Times);o++)setTimeout(()=>{a.stores.get("gameState").gameWorld.server.msgsToSend.push(g.toServer.HIT,t)},o*100)})}onDisable(){delete g.listeners.HitMultiplier}};var Q={normalizeVector(i){let e=i.x*i.x+i.y*i.y+i.z*i.z;if(e>0){let t=1/Math.sqrt(e);return[i.x*t,i.y*t,i.z*t]}return i},distanceBetween(i,e){let t=e.x-i.x,o=e.y-i.y,r=e.z-i.z;return t*t+o*o+r*r},distanceBetweenSqrt(i,e){return Math.sqrt(this.distanceBetween(i,e))}};var v={getClosestPlayer(){let i=a.stores.get("gameState").gameWorld,e=i.player.position,t=i.server.players,o=[];return t.forEach(function(r,s){let n=Q.distanceBetween(e,{x:r.position.x,y:r.position.y,z:r.position.z});r.id=s,o.push({player:r,distance:n})}),o.sort((r,s)=>r.distance-s.distance),o.map(r=>r.player)[0]}};var S=class extends l{constructor(){super("Killaura","Combat",{"Y Offset":1.62,Reach:10,Delay:100}),this.lastExecutionTime=null}onRender(){let e=Date.now();a.stores.get("gameState").gameWorld?.player&&e-this.lastExecutionTime>=this.options.Delay&&(this.lastExecutionTime=e,this.tryKill())}tryKill(){let e=this.options.Reach,t=this.options["Y Offset"],o=a.stores.get("gameState").gameWorld,r=v.getClosestPlayer(),s={x:o.player.position.x,y:o.player.position.y+t,z:o.player.position.z},n=r?.position;if(!n)return;let p={x:s.x-n.x,y:s.y-n.y,z:s.z-n.z},u=Math.sqrt(p.x*p.x+p.y*p.y+p.z*p.z);u!==0&&(p.x/=u,p.y/=u,p.z/=u),p.x=-p.x,p.y=-p.y,p.z=-p.z,Math.sqrt(Math.pow(s.x-n.x,2)+Math.pow(s.y-n.y,2)+Math.pow(s.z-n.z,2))<e&&(o.eventEmitter.emit(13),o.server.sendData(g.toServer.HIT,[s.x,s.y,s.z,p.x,p.y,p.z,o.time.localServerTimeMs,r.id]))}};var M=class extends l{constructor(){super("NoHitDelay","Combat")}onRender(){let e=a.stores.get("gameState")?.gameWorld?.systemsManager?.activeSystems.find(t=>t?.lastAttackTimeMs!==void 0);e&&(e.attackTimeDelayMs=0)}};var D=class extends l{constructor(){super("67Exploit","Misc")}onEnable(){a.stores.get("gameState").gameWorld.server.sendData(67,{type:1}),this.disable()}};var W=class extends l{constructor(){super("AdBypass","Misc")}onEnable(){this._reward=this._reward||a.stores.get("user").rewardCommercialVideoWrapper,a.stores.get("user").rewardCommercialVideoWrapper=()=>Promise.resolve(!0)}onDisable(){a.stores.get("user").rewardCommercialVideoWrapper=this._reward}};var L=class extends l{constructor(){super("FreeCoupons","Misc")}onEnable(){fetch("https://api.vectaria.io/v2/users/getAdCoupons",{credentials:"include"}).then(e=>{e.ok?a.stores.get("user").user.coupons+=10:alert("Reached Daily limit")}),this.disable()}};var z=class extends l{constructor(){super("InstantRespawn","Misc",null)}onRender(){if(!a.stores.get("gameState").gameWorld?.player)return;let e=a.stores.get("playerState");e.isDeath&&(e.respawn(),e.isDeath=!1)}};var P=class extends l{constructor(){super("NoFall","Misc",null)}onEnable(){a.stores.get("gameState").gameWorld?.player&&(g.listeners.NoFall=function(e,t){e==g.toServer.TIME_STEP_INFO&&t.v&&delete t.v})}onDisable(){delete g.listeners.NoFall}};var B=class extends l{constructor(){super("NoHunger","Misc",null)}onEnable(){a.stores.get("gameState").gameWorld?.player&&(g.listeners.NoHunger=function(e,t){e==g.toServer.TIME_STEP_INFO&&(t.m&&delete t.m,t.j&&delete t.j,t.b&&delete t.b)})}onDisable(){delete g.listeners.NoHunger}};var I=class extends l{constructor(){super("Airjump","Movement",null)}onRender(){a.stores.get("gameState").gameWorld?.player&&(a.stores.get("gameState").gameWorld.player.collision.isGrounded=!0)}};var T=class extends l{constructor(){super("AutoSprint","Movement",null)}onRender(){a.stores.get("gameState").gameWorld?.player&&(a.stores.get("gameState").gameWorld.player.velocity.speedBoosted=!0)}};var N=class extends l{constructor(){super("Fly","Movement",{"Vertical Speed":5})}onRender(){if(!a.stores.get("gameState").gameWorld?.player)return;let e=a.stores.get("gameState").gameWorld;e.player.velocity.gravity=0,e.player.inputs.jump?e.player.velocity.velVec3.y=this.options["Vertical Speed"]:e.player.inputs.crouch?e.player.velocity.velVec3.y=-this.options["Vertical Speed"]:e.player.velocity.velVec3.y=0}onDisable(){a.stores.get("gameState").gameWorld.player.velocity.gravity=23}};var F=class extends l{constructor(){super("HighJump","Movement",{"Jump Height":25})}onRender(){a._stores.get("gameState").gameWorld.player.velocity.jumpSpeed=parseFloat(this.options["Jump Height"])}onDisable(){a._stores.get("gameState").gameWorld.player.velocity.jumpSpeed=7.692307692307692}};var H=class extends l{constructor(){super("NoClip","Movement")}get playerPhysicsSystem(){return a.stores.get("gameState").gameWorld.systemsManager.activeSystems.find(e=>e?.playerPhysicsSystem).playerPhysicsSystem}onRender(){a.stores.get("gameState")?.gameWorld?.player&&(this._og=this._og||this.playerPhysicsSystem.resolveBlockCollision,this.playerPhysicsSystem.resolveBlockCollision==this._og&&(this.playerPhysicsSystem.resolveBlockCollision=()=>{}))}onDisable(){this.playerPhysicsSystem.resolveBlockCollision=this._og}};var A=class extends l{constructor(){super("Speed","Movement",{Speed:15})}onRender(){a.stores.get("gameState").gameWorld.player.velocity.moveSpeed=this.options.Speed,a.stores.get("gameState").gameWorld.player.velocity.fastMoveSpeed=this.options.Speed}onDisable(){a.stores.get("gameState").gameWorld.player.velocity.moveSpeed=4.5,a.stores.get("gameState").gameWorld.player.velocity.fastMoveSpeed=6.4}};var R=class extends l{constructor(){super("Velocity","Movement",null)}get serverPacketHandlers(){return a.stores.get("gameState").gameWorld.server.msgsListeners}get velocityPacket(){return Object.keys(this.serverPacketHandlers).find(e=>this.serverPacketHandlers[e].toString().includes("velocity"))}onEnable(){this.velocityHandler=this.velocityHandler||this.serverPacketHandlers[this.velocityPacket],this.serverPacketHandlers[this.velocityPacket]=()=>{}}onDisable(){this.serverPacketHandlers[this.velocityPacket]=this.velocityHandler}};var x={parseRGBString(i){let e=i.replaceAll("rgb","").replaceAll("a","").replaceAll("(","").replaceAll(")","").replaceAll(" ","").split(",");return{r:parseFloat(e?.[0]||1),g:parseFloat(e?.[1]||1),b:parseFloat(e?.[2]||1),a:parseFloat(e?.[3]||1)}},normalizeColor(i){return i?i.r<=1&&i.g<=1&&i.b<=1?i:{r:i.r/255,g:i.g/255,b:i.b/255}:{r:1,g:1,b:1}},hexToRGBA(i,e=1,t=1){let o=i.startsWith("#")?i.substring(1):i;o.length===3&&(o=o.split("").map(p=>p+p).join(""));let r=parseInt(o.substring(0,2),16)*t,s=parseInt(o.substring(2,4),16)*t,n=parseInt(o.substring(4,6),16)*t;return`rgba(${Math.round(r)}, ${Math.round(s)}, ${Math.round(n)}, ${e})`},hexToRgb(i){var e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(i);return e?{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16)}:null}};var d={instance:null,get wrapper(){if(!this.instance){let i=document.createElement("iframe");document.body.appendChild(i);let e=i.contentWindow.Element.prototype.attachShadow;i.remove();let t=document.createElement("div");this.root=e.apply(t,[{mode:"closed"}]);let o=document.createElement("div");this.root.appendChild(o),this.instance=o,document.body.appendChild(t)}return this.instance}};var O=class extends l{constructor(){super("Arraylist","Visual",{Opacity:1,"Background Opacity":.1,"Darkness Multiplier":.3,"Accent Darkness":.5,Blur:1}),this.namesMap={},this.arraylistContainer=null,this.initialized=!1}getAccentColors(){let e=getComputedStyle(d.wrapper);return["--Fentify-accent-color-1","--Fentify-accent-color-2"].map(t=>e.getPropertyValue(t).trim())}update(e,t){if(t){if(!this.namesMap[e]){let r=document.createElement("div"),s=this.getAccentColors(),n=parseFloat(this.options["Background Opacity"]),p=parseFloat(this.options["Darkness Multiplier"]),u=parseFloat(this.options["Accent Darkness"]),h=parseFloat(this.options.Blur);r.style.background=`linear-gradient(to right, ${x.hexToRGBA(s[0],n,u)}, ${x.hexToRGBA(s[1],n+.2,u+.2)})`,r.style.backdropFilter=`blur(${h}px) brightness(${p})`,r.style.color="white",r.style.padding="2px 10px",r.style.display="flex",r.style.alignItems="center",r.style.boxSizing="border-box",r.style.margin="0",r.style.lineHeight="1",r.style.gap="0",r.style.fontFamily="'Product Sans', sans-serif",r.style.boxShadow="rgb(0, 0, 0, 0.05) -5px 1px",r.style.transition="opacity 0.2s ease-in-out, max-height 0.2s ease-in-out",r.style.overflow="hidden",r.style.maxHeight="0",r.style.opacity=parseFloat(this.options.Opacity);let f=document.createElement("span");f.style.fontWeight="800",f.style.fontSize="16px",f.style.backgroundImage="var(--Fentify-accent-color)",f.style.color="transparent",f.style.backgroundClip="text",f.style.webkitBackgroundClip="text",f.innerHTML=e,r.appendChild(f),this.arraylistContainer.appendChild(r),setTimeout(()=>{r.style.maxHeight="50px",r.style.opacity="1"},1),this.namesMap[e]=r}}else if(this.namesMap[e]){let r=this.namesMap[e];r.style.maxHeight="0",r.style.opacity="0",setTimeout(()=>{this.arraylistContainer.contains(r)&&this.arraylistContainer.removeChild(r),delete this.namesMap[e]},200)}let o=Object.values(this.namesMap).sort((r,s)=>this.measureElementWidth(s)-this.measureElementWidth(r));this.arraylistContainer.innerHTML="",o.forEach(r=>this.arraylistContainer.appendChild(r))}onEnable(){this.initialized?this.arraylistContainer.style.opacity="1":(this.arraylistContainer=document.createElement("div"),this.arraylistContainer.style.flexDirection="column",this.arraylistContainer.style.display="flex",this.arraylistContainer.style.gap="0",this.arraylistContainer.style.lineHeight="0",this.arraylistContainer.style.position="absolute",this.arraylistContainer.style.zIndex="1000",this.arraylistContainer.style.right="5px",this.arraylistContainer.style.top="5px",this.arraylistContainer.style.alignItems="flex-end",this.arraylistContainer.style.pointerEvents="none",this.arraylistContainer.style.textTransform="lowercase",this.arraylistContainer.style.border="2px solid transparent",this.arraylistContainer.style.borderImage="var(--Fentify-accent-color)",this.arraylistContainer.style.borderImageSlice="1",this.arraylistContainer.style.borderBottom="0",this.arraylistContainer.style.borderLeft="0",d.wrapper.appendChild(this.arraylistContainer),m.on("module.update",e=>{this.update(e.name,e.isEnabled)}),this.initialized=!0)}onSettingUpdate(e){if(e=="ClickGUI"||e=="Arraylist"){let t=this.getAccentColors(),o=parseFloat(this.options["Background Opacity"]),r=parseFloat(this.options["Darkness Multiplier"]),s=parseFloat(this.options["Accent Darkness"]),n=parseFloat(this.options.Blur);Object.values(this.namesMap).forEach(p=>{p.style.background=`linear-gradient(to right, ${x.hexToRGBA(t[0],o,s)}, ${x.hexToRGBA(t[1],o+.2,s+.2)})`,p.style.backdropFilter=`blur(${n}px) brightness(${r})`,p.style.opacity=parseFloat(this.options.Opacity)})}}measureElementWidth(e){return e.getBoundingClientRect().width}onDisable(){this.arraylistContainer.style.opacity="0"}};var _=class{constructor(e,t){this.module=e,this.container=t,this.components=[],this.initialized=!1,this.isOpen=!1,this.activeDropdown=null,this.currentOptionsList=null,this.activeDropdownListeners=null}initialize(){if(this.initialized||!this.module?.options)return;this.settingsWrapper=document.createElement("div"),this.settingsWrapper.className="module-settings-wrapper",this.container.appendChild(this.settingsWrapper),this.settingsContainer=document.createElement("div"),this.settingsContainer.className="module-settings scrollable",this.settingsWrapper.appendChild(this.settingsContainer),this.container.style.position="relative";let e=Object.keys(this.module.options),t=this.groupSettings(e);this.createSettings(t),this.initialized=!0}groupSettings(e){return e.reduce((t,o)=>{let r=this.module.options[o],s=typeof r;return o.toLowerCase().includes("color")?t.color.push(o):this.module.modes&&this.module.modes[o]?t.mode.push(o):s==="boolean"||r==="true"||r==="false"?t.boolean.push(o):t.other.push(o),t},{boolean:[],mode:[],other:[],color:[]})}createSettings(e){[...e.boolean,...e.mode,...e.other,...e.color].forEach(t=>{let o=this.module.options[t],r=typeof o;t.toLowerCase().includes("color")?this.addColorPicker(t):this.module.modes&&this.module.modes[t]?this.addModeSelector(t):r==="boolean"||o==="true"||o==="false"?this.addCheckbox(t):r==="string"?this.addStringInput(t):this.addNumberInput(t)})}toggle(){this.isOpen=!this.isOpen,this.isOpen&&this.settingsWrapper?.classList?(this.settingsWrapper.classList.add("module-settings-open"),this.checkPositionWithinViewport()):this.settingsWrapper?.classList&&(this.settingsWrapper.classList.remove("module-settings-open"),this.closeAllDropdowns())}checkPositionWithinViewport(){if(!this.settingsWrapper)return;let e=this.settingsWrapper.getBoundingClientRect(),t=window.innerHeight;if(e.bottom>t){let o=e.bottom-t;this.settingsWrapper.style.maxHeight=`${e.height-o-10}px`}}cleanup(){this.closeAllDropdowns(),this.isOpen=!1,this.settingsWrapper&&this.settingsWrapper.classList.remove("module-settings-open")}closeAllDropdowns(){document.querySelectorAll(".gui-dropdown-options").forEach(t=>{d.wrapper.contains(t)&&d.wrapper.removeChild(t)}),this.currentOptionsList&&(this.currentOptionsList=null),this.activeDropdown&&(this.activeDropdown.classList.remove("open"),this.activeDropdown.optionsListElement&&(this.activeDropdown.optionsListElement=null),this.activeDropdown=null),this.activeDropdownListeners&&(document.removeEventListener("click",this.activeDropdownListeners.outsideClickHandler),window.removeEventListener("scroll",this.activeDropdownListeners.hideDropdown,!0),window.removeEventListener("resize",this.activeDropdownListeners.hideDropdown,!0),this.activeDropdownListeners=null)}addNumberInput(e){let t=document.createElement("div");t.className="gui-setting-container setting-number";let o=document.createElement("div");o.className="gui-setting-label",o.textContent=e;let r=document.createElement("div");r.className="number-input-container";let s=document.createElement("input");s.type="text",s.className="gui-text-input number-input",s.value=this.module.options[e],s.addEventListener("input",()=>{let n=s.value.trim();!isNaN(n)&&n!==""&&(this.module.options[e]=n,m.emit("setting.update",{moduleName:this.module.name,setting:e,value:n}))}),s.addEventListener("blur",()=>{(isNaN(s.value)||s.value.trim()==="")&&(s.value=this.module.options[e])}),s.addEventListener("keydown",n=>{n.key==="Enter"&&s.blur()}),r.appendChild(s),t.appendChild(o),t.appendChild(r),this.settingsContainer.appendChild(t),this.components.push(t)}addStringInput(e){let t=document.createElement("div");t.className="gui-setting-container setting-string";let o=document.createElement("div");o.className="gui-setting-label",o.textContent=e;let r=document.createElement("div");r.className="string-input-container";let s=document.createElement("input");s.type="text",s.className="gui-text-input string-input",s.value=this.module.options[e],s.addEventListener("input",()=>{this.module.options[e]=s.value,m.emit("setting.update",{moduleName:this.module.name,setting:e,value:s.value})}),s.addEventListener("keydown",n=>{n.key==="Enter"&&s.blur()}),r.appendChild(s),t.appendChild(o),t.appendChild(r),this.settingsContainer.appendChild(t),this.components.push(t)}addCheckbox(e){let t=document.createElement("div");t.className="gui-setting-container setting-boolean";let o=document.createElement("div");o.className="gui-setting-label",o.textContent=e;let r=document.createElement("div");r.className="checkbox-container";let s=document.createElement("div");s.className="gui-checkbox",(this.module.options[e]===!0||this.module.options[e]==="true")&&s.classList.add("enabled"),t.addEventListener("click",()=>{let n=!(this.module.options[e]===!0||this.module.options[e]==="true");this.module.options[e]=n.toString(),n?s.classList.add("enabled"):s.classList.remove("enabled"),m.emit("setting.update",{moduleName:this.module.name,setting:e,value:n.toString()})}),r.appendChild(s),t.appendChild(o),t.appendChild(r),this.settingsContainer.appendChild(t),this.components.push(t)}addColorPicker(e){let t=document.createElement("div");t.className="gui-setting-container setting-color";let o=document.createElement("div");o.className="gui-setting-label",o.textContent=e;let r=document.createElement("div");r.className="gui-color-row";let s=document.createElement("div");s.className="color-picker-container";let n=document.createElement("div");n.className="gui-color-picker",n.style.background=this.module.options[e];let p=document.createElement("input");p.type="color",p.className="gui-color-input",p.value=this.rgbToHex(this.module.options[e]);let u=document.createElement("input");u.type="text",u.className="gui-text-input color-text-input",u.value=this.formatColor(this.module.options[e]),p.addEventListener("input",h=>{let f=h.target.value;n.style.background=f,u.value=f,this.module.options[e]=f,m.emit("setting.update",{moduleName:this.module.name,setting:e,value:f})}),u.addEventListener("blur",()=>{try{let h=u.value;n.style.background=h,this.module.options[e]=h,m.emit("setting.update",{moduleName:this.module.name,setting:e,value:h})}catch{u.value=this.formatColor(this.module.options[e])}}),u.addEventListener("keydown",h=>{h.key==="Enter"&&u.blur()}),n.appendChild(p),s.appendChild(n),r.appendChild(s),r.appendChild(u),t.appendChild(o),t.appendChild(r),this.settingsContainer.appendChild(t),this.components.push(t)}addModeSelector(e){let t=document.createElement("div");t.className="gui-setting-container setting-mode";let o=document.createElement("div");o.className="gui-setting-label",o.textContent=e;let r=this.module.modes?.[e]||[],s=this.module.options[e],n=document.createElement("div");n.className="gui-dropdown mode-dropdown";let p=document.createElement("div");p.className="gui-dropdown-selected",p.textContent=s;let u=document.createElement("div");u.className="gui-dropdown-arrow",n.appendChild(p),n.appendChild(u);let h=()=>{if(!n.classList.contains("open"))return;let c=n.optionsListElement;c&&d.wrapper.contains(c)&&d.wrapper.removeChild(c),this.currentOptionsList===c&&(this.currentOptionsList=null),this.activeDropdown===n&&(this.activeDropdown=null),n.classList.remove("open"),n.optionsListElement=null,this.activeDropdownListeners&&this.activeDropdownListeners.dropdown===n&&(document.removeEventListener("click",this.activeDropdownListeners.outsideClickHandler),window.removeEventListener("scroll",this.activeDropdownListeners.hideDropdown,!0),window.removeEventListener("resize",this.activeDropdownListeners.hideDropdown,!0),this.activeDropdownListeners=null)},f=c=>{let b=n.optionsListElement;!n.contains(c.target)&&(!b||!b.contains(c.target))&&h()},w=()=>{h()},Z=()=>{this.closeAllDropdowns();let c=document.createElement("div");c.className="gui-dropdown-options mode-options",r.forEach(y=>{let C=document.createElement("div");C.className="gui-dropdown-option mode-option",y===this.module.options[e]&&C.classList.add("selected"),C.textContent=y,C.addEventListener("click",te=>{te.stopPropagation(),p.textContent=y,this.module.options[e]=y,m.emit("setting.update",{moduleName:this.module.name,setting:e,value:y}),h()}),c.appendChild(C)}),d.wrapper.appendChild(c),n.optionsListElement=c;let b=n.getBoundingClientRect();c.style.width=b.width+"px",c.style.position="fixed";let J=window.innerHeight-b.bottom,k=Math.min(r.length*30,150);J<k&&b.top>k?(c.style.bottom=window.innerHeight-b.top+"px",c.style.top="auto",c.classList.add("dropdown-up")):(c.style.top=b.bottom+"px",c.style.bottom="auto",c.classList.remove("dropdown-up")),c.style.left=b.left+"px",c.style.zIndex="1001",n.classList.add("open"),this.activeDropdown=n,this.currentOptionsList=c,this.activeDropdownListeners={dropdown:n,outsideClickHandler:f,hideDropdown:w},setTimeout(()=>{this.activeDropdown===n&&this.activeDropdownListeners&&this.activeDropdownListeners.dropdown===n&&(document.addEventListener("click",f),window.addEventListener("scroll",w,!0),window.addEventListener("resize",w,!0))},0)};n.addEventListener("click",c=>{c.stopPropagation(),n.classList.contains("open")?h():Z()}),t.appendChild(o),t.appendChild(n),this.settingsContainer.appendChild(t),this.components.push(t)}positionDropdown(e,t){let o=e.getBoundingClientRect(),r=this.settingsWrapper.getBoundingClientRect();t.style.position="absolute",t.style.width=o.width+"px",t.style.left="0";let s=window.innerHeight-o.bottom,n=t.clientHeight||150;if(s<n&&o.top>n?(t.style.bottom=o.height+"px",t.style.top="auto",t.classList.add("dropdown-up")):(t.style.top=o.height+"px",t.style.bottom="auto",t.classList.remove("dropdown-up")),t.getBoundingClientRect().right>r.right){let p=t.getBoundingClientRect().right-r.right;t.style.left=-p+"px"}}rgbToHex(e){if(!e)return"#000000";if(e.startsWith("#"))return e;let t=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/i);if(!t)return"#000000";let o=parseInt(t[1]),r=parseInt(t[2]),s=parseInt(t[3]);return"#"+((1<<24)+(o<<16)+(r<<8)+s).toString(16).slice(1)}formatColor(e){return e?e.startsWith("rgb")?this.rgbToHex(e):e:"#000000"}};var j=class{constructor(e,t={top:"200px",left:"200px"}){this.panel=document.createElement("div"),this.panel.className="gui-panel",this.panel.style.top=t.top,this.panel.style.left=t.left,this.header=document.createElement("div"),this.header.className="gui-header",this.header.textContent=e,this.panel.appendChild(this.header),d.wrapper.appendChild(this.panel),this.buttons=[],this.setupDragHandling()}setupDragHandling(){let e=!1,t={x:0,y:0};this.header.addEventListener("mousedown",o=>{e=!0,t.x=o.clientX-this.panel.offsetLeft,t.y=o.clientY-this.panel.offsetTop}),document.addEventListener("mousemove",o=>{e&&(this.panel.style.left=o.clientX-t.x+"px",this.panel.style.top=o.clientY-t.y+"px")}),document.addEventListener("mouseup",()=>e=!1)}addButton(e){let t=document.createElement("div");t.className="gui-button-container";let o=document.createElement("div");o.className=`gui-button ${e.isEnabled?"enabled":""}`,o.textContent=e.name;let r=new _(e,t);return o.addEventListener("mousedown",s=>{s.button===0&&(e.toggle(),o.classList.toggle("enabled",e.isEnabled)),s.button===1&&(o.textContent="waiting for bind..",e.waitingForBind=!0)}),o.addEventListener("contextmenu",s=>{s.preventDefault(),r.initialize(),r.toggle()}),o.setAttribute("tabindex",-1),o.addEventListener("keydown",s=>{o.textContent=e.name,e.waitingForBind&&(s.preventDefault(),s.stopPropagation(),s.stopImmediatePropagation(),s.key==="Escape"?e.keybind=null:e.keybind=String(s.code),e.waitingForBind=!1)}),t.appendChild(o),this.panel.appendChild(t),this.buttons.push(o),o}show(){this.panel.style.display="block"}hide(){this.panel.style.display="none"}};var G=class extends l{constructor(){super("ClickGUI","Visual",{"Accent Color 1":"#40beffff","Accent Color 2":"#81e1ffff","Button Color":"rgb(40, 40, 40, 0.9)","Hover Color":"rgb(50, 50, 50, 0.9)","Header Color":"rgb(0, 0, 0, 0.85)","Panel Color":"rgb(18 18 18)","Text Color":"#ffffff","Glow Alpha":"0.8","Enable Animations":!0},"ShiftRight"),this.GUILoaded=!1,this.panels=[],this.blurredBackground=null,this.updateColors()}updateAnimations(){this.options["Enable Animations"]?d.wrapper.classList.add("with-animations"):d.wrapper.classList.remove("with-animations")}updateColors(){let e=`linear-gradient(90deg, ${this.options["Accent Color 1"]} 0%, ${this.options["Accent Color 2"]} 100%)`;d.wrapper.style.setProperty("--Fentify-accent-color",e),d.wrapper.style.setProperty("--Fentify-accent-color",e),d.wrapper.style.setProperty("--Fentify-accent-color-1",this.options["Accent Color 1"]),d.wrapper.style.setProperty("--Fentify-accent-color-2",this.options["Accent Color 2"]),d.wrapper.style.setProperty("--Fentify-button-color",this.options["Button Color"]),d.wrapper.style.setProperty("--button-color",this.options["Button Color"]),d.wrapper.style.setProperty("--hover-color",this.options["Hover Color"]),d.wrapper.style.setProperty("--header-bg",this.options["Header Color"]),d.wrapper.style.setProperty("--panel-bg",this.options["Panel Color"]),d.wrapper.style.setProperty("--text-color",this.options["Text Color"]),d.wrapper.style.setProperty("--glow-color",x.hexToRGBA(this.options["Accent Color 1"],parseFloat(this.options["Glow Alpha"]),1.2))}onEnable(){document.pointerLockElement&&document.exitPointerLock(),this.GUILoaded?(this.showGUI(),this.updateAnimations()):(this.setupBackground(),this.createPanels(),this.setupEventListeners(),this.GUILoaded=!0,this.updateAnimations())}setupBackground(){this.blurredBackground=document.createElement("div"),this.blurredBackground.className="gui-background",d.wrapper.appendChild(this.blurredBackground)}createPanels(){let e=[{title:"Combat",position:{top:"100px",left:"100px"}},{title:"Movement",position:{top:"100px",left:"338px"}},{title:"Visual",position:{top:"100px",left:"576px"}},{title:"World",position:{top:"100px",left:"814px"}},{title:"Misc",position:{top:"100px",left:"1052px"}}];this.panels.forEach(o=>{o.panel&&o.panel.parentNode&&o.panel.parentNode.removeChild(o.panel)}),this.panels=[],e.forEach(o=>{let r=new j(o.title,o.position);this.panels.push(r)});let t={};Object.values(U.modules).forEach(o=>{t[o.category]||(t[o.category]=[]),t[o.category].push(o)}),Object.entries(t).forEach(([o,r])=>{let s=this.panels.find(p=>p.header.textContent===o);if(!s)return;let n=document.createElement("span");n.style.visibility="hidden",n.style.position="absolute",n.style.font="'Product Sans', sans-serif",d.wrapper.appendChild(n),r.sort((p,u)=>{n.textContent=p.name;let h=n.getBoundingClientRect().width;return n.textContent=u.name,n.getBoundingClientRect().width-h}),n.remove(),r.forEach(p=>s.addButton(p))})}setupEventListeners(){m.on("module.update",e=>{let t=this.panels.find(r=>r.header.textContent===e.category);if(!t)return;let o=t.buttons.find(r=>r.textContent===e.name);o&&o.classList.toggle("enabled",e.isEnabled)})}showGUI(){this.panels.forEach(e=>e.show()),this.blurredBackground.style.display="block"}returnToGame(){}onDisable(){this.panels.forEach(e=>e.hide()),this.blurredBackground.style.display="none",this.returnToGame()}onSettingUpdate(){this.updateColors(),this.updateAnimations()}};var Y=class extends l{constructor(){super("Watermark","Visual",{Text:"Fentify"},""),this.watermarkElement=null,this.mainText=null}onSettingUpdate(){this.mainText&&(this.mainText.textContent=this.options.Text)}onEnable(){if(!this.watermarkElement){let e=document.createElement("div");e.style.position="absolute",e.style.top="0",e.style.left="0",e.style.padding="0.5em",e.style.userSelect="none",e.style.display="flex",e.style.zIndex="999999",e.style.fontFamily="'Product Sans', sans-serif",e.style.fontSize="24px",e.style.backgroundClip="text",e.style.webkitFontSmoothing="antialiased",e.style.webkitTextFillColor="transparent",e.style.textShadow="var(--Fentify-accent-color) 0px 0px 10px",e.style.background="var(--Fentify-accent-color)",e.style.backgroundClip="text",this.mainText=document.createElement("span"),this.mainText.textContent="Fentify";let t=document.createElement("span");t.textContent="v2",t.style.fontSize="14px",t.style.paddingBottom="15px",t.style.marginLeft="4px",t.style.alignSelf="flex-end",e.appendChild(this.mainText),e.appendChild(t),d.wrapper.appendChild(e),this.watermarkElement=e}this.watermarkElement.style.display="flex"}onDisable(){this.watermarkElement.style.display="none"}};var V=class extends l{constructor(){super("Crasher","World",{Times:3})}onEnable(){let e=parseInt(this.options.Times),t=a.stores.get("gameState").gameWorld,o=v.getClosestPlayer(),r=t.player;o&&Math.sqrt(Math.pow(t.player.position.x-o.position.x,2)+Math.pow(t.player.position.y-o.position.y,2)+Math.pow(t.player.position.z-o.position.z,2))<=10&&(r=o);let s=[...r.position,1e8,1e8,1e8,t.time.localServerTimeMs,r?.id||t.player.serverId];for(let n=0;n<e-1;n++)t.server.sendData(g.toServer.HIT,s);this.disable()}};var $=class extends l{constructor(){super("Instabreak","World",{"Allow Bedrock":!1})}onRender(){let e=a.stores.get("gameState").gameWorld;if(!e||!e?.chunkManager)return;let t=e.player?.destroyingBlockXYZ;if(!t)return;let o=e.chunkManager.getBlock(...t);if(o==null)return;let r=e.allItems?.[o];r&&(!this.options["Allow Bedrock"]&&r.name==="Bedrock"||e.chunkManager.placeBlockWithMsgSending(...t,0))}};var K=class extends l{constructor(){super("PickupReach","World",{Reach:5,Delay:1e3}),this.lastExecutionTime=0}onRender(){let e=Date.now(),t=parseFloat(this.options.Delay);if(e-this.lastExecutionTime<t)return;let o=a.stores.get("gameState")?.gameWorld;o?.player&&(this.tryPickup(o),this.lastExecutionTime=e)}get pickupSystem(){return a.stores.get("gameState")?.gameWorld?.systemsManager?.activeSystems.find(t=>t?.allDropItems)}tryPickup(e){let t=parseFloat(this.options.Reach),o=t*t,r=e.player.position,s=r.x,n=r.y,p=r.z,u=this.pickupSystem?.allDropItems;if(!u)return;let h=null,f=null,w=1/0;for(let[Z,c]of Object.entries(u)){if(!c?.pos)continue;let b=c.pos.x-s,J=c.pos.y-n,k=c.pos.z-p,y=b*b+J*J+k*k;y>o||y>=w||(w=y,h=c,f=Z)}!h||f==null||h.pickupRequested||(e.server.sendData(g.toServer.TIME_STEP_INFO,{p:[...h.pos]}),e.server.sendData(g.toServer.PICKUP_DROP_ITEM,f),e.server.sendData(g.toServer.TIME_STEP_INFO,{p:[...r]}),h.pickupRequested=!0)}};var q=class extends l{constructor(){super("Scaffold","World",null)}onRender(){let e=a.stores.get("gameState").gameWorld,t=Object.values(e.player.position).splice(0,3).map(Math.floor);t[1]--;let o=e.player.currentHandItemId,r=e.chunkManager.getBlock(...t),s=e.allItems[r]?.replaceable||!1;(r==0||s)&&o&&e.chunkManager.placeBlockWithMsgSending(...t,o)}};var X=class extends l{constructor(){super("Timer","World",{Multiplier:1.2})}onRender(){let e=a.stores.get("gameState").gameWorld.time;e.elapsedTimeMs+=20*this.options.Multiplier}};var U={modules:{},addModules:function(...i){for(let e of i){let t=new e;this.modules[t.name]=t}},addModule:function(i){this.modules[i.name]=i},handleKeyPress:function(i){for(let e in this.modules){let t=this.modules[e];t.waitingForBind?(t.keybind=i,t.waitingForBind=!1):i&&t.keybind==i&&t.toggle()}},init(){this.addModules(Y,G,O,N,I,A,R,T,F,H,$,X,V,q,K,S,M,E,D,W,z,P,B,L),m.on("render",()=>{for(let i in this.modules)this.modules[i].isEnabled&&this.modules[i].onRender()}),m.on("keydown",this.handleKeyPress.bind(this)),m.on("setting.update",i=>{for(let e in this.modules)(this.modules[e].isEnabled||i.moduleName===e)&&this.modules[e].onSettingUpdate(i.moduleName,i.setting,i.value)}),this.modules.Arraylist.enable(),this.modules.Watermark.enable()}};var ee=`:host {\r
    --Fentify-accent-color: linear-gradient(90deg, rgb(64, 190, 255) 0%, rgb(129, 225, 255) 100%);\r
    --Fentify-accent-color: linear-gradient(90deg, rgb(64, 190, 255) 0%, rgb(129, 225, 255) 100%);\r
    --button-color: rgb(40, 40, 40, 0.9);\r
    --hover-color: rgb(50, 50, 50, 0.9);\r
    --panel-bg: rgb(18, 18, 18, 0.95);\r
    --header-bg: rgb(0, 0, 0, 0.85);\r
    --text-color: #ffffff;\r
    --header-text-size: 24px;\r
    --button-text-size: 18px;\r
    --setting-text-size: 15px;\r
    --animation-scale: 1;\r
    --border-radius: 6px;\r
    --shadow-color: rgba(0, 0, 0, 0.5);\r
    --transition-timing: cubic-bezier(0.19, 1, 0.22, 1);\r
    --spring-easing: cubic-bezier(0.175, 0.885, 0.32, 1.275);\r
    --bounce-easing: cubic-bezier(0.68, -0.55, 0.265, 1.55);\r
    --elastic-easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);\r
    --standard-easing: cubic-bezier(0.4, 0, 0.2, 1);\r
    --decelerate-easing: cubic-bezier(0, 0, 0.2, 1);\r
    --accelerate-easing: cubic-bezier(0.4, 0, 1, 1);\r
    --hover-transition-duration: 120ms;\r
    --panel-appear-duration: 300ms;\r
    --button-appear-duration: 200ms;\r
    --setting-appear-duration: 200ms;\r
    --background-appear-duration: 250ms;\r
    --glow-color: rgba(64, 190, 255, 0.4);\r
    --scroller-size: 4px;\r
    --blur-intensity: 10px;\r
}\r
\r
.gui-panel {\r
    position: fixed;\r
    z-index: 1000;\r
    width: 215px;\r
    border-radius: var(--border-radius);\r
    background-color: var(--panel-bg);\r
    box-shadow: 0 8px 24px var(--shadow-color),\r
                0 0 0 1px rgba(255, 255, 255, 0.05),\r
                0 0 40px rgba(0, 0, 0, 0.2);\r
    transform-style: preserve-3d;\r
    font-family: 'Inter', sans-serif;\r
    color: var(--text-color);\r
    overflow: hidden;\r
    border: 1px solid rgba(255, 255, 255, 0.05);\r
    backdrop-filter: blur(var(--blur-intensity));\r
    will-change: transform, opacity;\r
    transform: perspective(1200px);\r
    backface-visibility: hidden;\r
    user-select: none;\r
    -webkit-user-select: none;\r
    -moz-user-select: none;\r
    -ms-user-select: none;\r
}\r
\r
.gui-panel.dragging {\r
    animation: none !important;\r
    transition: none !important;\r
    will-change: transform;\r
}\r
\r
.with-animations .gui-panel.dragging {\r
    transition: transform 0.2s ease, box-shadow 0.2s ease;\r
    transform: scale(1.05);\r
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);\r
}\r
\r
.gui-header {\r
    background-color: var(--header-bg);\r
    height: 40px;\r
    font-weight: 600;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    font-size: var(--header-text-size);\r
    cursor: grab;\r
    backdrop-filter: blur(5px);\r
    position: relative;\r
    letter-spacing: 0.5px;\r
    will-change: transform;\r
}\r
\r
.gui-header:active {\r
    cursor: grabbing;\r
}\r
\r
.gui-button {\r
    height: 35px;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    box-sizing: border-box;\r
    cursor: pointer;\r
    font-size: var(--button-text-size);\r
    font-weight: 400;\r
    outline: none;\r
    background: var(--button-color);\r
    color: var(--text-color);\r
    position: relative;\r
    overflow: hidden;\r
    letter-spacing: 0.3px;\r
    will-change: transform, background-color, box-shadow;\r
    transition: transform var(--hover-transition-duration) var(--spring-easing),\r
                background-color var(--hover-transition-duration) var(--standard-easing),\r
                box-shadow var(--hover-transition-duration) var(--standard-easing);\r
}\r
\r
.gui-button.enabled {\r
    background: var(--Fentify-accent-color);\r
    font-weight: 500;\r
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);\r
    box-shadow: 0 0 16px var(--glow-color);\r
}\r
\r
.gui-button:not(.enabled):hover {\r
    background: var(--hover-color);\r
    transform: none;\r
    box-shadow: none;\r
}\r
\r
.gui-background {\r
    position: fixed;\r
    left: 0;\r
    top: 0;\r
    z-index: 999;\r
    height: 100%;\r
    width: 100%;\r
    backdrop-filter: blur(0px);\r
    background: rgba(0, 0, 0, 0);\r
    transition: backdrop-filter 300ms var(--decelerate-easing),\r
                background-color 300ms var(--decelerate-easing);\r
    will-change: backdrop-filter, background-color;\r
    pointer-events: auto;\r
}\r
\r
.gui-button-container {\r
    background-color: var(--panel-bg);\r
    display: flex;\r
    flex-direction: column;\r
}\r
\r
.gui-setting-container {\r
    margin-bottom: 12px;\r
    padding: 10px;\r
    background: rgba(30, 30, 30, 0.4);\r
    border-radius: 4px;\r
    width: 100%;\r
    box-sizing: border-box;\r
    transition: background 0.2s ease;\r
}\r
\r
.gui-setting-container:hover {\r
    background: rgba(35, 35, 35, 0.5);\r
}\r
\r
.gui-setting-container .gui-setting-label {\r
    font-size: 14px;\r
    font-weight: 500;\r
    color: rgba(255, 255, 255, 0.85);\r
    margin-bottom: 6px;\r
}\r
\r
.setting-boolean {\r
    display: flex;\r
    flex-direction: row;\r
    align-items: center;\r
    justify-content: space-between;\r
    cursor: pointer;\r
    padding: 10px 12px;\r
}\r
\r
.setting-boolean .gui-setting-label {\r
    margin-bottom: 0;\r
    flex: 1;\r
}\r
\r
.checkbox-container {\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    position: relative;\r
}\r
\r
.gui-checkbox {\r
    position: relative;\r
    width: 22px;\r
    height: 22px;\r
    border-radius: 6px;\r
    background: linear-gradient(145deg, #2a2a2a, #222222);\r
    cursor: pointer;\r
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3), \r
                inset 0 -1px 3px rgba(0, 0, 0, 0.2);\r
    transition: all 0.3s var(--spring-easing);\r
    overflow: hidden;\r
}\r
\r
.gui-checkbox:hover {\r
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.2),\r
                0 2px 6px rgba(0, 0, 0, 0.3);\r
}\r
\r
.gui-checkbox.enabled {\r
    background: var(--Fentify-accent-color);\r
    transform: scale(1.05);\r
    box-shadow: 0 0 12px var(--glow-color),\r
                inset 0 -1px 3px rgba(0, 0, 0, 0.2);\r
}\r
\r
.gui-checkbox.enabled::after {\r
    content: '';\r
    position: absolute;\r
    display: block;\r
    width: 6px;\r
    height: 12px;\r
    border: solid white;\r
    border-width: 0 2px 2px 0;\r
    top: 2px;\r
    left: 7px;\r
    transform: rotate(45deg);\r
    animation: checkmark-pulse 0.5s var(--spring-easing) forwards;\r
}\r
\r
.gui-checkbox.enabled::before {\r
    content: "";\r
    position: absolute;\r
    top: 50%;\r
    left: 50%;\r
    width: 120%;\r
    height: 120%;\r
    background: radial-gradient(\r
        circle,\r
        rgba(255, 255, 255, 0.5),\r
        transparent 80%\r
    );\r
    transform: translate(-50%, -50%) scale(0);\r
    opacity: 0;\r
    border-radius: 50%;\r
    animation: checkbox-sparkle 0.6s ease-out forwards;\r
}\r
\r
@keyframes checkmark-pulse {\r
    0% {\r
        transform: scale(0) rotate(45deg);\r
        opacity: 0;\r
    }\r
    70% {\r
        transform: scale(1.1) rotate(45deg);\r
        opacity: 1;\r
    }\r
    100% {\r
        transform: scale(1) rotate(45deg);\r
        opacity: 1;\r
    }\r
}\r
\r
@keyframes checkbox-sparkle {\r
    0% {\r
        transform: translate(-50%, -50%) scale(0);\r
        opacity: 0.5;\r
    }\r
    70% {\r
        transform: translate(-50%, -50%) scale(1);\r
        opacity: 0.8;\r
    }\r
    100% {\r
        transform: translate(-50%, -50%) scale(0);\r
        opacity: 0;\r
    }\r
}\r
\r
.setting-string, .setting-number {\r
    display: flex;\r
    flex-direction: column;\r
}\r
\r
.string-input-container, .number-input-container {\r
    width: 100%;\r
}\r
\r
.gui-text-input {\r
    width: 100%;\r
    height: 30px;\r
    background: rgba(40, 40, 40, 0.9);\r
    border: 1px solid rgba(60, 60, 60, 0.8);\r
    border-radius: 4px;\r
    color: rgba(255, 255, 255, 0.9);\r
    padding: 0 10px;\r
    font-size: 13px;\r
    box-sizing: border-box;\r
    transition: all 0.2s ease;\r
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\r
}\r
\r
.gui-text-input:hover {\r
    border-color: rgba(80, 80, 80, 0.9);\r
    background: rgba(45, 45, 45, 0.9);\r
}\r
\r
.gui-text-input:focus {\r
    border-color: rgba(100, 100, 100, 1);\r
    background: rgba(50, 50, 50, 0.9);\r
    outline: none;\r
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);\r
}\r
\r
.setting-color {\r
    display: flex;\r
    flex-direction: column;\r
}\r
\r
.gui-color-row {\r
    display: flex;\r
    width: 100%;\r
    gap: 8px;\r
}\r
\r
.color-picker-container {\r
    position: relative;\r
    width: 40px;\r
    height: 30px;\r
}\r
\r
.gui-color-picker {\r
    width: 100%;\r
    height: 100%;\r
    border-radius: 4px;\r
    position: relative;\r
    cursor: pointer;\r
    border: 1px solid rgba(60, 60, 60, 0.8);\r
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\r
    transition: border-color 0.2s ease, box-shadow 0.2s ease;\r
}\r
\r
.gui-color-picker:hover {\r
    border-color: rgba(80, 80, 80, 0.9);\r
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);\r
}\r
\r
.gui-color-input {\r
    position: absolute;\r
    width: 100%;\r
    height: 100%;\r
    opacity: 0;\r
    cursor: pointer;\r
}\r
\r
.color-text-input {\r
    flex: 1;\r
}\r
\r
.module-settings-wrapper {\r
    display: none;\r
    background-color: rgba(20, 20, 20, 0.9);\r
    border-radius: 5px;\r
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);\r
    margin-top: 5px;\r
    padding: 0 8px;\r
    box-sizing: border-box;\r
    max-height: 0;\r
    overflow: hidden;\r
    opacity: 0;\r
    transition: max-height 500ms linear, \r
                opacity 500ms linear, \r
                padding 500ms linear;\r
    will-change: max-height, opacity, padding;\r
}\r
\r
.module-settings-wrapper.module-settings-open {\r
    display: block;\r
    max-height: 400px;\r
    opacity: 1;\r
    padding: 8px;\r
}\r
\r
.module-settings {\r
    overflow-y: auto;\r
    overflow-x: hidden;\r
    scroll-behavior: smooth;\r
    -webkit-overflow-scrolling: touch;\r
    scrollbar-width: none;\r
    -ms-overflow-style: none;\r
}\r
\r
.module-settings::-webkit-scrollbar {\r
    display: none;\r
    width: 0;\r
    height: 0;\r
}\r
\r
.gui-text-input:focus, \r
.gui-color-picker:focus,\r
.gui-dropdown:focus {\r
    outline: none;\r
    box-shadow: 0 0 0 1px rgba(80, 80, 80, 1), 0 0 5px rgba(0, 0, 0, 0.3);\r
}\r
\r
.scrollable-container {\r
    scrollbar-width: thin;\r
    scrollbar-color: rgba(255, 255, 255, 0.1) rgba(0, 0, 0, 0.1);\r
}\r
\r
.scrollable-container::-webkit-scrollbar {\r
    width: var(--scroller-size);\r
    height: var(--scroller-size);\r
}\r
\r
.scrollable-container::-webkit-scrollbar-track {\r
    background: rgba(0, 0, 0, 0.1);\r
    border-radius: 10px;\r
}\r
\r
.scrollable-container::-webkit-scrollbar-thumb {\r
    background: rgba(255, 255, 255, 0.1);\r
    border-radius: 10px;\r
    transition: background 300ms var(--standard-easing);\r
}\r
\r
.scrollable-container::-webkit-scrollbar-thumb:hover {\r
    background: rgba(255, 255, 255, 0.2);\r
}\r
\r
.scrollable-container::-webkit-scrollbar-corner {\r
    background: transparent;\r
}\r
\r
.with-animations .gui-panel:not(.dragging) {\r
    animation: panelAppear var(--panel-appear-duration) var(--standard-easing) both;\r
    transform-origin: center center;\r
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);\r
}\r
\r
@keyframes panelAppear {\r
    0% {\r
        opacity: 0;\r
        transform: translateY(30px) scale(0.95);\r
        box-shadow: 0 0 0 rgba(0, 0, 0, 0);\r
    }\r
    100% {\r
        opacity: 1;\r
        transform: translateY(0) scale(1);\r
        box-shadow: 0 8px 24px var(--shadow-color),\r
                    0 0 0 1px rgba(255, 255, 255, 0.05),\r
                    0 0 40px rgba(0, 0, 0, 0.2);\r
    }\r
}\r
\r
.with-animations .gui-background {\r
    animation: backgroundFadeIn var(--background-appear-duration) var(--standard-easing) forwards;\r
}\r
\r
@keyframes backgroundFadeIn {\r
    0% { \r
        opacity: 0; \r
        backdrop-filter: blur(0px); \r
        background: rgba(0, 0, 0, 0);\r
    }\r
    100% { \r
        opacity: 1; \r
        backdrop-filter: blur(8px); \r
        background: rgba(0, 0, 0, 0.4);\r
    }\r
}\r
\r
.with-animations .gui-setting-container {\r
    animation: settingReveal var(--setting-appear-duration) var(--standard-easing) both;\r
}\r
\r
@keyframes settingReveal {\r
    0% {\r
        opacity: 0;\r
        transform: translateY(10px);\r
    }\r
    100% {\r
        opacity: 1;\r
        transform: translateY(0);\r
    }\r
}\r
\r
.module-settings {\r
    max-height: 300px;\r
    overflow-y: auto;\r
    overflow-x: hidden;\r
    padding: 4px 5px;\r
    cursor: default;\r
    background: var(--panel-bg);\r
    border-radius: 4px;\r
    margin-top: 2px;\r
    will-change: transform, scroll-position;\r
    perspective: 1000px;\r
    backface-visibility: hidden;\r
}\r
\r
.module-settings-container {\r
    position: relative;\r
    padding: 0;\r
    background: var(--panel-bg);\r
    border-radius: 4px;\r
}\r
\r
.gui-dropdown {\r
    position: relative;\r
    width: 100%;\r
    height: 28px;\r
    background: rgba(30, 30, 30, 0.95);\r
    border-radius: 3px;\r
    border: 1px solid rgba(60, 60, 60, 0.7);\r
    cursor: pointer;\r
    transition: all 0.2s ease;\r
    display: flex;\r
    align-items: center;\r
    justify-content: space-between;\r
}\r
\r
.gui-dropdown:hover {\r
    background: rgba(40, 40, 40, 1);\r
    border-color: rgba(60, 60, 60, 0.9);\r
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);\r
}\r
\r
.gui-dropdown-selected {\r
    display: flex;\r
    align-items: center;\r
    height: 100%;\r
    padding: 0 8px;\r
    color: white;\r
    font-size: 13px;\r
    box-sizing: border-box;\r
    overflow: hidden;\r
    text-overflow: ellipsis;\r
    white-space: nowrap;\r
    user-select: none;\r
}\r
\r
.gui-dropdown-arrow {\r
    width: 0;\r
    height: 0;\r
    margin-right: 10px;\r
    border-left: 4px solid transparent;\r
    border-right: 4px solid transparent;\r
    border-top: 5px solid rgba(255, 255, 255, 0.7);\r
    pointer-events: none;\r
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);\r
}\r
\r
.gui-dropdown.open .gui-dropdown-arrow {\r
    transform: rotate(180deg);\r
    border-top-color: rgba(255, 255, 255, 0.9);\r
}\r
\r
.gui-dropdown.open {\r
    background: rgba(40, 40, 40, 1);\r
    border-color: rgba(70, 70, 70, 1);\r
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);\r
}\r
\r
.gui-dropdown-options {\r
    position: fixed;\r
    z-index: 9999;\r
    background: rgba(35, 35, 35, 1);\r
    border-radius: 3px;\r
    width: 100%;\r
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.6);\r
    border: 1px solid rgba(70, 70, 70, 0.9);\r
    max-height: 150px;\r
    overflow-y: auto;\r
    scrollbar-width: none;\r
    -ms-overflow-style: none;\r
    transform-origin: top center;\r
    animation: dropdown-appear 180ms var(--spring-easing) forwards;\r
    will-change: transform, opacity;\r
}\r
\r
@keyframes dropdown-appear {\r
    from {\r
        opacity: 0;\r
        transform: translateY(-5px) scaleY(0.95);\r
    }\r
    to {\r
        opacity: 1;\r
        transform: translateY(0) scaleY(1);\r
    }\r
}\r
\r
.gui-dropdown-options::-webkit-scrollbar {\r
    display: none;\r
}\r
\r
.gui-dropdown-option {\r
    padding: 8px 10px;\r
    color: white;\r
    font-size: 13px;\r
    cursor: pointer;\r
    transition: background 0.15s ease, color 0.15s ease;\r
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);\r
}\r
\r
.gui-dropdown-option:last-child {\r
    border-bottom: none;\r
}\r
\r
.gui-dropdown-option:hover {\r
    background: rgba(50, 50, 50, 0.9);\r
    color: rgba(255, 255, 255, 1);\r
}\r
\r
.gui-dropdown-option.selected {\r
    background: rgba(55, 55, 55, 0.9);\r
    color: rgba(255, 255, 255, 1);\r
    font-weight: 500;\r
}\r
\r
.gui-dropdown-option.selected:hover {\r
    background: rgba(60, 60, 60, 0.95);\r
}\r
\r
.dropdown-up {\r
    bottom: calc(100% + 1px);\r
    top: auto !important;\r
    transform-origin: bottom center;\r
    animation: dropdown-appear-up 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\r
}\r
\r
@keyframes dropdown-appear-up {\r
    from {\r
        opacity: 0;\r
        transform: translateY(5px) scaleY(0.95);\r
    }\r
    to {\r
        opacity: 1;\r
        transform: translateY(0) scaleY(1);\r
    }\r
}\r
\r
.with-animations .gui-button {\r
    animation: buttonReveal var(--button-appear-duration) var(--standard-easing) both;\r
}\r
\r
@keyframes buttonReveal {\r
    0% {\r
        opacity: 0;\r
        transform: translateY(8px);\r
    }\r
    100% {\r
        opacity: 1;\r
        transform: translateY(0);\r
    }\r
}\r
\r
@keyframes gui-panel-hide {\r
    0% {\r
        opacity: 1;\r
        transform: perspective(1200px) scale(1) translateY(0);\r
    }\r
    100% {\r
        opacity: 0;\r
        transform: perspective(1200px) scale(0.97) translateY(8px);\r
    }\r
}\r
\r
@keyframes gui-background-hide {\r
    0% {\r
        opacity: 1; \r
        backdrop-filter: blur(8px);\r
        background: rgba(0, 0, 0, 0.4);\r
    }\r
    100% { \r
        opacity: 0; \r
        backdrop-filter: blur(0px);\r
        background: rgba(0, 0, 0, 0);\r
    }\r
}\r
\r
input, textarea, [contenteditable="true"], .module-settings-wrapper {\r
    user-select: text !important;\r
    -webkit-user-select: text !important;\r
}\r
\r
.gui-button-container {\r
    user-select: none;\r
}`;function re(i){let e=document.createElement("style");e.textContent=i,d.wrapper.appendChild(e)}re(ee);U.init();g.init();document.addEventListener("keydown",i=>{m.emit("keydown",i.code)});setInterval(()=>{m.emit("render")},1e3/60);var ie=!1;ie&&(window.fentify={hooks:a,shadowWrapper:d,moduleManager:U,packets:g},window.fentify.gameUtils=v);})();
