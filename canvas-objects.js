// =================================================================================
// Canvas Object Management
// =================================================================================
// Functions for creating, selecting, deleting, and managing objects on the canvas.

/**
 * Gets the mouse position relative to the canvas.
 * @param {MouseEvent} e The mouse event.
 * @returns {{x: number, y: number}} The coordinates of the mouse on the canvas.
 */
function getCanvasMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
}

/**
 * Finds the index of the topmost canvas object at a given mouse position.
 * @param {number} mouseX The x-coordinate of the mouse.
 * @param {number} mouseY The y-coordinate of the mouse.
 * @returns {number} The index of the object, or -1 if none is found.
 */
function getObjectAt(mouseX, mouseY) {
    for (let i = canvasObjects.length - 1; i >= 0; i--) {
        const obj = canvasObjects[i];
        const dx = mouseX - obj.x;
        const dy = mouseY - obj.y;
        const angle = -obj.rotation * Math.PI / 180;
        const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle);
        const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle);
        if (rotatedX >= -obj.width / 2 && rotatedX <= obj.width / 2 &&
            rotatedY >= -obj.height / 2 && rotatedY <= obj.height / 2) {
            return i;
        }
    }
    return -1;
}

/**
 * Finds the index of the topmost text element at a given mouse position.
 * @param {number} mouseX The x-coordinate of the mouse.
 * @param {number} mouseY The y-coordinate of the mouse.
 * @returns {number} The index of the text element, or -1 if none is found.
 */
function getTextElementAt(mouseX, mouseY) {
    for (let i = textElements.length - 1; i >= 0; i--) {
        const el = textElements[i];
        const text = el.text || document.getElementById(el.inputId).value;
        if (!text) continue;

        const size = parseFloat(el.size || document.getElementById(el.sizeId).value);
        const x = el.x;
        const y = el.y;
        const align = el.align;

        ctx.font = `bold ${size}px "Berlin Sans FB Demi Bold"`;

        let textWidth = ctx.measureText(text).width;
        const lineHeight = size * 1.2;

        let actualRenderedLines = [text];
        if (el.wrap) {
            actualRenderedLines = wrapText(ctx, text, x, y, canvas.width * 0.96, lineHeight, align, x, canvas.width);
            textWidth = 0;
            actualRenderedLines.forEach(line => {
                textWidth = Math.max(textWidth, ctx.measureText(line.trim()).width);
            });
        } else {
            textWidth = ctx.measureText(text).width;
        }

        const textHeight = actualRenderedLines.length * lineHeight;

        let x1, x2;
        if (align === 'left') { x1 = x; x2 = x + textWidth; }
        else if (align === 'right') { x1 = x - textWidth; x2 = x; }
        else { x1 = x - textWidth / 2; x2 = x + textWidth / 2; }

        const y1 = y;
        const y2 = y + textHeight;

        const buffer = 10; // Click buffer
        if (mouseX >= x1 - buffer && mouseX <= x2 + buffer &&
            mouseY >= y1 - buffer && mouseY <= y2 + buffer) {
            return i;
        }
    }
    return -1;
}

/**
 * Selects a canvas object by its index.
 * @param {number} index The index of the object in the canvasObjects array.
 */
function selectObject(index) {
    const prevIndex = selectedObjectIndex;

    // If we're switching to a different object, ensure proper cleanup
    if (index !== prevIndex) {
        // Clear any active input focus to prevent cross-contamination
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }

        // Force a small delay to ensure any pending property changes are processed
        setTimeout(() => {
            selectedObjectIndex = index;
            updateObjectPropertiesPanel();
            drawThumbnail();
        }, 10);
    } else {
        selectedObjectIndex = index;
        updateObjectPropertiesPanel();
        drawThumbnail();
    }
}

/**
 * Deselects any currently selected canvas object.
 */
function deselectAll() {
    if (selectedObjectIndex !== -1) {
        selectedObjectIndex = -1;
        document.getElementById('object-properties-panel').style.display = 'none';
        drawThumbnail();
    }
}

/**
 * Updates the properties panel based on the currently selected object.
 */


