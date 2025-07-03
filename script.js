// ADD THIS
        let activeSnippetStyleId = null; // For the two-step snippet adder
        // Updated list of fonts to load locally, based on user-provided list
        const fontFileNames = [
            "Abril Fatface.ttf", "Aclonica Regular.ttf", "Acme Regular.ttf", "ADLaM Display Regular.ttf", "Afacad Regular.ttf",
            "Agbalumo Regular.ttf", "Akronim Regular.ttf", "Alata Regular.ttf", "Alexandria Regular.ttf", "Alfa Slab One Regular.ttf",
            "Alkatra Regular.ttf", "Almendra Display Regular.ttf", "Alumni Sans Regular.ttf", "Amethysta Regular.ttf",
            "Amiko Regular.ttf", "Annapurna SIL.ttf", "Anta Regular.ttf", "AR One Sans Regular.ttf", "Audiowide Regular.ttf",
            "Bagel Fat One Regular.ttf", "Bakbak One Regular.ttf", "Bangers Regular.ttf", "Barriecito Regular.ttf",
            "Barrio Regular.ttf", "Berkshire Swash Regular.ttf", "Black And White Picture Regular.ttf", "Black Ops One Regular.ttf",
            "Blaka Hollow Regular.ttf", "Bonbon Regular.ttf", "BRLNSDB.woff", "Butcherman Regular.ttf", "Caesar Dressing.ttf",
            "Chokokutai Regular.ttf", "Eater.ttf", "Emblema One.ttf", "Fascinate.ttf",
            "Faster One Regular.ttf", "Federo.ttf", "Frijole.ttf", "Fugaz One.ttf", "Gabarito Regular.ttf", "Geostar Fill.ttf",
            "Geostar.ttf", "Goblin One.ttf", "Gochi Hand.ttf", "Hachi Maru Pop Regular.ttf", "Hahmlet Regular.ttf",
            "Hedvig Letters Sans Regular.ttf", "Hedvig Letters Serif 24pt Regular.ttf", "Honk Regular.ttf",
            "Ingrid Darling Regular.ttf", "Jacquarda Bastarda 9 Regular.ttf", "Kablammo Regular.ttf", "Kalnia Regular.ttf",
            "Kay Pho Du.ttf", "Kdam Thmor Pro Regular.ttf", "Kode Mono Regular.ttf", "Radio Canada Bold.ttf",
            "Radio Canada Regular.ttf", "Roboto (2).ttf", "Roboto.ttf", "Stint Ultra Condensed.ttf",
            "Stint Ultra Expanded.ttf", "Stoke Regular.ttf", "Strait Regular.ttf", "Style Script Regular.ttf",
            "Stylish Regular.ttf", "Sue Ellen Francisco .ttf", "SuezOne-Regular.ttf", "Sulphur Point Regular.ttf",
            "Sunshiney Regular.ttf", "Syncopate Regular.ttf", "Syne Tactile Regular.ttf", "Tilt Prism Regular.ttf",
            "Tilt Warp Regular.ttf", "Unbounded Regular.ttf", "Uncial Antiqua.ttf", "Underdog.ttf", "Unica One Regular.ttf",
            "UnifrakturCook.ttf", "UnifrakturMaguntia.ttf", "Urbanist Regular.ttf", "Vampiro One.ttf",
            "Vast Shadow Regular.ttf", "Viaoda Libre Regular.ttf", "Vidaloka .ttf", "Vina Sans Regular.ttf",
            "Vollkorn Regular.ttf", "Voltaire Regular.ttf", "VT323 Regular.ttf", "Wallpoet.ttf", "Walter Turncoat Regular.ttf",
            "Wire One Regular.ttf", "Workbench Regular.ttf", "Young Serif Regular.ttf", "Zen Kaku Gothic Antique Regular.ttf",
            "Zen Tokyo Zoo Regular.ttf", "Zhi Mang Xing Regular.ttf", "Zilla Slab.ttf"
            // Note: "CmAppIcons.ttf", "CupertinoIcons.ttf" are excluded as they are likely icon fonts.
        ];

        const localFontFamilies = fontFileNames.map(filename => {
            const nameWithoutExtension = filename.substring(0, filename.lastIndexOf('.'));
            // Use the nameWithoutExtension for the font-family name in CSS
            return { name: nameWithoutExtension, path: `fonts/${filename}`, familyName: nameWithoutExtension };
        });

        const canvas = document.getElementById('thumbnailCanvas');
        const ctx = canvas.getContext('2d');
        // ADD THIS CODE AT THE TOP OF script.js

        let G_successfullyLoadedFonts = []; // Global list for successfully loaded fonts
        let objectIdCounter = 0;

        // This array will hold all new draggable objects (shapes, images, text snippets)
        let canvasObjects = []; 
        let selectedObjectIndex = -1; // Index in canvasObjects of the selected item

        // State for background image filters
        let backgroundImageState = {
            brightness: 100,
            contrast: 100,
            saturate: 100,
            warmth: 100,
            exposure: 100,
            tintColor: '#FFBF00',
            tintStrength: 0,
            vignette: 0,
            zoom: 100,
            offsetX: 0,
            offsetY: 0,
            baseCoverZoom: 1
        };

        // This object will manage all drag operations
        let dragState = {
            isDragging: false,
            target: null,
            index: -1,
            startX: 0,
            startY: 0,
            elementStartX: 0,
            elementStartY: 0
        };

        let currentImage = null;
        let currentLayout = 1;

        let selectedLogo = {
            src: null,
            img: null,
            position: 'bottom-left',
            scale: 0.15,
            padding: 20
        };

        let currentImageBaseCoverZoom = 1;
        let imageOffsetX = 0;
        let imageOffsetY = 0;

        let textElements = [
            {}, {}, {}, {}
        ].map((el, i) => ({
            id: `text${i+1}`, inputId: `text${i+1}`, colorId: `color${i+1}`, sizeId: `size${i+1}`,
            x: canvas.width * 0.5, y: canvas.height * 0.3, align: 'center', text: '', wrap: false, size: 100,
            fontFamily: "\"Twemoji Country Flags\", 'Berlin Sans FB Demi Bold', sans-serif",
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

        Promise.all([
            // Ensure BRLNSDB.woff is loaded using its correct family name if it's 'Berlin Sans FB Demi Bold'
            new FontFace('Berlin Sans FB Demi Bold', 'url(fonts/BRLNSDB.woff)').load(),
            ...localFontFamilies.map(font => new FontFace(font.familyName, `url(${font.path})`).load())
        ]).then(loadedFonts => {
            loadedFonts.forEach(font => document.fonts.add(font));
            console.log('All local fonts attempted to load.');
            
            updateColorPreviews();
            setLayout(1);
            populateStylePresets();

            // Ensure dark mode is the default
            if (!document.body.classList.contains('dark-mode')) {
                document.body.classList.add('dark-mode');
            }
            // Call drawThumbnail directly AFTER theme is set and other initializations
            drawThumbnail();

        }).catch(function(error) {
            console.error("A font could not be loaded: ", error);
            updateColorPreviews();
            setLayout(1);
            populateStylePresets();
            // Ensure dark mode is the default even in case of error
            if (!document.body.classList.contains('dark-mode')) {
                document.body.classList.add('dark-mode');
            }
            drawThumbnail();
        });

        canvas.width = 1920;
        canvas.height = 1080;

        function populateStylePresets() {
            const galleries = document.querySelectorAll('.preset-gallery');
            galleries.forEach(gallery => {
                gallery.innerHTML = '';
                stylePresets.forEach(preset => {
                    const canvasEl = document.createElement('canvas');
                    canvasEl.width = 300;
                    canvasEl.height = 150;
                    canvasEl.className = 'preset-preview-canvas';
                    
                    const galleryId = gallery.id;

                    if (galleryId.startsWith('presets')) {
                        const textIndex = parseInt(galleryId.replace('presets', '')) - 1;
                        canvasEl.onclick = () => applyStylePreset(textIndex, preset.id);
                    } else {
                        canvasEl.onclick = () => selectSnippetStyle(preset.id);
                    }

                    gallery.appendChild(canvasEl);

                    const pCtx = canvasEl.getContext('2d');
                    const previewTextElement = {
                        ...preset,
                        text: 'Style',
                        size: 50,
                        x: canvasEl.width / 2,
                        y: canvasEl.height / 2,
                        align: 'center',
                        // Pass the canvas itself for context if needed by drawTextWithEffect's preview logic
                        _previewCanvas: canvasEl
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
            const textEl = textElements[elementIndex];
            Object.assign(textEl, preset);
            updateTextControlsFromState();
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

        function selectSnippetStyle(presetId) {
            activeSnippetStyleId = presetId;
            const preset = stylePresets.find(p => p.id === activeSnippetStyleId);
            if (!preset) return;

            const wordContainer = document.getElementById('snippet-word-choices');
            wordContainer.innerHTML = '';

            snippetWords.forEach(word => {
                const previewCanvas = document.createElement('canvas');
                previewCanvas.className = 'snippet-word-preview';
                previewCanvas.width = 300;
                previewCanvas.height = 120;
                previewCanvas.onclick = () => addStyledSnippet(word, preset);
                wordContainer.appendChild(previewCanvas);

                const pCtx = previewCanvas.getContext('2d');
                const previewTextElement = {
                    ...preset,
                    text: word,
                    size: 70,
                    x: previewCanvas.width / 2,
                    y: previewCanvas.height / 2,
                    align: 'center',
                    shadowEnabled: false,
                    strokeThickness: 0,
                    _previewCanvas: previewCanvas // Pass the canvas for context
                };

                const maxFontSize = 70;
                const minFontSize = 10;
                let fontSize = maxFontSize;
                pCtx.font = `bold ${fontSize}px ${previewTextElement.fontFamily.includes("Twemoji Country Flags") ? previewTextElement.fontFamily : `"Twemoji Country Flags", ${previewTextElement.fontFamily}`}`;
                let textWidth = pCtx.measureText(word).width;
                const padding = 20;

                while (textWidth > previewCanvas.width - padding && fontSize > minFontSize) {
                    fontSize -= 2;
                    pCtx.font = `bold ${fontSize}px ${previewTextElement.fontFamily.includes("Twemoji Country Flags") ? previewTextElement.fontFamily : `"Twemoji Country Flags", ${previewTextElement.fontFamily}`}`;
                    textWidth = pCtx.measureText(word).width;
                }

                const isDarkMode = document.body.classList.contains('dark-mode');
                pCtx.fillStyle = isDarkMode ? '#2a2a2a' : '#555';
                pCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

                const finalPreviewElement = {
                    ...preset,
                    text: word,
                    size: fontSize,
                    x: previewCanvas.width / 2,
                    y: previewCanvas.height / 2,
                    align: 'center',
                    _previewCanvas: previewCanvas // Pass the canvas for context
                };
                drawTextWithEffect(pCtx, finalPreviewElement);
            });

            document.getElementById('snippet-step1').style.display = 'none';
            document.getElementById('snippet-step2').style.display = 'block';
        }

        function addStyledSnippet(word, stylePreset) {
            if (!stylePreset) {
                console.error("No style preset provided to addStyledSnippet");
                return;
            }
            const snippetSize = stylePreset.size || 150;
            const styleOptions = { ...stylePreset, text: word, size: snippetSize };

            addObject('text', styleOptions);
            closeSnippetModal();
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
                document.getElementById(`strokeColor${i}`).value = el.strokeColor;
                document.getElementById(`strokeThickness${i}`).value = el.strokeThickness;
                
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

                document.getElementById(`fontFamily${i}`).value = el.fontFamily;
                if (el.advancedEffect) {
                    document.getElementById(`advancedEffectType${i}`).value = el.advancedEffect.type ?? 'none';
                    document.getElementById(`effectColor1_${i}`).value = el.advancedEffect.color1 ?? '#ff0000';
                    document.getElementById(`effectColor2_${i}`).value = el.advancedEffect.color2 ?? '#00ff00';
                    document.getElementById(`effectColor3_${i}`).value = el.advancedEffect.color3 ?? '#0000ff';
                    document.getElementById(`effectDistance${i}`).value = el.advancedEffect.distance ?? 10;
                    document.getElementById(`effectAngle${i}`).value = el.advancedEffect.angle ?? -45;
                    document.getElementById(`effectGlowSize${i}`).value = el.advancedEffect.glowSize ?? 20;
                    updateFxControlsVisibility(index);
                } else {
                    document.getElementById(`advancedEffectType${i}`).value = 'none';
                    updateFxControlsVisibility(index);
                }
            });
            updateColorPreviews();
        }

        function selectLogo(thumbElement, logoSrc) {
            document.querySelectorAll('.logo-thumb').forEach(thumb => thumb.classList.remove('active'));
            thumbElement.classList.add('active');
            selectedLogo.src = logoSrc;
            if (logoSrc) {
                const img = new Image();
                img.onload = () => { selectedLogo.img = img; drawThumbnail(); };
                img.onerror = () => { console.error(`Failed to load logo: ${logoSrc}`); selectedLogo.img = null; drawThumbnail(); };
                img.src = logoSrc;
            } else {
                selectedLogo.img = null;
                drawThumbnail();
            }
        }

        function setLogoPosition(position) {
            document.querySelectorAll('.logo-pos-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            selectedLogo.position = position;
            drawThumbnail();
        }

        document.getElementById('logoScale').addEventListener('input', function(e) {
            const scalePercent = e.target.value;
            document.getElementById('logoScaleValue').textContent = `${scalePercent}%`;
            selectedLogo.scale = parseFloat(scalePercent) / 100;
            drawThumbnail();
        });

        function toggleControlVisibility(button, elementId) {
            const controlDiv = document.getElementById(elementId);
            const isVisible = controlDiv.classList.contains('show');
            const group = button.closest('.text-input-group');
            group.querySelectorAll('.collapsible-controls').forEach(div => div.classList.remove('show'));
            group.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
            if (!isVisible) {
                controlDiv.classList.add('show');
                button.classList.add('active');
            }
        }

        function updateColorPreviews() {
            for(let i = 1; i <= 4; i++) {
                const color = document.getElementById(`color${i}`).value;
                document.getElementById(`preview${i}`).style.backgroundColor = color;
            }
        }

        document.querySelectorAll('input[type="color"]').forEach(input => {
            input.addEventListener('input', updateColorPreviews);
        });

        function exportLayoutToClipboard() {
            let output = "{\n";
            output += "    text: [\n";
            textElements.forEach((el, index) => {
                let elementString = "        {\n";
                elementString += `            x: ${Math.round(el.x)}, y: ${Math.round(el.y)}, align: '${el.align}', wrap: ${el.wrap},\n`;
                elementString += `            color: '${el.color}',\n`;
                elementString += `            strokeColor: '${el.strokeColor}', strokeThickness: ${el.strokeThickness},\n`;
                elementString += `            bgColor: '${el.bgColor}', bgFullWidth: ${el.bgFullWidth}, bgPadding: ${el.bgPadding},\n`;
                elementString += `            shadowEnabled: ${el.shadowEnabled}, shadowColor: '${el.shadowColor}', shadowBlur: ${el.shadowBlur}, shadowOffsetX: ${el.shadowOffsetX}, shadowOffsetY: ${el.shadowOffsetY}\n`;
                elementString += "        }";
                if (index < textElements.length - 1) { elementString += ",\n"; } else { elementString += "\n"; }
                output += elementString;
            });
            output += "    ],\n";
            const logoSrcValue = selectedLogo.src ? `'${selectedLogo.src}'` : 'null';
            output += "    logo: { ";
            output += `src: ${logoSrcValue}, `;
            output += `position: '${selectedLogo.position}', `;
            output += `scale: ${selectedLogo.scale.toFixed(2)} `;
            output += "}\n";
            output += "}";
            navigator.clipboard.writeText(output).then(() => {
                const feedbackDiv = document.getElementById('copy-feedback');
                feedbackDiv.textContent = 'Layout code copied to clipboard!';
                setTimeout(() => { feedbackDiv.textContent = ''; }, 3000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                const feedbackDiv = document.getElementById('copy-feedback');
                feedbackDiv.textContent = 'Failed to copy. See console for error.';
                setTimeout(() => { feedbackDiv.textContent = ''; }, 3000);
            });
        }

        function getTextElementAt(mouseX, mouseY) {
            for (let i = textElements.length - 1; i >= 0; i--) {
                const el = textElements[i];
                const text = el.text || document.getElementById(el.inputId).value;
                if (!text) continue;
                const size = parseFloat(el.size || document.getElementById(el.sizeId).value);
                const x = el.x;
                const y = el.y;
                const align = el.align;
                ctx.font = `bold ${size}px "Berlin Sans FB Demi Bold"`;
                let textWidth = ctx.measureText(text).width;
                const lineHeight = size * 1.2;
                let actualRenderedLines = [text];
                if (el.wrap) {
                    actualRenderedLines = wrapText(ctx, text, x, y, canvas.width * 0.96, lineHeight, align, x, canvas.width);
                    textWidth = 0;
                    actualRenderedLines.forEach(line => {
                        textWidth = Math.max(textWidth, ctx.measureText(line.trim()).width);
                    });
                } else {
                    textWidth = ctx.measureText(text).width;
                }
                const textHeight = actualRenderedLines.length * lineHeight;
                let x1, x2;
                if (align === 'left') { x1 = x; x2 = x + textWidth; }
                else if (align === 'right') { x1 = x - textWidth; x2 = x; }
                else { x1 = x - textWidth / 2; x2 = x + textWidth / 2; }
                const y1 = y;
                const y2 = y + textHeight;
                const buffer = 10;
                if (mouseX >= x1 - buffer && mouseX <= x2 + buffer && 
                    mouseY >= y1 - buffer && mouseY <= y2 + buffer) {
                    return i;
                }
            }
            return -1;
        }

        canvas.addEventListener('mousedown', (e) => {
            const { x, y } = getCanvasMousePos(e);
            const clickedObjectIndex = getObjectAt(x, y);
            if (clickedObjectIndex > -1) {
                dragState.isDragging = true;
                dragState.target = 'object';
                dragState.index = clickedObjectIndex;
                selectObject(clickedObjectIndex);
                dragState.startX = x;
                dragState.startY = y;
                dragState.elementStartX = canvasObjects[clickedObjectIndex].x;
                dragState.elementStartY = canvasObjects[clickedObjectIndex].y;
                canvas.style.cursor = 'move';
                return;
            }
            const clickedTextIndex = getTextElementAt(x, y);
            if (clickedTextIndex > -1) {
                dragState.isDragging = true;
                dragState.target = 'text';
                dragState.index = clickedTextIndex;
                deselectAll();
                dragState.startX = x;
                dragState.startY = y;
                dragState.elementStartX = textElements[clickedTextIndex].x;
                dragState.elementStartY = textElements[clickedTextIndex].y;
                canvas.style.cursor = 'move';
                return;
            }
            if (currentImage) {
                dragState.isDragging = true;
                dragState.target = 'background';
                deselectAll();
                dragState.startX = x;
                dragState.startY = y;
                dragState.elementStartX = imageOffsetX;
                dragState.elementStartY = imageOffsetY;
                canvas.style.cursor = 'grabbing';
            }
        });

        function applyLogoPreset(preset) {
            if (!preset) return;
            selectedLogo.src = preset.src;
            selectedLogo.position = preset.position;
            selectedLogo.scale = preset.scale;
            selectedLogo.img = null;
            const scalePercent = preset.scale * 100;
            document.getElementById('logoScale').value = scalePercent;
            document.getElementById('logoScaleValue').textContent = `${scalePercent}%`;
            document.querySelectorAll('.logo-pos-btn').forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.querySelector(`.logo-pos-btn[onclick="setLogoPosition('${preset.position}')"]`);
            if (activeBtn) activeBtn.classList.add('active');
            document.querySelectorAll('.logo-thumb').forEach(thumb => thumb.classList.remove('active'));
            const activeThumbSelector = preset.src ? `.logo-thumb[onclick="selectLogo(this, '${preset.src}')"]` : `.logo-thumb[onclick="selectLogo(this, null)"]`;
            const activeThumb = document.querySelector(activeThumbSelector);
            if (activeThumb) activeThumb.classList.add('active');
            if (preset.src) {
                const img = new Image();
                img.onload = () => { selectedLogo.img = img; drawThumbnail(); };
                img.onerror = () => { console.error(`Failed to load logo from preset: ${preset.src}`); drawThumbnail(); };
                img.src = preset.src;
            }
        }

        function setLayout(layout) {
            currentLayout = layout;
            const layoutPreset = getLayoutPositions(layout);
            const defaultTextElement = {
                fontFamily: "\"Twemoji Country Flags\", 'Berlin Sans FB Demi Bold', sans-serif", color: '#FFFFFF',
                strokeColor: '#000000', strokeThickness: 0,
                bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10,
                shadowEnabled: false, shadowColor: 'rgba(0,0,0,0.7)', shadowBlur: 5, shadowOffsetX: 2, shadowOffsetY: 2,
                advancedEffect: { type: 'none', color1: '#ff0000', color2: '#00ff00', color3: '#0000ff', distance: 10, angle: -45, glowSize: 20 }
            };
            layoutPreset.text.forEach((preset, index) => {
                if (textElements[index] && preset) {
                    const currentText = textElements[index].text;
                    const currentSize = textElements[index].size;
                    const newElementState = { ...defaultTextElement, ...preset };
                    // Preserve existing fontFamily if preset doesn't specify one, otherwise use preset's (which might include Twemoji or not)
                    if (preset.fontFamily) {
                        newElementState.fontFamily = preset.fontFamily.startsWith('"Twemoji Country Flags"') ? preset.fontFamily : `"Twemoji Country Flags", ${preset.fontFamily}`;
                    } else {
                        newElementState.fontFamily = textElements[index].fontFamily.startsWith('"Twemoji Country Flags"') ? textElements[index].fontFamily : `"Twemoji Country Flags", ${textElements[index].fontFamily}`;
                    }
                    Object.assign(textElements[index], newElementState);
                    if (!preset.text) textElements[index].text = currentText;
                    if (!preset.size) textElements[index].size = currentSize;
                }
            });
            applyLogoPreset(layoutPreset.logo);
            switch(layout) {
                case 1:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 160;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 160;
                    textElements[2].text = '{Date} - Pt 1'; textElements[2].size = 160;
                    textElements[3].text = 'HITS, STRIKES, LOSSES, OTHER'; textElements[3].size = 100;
                    break;
                case 2:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 160;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 160;
                    textElements[2].text = '{Date} - Pt 2'; textElements[2].size = 160;
                    textElements[3].text = 'MILITARY AID'; textElements[3].size = 100;
                    break;
                case 3:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 160;
                    textElements[1].text = 'NEWS UPDATE'; textElements[1].size = 160;
                    textElements[2].text = '{Date} - Pt 3'; textElements[2].size = 160;
                    textElements[3].text = 'GEOPOLITICAL NEWS'; textElements[3].size = 100;
                    break;
                case 4:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 125;
                    textElements[1].text = 'UPDATE EXTRA'; textElements[1].size = 125;
                    textElements[2].text = 'YOUR VIDEO HEADLINE'; textElements[2].size = 160;
                    textElements[3].text = 'ALL ABOUT YOUR VIDEO GOES HERE'; textElements[3].size = 120;
                    break;
                case 5:
                    textElements[0].text = 'UKRAINE WAR'; textElements[0].size = 160;
                    textElements[1].text = 'UPDATE'; textElements[1].size = 160;
                    textElements[2].text = 'FULL FRONTLINE'; textElements[2].size = 160;
                    textElements[3].text = '3-DAY UPDATE'; textElements[3].size = 120;
                    break;
                case 6:
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
                default:
                    if (!textElements[0].text) { textElements[0].text = "TITLE"; textElements[0].size = 160; }
                    if (!textElements[1].text) { textElements[1].text = "SUBTITLE"; textElements[1].size = 160; }
                    if (!textElements[2].text) { textElements[2].text = "DATE"; textElements[2].size = 160; }
                    if (!textElements[3].text) { textElements[3].text = "DETAILS"; textElements[3].size = 100; }
                    break;
            }
            updateDateIfNeeded(layout);
            updateTextControlsFromState();
            drawThumbnail();
        }

        function updateDateIfNeeded(layout) {
            if ([1, 2, 3].includes(layout)) {
                const currentText3 = document.getElementById('text3').value;
                if (currentText3.includes('{Date}')) {
                     setDate(currentText3);
                }
            } else if (document.getElementById('text3').value.includes('{Date}')) {
                setDate(document.getElementById('text3').value);
            }
        }
            
        function setTitle(title) {
            textElements[0].text = title;
            document.getElementById('text1').value = title;
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

        function updateDate() {
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const now = new Date();
            const month = months[now.getMonth()];
            const day = String(now.getDate()).padStart(2, '0');
            const currentDatePart = `${month}-${day}`;
            const currentText3Value = textElements[2].text || "";
            let newText3 = currentDatePart;
            if (currentText3Value.includes(" - Pt 1")) newText3 += " - Pt 1";
            else if (currentText3Value.includes(" - Pt 2")) newText3 += " - Pt 2";
            else if (currentText3Value.includes(" - Pt 3")) newText3 += " - Pt 3";
            setDate(newText3);
        }

        function updateDateIfNeeded(layout) {
            if (textElements[2].text && textElements[2].text.includes('{Date}')) {
                 setDate(textElements[2].text);
            }
        }

        function setTextAlignment(elementIndex, newAlign) {
            if (textElements[elementIndex]) {
                textElements[elementIndex].align = newAlign;
                const textEl = textElements[elementIndex];
                const textContent = textEl.text;
                const fontSize = textEl.size || document.getElementById(textEl.sizeId).value;
                ctx.font = `bold ${fontSize}px "Berlin Sans FB Demi Bold"`;
                const textMetrics = ctx.measureText(textContent);
                const textWidth = textMetrics.width;
                const margin = canvas.width * 0.02;
                if (newAlign === 'left') { textEl.x = margin; }
                else if (newAlign === 'center') { textEl.x = canvas.width / 2; }
                else if (newAlign === 'right') { textEl.x = canvas.width - margin; }
                document.getElementById(`x${elementIndex + 1}`).value = Math.round(textEl.x);
                drawThumbnail();
            }
        }

        document.getElementById('imageInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = new Image();
                    img.onload = function() {
                        currentImage = img;
                        const imageAspectRatio = currentImage.width / currentImage.height;
                        const canvasAspectRatio = canvas.width / canvas.height;
                        if (imageAspectRatio > canvasAspectRatio) {
                            currentImageBaseCoverZoom = canvas.height / currentImage.height;
                        } else {
                            currentImageBaseCoverZoom = canvas.width / currentImage.width;
                        }
                        imageOffsetX = 0;
                        imageOffsetY = 0;
                        document.getElementById('imageZoomSlider').value = 100;
                        document.getElementById('zoomValue').textContent = '100%';
                        drawThumbnail();
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', function(e) {
                const targetId = e.target.id;
                let redrawNeeded = true;
                const match = targetId.match(/^([a-zA-Z]+)(\d+)$/);
                const fxMatch = targetId.match(/^(effectColor|effectDistance|effectAngle|effectGlowSize|advancedEffectType|fontFamily)(\d+)?_?(\d*)$/);

                if (fxMatch) {
                    const prefix = fxMatch[1];
                    const elementIndex = parseInt(fxMatch[3] || fxMatch[2]) - 1;
                    if (elementIndex >= 0 && textElements[elementIndex]) {
                        const el = textElements[elementIndex];
                        switch (prefix) {
                            case 'fontFamily': el.fontFamily = e.target.value; break;
                            case 'advancedEffectType': el.advancedEffect.type = e.target.value; updateFxControlsVisibility(elementIndex); break;
                            case 'effectColor': const colorNum = fxMatch[2]; el.advancedEffect[`color${colorNum}`] = e.target.value; break;
                            case 'effectDistance': el.advancedEffect.distance = parseFloat(e.target.value); break;
                            case 'effectAngle': el.advancedEffect.angle = parseFloat(e.target.value); break;
                            case 'effectGlowSize': el.advancedEffect.glowSize = parseFloat(e.target.value); break;
                        }
                    }
                } else if (match) {
                    const prefix = match[1];
                    const elementIndex = parseInt(match[2]) - 1;
                    if (elementIndex >= 0 && textElements[elementIndex]) {
                        switch (prefix) {
                            case 'text': textElements[elementIndex].text = e.target.value; break;
                            case 'size': textElements[elementIndex].size = parseFloat(e.target.value); break;
                            case 'color': textElements[elementIndex].color = e.target.value; updateColorPreviews(); break;
                            case 'x': textElements[elementIndex].x = parseFloat(e.target.value); break;
                            case 'y': textElements[elementIndex].y = parseFloat(e.target.value); break;
                            case 'strokeColor': textElements[elementIndex].strokeColor = e.target.value; break;
                            case 'strokeThickness': textElements[elementIndex].strokeThickness = parseFloat(e.target.value); break;
                            case 'bgColor': {
                                const newColorHex = e.target.value;
                                const currentAlpha = parseFloat(document.getElementById(`bgAlpha${elementIndex + 1}`).value) / 100;
                                const r = parseInt(newColorHex.slice(1, 3), 16);
                                const g = parseInt(newColorHex.slice(3, 5), 16);
                                const b = parseInt(newColorHex.slice(5, 7), 16);
                                textElements[elementIndex].bgColor = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
                                } break;
                            case 'bgAlpha': {
                                const newAlpha = parseFloat(e.target.value) / 100;
                                document.getElementById(`bgAlphaValue${elementIndex + 1}`).textContent = `${Math.round(newAlpha * 100)}%`;
                                const rgbaMatchOld = textElements[elementIndex].bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                                if (rgbaMatchOld) {
                                    textElements[elementIndex].bgColor = `rgba(${rgbaMatchOld[1]}, ${rgbaMatchOld[2]}, ${rgbaMatchOld[3]}, ${newAlpha})`;
                                } else {
                                    const hexColor = document.getElementById(`bgColor${elementIndex + 1}`).value;
                                    const r = parseInt(hexColor.slice(1, 3), 16);
                                    const g = parseInt(hexColor.slice(3, 5), 16);
                                    const b = parseInt(hexColor.slice(5, 7), 16);
                                    textElements[elementIndex].bgColor = `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
                                }
                                } break;
                            case 'bgFullWidth': textElements[elementIndex].bgFullWidth = e.target.checked; break;
                            case 'bgPadding': textElements[elementIndex].bgPadding = parseFloat(e.target.value); break;
                            case 'shadowEnabled': textElements[elementIndex].shadowEnabled = e.target.checked; break;
                            case 'shadowColor': {
                                const newColorHex = e.target.value;
                                const currentAlpha = parseFloat(document.getElementById(`shadowAlpha${elementIndex + 1}`).value) / 100;
                                const r = parseInt(newColorHex.slice(1, 3), 16);
                                const g = parseInt(newColorHex.slice(3, 5), 16);
                                const b = parseInt(newColorHex.slice(5, 7), 16);
                                textElements[elementIndex].shadowColor = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
                                } break;
                            case 'shadowAlpha': {
                                const newAlpha = parseFloat(e.target.value) / 100;
                                document.getElementById(`shadowAlphaValue${elementIndex + 1}`).textContent = `${Math.round(newAlpha * 100)}%`;
                                const shadowRgbaMatchOld = textElements[elementIndex].shadowColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                                if (shadowRgbaMatchOld) {
                                    textElements[elementIndex].shadowColor = `rgba(${shadowRgbaMatchOld[1]}, ${shadowRgbaMatchOld[2]}, ${shadowRgbaMatchOld[3]}, ${newAlpha})`;
                                } else {
                                    const hexColor = document.getElementById(`shadowColor${elementIndex + 1}`).value;
                                    const r = parseInt(hexColor.slice(1, 3), 16);
                                    const g = parseInt(hexColor.slice(3, 5), 16);
                                    const b = parseInt(hexColor.slice(5, 7), 16);
                                    textElements[elementIndex].shadowColor = `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
                                }
                                } break;
                            case 'shadowBlur': textElements[elementIndex].shadowBlur = parseFloat(e.target.value); break;
                            case 'shadowOffsetX': textElements[elementIndex].shadowOffsetX = parseFloat(e.target.value); break;
                            case 'shadowOffsetY': textElements[elementIndex].shadowOffsetY = parseFloat(e.target.value); break;
                        }
                    }
                }

                if (targetId === 'imageOpacity') { document.getElementById('opacityValue').textContent = e.target.value + '%'; }
                else if (targetId === 'imageZoomSlider') { document.getElementById('zoomValue').textContent = e.target.value + '%'; }
                else if (targetId === 'bg-brightness') { backgroundImageState.brightness = e.target.value; document.getElementById('bg-brightness-value').textContent = e.target.value + '%';}
                else if (targetId === 'bg-contrast') { backgroundImageState.contrast = e.target.value; document.getElementById('bg-contrast-value').textContent = e.target.value + '%';}
                else if (targetId === 'bg-saturate') { backgroundImageState.saturate = e.target.value; document.getElementById('bg-saturate-value').textContent = e.target.value + '%';
                } else if (targetId === 'bg-warmth') { backgroundImageState.warmth = e.target.value; document.getElementById('bg-warmth-value').textContent = e.target.value + '%';
                } else if (targetId === 'bg-exposure') { backgroundImageState.exposure = e.target.value; document.getElementById('bg-exposure-value').textContent = e.target.value + '%';
                } else if (targetId === 'bg-tint-color') { backgroundImageState.tintColor = e.target.value;
                } else if (targetId === 'bg-tint-strength') { backgroundImageState.tintStrength = e.target.value; document.getElementById('bg-tint-strength-value').textContent = e.target.value + '%';
                } else if (targetId === 'bg-vignette') { backgroundImageState.vignette = e.target.value; document.getElementById('bg-vignette-value').textContent = e.target.value + '%';
                }
                if (redrawNeeded) { drawThumbnail(); }
            });
        });

        document.querySelectorAll('input[id^="size"]').forEach(sizeInput => {
            sizeInput.addEventListener('wheel', function(e) {
                e.preventDefault();
                const direction = e.deltaY < 0 ? 1 : -1;
                let currentValue = parseInt(this.value, 10);
                const min = parseInt(this.min, 10) || 10;
                const max = parseInt(this.max, 10) || 500; // Updated max here too
                let newValue = currentValue + direction;
                if (newValue < min) { newValue = min; }
                if (newValue > max) { newValue = max; }
                this.value = newValue;
                this.dispatchEvent(new Event('input', { bubbles: true }));
            });
        });

        function updateColorPreviews() {
            for(let i = 1; i <= 4; i++) {
                const colorInput = document.getElementById(`color${i}`);
                const previewDiv = document.getElementById(`preview${i}`);
                if (colorInput && previewDiv) {
                    previewDiv.style.backgroundColor = colorInput.value;
                    if (textElements[i-1]) { textElements[i-1].color = colorInput.value; }
                }
            }
        }

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

        canvas.addEventListener('mouseup', () => {
            dragState.isDragging = false;
            dragState.target = null;
            canvas.style.cursor = 'default';
        });
        canvas.addEventListener('mouseleave', () => {
            if (dragState.isDragging) {
                // Consider onCanvasMouseUp() if it exists and is needed, or just reset:
                dragState.isDragging = false;
                dragState.target = null;
                canvas.style.cursor = 'default';
                // drawThumbnail(); // Optionally redraw if state might have changed on mouseleave + drag
            }
        });

        function getCanvasMousePos(e) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: (e.clientX - rect.left) * (canvas.width / rect.width),
                y: (e.clientY - rect.top) * (canvas.height / rect.height)
            };
        }

        function selectObject(index) {
            selectedObjectIndex = index;
            updateObjectPropertiesPanel();
            drawThumbnail();
        }

        function deselectAll() {
            if (selectedObjectIndex !== -1) {
                selectedObjectIndex = -1;
                document.getElementById('object-properties-panel').style.display = 'none';
                drawThumbnail();
            }
        }

        function getObjectAt(mouseX, mouseY) {
            for (let i = canvasObjects.length - 1; i >= 0; i--) {
                const obj = canvasObjects[i];
                const halfW = obj.width / 2;
                const halfH = obj.height / 2;
                if (mouseX >= obj.x - halfW && mouseX <= obj.x + halfW &&
                    mouseY >= obj.y - halfH && mouseY <= obj.y + halfH) {
                    return i;
                }
            }
            return -1;
        }

        function updateObjectPropertiesPanel() {
            const panel = document.getElementById('object-properties-panel');
            const contentDiv = document.getElementById('properties-content');
            if (selectedObjectIndex < 0) {
                panel.style.display = 'none';
                return;
            }
            const obj = canvasObjects[selectedObjectIndex];
            let html = '<div class="prop-grid">';
            if (obj.type === 'shape') {
                html += `<label for="obj-fill-color">Fill</label><input type="color" id="obj-fill-color" value="${obj.fill}">`;
            } else if (obj.type === 'text') {
                html += `<label for="obj-text-content">Text</label><input type="text" id="obj-text-content" value="${obj.text}">`;
                html += `<label for="obj-text-color">Color</label><input type="color" id="obj-text-color" value="${obj.color}">`;
                html += `<label for="obj-font-size">Size</label><input type="range" id="obj-font-size" min="20" max="400" value="${obj.size}">`;
            }
            html += `<label for="obj-stroke-color">Stroke</label><input type="color" id="obj-stroke-color" value="${obj.stroke}">`;
            html += `<label for="obj-stroke-width">Stroke Width</label><input type="range" id="obj-stroke-width" min="0" max="50" value="${obj.strokeWidth}">`;
            html += `<label for="obj-shadow-enabled">Shadow</label><input type="checkbox" id="obj-shadow-enabled" ${obj.shadow.enabled ? 'checked' : ''}>`;
            html += `<label for="obj-shadow-color">Shadow Color</label><input type="color" id="obj-shadow-color" value="${obj.shadow.color}">`;
            html += `<label for="obj-shadow-blur">Shadow Blur</label><input type="range" id="obj-shadow-blur" min="0" max="50" value="${obj.shadow.blur}">`;
            html += '</div>';
            contentDiv.innerHTML = html;
            panel.style.display = 'block';
        }

        function handleObjectPropertyChange(e) {
            if (selectedObjectIndex < 0) return;
            const obj = canvasObjects[selectedObjectIndex];
            const { id, value, type, checked } = e.target;
            switch (id) {
                case 'obj-fill-color': obj.fill = value; break;
                case 'obj-text-content': obj.text = value; break;
                case 'obj-text-color': obj.color = value; break;
                case 'obj-font-size': obj.size = parseFloat(value); break;
                case 'obj-stroke-color': obj.stroke = value; break;
                case 'obj-stroke-width': obj.strokeWidth = parseFloat(value); break;
                case 'obj-shadow-enabled': obj.shadow.enabled = checked; break;
                case 'obj-shadow-color': obj.shadow.color = value; break;
                case 'obj-shadow-blur': obj.shadow.blur = parseFloat(value); break;
            }
            drawThumbnail();
        }

        function setupPositionInputListeners() { /* This function seems unused, consider removing or implementing */ }
        function addEventListeners() { /* This function seems unused, consider removing or implementing */ }

        function addObject(type, options = {}) {
            objectIdCounter++;
            let newObject;
            if (type === 'text') {
                const defaultFontFamily = "\"Twemoji Country Flags\", 'Berlin Sans FB Demi Bold', sans-serif";
                let combinedFontFamily = defaultFontFamily;
                if (options.fontFamily && !options.fontFamily.includes("Twemoji Country Flags")) {
                    combinedFontFamily = `"Twemoji Country Flags", ${options.fontFamily}`;
                } else if (options.fontFamily) {
                    combinedFontFamily = options.fontFamily;
                }
                // Ensure a default shadow object is present if not supplied by options
                const defaultShadow = { enabled: false, color: 'rgba(0,0,0,0.7)', blur: 5, offsetX: 2, offsetY: 2 };
                newObject = {
                    id: objectIdCounter, type: 'text',
                    x: canvas.width / 2, y: canvas.height / 2,
                    width: 500, height: 200, rotation: 0,
                    text: 'New Text', size: 100, align: 'center', wrap: false,
                    fontFamily: combinedFontFamily,
                    // Spread options first, then ensure our default shadow is there if options didn't provide one,
                    // or merge options.shadow with defaultShadow if options.shadow is partial.
                    ...options, // Spread options first
                    shadow: { ...defaultShadow, ...(options.shadow || {}) }, // Merge default shadow with options.shadow
                };
            } else { // For shapes and other potential future objects
                newObject = { id: objectIdCounter, type: type, x: canvas.width / 2, y: canvas.height / 2, width: 300, height: 300, rotation: 0, stroke: '#000000', strokeWidth: 5, shadow: { enabled: false, color: '#000000', blur: 5, offsetX: 5, offsetY: 5 }, ...options };
            };

            if (type === 'shape') { newObject.fill = '#ff0000'; }
            else if (type === 'text') {
                // Ensure fontFamily is correctly set
                if (!newObject.fontFamily || !newObject.fontFamily.includes("Twemoji Country Flags")) {
                    const baseFont = newObject.fontFamily || "'Berlin Sans FB Demi Bold', sans-serif";
                    newObject.fontFamily = `"Twemoji Country Flags", ${baseFont}`;
                }
                newObject.size = newObject.size || 100; // Already part of text object literal
                newObject.color = newObject.color || '#ffffff'; // Already part of text object literal
                // newObject.strokeColor, newObject.strokeThickness etc. should come from options (stylePreset)
            } else if (type === 'image' && newObject.src) {
                const img = new Image();
                img.onload = () => {
                    newObject.img = img;
                    const maxDim = 400;
                    if (img.width > img.height) { newObject.width = maxDim; newObject.height = img.height * (maxDim / img.width); }
                    else { newObject.height = maxDim; newObject.width = img.width * (maxDim / img.height); }
                    drawThumbnail();
                };
                img.src = newObject.src;
            }
            canvasObjects.push(newObject);
            selectObject(canvasObjects.length - 1);
        }

        function wrapText(ctx, text, x, y, maxWidth, lineHeight, align = 'center', elementX = x, canvasWidth = 1920) {
            const words = text.split(' ');
            let line = '';
            const lines = [];
            let effectiveMaxWidth = maxWidth;
            const padding = canvasWidth * 0.02;
            if (align === 'left') { effectiveMaxWidth = canvasWidth - elementX - padding; }
            else if (align === 'right') { effectiveMaxWidth = elementX - padding; }
            else { // center alignment
                 // For centered text, elementX is the center. Text can go half width to left/right.
                 // So, effectiveMaxWidth is the full width allowed for the text block.
                 // If elementX is 0 (like for a snippet in its local coords), this means it's centered in `maxWidth`.
                 // If elementX is a canvas coord, it's centered there.
                 effectiveMaxWidth = Math.min(maxWidth, canvasWidth - 2 * padding); // Max width considering canvas padding
            }
            effectiveMaxWidth = Math.max(50, effectiveMaxWidth); // Ensure a minimum wrapping width
            for(let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;
                if (testWidth > effectiveMaxWidth && n > 0) { lines.push(line.trim()); line = words[n] + ' '; }
                else { line = testLine; }
            }
            lines.push(line.trim());
            return lines.filter(l => l); // Filter out any empty lines
        }

        function hexToRgba(hex, alpha = 1) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        function drawThumbnail() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (currentImage) {
                let filterArray = [
                    `brightness(${backgroundImageState.brightness * (backgroundImageState.exposure / 100)}%)`,
                    `contrast(${backgroundImageState.contrast}%)`,
                    `saturate(${backgroundImageState.saturate}%)`
                ];
                if (backgroundImageState.warmth !== 100) {
                    const warmthEffect = Math.max(0, (backgroundImageState.warmth - 100) / 2);
                    filterArray.push(`sepia(${warmthEffect}%)`);
                }
                ctx.filter = filterArray.join(' ');
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
                if (backgroundImageState.tintStrength > 0) {
                    ctx.filter = 'none';
                    ctx.fillStyle = hexToRgba(backgroundImageState.tintColor, backgroundImageState.tintStrength / 100);
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                ctx.filter = 'none';
                if (backgroundImageState.vignette > 0) {
                    const vignetteStrength = backgroundImageState.vignette / 100;
                    const outerRadius = Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2)) * 1.2;
                    const innerRadius = outerRadius * (1 - vignetteStrength * 0.75);
                    const gradient = ctx.createRadialGradient(
                        canvas.width / 2, canvas.height / 2, innerRadius,
                        canvas.width / 2, canvas.height / 2, outerRadius
                    );
                    gradient.addColorStop(0, 'rgba(0,0,0,0)');
                    gradient.addColorStop(1, `rgba(0,0,0,${vignetteStrength})`);
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
            }

            ctx.save();
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            if (document.getElementById('overlay-thirds') && document.getElementById('overlay-thirds').checked) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
                const thirdW = canvas.width / 3;
                const thirdH = canvas.height / 3;
                ctx.beginPath();
                ctx.moveTo(thirdW, 0); ctx.lineTo(thirdW, canvas.height);
                ctx.moveTo(thirdW * 2, 0); ctx.lineTo(thirdW * 2, canvas.height);
                ctx.moveTo(0, thirdH); ctx.lineTo(canvas.width, thirdH);
                ctx.moveTo(0, thirdH * 2); ctx.lineTo(canvas.width, thirdH * 2);
                ctx.stroke();
            }
            if (document.getElementById('overlay-center') && document.getElementById('overlay-center').checked) {
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
                ctx.beginPath();
                ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
                ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.stroke();
            }
            ctx.restore();

            textElements.forEach((el) => {
                // For main text elements, el.x, el.y, el.align are canvas global coordinates
                // The precalculatedLines are passed as 'null' initially, drawTextWithEffect will calculate them.
                drawTextWithEffect(ctx, el, null);
            });

            canvasObjects.forEach(obj => {
                ctx.save();
                ctx.translate(obj.x, obj.y);
                ctx.rotate(obj.rotation * Math.PI / 180);
                switch (obj.type) {
                    case 'shape': drawShape(obj); break;
                    case 'image': drawImageObject(obj); break;
                    case 'text': drawTextWithEffect(ctx, obj, null); break; // Pass snippet 'obj'
                }
                ctx.restore();
            });

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
                const logoWidth = canvas.width * selectedLogo.scale;
                const logoHeight = (logo.height / logo.width) * logoWidth;
                let x, y;
                switch (selectedLogo.position) {
                    case 'top-left': x = padding; y = padding; break;
                    case 'top-right': x = canvas.width - logoWidth - padding; y = padding; break;
                    case 'bottom-left': x = padding; y = canvas.height - logoHeight - padding; break;
                    case 'bottom-right': default: x = canvas.width - logoWidth - padding; y = canvas.height - logoHeight - padding; break;
                }
                ctx.drawImage(logo, x, y, logoWidth, logoHeight);
            }
        }

        // REVISED drawTextWithEffect FUNCTION
        function drawTextWithEffect(ctx, el, precalculatedLines = null) {
            const text = el.text || '';
            const size = el.size || 100;
            const alignmentSetting = el.align || 'center';
            const fontFamily = el.fontFamily || "\"Twemoji Country Flags\", 'Berlin Sans FB Demi Bold', sans-serif";
            const finalFontFamily = fontFamily.includes("Twemoji Country Flags") ? fontFamily : `"Twemoji Country Flags", ${fontFamily}`;
            ctx.font = `bold ${size}px ${finalFontFamily}`;

            const lineHeight = size * 1.2;

            const isCanvasObjectSnippet = typeof el.id === 'number' && el.type === 'text';
            // Check if el.id is one of "text1", "text2", "text3", "text4"
            const isMainTextElement = typeof el.id === 'string' && /^text[1-4]$/.test(el.id);

            let xToDraw;
            let yInitialLinePos; // Y position for the baseline (top or middle) of the first line.
            let lines;

            if (isCanvasObjectSnippet) {
                xToDraw = 0;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle'; // Use middle for simpler centering math with yBaseForText = 0
                const yBaseForText = 0; // Vertical center for the text block in local coords

                // For wrapText, parameters are relative to the snippet's local (0,0) center.
                // MaxWidth for wrapping should be the snippet's bounding box width.
                lines = precalculatedLines || (el.wrap ? wrapText(ctx, text, 0, 0, el.width, lineHeight, 'center', 0, el.width) : [text]);

                const totalTextHeight = lines.length * lineHeight;
                yInitialLinePos = yBaseForText - (totalTextHeight / 2) + (lineHeight / 2); // Y for the middle of the first line

            } else if (isMainTextElement) {
                xToDraw = el.x;
                yInitialLinePos = el.y;
                ctx.textAlign = alignmentSetting;
                ctx.textBaseline = 'top';
                lines = precalculatedLines || (el.wrap ? wrapText(ctx, text, el.x, el.y, canvas.width * 0.96, lineHeight, alignmentSetting, el.x, canvas.width) : [text]);
            } else { // Assumed to be a preview context (e.g., in modals, style pickers for populateStylePresets/selectSnippetStyle)
                xToDraw = el.x; // el.x is likely center of the small preview canvas
                ctx.textAlign = 'center'; // Previews are generally centered
                ctx.textBaseline = 'middle';

                // Determine maxWidth for wrapping in previews. el._previewCanvas is a custom prop I added to previews.
                const previewCanvasWidth = el._previewCanvas ? el._previewCanvas.width : (ctx.canvas ? ctx.canvas.width : 300);
                lines = precalculatedLines || (el.wrap ? wrapText(ctx, text, el.x, el.y, previewCanvasWidth * 0.9, lineHeight, 'center', el.x, previewCanvasWidth) : [text]);

                const totalTextHeight = lines.length * lineHeight;
                yInitialLinePos = el.y - (totalTextHeight / 2) + (lineHeight / 2);
            }

            const drawLines = (drawFunc) => {
                lines.forEach((line, index) => {
                    const currentLineY = yInitialLinePos + (index * lineHeight);
                    drawFunc(line, xToDraw, currentLineY);
                });
            };

            const effect = el.advancedEffect;
            if (effect && effect.type !== 'none') {
                ctx.save();
                switch (effect.type) {
                    case 'neon':
                        ctx.shadowColor = effect.color2;
                        ctx.shadowBlur = effect.glowSize * 1.5;
                        drawLines((txt, x, y) => ctx.strokeText(txt, x, y));
                        ctx.shadowColor = effect.color1;
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
                ctx.restore();
            }
            if (el.shadowEnabled) {
                ctx.shadowColor = el.shadowColor;
                ctx.shadowBlur = el.shadowBlur;
                ctx.shadowOffsetX = el.shadowOffsetX;
                ctx.shadowOffsetY = el.shadowOffsetY;
            }

            const strokeColor = el.strokeColor || (isCanvasObjectSnippet && el.stroke); // Snippets might use 'stroke' from options
            const strokeThickness = el.strokeThickness || (isCanvasObjectSnippet && el.strokeWidth);

            if (strokeThickness > 0 && strokeColor) {
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = strokeThickness;
                ctx.lineJoin = 'round';
                drawLines((txt, x, y) => ctx.strokeText(txt, x, y));
            }
            ctx.fillStyle = el.color;
            drawLines((txt, x, y) => ctx.fillText(txt, x, y));
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }    

        function downloadThumbnail() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const dateStr = `${year}${month}${day}`;
            function cleanText(text) {
                return text.replace(/[$€/&%]/g, '').replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '_').trim();
            }
            const text1 = cleanText(document.getElementById('text1').value);
            const text2 = cleanText(document.getElementById('text2').value);
            const text3 = cleanText(document.getElementById('text3').value);
            const text4 = cleanText(document.getElementById('text4').value);
            const filename = `${dateStr}_${text1}_${text2}_${text3}_${text4}.jpg`.slice(0, 255);
            function getFileSize(dataUrl) { const base64 = dataUrl.split(',')[1]; return (base64.length * 0.75) / (1024 * 1024); }
            function compressImage(quality) { return new Promise((resolve) => { const dataUrl = canvas.toDataURL('image/jpeg', quality); resolve(dataUrl); }); }
            async function findOptimalQuality() {
                let quality = 0.9;
                let dataUrl = await compressImage(quality);
                let fileSize = getFileSize(dataUrl);
                if (fileSize < 1.8) return dataUrl;
                let min = 0.1, max = 0.9, bestQuality = 0.9, bestSize = fileSize;
                while (min <= max) {
                    quality = (min + max) / 2;
                    dataUrl = await compressImage(quality);
                    fileSize = getFileSize(dataUrl);
                    if (fileSize < 1.8) { bestQuality = quality; bestSize = fileSize; min = quality + 0.01; /* Adjusted step */ }
                    else { max = quality - 0.01;  /* Adjusted step */ }
                }
                return await compressImage(bestQuality);
            }
            findOptimalQuality().then(dataUrl => {
                const link = document.createElement('a');
                link.download = filename;
                link.href = dataUrl;
                link.click();
            });
        }

        function toggleTheme() {
            document.body.classList.toggle('dark-mode');
            drawThumbnail();
        }

        function drawShape(obj) {
            ctx.fillStyle = obj.fill;
            ctx.strokeStyle = obj.stroke;
            ctx.lineWidth = obj.strokeWidth;
            const w = obj.width; const h = obj.height;
            ctx.beginPath();
            switch (obj.shapeType) {
                case 'square': ctx.rect(-w / 2, -h / 2, w, h); break;
                case 'circle': ctx.arc(0, 0, w / 2, 0, 2 * Math.PI); break;
                case 'arrow':
                    ctx.moveTo(-w / 2, -h / 4); ctx.lineTo(0, -h / 4); ctx.lineTo(0, -h / 2); ctx.lineTo(w / 2, 0);
                    ctx.lineTo(0, h / 2); ctx.lineTo(0, h / 4); ctx.lineTo(-w / 2, h / 4); ctx.closePath(); break;
            }
            if (obj.fill && obj.fill !== 'transparent') ctx.fill();
            if (obj.strokeWidth > 0) ctx.stroke();
        }

        function drawImageObject(obj) {
            if (obj.img) {
                ctx.drawImage(obj.img, -obj.width / 2, -obj.height / 2, obj.width, obj.height);
                if (obj.strokeWidth > 0) {
                    ctx.strokeStyle = obj.stroke;
                    ctx.lineWidth = obj.strokeWidth;
                    ctx.strokeRect(-obj.width / 2, -obj.height / 2, obj.width, obj.height);
                }
            }
        }

        function drawTextSnippet(obj) { drawTextWithEffect(ctx, obj); }

// --- Emoji Picker Logic ---
let activeTextInputForEmoji = null;
const emojiPickerPopup = document.getElementById('emoji-picker-popup');
const emojiPicker = emojiPickerPopup ? emojiPickerPopup.querySelector('emoji-picker') : null;

function positionEmojiPicker(inputElement) {
    if (!emojiPickerPopup) return;
    const rect = inputElement.getBoundingClientRect();
    emojiPickerPopup.style.left = `${window.scrollX + rect.left}px`;
    emojiPickerPopup.style.top = `${window.scrollY + rect.bottom + 5}px`;
    emojiPickerPopup.style.display = 'block';
}

function hideEmojiPicker() {
    if (emojiPickerPopup) emojiPickerPopup.style.display = 'none';
    activeTextInputForEmoji = null;
}

['text1', 'text2', 'text3', 'text4', 'ai-prompt'].forEach(id => {
    const inputElement = document.getElementById(id);
    if (inputElement) {
        console.log(`Emoji Picker: Attaching listeners to ${id}`); // Diagnostic log
        inputElement.addEventListener('input', (e) => {
            const text = e.target.value;
            const cursorPos = e.target.selectionStart;
            const textBeforeCursor = text.substring(0, cursorPos);
            const colonIndex = textBeforeCursor.lastIndexOf(':');

            if (colonIndex !== -1 && (cursorPos - colonIndex > 0) && !textBeforeCursor.substring(colonIndex).includes(' ')) { // Check if it's an unterminated colon sequence
                const searchQuery = textBeforeCursor.substring(colonIndex + 1);
                activeTextInputForEmoji = e.target;
                positionEmojiPicker(e.target);
                if (emojiPicker && emojiPicker.shadowRoot) { // Search if picker is available
                    const searchInput = emojiPicker.shadowRoot.querySelector('input[type="search"]');
                    if (searchInput) {
                        searchInput.value = searchQuery;
                        searchInput.dispatchEvent(new Event('input', { bubbles: true })); // Trigger search in component
                    }
                }
            } else if (emojiPickerPopup.style.display === 'block' && (!textBeforeCursor.includes(':') || textBeforeCursor.charAt(textBeforeCursor.length -1) === ' ')) {
                 // If no colon or a space is typed, hide picker
                 hideEmojiPicker();
            }
        });
        inputElement.addEventListener('keydown', (e) => {
            if (e.key === ':' && emojiPickerPopup && emojiPickerPopup.style.display === 'none') {
                activeTextInputForEmoji = e.target;
                setTimeout(() => positionEmojiPicker(e.target), 0); // Position after ':' is in value
            } else if (e.key === 'Escape' && emojiPickerPopup && emojiPickerPopup.style.display !== 'none') {
                hideEmojiPicker();
            }
        });
        inputElement.addEventListener('blur', () => {
            setTimeout(() => {
                if (emojiPickerPopup && !emojiPickerPopup.contains(document.activeElement) && document.activeElement !== emojiPicker) {
                    hideEmojiPicker();
                }
            }, 150);
        });
    }
});

if (emojiPicker) {
    emojiPicker.addEventListener('emoji-click', event => {
        if (activeTextInputForEmoji) {
            const emoji = event.detail.unicode;
            const input = activeTextInputForEmoji;
            const start = input.selectionStart;
            const end = input.selectionEnd;
            
            let textBeforeCursor = input.value.substring(0, start);
            const colonIndex = textBeforeCursor.lastIndexOf(':');
            let replaceFromIndex = start;

            // If there's a colon and the text between colon and cursor is a plausible search term (no spaces)
            if (colonIndex !== -1 && (start - colonIndex) > 0 && !input.value.substring(colonIndex + 1, start).includes(' ')) {
                 replaceFromIndex = colonIndex; // Replace from the colon
            }

            input.value = input.value.substring(0, replaceFromIndex) + emoji + input.value.substring(end);
            const newCursorPos = replaceFromIndex + emoji.length;
            input.selectionStart = input.selectionEnd = newCursorPos;

            hideEmojiPicker();
            input.focus();
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
}

document.addEventListener('click', function(event) {
    if (emojiPickerPopup && activeTextInputForEmoji) {
        if (!emojiPickerPopup.contains(event.target) && event.target !== activeTextInputForEmoji) {
            hideEmojiPicker();
        }
    }
});

// --- Font Preview Modal Functions ---
function showFontPreviewModal() {
    const gallery = document.getElementById('font-preview-gallery');
    if (!gallery) return;
    gallery.innerHTML = '';

    const fontList = [
        { name: 'Berlin Sans FB Demi Bold', path: 'fonts/BRLNSDB.woff' },
        ...localFontFamilies.map(f => ({...f, path: f.path})) // Paths are already correct from localFontFamilies
    ];

    fontList.forEach(font => {
        const item = document.createElement('div');
        item.className = 'font-gallery-item';
        const nameLabel = document.createElement('div');
        nameLabel.className = 'font-name-label';
        nameLabel.textContent = font.name;
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 200 50");
        const textElement = document.createElementNS(svgNS, "text");
        textElement.setAttribute("x", "100");
        textElement.setAttribute("y", "30");
        const fontFamilyToApply = `"${font.name}"`;
        textElement.style.fontFamily = fontFamilyToApply;
        textElement.textContent = "Aa Bb Cc";
        console.log(`Font Preview Modal: Applying font-family: ${fontFamilyToApply} for font object:`, font);
        svg.appendChild(textElement);
        item.appendChild(nameLabel);
        item.appendChild(svg);
        gallery.appendChild(item);
    });
    document.getElementById('font-preview-modal').style.display = 'flex';
}

function closeFontPreviewModal() {
    const modal = document.getElementById('font-preview-modal');
    if (modal) modal.style.display = 'none';
}

// Add overlay click to close for font preview modal
const fontPreviewModal = document.getElementById('font-preview-modal');
if (fontPreviewModal) {
    fontPreviewModal.addEventListener('click', (event) => {
        if (event.target === fontPreviewModal) { // Clicked on the overlay itself
            closeFontPreviewModal();
        }
    });
}

document.getElementById('object-properties-panel').addEventListener('input', handleObjectPropertyChange);
        // --- AI Image Generation Functions ---
        let lastGeneratedImageUrl = null;
        let lastGeneratedSeed = null;
        let aiInputImageBase64 = null;

        function showAiModal() {
            document.getElementById('ai-modal').style.display = 'flex';
            const modelSelect = document.getElementById('ai-model');
            const inputImageSection = document.getElementById('ai-input-image-section');
            if (modelSelect.value === 'image-to-image') {
                inputImageSection.style.display = 'flex';
            } else {
                inputImageSection.style.display = 'none';
            }
        }
        function closeAiModal() { document.getElementById('ai-modal').style.display = 'none'; }

        document.getElementById('ai-model').addEventListener('change', function(e) {
            const inputImageSection = document.getElementById('ai-input-image-section');
            const downloadInputBtn = document.getElementById('ai-download-input-btn');
            if (e.target.value === 'image-to-image') {
                inputImageSection.style.display = 'flex';
                // Show download button only if an image is already previewed
                if (document.getElementById('ai-input-image-preview').src && document.getElementById('ai-input-image-preview').src !== '#') {
                    downloadInputBtn.style.display = 'block';
                } else {
                    downloadInputBtn.style.display = 'none';
                }
            } else {
                inputImageSection.style.display = 'none';
                downloadInputBtn.style.display = 'none'; // Hide if model is not image-to-image
            }
        });

        document.getElementById('ai-input-image-upload').addEventListener('change', function(e) {
            const file = e.target.files[0];
            const downloadInputBtn = document.getElementById('ai-download-input-btn');
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    document.getElementById('ai-input-image-preview').src = event.target.result;
                    document.getElementById('ai-input-image-preview').style.display = 'block';
                    document.querySelector('#ai-input-preview-box .placeholder-text').style.display = 'none';
                    aiInputImageBase64 = event.target.result;
                    if (downloadInputBtn) downloadInputBtn.style.display = 'block'; // Show download button
                    if (downloadInputBtn) downloadInputBtn.disabled = false;
                }
                reader.readAsDataURL(file);
            } else {
                // No file selected or selection cancelled
                // document.getElementById('ai-input-image-preview').src = '#'; // Reset preview
                // document.getElementById('ai-input-image-preview').style.display = 'none';
                // document.querySelector('#ai-input-preview-box .placeholder-text').style.display = 'block';
                // aiInputImageBase64 = null;
                // if (downloadInputBtn) downloadInputBtn.style.display = 'none'; // Hide download button
            }
        });

        async function downloadAiInputImage() {
            const inputImagePreview = document.getElementById('ai-input-image-preview');
            if (!inputImagePreview || !inputImagePreview.src || inputImagePreview.src === '#' || inputImagePreview.src.startsWith('data:image/gif')) {
                alert("No input image to download or image is not downloadable.");
                return;
            }

            const imageName = `ai_input_image_${Date.now()}.png`; // Basic name

            // If it's a data URL
            if (inputImagePreview.src.startsWith('data:image')) {
                const a = document.createElement('a');
                a.href = inputImagePreview.src;
                a.download = imageName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else { // If it's a direct URL (less likely for uploads but good for completeness)
                try {
                    const response = await fetch(inputImagePreview.src);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none'; a.href = url;
                    a.download = imageName;
                    document.body.appendChild(a); a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                } catch (error) {
                    console.error("Error downloading input image:", error);
                    alert("Failed to download input image.");
                }
            }
        }


        function copyAiOutputToInput() {
            const outputImg = document.getElementById('ai-preview-img');
            const inputPreviewImg = document.getElementById('ai-input-image-preview');
            if (outputImg.src && outputImg.src !== '#' && outputImg.src !== '') { // Check if output has a valid image
                inputPreviewImg.src = outputImg.src;
                inputPreviewImg.style.display = 'block';
                document.querySelector('#ai-input-preview-box .placeholder-text').style.display = 'none';
                aiInputImageBase64 = outputImg.src;
                document.getElementById('ai-model').value = 'image-to-image';
                document.getElementById('ai-input-image-section').style.display = 'flex';
            } else {
                alert("No output image to copy.");
            }
        }


        document.getElementById('ai-preset-prompts').addEventListener('change', (e) => {
            if (e.target.value) {
                document.getElementById('ai-prompt').value = e.target.value;
            }
        });
        document.getElementById('ai-guidance').addEventListener('input', (e) => {
            document.getElementById('ai-guidance-value').textContent = e.target.value;
        });

        async function generateAiImage() {
            const prompt = document.getElementById('ai-prompt').value;
            // Prompt is not strictly required if an image model is used with an input image
            // if (!prompt && document.getElementById('ai-model').value === 'text-to-image') {
            //     alert('Please provide a prompt for text-to-image generation.');
            //     return;
            // }
            const loader = document.getElementById('ai-loader');
            const previewImg = document.getElementById('ai-preview-img');
            const generateBtn = document.getElementById('ai-generate-btn');
            const downloadBtn = document.getElementById('ai-download-btn');
            const setBgBtn = document.getElementById('ai-set-bg-btn');
            loader.style.display = 'block';
            previewImg.style.display = 'none';
            document.querySelector('#ai-output-preview-box .placeholder-text').style.display = 'block'; // Show placeholder
            generateBtn.disabled = true; downloadBtn.disabled = true; setBgBtn.disabled = true;

            const seedValue = document.getElementById('ai-seed').value;
            const payload = {
                prompt: prompt,
                guidance_scale: parseFloat(document.getElementById('ai-guidance').value),
                model: document.getElementById('ai-model').value
            };
            if (seedValue) { payload.seed = parseInt(seedValue, 10); }

            if (payload.model === 'image-to-image' && aiInputImageBase64) {
                payload.input_image = aiInputImageBase64.startsWith('data:image') ? aiInputImageBase64.split(',')[1] : aiInputImageBase64;
            } else if (payload.model === 'image-to-image' && !aiInputImageBase64) {
                alert('Please upload an input image for the selected Image-to-Image model.');
                loader.style.display = 'none';
                generateBtn.disabled = false;
                return;
            }

            console.log("AI Payload:", payload);

            try {
                const response = await fetch('https://desc-maker.shark-ray.ts.net/api/generate-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) { const errorData = await response.json(); throw new Error(`API Error: ${errorData.detail || response.statusText}`); }
                const prediction = await response.json();
                if (!prediction.output) { throw new Error('API did not return an image URL in the output field.'); }
                lastGeneratedImageUrl = prediction.output;
                lastGeneratedSeed = prediction.seed;
                previewImg.src = lastGeneratedImageUrl;
                previewImg.style.display = 'block';
                document.querySelector('#ai-output-preview-box .placeholder-text').style.display = 'none'; // Hide placeholder
                downloadBtn.disabled = false; setBgBtn.disabled = false;
            } catch (error) {
                alert(`An error occurred: ${error.message}`);
                console.error(error);
                document.querySelector('#ai-output-preview-box .placeholder-text').textContent = 'Error generating image.';
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
            a.style.display = 'none'; a.href = url;
            a.download = `ai_img_seed_${lastGeneratedSeed}.png`;
            document.body.appendChild(a); a.click();
            window.URL.revokeObjectURL(url);
        }

        function setAiImageAsBackground() {
            if (!lastGeneratedImageUrl) return;
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                currentImage = img;
                const imageAspectRatio = img.width / img.height;
                const canvasAspectRatio = canvas.width / canvas.height;
                currentImageBaseCoverZoom = (imageAspectRatio > canvasAspectRatio) ? (canvas.height / img.height) : (canvas.width / img.width);
                imageOffsetX = 0; imageOffsetY = 0;
                document.getElementById('imageZoomSlider').value = 100;
                document.getElementById('zoomValue').textContent = '100%';
                drawThumbnail();
                closeAiModal();
            };
            img.onerror = () => alert('Failed to load image onto canvas.');
            img.src = lastGeneratedImageUrl + `?t=${new Date().getTime()}`;
        }

// --- Image Enlarge Modal Functions ---
const enlargeImageModal = document.getElementById('enlarge-image-modal');
const enlargedImageElement = document.getElementById('enlarged-image-element');
const aiInputImagePreview = document.getElementById('ai-input-image-preview');
const aiPreviewImg = document.getElementById('ai-preview-img');

function openEnlargeImageModal(imageUrl) {
    if (imageUrl && enlargeImageModal && enlargedImageElement) {
        enlargedImageElement.src = imageUrl;
        enlargeImageModal.style.display = 'flex';
    }
}

function closeEnlargeImageModal() {
    if (enlargeImageModal) {
        enlargeImageModal.style.display = 'none';
        if (enlargedImageElement) {
            enlargedImageElement.src = ''; // Clear src to free memory
        }
    }
}

if (aiInputImagePreview) {
    aiInputImagePreview.addEventListener('click', () => {
        if (aiInputImagePreview.src && aiInputImagePreview.src !== '#' && !aiInputImagePreview.src.startsWith('data:image/gif')) { // Don't enlarge placeholder or loader
            openEnlargeImageModal(aiInputImagePreview.src);
        }
    });
}

if (aiPreviewImg) {
    aiPreviewImg.addEventListener('click', () => {
        if (aiPreviewImg.src && aiPreviewImg.src !== '' && !aiPreviewImg.src.startsWith('data:image/gif')) { // Don't enlarge placeholder or loader
            openEnlargeImageModal(aiPreviewImg.src);
        }
    });
}

// Close modal if user clicks on the overlay
if (enlargeImageModal) {
    enlargeImageModal.addEventListener('click', (event) => {
        if (event.target === enlargeImageModal) { // Clicked on the overlay itself
            closeEnlargeImageModal();
        }
    });
}
