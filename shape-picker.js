// =================================================================================
// Shape Picker Modal System
// =================================================================================
// 2-step modal system for selecting shapes and their styles

// Shape presets data - different styles for each shape type
const shapePresets = {
    arrow: [
        {
            id: 'arrow-basic',
            name: 'Basic Arrow',
            type: 'arrow',
            text: '→',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#4B4BE2'
        },
        {
            id: 'arrow-left',
            name: 'Left Arrow',
            type: 'arrow',
            text: '←',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#4B4BE2'
        },
        {
            id: 'arrow-up',
            name: 'Up Arrow',
            type: 'arrow',
            text: '↑',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#28a745'
        },
        {
            id: 'arrow-down',
            name: 'Down Arrow',
            type: 'arrow',
            text: '↓',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#dc3545'
        },
        {
            id: 'arrow-thick',
            name: 'Thick Arrow',
            type: 'arrow',
            text: '➤',
            size: 140,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 5,
            fill: '#ff6b35'
        },
        {
            id: 'arrow-thick-left',
            name: 'Thick Left',
            type: 'arrow',
            text: '◀',
            size: 140,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 5,
            fill: '#ff6b35'
        },
        {
            id: 'arrow-thick-up',
            name: 'Thick Up',
            type: 'arrow',
            text: '▲',
            size: 140,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 5,
            fill: '#28a745'
        },
        {
            id: 'arrow-thick-down',
            name: 'Thick Down',
            type: 'arrow',
            text: '▼',
            size: 140,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 5,
            fill: '#dc3545'
        },
        {
            id: 'arrow-curved-left',
            name: 'Sharp Left',
            type: 'arrow',
            text: '↰',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#28a745'
        },
        {
            id: 'arrow-curved-right',
            name: 'Sharp Right',
            type: 'arrow',
            text: '↱',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#28a745'
        },
        {
            id: 'arrow-curved-down-left',
            name: 'Diag Down Left',
            type: 'arrow',
            text: '↙',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#6f42c1'
        },
        {
            id: 'arrow-curved-down-right',
            name: 'Diag Down Right',
            type: 'arrow',
            text: '↘',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#6f42c1'
        },
        {
            id: 'arrow-double',
            name: 'Double Arrow',
            type: 'arrow',
            text: '⇒',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 4,
            fill: '#6f42c1'
        },
        {
            id: 'arrow-double-left',
            name: 'Double Left',
            type: 'arrow',
            text: '⇐',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 4,
            fill: '#6f42c1'
        },
        {
            id: 'arrow-double-up',
            name: 'Double Up',
            type: 'arrow',
            text: '⇑',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 4,
            fill: '#28a745'
        },
        {
            id: 'arrow-double-down',
            name: 'Double Down',
            type: 'arrow',
            text: '⇓',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 4,
            fill: '#dc3545'
        },
        {
            id: 'arrow-heavy',
            name: 'Heavy Arrow',
            type: 'arrow',
            text: '➡',
            size: 130,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 4,
            fill: '#ff6b35'
        },
        {
            id: 'arrow-heavy-left',
            name: 'Heavy Left',
            type: 'arrow',
            text: '⬅',
            size: 130,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 4,
            fill: '#ff6b35'
        },
        {
            id: 'arrow-heavy-up',
            name: 'Heavy Up',
            type: 'arrow',
            text: '⬆',
            size: 130,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 4,
            fill: '#28a745'
        },
        {
            id: 'arrow-heavy-down',
            name: 'Heavy Down',
            type: 'arrow',
            text: '⬇',
            size: 130,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 4,
            fill: '#dc3545'
        },
        {
            id: 'arrow-curved-up-left',
            name: 'Diag Up Left',
            type: 'arrow',
            text: '↖',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#6f42c1'
        },
        {
            id: 'arrow-curved-up-right',
            name: 'Diag Up Right',
            type: 'arrow',
            text: '↗',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#6f42c1'
        },
        {
            id: 'arrow-curved-down-up',
            name: 'Sharp Down Right',
            type: 'arrow',
            text: '↳',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#28a745'
        },
        {
            id: 'arrow-curved-up-down',
            name: 'Sharp Down Left',
            type: 'arrow',
            text: '↲',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#28a745'
        },
        {
            id: 'arrow-curved-clockwise',
            name: 'Clockwise',
            type: 'arrow',
            text: '↻',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#ff6b35'
        },
        {
            id: 'arrow-curved-counter-clockwise',
            name: 'Counter Clockwise',
            type: 'arrow',
            text: '↺',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#ff6b35'
        },
        {
            id: 'arrow-curved-refresh',
            name: 'Refresh Arrow',
            type: 'arrow',
            text: '⟲',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#28a745'
        },
        {
            id: 'arrow-curved-reload',
            name: 'Reload Arrow',
            type: 'arrow',
            text: '⟳',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#28a745'
        },
        {
            id: 'arrow-curved-hook-left',
            name: 'Hook Left',
            type: 'arrow',
            text: '↩',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#dc3545'
        },
        {
            id: 'arrow-curved-hook-right',
            name: 'Hook Right',
            type: 'arrow',
            text: '↪',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#dc3545'
        },
        {
            id: 'arrow-curved-return',
            name: 'Return Arrow',
            type: 'arrow',
            text: '↵',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#ffc107'
        },
        {
            id: 'arrow-curved-tab',
            name: 'Tab Arrow',
            type: 'arrow',
            text: '↹',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#ffc107'
        },
        {
            id: 'arrow-curved-upanddown',
            name: 'Up and down left',
            type: 'arrow',
            text: '↶',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#ffc107'
        },
        {
            id: 'arrow-curved-downandup',
            name: 'Up and down right',
            type: 'arrow',
            text: '↷',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#ffc107'
        }

    ],
    circle: [
        {
            id: 'circle-basic',
            name: 'Basic Circle',
            type: 'circle',
            text: '●',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#4B4BE2'
        },
        {
            id: 'circle-outline',
            name: 'Outline Circle',
            type: 'circle',
            text: '○',
            size: 120,
            color: '#000000',
            stroke: '#000000',
            strokeWidth: 5,
            fill: 'transparent'
        },
        {
            id: 'circle-dot',
            name: 'Small Dot',
            type: 'circle',
            text: '•',
            size: 80,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 2,
            fill: '#dc3545'
        },
        {
            id: 'circle-large',
            name: 'Large Circle',
            type: 'circle',
            text: '●',
            size: 160,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 4,
            fill: '#28a745'
        },
        {
            id: 'circle-gradient',
            name: 'Gradient Style',
            type: 'circle',
            text: '●',
            size: 130,
            color: '#ffffff',
            stroke: '#ffc107',
            strokeWidth: 6,
            fill: '#ff6b35'
        }
    ],
    square: [
        {
            id: 'square-basic',
            name: 'Basic Square',
            type: 'square',
            text: '■',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#4B4BE2'
        },
        {
            id: 'square-outline',
            name: 'Outline Square',
            type: 'square',
            text: '□',
            size: 120,
            color: '#000000',
            stroke: '#000000',
            strokeWidth: 5,
            fill: 'transparent'
        },
        {
            id: 'square-small',
            name: 'Small Square',
            type: 'square',
            text: '▪',
            size: 80,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 2,
            fill: '#dc3545'
        },
        {
            id: 'square-diamond',
            name: 'Diamond',
            type: 'square',
            text: '◆',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#6f42c1'
        },
        {
            id: 'square-rounded',
            name: 'Rounded Square',
            type: 'square',
            text: '▢',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 4,
            fill: '#28a745'
        }
    ],
    target: [
        {
            id: 'target-basic',
            name: 'Basic Target',
            type: 'target',
            text: '⊙',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#dc3545'
        },
        {
            id: 'target-crosshair',
            name: 'Crosshair',
            type: 'target',
            text: '⊕',
            size: 120,
            color: '#000000',
            stroke: '#000000',
            strokeWidth: 4,
            fill: '#ffc107'
        },
        {
            id: 'target-bullseye',
            name: 'Bullseye',
            type: 'target',
            text: '◎',
            size: 130,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 5,
            fill: '#dc3545'
        },
        {
            id: 'target-dot',
            name: 'Target Dot',
            type: 'target',
            text: '⊚',
            size: 110,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#28a745'
        },
        {
            id: 'target-cross',
            name: 'Cross Target',
            type: 'target',
            text: '✚',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 4,
            fill: '#dc3545'
        },
        {
            id: 'target-plus',
            name: 'Plus Target',
            type: 'target',
            text: '⊞',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#28a745'
        },
        {
            id: 'target-x',
            name: 'X Target',
            type: 'target',
            text: '⊗',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 4,
            fill: '#6f42c1'
        },
        {
            id: 'target-star',
            name: 'Star Target',
            type: 'target',
            text: '✦',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#ffc107'
        },
        {
            id: 'target-asterisk',
            name: 'Asterisk Target',
            type: 'target',
            text: '✱',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#ff6b35'
        },
        {
            id: 'target-heavy-cross',
            name: 'Heavy Cross',
            type: 'target',
            text: '✞',
            size: 130,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 4,
            fill: '#dc3545'
        },
        {
            id: 'target-outlined-cross',
            name: 'Outlined Cross',
            type: 'target',
            text: '✠',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#28a745'
        },
        {
            id: 'target-diamond-cross',
            name: 'Diamond Cross',
            type: 'target',
            text: '✢',
            size: 120,
            color: '#ffffff',
            stroke: '#000000',
            strokeWidth: 3,
            fill: '#6f42c1'
        }
    ],
    line: [
        {
            id: 'line-horizontal',
            name: 'Horizontal Line',
            type: 'line',
            text: '—',
            size: 120,
            color: '#000000',
            stroke: '#000000',
            strokeWidth: 5,
            fill: 'transparent'
        },
        {
            id: 'line-vertical',
            name: 'Vertical Line',
            type: 'line',
            text: '|',
            size: 120,
            color: '#000000',
            stroke: '#000000',
            strokeWidth: 5,
            fill: 'transparent'
        },
        {
            id: 'line-diagonal',
            name: 'Diagonal Line',
            type: 'line',
            text: '/',
            size: 120,
            color: '#000000',
            stroke: '#000000',
            strokeWidth: 5,
            fill: 'transparent'
        },
        {
            id: 'line-thick',
            name: 'Thick Line',
            type: 'line',
            text: '━',
            size: 120,
            color: '#000000',
            stroke: '#000000',
            strokeWidth: 8,
            fill: 'transparent'
        },
        {
            id: 'line-dashed',
            name: 'Dashed Line',
            type: 'line',
            text: '┅',
            size: 120,
            color: '#000000',
            stroke: '#000000',
            strokeWidth: 4,
            fill: 'transparent'
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

        button.innerHTML = `
            <div class="shape-style-preview" style="font-size: ${preset.size * 0.4}px; color: ${preset.fill};">
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