// =================================================================================
// Shape Picker Modal System
// =================================================================================
// 2-step modal system for selecting shapes and their styles

// Shape presets data - different styles for each shape type
// Each preset now stores full canvas properties and preview is scaled separately
const shapePresets = {
    arrow: [
        {
            id: 'arrow-basic',
            name: 'Basic Arrow',
            type: 'arrow',
            text: '→',
            // Canvas properties (actual size when added to canvas)
            canvasSize: 300,
            size: 300, // Keep for backward compatibility
            color: '#4B4BE2', // Canvas uses 'color' for text fill
            stroke: '#000000',
            strokeWidth: 8, // Reduced from 25 to show fill properly
            shadow: { enabled: true, color: 'rgba(0,0,0,0.3)', blur: 8, offsetX: 3, offsetY: 3 },
            // Preview properties (for shape picker display)
            previewScale: 0.4
        },
        {
            id: 'arrow-left',
            name: 'Left Arrow',
            type: 'arrow',
            text: '←',
            canvasSize: 300,
            size: 300,
            color: '#4B4BE2', // Canvas uses 'color' for text fill
            stroke: '#000000',
            strokeWidth: 8, // Reduced from 25 to show fill properly
            shadow: { enabled: true, color: 'rgba(0,0,0,0.3)', blur: 8, offsetX: 3, offsetY: 3 },
            previewScale: 0.4
        },
        {
            id: 'arrow-up',
            name: 'Up Arrow',
            type: 'arrow',
            text: '↑',
            canvasSize: 300,
            size: 300,
            color: '#28a745', // Canvas uses 'color' for text fill
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-down',
            name: 'Down Arrow',
            type: 'arrow',
            text: '↓',
            canvasSize: 300,
            size: 300,
            color: '#dc3545', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-thick',
            name: 'Thick Arrow',
            type: 'arrow',
            text: '➤',
            canvasSize: 140,
            size: 140,
            color: '#ff6b35', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 5,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-thick-left',
            name: 'Thick Left',
            type: 'arrow',
            text: '◀',
            canvasSize: 140,
            size: 140,
            color: '#ff6b35', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 5,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-thick-up',
            name: 'Thick Up',
            type: 'arrow',
            text: '▲',
            canvasSize: 140,
            size: 140,
            color: '#28a745', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 5,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-thick-down',
            name: 'Thick Down',
            type: 'arrow',
            text: '▼',
            canvasSize: 140,
            size: 140,
            color: '#dc3545', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 5,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-left',
            name: 'Sharp Left',
            type: 'arrow',
            text: '↰',
            canvasSize: 300,
            size: 300,
            color: '#28a745', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-right',
            name: 'Sharp Right',
            type: 'arrow',
            text: '↱',
            canvasSize: 300,
            size: 300,
            color: '#28a745', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-down-left',
            name: 'Diag Down Left',
            type: 'arrow',
            text: '↙',
            canvasSize: 300,
            size: 300,
            color: '#6f42c1', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-down-right',
            name: 'Diag Down Right',
            type: 'arrow',
            text: '↘',
            canvasSize: 300,
            size: 300,
            color: '#6f42c1', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-double',
            name: 'Double Arrow',
            type: 'arrow',
            text: '⇒',
            canvasSize: 300,
            size: 300,
            color: '#6f42c1', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-double-left',
            name: 'Double Left',
            type: 'arrow',
            text: '⇐',
            canvasSize: 300,
            size: 300,
            color: '#6f42c1', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-double-up',
            name: 'Double Up',
            type: 'arrow',
            text: '⇑',
            canvasSize: 300,
            size: 300,
            color: '#28a745', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-double-down',
            name: 'Double Down',
            type: 'arrow',
            text: '⇓',
            canvasSize: 300,
            size: 300,
            color: '#dc3545', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-heavy',
            name: 'Heavy Arrow',
            type: 'arrow',
            text: '➡',
            canvasSize: 130,
            size: 130,
            color: '#ff6b35', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-heavy-left',
            name: 'Heavy Left',
            type: 'arrow',
            text: '⬅',
            canvasSize: 130,
            size: 130,
            color: '#ff6b35', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-heavy-up',
            name: 'Heavy Up',
            type: 'arrow',
            text: '⬆',
            canvasSize: 130,
            size: 130,
            color: '#28a745', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-heavy-down',
            name: 'Heavy Down',
            type: 'arrow',
            text: '⬇',
            canvasSize: 130,
            size: 130,
            color: '#dc3545', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-up-left',
            name: 'Diag Up Left',
            type: 'arrow',
            text: '↖',
            canvasSize: 300,
            size: 300,
            color: '#6f42c1', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-up-right',
            name: 'Diag Up Right',
            type: 'arrow',
            text: '↗',
            canvasSize: 300,
            size: 300,
            color: '#6f42c1', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-down-up',
            name: 'Sharp Down Right',
            type: 'arrow',
            text: '↳',
            canvasSize: 300,
            size: 300,
            color: '#28a745', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-up-down',
            name: 'Sharp Down Left',
            type: 'arrow',
            text: '↲',
            canvasSize: 300,
            size: 300,
            color: '#28a745', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-clockwise',
            name: 'Clockwise',
            type: 'arrow',
            text: '↻',
            canvasSize: 300,
            size: 300,
            color: '#ff6b35', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-counter-clockwise',
            name: 'Counter Clockwise',
            type: 'arrow',
            text: '↺',
            canvasSize: 300,
            size: 300,
            color: '#ff6b35', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-refresh',
            name: 'Refresh Arrow',
            type: 'arrow',
            text: '⟲',
            canvasSize: 300,
            size: 300,
            color: '#28a745', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-reload',
            name: 'Reload Arrow',
            type: 'arrow',
            text: '⟳',
            canvasSize: 300,
            size: 300,
            color: '#28a745', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-hook-left',
            name: 'Hook Left',
            type: 'arrow',
            text: '↩',
            canvasSize: 300,
            size: 300,
            color: '#dc3545', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-hook-right',
            name: 'Hook Right',
            type: 'arrow',
            text: '↪',
            canvasSize: 300,
            size: 300,
            color: '#dc3545', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-return',
            name: 'Return Arrow',
            type: 'arrow',
            text: '↵',
            canvasSize: 300,
            size: 300,
            color: '#ffc107', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-tab',
            name: 'Tab Arrow',
            type: 'arrow',
            text: '↹',
            canvasSize: 300,
            size: 300,
            color: '#ffc107', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-upanddown',
            name: 'Up and down left',
            type: 'arrow',
            text: '↶',
            canvasSize: 300,
            size: 300,
            color: '#ffc107', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'arrow-curved-downandup',
            name: 'Up and down right',
            type: 'arrow',
            text: '↷',
            canvasSize: 300,
            size: 300,
            color: '#ffc107', // Use the intended color, not red
            stroke: '#000000',
            strokeWidth: 8, // Reduced to show fill properly
            shadow: { enabled: false },
            previewScale: 0.4
        }

    ],
    circle: [
        {
            id: 'circle-basic',
            name: 'Basic Circle',
            type: 'circle',
            text: '●',
            canvasSize: 300,
            size: 300,
            color: '#4B4BE2',
            stroke: '#000000',
            strokeWidth: 8,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'circle-outline',
            name: 'Outline Circle',
            type: 'circle',
            text: '○',
            canvasSize: 300,
            size: 300,
            color: '#000000',
            stroke: '#000000',
            strokeWidth: 5,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'circle-dot',
            name: 'Small Dot',
            type: 'circle',
            text: '•',
            canvasSize: 80,
            size: 80,
            color: '#dc3545',
            stroke: '#000000',
            strokeWidth: 2,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'circle-large',
            name: 'Large Circle',
            type: 'circle',
            text: '●',
            canvasSize: 160,
            size: 160,
            color: '#28a745',
            stroke: '#000000',
            strokeWidth: 8,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'circle-gradient',
            name: 'Gradient Style',
            type: 'circle',
            text: '●',
            canvasSize: 130,
            size: 130,
            color: '#ff6b35',
            stroke: '#ffc107',
            strokeWidth: 6,
            shadow: { enabled: false },
            previewScale: 0.4
        }
    ],
    square: [
        {
            id: 'square-basic',
            name: 'Basic Square',
            type: 'square',
            text: '■',
            canvasSize: 300,
            size: 300,
            color: '#4B4BE2',
            stroke: '#000000',
            strokeWidth: 8,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'square-outline',
            name: 'Outline Square',
            type: 'square',
            text: '□',
            canvasSize: 300,
            size: 300,
            color: '#000000',
            stroke: '#000000',
            strokeWidth: 5,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'square-small',
            name: 'Small Square',
            type: 'square',
            text: '▪',
            canvasSize: 80,
            size: 80,
            color: '#dc3545',
            stroke: '#000000',
            strokeWidth: 2,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'square-diamond',
            name: 'Diamond',
            type: 'square',
            text: '◆',
            canvasSize: 300,
            size: 300,
            color: '#6f42c1',
            stroke: '#000000',
            strokeWidth: 8,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'square-rounded',
            name: 'Rounded Square',
            type: 'square',
            text: '▢',
            canvasSize: 300,
            size: 300,
            color: '#28a745',
            stroke: '#000000',
            strokeWidth: 8,
            shadow: { enabled: false },
            previewScale: 0.4
        }
    ],
    target: [
        {
            id: 'target-basic',
            name: 'Basic Target',
            type: 'target',
            text: '⊙',
            canvasSize: 300,
            size: 300,
            color: '#dc3545',
            stroke: '#000000',
            strokeWidth: 8,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'target-crosshair',
            name: 'Crosshair',
            type: 'target',
            text: '⊕',
            canvasSize: 300,
            size: 300,
            color: '#ffc107',
            stroke: '#000000',
            strokeWidth: 8,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'target-bullseye',
            name: 'Bullseye',
            type: 'target',
            text: '◎',
            canvasSize: 130,
            size: 130,
            color: '#dc3545',
            stroke: '#000000',
            strokeWidth: 5,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'target-dot',
            name: 'Target Dot',
            type: 'target',
            text: '⊚',
            canvasSize: 110,
            size: 110,
            color: '#28a745',
            stroke: '#000000',
            strokeWidth: 8,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'target-cross',
            name: 'Cross Target',
            type: 'target',
            text: '✚',
            canvasSize: 300,
            size: 300,
            color: '#dc3545',
            stroke: '#000000',
            strokeWidth: 8,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'target-plus',
            name: 'Plus Target',
            type: 'target',
            text: '⊞',
            canvasSize: 300,
            size: 300,
            color: '#28a745',
            stroke: '#000000',
            strokeWidth: 8,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'target-x',
            name: 'X Target',
            type: 'target',
            text: '⊗',
            canvasSize: 300,
            size: 300,
            color: '#6f42c1',
            stroke: '#000000',
            strokeWidth: 8,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'target-star',
            name: 'Star Target',
            type: 'target',
            text: '✦',
            canvasSize: 300,
            size: 300,
            color: '#ffc107',
            stroke: '#000000',
            strokeWidth: 8,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'target-asterisk',
            name: 'Asterisk Target',
            type: 'target',
            text: '✱',
            canvasSize: 300,
            size: 300,
            color: '#ff6b35',
            stroke: '#000000',
            strokeWidth: 8,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'target-heavy-cross',
            name: 'Heavy Cross',
            type: 'target',
            text: '✞',
            canvasSize: 130,
            size: 130,
            color: '#dc3545',
            stroke: '#000000',
            strokeWidth: 8,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'target-outlined-cross',
            name: 'Outlined Cross',
            type: 'target',
            text: '✠',
            canvasSize: 300,
            size: 300,
            color: '#28a745',
            stroke: '#000000',
            strokeWidth: 8,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'target-diamond-cross',
            name: 'Diamond Cross',
            type: 'target',
            text: '✢',
            canvasSize: 300,
            size: 300,
            color: '#6f42c1',
            stroke: '#000000',
            strokeWidth: 8,
            shadow: { enabled: false },
            previewScale: 0.4
        }
    ],
    line: [
        {
            id: 'line-horizontal',
            name: 'Horizontal Line',
            type: 'line',
            text: '—',
            canvasSize: 300,
            size: 300,
            color: '#000000',
            stroke: '#000000',
            strokeWidth: 5,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'line-vertical',
            name: 'Vertical Line',
            type: 'line',
            text: '|',
            canvasSize: 300,
            size: 300,
            color: '#000000',
            stroke: '#000000',
            strokeWidth: 5,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'line-diagonal',
            name: 'Diagonal Line',
            type: 'line',
            text: '/',
            canvasSize: 300,
            size: 300,
            color: '#000000',
            stroke: '#000000',
            strokeWidth: 5,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'line-thick',
            name: 'Thick Line',
            type: 'line',
            text: '━',
            canvasSize: 300,
            size: 300,
            color: '#000000',
            stroke: '#000000',
            strokeWidth: 8,
            shadow: { enabled: false },
            previewScale: 0.4
        },
        {
            id: 'line-dashed',
            name: 'Dashed Line',
            type: 'line',
            text: '┅',
            canvasSize: 300,
            size: 300,
            color: '#000000',
            stroke: '#000000',
            strokeWidth: 8, // Reduced from 25 to be more reasonable
            shadow: { enabled: false },
            previewScale: 0.4
        }
    ]
};

