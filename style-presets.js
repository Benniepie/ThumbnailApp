// Helper function to convert ARGB integer to a CSS rgba() string
function argbToRgba(argb) {
    if (typeof argb !== 'number') return argb; // Return as-is if it's already a string
    const a = (argb >> 24) & 0xFF;
    const r = (argb >> 16) & 0xFF;
    const g = (argb >> 8) & 0xFF;
    const b = argb & 0xFF;
    const opacity = (a / 255).toFixed(3);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// This is your new library of reusable text styles.
const stylePresets = [
    {
        id: 'dark-glitch',
        name: 'Dark Glitch',
        fontFamily: "'VT323', monospace",
        color: '#FFFFFF',
        strokeColor: '#000000',
        strokeThickness: 0,
        bgColor: 'rgba(0,0,0,0)',
        bgFullWidth: false,
        bgPadding: 10,
        shadow: {
            enabled: false,
            color: 'rgba(0,0,0,0.7)',
            blur: 5,
            offsetX: 2,
            offsetY: 2
        },
        advancedEffect: {
            type: 'glitch',
            color1: argbToRgba(4279317333), // Greenish
            color2: argbToRgba(4278255615), // Blue
            color3: argbToRgba(4294902014), // Magenta
            distance: 5,
            angle: 90, // Not used by glitch, but good to have
        }
    },
    {
        id: 'gold-splice',
        name: 'Gold Splice',
        fontFamily: "'Suez One', serif",
        color: '#FFD700', // Gold
        strokeColor: '#000000',
        strokeThickness: 2,
        bgColor: 'rgba(0,0,0,0)',
        bgFullWidth: false,
        bgPadding: 10,
        shadow: {
            enabled: false,
            color: 'rgba(0,0,0,0.7)',
            blur: 5,
            offsetX: 2,
            offsetY: 2
        },
        advancedEffect: {
            type: 'splice',
            color1: '#FFD700', // Not used by splice, but good practice
            color2: '#8B4513', // SaddleBrown for the 3D part
            color3: null,
            distance: 8,
            angle: -45,
        }
    },
    {
        id: 'cheers-neon',
        name: 'Cheers Neon',
        fontFamily: "'Bangers', cursive",
        color: '#FFFFFF', // The core of the text is white
        strokeColor: '#000000',
        strokeThickness: 0,
        bgColor: 'rgba(0,0,0,0)',
        bgFullWidth: false,
        bgPadding: 10,
        shadow: {
            enabled: false, // We use the advanced effect instead for glow, but provide full shadow object
            color: 'rgba(0,0,0,0.7)',
            blur: 5,
            offsetX: 2,
            offsetY: 2
        },
        advancedEffect: {
            type: 'neon',
            color1: argbToRgba(4281071359), // Bright Blue inner glow
            color2: argbToRgba(4291681337), // Pinkish outer glow
            color3: null,
            distance: 0,
            angle: 0,
            glowSize: 20, // A new property for neon
        }
    },
    {
        id: 'sale-echo',
        name: 'Sale Echo',
        fontFamily: "'Bruno Ace SC', sans-serif",
        color: argbToRgba(4294918273), // Orange
        strokeColor: '#000000',
        strokeThickness: 0,
        bgColor: 'rgba(0,0,0,0)',
        bgFullWidth: false,
        bgPadding: 10,
        shadow: {
            enabled: true, // Can combine with standard shadow!
            color: 'rgba(0,0,0,0.5)',
            blur: 15,
            offsetX: 0,
            offsetY: 10
        },
        advancedEffect: {
            type: 'echo',
            color1: 'rgba(255, 128, 0, 0.5)', // Semi-transparent orange
            color2: 'rgba(255, 128, 0, 0.25)',// More transparent orange
            color3: null,
            distance: 10,
            angle: -45,
        }
    }
];

// A list of words for the styled text snippet feature
const snippetWords = ["KABOOM!", "WOW!", "CONFIRMED", "NEW", "LIVE", "BREAKING", "EXCLUSIVE"];