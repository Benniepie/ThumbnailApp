

// =================================================================================
// Canvas Interaction Logic (Drag and Drop)
// =================================================================================

document.addEventListener('DOMContentLoaded', () => {
    if (!canvas) {
        console.error('Canvas not initialized. Interactions will not work.');
        return;
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
            dragState.isDragging = false;
            dragState.target = null;
            canvas.style.cursor = 'default';
        }
    });
});