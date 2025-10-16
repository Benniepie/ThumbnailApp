# User Guide - New Right Panel Features

## Quick Start

When you select an object on the canvas (shape, text, or image), the right panel now shows organized controls similar to the left panel.

---

## Using the Toggle System

### Opening/Closing Toggles

1. **Click any toggle button** (Position, Style, Background, Shadow, FX) to expand it
2. **Click the same button again** to collapse it
3. **Click a different button** to switch to that section (previous one closes automatically)

### Toggle Independence

- **Left panel toggles** (for Text Lines 1-4) work independently
- **Right panel toggles** (for selected objects) work independently
- You can have **one toggle open on the right** AND **multiple toggles open on the left** at the same time

**Example:**
- Text Line 1: Position toggle open
- Text Line 2: Shadow toggle open  
- Selected Object: FX toggle open
- All three can be open simultaneously!

---

## Position Controls

### What's Inside:
- **X position** - Horizontal position on canvas
- **Y position** - Vertical position on canvas
- **L/C/R buttons** - Quick alignment (text objects only)
- **Rotation** - Angle in degrees (0-360)

### How to Use:

#### Alignment Buttons (Text Objects Only)
- **L** - Align text to left edge (38px margin)
- **C** - Center text on canvas
- **R** - Align text to right edge (38px margin)

These buttons work exactly like the alignment buttons on the left panel for Text Lines 1-4.

#### Manual Positioning
- Type values directly into X/Y fields
- Or drag the object on the canvas (fields update automatically)

#### Rotation
- Type a value (0-360 degrees)
- Or use the **rotation handle** on canvas (see Canvas Interactions below)

---

## Style Controls

### What's Inside:
- **Stroke Color** - Outline color
- **Thickness** - Stroke width (0-50)

### How to Use:
- Click the color picker to choose stroke color
- Adjust thickness with the number input
- Set to 0 for no stroke

---

## Background Controls

Currently empty - placeholder for future features.

---

## Shadow Controls

### What's Inside:
- **Enable Shadow** - Checkbox to turn shadow on/off
- **Shadow Color** - Color picker for shadow
- **Shadow Alpha** - NEW! Opacity slider (0-100%)
- **Shadow Blur** - Blur amount (0-50)
- **Offset X** - Horizontal shadow offset (-50 to 50)
- **Offset Y** - Vertical shadow offset (-50 to 50)

### How to Use:

#### Basic Shadow
1. Check "Enable Shadow"
2. Choose a shadow color
3. Adjust blur for soft/hard shadow

#### Shadow Alpha (NEW!)
The **Shadow Alpha** slider controls how transparent the shadow is:
- **0%** - Completely transparent (invisible)
- **50%** - Semi-transparent
- **100%** - Fully opaque

This works independently from the shadow color, giving you precise control over shadow intensity.

#### Shadow Position
- **Positive X** - Shadow moves right
- **Negative X** - Shadow moves left
- **Positive Y** - Shadow moves down
- **Negative Y** - Shadow moves up

---

## FX Controls

### What's Inside:
- **Font** - Font family dropdown
- **Style Preset** - Pre-configured text effects

### Dynamic FX Parameters (NEW!)

When you select a style preset, additional controls appear automatically:

#### For "Neon" Style:
- **FX C1** - Inner glow color
- **FX C2** - Outer glow color
- **Glow** - Glow size slider

#### For "Splice" Style:
- **FX C1** - Main color
- **FX C2** - 3D effect color
- **Dist** - Distance/depth
- **Angle** - Direction of 3D effect

#### For "Echo" Style:
- **FX C1** - Primary echo color
- **FX C2** - Secondary echo color
- **Dist** - Echo distance
- **Angle** - Echo direction

#### For "Glitch" Style:
- **FX C1** - Glitch color 1
- **FX C2** - Glitch color 2
- **FX C3** - Glitch color 3
- **Dist** - Glitch offset distance

### How to Use:
1. Select a style preset from the dropdown
2. Watch as relevant FX controls appear
3. Adjust the FX parameters to customize the effect
4. Select "None" to remove all effects and hide FX controls

---

## Canvas Interactions (NEW!)

### Rotation Handle

**What it looks like:**
- Green circle above the selected object
- Connected to the object by a green line

**How to use:**
1. Click and hold the green circle
2. Drag around the object to rotate
3. Release to set the rotation
4. The Rotation field in the Position toggle updates automatically

**Tips:**
- Rotation snaps to whole degrees
- The object rotates around its center point
- Works with all object types (text, shapes, images)

### Resize Handles

**What they look like:**
- White squares with blue borders at all four corners

**How to use:**
1. Click and hold any corner handle
2. Drag to resize the object
3. Release to set the new size
4. Size/Height fields update automatically

**Behavior:**
- **Images/People**: Maintain aspect ratio (proportional resize)
- **Text/Shapes**: Free resize (can stretch)
- **Minimum size**: 20x20 pixels (prevents objects from disappearing)

**Tips:**
- Drag diagonally for best results
- For images, all corners resize proportionally
- For text, resizing may stretch the text

### Cursor Feedback

