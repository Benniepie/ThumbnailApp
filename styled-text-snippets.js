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
            const isDarkMode = document.body.classList.contains('dark-mode');
            pCtx.fillStyle = isDarkMode ? '#2a2a2a' : '#555';
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
    // Create the options object, explicitly setting stylePresetId and removing the original preset's 'id'
    const styleOptions = { ...stylePreset, text: word, size: snippetSize, stylePresetId: stylePreset.id };
    delete styleOptions.id;

    addObject('text', styleOptions);
    closeSnippetModal();
}