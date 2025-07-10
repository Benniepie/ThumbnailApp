// --- Font Preview Modal Functions ---
function showFontPreviewModal() {
    const modal = document.getElementById('fontPreviewModal');
    const gallery = document.getElementById('font-preview-gallery');
    gallery.innerHTML = ''; // Clear previous previews

    if (typeof localFontFamilies === 'undefined') {
        gallery.innerHTML = '<p>Error: Font list not loaded.</p>';
        modal.classList.add('show');
        return;
    }

    localFontFamilies.forEach(font => {
        const previewItem = document.createElement('div');
        previewItem.className = 'font-preview-item';
        previewItem.style.fontFamily = `'${font}'`;
        previewItem.style.fontSize = '24px'; // Larger preview size
        previewItem.textContent = font; // Show the font name
        
        previewItem.onclick = () => {
            const selectedObj = getSelectedObject();
            if (selectedObj && selectedObj.type === 'text') {
                selectedObj.fontFamily = font;
                updateObjectPropertiesPanel(selectedObj);
                drawThumbnail();
            }
            closeFontPreviewModal();
        };
        
        gallery.appendChild(previewItem);
    });

    modal.classList.add('show');
}

function closeFontPreviewModal() {
    const modal = document.getElementById('fontPreviewModal');
    if (modal) modal.classList.remove('show');
}

function populateFontDropdowns() {
    if (typeof localFontFamilies === 'undefined' || localFontFamilies.length === 0) {
        console.warn('Font list not available to populate dropdowns.');
        return;
    }

    for (let i = 1; i <= 4; i++) {
        const select = document.getElementById(`fontFamily${i}`);
        if (select) {
            const currentVal = select.value;
            select.innerHTML = ''; // Clear existing options

            localFontFamilies.forEach(font => {
                const option = document.createElement('option');
                option.value = font;
                option.textContent = font;
                select.appendChild(option);
            });

            // Restore the previously selected value if it still exists
            if (localFontFamilies.includes(currentVal)) {
                select.value = currentVal;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Populate font dropdowns with the correct, dynamically loaded fonts
    populateFontDropdowns();

    // Add listener to close the font preview modal when clicking on the overlay
    const fontPreviewModal = document.getElementById('fontPreviewModal');
    if (fontPreviewModal) {
        fontPreviewModal.addEventListener('click', (event) => {
            if (event.target === fontPreviewModal) { 
                closeFontPreviewModal();
            }
        });
    }
});
