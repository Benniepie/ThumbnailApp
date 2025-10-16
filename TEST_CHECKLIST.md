# Testing Checklist

Use this checklist to verify all new features are working correctly.

---

## ✅ Right Panel Structure

### Toggle System
- [ ] Click "Position" toggle - section expands
- [ ] Click "Position" again - section collapses
- [ ] Click "Style" toggle - Position closes, Style opens
- [ ] Click "Shadow" toggle - Style closes, Shadow opens
- [ ] Click "FX" toggle - Shadow closes, FX opens
- [ ] Click "Background" toggle - shows placeholder message

### Toggle Independence
- [ ] Open a toggle on Text Line 1 (left panel)
- [ ] Open a toggle on Text Line 2 (left panel)
- [ ] Open a toggle on right panel
- [ ] Verify all three stay open simultaneously
- [ ] Close right panel toggle - left panel toggles stay open
- [ ] Close left panel toggles - right panel toggle stays open

---

## ✅ Position Controls

### Basic Fields
- [ ] Select an object
- [ ] Open Position toggle
- [ ] Change X value - object moves horizontally
- [ ] Change Y value - object moves vertically
- [ ] Change Rotation value - object rotates

### Alignment Buttons (Text Objects Only)
- [ ] Add a styled text object
- [ ] Open Position toggle
- [ ] Click "L" button - text aligns left with margin
- [ ] Click "C" button - text centers on canvas
- [ ] Click "R" button - text aligns right with margin
- [ ] Verify X field updates when clicking buttons

### Drag Synchronization
- [ ] Drag object on canvas
- [ ] Verify X and Y fields update in real-time

---

## ✅ Style Controls

- [ ] Select an object
- [ ] Open Style toggle
- [ ] Change stroke color - outline color changes
- [ ] Change thickness to 10 - thick outline appears
- [ ] Change thickness to 0 - outline disappears

---

## ✅ Shadow Controls

### Basic Shadow
- [ ] Select an object
- [ ] Open Shadow toggle
- [ ] Check "Enable Shadow" - shadow appears
- [ ] Uncheck "Enable Shadow" - shadow disappears

### Shadow Color
- [ ] Enable shadow
- [ ] Change shadow color to red - shadow turns red
- [ ] Change shadow color to blue - shadow turns blue

### Shadow Alpha (NEW!)
- [ ] Set Shadow Alpha to 0% - shadow invisible
- [ ] Set Shadow Alpha to 50% - shadow semi-transparent
- [ ] Set Shadow Alpha to 100% - shadow fully opaque
- [ ] Verify percentage display updates as you drag slider

### Shadow Blur
- [ ] Set Shadow Blur to 0 - hard shadow edges
- [ ] Set Shadow Blur to 20 - soft shadow edges

### Shadow Offset
- [ ] Set Offset X to 10 - shadow moves right
- [ ] Set Offset X to -10 - shadow moves left
- [ ] Set Offset Y to 10 - shadow moves down
- [ ] Set Offset Y to -10 - shadow moves up

---

## ✅ FX Controls

### Font Selection
- [ ] Select a text object
- [ ] Open FX toggle
- [ ] Change font - text font changes on canvas

### Style Preset - None
- [ ] Select "None" from Style Preset dropdown
- [ ] Verify no FX parameter fields appear
- [ ] Verify text has no special effects

### Style Preset - Neon
- [ ] Select "Neon" from Style Preset dropdown
- [ ] Verify FX C1 field appears
- [ ] Verify FX C2 field appears
- [ ] Verify Glow slider appears
- [ ] Verify Dist, Angle, FX C3 do NOT appear
- [ ] Change FX C1 color - inner glow color changes
- [ ] Change FX C2 color - outer glow color changes
- [ ] Adjust Glow slider - glow size changes

