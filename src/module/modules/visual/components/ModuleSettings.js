import events from "../../../../events";
import shadowWrapper from "../../../../shadowWrapper";

export default class ModuleSettings {
    constructor(module, container) {
        this.module = module;
        this.container = container;
        this.components = [];
        this.initialized = false;
        this.isOpen = false;
        this.activeDropdown = null;
        this.currentOptionsList = null;
        this.activeDropdownListeners = null;
    }

    initialize() {
        if (this.initialized || !this.module?.options) return;
        
        this.settingsWrapper = document.createElement("div");
        this.settingsWrapper.className = "module-settings-wrapper";
        this.container.appendChild(this.settingsWrapper);
        
        this.settingsContainer = document.createElement("div");
        this.settingsContainer.className = "module-settings scrollable";
        this.settingsWrapper.appendChild(this.settingsContainer);
        
        this.container.style.position = "relative";
        
        const keys = Object.keys(this.module.options);
        const groups = this.groupSettings(keys);
        this.createSettings(groups);
        
        this.initialized = true;
    }
    
    groupSettings(keys) {
        return keys.reduce((acc, key) => {
            const value = this.module.options[key];
            const type = typeof value;
            
            if (key.toLowerCase().includes("color")) {
                acc.color.push(key);
            } else if (this.module.modes && this.module.modes[key]) {
                acc.mode.push(key);
            } else if (type === "boolean" || value === "true" || value === "false") {
                acc.boolean.push(key);
            } else {
                acc.other.push(key);
            }
            return acc;
        }, { boolean: [], mode: [], other: [], color: [] });
    }
    
