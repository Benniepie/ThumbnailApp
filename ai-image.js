// =================================================================================
// AI Image Generation & Modal Logic
// =================================================================================

// --- Global AI State ---
let lastGeneratedImageUrl = null;
let aiInputImageBase64 = null;

// --- Function Definitions ---

function setupAiImageHandlers() {
    const aiModelSelect = document.getElementById('ai-model');
    const aiInputImage = document.getElementById('ai-input-image-upload');
    const aiPresetPrompts = document.getElementById('ai-preset-prompts');
    const aiGenerateBtn = document.getElementById('ai-generate-btn');
    const aiDownloadBtn = document.getElementById('ai-download-btn');
    const aiSetBgBtn = document.getElementById('ai-set-bg-btn');
    const aiInputImagePreview = document.getElementById('ai-input-image-preview');
    const aiPreviewImg = document.getElementById('ai-preview-img');
    const enlargeImageModal = document.getElementById('enlarge-image-modal');

    // Input image section is now always visible - no need to hide/show based on model

    if (aiInputImage) {
        aiInputImage.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const downloadInputBtn = document.getElementById('ai-download-input-btn');
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const previewImg = document.getElementById('ai-input-image-preview');
                    previewImg.src = event.target.result;
                    previewImg.style.display = 'block'; // Show the image
                    aiInputImageBase64 = event.target.result;
                    if (downloadInputBtn) downloadInputBtn.style.display = 'inline-block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (aiPresetPrompts) {
        aiPresetPrompts.addEventListener('change', (e) => {
            if (e.target.value) {
                document.getElementById('ai-prompt').value = e.target.value;
            }
        });
    }



    if (aiGenerateBtn) aiGenerateBtn.addEventListener('click', generateAiImage);
    if (aiDownloadBtn) aiDownloadBtn.addEventListener('click', downloadAiImage);
    if (aiSetBgBtn) aiSetBgBtn.addEventListener('click', setAiImageAsBackground);

    if (aiInputImagePreview) {
        aiInputImagePreview.addEventListener('click', () => {
            if (aiInputImagePreview.src && aiInputImagePreview.src !== '#' && !aiInputImagePreview.src.startsWith('data:image/gif')) {
                openEnlargeImageModal(aiInputImagePreview.src);
            }
        });
    }

    if (aiPreviewImg) {
        aiPreviewImg.addEventListener('click', () => {
            if (aiPreviewImg.src && aiPreviewImg.src !== '' && !aiPreviewImg.src.startsWith('data:image/gif')) {
                openEnlargeImageModal(aiPreviewImg.src);
            }
        });
    }

    if (enlargeImageModal) {
        enlargeImageModal.addEventListener('click', (event) => {
            if (event.target === enlargeImageModal) {
                closeEnlargeImageModal();
            }
        });
    }
}

function showAiModal() {
    const modal = document.getElementById('ai-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeAiModal() {
    document.getElementById('ai-modal').style.display = 'none';
}

function downloadAiInputImage() {
    if (!aiInputImageBase64) {
        console.error('No AI input image to download.');
        return;
    }
    const link = document.createElement('a');
    link.href = aiInputImageBase64;
    const fileExtension = aiInputImageBase64.split(';')[0].split('/')[1];
    link.download = `ai-input-image.${fileExtension || 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function copyAiOutputToInput() {
    if (lastGeneratedImageUrl) {
        const previewImg = document.getElementById('ai-input-image-preview');
        previewImg.src = lastGeneratedImageUrl;
        previewImg.style.display = 'block'; // Show the image
        aiInputImageBase64 = lastGeneratedImageUrl;
        document.getElementById('ai-model').value = 'bytedance/seededit-3.0';
        const downloadInputBtn = document.getElementById('ai-download-input-btn');
        if (downloadInputBtn) downloadInputBtn.style.display = 'inline-block';
    }
}

async function generateAiImage() {
    const generateBtn = document.getElementById('ai-generate-btn');
    const loader = document.getElementById('ai-loader');
    const previewImg = document.getElementById('ai-preview-img');
    const downloadBtn = document.getElementById('ai-download-btn');
    const setBgBtn = document.getElementById('ai-set-bg-btn');
    const prompt = document.getElementById('ai-prompt').value;
    const model = document.getElementById('ai-model').value;

    if (!prompt) {
        alert('Please enter a prompt.');
        return;
    }

    // Check if this is an edit model that requires an input image
    const editModels = [
        'bytedance/seededit-3.0',
        'black-forest-labs/flux-kontext-max',
        'black-forest-labs/flux-kontext-pro'
    ];
    
    const isEditModel = editModels.includes(model);
    
    if (isEditModel && !aiInputImageBase64) {
        alert('This model requires an input image. Please upload an image first.');
        return;
    }

    generateBtn.disabled = true;
    loader.style.display = 'block';
    previewImg.style.display = 'none';
    downloadBtn.disabled = true;
    setBgBtn.disabled = true;
    document.querySelector('#ai-output-preview-box .placeholder-text').textContent = 'Generating...';

    try {
        // Build request body - only include image for edit models
        const requestBody = {
            prompt,
            model
        };
        
        if (isEditModel) {
            requestBody.image = aiInputImageBase64;
        }

        const response = await fetch('https://desc-maker.shark-ray.ts.net/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An unknown error occurred');
        }

        const prediction = await response.json();
        lastGeneratedImageUrl = prediction.output;
        // Note: seed is no longer expected from the endpoint
        previewImg.src = lastGeneratedImageUrl;
        previewImg.style.display = 'block';
        document.querySelector('#ai-output-preview-box .placeholder-text').style.display = 'none';
        downloadBtn.disabled = false; 
        setBgBtn.disabled = false;
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
    a.download = `ai_generated_image.png`;
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

function openEnlargeImageModal(imageUrl) {
    const enlargeImageModal = document.getElementById('enlarge-image-modal');
    const enlargedImageElement = document.getElementById('enlarged-image-element');
    if (imageUrl && enlargeImageModal && enlargedImageElement) {
        enlargedImageElement.src = imageUrl;
        enlargeImageModal.style.display = 'flex';
    }
}

function closeEnlargeImageModal() {
    const enlargeImageModal = document.getElementById('enlarge-image-modal');
    if (enlargeImageModal) {
        enlargeImageModal.style.display = 'none';
        if (enlargedImageElement) {
            enlargedImageElement.src = '';
        }
    }
}