### Style Preset - Splice
- [ ] Select "Splice" from Style Preset dropdown
- [ ] Verify FX C1, FX C2, Dist, Angle appear
- [ ] Verify Glow and FX C3 do NOT appear
- [ ] Adjust Dist slider - 3D depth changes
- [ ] Adjust Angle slider - 3D direction changes

### Style Preset - Echo
- [ ] Select "Echo" from Style Preset dropdown
- [ ] Verify FX C1, FX C2, Dist, Angle appear
- [ ] Verify Glow and FX C3 do NOT appear
- [ ] Adjust parameters - echo effect changes

### Style Preset - Glitch
- [ ] Select "Glitch" from Style Preset dropdown
- [ ] Verify FX C1, FX C2, FX C3, Dist appear
- [ ] Verify Glow and Angle do NOT appear
- [ ] Adjust parameters - glitch effect changes

---

## ✅ Mouse Wheel Size Adjustment

### Left Panel (Text Lines)
- [ ] Hover over Text Line 1 size field
- [ ] Scroll up - size increases by 1
- [ ] Scroll down - size decreases by 1
- [ ] Verify canvas updates immediately
- [ ] Test with Text Lines 2, 3, 4

### Right Panel (Objects)
- [ ] Select a text object
- [ ] Hover over Size field in right panel
- [ ] Scroll up - size increases
- [ ] Scroll down - size decreases
- [ ] Verify canvas updates immediately

### Right Panel (Images)
- [ ] Select an image/person object
- [ ] Hover over Height field in right panel
- [ ] Scroll up - height increases
- [ ] Scroll down - height decreases
- [ ] Verify canvas updates immediately

### Bounds Testing
- [ ] Set size to minimum (10 for text)
- [ ] Scroll down - size stays at minimum
- [ ] Set size to maximum (500 for text)
- [ ] Scroll up - size stays at maximum

---

## ✅ Rotation Handle

### Visual Appearance
- [ ] Select any object
- [ ] Verify green circle appears above object
- [ ] Verify green line connects circle to object

### Rotation Interaction
- [ ] Click and hold green circle
- [ ] Drag in a circle around object
- [ ] Verify object rotates smoothly
- [ ] Release mouse - rotation is set
- [ ] Verify Rotation field in Position toggle updates

### Cursor Feedback
- [ ] Hover over rotation handle
- [ ] Verify cursor changes to "grab"
- [ ] Click and drag
- [ ] Verify cursor stays as "grab"

---

## ✅ Resize Handles

### Visual Appearance
- [ ] Select any object
- [ ] Verify 4 white squares appear at corners
- [ ] Verify squares have blue borders

### Resize Interaction - Text Objects
- [ ] Select a text object
- [ ] Drag top-left corner - object resizes
- [ ] Drag top-right corner - object resizes
- [ ] Drag bottom-left corner - object resizes
- [ ] Drag bottom-right corner - object resizes
- [ ] Verify Size field updates

### Resize Interaction - Image Objects
- [ ] Select an image/person object
- [ ] Drag any corner handle
- [ ] Verify aspect ratio is maintained
- [ ] Verify Height field updates
- [ ] Verify width adjusts proportionally

### Minimum Size
- [ ] Try to resize very small
- [ ] Verify object stops at 20x20 pixels minimum

### Cursor Feedback
- [ ] Hover over top-left corner
- [ ] Verify cursor shows diagonal resize (nwse-resize)
- [ ] Hover over top-right corner
- [ ] Verify cursor shows diagonal resize (nesw-resize)
- [ ] Hover over bottom-left corner
- [ ] Verify cursor shows diagonal resize (nesw-resize)
- [ ] Hover over bottom-right corner
- [ ] Verify cursor shows diagonal resize (nwse-resize)

---

## ✅ Field Synchronization

### Canvas to Panel
- [ ] Drag object on canvas
- [ ] Verify X, Y fields update in Position toggle
- [ ] Rotate object with handle
- [ ] Verify Rotation field updates
- [ ] Resize object with handle
- [ ] Verify Size/Height field updates

