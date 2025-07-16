function updateFxControlsVisibility(index) {
    const i = index + 1;
    const effectType = document.getElementById(`advancedEffectType${i}`).value;
    const fxParamsContainer = document.getElementById(`fx-params${i}`);
    
    if (!fxParamsContainer) return;
    
    // Hide all FX parameter controls first
    const allFxControls = fxParamsContainer.querySelectorAll('.fx-param-control');
    allFxControls.forEach(control => {
        control.style.display = 'none';
    });

    // Show controls based on effect type
    if (effectType !== 'none') {
        const controlsToShow = fxParamsContainer.querySelectorAll(`[data-fx-for*="${effectType}"]`);
        controlsToShow.forEach(control => {
            control.style.display = 'block';
        });
    }
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

document.addEventListener('DOMContentLoaded', () => {
    const logoScaleInput = document.getElementById('logoScale');
    if (logoScaleInput) {
        logoScaleInput.addEventListener('input', function(e) {
            const scalePercent = e.target.value;
            document.getElementById('logoScaleValue').textContent = `${scalePercent}%`;
            selectedLogo.scale = parseFloat(scalePercent) / 100;
            drawThumbnail();
        });
    }

    document.querySelectorAll('input[type="color"]').forEach(input => {
        input.addEventListener('input', updateColorPreviews);
    });
});
