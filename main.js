document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed.');

    // Initialize modules that require DOM elements
    console.log('Initializing modules...');
    setupObjectPropertyHandlers(); // From canvas-objects.js
    setupAiImageHandlers(); // From ai-image.js
    console.log('Modules initialized.');

    // Consolidated Event Handling
    console.log('Attaching event listeners...');
    const leftPanel = document.querySelector('.left-panel');
    const centerPanel = document.querySelector('.center-panel');

    document.body.addEventListener('click', (event) => {
        const target = event.target;

        // Handle button clicks with delegation
        const button = target.closest('button');
        if (button) {
            // Left Panel Buttons
            if (leftPanel && leftPanel.contains(button)) {
                if (button.classList.contains('layout-btn')) {
                    const layoutId = button.dataset.layoutId;
                    if (layoutId) setLayout(parseInt(layoutId, 10));
                }
                if (button.classList.contains('toggle-btn')) {
                    const controlsId = button.dataset.controls;
                    if (controlsId) toggleControlVisibility(button, controlsId);
                }
                if (button.classList.contains('align-btn')) {
                    const align = button.dataset.align;
                    const lineIndex = button.dataset.lineIndex;
                    if (align && lineIndex) setTextAlignment(parseInt(lineIndex, 10), align);
                }
                if (button.classList.contains('preset-btn')) {
                    const group = button.dataset.presetGroup;
                    const value = button.dataset.presetValue;
                    if (group && value) {
                        switch (group) {
                            case 'title': setTitle(value); break;
                            case 'subtitle': setSubtitle(value); break;
                            case 'date': setDate(value); break;
                            case 'line4': setLine4(value); break;
                        }
                    }
                }
                if (button.id === 'show-font-preview-modal-btn') showFontPreviewModal();
                if (button.id === 'add-shape-btn') showShapePicker();
                if (button.id === 'add-person-btn') showPersonPicker();
                if (button.id === 'add-styled-text-btn') showPresetPickerForSnippet();
                if (button.id === 'update-date-btn') updateDate();
                if (button.id === 'export-layout-btn') exportLayoutToClipboard();
                if (button.id === 'theme-toggle-btn') toggleTheme();
            }

            // Center Panel Buttons
            if (centerPanel && centerPanel.contains(button)) {
                if (button.id === 'upload-image-btn') document.getElementById('imageInput').click();
                if (button.id === 'paste-image-btn') pasteImageFromClipboard();
                if (button.id === 'show-ai-modal-btn') showAiModal();
                if (button.id === 'download-thumbnail-btn') downloadThumbnail();
            }

            // Modal-specific buttons
            if (button.id === 'ai-close-btn') closeAiModal();
            if (button.id === 'snippet-cancel-btn') closeSnippetModal();
            if (button.id === 'font-preview-close-btn') closeFontPreviewModal();
            if (button.id === 'enlarge-image-close-btn') closeEnlargeImageModal();
            if (button.id === 'person-picker-back-btn') showPersonPickerStep1();
            if (button.id === 'person-picker-close-btn') closePersonPicker();
        }

        // Logic to close modals when clicking on a close button or outside the modal content
        if (target.matches('.close-button') || target.matches('.modal')) {
            const modal = target.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        }
    });
    console.log('Event listeners attached.');

    // Run initial setup functions
    console.log('Running initial setup...');
    if (!document.body.classList.contains('dark-mode')) {
        document.body.classList.add('dark-mode');
    }
    updateColorPreviews();
    setLayout(1); // Set a default layout
    populateStylePresets();
    populateFontSelectors();
    drawThumbnail();
    console.log('Initial setup complete. Application is ready.');
});
