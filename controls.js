function populateFontSelectors() {
    if (typeof localFontFamilies === 'undefined') {
        console.error('localFontFamilies not defined. Make sure font-loader.js is loaded correctly.');
        // Fallback to a basic list if the dynamic one fails
        const basicFonts = ['Arial', 'Georgia', 'Verdana', 'Impact'];
        const fontSelects = document.querySelectorAll('.font-family-select');
        fontSelects.forEach(select => {
            basicFonts.forEach(font => {
                const option = document.createElement('option');
                option.value = font; option.textContent = font; select.appendChild(option);
            });
        });
        return;
    }

    const fontSelects = document.querySelectorAll('.font-family-select');
    fontSelects.forEach(select => {
        select.innerHTML = ''; // Clear existing options
        localFontFamilies.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            option.style.fontFamily = `'${font}'`;
            select.appendChild(option);
        });
    });
}

function updateColorPreviews() {
    for (let i = 1; i <= 4; i++) {
        const color = document.getElementById(`color${i}`).value;
        document.getElementById(`preview${i}`).style.backgroundColor = color;
    }
}

function downloadThumbnail() {
    // 1. Deselect any selected objects to avoid blue bounding boxes in download
    const wasSelected = selectedObjectIndex;
    selectedObjectIndex = -1;
    
    // 2. Redraw the canvas specifically for download (without selection boxes)
    drawThumbnail(true);

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
            if (fileSize < 1.8) { bestQuality = quality; bestSize = fileSize; min = quality + 0.01; }
            else { max = quality - 0.01; }
        }
        return await compressImage(bestQuality);
    }

    findOptimalQuality().then(dataUrl => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();

        // After download is initiated, restore the normal canvas view
        drawThumbnail(false);
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    // Redraw the main canvas and the style presets to reflect the theme change.
    drawThumbnail();
    populateStylePresets();
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', function (e) {
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
                            const rgbaMatch = textElements[elementIndex].bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
                            if (rgbaMatch) {
                                textElements[elementIndex].bgColor = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${newAlpha})`;
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
                            const shadowRgbaMatchOld = textElements[elementIndex].shadowColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
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
            else if (targetId === 'bg-brightness') { backgroundImageState.brightness = e.target.value; document.getElementById('bg-brightness-value').textContent = e.target.value + '%'; }
            else if (targetId === 'bg-contrast') { backgroundImageState.contrast = e.target.value; document.getElementById('bg-contrast-value').textContent = e.target.value + '%'; }
            else if (targetId === 'bg-saturate') {
                backgroundImageState.saturate = e.target.value; document.getElementById('bg-saturate-value').textContent = e.target.value + '%';
            } else if (targetId === 'bg-warmth') {
                backgroundImageState.warmth = e.target.value; document.getElementById('bg-warmth-value').textContent = e.target.value + '%';
            } else if (targetId === 'bg-exposure') {
                backgroundImageState.exposure = e.target.value; document.getElementById('bg-exposure-value').textContent = e.target.value + '%';
            } else if (targetId === 'bg-tint-color') {
                backgroundImageState.tintColor = e.target.value;
            } else if (targetId === 'bg-tint-strength') {
                backgroundImageState.tintStrength = e.target.value; document.getElementById('bg-tint-strength-value').textContent = e.target.value + '%';
            } else if (targetId === 'bg-vignette') {
                backgroundImageState.vignette = e.target.value; document.getElementById('bg-vignette-value').textContent = e.target.value + '%';
            }
            if (redrawNeeded) { drawThumbnail(); }
        });
    });

    document.querySelectorAll('input[id^="size"]').forEach(sizeInput => {
        sizeInput.addEventListener('wheel', function (e) {
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

    document.getElementById('imageInput').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = new Image();
                img.onload = function () {
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

    document.querySelectorAll('input[type="color"]').forEach(input => {
        input.addEventListener('input', updateColorPreviews);
    });
});