let selectedShapeType = null;

// Show the shape picker modal
function showShapePicker() {
    document.getElementById('shape-picker-modal').style.display = 'flex';
    document.getElementById('shape-picker-step1').style.display = 'block';
    document.getElementById('shape-picker-step2').style.display = 'none';
    selectedShapeType = null;
}

// Close the shape picker modal
function closeShapePicker() {
    document.getElementById('shape-picker-modal').style.display = 'none';
    selectedShapeType = null;
}

// Show step 1 (shape type selection)
function showShapePickerStep1() {
    document.getElementById('shape-picker-step1').style.display = 'block';
    document.getElementById('shape-picker-step2').style.display = 'none';
    selectedShapeType = null;
}

// Show step 2 (shape style selection)
function showShapePickerStep2(shapeType) {
    selectedShapeType = shapeType;
    document.getElementById('selected-shape-name').textContent = shapeType.charAt(0).toUpperCase() + shapeType.slice(1);

    // Populate the shape style grid
    const styleGrid = document.getElementById('shape-style-grid');
    styleGrid.innerHTML = '';

    const presets = shapePresets[shapeType] || [];
    presets.forEach(preset => {
        const button = document.createElement('button');
        button.className = 'shape-style-btn';
        button.dataset.shapePreset = preset.id;

        // Use canvasSize and previewScale if available, otherwise fallback to old method
        const canvasSize = preset.canvasSize || preset.size;
        const previewScale = preset.previewScale || 0.4;

        // Build comprehensive preview styles using full canvas properties
        // Canvas uses 'color' for text fill, so prioritize that over 'fill'
        const textColor = preset.color || preset.fill || '#000000';
        const stroke = preset.stroke || '#000000';
        const strokeWidth = preset.strokeWidth || 0;

        // Create shadow style if shadow is enabled - use full canvas values
        let shadowStyle = '';
        if (preset.shadow && preset.shadow.enabled) {
            const shadowX = preset.shadow.offsetX || 2;
            const shadowY = preset.shadow.offsetY || 2;
            const shadowBlur = preset.shadow.blur || 5;
            const shadowColor = preset.shadow.color || 'rgba(0,0,0,0.3)';
            shadowStyle = `text-shadow: ${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor};`;
        }

        button.innerHTML = `
            <div class="shape-style-preview" style="
                font-size: ${canvasSize}px; 
                color: ${textColor};
                -webkit-text-stroke: ${strokeWidth}px ${stroke};
                text-stroke: ${strokeWidth}px ${stroke};
                ${shadowStyle}
                transform: scale(${previewScale});
                transform-origin: center;
                display: inline-block;
                line-height: 1;
            ">
                ${preset.text}
            </div>
            <span>${preset.name}</span>
        `;

        styleGrid.appendChild(button);
    });

    document.getElementById('shape-picker-step1').style.display = 'none';
    document.getElementById('shape-picker-step2').style.display = 'block';
}

// Handle shape selection and add to canvas
function selectShapeStyle(presetId) {
    const preset = Object.values(shapePresets).flat().find(p => p.id === presetId);
    if (preset) {
        // Add the shape to the canvas using the existing addObject function
        addObject('text', preset);
        closeShapePicker();
    }
}

// Set up event listeners for the shape picker
function setupShapePickerHandlers() {
    // Shape type buttons
    document.addEventListener('click', (event) => {
        if (event.target.closest('.shape-type-btn')) {
            const button = event.target.closest('.shape-type-btn');
            const shapeType = button.dataset.shapeType;
            if (shapeType) {
                showShapePickerStep2(shapeType);
            }
        }

        // Shape style buttons
        if (event.target.closest('.shape-style-btn')) {
            const button = event.target.closest('.shape-style-btn');
            const presetId = button.dataset.shapePreset;
            if (presetId) {
                selectShapeStyle(presetId);
            }
        }

        // Modal control buttons
        if (event.target.id === 'shape-picker-close-btn') {
            closeShapePicker();
        }
        if (event.target.id === 'shape-picker-back-btn') {
            showShapePickerStep1();
        }
    });
}

// Initialize shape picker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupShapePickerHandlers();
});