### Panel to Canvas
- [ ] Type new X value
- [ ] Verify object moves on canvas
- [ ] Type new Y value
- [ ] Verify object moves on canvas
- [ ] Type new Rotation value
- [ ] Verify object rotates on canvas
- [ ] Type new Size value
- [ ] Verify object resizes on canvas

---

## ✅ Object Type Specific Tests

### Text Objects
- [ ] Verify alignment buttons (L/C/R) appear
- [ ] Verify Font dropdown appears in FX toggle
- [ ] Verify Style Preset dropdown appears in FX toggle
- [ ] Verify FX parameters appear based on preset

### Shape Objects (Square, Circle, Arrow)
- [ ] Verify alignment buttons do NOT appear
- [ ] Verify Fill color appears in main controls
- [ ] Verify Font dropdown appears (for shape text)

### Image/Person Objects
- [ ] Verify alignment buttons do NOT appear
- [ ] Verify Height field appears in main controls
- [ ] Verify resize maintains aspect ratio
- [ ] Verify Font dropdown does NOT appear

---

## ✅ Edge Cases

### Multiple Object Selection
- [ ] Select object A
- [ ] Right panel shows object A properties
- [ ] Select object B
- [ ] Right panel updates to show object B properties
- [ ] Verify no cross-contamination of values

### Deselection
- [ ] Select an object
- [ ] Right panel is visible
- [ ] Click on empty canvas area
- [ ] Verify right panel hides

### Delete Object
- [ ] Select an object
- [ ] Click "Delete Selected Object" button
- [ ] Verify object is removed from canvas
- [ ] Verify right panel hides

### Rapid Toggle Switching
- [ ] Rapidly click different toggle buttons
- [ ] Verify only one toggle is open at a time
- [ ] Verify no visual glitches

---

## ✅ Visual Consistency

### Styling Match
- [ ] Compare left panel toggle buttons to right panel toggle buttons
- [ ] Verify same colors, sizes, fonts
- [ ] Compare left panel collapsible sections to right panel sections
- [ ] Verify same background colors, padding, borders
- [ ] Compare left panel input fields to right panel input fields
- [ ] Verify same sizes, styles, spacing

### Dark Mode (if applicable)
- [ ] Toggle dark mode
- [ ] Verify right panel colors update correctly
- [ ] Verify toggle buttons are visible
- [ ] Verify input fields are readable

---

## ✅ Performance

### Smooth Interactions
- [ ] Drag object rapidly - no lag
- [ ] Rotate object rapidly - smooth rotation
- [ ] Resize object rapidly - smooth resize
- [ ] Scroll mouse wheel rapidly - responsive updates

### Canvas Redraw
- [ ] Change any property
- [ ] Verify canvas redraws immediately
- [ ] Verify no flickering or artifacts

---

## 🐛 Bug Report Template

If you find any issues, use this template:

```
**Issue:** [Brief description]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Object Type:** [Text/Shape/Image]

**Browser:** [Chrome/Firefox/Safari/Edge]

**Screenshot:** [If applicable]
```

---

## ✅ Final Verification

- [ ] All features from requirements #1-5 are working
- [ ] Nice-to-have features #6-7 are working
- [ ] No console errors appear
- [ ] No visual glitches
- [ ] Performance is acceptable
- [ ] User experience is intuitive

---

## Summary

**Total Test Cases:** ~100+

**Critical Tests:** 
- Toggle system (10 tests)
- Shadow Alpha (5 tests)
- Alignment buttons (6 tests)
- Mouse wheel (10 tests)
- FX parameters (20 tests)
- Rotation handle (5 tests)
- Resize handles (10 tests)

**Estimated Testing Time:** 30-45 minutes for complete checklist

---

## Notes

- Test in your primary browser first
- If issues found, test in other browsers to isolate
- Take screenshots of any visual issues
- Note any performance problems
- Document any unexpected behavior

Good luck with testing! 🚀
