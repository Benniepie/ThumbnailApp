// font-loader.js

// List of all font files in the /fonts/ directory, obtained from the filesystem.
const fontFiles = [
    "Alex Brush Regular.ttf", "Charlemagne Std Bold.otf", "ADLaM Display Regular.ttf", "AR One Sans Regular.ttf", "Abril Fatface.ttf", "Aclonica Regular.ttf", "Acme Regular.ttf", "Afacad Regular.ttf", "Agbalumo Regular.ttf", "Akronim Regular.ttf", "Alata Regular.ttf", "Alexandria Regular.ttf", "Alfa Slab One Regular.ttf", "Alkatra Regular.ttf", "Almendra Display Regular.ttf", "Alumni Sans Regular.ttf", "Amethysta Regular.ttf", "Amiko Regular.ttf", "Annapurna SIL.ttf", "Anta Regular.ttf", "Audiowide Regular.ttf", "BRLNSDB.woff", "Bagel Fat One Regular.ttf", "Bakbak One Regular.ttf", "Bangers Regular.ttf", "Barriecito Regular.ttf", "Barrio Regular.ttf", "Berkshire Swash Regular.ttf", "Black And White Picture Regular.ttf", "Black Ops One Regular.ttf", "Blaka Hollow Regular.ttf", "Bonbon Regular.ttf", "Butcherman Regular.ttf", "Caesar Dressing.ttf", "Chokokutai Regular.ttf", "Eater.ttf", "Emblema One.ttf", "Fascinate.ttf", "Faster One Regular.ttf", "Federo.ttf", "Frijole.ttf", "Fugaz One.ttf", "Gabarito Regular.ttf", "Geostar Fill.ttf", "Geostar.ttf", "Goblin One.ttf", "Gochi Hand.ttf", "Hachi Maru Pop Regular.ttf", "Hahmlet Regular.ttf", "Hedvig Letters Sans Regular.ttf", "Hedvig Letters Serif 24pt Regular.ttf", "Honk Regular.ttf", "Ingrid Darling Regular.ttf", "Jacquarda Bastarda 9 Regular.ttf", "Kablammo Regular.ttf", "Kalnia Regular.ttf", "Kay Pho Du.ttf", "Kdam Thmor Pro Regular.ttf", "Kode Mono Regular.ttf", "Radio Canada Bold.ttf", "Radio Canada Regular.ttf", "Roboto (2).ttf", "Roboto.ttf", "Stint Ultra Condensed.ttf", "Stint Ultra Expanded.ttf", "Stoke Regular.ttf", "Strait Regular.ttf", "Style Script Regular.ttf", "Stylish Regular.ttf", "Sue Ellen Francisco .ttf", "SuezOne-Regular.ttf", "Sulphur Point Regular.ttf", "Sunshiney Regular.ttf", "Syncopate Regular.ttf", "Syne Tactile Regular.ttf", "Tilt Prism Regular.ttf", "Tilt Warp Regular.ttf", "Unbounded Regular.ttf", "Uncial Antiqua.ttf", "Underdog.ttf", "Unica One Regular.ttf", "UnifrakturCook.ttf", "UnifrakturMaguntia.ttf", "Urbanist Regular.ttf", "VT323 Regular.ttf", "Vampiro One.ttf", "Vast Shadow Regular.ttf", "Viaoda Libre Regular.ttf", "Vidaloka .ttf", "Vina Sans Regular.ttf", "Vollkorn Regular.ttf", "Voltaire Regular.ttf", "Wallpoet.ttf", "Walter Turncoat Regular.ttf", "Wire One Regular.ttf", "Workbench Regular.ttf", "Young Serif Regular.ttf", "Zen Kaku Gothic Antique Regular.ttf", "Zen Tokyo Zoo Regular.ttf", "Zhi Mang Xing Regular.ttf", "Zilla Slab.ttf"
];

// A map for filenames that need a specific, human-readable font-family name.
const fontNameMap = {
    "BRLNSDB.woff": "Berlin Sans FB Demi Bold"
};

/**
 * Derives a clean font family name from a filename.
 * e.g., "Bangers-Regular.ttf" becomes "Bangers"
 * e.g., "BRLNSDB.woff" becomes "Berlin Sans FB Demi Bold"
 */
function getFontFamilyName(filename) {
    if (fontNameMap[filename]) {
        return fontNameMap[filename];
    }
    const parts = filename.split('.');
    parts.pop(); // remove extension
    // Join, remove trailing 'Regular', replace hyphens with spaces, and trim.
    return parts.join('.').replace(/ Regular$/i, '').replace(/-/g, ' ').trim();
}

/**
 * Generates @font-face rules for all fonts and injects them into the document head.
 */
function loadCustomFonts() {
    const style = document.createElement('style');
    style.type = 'text/css';
    let fontFaceRules = '';

    fontFiles.forEach(filename => {
        const parts = filename.split('.');
        if (parts.length < 2) return; // Skip invalid filenames

        const extension = parts.pop().toLowerCase();
        const fontFamily = getFontFamilyName(filename);

        let format;
        switch (extension) {
            case 'ttf':
                format = 'truetype';
                break;
            case 'woff':
                format = 'woff';
                break;
            case 'woff2':
                format = 'woff2';
                break;
            default:
                return; // Skip unsupported font types
        }

        fontFaceRules += `
            @font-face {
                font-family: '${fontFamily}';
                src: url('fonts/${encodeURIComponent(filename)}') format('${format}');
                font-weight: normal;
                font-style: normal;
                font-display: swap;
            }
        `;
    });

    style.innerHTML = fontFaceRules;
    document.head.appendChild(style);
    console.log(`${fontFiles.length} custom fonts registered.`);
}

// Expose the font names for the UI, cleaned up, sorted, and with duplicates removed.
const localFontFamilies = [...new Set(fontFiles.map(getFontFamilyName))].sort();


// Load the fonts when the script is executed.
document.addEventListener('DOMContentLoaded', loadCustomFonts);