function generateFontOptions(selectedFont) {
    if (typeof localFontFamilies === 'undefined') return '<option>Fonts loading...</option>';
    return localFontFamilies.map(font => `<option value="${font}" ${font === selectedFont ? 'selected' : ''}>${font}</option>`).join('');
}



/**
 * Handles changes to the properties of the selected object.
 * @param {Event} e The input event.
 */


function updateObjectPropertiesPanel() {
    const panel = document.getElementById('object-properties-panel');
    if (selectedObjectIndex < 0) {
        panel.style.display = 'none';
        return;
    }
    const obj = canvasObjects[selectedObjectIndex];
    
    // Build main controls (Text, Color, Size - always visible)
    let mainHtml = '<div class="text-input">';
    
    if (['shape', 'square', 'circle', 'arrow'].includes(obj.type)) {
        mainHtml += `<input type="text" id="obj-text-content" value="${obj.text || ''}" placeholder="Shape Text">`;
        mainHtml += `<div class="color-input-container"><input type="color" id="obj-fill-color" value="${obj.fill}"><div class="color-preview"></div></div>`;
        mainHtml += `<input type="number" id="obj-font-size" min="1" max="1000" value="${obj.size || 100}">`;
    } else if (obj.type === 'text') {
        mainHtml += `<input type="text" id="obj-text-content" value="${obj.text}" placeholder="Text">`;
        mainHtml += `<div class="color-input-container"><input type="color" id="obj-text-color" value="${obj.color}"><div class="color-preview"></div></div>`;
        mainHtml += `<input type="number" id="obj-font-size" min="1" max="1000" value="${obj.size}">`;
    } else if (obj.type === 'image' || obj.type === 'person') {
        mainHtml += `<span style="flex-grow: 1;">Image Object</span>`;
        mainHtml += `<div class="color-input-container"><input type="color" id="obj-stroke-color" value="${obj.stroke}"><div class="color-preview"></div></div>`;
        mainHtml += `<input type="number" id="obj-height" value="${Math.round(obj.height)}" min="10" max="2000">`;
    }
    
    mainHtml += '</div>';
    document.getElementById('obj-main-controls').innerHTML = mainHtml;
    
    // Build toggle buttons
    let toggleHtml = '';
    toggleHtml += `<button class="toggle-btn" data-obj-controls="obj-position-controls">Position</button>`;
    toggleHtml += `<button class="toggle-btn" data-obj-controls="obj-style-controls">Style</button>`;
    toggleHtml += `<button class="toggle-btn" data-obj-controls="obj-background-controls">Background</button>`;
    toggleHtml += `<button class="toggle-btn" data-obj-controls="obj-shadow-controls">Shadow</button>`;
    toggleHtml += `<button class="toggle-btn" data-obj-controls="obj-fx-controls">FX</button>`;
    document.getElementById('obj-toggle-container').innerHTML = toggleHtml;
    
    // Build Position controls
    let displayX = obj.x;
    let displayY = obj.y;
    if (obj.type === 'text' && typeof obj.id === 'number') {
        const halfW = obj.width / 2 || 0;
        const halfH = obj.height / 2 || 0;
        if (obj.align === 'left') {
            displayX = obj.x - halfW;
        } else if (obj.align === 'right') {
            displayX = obj.x + halfW;
        }
        displayY = obj.y - halfH;
    }
    
    let posHtml = '<div class="text-position-controls">';
    posHtml += `<label>X: <input type="number" id="obj-pos-x" class="pos-input" value="${Math.round(displayX)}"></label>`;
    posHtml += `<label>Y: <input type="number" id="obj-pos-y" class="pos-input" value="${Math.round(displayY)}"></label>`;
    if (obj.type === 'text') {
        posHtml += `<button class="align-btn" data-obj-align="left">L</button>`;
        posHtml += `<button class="align-btn" data-obj-align="center">C</button>`;
        posHtml += `<button class="align-btn" data-obj-align="right">R</button>`;
    }
    posHtml += `</div><div class="text-position-controls" style="margin-top: 8px;">`;
    posHtml += `<label>Rotation: <input type="number" id="obj-rotation" class="pos-input" min="0" max="360" value="${obj.rotation}"></label>`;
    posHtml += '</div>';
    document.getElementById('obj-position-controls').innerHTML = posHtml;
    
    // Build Style controls
    let styleHtml = '<div class="text-style-controls">';
    styleHtml += `<label>Stroke: <input type="color" id="obj-stroke-color" value="${obj.stroke}"></label>`;
    styleHtml += `<label>Thick: <input type="number" id="obj-stroke-width" class="pos-input" value="${obj.strokeWidth}" min="0" max="50"></label>`;
    styleHtml += '</div>';
    document.getElementById('obj-style-controls').innerHTML = styleHtml;
    
    // Build Background controls (empty for now, but structure in place)
    let bgHtml = '<div class="text-style-controls"><p style="color: #999; font-size: 0.9em;">No background options for this object type.</p></div>';
    document.getElementById('obj-background-controls').innerHTML = bgHtml;
    
    // Build Shadow controls
    const shadowColor = obj.shadow?.color || '#000000';
    const shadowColorHex = shadowColor.startsWith('#') ? shadowColor : rgbaToHex(shadowColor);
    const shadowAlpha = shadowColor.startsWith('rgba') ? Math.round(parseFloat(shadowColor.match(/[\d.]+\)$/)?.[0] || 0.7) * 100) : 70;
    
    let shadowHtml = '<div class="text-style-controls text-style-grid-row">';
    shadowHtml += `<label title="Enable Shadow"><input type="checkbox" id="obj-shadow-enabled" ${obj.shadow?.enabled ? 'checked' : ''}> Enable Shadow</label>`;
    shadowHtml += `<label>Shadow Color: <input type="color" id="obj-shadow-color" value="${shadowColorHex}"></label>`;
    shadowHtml += '</div>';
    shadowHtml += '<div class="text-style-controls text-style-grid-row">';
    shadowHtml += `<label>Shadow Alpha: <input type="range" id="obj-shadow-alpha" min="0" max="100" value="${shadowAlpha}" step="5"> <span id="obj-shadow-alpha-value">${shadowAlpha}%</span></label>`;
    shadowHtml += `<label>Shadow Blur: <input type="number" id="obj-shadow-blur" class="pos-input" value="${obj.shadow?.blur || 0}" min="0" max="50"></label>`;
    shadowHtml += '</div>';
    shadowHtml += '<div class="text-style-controls text-style-grid-row">';
    shadowHtml += `<label>Offset X: <input type="number" id="obj-shadow-offset-x" class="pos-input" value="${obj.shadow?.offsetX || 0}" min="-50" max="50"></label>`;
    shadowHtml += `<label>Offset Y: <input type="number" id="obj-shadow-offset-y" class="pos-input" value="${obj.shadow?.offsetY || 0}" min="-50" max="50"></label>`;
    shadowHtml += '</div>';
    document.getElementById('obj-shadow-controls').innerHTML = shadowHtml;
    
    // Build FX controls
    let fxHtml = '<div class="text-style-controls">';
    if (obj.type === 'text') {
        fxHtml += `<label>Font: <select id="obj-font-family">${generateFontOptions(obj.fontFamily)}</select></label>`;
        fxHtml += `<label>Style Preset: <select id="obj-style-preset">`;
        fxHtml += `<option value="" ${obj.stylePresetId ? '' : 'selected'}>None</option>`;
        stylePresets.forEach(preset => {
            fxHtml += `<option value="${preset.id}" ${obj.stylePresetId === preset.id ? 'selected' : ''}>${preset.name}</option>`;
        });
        fxHtml += `</select></label>`;
        fxHtml += '</div>';
        
        // FX parameters (show/hide based on style preset)
        const effectType = obj.advancedEffect?.type || 'none';
        fxHtml += '<div id="obj-fx-params" class="text-style-controls fx-params">';
        fxHtml += `<label class="fx-param-control" data-fx-for="neon splice echo glitch">FX C1: <input type="color" id="obj-effect-color1" value="${obj.advancedEffect?.color1 || '#ff0000'}"></label>`;
        fxHtml += `<label class="fx-param-control" data-fx-for="neon splice echo glitch">FX C2: <input type="color" id="obj-effect-color2" value="${obj.advancedEffect?.color2 || '#00ff00'}"></label>`;
        fxHtml += `<label class="fx-param-control" data-fx-for="glitch">FX C3: <input type="color" id="obj-effect-color3" value="${obj.advancedEffect?.color3 || '#0000ff'}"></label>`;
        fxHtml += `<label class="fx-param-control" data-fx-for="splice echo glitch">Dist: <input type="range" id="obj-effect-distance" min="0" max="50" value="${obj.advancedEffect?.distance || 10}"></label>`;
        fxHtml += `<label class="fx-param-control" data-fx-for="splice echo">Angle: <input type="range" id="obj-effect-angle" min="-180" max="180" value="${obj.advancedEffect?.angle || -45}"></label>`;
        fxHtml += `<label class="fx-param-control" data-fx-for="neon">Glow: <input type="range" id="obj-effect-glow" min="0" max="100" value="${obj.advancedEffect?.glowSize || 20}"></label>`;
        fxHtml += '</div>';
        
        // Update FX visibility after rendering
        setTimeout(() => updateObjFxControlsVisibility(effectType), 0);
    } else {
        fxHtml += '<p style="color: #999; font-size: 0.9em;">No FX options for this object type.</p>';
    }
    document.getElementById('obj-fx-controls').innerHTML = fxHtml;
    
    // Add mouse wheel support to size input
    const sizeInput = document.getElementById('obj-font-size') || document.getElementById('obj-height');
    if (sizeInput) {
        sizeInput.addEventListener('wheel', handleSizeInputWheel);
    }
    
    panel.style.display = 'block';
}

