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
            textElements[3].text = 'MILITARY AID: HUNGARY GIVES ORBAN TO MUSK. SPACEX MAKES TOAST, ';
            textElements[3].size = 80;
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
            textElements[3].text = 'MILITARY AID: HUNGARY GIVES ORBAN TO MUSK. SPACEX MAKES TOAST, ';
            textElements[3].size = 80;
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
            textElements[3].text = 'MILITARY AID: HUNGARY GIVES ORBAN TO MUSK. SPACEX MAKES TOAST, ';
            textElements[3].size = 80;
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
