// =================================================================================
// AI Image Generation & Modal Logic
// =================================================================================

// --- Global AI State ---
let lastGeneratedImageUrl = null;
let lastGeneratedSeed = null;
let aiInputImageBase64 = null;

// --- Function Definitions ---

function setupAiImageHandlers() {
    const aiModelSelect = document.getElementById('ai-model');
    const aiInputImage = document.getElementById('ai-input-image');
    const aiPresetPrompts = document.getElementById('ai-preset-prompts');
    const aiGuidance = document.getElementById('ai-guidance');
    const aiGenerateBtn = document.getElementById('ai-generate-btn');
    const aiDownloadBtn = document.getElementById('ai-download-btn');
    const aiSetBgBtn = document.getElementById('ai-set-bg-btn');
    const aiInputImagePreview = document.getElementById('ai-input-image-preview');
    const aiPreviewImg = document.getElementById('ai-preview-img');
    const enlargeImageModal = document.getElementById('enlarge-image-modal');

    if (aiModelSelect) {
        aiModelSelect.addEventListener('change', function(e) {
            const inputImageSection = document.getElementById('ai-input-image-section');
            if (e.target.value === 'sdxl-turbo' || e.target.value === 'sd3-medium') {
                inputImageSection.style.display = 'block';
            } else {
                inputImageSection.style.display = 'none';
            }
        });
    }

    if (aiInputImage) {
        aiInputImage.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const downloadInputBtn = document.getElementById('ai-download-input-btn');
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    document.getElementById('ai-input-image-preview').src = event.target.result;
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

    if (aiGuidance) {
        aiGuidance.addEventListener('input', (e) => {
            document.getElementById('ai-guidance-value').textContent = e.target.value;
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
        document.getElementById('ai-input-image-preview').src = lastGeneratedImageUrl;
        aiInputImageBase64 = lastGeneratedImageUrl;
        document.getElementById('ai-model').value = 'sdxl-turbo';
        document.getElementById('ai-input-image-section').style.display = 'block';
        document.getElementById('ai-download-input-btn').style.display = 'inline-block';
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
    const guidance = document.getElementById('ai-guidance').value;

    if (!prompt) {
        alert('Please enter a prompt.');
        return;
    }

    generateBtn.disabled = true;
    loader.style.display = 'block';
    previewImg.style.display = 'none';
    downloadBtn.disabled = true;
    setBgBtn.disabled = true;
    document.querySelector('#ai-output-preview-box .placeholder-text').textContent = 'Generating...';

    try {
        const response = await fetch('/generate-ai-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt, 
                model, 
                guidance: parseFloat(guidance),
                seed: lastGeneratedSeed,
                image: aiInputImageBase64
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An unknown error occurred');
        }

        const prediction = await response.json();
        lastGeneratedImageUrl = prediction.output;
        lastGeneratedSeed = prediction.seed;
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