// Helper function to convert rgba to hex
function rgbaToHex(rgba) {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return '#000000';
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

// Update FX controls visibility based on style preset
function updateObjFxControlsVisibility(effectType) {
    const fxParamsContainer = document.getElementById('obj-fx-params');
    if (!fxParamsContainer) return;
    
    const allFxControls = fxParamsContainer.querySelectorAll('.fx-param-control');
    allFxControls.forEach(control => {
        control.style.display = 'none';
    });
    
    if (effectType && effectType !== 'none') {
        const controlsToShow = fxParamsContainer.querySelectorAll(`[data-fx-for*="${effectType}"]`);
        controlsToShow.forEach(control => {
            control.style.display = 'block';
        });
    }
}

// Mouse wheel handler for size inputs
function handleSizeInputWheel(e) {
    e.preventDefault();
    const direction = e.deltaY < 0 ? 1 : -1;
    let currentValue = parseInt(this.value, 10);
    const min = parseInt(this.min, 10) || 1;
    const max = parseInt(this.max, 10) || 1000;
    let newValue = currentValue + direction;
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    this.value = newValue;
    this.dispatchEvent(new Event('input', { bubbles: true }));
}

function handleObjectPropertyChange(e) {
    const obj = getSelectedObject();
    if (!obj) return;

    const target = e.target;
    const id = target.id;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    let dimensionsNeedUpdate = false;

    switch (id) {
        case 'obj-pos-x':
            if (obj.type === 'text' && typeof obj.id === 'number') {
                const halfW = obj.width / 2 || 0;
                const numeric = parseInt(value, 10);
                if (obj.align === 'left') obj.x = numeric + halfW;
                else if (obj.align === 'right') obj.x = numeric - halfW;
                else obj.x = numeric; // center
            } else {
                obj.x = parseInt(value, 10);
            }
            break;
        case 'obj-pos-y':
            if (obj.type === 'text' && typeof obj.id === 'number') {
                const halfH = obj.height / 2 || 0;
                obj.y = parseInt(value, 10) + halfH;
            } else {
                obj.y = parseInt(value, 10);
            }
            break;
        case 'obj-rotation':
            obj.rotation = parseInt(value, 10);
            break;
        case 'obj-height':
            const newHeight = parseInt(value, 10);
            if (obj.img && obj.img.width > 0) { // Ensure image is loaded
                const aspectRatio = obj.img.width / obj.img.height;
                obj.height = newHeight;
                obj.width = newHeight * aspectRatio;
            } else {
                obj.height = newHeight; // Fallback
            }
            break;
        case 'obj-fill-color': obj.fill = value; break;
        case 'obj-text-content':
            obj.text = value;
            dimensionsNeedUpdate = true;
            // Do NOT call updateObjectPropertiesPanel() here to avoid losing focus.
            break;
        case 'obj-text-color': obj.color = value; break;
        case 'obj-font-size':
            obj.size = parseInt(value, 10) || 10;
            dimensionsNeedUpdate = true;
            break;
        case 'obj-font-family':
            obj.fontFamily = value;
            dimensionsNeedUpdate = true;
            break;
        case 'obj-style-preset':
            if (value === '') {
                delete obj.stylePresetId;
                // Reset advanced effect to none
                if (obj.advancedEffect) {
                    obj.advancedEffect.type = 'none';
                }
                updateObjectPropertiesPanel();
                break;
            }
            const newPreset = stylePresets.find(p => p.id === value);
            if (newPreset) {
                const preservedProps = { text: obj.text, x: obj.x, y: obj.y, width: obj.width, height: obj.height, rotation: obj.rotation };
                Object.assign(obj, newPreset, preservedProps);
                obj.stylePresetId = newPreset.id;
                delete obj.id; // Ensure uniqueness on next add
                updateObjectPropertiesPanel();
            }
            break;
        case 'obj-stroke-color': obj.stroke = value; break;
        case 'obj-stroke-width':
            obj.strokeWidth = parseInt(value, 10) || 0;
            dimensionsNeedUpdate = true;
            break;
        case 'obj-shadow-enabled':
            if (!obj.shadow) obj.shadow = {};
            obj.shadow.enabled = target.checked;
            break;
        case 'obj-shadow-color':
            if (!obj.shadow) obj.shadow = {};
            const currentAlpha = obj.shadow.color ? parseFloat(obj.shadow.color.match(/[\d.]+\)$/)?.[0] || 0.7) : 0.7;
            const r = parseInt(value.slice(1, 3), 16);
            const g = parseInt(value.slice(3, 5), 16);
            const b = parseInt(value.slice(5, 7), 16);
            obj.shadow.color = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
            break;
        case 'obj-shadow-alpha':
            if (!obj.shadow) obj.shadow = {};
            const newAlpha = parseFloat(value) / 100;
            document.getElementById('obj-shadow-alpha-value').textContent = `${Math.round(newAlpha * 100)}%`;
            const rgbaMatch = obj.shadow.color?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (rgbaMatch) {
                obj.shadow.color = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${newAlpha})`;
            } else {
                const hexColor = document.getElementById('obj-shadow-color').value;
                const r = parseInt(hexColor.slice(1, 3), 16);
                const g = parseInt(hexColor.slice(3, 5), 16);
                const b = parseInt(hexColor.slice(5, 7), 16);
                obj.shadow.color = `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
            }
            break;
        case 'obj-shadow-blur':
            if (!obj.shadow) obj.shadow = {};
            obj.shadow.blur = parseInt(value, 10) || 0;
            break;
        case 'obj-shadow-offset-x':
            if (!obj.shadow) obj.shadow = {};
            obj.shadow.offsetX = parseInt(value, 10) || 0;
            break;
        case 'obj-shadow-offset-y':
            if (!obj.shadow) obj.shadow = {};
            obj.shadow.offsetY = parseInt(value, 10) || 0;
            break;
        case 'obj-effect-color1':
            if (!obj.advancedEffect) obj.advancedEffect = {};
            obj.advancedEffect.color1 = value;
            break;
        case 'obj-effect-color2':
            if (!obj.advancedEffect) obj.advancedEffect = {};
            obj.advancedEffect.color2 = value;
            break;
        case 'obj-effect-color3':
            if (!obj.advancedEffect) obj.advancedEffect = {};
            obj.advancedEffect.color3 = value;
            break;
        case 'obj-effect-distance':
            if (!obj.advancedEffect) obj.advancedEffect = {};
            obj.advancedEffect.distance = parseFloat(value);
            break;
        case 'obj-effect-angle':
            if (!obj.advancedEffect) obj.advancedEffect = {};
            obj.advancedEffect.angle = parseFloat(value);
            break;
        case 'obj-effect-glow':
            if (!obj.advancedEffect) obj.advancedEffect = {};
            obj.advancedEffect.glowSize = parseFloat(value);
            break;
    }

    if (dimensionsNeedUpdate && obj.type === 'text') {
        if (typeof obj.id === 'number') {
            recalcSnippetDimensions(obj);
        } else {
            const dims = calculateTextDimensions(obj);
            obj.width = dims.width;
            obj.height = dims.height;
        }
    }
    drawThumbnail();
}