The cursor changes to show what action you can perform:

- **Move cursor** (four arrows) - Drag to move object
- **Grab cursor** (hand) - Drag to rotate
- **Resize cursors** (diagonal arrows) - Drag to resize
- **Default cursor** - No action available

---

## Mouse Wheel Size Adjustment (NEW!)

### On Left Panel (Text Lines 1-4)

**How to use:**
1. Hover your mouse over any **Size** input field
2. Scroll up to increase size
3. Scroll down to decrease size
4. Changes apply immediately to the canvas

### On Right Panel (Selected Object)

**How to use:**
1. Select an object on the canvas
2. Hover over the **Size** field (for text) or **Height** field (for images)
3. Scroll up to increase
4. Scroll down to decrease
5. Changes apply immediately

**Tips:**
- Each scroll increment changes size by 1
- Respects minimum (10 for text, 1 for objects) and maximum (500 for text, 1000 for objects) values
- Works while typing - just hover and scroll!

---

## Workflow Examples

### Example 1: Adding and Styling a Text Snippet

1. Click "Add Styled Text" in the left panel
2. Choose a word from the modal
3. Object appears on canvas with blue selection box
4. Right panel shows object properties
5. Click **FX** toggle
6. Select a style preset (e.g., "Neon")
7. FX parameters appear automatically
8. Adjust FX C1, FX C2, and Glow to customize
9. Click **Position** toggle
10. Use L/C/R buttons to align
11. Click **Shadow** toggle
12. Enable shadow and adjust Shadow Alpha for perfect opacity

### Example 2: Resizing and Rotating an Image

1. Click "Add Person" in the left panel
2. Choose a person from the modal
3. Image appears on canvas
4. Hover over **Size** field in right panel
5. Scroll mouse wheel to quickly adjust height
6. Grab the **green rotation handle** at the top
7. Drag to rotate the image
8. Grab a **corner resize handle**
9. Drag to resize (maintains aspect ratio)
10. Drag the image body to reposition

### Example 3: Creating a Shadow Effect

1. Select any object on canvas
2. Click **Shadow** toggle in right panel
3. Check "Enable Shadow"
4. Choose a shadow color (e.g., black)
5. Set **Shadow Alpha** to 50% for semi-transparency
6. Set **Shadow Blur** to 10 for soft edges
7. Set **Offset X** to 5 and **Offset Y** to 5
8. Shadow appears below and to the right of object

---

## Keyboard Shortcuts

- **Delete** or **Backspace** - Delete selected object (when not typing in a field)

---

## Tips & Tricks

### Tip 1: Quick Size Adjustments
Instead of clicking and typing, just hover over the size field and scroll your mouse wheel for rapid adjustments.

### Tip 2: Precise Rotation
For precise rotation angles, type the value directly in the Rotation field. For quick adjustments, use the rotation handle.

### Tip 3: Shadow Layering
Use Shadow Alpha to create layered shadow effects. Try:
- High alpha (80-100%) for hard shadows
- Medium alpha (40-60%) for soft shadows
- Low alpha (10-30%) for subtle depth

### Tip 4: Toggle Efficiency
Keep frequently-used toggles open. Since left and right panels are independent, you can have your most-used controls visible on both sides.

### Tip 5: Alignment Consistency
Use the L/C/R buttons instead of manually typing X positions. This ensures consistent margins across all your text elements.

### Tip 6: FX Experimentation
Try different style presets and adjust the FX parameters. The changes are instant, so you can experiment freely!

---

## Troubleshooting

### Q: The right panel is empty
**A:** Make sure you have an object selected on the canvas. Click any shape, text, or image to select it.

### Q: I can't see the rotation/resize handles
**A:** Make sure an object is selected (blue border should be visible). Handles only appear when an object is selected.

### Q: Mouse wheel doesn't work on size fields
**A:** Make sure your mouse cursor is hovering directly over the input field, not just near it.

### Q: FX parameters don't appear
**A:** Make sure you've selected a style preset other than "None". Different presets show different parameters.

### Q: Alignment buttons don't appear
**A:** Alignment buttons (L/C/R) only appear for text objects, not for images or shapes.

### Q: Shadow Alpha slider is missing
**A:** Make sure you're looking in the Shadow toggle section, not the Style section. Click the "Shadow" toggle button to expand it.

---

## What's Different from Before?

### Old Right Panel:
- All fields visible at once (cluttered)
- Dropdown for alignment
- No Shadow Alpha control
- No FX parameters
- No rotation/resize handles
- No mouse wheel support

### New Right Panel:
- ✅ Organized with toggles (clean)
- ✅ L/C/R alignment buttons (consistent with left)
- ✅ Shadow Alpha slider (precise control)
- ✅ Dynamic FX parameters (powerful effects)
- ✅ Rotation handle (intuitive)
- ✅ Resize handles (visual)
- ✅ Mouse wheel support (efficient)

---

## Need More Help?

- Check the VISUAL_GUIDE.md for before/after comparisons
- Check the CHANGES_SUMMARY.md for technical details
- Experiment! All changes are visible immediately and can be undone by adjusting the controls
