   // ADD THIS
        let activeSnippetStyleId = null; // For the two-step snippet adder
        const googleFontsToLoad = ['Bangers', 'Suez One', 'VT323', 'Bruno Ace SC', 'Oswald', 'Montserrat'];
        const canvas = document.getElementById('thumbnailCanvas');
        const ctx = canvas.getContext('2d');
        // ADD THIS CODE AT THE TOP OF script.js

        let objectIdCounter = 0;

        // This array will hold all new draggable objects (shapes, images, text snippets)
        let canvasObjects = []; 
        let selectedObjectIndex = -1; // Index in canvasObjects of the selected item

        // State for background image filters
        let backgroundImageState = {
            brightness: 100,
            contrast: 100,
            saturate: 100,
            // We keep the old zoom properties here for the background image
            zoom: 100,
            offsetX: 0,
            offsetY: 0,
            baseCoverZoom: 1
        };

        // ADD THIS TO THE TOP OF script.js

        // This object will manage all drag operations
        let dragState = {
            isDragging: false,
            target: null, // 'background', 'text', or 'object'
            index: -1,    // index of the item being dragged
            startX: 0,
            startY: 0,
            elementStartX: 0,
            elementStartY: 0
        };

// We will also move the old image pan/zoom variables into this object later.
// For now, your existing `imageOffsetX`, `imageOffsetY` etc. will continue to work.
        let currentImage = null;
        let currentLayout = 1;

        // MODIFIED: Changed default position to bottom-left
        let selectedLogo = {
            src: null, // e.g., 'logo1.png'
            img: null, // The actual Image object once loaded
            position: 'bottom-left', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
            scale: 0.15, // 15% of canvas width
            padding: 20 // Pixels from the edge
        };

        //let selectedTextElementIndex = -1; // Index of the textElement being dragged, -1 if none
        //let dragStartX, dragStartY;         // Mouse position when drag started
        //let elementStartPosX, elementStartPosY; // Text element's position when drag started
        // MODIFIED/NEW: Variables for image state
        let currentImageBaseCoverZoom = 1; // Base zoom factor for the current image to cover the canvas
        let imageOffsetX = 0;
        let imageOffsetY = 0;
        //let isDraggingImage = false;
        //let lastMouseX, lastMouseY;
        let textElements = [
            // We'll create 4 empty elements. setLayout will populate them.
            {}, {}, {}, {}
        ].map((el, i) => ({
            id: `text${i+1}`, inputId: `text${i+1}`, colorId: `color${i+1}`, sizeId: `size${i+1}`,
            x: canvas.width * 0.5, y: canvas.height * 0.3, align: 'center', text: '', wrap: false, size: 100,
            fontFamily: "'Berlin Sans FB Demi Bold', sans-serif",
            color: '#FFFFFF',
            strokeColor: '#000000', strokeThickness: 2,
            bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10,
            shadowEnabled: false, shadowColor: 'rgba(0,0,0,0.7)', shadowBlur: 5, shadowOffsetX: 2, shadowOffsetY: 2,
            advancedEffect: {
                type: 'none',
                color1: '#ff0000', color2: '#00ff00', color3: '#0000ff',
                distance: 10, angle: -45, glowSize: 20
            }
        }));
        // Add font loading check
        Promise.all([
            new FontFace('Berlin Sans FB Demi Bold', 'url(fonts/BRLNSDB.woff)').load(),
            ...googleFontsToLoad.map(family => new FontFace(family, `url(https://fonts.gstatic.com/s/a/files/${family.replace(/ /g, '')}-v29-latin-regular.woff2)`).load())
        ]).then(loadedFonts => {
            loadedFonts.forEach(font => document.fonts.add(font));
            console.log('All fonts loaded.');
            
            // Initial setup
            updateColorPreviews();
            setLayout(1); // Sets initial layout, text, positions, and calls drawThumbnail
            populateStylePresets(); // Draw the preset previews

        }).catch(function(error) {
            console.error("A font could not be loaded: ", error);
            // Still try to run the app
            updateColorPreviews();
            setLayout(1);
            populateStylePresets();
        });

        

        // Set canvas dimensions
        canvas.width = 1920;
        canvas.height = 1080;


        // ADD THESE NEW FUNCTIONS

        function populateStylePresets() {
            const galleries = document.querySelectorAll('.preset-gallery');
            galleries.forEach(gallery => {
                gallery.innerHTML = ''; // Clear existing
                stylePresets.forEach(preset => {
                    const canvasEl = document.createElement('canvas');
                    canvasEl.width = 300; // Higher res for preview
                    canvasEl.height = 150;
                    canvasEl.className = 'preset-preview-canvas';
                    
                    const galleryId = gallery.id; // e.g., "presets1" or "snippet-preset-gallery"

                    if (galleryId.startsWith('presets')) {
                        const textIndex = parseInt(galleryId.replace('presets', '')) - 1;
                        canvasEl.onclick = () => applyStylePreset(textIndex, preset.id);
                    } else { // It's for the snippet modal
                        canvasEl.onclick = () => selectSnippetStyle(preset.id);
                    }

                    gallery.appendChild(canvasEl);

                    // Draw the preview
                    const pCtx = canvasEl.getContext('2d');
                    const previewTextElement = {
                        ...preset, // Copy all style properties from the preset
                        text: 'Style',
                        size: 50, // MODIFIED from 60 to 50 to prevent clipping
                        x: canvasEl.width / 2,
                        y: canvasEl.height / 2,
                        align: 'center'
                    };;
                    pCtx.fillStyle = '#333';
                    pCtx.fillRect(0, 0, canvasEl.width, canvasEl.height);
                    drawTextWithEffect(pCtx, previewTextElement);
                });
            });
        }

        function applyStylePreset(elementIndex, presetId) {
            const preset = stylePresets.find(p => p.id === presetId);
            if (!preset || !textElements[elementIndex]) return;

            // Copy all style properties from the preset to the text element
            const textEl = textElements[elementIndex];
            Object.assign(textEl, preset);

            updateTextControlsFromState(); // Update all UI controls to match
            drawThumbnail();
        }

        function showPresetPickerForSnippet() {
            document.getElementById('snippet-modal').style.display = 'flex';
            document.getElementById('snippet-step1').style.display = 'block';
            document.getElementById('snippet-step2').style.display = 'none';
        }

        function closeSnippetModal() {
            document.getElementById('snippet-modal').style.display = 'none';
        }

        // REPLACE the entire selectSnippetStyle function
        function selectSnippetStyle(presetId) {
            activeSnippetStyleId = presetId;
            const preset = stylePresets.find(p => p.id === activeSnippetStyleId);
            if (!preset) return;

            const wordContainer = document.getElementById('snippet-word-choices');
            wordContainer.innerHTML = ''; // Clear old words

            snippetWords.forEach(word => {
                const previewCanvas = document.createElement('canvas');
                previewCanvas.className = 'snippet-word-preview';
                previewCanvas.width = 300; // Set a decent resolution
                previewCanvas.height = 120;
                previewCanvas.onclick = () => addStyledSnippet(word);
                wordContainer.appendChild(previewCanvas);

                const pCtx = previewCanvas.getContext('2d');
                const previewTextElement = {
                    ...preset,
                    text: word,
                    size: 70, // A good size for the preview canvas
                    x: previewCanvas.width / 2,
                    y: previewCanvas.height / 2,
                    align: 'center'
                };
                
                // This allows for vertical centering in the preview
                pCtx.textBaseline = 'middle';
                drawTextWithEffect(pCtx, previewTextElement);
            });

            document.getElementById('snippet-step1').style.display = 'none';
            document.getElementById('snippet-step2').style.display = 'block';
        }



        // In function addStyledSnippet(word)
        function addStyledSnippet(word) {
            const preset = stylePresets.find(p => p.id === activeSnippetStyleId);
            if (!preset) return;

            const styleOptions = { ...preset, text: word, size: 150 };
            addObject('text', styleOptions);
            closeSnippetModal(); // This line is added
        }
        function updateFxControlsVisibility(elementIndex) {
            const fxType = document.getElementById(`advancedEffectType${elementIndex + 1}`).value;
            const paramsContainer = document.getElementById(`fx-params${elementIndex + 1}`);
            paramsContainer.querySelectorAll('.fx-param-control').forEach(control => {
                const fxFor = control.dataset.fxFor.split(' ');
                if (fxFor.includes(fxType)) {
                    control.style.display = 'flex';
                } else {
                    control.style.display = 'none';
                }
            });
        }


        function updateTextControlsFromState() {
            textElements.forEach((el, index) => {
                const i = index + 1;
                document.getElementById(el.inputId).value = el.text;
                document.getElementById(el.colorId).value = el.color;
                document.getElementById(el.sizeId).value = el.size;
                document.getElementById(`x${i}`).value = Math.round(el.x);
                document.getElementById(`y${i}`).value = Math.round(el.y);

                // New controls
                document.getElementById(`strokeColor${i}`).value = el.strokeColor;
                document.getElementById(`strokeThickness${i}`).value = el.strokeThickness;
                
                // For bgColor, we need to handle the alpha separately if storing as rgba
                const bgColorInput = document.getElementById(`bgColor${i}`);
                const bgAlphaInput = document.getElementById(`bgAlpha${i}`);
                const bgAlphaValueSpan = document.getElementById(`bgAlphaValue${i}`);

                const rgbaMatch = el.bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                if (rgbaMatch) {
                    const r = parseInt(rgbaMatch[1]).toString(16).padStart(2, '0');
                    const g = parseInt(rgbaMatch[2]).toString(16).padStart(2, '0');
                    const b = parseInt(rgbaMatch[3]).toString(16).padStart(2, '0');
                    bgColorInput.value = `#${r}${g}${b}`;
                    const alpha = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;
                    bgAlphaInput.value = Math.round(alpha * 100);
                    bgAlphaValueSpan.textContent = `${Math.round(alpha * 100)}%`;
                }


                document.getElementById(`bgFullWidth${i}`).checked = el.bgFullWidth;
                document.getElementById(`bgPadding${i}`).value = el.bgPadding;

                document.getElementById(`shadowEnabled${i}`).checked = el.shadowEnabled;
                document.getElementById(`shadowBlur${i}`).value = el.shadowBlur;
                document.getElementById(`shadowOffsetX${i}`).value = el.shadowOffsetX;
                document.getElementById(`shadowOffsetY${i}`).value = el.shadowOffsetY;

                const shadowColorInput = document.getElementById(`shadowColor${i}`);
                const shadowAlphaInput = document.getElementById(`shadowAlpha${i}`);
                const shadowAlphaValueSpan = document.getElementById(`shadowAlphaValue${i}`);
                const shadowRgbaMatch = el.shadowColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                if (shadowRgbaMatch) {
                    shadowColorInput.value = `#${parseInt(shadowRgbaMatch[1]).toString(16).padStart(2,'0')}${parseInt(shadowRgbaMatch[2]).toString(16).padStart(2,'0')}${parseInt(shadowRgbaMatch[3]).toString(16).padStart(2,'0')}`;
                    const alpha = shadowRgbaMatch[4] !== undefined ? parseFloat(shadowRgbaMatch[4]) : 1;
                    shadowAlphaInput.value = Math.round(alpha * 100);
                    shadowAlphaValueSpan.textContent = `${Math.round(alpha * 100)}%`;
                }

                                // NEW: Update FX controls
                document.getElementById(`fontFamily${i}`).value = el.fontFamily;
                if (el.advancedEffect) { // Check if effect object exists
                    document.getElementById(`advancedEffectType${i}`).value = el.advancedEffect.type ?? 'none';
                    document.getElementById(`effectColor1_${i}`).value = el.advancedEffect.color1 ?? '#ff0000';
                    document.getElementById(`effectColor2_${i}`).value = el.advancedEffect.color2 ?? '#00ff00';
                    document.getElementById(`effectColor3_${i}`).value = el.advancedEffect.color3 ?? '#0000ff';
                    document.getElementById(`effectDistance${i}`).value = el.advancedEffect.distance ?? 10;
                    document.getElementById(`effectAngle${i}`).value = el.advancedEffect.angle ?? -45;
                    document.getElementById(`effectGlowSize${i}`).value = el.advancedEffect.glowSize ?? 20;
                    updateFxControlsVisibility(index);
                } else {
            // As a final fallback, if the entire advancedEffect object is missing,
            // set the UI to 'none' to prevent errors.
                    document.getElementById(`advancedEffectType${i}`).value = 'none';
                    updateFxControlsVisibility(index);
                }
            });
            updateColorPreviews();
        }

        function selectLogo(thumbElement, logoSrc) {
            // Update active thumbnail UI
            document.querySelectorAll('.logo-thumb').forEach(thumb => thumb.classList.remove('active'));
            thumbElement.classList.add('active');

            selectedLogo.src = logoSrc;

            if (logoSrc) {
                const img = new Image();
                img.onload = () => {
                    selectedLogo.img = img;
                    drawThumbnail();
                };
                img.onerror = () => {
                    console.error(`Failed to load logo: ${logoSrc}`);
                    selectedLogo.img = null; // Clear if loading fails
                    drawThumbnail();
                };
                img.src = logoSrc; // Assumes logos are in the same folder
            } else {
                selectedLogo.img = null; // No logo selected
                drawThumbnail();
            }
        }

        function setLogoPosition(position) {
            // Update active button UI
            document.querySelectorAll('.logo-pos-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            selectedLogo.position = position;
            drawThumbnail();
        }

        // Add listener for the logo size slider
        document.getElementById('logoScale').addEventListener('input', function(e) {
            const scalePercent = e.target.value;
            document.getElementById('logoScaleValue').textContent = `${scalePercent}%`;
            selectedLogo.scale = parseFloat(scalePercent) / 100;
            drawThumbnail();
        });


        function toggleControlVisibility(button, elementId) {
            const controlDiv = document.getElementById(elementId);
            const isVisible = controlDiv.classList.contains('show');

            // Optional: Hide all other sections for this text group
            const group = button.closest('.text-input-group');
            group.querySelectorAll('.collapsible-controls').forEach(div => {
                div.classList.remove('show');
            });
            group.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Toggle the clicked section
            if (!isVisible) {
                controlDiv.classList.add('show');
                button.classList.add('active');
            }
        }
        // Update color previews
        function updateColorPreviews() {
            for(let i = 1; i <= 4; i++) {
                const color = document.getElementById(`color${i}`).value;
                document.getElementById(`preview${i}`).style.backgroundColor = color;
            }
        }

        // Add color input listeners
        document.querySelectorAll('input[type="color"]').forEach(input => {
            input.addEventListener('input', updateColorPreviews);
        });

        function exportLayoutToClipboard() {
            // Start building the main object string
            let output = "{\n";

            // --- 1. Build the 'text' array string ---
            output += "    text: [\n";
            textElements.forEach((el, index) => {
                // Indent one level deeper for elements inside the 'text' array
                let elementString = "        {\n";
                elementString += `            x: ${Math.round(el.x)}, y: ${Math.round(el.y)}, align: '${el.align}', wrap: ${el.wrap},\n`;
                elementString += `            color: '${el.color}',\n`;
                elementString += `            strokeColor: '${el.strokeColor}', strokeThickness: ${el.strokeThickness},\n`;
                elementString += `            bgColor: '${el.bgColor}', bgFullWidth: ${el.bgFullWidth}, bgPadding: ${el.bgPadding},\n`;
                elementString += `            shadowEnabled: ${el.shadowEnabled}, shadowColor: '${el.shadowColor}', shadowBlur: ${el.shadowBlur}, shadowOffsetX: ${el.shadowOffsetX}, shadowOffsetY: ${el.shadowOffsetY}\n`;
                elementString += "        }";

                if (index < textElements.length - 1) {
                    elementString += ",\n";
                } else {
                    elementString += "\n";
                }
                output += elementString;
            });
            output += "    ],\n"; // Close the 'text' array and add a comma

            // --- 2. Build the 'logo' object string ---
            const logoSrcValue = selectedLogo.src ? `'${selectedLogo.src}'` : 'null'; // Handle if no logo is selected
            output += "    logo: { ";
            output += `src: ${logoSrcValue}, `;
            output += `position: '${selectedLogo.position}', `;
            output += `scale: ${selectedLogo.scale.toFixed(2)} `; // Use toFixed for clean output
            output += "}\n"; // Close the 'logo' object

            // --- 3. Close the main object and copy to clipboard ---
            output += "}";

            navigator.clipboard.writeText(output).then(() => {
                const feedbackDiv = document.getElementById('copy-feedback');
                feedbackDiv.textContent = 'Layout code copied to clipboard!';
                setTimeout(() => {
                    feedbackDiv.textContent = '';
                }, 3000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                const feedbackDiv = document.getElementById('copy-feedback');
                feedbackDiv.textContent = 'Failed to copy. See console for error.';
                setTimeout(() => {
                    feedbackDiv.textContent = '';
                }, 3000);
            });
        }
        function getTextElementAt(mouseX, mouseY) {
            // Iterate backwards so topmost elements are checked first if they overlap
            for (let i = textElements.length - 1; i >= 0; i--) {
                const el = textElements[i];
                const text = el.text || document.getElementById(el.inputId).value;
                if (!text) continue; // Skip empty text elements

                const size = parseFloat(el.size || document.getElementById(el.sizeId).value);
                const x = el.x;
                const y = el.y; // This is the top of the text due to textBaseline='top'
                const align = el.align;

                ctx.font = `bold ${size}px "Berlin Sans FB Demi Bold"`; // Set font to measure
                const textMetrics = ctx.measureText(text);
                let textWidth = textMetrics.width;
                const lineHeight = size * 1.2; // Approximate height of one line

                let actualRenderedLines = [text];
                if (el.wrap) {
                    // Use the centralized wrapText function for consistency
                    actualRenderedLines = wrapText(ctx, text, x, y, canvas.width * 0.96, lineHeight, align, x, canvas.width);
                    textWidth = 0;
                    actualRenderedLines.forEach(line => {
                        textWidth = Math.max(textWidth, ctx.measureText(line.trim()).width);
                    });
                } else {
                     // If not wrapped, textWidth is just the width of the single line.
                    textWidth = ctx.measureText(text).width;
                }
                
                const textHeight = actualRenderedLines.length * lineHeight;

                let x1, x2; // Bounding box x-coordinates

                if (align === 'left') {
                    x1 = x;
                    x2 = x + textWidth;
                } else if (align === 'right') {
                    x1 = x - textWidth;
                    x2 = x;
                } else { // center
                    x1 = x - textWidth / 2;
                    x2 = x + textWidth / 2;
                }

                const y1 = y; // Top of the text block
                const y2 = y + textHeight; // Bottom of the text block

                // Add a small buffer for easier clicking
                const buffer = 10; // 10px buffer
                if (mouseX >= x1 - buffer && mouseX <= x2 + buffer && 
                    mouseY >= y1 - buffer && mouseY <= y2 + buffer) {
                    return i; // Return the index of the clicked element
                }
            }
            return -1; // No text element found at this position
        }
            // REPLACE your existing 'mousedown' listener with this
            canvas.addEventListener('mousedown', (e) => {
                const { x, y } = getCanvasMousePos(e); // Using a helper we'll add

                // Priority 1: Check for new objects (we'll write getObjectAt next)
                const clickedObjectIndex = getObjectAt(x, y);
                if (clickedObjectIndex > -1) {
                    dragState.isDragging = true;
                    dragState.target = 'object';
                    dragState.index = clickedObjectIndex;
                    selectObject(clickedObjectIndex); // Selects the object and shows its properties

                    dragState.startX = x;
                    dragState.startY = y;
                    dragState.elementStartX = canvasObjects[clickedObjectIndex].x;
                    dragState.elementStartY = canvasObjects[clickedObjectIndex].y;
                    canvas.style.cursor = 'move';
                    return; // Stop here
                }

                // Priority 2: Check for main text lines
                const clickedTextIndex = getTextElementAt(x, y);
                if (clickedTextIndex > -1) {
                    dragState.isDragging = true;
                    dragState.target = 'text';
                    dragState.index = clickedTextIndex;
                    deselectAll(); // Deselect any new objects if we click on main text

                    dragState.startX = x;
                    dragState.startY = y;
                    dragState.elementStartX = textElements[clickedTextIndex].x;
                    dragState.elementStartY = textElements[clickedTextIndex].y;
                    canvas.style.cursor = 'move';
                    return; // Stop here
                }

                // Fallback: Drag the background
                if (currentImage) {
                    dragState.isDragging = true;
                    dragState.target = 'background';
                    deselectAll(); // Deselect any new objects

                    dragState.startX = x;
                    dragState.startY = y;
                    dragState.elementStartX = imageOffsetX;
                    dragState.elementStartY = imageOffsetY;
                    canvas.style.cursor = 'grabbing';
                }
            });

        // NEW: Helper function to apply a logo preset from a layout
        function applyLogoPreset(preset) {
            if (!preset) return;

            // 1. Update the main logo state object
            selectedLogo.src = preset.src;
            selectedLogo.position = preset.position;
            selectedLogo.scale = preset.scale;
            selectedLogo.img = null; // Reset image until it's loaded

            // 2. Update the UI controls to match the preset
            // Update slider
            const scalePercent = preset.scale * 100;
            document.getElementById('logoScale').value = scalePercent;
            document.getElementById('logoScaleValue').textContent = `${scalePercent}%`;

            // Update position buttons
            document.querySelectorAll('.logo-pos-btn').forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.querySelector(`.logo-pos-btn[onclick="setLogoPosition('${preset.position}')"]`);
            if (activeBtn) activeBtn.classList.add('active');

            // Update logo selection thumbnails
            document.querySelectorAll('.logo-thumb').forEach(thumb => thumb.classList.remove('active'));
            // The selector needs to handle null for src correctly
            const activeThumbSelector = preset.src ? `.logo-thumb[onclick="selectLogo(this, '${preset.src}')"]` : `.logo-thumb[onclick="selectLogo(this, null)"]`;
            const activeThumb = document.querySelector(activeThumbSelector);
            if (activeThumb) activeThumb.classList.add('active');

            // 3. Load the actual image
            if (preset.src) {
                const img = new Image();
                img.onload = () => {
                    selectedLogo.img = img;
                    drawThumbnail(); // Redraw once the logo is loaded
                };
                img.onerror = () => {
                    console.error(`Failed to load logo from preset: ${preset.src}`);
                    drawThumbnail(); // Draw without logo if it fails
                };
                img.src = preset.src;
            }
        }


        // MODIFIED: This function now handles the new data structure from getLayoutPositions
        function setLayout(layout) {
            currentLayout = layout;
            const layoutPreset = getLayoutPositions(layout); // Get the entire preset object


                // Define a clean, default state for a text element
            const defaultTextElement = {
                fontFamily: "'Berlin Sans FB Demi Bold', sans-serif",
                color: '#FFFFFF',
                strokeColor: '#000000', strokeThickness: 0,
                bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10,
                shadowEnabled: false, shadowColor: 'rgba(0,0,0,0.7)', shadowBlur: 5, shadowOffsetX: 2, shadowOffsetY: 2,
                advancedEffect: {
                    type: 'none',
                    color1: '#ff0000', color2: '#00ff00', color3: '#0000ff',
                    distance: 10, angle: -45, glowSize: 20
                }
            };
            // Handle Text Elements
            layoutPreset.text.forEach((preset, index) => {
                if (textElements[index] && preset) {
                    // 1. Get the current text and size, which we want to preserve
                    const currentText = textElements[index].text;
                    const currentSize = textElements[index].size;

                    // 2. Create a new, clean object by merging the default and the preset
                    const newElementState = { ...defaultTextElement, ...preset };

                    // 3. Assign this clean state to our main text element
                    Object.assign(textElements[index], newElementState);

                    // 4. Restore the text and size if they weren't in the preset
                    // (Your switch case below will usually override this, which is fine)
                    if (!preset.text) textElements[index].text = currentText;
                    if (!preset.size) textElements[index].size = currentSize;
                }
            });


            // Handle Logo
            applyLogoPreset(layoutPreset.logo);

            // Update text content and sizes based on layout
            switch(layout) {
                case 1: // Traditional vertical stack - Ukraine War template
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 160;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 160;
                    textElements[2].text = '{Date} - Pt 1'; textElements[2].size = 160;
                    textElements[3].text = 'HITS, STRIKES, LOSSES, OTHER'; textElements[3].size = 100;
                    break;
                case 2: // Side by side top lines - US Politics template
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 160; // Example size change
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 160; // Example size change
                    textElements[2].text = '{Date} - Pt 2'; textElements[2].size = 160;
                    textElements[3].text = 'MILITARY AID'; textElements[3].size = 100;
                    break;
                case 3: // Right-aligned stack - Military Aid template
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 160;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 160;
                    textElements[2].text = '{Date} - Pt 3'; textElements[2].size = 160;
                    textElements[3].text = 'GEOPOLITICAL NEWS'; textElements[3].size = 100;
                    break;
                case 4: // Left-aligned stack - Geopolitics template
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 125;
                    textElements[1].text = 'UPDATE EXTRA'; textElements[1].size = 125;
                    textElements[2].text = 'YOUR VIDEO HEADLINE'; textElements[2].size = 160;
                    textElements[3].text = 'ALL ABOUT YOUR VIDEO GOES HERE'; textElements[3].size = 120;
                    break;
                case 5: // Split top and bottom - 3 Day Update template
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 160;
                    textElements[1].text = 'UPDATE'; textElements[1].size = 160;
                    textElements[2].text = 'FULL FRONTLINE'; textElements[2].size = 160;
                    textElements[3].text = '3-DAY UPDATE'; textElements[3].size = 120;
                    break;
                case 6: // Top and split bottom - Live Chat template
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 160;
                    textElements[1].text = 'BREAKING NEWS UPDATE'; textElements[1].size = 160;
                    textElements[2].text = 'YOUR VIDEO HEADLINE'; textElements[2].size = 160;
                    textElements[3].text = 'ALL ABOUT YOUR VIDEO GOES HERE'; textElements[3].size = 100;
                    break;
                case 7:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 120;
                    textElements[1].text = 'BREAKING NEWS'; textElements[1].size = 120;
                    textElements[2].text = 'YOUR VIDEO HEADLINE'; textElements[2].size = 160;
                    textElements[3].text = 'UKRAINE OBLITERATES RUSSIA MOSCOW EXPLODES'; textElements[3].size = 100;
                    break;
                case 8:
                    textElements[0].text = ' UKRAINE '; textElements[0].size = 180;
                    textElements[1].text = ' DESTROYS '; textElements[1].size = 200;
                    textElements[2].text = ' RUSSIA ';        textElements[2].size = 180;
                    textElements[3].text = 'AMAZEBALLS!';textElements[3].size = 220;
                    break;
                case 9:
                    textElements[0].text = ' UKRAINE '; textElements[0].size = 180;
                    textElements[1].text = ' DESTROYS '; textElements[1].size = 200;
                    textElements[2].text = ' RUSSIA ';        textElements[2].size = 180;
                    textElements[3].text = 'AMAZEBALLS!';textElements[3].size = 220;
                    break;
                case 10:
                    textElements[0].text = ''; textElements[0].size = 130;
                    textElements[1].text = 'BOOM!'; textElements[1].size = 350;
                    textElements[2].text = ''; textElements[2].size = 130;
                    textElements[3].text = '';textElements[3].size = 110;
                    break;
                case 11:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 134;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 134;
                    textElements[2].text = ' {Date} - Pt 1 '; textElements[2].size = 90;
                    textElements[3].text = 'HITS & LOSSES: UKRAINE DROPS ORBAN ON MOSCOW. PUTIN BUNKER BUSTED';textElements[3].size = 80;
                    break;
                case 12:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 134;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 134;
                    textElements[2].text = ' {Date} - Pt 1 '; textElements[2].size = 90;
                    textElements[3].text = 'MILITARY AID: HUNGARY GIVES ORBAN TO MUSK. SPACEX MAKES TOAST, ';textElements[3].size = 80;
                    break;
                case 13:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 134;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 134;
                    textElements[2].text = ' {Date} - Pt 1 '; textElements[2].size = 90;
                    textElements[3].text = 'GEOPOLITICS: EU FLUSTERED, WITH ORBAN GONE, CAN APPROVE STUFF';textElements[3].size = 80;
                    break;
                case 14:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 134;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 134;
                    textElements[2].text = ' {Date} - Pt 1 '; textElements[2].size = 90;
                    textElements[3].text = 'US POLITICS: CLIMATE CHANGE BLAMED ON ORANGE GLOW FROM TRUMP';textElements[3].size = 80;
                    break;
                case 15:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 134;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 134;
                    textElements[2].text = ' BREAKING NEWS '; textElements[2].size = 90;
                    textElements[3].text = 'BREAKING: OPERATION SPIDERPIZZA: MOSCOW GETS PIZZA DRONES';textElements[3].size = 80;
                    break;
                case 16:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 134;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 134;
                    textElements[2].text = ' {Date} - Pt 1 '; textElements[2].size = 90;
                    textElements[3].text = 'HITS & LOSSES: UKRAINE DROPS ORBAN ON MOSCOW. PUTIN BUNKER BUSTED';textElements[3].size = 80;
                    break;
                case 17:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 134;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 134;
                    textElements[2].text = ' {Date} - Pt 1 '; textElements[2].size = 90;
                    textElements[3].text = 'MILITARY AID: HUNGARY GIVES ORBAN TO MUSK. SPACEX MAKES TOAST, ';textElements[3].size = 80;
                    break;
                case 18:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 134;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 134;
                    textElements[2].text = ' {Date} - Pt 1 '; textElements[2].size = 90;
                    textElements[3].text = 'GEOPOLITICS: EU FLUSTERED, WITH ORBAN GONE, CAN APPROVE STUFF';textElements[3].size = 80;
                    break;
                case 19:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 134;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 134;
                    textElements[2].text = ' {Date} - Pt 1 '; textElements[2].size = 90;
                    textElements[3].text = 'US POLITICS: CLIMATE CHANGE BLAMED ON ORANGE GLOW FROM TRUMP';textElements[3].size = 80;
                    break;
                case 20:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 134;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 134;
                    textElements[2].text = ' BREAKING NEWS '; textElements[2].size = 90;
                    textElements[3].text = 'BREAKING: OPERATION SPIDERPIZZA: MOSCOW GETS PIZZA DRONES';textElements[3].size = 80;
                    break;
                case 21:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 134;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 134;
                    textElements[2].text = ' {Date} - Pt 1 '; textElements[2].size = 90;
                    textElements[3].text = 'HITS & LOSSES: UKRAINE DROPS ORBAN ON MOSCOW. PUTIN BUNKER BUSTED';textElements[3].size = 80;
                    break;
                case 22:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 134;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 134;
                    textElements[2].text = ' {Date} - Pt 1 '; textElements[2].size = 90;
                    textElements[3].text = 'MILITARY AID: HUNGARY GIVES ORBAN TO MUSK. SPACEX MAKES TOAST, ';textElements[3].size = 80;
                    break;
                case 23:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 134;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 134;
                    textElements[2].text = ' {Date} - Pt 1 '; textElements[2].size = 90;
                    textElements[3].text = 'GEOPOLITICS: EU FLUSTERED, WITH ORBAN GONE, CAN APPROVE STUFF';textElements[3].size = 80;
                    break;
                case 24:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 134;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 134;
                    textElements[2].text = ' {Date} - Pt 1 '; textElements[2].size = 90;
                    textElements[3].text = 'US POLITICS: CLIMATE CHANGE BLAMED ON ORANGE GLOW FROM TRUMP';textElements[3].size = 80;
                    break;
                case 25:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 134;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 134;
                    textElements[2].text = ' BREAKING NEWS '; textElements[2].size = 90;
                    textElements[3].text = 'BREAKING: OPERATION SPIDERPIZZA: MOSCOW GETS PIZZA DRONES';textElements[3].size = 80;
                    break;


                default: // Ensure all textElements have some default text and size
                    if (!textElements[0].text) { textElements[0].text = "TITLE"; textElements[0].size = 160; }
                    if (!textElements[1].text) { textElements[1].text = "SUBTITLE"; textElements[1].size = 160; }
                    if (!textElements[2].text) { textElements[2].text = "DATE"; textElements[2].size = 160; }
                    if (!textElements[3].text) { textElements[3].text = "DETAILS"; textElements[3].size = 100; }
                    break;
            }



            updateDateIfNeeded(layout); // Call a helper to update date for relevant layouts
            updateTextControlsFromState(); // Update all UI inputs from the new state
            drawThumbnail();
        }

        // Helper function to update date for specific layouts if needed
        function updateDateIfNeeded(layout) {
            // Example: if layouts 1, 2, 3 should always have {Date} updated
            if ([1, 2, 3].includes(layout)) {
                const currentText3 = document.getElementById('text3').value;
                if (currentText3.includes('{Date}')) { // Check if it's a template string
                     setDate(currentText3); // This will re-evaluate {Date}
                } else {
                    // If it's not a template string but we want to force update for these layouts
                    // you might decide to call updateDate() directly or set a default {Date} string.
                    // For now, only update if {Date} placeholder is present.
                }
            } else if (document.getElementById('text3').value.includes('{Date}')) {
                // If any other layout happens to have {Date} in its text3, update it.
                setDate(document.getElementById('text3').value);
            }
        }
            

        // --- Modify text setter functions (setTitle, setSubtitle, etc.) ---
        function setTitle(title) {
            textElements[0].text = title;
            document.getElementById('text1').value = title; // Keep UI input synced
            drawThumbnail();
        }
        function setSubtitle(subtitle) {
            textElements[1].text = subtitle;
            document.getElementById('text2').value = subtitle;
            drawThumbnail();
        }
        function setDate(text) {
            let newText = text;
            if (text.includes('{Date}')) {
                const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                const now = new Date();
                const month = months[now.getMonth()];
                const day = String(now.getDate()).padStart(2, '0');
                const currentDate = `${month}-${day}`;
                newText = text.replace('{Date}', currentDate);
            }
            textElements[2].text = newText;
            document.getElementById('text3').value = newText;
            drawThumbnail();
        }
        function setLine4(text) {
            textElements[3].text = text;
            document.getElementById('text4').value = text;
            drawThumbnail();
        }
        // updateDate function remains largely the same but should use setDate
        function updateDate() {
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const now = new Date();
            const month = months[now.getMonth()];
            const day = String(now.getDate()).padStart(2, '0');
            const currentDatePart = `${month}-${day}`;

            const currentText3Value = textElements[2].text || ""; // Get from state
            let newText3 = currentDatePart;

            if (currentText3Value.includes(" - Pt 1")) newText3 += " - Pt 1";
            else if (currentText3Value.includes(" - Pt 2")) newText3 += " - Pt 2";
            else if (currentText3Value.includes(" - Pt 3")) newText3 += " - Pt 3";
            // Add more conditions if there are other suffixes to preserve

            setDate(newText3); // Use setDate to update state and UI
        }

        // --- Modify updateDateIfNeeded ---
        function updateDateIfNeeded(layout) {
            // This function is called *after* textElements[2].text is set by setLayout
            if (textElements[2].text && textElements[2].text.includes('{Date}')) {
                 setDate(textElements[2].text); // Call setDate to process {Date} and update UI
            }
        }


                // --- New function for alignment ---
        function setTextAlignment(elementIndex, newAlign) {
            if (textElements[elementIndex]) {
                textElements[elementIndex].align = newAlign;

                // Adjust X based on alignment (as per your example)
                // This requires knowing the text width, which is tricky without drawing.
                // For now, let's set X to common points and let drawThumbnail handle actual textAlign.
                // The user can then fine-tune X.
                // A more advanced approach would calculate text width and adjust X precisely.
                const textEl = textElements[elementIndex];
                const textContent = textEl.text;
                const fontSize = textEl.size || document.getElementById(textEl.sizeId).value;
                ctx.font = `bold ${fontSize}px "Berlin Sans FB Demi Bold"`; // Use current font for measurement
                const textMetrics = ctx.measureText(textContent);
                const textWidth = textMetrics.width;

                const margin = canvas.width * 0.02; // 2% margin

                if (newAlign === 'left') {
                    textEl.x = margin; // Or 0 if no margin desired for true edge
                } else if (newAlign === 'center') {
                    textEl.x = canvas.width / 2;
                } else if (newAlign === 'right') {
                    textEl.x = canvas.width - margin; // Or canvas.width for true edge
                }
                document.getElementById(`x${elementIndex + 1}`).value = Math.round(textEl.x); // Update X input
                drawThumbnail();
            }
        }



        // Inside your script, after existing event listeners or in a setup function

        // Handle image upload
        document.getElementById('imageInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = new Image();
                    img.onload = function() {
                        currentImage = img;

                        // NEW: Calculate base zoom to cover canvas
                        const imageAspectRatio = currentImage.width / currentImage.height;
                        const canvasAspectRatio = canvas.width / canvas.height;

                        if (imageAspectRatio > canvasAspectRatio) {
                            // Image is wider or less tall than canvas aspect ratio.
                            // Fit height, width will be cropped.
                            // Zoom factor is canvas_height / image_height.
                            currentImageBaseCoverZoom = canvas.height / currentImage.height;
                        } else {
                            // Image is narrower or taller than canvas aspect ratio.
                            // Fit width, height will be cropped.
                            // Zoom factor is canvas_width / image_width.
                            currentImageBaseCoverZoom = canvas.width / currentImage.width;
                        }
                        // END NEW

                        // Reset pan and slider zoom
                        imageOffsetX = 0;
                        imageOffsetY = 0;
                        document.getElementById('imageZoomSlider').value = 100; // Reset slider to 100%
                        document.getElementById('zoomValue').textContent = '100%'; // Label for additional zoom

                        drawThumbnail();
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

// Global input listener
        // Replace your existing global input listener with this complete version
            document.querySelectorAll('input, textarea, select').forEach(input => {
                input.addEventListener('input', function(e) {
                    const targetId = e.target.id;
                    let redrawNeeded = true;

                    //const match = targetId.match(/([a-zA-Z_]+)(\d+)/);
                    const match = targetId.match(/^([a-zA-Z]+)(\d+)$/);
                    const fxMatch = targetId.match(/^(effectColor|effectDistance|effectAngle|effectGlowSize|advancedEffectType|fontFamily)(\d+)?_?(\d*)$/);

                    if (fxMatch) {
                        const prefix = fxMatch[1];
                        // For IDs like "effectColor1_2", fxMatch[2] is "1" and fxMatch[3] is "2"
                        // For IDs like "fontFamily1", fxMatch[2] is "1" and fxMatch[3] is ""
                        const elementIndex = parseInt(fxMatch[3] || fxMatch[2]) - 1;

                        if (elementIndex >= 0 && textElements[elementIndex]) {
                            const el = textElements[elementIndex];
                            switch (prefix) {
                                case 'fontFamily':
                                    el.fontFamily = e.target.value;
                                    break;
                                case 'advancedEffectType':
                                    el.advancedEffect.type = e.target.value;
                                    updateFxControlsVisibility(elementIndex);
                                    break;
                                case 'effectColor':
                                    const colorNum = fxMatch[2]; // This will be '1', '2', or '3'
                                    el.advancedEffect[`color${colorNum}`] = e.target.value;
                                    break;
                                case 'effectDistance':
                                    el.advancedEffect.distance = parseFloat(e.target.value);
                                    break;
                                case 'effectAngle':
                                    el.advancedEffect.angle = parseFloat(e.target.value);
                                    break;
                                case 'effectGlowSize':
                                    el.advancedEffect.glowSize = parseFloat(e.target.value);
                                    break;
                            }
                        }
                    } else if (match) {
                        const prefix = match[1];
                        const elementIndex = parseInt(match[2]) - 1;

                        if (elementIndex >= 0 && textElements[elementIndex]) {

                            switch (prefix) {
                                // --- Existing Cases ---
                                case 'text':
                                    textElements[elementIndex].text = e.target.value;
                                    break;
                                case 'size':
                                    textElements[elementIndex].size = parseFloat(e.target.value);
                                    break;
                                case 'color':
                                    textElements[elementIndex].color = e.target.value;
                                    updateColorPreviews();
                                    break;
                                case 'x':
                                    textElements[elementIndex].x = parseFloat(e.target.value);
                                    break;
                                case 'y':
                                    textElements[elementIndex].y = parseFloat(e.target.value);
                                    break;
                                
                                // --- Stroke Cases ---
                                case 'strokeColor':
                                    textElements[elementIndex].strokeColor = e.target.value;
                                    break;
                                case 'strokeThickness':
                                    textElements[elementIndex].strokeThickness = parseFloat(e.target.value);
                                    break;

                                // --- Background Cases ---
                                case 'bgColor':
                                    {
                                        const newColorHex = e.target.value; // #RRGGBB
                                        const currentAlpha = parseFloat(document.getElementById(`bgAlpha${elementIndex + 1}`).value) / 100;
                                        const r = parseInt(newColorHex.slice(1, 3), 16);
                                        const g = parseInt(newColorHex.slice(3, 5), 16);
                                        const b = parseInt(newColorHex.slice(5, 7), 16);
                                        textElements[elementIndex].bgColor = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
                                    }
                                    break;
                                case 'bgAlpha':
                                    {
                                        const newAlpha = parseFloat(e.target.value) / 100;
                                        document.getElementById(`bgAlphaValue${elementIndex + 1}`).textContent = `${Math.round(newAlpha * 100)}%`;
                                        const rgbaMatch = textElements[elementIndex].bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                                        if (rgbaMatch) {
                                            textElements[elementIndex].bgColor = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${newAlpha})`;
                                        } else {
                                            const hexColor = document.getElementById(`bgColor${elementIndex + 1}`).value;
                                            const r = parseInt(hexColor.slice(1, 3), 16);
                                            const g = parseInt(hexColor.slice(3, 5), 16);
                                            const b = parseInt(hexColor.slice(5, 7), 16);
                                            textElements[elementIndex].bgColor = `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
                                        }
                                    }
                                    break;
                                case 'bgFullWidth': // For the checkbox
                                    textElements[elementIndex].bgFullWidth = e.target.checked;
                                    break;
                                case 'bgPadding':
                                    textElements[elementIndex].bgPadding = parseFloat(e.target.value);
                                    break;

                                // --- NEW: Shadow Cases ---
                                case 'shadowEnabled': // For the checkbox
                                    textElements[elementIndex].shadowEnabled = e.target.checked;
                                    break;
                                case 'shadowColor':
                                    {
                                        const newColorHex = e.target.value;
                                        const currentAlpha = parseFloat(document.getElementById(`shadowAlpha${elementIndex + 1}`).value) / 100;
                                        const r = parseInt(newColorHex.slice(1, 3), 16);
                                        const g = parseInt(newColorHex.slice(3, 5), 16);
                                        const b = parseInt(newColorHex.slice(5, 7), 16);
                                        textElements[elementIndex].shadowColor = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
                                    }
                                    break;
                                case 'shadowAlpha':
                                    {
                                        const newAlpha = parseFloat(e.target.value) / 100;
                                        document.getElementById(`shadowAlphaValue${elementIndex + 1}`).textContent = `${Math.round(newAlpha * 100)}%`;
                                        const rgbaMatch = textElements[elementIndex].shadowColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                                        if (rgbaMatch) {
                                            textElements[elementIndex].shadowColor = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${newAlpha})`;
                                        } else {
                                            const hexColor = document.getElementById(`shadowColor${elementIndex + 1}`).value;
                                            const r = parseInt(hexColor.slice(1, 3), 16);
                                            const g = parseInt(hexColor.slice(3, 5), 16);
                                            const b = parseInt(hexColor.slice(5, 7), 16);
                                            textElements[elementIndex].shadowColor = `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
                                        }
                                    }
                                    break;
                                case 'shadowBlur':
                                    textElements[elementIndex].shadowBlur = parseFloat(e.target.value);
                                    break;
                                case 'shadowOffsetX':
                                    textElements[elementIndex].shadowOffsetX = parseFloat(e.target.value);
                                    break;
                                case 'shadowOffsetY':
                                    textElements[elementIndex].shadowOffsetY = parseFloat(e.target.value);
                                    break;
                                case 'fontFamily':
                                    el.fontFamily = e.target.value;
                                    break;
                                case 'advancedEffectType':
                                    el.advancedEffect.type = e.target.value;
                                    updateFxControlsVisibility(elementIndex);
                                    break;
                                case 'effectColor1_':
                                    el.advancedEffect.color1 = e.target.value;
                                    break;
                                case 'effectColor2_':
                                    el.advancedEffect.color2 = e.target.value;
                                    break;
                                case 'effectColor3_':
                                    el.advancedEffect.color3 = e.target.value;
                                    break;
                                case 'effectDistance':
                                    el.advancedEffect.distance = parseFloat(e.target.value);
                                    break;
                                case 'effectAngle':
                                    el.advancedEffect.angle = parseFloat(e.target.value);
                                    break;
                                case 'effectGlowSize':
                                    el.advancedEffect.glowSize = parseFloat(e.target.value);
                                    break;
                        }
                    }
                }

                // Handle general controls not tied to a specific textElement index
                if (targetId === 'imageOpacity') {
                    document.getElementById('opacityValue').textContent = e.target.value + '%';
                } else if (targetId === 'imageZoomSlider') {
                    document.getElementById('zoomValue').textContent = e.target.value + '%';
                } else if (targetId === 'bg-brightness') {
                    backgroundImageState.brightness = e.target.value;
                    document.getElementById('bg-brightness-value').textContent = e.target.value + '%';
                } else if (targetId === 'bg-contrast') {
                    backgroundImageState.contrast = e.target.value;
                    document.getElementById('bg-contrast-value').textContent = e.target.value + '%';
                } else if (targetId === 'bg-saturate') {
                    backgroundImageState.saturate = e.target.value;
                    document.getElementById('bg-saturate-value').textContent = e.target.value + '%';
                }

                if (redrawNeeded) {
                    drawThumbnail();
                }
            });
        });

        // --- Add this new block of code after your main input listener ---

        // Add scroll wheel functionality to all size input boxes
        document.querySelectorAll('input[id^="size"]').forEach(sizeInput => {
            sizeInput.addEventListener('wheel', function(e) {
                // Prevent the page from scrolling up or down
                e.preventDefault();

                // Determine the direction of the scroll
                // e.deltaY will be negative for scroll up, positive for scroll down
                const direction = e.deltaY < 0 ? 1 : -1;

                // Get the current value and the min/max attributes
                let currentValue = parseInt(this.value, 10);
                const min = parseInt(this.min, 10) || 10; // Default min if not set
                const max = parseInt(this.max, 10) || 200; // Default max if not set

                // Calculate the new value
                let newValue = currentValue + direction;

                // Clamp the new value to the min/max range
                if (newValue < min) {
                    newValue = min;
                }
                if (newValue > max) {
                    newValue = max;
                }

                // Update the input's value
                this.value = newValue;

                // Manually trigger the 'input' event so our main listener picks up the change
                // This ensures textElements state is updated and drawThumbnail() is called.
                this.dispatchEvent(new Event('input', { bubbles: true }));
            });
        });

        // updateColorPreviews function (ensure it's still there and correct)
        function updateColorPreviews() {
            for(let i = 1; i <= 4; i++) { // Assuming 4 text lines
                const colorInput = document.getElementById(`color${i}`);
                const previewDiv = document.getElementById(`preview${i}`);
                if (colorInput && previewDiv) {
                    previewDiv.style.backgroundColor = colorInput.value;
                    // Also ensure textElements reflects this if it's the source of truth
                    if (textElements[i-1]) {
                         textElements[i-1].color = colorInput.value;
                    }
                }
            }
        }

        // updateColorPreviews function (ensure it's still there and correct)
        function updateColorPreviews() {
            for(let i = 1; i <= 4; i++) { // Assuming 4 text lines
                const colorInput = document.getElementById(`color${i}`);
                const previewDiv = document.getElementById(`preview${i}`);
                if (colorInput && previewDiv) {
                    previewDiv.style.backgroundColor = colorInput.value;
                    // Also ensure textElements reflects this if it's the source of truth
                    if (textElements[i-1]) {
                         textElements[i-1].color = colorInput.value;
                    }
                }
            }
        }

        canvas.addEventListener('mousedown', (e) => {
            const rect = canvas.getBoundingClientRect();
            const canvasMouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
            const canvasMouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

            selectedTextElementIndex = getTextElementAt(canvasMouseX, canvasMouseY);

            if (selectedTextElementIndex !== -1) {
                isDraggingImage = false; // Not dragging image if text is selected
                canvas.style.cursor = 'move';
                dragStartX = canvasMouseX;
                dragStartY = canvasMouseY;
                const el = textElements[selectedTextElementIndex];
                elementStartPosX = el.x;
                elementStartPosY = el.y;
            } else if (currentImage) { // Only allow image dragging if there's an image
                isDraggingImage = true;
                lastMouseX = canvasMouseX;
                lastMouseY = canvasMouseY;
                canvas.style.cursor = 'grabbing';
            }
        });

        // REPLACE your existing 'mousemove' listener with this
        canvas.addEventListener('mousemove', (e) => {
            if (!dragState.isDragging) return;

            const { x, y } = getCanvasMousePos(e);
            const dx = x - dragState.startX;
            const dy = y - dragState.startY;

            switch (dragState.target) {
                case 'object':
                    canvasObjects[dragState.index].x = dragState.elementStartX + dx;
                    canvasObjects[dragState.index].y = dragState.elementStartY + dy;
                    break;
                case 'text':
                    const textEl = textElements[dragState.index];
                    textEl.x = dragState.elementStartX + dx;
                    textEl.y = dragState.elementStartY + dy;
                    document.getElementById(`x${dragState.index + 1}`).value = Math.round(textEl.x);
                    document.getElementById(`y${dragState.index + 1}`).value = Math.round(textEl.y);
                    break;
                case 'background':
                    imageOffsetX = dragState.elementStartX + dx;
                    imageOffsetY = dragState.elementStartY + dy;
                    break;
            }
            drawThumbnail();
        });
        // REPLACE your existing 'mouseup' and 'mouseleave' listeners with this
        canvas.addEventListener('mouseup', () => {
            dragState.isDragging = false;
            dragState.target = null;
            canvas.style.cursor = 'default';
        });
        canvas.addEventListener('mouseleave', () => { // Also stop dragging if mouse leaves canvas
            if (dragState.isDragging) {
                onCanvasMouseUp();
            }
        });


        // ADD THESE NEW FUNCTIONS to script.js

        function getCanvasMousePos(e) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: (e.clientX - rect.left) * (canvas.width / rect.width),
                y: (e.clientY - rect.top) * (canvas.height / rect.height)
            };
        }

        function selectObject(index) {
            selectedObjectIndex = index;
            updateObjectPropertiesPanel(); // We will create this function next
            drawThumbnail();
        }

        function deselectAll() {
            if (selectedObjectIndex !== -1) {
                selectedObjectIndex = -1;
                document.getElementById('object-properties-panel').style.display = 'none';
                drawThumbnail();
            }
        }
        // REPLACE the empty getObjectAt function in script.js
        function getObjectAt(mouseX, mouseY) {
            // Iterate backwards to select topmost object
            for (let i = canvasObjects.length - 1; i >= 0; i--) {
                const obj = canvasObjects[i];
                const halfW = obj.width / 2;
                const halfH = obj.height / 2;
                if (mouseX >= obj.x - halfW && mouseX <= obj.x + halfW &&
                    mouseY >= obj.y - halfH && mouseY <= obj.y + halfH) {
                    return i;
                }
            }
            return -1; // Nothing found
        }

        // REPLACE the empty updateObjectPropertiesPanel function in script.js
        function updateObjectPropertiesPanel() {
            const panel = document.getElementById('object-properties-panel');
            const contentDiv = document.getElementById('properties-content');
            
            if (selectedObjectIndex < 0) {
                panel.style.display = 'none';
                return;
            }

            const obj = canvasObjects[selectedObjectIndex];
            let html = '<div class="prop-grid">';

            // Type-specific properties
            if (obj.type === 'shape') {
                html += `
                    <label for="obj-fill-color">Fill</label>
                    <input type="color" id="obj-fill-color" value="${obj.fill}">
                `;
            } else if (obj.type === 'text') {
                html += `
                    <label for="obj-text-content">Text</label>
                    <input type="text" id="obj-text-content" value="${obj.text}">
                    
                    <label for="obj-text-color">Color</label>
                    <input type="color" id="obj-text-color" value="${obj.color}">

                    <label for="obj-font-size">Size</label>
                    <input type="range" id="obj-font-size" min="20" max="400" value="${obj.size}">
                `;
            }

            // Common properties for all objects
            html += `
                <label for="obj-stroke-color">Stroke</label>
                <input type="color" id="obj-stroke-color" value="${obj.stroke}">
                
                <label for="obj-stroke-width">Stroke Width</label>
                <input type="range" id="obj-stroke-width" min="0" max="50" value="${obj.strokeWidth}">
                
                <label for="obj-shadow-enabled">Shadow</label>
                <input type="checkbox" id="obj-shadow-enabled" ${obj.shadow.enabled ? 'checked' : ''}>

                <label for="obj-shadow-color">Shadow Color</label>
                <input type="color" id="obj-shadow-color" value="${obj.shadow.color}">

                <label for="obj-shadow-blur">Shadow Blur</label>
                <input type="range" id="obj-shadow-blur" min="0" max="50" value="${obj.shadow.blur}">
            `;

            html += '</div>';
            contentDiv.innerHTML = html;
            panel.style.display = 'block';
        }
