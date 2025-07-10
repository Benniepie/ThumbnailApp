// =================================================================================
// Emoji Picker Logic - Event Delegation Model
// =================================================================================

let activeTextInputForEmoji = null;
const emojiPickerPopup = document.getElementById('emoji-picker-popup');
const emojiPicker = emojiPickerPopup ? emojiPickerPopup.querySelector('emoji-picker') : null;

// List of input IDs that should trigger the emoji picker
const emojiEnabledInputs = ['text1', 'text2', 'text3', 'text4', 'ai-prompt', 'obj-text-content'];

function positionEmojiPicker(inputElement) {
    if (!emojiPickerPopup || !inputElement) return;
    const rect = inputElement.getBoundingClientRect();
    emojiPickerPopup.style.left = `${window.scrollX + rect.left}px`;
    emojiPickerPopup.style.top = `${window.scrollY + rect.bottom + 5}px`;
    emojiPickerPopup.style.display = 'block';
}

function hideEmojiPicker() {
    if (emojiPickerPopup) emojiPickerPopup.style.display = 'none';
    activeTextInputForEmoji = null;
}

function handleInput(e) {
    const target = e.target;
    if (!emojiEnabledInputs.includes(target.id)) return;

    const text = target.value;
    const cursorPos = target.selectionStart;
    const textBeforeCursor = text.substring(0, cursorPos);
    const colonIndex = textBeforeCursor.lastIndexOf(':');

    if (colonIndex !== -1 && (cursorPos - colonIndex > 0) && !textBeforeCursor.substring(colonIndex).includes(' ')) {
        const searchQuery = textBeforeCursor.substring(colonIndex + 1);
        activeTextInputForEmoji = target;
        positionEmojiPicker(target);
        if (emojiPicker && emojiPicker.shadowRoot) {
            const searchInput = emojiPicker.shadowRoot.querySelector('input[type="search"]');
            if (searchInput) {
                searchInput.value = searchQuery;
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    } else if (emojiPickerPopup.style.display === 'block' && (!textBeforeCursor.includes(':') || textBeforeCursor.charAt(textBeforeCursor.length - 1) === ' ')) {
        hideEmojiPicker();
    }
}

function handleKeydown(e) {
    const target = e.target;
    if (!emojiEnabledInputs.includes(target.id)) return;

    if (e.key === ':' && emojiPickerPopup && emojiPickerPopup.style.display === 'none') {
        activeTextInputForEmoji = target;
        setTimeout(() => positionEmojiPicker(target), 0);
    } else if (e.key === 'Escape' && emojiPickerPopup && emojiPickerPopup.style.display !== 'none') {
        hideEmojiPicker();
    }
}

function handleBlur(e) {
    const target = e.target;
    if (!emojiEnabledInputs.includes(target.id)) return;

    setTimeout(() => {
        if (emojiPickerPopup && !emojiPickerPopup.contains(document.activeElement) && document.activeElement !== emojiPicker) {
            hideEmojiPicker();
        }
    }, 150);
}

function handleEmojiClick(event) {
    if (!activeTextInputForEmoji) return;

    const emoji = event.detail.unicode;
    const input = activeTextInputForEmoji;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    let textBeforeCursor = input.value.substring(0, start);
    const colonIndex = textBeforeCursor.lastIndexOf(':');
    let replaceFromIndex = start;

    if (colonIndex !== -1 && (start - colonIndex) > 0 && !input.value.substring(colonIndex + 1, start).includes(' ')) {
        replaceFromIndex = colonIndex;
    }

    const newValue = input.value.substring(0, replaceFromIndex) + emoji + input.value.substring(end);
    input.value = newValue;
    input.focus();
    input.selectionStart = input.selectionEnd = replaceFromIndex + emoji.length;

    hideEmojiPicker();

    // Manually trigger the 'input' event on the element to ensure any listeners are notified of the change
    input.dispatchEvent(new Event('input', { bubbles: true }));
}

// Attach event listeners to the document body
document.body.addEventListener('input', handleInput);
document.body.addEventListener('keydown', handleKeydown);
document.body.addEventListener('blur', handleBlur, true); // Use capture phase for blur

if (emojiPicker) {
    emojiPicker.addEventListener('emoji-click', handleEmojiClick);
}
