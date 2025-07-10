// --- Global Variables & State ---

// Declare canvas and context globally, but initialize them after the DOM is loaded.
let canvas, ctx;

let activeSnippetStyleId = null; // For the two-step snippet adder
let G_successfullyLoadedFonts = []; // Global list for successfully loaded fonts
let objectIdCounter = 0;
let canvasObjects = []; 
let selectedObjectIndex = -1;

// State for background image filters
let backgroundImageState = {
    brightness: 100, contrast: 100, saturate: 100, warmth: 100, exposure: 100,
    tintColor: '#FFBF00', tintStrength: 0, vignette: 0, zoom: 100,
    offsetX: 0, offsetY: 0, baseCoverZoom: 1
};

// Drag operations state
let dragState = {
    isDragging: false, target: null, index: -1, startX: 0, startY: 0,
    elementStartX: 0, elementStartY: 0
};

let currentImage = null;
let currentLayout = 1;

let selectedLogo = {
    src: null, img: null, position: 'bottom-left', scale: 0.15, padding: 20
};

let currentImageBaseCoverZoom = 1;
let imageOffsetX = 0;
let imageOffsetY = 0;

// Initialize textElements with default values. Some properties will be updated post-DOM load.
let textElements = [
    {}, {}, {}, {}
].map((el, i) => ({
    id: `text${i+1}`, inputId: `text${i+1}`, colorId: `color${i+1}`, sizeId: `size${i+1}`,
    x: 960, y: 324, // Default positions, will be updated
    align: 'center', text: '', wrap: false, size: 100,
    fontFamily: "\"Twemoji Country Flags\", 'Berlin Sans FB Demi Bold', sans-serif",
    color: '#FFFFFF',
    strokeColor: '#000000', strokeThickness: 2,
    bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10,
    shadowEnabled: false, shadowColor: 'rgba(0,0,0,0.7)', shadowBlur: 5, shadowOffsetX: 2, shadowOffsetY: 2,
    advancedEffect: {
        type: 'none', color1: '#ff0000', color2: '#00ff00', color3: '#0000ff',
        distance: 10, angle: -45, glowSize: 20
    }
}));

// --- DOM-Dependent Initializations ---
document.addEventListener('DOMContentLoaded', () => {
    // Assign canvas and context now that the DOM is loaded
    canvas = document.getElementById('thumbnailCanvas');
    ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = 1920;
    canvas.height = 1080;

    // Update textElements with canvas-dependent positions
    textElements.forEach(el => {
        el.x = canvas.width * 0.5;
        el.y = canvas.height * 0.3; // Adjust as needed for default layout
    });
});