// ADD THIS NEW FUNCTION to script.js
// ADD THIS NEW FUNCTION to script.js
        function handleObjectPropertyChange(e) {
            if (selectedObjectIndex < 0) return;
            
            const obj = canvasObjects[selectedObjectIndex];
            const { id, value, type, checked } = e.target;

            switch (id) {
                // Shape-specific
                case 'obj-fill-color': obj.fill = value; break;
                // Text-specific
                case 'obj-text-content': obj.text = value; break;
                case 'obj-text-color': obj.color = value; break;
                case 'obj-font-size': obj.size = parseFloat(value); break;
                // Common
                case 'obj-stroke-color': obj.stroke = value; break;
                case 'obj-stroke-width': obj.strokeWidth = parseFloat(value); break;
                case 'obj-shadow-enabled': obj.shadow.enabled = checked; break;
                case 'obj-shadow-color': obj.shadow.color = value; break;
                case 'obj-shadow-blur': obj.shadow.blur = parseFloat(value); break;
            }
            drawThumbnail();
        }
        function setupPositionInputListeners() {
            textElements.forEach((el, index) => {
                const xInput = document.getElementById(`x${index + 1}`);
                const yInput = document.getElementById(`y${index + 1}`);
                const textInput = document.getElementById(el.inputId);
                const sizeInput = document.getElementById(el.sizeId);
                const colorInput = document.getElementById(el.colorId);


                xInput.addEventListener('input', (e) => {
                    textElements[index].x = parseFloat(e.target.value);
                    drawThumbnail();
                });
                yInput.addEventListener('input', (e) => {
                    textElements[index].y = parseFloat(e.target.value);
                    drawThumbnail();
                });
                // Also update textElements from direct text/size/color input
                textInput.addEventListener('input', (e) => {
                    textElements[index].text = e.target.value;
                    // No drawThumbnail() here, it's handled by the global input listener
                });
                sizeInput.addEventListener('input', (e) => {
                    textElements[index].size = parseFloat(e.target.value);
                });
                colorInput.addEventListener('input', (e) => {
                    textElements[index].color = e.target.value;
                    // updateColorPreviews() is already called by its own listener
                });
            });
        }

        // REPLACE/ADD this function in script.js
        // ADD THIS NEW FUNCTION to script.js

        function addEventListeners() {
            // We will move all listeners here
        }
        function addObject(type, options = {}) {
            objectIdCounter++;
            let newObject;

            if (type === 'text') {
                // Create a text object with the full, consistent data structure
                newObject = {
                    id: objectIdCounter,
                    type: 'text',
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    width: 500, // Set a default width for selection box
                    height: 200, // Set a default height for selection box
                    rotation: 0,
                    text: 'New Text',
                    size: 100,
                    align: 'center',
                    wrap: false,
                    // Apply all style properties from the options (passed from the preset)
                    ...options
                };
            } else {
                // Your existing logic for shapes and images
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
                    shadow: { enabled: false, color: '#000000', blur: 5, offsetX: 5, offsetY: 5 },
                    ...options
                };

            };

            // Type-specific defaults
            if (type === 'shape') {
                newObject.fill = '#ff0000'; // Default red fill for shapes
            } else if (type === 'text') {
                newObject.text = 'New Text';
                newObject.font = 'Berlin Sans FB Demi Bold';
                newObject.size = 100;
                newObject.color = '#ffffff'; // Use 'color' for text fill
            } else if (type === 'image' && newObject.src) {
                const img = new Image();
                img.onload = () => {
                    newObject.img = img;
                    // Set initial size based on image, but capped
                    const maxDim = 400;
                    if (img.width > img.height) {
                        newObject.width = maxDim;
                        newObject.height = img.height * (maxDim / img.width);
                    } else {
                        newObject.height = maxDim;
                        newObject.width = img.width * (maxDim / img.height);
                    }
                    drawThumbnail();
                };
                img.src = newObject.src;
            }

            canvasObjects.push(newObject);
            selectObject(canvasObjects.length - 1); // Select the new object immediately
        }


        function wrapText(ctx, text, x, y, maxWidth, lineHeight, align = 'center', elementX = x, canvasWidth = 1920) {
            const words = text.split(' ');
            let line = '';
            const lines = [];
            let effectiveMaxWidth = maxWidth;
            const padding = canvasWidth * 0.02; // 2% padding from canvas edges

            if (align === 'left') {
                effectiveMaxWidth = canvasWidth - elementX - padding;
            } else if (align === 'right') {
                effectiveMaxWidth = elementX - padding;
            } else { // center or unspecified
                // For center, we might still want to constrain it if x is near an edge,
                // but the primary constraint is often the passed maxWidth (e.g. canvas.width * 0.96)
                // If elementX is very close to an edge, this could be min(elementX - padding, canvasWidth - elementX - padding) * 2
                // However, simple maxWidth usually works well for centered text that's not meant to span full width.
                // Let's use the provided maxWidth, but ensure it's not excessively large if x is near edge.
                effectiveMaxWidth = Math.min(maxWidth, canvasWidth - 2 * padding);
            }
            effectiveMaxWidth = Math.max(50, effectiveMaxWidth); // Ensure a minimum wrapping width

            for(let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;

                if (testWidth > effectiveMaxWidth && n > 0) {
                    lines.push(line);
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }
            lines.push(line);

            return lines;
        }

        // MODIFIED: This function now returns an object with `text` and `logo` properties.


        function drawThumbnail() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (currentImage) {
                // Apply brightness, contrast, and saturation filters
                const filters = `brightness(${backgroundImageState.brightness}%) contrast(${backgroundImageState.contrast}%) saturate(${backgroundImageState.saturate}%)`;
                ctx.filter = filters;

                // ... (image drawing logic - no changes here) ...
                const sliderValue = parseFloat(document.getElementById('imageZoomSlider').value);
                const sliderZoomFactor = sliderValue / 100;
                const effectiveImageZoom = currentImageBaseCoverZoom * sliderZoomFactor;
                const srcVisibleWidth = canvas.width / effectiveImageZoom;
                const srcVisibleHeight = canvas.height / effectiveImageZoom;
                let sx = (currentImage.width - srcVisibleWidth) / 2 - (imageOffsetX / effectiveImageZoom);
                let sy = (currentImage.height - srcVisibleHeight) / 2 - (imageOffsetY / effectiveImageZoom);
                sx = Math.max(0, Math.min(currentImage.width - srcVisibleWidth, sx));
                sy = Math.max(0, Math.min(currentImage.height - srcVisibleHeight, sy));
                const finalSrcWidth = Math.min(srcVisibleWidth, currentImage.width - sx);
                const finalSrcHeight = Math.min(srcVisibleHeight, currentImage.height - sy);
                ctx.drawImage(currentImage, sx, sy, finalSrcWidth, finalSrcHeight, 0, 0, canvas.width, canvas.height);
                const brightnessOpacity = (100 - document.getElementById('imageOpacity').value) / 100;
                ctx.fillStyle = `rgba(255, 255, 255, ${brightnessOpacity})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Reset filters so they don't affect text and other elements
                ctx.filter = 'none';
            }

            // --- Draw Alignment Guides (if enabled) ---
            ctx.save();
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]); // Dashed lines for guides

            // Rule of Thirds
            if (document.getElementById('overlay-thirds') && document.getElementById('overlay-thirds').checked) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'; // Semi-transparent white
                const thirdW = canvas.width / 3;
                const thirdH = canvas.height / 3;
                ctx.beginPath();
                ctx.moveTo(thirdW, 0); ctx.lineTo(thirdW, canvas.height);
                ctx.moveTo(thirdW * 2, 0); ctx.lineTo(thirdW * 2, canvas.height);
                ctx.moveTo(0, thirdH); ctx.lineTo(canvas.width, thirdH);
                ctx.moveTo(0, thirdH * 2); ctx.lineTo(canvas.width, thirdH * 2);
                ctx.stroke();
            }

            // Center Lines
            if (document.getElementById('overlay-center') && document.getElementById('overlay-center').checked) {
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)'; // Semi-transparent red for center
                ctx.beginPath();
                ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
                ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.stroke();
            }
            ctx.restore(); // Restore line dash and stroke style

            textElements.forEach((el) => {
                // Set font for measurement
                ctx.font = `bold ${el.size}px ${el.fontFamily}`;
                ctx.textBaseline = 'top'; // Use 'top' for background calculation
                ctx.textAlign = el.align;

                const lineHeight = el.size * 1.2;
                // Pass align and x position to wrapText
                const lines = el.wrap ? wrapText(ctx, el.text, el.x, el.y, canvas.width * 0.96, lineHeight, el.align, el.x, canvas.width) : [el.text];

                // --- Draw Text Background (if enabled) ---
                // This is the "more robust" logic from your original code, now correctly integrated.
                if (el.bgColor && !el.bgColor.endsWith(', 0)')) {
                    let textBlockVisualWidth = 0;
                    lines.forEach(line => {
                        textBlockVisualWidth = Math.max(textBlockVisualWidth, ctx.measureText(line.trim()).width);
                    });

                    // For height, it's number of lines * font size, plus (n-1)*leading
                    // A simpler approximation for visual height:
                    let textBlockVisualHeight = lines.length * el.size;
                    if (lines.length > 1) {
                        textBlockVisualHeight += (lines.length - 1) * (lineHeight - el.size); // Add inter-line spacing
                    }
                    if (el.text.trim() === "") {
                        textBlockVisualWidth = el.size / 2;
                        textBlockVisualHeight = el.size;
                    }

                    let bgX, bgY, bgW, bgH;
                    if (el.bgFullWidth) {
                        bgX = 0;
                        bgW = canvas.width;
                        bgY = el.y - el.bgPadding;
                        bgH = textBlockVisualHeight + (el.bgPadding * 2);
                    } else {
                        if (el.align === 'left') bgX = el.x - el.bgPadding;
                        else if (el.align === 'right') bgX = el.x - textBlockVisualWidth - el.bgPadding;
                        else /* center */ bgX = el.x - (textBlockVisualWidth / 2) - el.bgPadding;

                        bgY = el.y - el.bgPadding;
                        bgW = textBlockVisualWidth + (el.bgPadding * 2);
                        bgH = textBlockVisualHeight + (el.bgPadding * 2);
                    }
                    ctx.fillStyle = el.bgColor;
                    ctx.fillRect(bgX, bgY, bgW, bgH);
                }

                drawTextWithEffect(ctx, el, lines);

            });
            // PASTE THIS CODE BLOCK into drawThumbnail()

            // 3. Draw All Canvas Objects
            canvasObjects.forEach(obj => {
                ctx.save();
                ctx.translate(obj.x, obj.y);
                ctx.rotate(obj.rotation * Math.PI / 180);

                switch (obj.type) {
                    case 'shape': drawShape(obj); break;
                    case 'image': drawImageObject(obj); break;
                    case 'text':
                        // For text snippets, we don't have pre-calculated lines, so we pass the object directly.
                        drawTextWithEffect(ctx, obj);
                        break;
                }
                ctx.restore();
            });


            // 5. Draw Selection Handles (if not for download)
            if (selectedObjectIndex > -1) {
                const obj = canvasObjects[selectedObjectIndex];
                ctx.save();
                ctx.translate(obj.x, obj.y);
                ctx.rotate(obj.rotation * Math.PI / 180);
                ctx.strokeStyle = '#007bff';
                ctx.lineWidth = 4;
                ctx.strokeRect(-obj.width / 2, -obj.height / 2, obj.width, obj.height);
                ctx.restore();
            }

            if (selectedLogo.img) {
                const logo = selectedLogo.img;
                const padding = selectedLogo.padding;
                
                // Calculate logo width based on a percentage of the canvas width
                const logoWidth = canvas.width * selectedLogo.scale;
                const logoHeight = (logo.height / logo.width) * logoWidth; // Maintain aspect ratio

                let x, y;

                switch (selectedLogo.position) {
                    case 'top-left':
                        x = padding;
                        y = padding;
                        break;
                    case 'top-right':
                        x = canvas.width - logoWidth - padding;
                        y = padding;
                        break;
                    case 'bottom-left':
                        x = padding;
                        y = canvas.height - logoHeight - padding;
                        break;
                    case 'bottom-right': // Default
                    default:
                        x = canvas.width - logoWidth - padding;
                        y = canvas.height - logoHeight - padding;
                        break;
                }
                ctx.drawImage(logo, x, y, logoWidth, logoHeight);
            }

        }


        function drawTextWithEffect(ctx, el, precalculatedLines = null) {
            // --- Setup ---
            const text = el.text || '';
            const size = el.size || 100;
            const xPos = el.x;
            const yPos = el.y;
            const alignment = el.align || 'center';
            const fontFamily = el.fontFamily || "'Berlin Sans FB Demi Bold', sans-serif";

            ctx.font = `bold ${size}px ${fontFamily}`;
            ctx.textAlign = alignment;

            ctx.textBaseline = ctx.textBaseline === 'middle' ? 'middle' : 'top';

            const lineHeight = size * 1.2;
            // Use pre-calculated lines if provided, otherwise calculate them now (for snippets)
            // For snippets (where precalculatedLines is null), pass alignment and x position from 'el'
            const lines = precalculatedLines || (el.wrap ? wrapText(ctx, text, xPos, yPos, canvas.width * 0.96, lineHeight, el.align, el.x, canvas.width) : [text]);

            // Function to draw the text lines, used by all effects
            const drawLines = (drawFunc) => {
                lines.forEach((line, index) => {
                    const currentY = yPos + (index * lineHeight);
                    drawFunc(line.trim(), xPos, currentY);
                });
            };

            // --- Layer 1: Advanced Effects ---
            const effect = el.advancedEffect;
            if (effect && effect.type !== 'none') {
                ctx.save(); // Save context before applying complex effects

                switch (effect.type) {
                    case 'neon':
                        ctx.shadowColor = effect.color2; // Outer glow
                        ctx.shadowBlur = effect.glowSize * 1.5;
                        drawLines((txt, x, y) => ctx.strokeText(txt, x, y));
                        
                        ctx.shadowColor = effect.color1; // Inner glow
                        ctx.shadowBlur = effect.glowSize * 0.75;
                        drawLines((txt, x, y) => ctx.strokeText(txt, x, y));
                        break;

                    case 'splice':
                    case 'echo':
                        const angleRad = effect.angle * (Math.PI / 180);
                        const dx = Math.cos(angleRad) * effect.distance;
                        const dy = Math.sin(angleRad) * effect.distance;
                        
                        if (effect.type === 'echo') {
                            ctx.fillStyle = effect.color1;
                            drawLines((txt, x, y) => ctx.fillText(txt, x + (dx / 2), y + (dy / 2)));
                        }
                        ctx.fillStyle = effect.color2;
                        drawLines((txt, x, y) => ctx.fillText(txt, x + dx, y + dy));
                        break;

                    case 'glitch':
                        ctx.fillStyle = effect.color2;
                        drawLines((txt, x, y) => ctx.fillText(txt, x - effect.distance, y));
                        
                        ctx.fillStyle = effect.color3;
                        drawLines((txt, x, y) => ctx.fillText(txt, x + effect.distance, y));
                        break;
                }
                ctx.restore(); // Restore context after effects
              
            }

            // --- Layer 2: Standard Shadow ---
            if (el.shadowEnabled) {
                ctx.shadowColor = el.shadowColor;
                ctx.shadowBlur = el.shadowBlur;
                ctx.shadowOffsetX = el.shadowOffsetX;
                ctx.shadowOffsetY = el.shadowOffsetY;
            }

            // --- Layer 3: Main Text (Stroke and Fill) ---
            if (el.strokeThickness > 0) {
                ctx.strokeStyle = el.strokeColor;
                ctx.lineWidth = el.strokeThickness;
                drawLines((txt, x, y) => ctx.strokeText(txt, x, y));
            }
            ctx.fillStyle = el.color;
            drawLines((txt, x, y) => ctx.fillText(txt, x, y));

            // --- Cleanup ---
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }    



        function downloadThumbnail() {
            // Get current date in YYYYMMDD format
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const dateStr = `${year}${month}${day}`;

            // Function to clean text for filename
            function cleanText(text) {
                return text
                    .replace(/[$€/&%]/g, '') // Remove specific special characters
                    .replace(/[^a-zA-Z0-9\s-]/g, '') // Keep only alphanumeric, spaces, and hyphens
                    .replace(/\s+/g, '_') // Replace spaces with underscores
                    .trim(); // Remove leading/trailing spaces
            }

            // Get text from all fields and clean them for filename
            const text1 = cleanText(document.getElementById('text1').value);
            const text2 = cleanText(document.getElementById('text2').value);
            const text3 = cleanText(document.getElementById('text3').value);
            const text4 = cleanText(document.getElementById('text4').value);

            // Create filename
            const filename = `${dateStr}_${text1}_${text2}_${text3}_${text4}.jpg`.slice(0, 255);

            // Function to get file size in MB
            function getFileSize(dataUrl) {
                const base64 = dataUrl.split(',')[1];
                return (base64.length * 0.75) / (1024 * 1024); // Convert to MB
            }

            // Function to compress image
            function compressImage(quality) {
                return new Promise((resolve) => {
                    const dataUrl = canvas.toDataURL('image/jpeg', quality);
                    resolve(dataUrl);
                });
            }

            // Function to find optimal quality
            async function findOptimalQuality() {
                let quality = 0.9; // Start with high quality
                let dataUrl = await compressImage(quality);
                let fileSize = getFileSize(dataUrl);

                // If file is already under 2MB, return current quality
                if (fileSize < 1.8) return dataUrl;

                // Binary search for optimal quality
                let min = 0.1;
                let max = 0.9;
                let bestQuality = 0.9;
                let bestSize = fileSize;

                while (min <= max) {
                    quality = (min + max) / 2;
                    dataUrl = await compressImage(quality);
                    fileSize = getFileSize(dataUrl);

                    if (fileSize < 1.8) {
                        bestQuality = quality;
                        bestSize = fileSize;
                        min = quality + 0.1;
                    } else {
                        max = quality - 0.1;
                    }
                }

                return await compressImage(bestQuality);
            }

            // Download with optimal quality
            findOptimalQuality().then(dataUrl => {
                const link = document.createElement('a');
                link.download = filename;
                link.href = dataUrl;
                link.click();
            });
        }

        function toggleTheme() {
            document.body.classList.toggle('dark-mode');
            drawThumbnail(); // Redraw to ensure proper contrast
        }

        // ADD THESE NEW FUNCTIONS to script.js

        function drawShape(obj) {
            ctx.fillStyle = obj.fill;
            ctx.strokeStyle = obj.stroke;
            ctx.lineWidth = obj.strokeWidth;
            
            const w = obj.width;
            const h = obj.height;

            ctx.beginPath();
            // The coordinates are relative to the object's center (0,0)
            // because we used ctx.translate()
            switch (obj.shapeType) {
                case 'square':
                    ctx.rect(-w / 2, -h / 2, w, h);
                    break;
                case 'circle':
                    ctx.arc(0, 0, w / 2, 0, 2 * Math.PI);
                    break;
                case 'arrow':
                    // A simple block arrow shape
                    ctx.moveTo(-w / 2, -h / 4); // Top-left of tail
                    ctx.lineTo(0, -h / 4);      // Top-right of tail
                    ctx.lineTo(0, -h / 2);      // Top of arrowhead
                    ctx.lineTo(w / 2, 0);       // Point of arrowhead
                    ctx.lineTo(0, h / 2);       // Bottom of arrowhead
                    ctx.lineTo(0, h / 4);       // Bottom-right of tail
                    ctx.lineTo(-w / 2, h / 4);  // Bottom-left of tail
                    ctx.closePath();
                    break;
            }
            if (obj.fill && obj.fill !== 'transparent') ctx.fill();
            if (obj.strokeWidth > 0) ctx.stroke();
        }

        function drawImageObject(obj) {
            if (obj.img) { // Only draw if the image has loaded
                ctx.drawImage(obj.img, -obj.width / 2, -obj.height / 2, obj.width, obj.height);
                if (obj.strokeWidth > 0) {
                    ctx.strokeStyle = obj.stroke;
                    ctx.lineWidth = obj.strokeWidth;
                    ctx.strokeRect(-obj.width / 2, -obj.height / 2, obj.width, obj.height);
                }
            }
        }

        function drawTextSnippetold(obj) {
            ctx.font = `bold ${obj.size}px "${obj.font}"`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // For text snippets, the main color is `obj.color`
            ctx.fillStyle = obj.color;
            ctx.strokeStyle = obj.stroke;
            ctx.lineWidth = obj.strokeWidth;

            if (obj.strokeWidth > 0) {
                ctx.strokeText(obj.text, 0, 0);
            }
            ctx.fillText(obj.text, 0, 0);
        }

        function drawTextSnippet(obj) {
            // Simply call the unified drawing function
            drawTextWithEffect(ctx, obj);
        }

        // PASTE THIS LINE at the very end of script.js
document.getElementById('object-properties-panel').addEventListener('input', handleObjectPropertyChange);



        // --- AI Image Generation Functions ---
        let lastGeneratedImageUrl = null;
        let lastGeneratedSeed = null;

        function showAiModal() { document.getElementById('ai-modal').style.display = 'flex'; }
        function closeAiModal() { document.getElementById('ai-modal').style.display = 'none'; }

        document.getElementById('ai-preset-prompts').addEventListener('change', (e) => {
            if (e.target.value) {
                document.getElementById('ai-prompt').value = e.target.value;
            }
        });
        document.getElementById('ai-guidance').addEventListener('input', (e) => {
            document.getElementById('ai-guidance-value').textContent = e.target.value;
        });

        async function generateAiImage() {
            // The API key is no longer needed here!
            const prompt = document.getElementById('ai-prompt').value;
            if (!prompt) {
                alert('Please provide a prompt.');
                return;
            }

            const loader = document.getElementById('ai-loader');
            const previewImg = document.getElementById('ai-preview-img');
            const generateBtn = document.getElementById('ai-generate-btn');
            const downloadBtn = document.getElementById('ai-download-btn');
            const setBgBtn = document.getElementById('ai-set-bg-btn');

            loader.style.display = 'block';
            previewImg.style.display = 'none';
            generateBtn.disabled = true;
            downloadBtn.disabled = true;
            setBgBtn.disabled = true;

            const seedValue = document.getElementById('ai-seed').value;
            const payload = {
                prompt: prompt,
                guidance_scale: parseFloat(document.getElementById('ai-guidance').value)
            };
            // Only include the seed if the user provided one
            if (seedValue) {
                payload.seed = parseInt(seedValue, 10);
            }

            try {
                // IMPORTANT: Change this URL to point to your FastAPI server's address
                const response = await fetch('https://desc-maker.shark-ray.ts.net/api/generate-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`API Error: ${errorData.detail || response.statusText}`);
                }

                // The server has already done the polling, so we get the final result directly.
                const prediction = await response.json();

                if (!prediction.output) {
                    throw new Error('API did not return an image URL in the output field.');
                }

                lastGeneratedImageUrl = prediction.output;
                lastGeneratedSeed = prediction.seed; // The server sends back the seed it used
                previewImg.src = lastGeneratedImageUrl;
                previewImg.style.display = 'block';
                downloadBtn.disabled = false;
                setBgBtn.disabled = false;

            } catch (error) {
                alert(`An error occurred: ${error.message}`);
                console.error(error);
            } finally {
                loader.style.display = 'none';
                generateBtn.disabled = false;
            }
        }

        async function downloadAiImage() {
            if (!lastGeneratedImageUrl) return;
            const response = await fetch(lastGeneratedImageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `ai_img_seed_${lastGeneratedSeed}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        }

        function setAiImageAsBackground() {
            if (!lastGeneratedImageUrl) return;
            const img = new Image();
            img.crossOrigin = "anonymous"; // Important for loading from another domain
            img.onload = () => {
                currentImage = img;
                // Reset zoom/pan and calculate cover zoom
                const imageAspectRatio = img.width / img.height;
                const canvasAspectRatio = canvas.width / canvas.height;
                currentImageBaseCoverZoom = (imageAspectRatio > canvasAspectRatio) ? (canvas.height / img.height) : (canvas.width / img.width);
                imageOffsetX = 0;
                imageOffsetY = 0;
                document.getElementById('imageZoomSlider').value = 100;
                document.getElementById('zoomValue').textContent = '100%';
                drawThumbnail();
                closeAiModal();
            };
            img.onerror = () => alert('Failed to load image onto canvas.');
            // Add a cache-busting query param
            img.src = lastGeneratedImageUrl + `?t=${new Date().getTime()}`;
        }