    createSettings(groups) {
        [...groups.boolean, ...groups.mode, ...groups.other, ...groups.color].forEach(key => {
            const value = this.module.options[key];
            const type = typeof value;

            if (key.toLowerCase().includes("color")) {
                this.addColorPicker(key);
            } else if (this.module.modes && this.module.modes[key]) {
                this.addModeSelector(key);
            } else if (type === "boolean" || value === "true" || value === "false") {
                this.addCheckbox(key);
            } else if (type === "string") {
                this.addStringInput(key);
            } else {
                this.addNumberInput(key);
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen && this.settingsWrapper?.classList) {
            this.settingsWrapper.classList.add("module-settings-open");
            this.checkPositionWithinViewport();
        } else if (this.settingsWrapper?.classList) {
            this.settingsWrapper.classList.remove("module-settings-open");
            this.closeAllDropdowns();
        }
    }
    
    checkPositionWithinViewport() {
        if (!this.settingsWrapper) return;
        
        const rect = this.settingsWrapper.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (rect.bottom > viewportHeight) {
            const overflowAmount = rect.bottom - viewportHeight;
            this.settingsWrapper.style.maxHeight = `${rect.height - overflowAmount - 10}px`;
        }
    }

    cleanup() {
        this.closeAllDropdowns();
        this.isOpen = false;
        if (this.settingsWrapper) {
            this.settingsWrapper.classList.remove("module-settings-open");
        }
    }

    closeAllDropdowns() {
        const optionsContainers = document.querySelectorAll(".gui-dropdown-options");
        optionsContainers.forEach(container => {
            if (shadowWrapper.wrapper.contains(container)) {
                shadowWrapper.wrapper.removeChild(container);
            }
        });
        
        if (this.currentOptionsList) {
            this.currentOptionsList = null;
        }
        
        if (this.activeDropdown) {
            this.activeDropdown.classList.remove("open");
            if (this.activeDropdown.optionsListElement) {
                this.activeDropdown.optionsListElement = null;
            }
            this.activeDropdown = null;
        }
        
        if (this.activeDropdownListeners) {
            document.removeEventListener("click", this.activeDropdownListeners.outsideClickHandler);
            window.removeEventListener("scroll", this.activeDropdownListeners.hideDropdown, true);
            window.removeEventListener("resize", this.activeDropdownListeners.hideDropdown, true);
            this.activeDropdownListeners = null;
        }
    }

    addNumberInput(name) {
        const container = document.createElement("div");
        container.className = "gui-setting-container setting-number";
        
        const label = document.createElement("div");
        label.className = "gui-setting-label";
        label.textContent = name;
        
        const inputContainer = document.createElement("div");
        inputContainer.className = "number-input-container";
        
        const input = document.createElement("input");
        input.type = "text";
        input.className = "gui-text-input number-input";
        input.value = this.module.options[name];
        
        input.addEventListener("input", () => {
            const value = input.value.trim();
            if (!isNaN(value) && value !== "") {
                this.module.options[name] = value;
                events.emit("setting.update", { moduleName: this.module.name, setting: name, value });
            }
        });

        input.addEventListener("blur", () => {
            if (isNaN(input.value) || input.value.trim() === "") {
                input.value = this.module.options[name];
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") input.blur();
        });

        inputContainer.appendChild(input);
        container.appendChild(label);
        container.appendChild(inputContainer);
        this.settingsContainer.appendChild(container);
        this.components.push(container);
    }

    addStringInput(name) {
        const container = document.createElement("div");
        container.className = "gui-setting-container setting-string";
        
        const label = document.createElement("div");
        label.className = "gui-setting-label";
        label.textContent = name;
        
        const inputContainer = document.createElement("div");
        inputContainer.className = "string-input-container";
        
        const input = document.createElement("input");
        input.type = "text";
        input.className = "gui-text-input string-input";
        input.value = this.module.options[name];
        
        input.addEventListener("input", () => {
            this.module.options[name] = input.value;
            events.emit("setting.update", { moduleName: this.module.name, setting: name, value: input.value });
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") input.blur();
        });

        inputContainer.appendChild(input);
        container.appendChild(label);
        container.appendChild(inputContainer);
        this.settingsContainer.appendChild(container);
        this.components.push(container);
    }

    addCheckbox(name) {
        const container = document.createElement("div");
        container.className = "gui-setting-container setting-boolean";
        
        const label = document.createElement("div");
        label.className = "gui-setting-label";
        label.textContent = name;
        
        const checkboxContainer = document.createElement("div");
        checkboxContainer.className = "checkbox-container";
        
        const checkbox = document.createElement("div");
        checkbox.className = "gui-checkbox";
        
        if (this.module.options[name] === true || this.module.options[name] === "true") {
            checkbox.classList.add("enabled");
        }

        container.addEventListener("click", () => {
            const newState = !(this.module.options[name] === true || this.module.options[name] === "true");
            this.module.options[name] = newState.toString();
            
            if (newState) {
                checkbox.classList.add("enabled");
            } else {
                checkbox.classList.remove("enabled");
            }
            
            events.emit("setting.update", { moduleName: this.module.name, setting: name, value: newState.toString() });
        });

        checkboxContainer.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(checkboxContainer);
        this.settingsContainer.appendChild(container);
        this.components.push(container);
    }

    addColorPicker(name) {
        const container = document.createElement("div");
        container.className = "gui-setting-container setting-color";
        
        const label = document.createElement("div");
        label.className = "gui-setting-label";
        label.textContent = name;
        
        const colorRow = document.createElement("div");
        colorRow.className = "gui-color-row";
        
        const colorPickerContainer = document.createElement("div");
        colorPickerContainer.className = "color-picker-container";
        
        const colorPickerBg = document.createElement("div");
        colorPickerBg.className = "gui-color-picker";
        colorPickerBg.style.background = this.module.options[name];
        
        const colorPicker = document.createElement("input");
        colorPicker.type = "color";
        colorPicker.className = "gui-color-input";
        colorPicker.value = this.rgbToHex(this.module.options[name]);
        
        const colorText = document.createElement("input");
        colorText.type = "text";
        colorText.className = "gui-text-input color-text-input";
        colorText.value = this.formatColor(this.module.options[name]);
        
        colorPicker.addEventListener("input", (event) => {
            const hexColor = event.target.value;
            colorPickerBg.style.background = hexColor;
            colorText.value = hexColor;
            this.module.options[name] = hexColor;
            events.emit("setting.update", { moduleName: this.module.name, setting: name, value: hexColor });
        });

        colorText.addEventListener("blur", () => {
            try {
                const color = colorText.value;
                colorPickerBg.style.background = color;
                this.module.options[name] = color;
                events.emit("setting.update", { moduleName: this.module.name, setting: name, value: color });
            } catch (e) {
                colorText.value = this.formatColor(this.module.options[name]);
            }
        });
        
        colorText.addEventListener("keydown", (e) => {
            if (e.key === "Enter") colorText.blur();
        });

        colorPickerBg.appendChild(colorPicker);
        colorPickerContainer.appendChild(colorPickerBg);
        colorRow.appendChild(colorPickerContainer);
        colorRow.appendChild(colorText);
        container.appendChild(label);
        container.appendChild(colorRow);
        this.settingsContainer.appendChild(container);
        this.components.push(container);
    }

    addModeSelector(name) {
        const container = document.createElement("div");
        container.className = "gui-setting-container setting-mode";
        
        const label = document.createElement("div");
        label.className = "gui-setting-label";
        label.textContent = name;
        
        const modes = this.module.modes?.[name] || [];
        const currentMode = this.module.options[name];
        
        const dropdown = document.createElement("div");
        dropdown.className = "gui-dropdown mode-dropdown";
        
        const selectedText = document.createElement("div");
        selectedText.className = "gui-dropdown-selected";
        selectedText.textContent = currentMode;
        
        const arrow = document.createElement("div");
        arrow.className = "gui-dropdown-arrow";
        
        dropdown.appendChild(selectedText);
        dropdown.appendChild(arrow);

        const performHideDropdownActions = () => {
            if (!dropdown.classList.contains("open")) return;

            const optionsList = dropdown.optionsListElement;
            if (optionsList && shadowWrapper.wrapper.contains(optionsList)) {
                shadowWrapper.wrapper.removeChild(optionsList);
            }

            if (this.currentOptionsList === optionsList) {
                this.currentOptionsList = null;
            }
            if (this.activeDropdown === dropdown) {
                this.activeDropdown = null;
            }
            
            dropdown.classList.remove("open");
            dropdown.optionsListElement = null;

            if (this.activeDropdownListeners && this.activeDropdownListeners.dropdown === dropdown) {
                document.removeEventListener("click", this.activeDropdownListeners.outsideClickHandler);
                window.removeEventListener("scroll", this.activeDropdownListeners.hideDropdown, true);
                window.removeEventListener("resize", this.activeDropdownListeners.hideDropdown, true);
                this.activeDropdownListeners = null;
            }
        };

        const specificOutsideClickHandler = (e) => {
            const optionsList = dropdown.optionsListElement;
            if (!dropdown.contains(e.target) && (!optionsList || !optionsList.contains(e.target))) {
                performHideDropdownActions();
            }
        };

        const specificScrollResizeHideHandler = () => {
            performHideDropdownActions();
        };
        
        const showDropdown = () => {
            this.closeAllDropdowns(); 

            const optionsList = document.createElement("div");
            optionsList.className = "gui-dropdown-options mode-options";
            
            modes.forEach(mode => {
                const option = document.createElement("div");
                option.className = "gui-dropdown-option mode-option";
                if (mode === this.module.options[name]) {
                    option.classList.add("selected");
                }
                option.textContent = mode;
                
                option.addEventListener("click", (e) => {
                    e.stopPropagation();
                    selectedText.textContent = mode;
                    this.module.options[name] = mode;
                    events.emit("setting.update", { moduleName: this.module.name, setting: name, value: mode });
                    performHideDropdownActions();
                });
                optionsList.appendChild(option);
            });
            
            shadowWrapper.wrapper.appendChild(optionsList);
            dropdown.optionsListElement = optionsList;
            
            const dropdownRect = dropdown.getBoundingClientRect();
            optionsList.style.width = dropdownRect.width + "px";
            optionsList.style.position = "fixed"; 
            
            const spaceBelow = window.innerHeight - dropdownRect.bottom;
            const optionsHeight = Math.min(modes.length * 30, 150); 
            
            if (spaceBelow < optionsHeight && dropdownRect.top > optionsHeight) {
                optionsList.style.bottom = (window.innerHeight - dropdownRect.top) + "px";
                optionsList.style.top = "auto";
                optionsList.classList.add("dropdown-up");
            } else {
                optionsList.style.top = dropdownRect.bottom + "px";
                optionsList.style.bottom = "auto";
                optionsList.classList.remove("dropdown-up");
            }
            
            optionsList.style.left = dropdownRect.left + "px";
            optionsList.style.zIndex = "1001";

            dropdown.classList.add("open");
            this.activeDropdown = dropdown;
            this.currentOptionsList = optionsList;

            this.activeDropdownListeners = {
                dropdown: dropdown,
                outsideClickHandler: specificOutsideClickHandler,
                hideDropdown: specificScrollResizeHideHandler
            };
            
            setTimeout(() => {
                if (this.activeDropdown === dropdown && this.activeDropdownListeners && this.activeDropdownListeners.dropdown === dropdown) {
                    document.addEventListener("click", specificOutsideClickHandler);
                    window.addEventListener("scroll", specificScrollResizeHideHandler, true);
                    window.addEventListener("resize", specificScrollResizeHideHandler, true);
                }
            }, 0);
        };
        
        dropdown.addEventListener("click", (e) => {
            e.stopPropagation();
            if (dropdown.classList.contains("open")) {
                performHideDropdownActions();
            } else {
                showDropdown();
            }
        });
        
        container.appendChild(label);
        container.appendChild(dropdown);
        this.settingsContainer.appendChild(container);
        this.components.push(container);
    }
    
    positionDropdown(dropdown, optionsList) {
        const rect = dropdown.getBoundingClientRect();
        const containerRect = this.settingsWrapper.getBoundingClientRect();
        
        optionsList.style.position = "absolute";
        optionsList.style.width = rect.width + "px";
        optionsList.style.left = "0";
        
        const spaceBelow = window.innerHeight - rect.bottom;
        const optionsHeight = optionsList.clientHeight || 150;
        
        if (spaceBelow < optionsHeight && rect.top > optionsHeight) {
            optionsList.style.bottom = rect.height + "px";
            optionsList.style.top = "auto";
            optionsList.classList.add("dropdown-up");
        } else {
            optionsList.style.top = rect.height + "px";
            optionsList.style.bottom = "auto";
            optionsList.classList.remove("dropdown-up");
        }
        
        if (optionsList.getBoundingClientRect().right > containerRect.right) {
            const overflow = optionsList.getBoundingClientRect().right - containerRect.right;
            optionsList.style.left = -overflow + "px";
        }
    }
    
    rgbToHex(rgb) {
        if (!rgb) return "#000000";
        if (rgb.startsWith("#")) return rgb;
        
        const rgbMatch = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/i);
        if (!rgbMatch) return "#000000";
        
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    formatColor(color) {
        if (!color) return "#000000";
        return color.startsWith("rgb") ? this.rgbToHex(color) : color;
    }
}