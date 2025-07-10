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
    selectedObjectIndex = index;
    updateObjectPropertiesPanel();
    drawThumbnail();
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
    const contentDiv = document.getElementById('properties-content');
    if (selectedObjectIndex < 0) {
        panel.style.display = 'none';
        return;
    }
    const obj = canvasObjects[selectedObjectIndex];
    let html = '<div class="prop-grid">';

    // Position and Rotation for all objects
    html += `<label for="obj-pos-x">X</label><input type="number" id="obj-pos-x" value="${Math.round(obj.x)}">`;
    html += `<label for="obj-pos-y">Y</label><input type="number" id="obj-pos-y" value="${Math.round(obj.y)}">`;
    html += `<label for="obj-rotation">Rotation</label><input type="number" id="obj-rotation" min="0" max="360" value="${obj.rotation}">`;


    if (['shape', 'square', 'circle', 'arrow'].includes(obj.type)) {
        html += `<label for="obj-fill-color">Fill</label><input type="color" id="obj-fill-color" value="${obj.fill}">`;
    } else if (obj.type === 'text') {
        html += `<label for="obj-text-content">Text</label><input type="text" id="obj-text-content" value="${obj.text}">`;
        html += `<label for="obj-text-color">Color</label><div class="color-picker-wrapper"><input type="color" id="obj-text-color" value="${obj.color}"><div class="color-preview"></div></div>`;
        html += `<label for="obj-font-size">Size</label><input type="number" id="obj-font-size" min="1" max="1000" value="${obj.size}">`;
        html += `<label for="obj-font-family">Font</label><select id="obj-font-family">${generateFontOptions(obj.fontFamily)}</select>`;
        html += `<label for="obj-align">Align</label><select id="obj-align"><option value="left" ${obj.align === 'left' ? 'selected' : ''}>Left</option><option value="center" ${obj.align === 'center' ? 'selected' : ''}>Center</option><option value="right" ${obj.align === 'right' ? 'selected' : ''}>Right</option></select>`;
        html += `<label for="obj-wrap">Wrap</label><input type="checkbox" id="obj-wrap" ${obj.wrap ? 'checked' : ''}>`;

        // Add style preset selector if the object was created from a preset
        if (obj.stylePresetId) {
            html += `<label for="obj-style-preset">Style Preset</label><select id="obj-style-preset">`;
            stylePresets.forEach(preset => {
                html += `<option value="${preset.id}" ${obj.stylePresetId === preset.id ? 'selected' : ''}>${preset.name}</option>`;
            });
            html += `</select>`;
        }
    } else if (obj.type === 'image' || obj.type === 'person') {
        html += `<label for="obj-height">Height</label><input type="number" id="obj-height" value="${Math.round(obj.height)}">`;
    }
    html += `<label for="obj-stroke-color">Stroke</label><div class="color-picker-wrapper"><input type="color" id="obj-stroke-color" value="${obj.stroke}"><div class="color-preview"></div></div>`;
    html += `<label for="obj-stroke-width">Stroke Width</label><input type="number" id="obj-stroke-width" min="0" max="100" value="${obj.strokeWidth}">`;
    html += `<label for="obj-shadow-enabled">Shadow</label><input type="checkbox" id="obj-shadow-enabled" ${obj.shadow.enabled ? 'checked' : ''}>`;
    html += `<label for="obj-shadow-color">Shadow Color</label><div class="color-picker-wrapper"><input type="color" id="obj-shadow-color" value="${obj.shadow.color}"><div class="color-preview"></div></div>`;
    html += `<label for="obj-shadow-blur">Shadow Blur</label><input type="number" id="obj-shadow-blur" min="0" max="100" value="${obj.shadow.blur || 0}">`;
    html += `<label for="obj-shadow-offset-x">Shadow X</label><input type="number" id="obj-shadow-offset-x" min="-100" max="100" value="${obj.shadow.offsetX || 0}">`;
    html += `<label for="obj-shadow-offset-y">Shadow Y</label><input type="number" id="obj-shadow-offset-y" min="-100" max="100" value="${obj.shadow.offsetY || 0}">`;
    html += '</div>';
    contentDiv.innerHTML = html;
    panel.style.display = 'block';
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
            obj.x = parseInt(value, 10);
            break;
        case 'obj-pos-y': 
            obj.y = parseInt(value, 10);
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
        case 'obj-align': 
            obj.align = value;
            break;
        case 'obj-wrap': 
            obj.wrap = target.checked;
            dimensionsNeedUpdate = true;
            break;
        case 'obj-style-preset':
            const newPreset = stylePresets.find(p => p.id === value);
            if (newPreset) {
                const preservedProps = { text: obj.text, x: obj.x, y: obj.y, width: obj.width, height: obj.height, rotation: obj.rotation };
                Object.assign(obj, newPreset, preservedProps);
                obj.stylePresetId = newPreset.id;
                delete obj.id;
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
            updateObjectPropertiesPanel();
            break;
        case 'obj-shadow-color':
            if (!obj.shadow) obj.shadow = {};
            obj.shadow.color = value;
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
    }

    if (dimensionsNeedUpdate && obj.type === 'text') {
        const dims = calculateTextDimensions(obj);
        obj.width = dims.width;
        obj.height = dims.height;
    }

    drawThumbnail();
}

function setupObjectPropertyHandlers() {
    const contentDiv = document.getElementById('properties-content');
    // Remove any existing listeners to prevent duplicates
    contentDiv.removeEventListener('input', handleObjectPropertyChange);
    contentDiv.removeEventListener('change', handleObjectPropertyChange);

    // Add fresh listeners
    contentDiv.addEventListener('input', handleObjectPropertyChange);
    contentDiv.addEventListener('change', handleObjectPropertyChange);
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
        newObject = { id: objectIdCounter, type: type, x: canvas.width / 2, y: canvas.height / 2, width: 300, height: 300, rotation: 0, stroke: '#000000', strokeWidth: 5, shadow: { enabled: false, color: '#000000', blur: 5, offsetX: 5, offsetY: 5 }, ...options };
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
            const maxDim = 400;
            if (img.width > img.height) { newObject.width = maxDim; newObject.height = img.height * (maxDim / img.width); }
            else { newObject.height = maxDim; newObject.width = img.width * (maxDim / img.height); }
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
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const newImageObject = {
                type: 'person',
                img: img,
                x: canvas.width / 2,
                y: canvas.height / 2,
                width: img.width / 2, 
                height: img.height / 2,
                rotation: 0,
                stroke: '#000000',
                strokeWidth: 0,
                shadowEnabled: false,
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
 * Calculates the width and height of a text object.
 * @param {object} textObject The text object to measure.
 * @returns {{width: number, height: number}} The calculated dimensions.
 */
function calculateTextDimensions(textObject) {
    ctx.font = `bold ${textObject.size}px "${textObject.fontFamily || 'Berlin Sans FB Demi Bold'}"`;
    const metrics = ctx.measureText(textObject.text);
    return {
        width: metrics.width,
        height: textObject.size
    };
}

// Set up a global keydown listener for object deletion
document.addEventListener('keydown', function(e) {
    // Make sure we're not typing in an input field
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelectedObject();
    }
});


