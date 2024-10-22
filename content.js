function insertTextAtCursor(text) {
  const activeElement = document.activeElement;
  if (activeElement.tagName === "TEXTAREA" || (activeElement.tagName === "INPUT" && activeElement.type === "text")) {
    const start = activeElement.selectionStart;
    const end = activeElement.selectionEnd;
    activeElement.value = activeElement.value.slice(0, start) + text + activeElement.value.slice(end);
    activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
  } else if (document.getSelection) {
    const selection = document.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
    }
  }
}
