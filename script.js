   
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
            { id: 'text1', inputId: 'text1', colorId: 'color1', sizeId: 'size1', x: canvas.width * 0.5, y: canvas.height * 0.3, align: 'center', text: '', wrap: false, size: 100, color: '#0000ff',
              strokeColor: '#000000', strokeThickness: 2, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: false, shadowColor: 'rgba(0,0,0,0.7)', shadowBlur: 5, shadowOffsetX: 2, shadowOffsetY: 2 },
            { id: 'text2', inputId: 'text2', colorId: 'color2', sizeId: 'size2', x: canvas.width * 0.5, y: canvas.height * 0.5, align: 'center', text: '', wrap: false, size: 100, color: '#0000ff',
              strokeColor: '#000000', strokeThickness: 2, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: false, shadowColor: 'rgba(0,0,0,0.7)', shadowBlur: 5, shadowOffsetX: 2, shadowOffsetY: 2 },
            { id: 'text3', inputId: 'text3', colorId: 'color3', sizeId: 'size3', x: canvas.width * 0.5, y: canvas.height * 0.7, align: 'center', text: '', wrap: false, size: 100, color: '#0000ff',
              strokeColor: '#000000', strokeThickness: 2, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: false, shadowColor: 'rgba(0,0,0,0.7)', shadowBlur: 5, shadowOffsetX: 2, shadowOffsetY: 2 },
            { id: 'text4', inputId: 'text4', colorId: 'color4', sizeId: 'size4', x: canvas.width * 0.5, y: canvas.height * 0.85, align: 'center', text: '', wrap: false, size: 100, color: '#0000ff',
              strokeColor: '#000000', strokeThickness: 2, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: false, shadowColor: 'rgba(0,0,0,0.7)', shadowBlur: 5, shadowOffsetX: 2, shadowOffsetY: 2 } // Line 4 often wraps
        ];
        // Add font loading check
        const font = new FontFace('Berlin Sans FB Demi Bold', 'url(fonts/BRLNSDB.woff)');
        font.load().then(function(loadedFont) {
            document.fonts.add(loadedFont);
            console.log('Berlin Sans FB Demi Bold font loaded.');
            // Initialize textElements with default values before first setLayout
            textElements.forEach((el, index) => {
                el.text = document.getElementById(el.inputId).value;
                el.color = document.getElementById(el.colorId).value;
                el.size = parseFloat(document.getElementById(el.sizeId).value);
                // Initial X, Y will be set by setLayout
            });
            updateColorPreviews();
            setLayout(1); // Sets initial layout, text, positions, and calls drawThumbnail
        }).catch(function(error) {
            console.error("Font could not be loaded: ", error);
            updateColorPreviews();
            setLayout(1);
        });
        

        // Set canvas dimensions
        canvas.width = 1920;
        canvas.height = 1080;

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
                    bgColorInput.value = `#${parseInt(rgbaMatch[1]).toString(16).padStart(2,'0')}${parseInt(rgbaMatch[2]).toString(16).padStart(2,'0')}${parseInt(rgbaMatch[3]).toString(16).padStart(2,'0')}`;
                    const alpha = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;
                    bgAlphaInput.value = Math.round(alpha * 100);
                    bgAlphaValueSpan.textContent = `${Math.round(alpha * 100)}%`;
                } else { // Fallback if not rgba (e.g. hex from picker initially)
                    bgColorInput.value = el.bgColor; // This might be just a hex
                    bgAlphaInput.value = el.bgColor.startsWith('#') && el.bgColor.length > 7 ? parseInt(el.bgColor.substring(7,9), 16) / 255 * 100 : (el.bgColor === 'transparent' ? 0 : 100) ; // crude alpha from hex
                    bgAlphaValueSpan.textContent = `${Math.round(bgAlphaInput.value)}%`;
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
                    let wrapMaxWidth = canvas.width * 0.96;
                    if (align === 'left') wrapMaxWidth = canvas.width - x - (canvas.width * 0.02);
                    else if (align === 'right') wrapMaxWidth = x - (canvas.width * 0.02);
                    else wrapMaxWidth = canvas.width * 0.96;
                    wrapMaxWidth = Math.max(50, wrapMaxWidth);
                    actualRenderedLines = wrapText(ctx, text, x, y, wrapMaxWidth, lineHeight);
                    // For wrapped text, the width might be the wrapMaxWidth or the longest line
                    textWidth = 0;
                    actualRenderedLines.forEach(line => {
                        textWidth = Math.max(textWidth, ctx.measureText(line.trim()).width);
                    });
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

            // Handle Text Elements
            layoutPreset.text.forEach((preset, index) => {
                const el = textElements[index];
                if (preset) {
                    el.x = preset.x;
                    el.y = preset.y;
                    el.align = preset.align;
                    el.wrap = preset.wrap || false;
                    el.color = preset.color || '#FFFFFF';
                    el.strokeColor = preset.strokeColor || '#000000';
                    el.strokeThickness = preset.strokeThickness !== undefined ? preset.strokeThickness : 0;
                    el.bgColor = preset.bgColor || 'rgba(255,255,255,0)';
                    el.bgFullWidth = preset.bgFullWidth || false;
                    el.bgPadding = preset.bgPadding !== undefined ? preset.bgPadding : 10;
                    el.shadowEnabled = preset.shadowEnabled || false;
                    el.shadowColor = preset.shadowColor || 'rgba(0,0,0,0.5)';
                    el.shadowBlur = preset.shadowBlur !== undefined ? preset.shadowBlur : 0;
                    el.shadowOffsetX = preset.shadowOffsetX !== undefined ? preset.shadowOffsetX : 0;
                    el.shadowOffsetY = preset.shadowOffsetY !== undefined ? preset.shadowOffsetY : 0;
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
        document.querySelectorAll('input[type="text"], input[type="number"], textarea, input[type="range"], input[type="color"], input[type="checkbox"]').forEach(input => {
            input.addEventListener('input', function(e) {
                const targetId = e.target.id;
                let redrawNeeded = true;

                // Extracts prefix and number from id like "text1", "bgColor2", "shadowEnabled3"
                const match = targetId.match(/([a-zA-Z]+)(\d+)/);
                if (match) {
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
                        }
                    }
                }

                // Handle general controls not tied to a specific textElement index
                if (targetId === 'imageOpacity') {
                    document.getElementById('opacityValue').textContent = e.target.value + '%';
                } else if (targetId === 'imageZoomSlider') {
                    document.getElementById('zoomValue').textContent = e.target.value + '%';
                } else if (targetId === 'canvasBgColor') {
                    // This will be redrawn by drawThumbnail() anyway
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
            const newObject = {
                id: objectIdCounter,
                type: type,
                x: canvas.width / 2,
                y: canvas.height / 2,
                width: 300,
                height: 300,
                rotation: 0,
                // Default styles
                stroke: '#000000',
                strokeWidth: 5,
                shadow: { enabled: false, color: '#000000', blur: 5, offsetX: 5, offsetY: 5 },
                ...options // Overwrite defaults with specific options from the button click
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


        function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
            const words = text.split(' ');
            let line = '';
            const lines = [];

            for(let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;

                if (testWidth > maxWidth && n > 0) {
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
            const canvasBgColor = document.getElementById('canvasBgColor').value;
            ctx.fillStyle = canvasBgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (currentImage) {
                const sliderValue = parseFloat(document.getElementById('imageZoomSlider').value);
                const sliderZoomFactor = sliderValue / 100;

                // This is the scale factor of the original image to its displayed size on canvas
                const renderedImageScale = currentImageBaseCoverZoom * sliderZoomFactor;

                // Destination Dimensions (dw, dh) on the canvas
                // These are calculated by scaling the original image dimensions.
                // This inherently preserves the image's aspect ratio.
                const dw = currentImage.width * renderedImageScale;
                const dh = currentImage.height * renderedImageScale;

                // Destination Position (dx, dy) on the canvas
                // This centers the image and applies the total accumulated pan from dragging.
                const dx = (canvas.width - dw) / 2 + imageOffsetX;
                const dy = (canvas.height - dh) / 2 + imageOffsetY;

                // Source Rectangle (sx, sy, sw, sh) from the original image
                // This defines what portion of the source image to draw.
                // It's effectively the canvas viewport translated into source image coordinates.
                let sx = -imageOffsetX / renderedImageScale;
                let sy = -imageOffsetY / renderedImageScale;
                // Adjust sx, sy so they are relative to the top-left of the *centered* source image part
                // that would be shown if there were no panning and dw,dh were canvas.width, canvas.height
                sx += (currentImage.width - (canvas.width / renderedImageScale)) / 2;
                sy += (currentImage.height - (canvas.height / renderedImageScale)) / 2;

                let sw = canvas.width / renderedImageScale;
                let sh = canvas.height / renderedImageScale;

                // Clamp source rectangle to image bounds
                if (sx < 0) {
                    sw += sx; // Reduce width by the amount sx is negative
                    sx = 0;
                }
                if (sy < 0) {
                    sh += sy; // Reduce height by the amount sy is negative
                    sy = 0;
                }

                if (sx + sw > currentImage.width) {
                    sw = currentImage.width - sx;
                }
                if (sy + sh > currentImage.height) {
                    sh = currentImage.height - sy;
                }

                // Ensure sw and sh are not negative (can happen if image is smaller than canvas and panned far)
                sw = Math.max(0, sw);
                sh = Math.max(0, sh);


                if (sw > 0 && sh > 0) { // Only draw if there's a valid source area
                    ctx.drawImage(currentImage, sx, sy, sw, sh, dx, dy, dw, dh);
                }


                // Apply brightness filter (white overlay)
                const brightnessValue = document.getElementById('imageOpacity').value;
                if (brightnessValue !== "100") { // 100 means no change
                    const brightnessOpacity = (100 - parseFloat(brightnessValue)) / 100;
                    ctx.fillStyle = `rgba(255, 255, 255, ${brightnessOpacity})`;
                    // Apply brightness only over the drawn image area (dx, dy, dw, dh)
                    ctx.fillRect(dx, dy, dw, dh);
                }
            }

            textElements.forEach((el, index) => {
                const text = el.text || document.getElementById(el.inputId).value;
                const color = el.color || document.getElementById(el.colorId).value;
                const size = parseFloat(el.size || document.getElementById(el.sizeId).value); // Ensure size is a number
                const xPos = el.x;
                const yPos = el.y; // This Y is now the TOP of the text
                const alignment = el.align;
                const strokeColor = el.strokeColor;
                const strokeThickness = el.strokeThickness;
                const bgColor = el.bgColor; // This is now rgba string
                const bgFullWidth = el.bgFullWidth;
                const bgPadding = el.bgPadding;
                const shadowEnabled = el.shadowEnabled;
                const shadowColor = el.shadowColor;
                const shadowBlur = el.shadowBlur;
                const shadowOffsetX = el.shadowOffsetX;
                const shadowOffsetY = el.shadowOffsetY;

                ctx.font = `bold ${size}px "Berlin Sans FB Demi Bold"`;
                ctx.textAlign = alignment;
                ctx.textBaseline = 'top'; // CHANGED FROM 'middle' to 'top'


                const lineHeight = size * 1.2; // Recalculate line height based on actual size

                // --- 1. Draw Text Background (if any) ---
                if (bgColor !== 'rgba(255,255,255,0)' && !bgColor.endsWith(', 0)')) { // Check if not fully transparent
                    ctx.fillStyle = bgColor;
                    let bgX, bgY, bgW, bgH;
                    let textBlockVisualWidth = 0;
                    let textBlockVisualHeight = 0; // This will be the height of the actual text glyphs

                    const lines = [];
                    if (el.wrap) {
                        let wrapMaxWidthCalc = canvas.width * 0.9; // Simplified for measurement
                        if (alignment === 'left') wrapMaxWidthCalc = canvas.width - xPos - (canvas.width * 0.02);
                        else if (alignment === 'right') wrapMaxWidthCalc = xPos - (canvas.width * 0.02);
                        else wrapMaxWidthCalc = canvas.width * 0.8;
                        wrapMaxWidthCalc = Math.max(50, wrapMaxWidthCalc);

                        const wrappedLines = wrapText(ctx, text, xPos, yPos, wrapMaxWidthCalc, lineHeight);
                        wrappedLines.forEach(line => {
                            lines.push(line.trim());
                            textBlockVisualWidth = Math.max(textBlockVisualWidth, ctx.measureText(line.trim()).width);
                        });
                        // For height, it's number of lines * font size, plus (n-1)*leading
                        // A simpler approximation for visual height:
                        textBlockVisualHeight = lines.length * size;
                        if (lines.length > 1) {
                            textBlockVisualHeight += (lines.length - 1) * (lineHeight - size); // Add inter-line spacing
                        }

                    } else {
                        lines.push(text);
                        textBlockVisualWidth = ctx.measureText(text).width;
                        textBlockVisualHeight = size; // For a single line, visual height is approx. the font size
                    }
                    
                    // Ensure minimum dimensions if text is empty but background is on
                    if (text.trim() === "") {
                        textBlockVisualWidth = size / 2; // Arbitrary small width for empty text
                        textBlockVisualHeight = size;
                    }


                    if (bgFullWidth) {
                        bgX = 0;
                        bgW = canvas.width;
                        // yPos is the top of the text. Background Y starts padding amount above it.
                        bgY = yPos - bgPadding;
                        // Background height is text visual height + padding on top & bottom.
                        bgH = textBlockVisualHeight + (bgPadding * 2);
                    } else {
                        if (alignment === 'left')    bgX = xPos - bgPadding;
                        else if (alignment === 'right') bgX = xPos - textBlockVisualWidth - bgPadding;
                        else /* center */            bgX = xPos - (textBlockVisualWidth / 2) - bgPadding;
                        
                        bgY = yPos - bgPadding;
                        bgW = textBlockVisualWidth + (bgPadding * 2);
                        bgH = textBlockVisualHeight + (bgPadding * 2);
                    }
                    ctx.fillRect(bgX, bgY, bgW, bgH);
                }

                if (shadowEnabled) {
                    ctx.shadowColor = shadowColor;
                    ctx.shadowBlur = shadowBlur;
                    ctx.shadowOffsetX = shadowOffsetX;
                    ctx.shadowOffsetY = shadowOffsetY;
                }


                if (el.wrap) {
                    let wrapMaxWidth = canvas.width * 0.9;
                    if (alignment === 'left') {
                        wrapMaxWidth = canvas.width - xPos - (canvas.width * 0.02);
                    } else if (alignment === 'right') {
                        wrapMaxWidth = xPos - (canvas.width * 0.02);
                    } else {
                        wrapMaxWidth = canvas.width * 0.8;
                    }
                    wrapMaxWidth = Math.max(50, wrapMaxWidth);

                    // Pass yPos directly as the starting Y for the first line.
                    // wrapText itself doesn't need to know about baseline, it just returns lines of text.
                    const wrappedLines = wrapText(ctx, text, xPos, yPos, wrapMaxWidth, lineHeight);
                    
                    // Since textBaseline is 'top', yPos is already the top of the first line.
                    // We just iterate and increment Y for subsequent lines.
                    wrappedLines.forEach((textLine, lineIndex) => {
                        const currentY = yPos + (lineIndex * lineHeight);
                        if (strokeThickness > 0) {
                            ctx.strokeStyle = strokeColor;
                            ctx.lineWidth = strokeThickness;
                            ctx.strokeText(textLine.trim(), xPos, currentY);
                        }
                        ctx.fillStyle = color;
                        ctx.fillText(textLine.trim(), xPos, currentY);
                    });
                } else {
                    // Single line text, yPos is its top
                    if (strokeThickness > 0) {
                        ctx.strokeStyle = strokeColor;
                        ctx.lineWidth = strokeThickness;
                        ctx.strokeText(text, xPos, yPos);
                    }
                    ctx.fillStyle = color;
                    ctx.fillText(text, xPos, yPos);
                }
                if (shadowEnabled) {
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                }



            });
            // PASTE THIS CODE BLOCK into drawThumbnail()

            // 3. Draw All Canvas Objects
            canvasObjects.forEach(obj => {
                ctx.save();
                // Apply shadow if enabled
                if (obj.shadow && obj.shadow.enabled) {
                    ctx.shadowColor = obj.shadow.color;
                    ctx.shadowBlur = obj.shadow.blur;
                    ctx.shadowOffsetX = obj.shadow.offsetX;
                    ctx.shadowOffsetY = obj.shadow.offsetY;
                }
                
                // Translate and rotate for all objects
                ctx.translate(obj.x, obj.y);
                ctx.rotate(obj.rotation * Math.PI / 180);

                // Call the correct drawing function based on type
                switch (obj.type) {
                    case 'shape': drawShape(obj); break;
                    case 'image': drawImageObject(obj); break;
                    case 'text': drawTextSnippet(obj); break;
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


        // PASTE THIS ENTIRE BLOCK of new functions into script.js



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

        function drawTextSnippet(obj) {
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

        // PASTE THIS LINE at the very end of script.js
document.getElementById('object-properties-panel').addEventListener('input', handleObjectPropertyChange);