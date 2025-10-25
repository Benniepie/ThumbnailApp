# New Styled Text Snippets Added

## Two New Designs

### 1. Hot Pink Bold
- **ID**: `hot-pink-bold`
- **Name**: Hot Pink Bold
- **Font**: Black Ops One
- **Size**: 120
- **Color**: Hot Pink (#FF1493)
- **Stroke Width**: 20
- **Stroke Color**: Black (#000000)
- **Effects**: None

### 2. Lime Green Bold
- **ID**: `lime-green-bold`
- **Name**: Lime Green Bold
- **Font**: Black Ops One
- **Size**: 120
- **Color**: Lime Green (#32CD32)
- **Stroke Width**: 20
- **Stroke Color**: Black (#000000)
- **Effects**: None

## How to Use

1. Click the **"Add Styled Text"** button in the left panel
2. In the modal that appears, you'll see all available style presets
3. Click on either **"Hot Pink Bold"** or **"Lime Green Bold"**
4. Choose a word from the list (KABOOM!, WOW!, CONFIRMED, etc.)
5. The styled text will be added to your canvas!

## Technical Details

### Files Modified:
- `style-presets.js` - Added two new style preset objects to the `stylePresets` array

### Font Information:
- Font file: `fonts/Black Ops One Regular.ttf`
- Font family name: `Black Ops One`
- Already loaded by `font-loader.js`

### Style Properties:
Both styles use the same configuration except for color:
- Large, bold font (120px)
- Thick black stroke (20px) for high contrast
- No shadow or advanced effects
- Transparent background

### Color Codes:
- **Hot Pink**: `#FF1493` (RGB: 255, 20, 147)
- **Lime Green**: `#32CD32` (RGB: 50, 205, 50)

## Preview

When you select these styles in the modal, you'll see:
- **Hot Pink Bold**: Bright pink text with thick black outline
- **Lime Green Bold**: Bright lime green text with thick black outline

Both styles are designed to be eye-catching and bold, perfect for attention-grabbing text snippets!

## Testing

To test the new styles:
1. Open the app
2. Click "Add Styled Text"
3. Look for "Hot Pink Bold" and "Lime Green Bold" in the style grid
4. Click on one to see the word choices
5. Select a word to add it to the canvas
6. Verify the text appears with the correct color and stroke

## Notes

- The styles will appear in the style preset gallery alongside existing styles
- They can also be applied to Text Lines 1-4 from the FX toggle
- The Black Ops One font gives a strong, military-style appearance
- The thick stroke ensures readability even on busy backgrounds