function setupObjectPropertyHandlers() {
    const panel = document.getElementById('object-properties-panel');
    
    // Remove any existing listeners to prevent duplicates
    panel.removeEventListener('input', handleObjectPropertyChange);
    panel.removeEventListener('change', handleObjectPropertyChange);
    panel.removeEventListener('click', handleObjectPanelClick);

    // Add fresh listeners
    panel.addEventListener('input', handleObjectPropertyChange);
    panel.addEventListener('change', handleObjectPropertyChange);
    panel.addEventListener('click', handleObjectPanelClick);
}

// Handle clicks for toggles and align buttons
function handleObjectPanelClick(e) {
    const target = e.target;
    
    // Handle toggle buttons
    if (target.classList.contains('toggle-btn') && target.dataset.objControls) {
        const controlId = target.dataset.objControls;
        const controlDiv = document.getElementById(controlId);
        const isVisible = controlDiv.classList.contains('show');
        
        // Close all toggles in the right panel
        document.querySelectorAll('#object-properties-panel .collapsible-controls').forEach(div => {
            div.classList.remove('show');
        });
        document.querySelectorAll('#object-properties-panel .toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Open the clicked toggle if it wasn't already open
        if (!isVisible) {
            controlDiv.classList.add('show');
            target.classList.add('active');
        }
    }
    
    // Handle align buttons
    if (target.classList.contains('align-btn') && target.dataset.objAlign) {
        const obj = getSelectedObject();
        if (!obj || obj.type !== 'text') return;
        
        const alignValue = target.dataset.objAlign;
        obj.align = alignValue;
        
        // For styled text snippets (numeric id), adjust X to mirror Lines 1-4 behaviour
        if (typeof obj.id === 'number') {
            const margin = 38;
            const canvasWidth = canvas.width;
            const halfWidth = obj.width / 2 || 0;
            switch (alignValue) {
                case 'left':
                    obj.x = margin + halfWidth;
                    break;
                case 'center':
                    obj.x = canvasWidth / 2;
                    break;
                case 'right':
                    obj.x = canvasWidth - margin - halfWidth;
                    break;
            }
        }
        
        updateObjectPropertiesPanel();
        drawThumbnail();
    }
}

/**
 * Retrieves the currently selected canvas object.
 * @returns {object|null} The selected object or null if none is selected.
 */
function getSelectedObject() {
    if (selectedObjectIndex !== -1 && canvasObjects[selectedObjectIndex]) {
        return canvasObjects[selectedObjectIndex];
    }
    return null;
}

/**
 * Deletes the currently selected object from the canvas.
 */


function addObject(type, options = {}) {
    objectIdCounter++;
    let newObject;
    if (type === 'text') {
        const defaultFontFamily = "\"Twemoji Country Flags\", 'Berlin Sans FB Demi Bold', sans-serif";
        let combinedFontFamily = defaultFontFamily;
        if (options.fontFamily && !options.fontFamily.includes("Twemoji Country Flags")) {
            combinedFontFamily = `"Twemoji Country Flags", ${options.fontFamily}`;
        } else if (options.fontFamily) {
            combinedFontFamily = options.fontFamily;
        }
        // Ensure a default shadow object is present if not supplied by options
        const defaultShadow = { enabled: false, color: 'rgba(0,0,0,0.7)', blur: 5, offsetX: 2, offsetY: 2 };

        // Destructure to remove the conflicting 'id' from the style preset options
        const { id: presetId, ...restOptions } = options;

        newObject = {
            // Start with defaults
            text: 'New Text',
            size: 100,
            align: 'center',
            wrap: false,
            rotation: 0,
            x: canvas.width / 2,
            y: canvas.height / 2,

            // Apply all style options from the preset, without the conflicting id
            ...restOptions,

            // Enforce critical properties that must not be overridden
            id: objectIdCounter, // Guarantees a unique, numeric ID
            type: 'text',
            fontFamily: combinedFontFamily,
            shadow: { ...defaultShadow, ...(options.shadow || {}) },
        };

        const dims = calculateTextDimensions(newObject);
        newObject.width = dims.width;
        newObject.height = dims.height;
    } else { // For shapes and other potential future objects
        // Create default shadow object to avoid reference sharing
        const defaultShadow = { enabled: false, color: '#000000', blur: 5, offsetX: 5, offsetY: 5 };
        newObject = {
            id: objectIdCounter,
            type: type,
            x: canvas.width / 2,
            y: canvas.height / 2,
            width: 300,
            height: 300,
            rotation: 0,
            stroke: '#000000',
            strokeWidth: 5,
            shadow: { ...defaultShadow, ...(options.shadow || {}) },
            ...options
        };
    };

    if (type === 'square' || type === 'circle' || type === 'arrow') {
        // Ensure fontFamily is correctly set
        if (!newObject.fontFamily || !newObject.fontFamily.includes("Twemoji Country Flags")) {
            const baseFont = newObject.fontFamily || "'Berlin Sans FB Demi Bold', sans-serif";
            newObject.fontFamily = `"Twemoji Country Flags", ${baseFont}`;
        }
        newObject.size = newObject.size || 100; // Already part of text object literal
        newObject.color = newObject.color || '#ffffff'; // Already part of text object literal
        // newObject.strokeColor, newObject.strokeThickness etc. should come from options (stylePreset)
    } else if ((type === 'image' || type === 'person') && newObject.src) {
        const img = new Image();
        img.onload = () => {
            newObject.img = img;
            // For person objects, use the specified height from options, otherwise default to 400
            const targetHeight = (type === 'person' && options.height) ? options.height : (newObject.height || 400);
            const aspectRatio = img.width / img.height;
            newObject.height = targetHeight;
            newObject.width = targetHeight * aspectRatio;
            drawThumbnail();
        };
        img.src = newObject.src;
    }
    canvasObjects.push(newObject);
    selectObject(canvasObjects.length - 1);
}


function deleteSelectedObject() {
    if (selectedObjectIndex !== -1) {
        canvasObjects.splice(selectedObjectIndex, 1);
        selectedObjectIndex = -1;
        updateObjectPropertiesPanel(); // Hide panel
        drawThumbnail(); // Redraw canvas
    }
}

/**
 * Adds a new image object to the canvas from a file.
 * @param {File} file The image file to add.
 */
function addNewImageObject(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            const newImageObject = {
                type: 'person',
                img: img,
                x: canvas.width / 2,
                y: canvas.height / 2,
                width: img.width / 2,
                height: img.height / 2,
                rotation: 0,
                stroke: '#00ff00',
                strokeWidth: 15,
                shadowEnabled: true,
                shadowColor: '#000000',
                shadowBlur: 0,
                shadowOffsetX: 0
            };
            canvasObjects.push(newImageObject);
            selectObject(canvasObjects.length - 1);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

/**
 * Calculates the visual width and height of a text object using an off-screen canvas.
 * For snippets we only need single-line measurement; wrapped width will be recalculated
 * by recalcSnippetDimensions after wrapText.
 */
function calculateTextDimensions(textObject) {
    const tmpCtx = document.createElement('canvas').getContext('2d');
    const family = textObject.fontFamily || '"Twemoji Country Flags", "Berlin Sans FB Demi Bold", sans-serif';
    const finalFamily = family.includes('Twemoji Country Flags') ? family : `"Twemoji Country Flags", ${family}`;
    tmpCtx.font = `bold ${textObject.size}px ${finalFamily}`;
    const metrics = tmpCtx.measureText(textObject.text || '');
    const width = metrics.width;
    const height = textObject.size * 1.2;
    return { width, height };
}

/**
 * Recalculates width/height of a styled text snippet while keeping its visual anchor
 * (left/top edge) fixed. Assumes obj.x is centre X and obj.y is centre Y.
 * @param {object} obj Styled text snippet object
 */
function recalcSnippetDimensions(obj) {
    // Only update width/height, never x/y here!
    const prevWidth = obj.width || 0;
    const prevHeight = obj.height || 0;
    const tmpCtx = document.createElement('canvas').getContext('2d');
    const fontFamily = obj.fontFamily || '"Twemoji Country Flags", "Berlin Sans FB Demi Bold", sans-serif';
    tmpCtx.font = `bold ${obj.size || 100}px ${fontFamily}`;
    const lineHeight = (obj.size || 100) * 1.2;
    let lines = [obj.text || ''];
    if (obj.wrap) {
        // Use wrapText logic as in drawTextWithEffect
        const margin = 38;
        const canvasWidth = canvas.width;
        let maxWrapWidth = canvasWidth - margin * 2;
        let anchorX = obj.x;
        if (obj.align === 'left') {
            anchorX = margin;
            maxWrapWidth = canvasWidth - anchorX - margin;
        } else if (obj.align === 'right') {
            anchorX = canvasWidth - margin;
            maxWrapWidth = anchorX - margin;
        } else {
            anchorX = canvasWidth / 2;
            maxWrapWidth = canvasWidth - margin * 2;
        }
        lines = wrapText(tmpCtx, obj.text || '', anchorX, 0, maxWrapWidth, lineHeight, obj.align, anchorX, canvasWidth);
    }
    const widest = Math.max(...lines.map(l => tmpCtx.measureText(l).width), 1);
    obj.width = widest;
    obj.height = lines.length * lineHeight;
    // Do NOT update obj.x or obj.y here unless explicitly requested (e.g. alignment change)
}

// Helper: Only call this after alignment change or explicit anchor update
function recalcSnippetDimensionsWithAnchor(obj, anchorMode) {
    // anchorMode: 'left', 'center', 'right'
    const prevWidth = obj.width || 0;
    const prevHeight = obj.height || 0;
    const tmpCtx = document.createElement('canvas').getContext('2d');
    const fontFamily = obj.fontFamily || '"Twemoji Country Flags", "Berlin Sans FB Demi Bold", sans-serif';
    tmpCtx.font = `bold ${obj.size || 100}px ${fontFamily}`;
    const lineHeight = (obj.size || 100) * 1.2;
    let lines = [obj.text || ''];
    const margin = 38;
    const canvasWidth = canvas.width;
    let maxWrapWidth = canvasWidth - margin * 2;
    let anchorX = obj.x;
    if (obj.wrap) {
        if (anchorMode === 'left') {
            anchorX = margin;
            maxWrapWidth = canvasWidth - anchorX - margin;
        } else if (anchorMode === 'right') {
            anchorX = canvasWidth - margin;
            maxWrapWidth = anchorX - margin;
        } else {
            anchorX = canvasWidth / 2;
            maxWrapWidth = canvasWidth - margin * 2;
        }
        lines = wrapText(tmpCtx, obj.text || '', anchorX, 0, maxWrapWidth, lineHeight, anchorMode, anchorX, canvasWidth);
    }
    const widest = Math.max(...lines.map(l => tmpCtx.measureText(l).width), 1);
    const dims = { width: widest, height: lines.length * lineHeight };
    const deltaW = dims.width - prevWidth;
    const deltaH = dims.height - prevHeight;
    // Horizontal anchor (update obj.x)
    if (obj.wrap) {
        if (anchorMode === 'left') {
            obj.x = margin + dims.width / 2;
        } else if (anchorMode === 'right') {
            obj.x = canvasWidth - margin - dims.width / 2;
        } else {
            obj.x = canvasWidth / 2;
        }
    }
    // Vertical: keep top fixed
    obj.y += deltaH / 2;
    obj.width = dims.width;
    obj.height = dims.height;
}



// Set up a global keydown listener for object deletion
document.addEventListener('keydown', function (e) {
    // Make sure we're not typing in an input field
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelectedObject();
    }
});


