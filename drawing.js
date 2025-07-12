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

// REVISED drawTextWithEffect FUNCTION
function drawTextWithEffect(ctx, el, precalculatedLines = null) {
    const text = el.text || '';
    const size = el.size || 100;
    const alignmentSetting = el.align || 'center';
    const fontFamily = el.fontFamily || '"Twemoji Country Flags", \'Berlin Sans FB Demi Bold\', sans-serif';
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

                if (el.bgColor && el.bgColor !== 'rgba(0, 0, 0, 0)' && isMainTextElement) {
        ctx.fillStyle = el.bgColor;
        const padding = el.bgPadding || 0;

        const savedShadowColor = ctx.shadowColor;
        const savedShadowBlur = ctx.shadowBlur;
        const savedShadowOffsetX = ctx.shadowOffsetX;
        const savedShadowOffsetY = ctx.shadowOffsetY;
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        lines.forEach((line, index) => {
            const textMetrics = ctx.measureText(line);
            const textWidth = textMetrics.width;
            
            let lineX;
            if (ctx.textAlign === 'center') {
                lineX = xToDraw - (textWidth / 2);
            } else if (ctx.textAlign === 'right') {
                lineX = xToDraw - textWidth;
            } else { // left
                lineX = xToDraw;
            }

            const bgX = el.bgFullWidth ? 0 : lineX - padding;
            const bgY = yInitialLinePos + (index * lineHeight) - padding;
            const bgWidth = el.bgFullWidth ? canvas.width : textWidth + (padding * 2);
            const bgHeight = lineHeight + (padding * 2);

            ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
        });

        ctx.shadowColor = savedShadowColor;
        ctx.shadowBlur = savedShadowBlur;
        ctx.shadowOffsetX = savedShadowOffsetX;
        ctx.shadowOffsetY = savedShadowOffsetY;
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
    // Apply shadow (works for both main text elements and snippet objects)
    const shadowEnabled = (el.shadow && el.shadow.enabled) || el.shadowEnabled;
    if (shadowEnabled) {
        const shadowColor  = (el.shadow ? el.shadow.color  : el.shadowColor)  || 'rgba(0,0,0,0.7)';
        const shadowBlur   = (el.shadow ? el.shadow.blur   : el.shadowBlur)   || 5;
        const shadowOffsetX = (el.shadow ? el.shadow.offsetX : el.shadowOffsetX) || 2;
        const shadowOffsetY = (el.shadow ? el.shadow.offsetY : el.shadowOffsetY) || 2;
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = shadowOffsetX;
        ctx.shadowOffsetY = shadowOffsetY;
    }

    // For styled text objects, the property panel sets 'stroke' and 'strokeWidth'.
    // For main text elements, it's 'strokeColor' and 'strokeThickness'.
    const strokeColor = el.stroke || el.strokeColor;
    const strokeThickness = el.strokeWidth || el.strokeThickness;

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

function drawShape(ctx, obj) {
    ctx.fillStyle = obj.fill;
    ctx.strokeStyle = obj.stroke;
    ctx.lineWidth = obj.strokeWidth;

    const w = obj.width;
    const h = obj.height;
    ctx.beginPath();

    switch (obj.type) { // Use obj.type to match the main switch
        case 'square': // Add case for square
        case 'rectangle':
            ctx.rect(-w / 2, -h / 2, w, h);
            break;
        case 'circle':
            ctx.arc(0, 0, w / 2, 0, 2 * Math.PI);
            break;
        case 'arrow':
            ctx.moveTo(-w / 2, h / 4);
            ctx.lineTo(0, h / 4);
            ctx.lineTo(0, h / 2);
            ctx.lineTo(w / 2, 0);
            ctx.lineTo(0, -h / 2);
            ctx.lineTo(0, -h / 4);
            ctx.lineTo(-w / 2, -h / 4);
            ctx.closePath();
            break;
    }

    if (obj.fill && obj.fill !== 'transparent') {
        ctx.fill();
    }
    if (obj.strokeWidth > 0) {
        ctx.stroke();
    }
}

function drawImageObject(ctx, obj) {
    if (!obj.img) return;

    const w = obj.width;
    const h = obj.height;

    ctx.save();

    // Apply flip before any other transformations
    if (obj.flipped) {
        ctx.scale(1, -1);
    }

    // Apply shadow
    if (obj.shadow && obj.shadow.enabled) {
        ctx.shadowColor = obj.shadow.color || 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = obj.shadow.blur || 5;
        ctx.shadowOffsetX = obj.shadow.offsetX || 2;
        ctx.shadowOffsetY = obj.shadow.offsetY || 2;
    }

    // Draw stroke with a more robust method for a clean outline
    if (obj.stroke && obj.strokeWidth > 0) {
        ctx.save();
        // Turn off shadow for the stroke drawing part
        ctx.shadowColor = 'transparent';

        // Create a silhouette of the image in the stroke color
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = w;
        tempCanvas.height = h;
        tempCtx.drawImage(obj.img, 0, 0, w, h);
        tempCtx.globalCompositeOperation = 'source-in';
        tempCtx.fillStyle = obj.stroke;
        tempCtx.fillRect(0, 0, w, h);

        // Draw the silhouette multiple times in a circle to create the stroke
        for (let angle = 0; angle < 360; angle += 15) {
            const rad = angle * Math.PI / 180;
            const x = Math.cos(rad) * obj.strokeWidth;
            const y = Math.sin(rad) * obj.strokeWidth;
            ctx.drawImage(tempCanvas, -w / 2 + x, -h / 2 + y, w, h);
        }
        ctx.restore(); // Restore context to re-enable shadow for the main image
    }
    
    // Draw the main image on top
    ctx.drawImage(obj.img, -w / 2, -h / 2, w, h);

    ctx.restore();
}

function drawTextSnippet(obj) { drawTextWithEffect(ctx, obj); }

function drawThumbnail(isForDownload = false) {
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

    canvasObjects.forEach((obj, index) => {
        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.rotation * Math.PI / 180);
        switch (obj.type) {
            case 'shape':
            case 'square':
            case 'circle':
            case 'arrow':
                drawShape(ctx, obj);
                break;
            case 'image':
            case 'person':
                drawImageObject(ctx, obj); 
                break;
            case 'text': drawTextWithEffect(ctx, obj, null); break;
        }
        ctx.restore();

        if (index === selectedObjectIndex) {
            ctx.save();
            ctx.translate(obj.x, obj.y);
            ctx.rotate(obj.rotation * Math.PI / 180);
            ctx.strokeStyle = '#007bff';
            ctx.lineWidth = 4;
            ctx.strokeRect(-obj.width / 2, -obj.height / 2, obj.width, obj.height);
            ctx.restore();
        }
    });

    if (selectedObjectIndex > -1 && !isForDownload) {
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

/**
 * Calculates the visual dimensions of a text object, including stroke width.
 * @param {object} textObject The text object to measure.
 * @returns {{width: number, height: number}} The calculated width and height.
 */
function calculateTextDimensions(textObject) {
    // Use a temporary context to not interfere with the main canvas state if not necessary
    const tempCtx = document.createElement('canvas').getContext('2d');
    const fontFamily = textObject.fontFamily || '"Twemoji Country Flags", \'Berlin Sans FB Demi Bold\', sans-serif';
    const finalFontFamily = fontFamily.includes("Twemoji Country Flags") ? fontFamily : `"Twemoji Country Flags", ${fontFamily}`;
    tempCtx.font = `bold ${textObject.size}px ${finalFontFamily}`;

    const text = textObject.text || '';
    const lineHeight = textObject.size * 1.2;

    // When calculating dimensions, we want the raw, unwrapped size to set the initial bounding box.
    // The wrapping will be applied visually during the actual drawing, not during measurement.
    const lines = [text];

    let maxWidth = 0;
    lines.forEach(line => {
        const metrics = tempCtx.measureText(line);
        if (metrics.width > maxWidth) {
            maxWidth = metrics.width;
        }
    });

    const totalHeight = lines.length * lineHeight;

    // Account for stroke width, which adds to the visual size on all sides
    const strokePadding = textObject.strokeWidth || 0;

    return {
        width: maxWidth + strokePadding,
        height: totalHeight + strokePadding
    };
}
