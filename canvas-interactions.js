

// =================================================================================
// Canvas Interaction Logic (Drag and Drop)
// =================================================================================

// Helper function to check if click is on a handle
function getHandleAt(x, y, obj) {
    if (!obj) return null;
    
    const handleSize = 12;
    const rotationHandleRadius = 8;
    
    // Transform mouse coordinates to object's local space
    const dx = x - obj.x;
    const dy = y - obj.y;
    const angle = -obj.rotation * Math.PI / 180;
    const localX = dx * Math.cos(angle) - dy * Math.sin(angle);
    const localY = dx * Math.sin(angle) + dy * Math.cos(angle);
    
    // Check rotation handle (top center)
    const rotHandleX = 0;
    const rotHandleY = -obj.height / 2 - 25;
    const distToRotHandle = Math.sqrt(Math.pow(localX - rotHandleX, 2) + Math.pow(localY - rotHandleY, 2));
    if (distToRotHandle <= rotationHandleRadius + 5) {
        return 'rotate';
    }
    
    // Check resize handles
    const corners = [
        { name: 'tl', x: -obj.width / 2, y: -obj.height / 2 },
        { name: 'tr', x: obj.width / 2, y: -obj.height / 2 },
        { name: 'bl', x: -obj.width / 2, y: obj.height / 2 },
        { name: 'br', x: obj.width / 2, y: obj.height / 2 }
    ];
    
    for (const corner of corners) {
        if (Math.abs(localX - corner.x) <= handleSize / 2 + 5 &&
            Math.abs(localY - corner.y) <= handleSize / 2 + 5) {
            return corner.name;
        }
    }
    
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    if (!canvas) {
        console.error('Canvas not initialized. Interactions will not work.');
        return;
    }

    canvas.addEventListener('mousedown', (e) => {
        const { x, y } = getCanvasMousePos(e);
        
        // Check if clicking on a handle of the selected object
        if (selectedObjectIndex > -1) {
            const obj = canvasObjects[selectedObjectIndex];
            const handle = getHandleAt(x, y, obj);
            
            if (handle === 'rotate') {
                dragState.isDragging = true;
                dragState.target = 'rotate';
                dragState.index = selectedObjectIndex;
                dragState.startX = x;
                dragState.startY = y;
                dragState.elementStartRotation = obj.rotation;
                canvas.style.cursor = 'grab';
                return;
            } else if (handle && handle !== 'rotate') {
                dragState.isDragging = true;
                dragState.target = 'resize';
                dragState.index = selectedObjectIndex;
                dragState.resizeHandle = handle;
                dragState.startX = x;
                dragState.startY = y;
                dragState.elementStartWidth = obj.width;
                dragState.elementStartHeight = obj.height;
                dragState.elementStartSize = obj.size || 100; // Store initial size for text/shapes
                dragState.elementStartX = obj.x;
                dragState.elementStartY = obj.y;
                canvas.style.cursor = handle.includes('t') && handle.includes('l') || handle.includes('b') && handle.includes('r') ? 'nwse-resize' : 'nesw-resize';
                return;
            }
        }
        
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
        if (!dragState.isDragging) {
            // Update cursor based on hover
            if (selectedObjectIndex > -1) {
                const { x, y } = getCanvasMousePos(e);
                const obj = canvasObjects[selectedObjectIndex];
                const handle = getHandleAt(x, y, obj);
                
                if (handle === 'rotate') {
                    canvas.style.cursor = 'grab';
                } else if (handle === 'tl' || handle === 'br') {
                    canvas.style.cursor = 'nwse-resize';
                } else if (handle === 'tr' || handle === 'bl') {
                    canvas.style.cursor = 'nesw-resize';
                } else if (getObjectAt(x, y) === selectedObjectIndex) {
                    canvas.style.cursor = 'move';
                } else {
                    canvas.style.cursor = 'default';
                }
            }
            return;
        }
        
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
            case 'rotate':
                const obj = canvasObjects[dragState.index];
                const rotAngle = Math.atan2(y - obj.y, x - obj.x) * 180 / Math.PI + 90;
                obj.rotation = Math.round(rotAngle) % 360;
                if (obj.rotation < 0) obj.rotation += 360;
                updateObjectPropertiesPanel();
                break;
            case 'resize':
                const resizeObj = canvasObjects[dragState.index];
                const handle = dragState.resizeHandle;
                
                // Transform delta to object's local space
                const resizeAngle = -resizeObj.rotation * Math.PI / 180;
                const localDx = dx * Math.cos(resizeAngle) - dy * Math.sin(resizeAngle);
                const localDy = dx * Math.sin(resizeAngle) + dy * Math.cos(resizeAngle);
                
                let newWidth = dragState.elementStartWidth;
                let newHeight = dragState.elementStartHeight;
                
                // Calculate new dimensions based on handle
                if (handle.includes('r')) {
                    newWidth = Math.max(20, dragState.elementStartWidth + localDx * 2);
                } else if (handle.includes('l')) {
                    newWidth = Math.max(20, dragState.elementStartWidth - localDx * 2);
                }
                
                if (handle.includes('b')) {
                    newHeight = Math.max(20, dragState.elementStartHeight + localDy * 2);
                } else if (handle.includes('t')) {
                    newHeight = Math.max(20, dragState.elementStartHeight - localDy * 2);
                }
                
                // For images, maintain aspect ratio
                if (resizeObj.type === 'image' || resizeObj.type === 'person') {
                    if (resizeObj.img && resizeObj.img.width > 0) {
                        const aspectRatio = resizeObj.img.width / resizeObj.img.height;
                        newWidth = newHeight * aspectRatio;
                    }
                }
                
                // Apply new dimensions
                resizeObj.width = newWidth;
                resizeObj.height = newHeight;
                
                // For text objects, also update the size property (font size)
                if (resizeObj.type === 'text') {
                    // Calculate new font size based on height change
                    const heightRatio = newHeight / dragState.elementStartHeight;
                    const newSize = Math.max(10, Math.round(dragState.elementStartSize * heightRatio));
                    resizeObj.size = newSize;
                    
                    // Recalculate text dimensions based on new size
                    if (typeof resizeObj.id === 'number') {
                        // For styled text snippets, recalc dimensions
                        recalcSnippetDimensions(resizeObj);
                    } else {
                        const dims = calculateTextDimensions(resizeObj);
                        resizeObj.width = dims.width;
                        resizeObj.height = dims.height;
                    }
                }
                
                // For shape objects, width/height is all we need (they're geometric shapes)
                // No additional updates needed - shapes use width/height directly
                
                updateObjectPropertiesPanel();
                break;
        }
        drawThumbnail();
    });

    canvas.addEventListener('mouseup', () => {
        // Always reset drag state, even if selection changed during drag
        if (dragState.isDragging && dragState.target === 'object' && typeof dragState.index === 'number' && canvasObjects[dragState.index]) {
            // If the dragged object is a styled text snippet, recalc dimensions and redraw to prevent bounding box jumps
            const obj = canvasObjects[dragState.index];
            if (obj && obj.type === 'text') {
                // If wrapped, recalc anchor and wrap width based on new X
                if (obj.wrap && (obj.align === 'left' || obj.align === 'right' || obj.align === 'center')) {
                    recalcSnippetDimensionsWithAnchor(obj, obj.align);
                } else {
                    recalcSnippetDimensions(obj);
                }
                drawThumbnail(); // Redraw with updated bounding box
            }
            // Update panel so X/Y fields reflect new position
            updateObjectPropertiesPanel();
        }
        dragState.isDragging = false;
        dragState.target = null;
        dragState.index = null;
        canvas.style.cursor = 'default';
    });

    canvas.addEventListener('mouseleave', () => {
        // Always reset drag state on mouseleave to prevent stuck dragging
        dragState.isDragging = false;
        dragState.target = null;
        dragState.index = null;
        canvas.style.cursor = 'default';
    });
});