"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLineNumber = exports.getEditorBounds = exports.clearInlineStyles = exports.isGreaterThan = exports.atomicBlockExists = exports.removeBlockFromMap = exports.getSelectionInfo = void 0;
var draft_js_1 = require("draft-js");
/**
 * Get the current selection details
 */
var getSelectionInfo = function (editorState) {
    var selection = editorState.getSelection();
    var startOffset = selection.getStartOffset();
    var currentContent = editorState.getCurrentContent();
    var contentBlock = currentContent.getBlockForKey(selection.getStartKey());
    var currentStyle = editorState.getCurrentInlineStyle();
    var linkKey = contentBlock.getEntityAt(startOffset);
    var entityType = "";
    if (linkKey) {
        var linkInstance = currentContent.getEntity(linkKey);
        entityType = linkInstance.getType();
    }
    return {
        inlineStyle: currentStyle,
        blockType: contentBlock.getType(),
        entityType: entityType,
        linkKey: linkKey,
        block: contentBlock
    };
};
exports.getSelectionInfo = getSelectionInfo;
/**
 * Remove a block from the ContentState
 */
var removeBlockFromMap = function (editorState, block) {
    var contentState = editorState.getCurrentContent();
    var removeBlockContentState = draft_js_1.Modifier.removeRange(contentState, new draft_js_1.SelectionState({
        anchorKey: block.getKey(),
        anchorOffset: 0,
        focusKey: block.getKey(),
        focusOffset: block.getLength(),
    }), 'backward');
    var blockMap = removeBlockContentState.getBlockMap().delete(block.getKey());
    return removeBlockContentState.merge({
        blockMap: blockMap,
        selectionAfter: contentState.getSelectionAfter()
    });
};
exports.removeBlockFromMap = removeBlockFromMap;
var atomicBlockExists = function (name, controls) {
    if (!controls) {
        return undefined;
    }
    return controls.find(function (control) {
        return control.type === "atomic" &&
            control.name === name &&
            control.atomicComponent !== undefined;
    });
};
exports.atomicBlockExists = atomicBlockExists;
var isGreaterThan = function (value, maxValue) {
    if (!maxValue) {
        return false;
    }
    return value > maxValue;
};
exports.isGreaterThan = isGreaterThan;
var clearInlineStyles = function (editorState, customStyles) {
    var styles = ['BOLD', 'ITALIC', 'UNDERLINE'];
    if (customStyles) {
        styles = styles.concat(Object.getOwnPropertyNames(customStyles));
    }
    return styles.reduce(function (newContentState, style) { return (draft_js_1.Modifier.removeInlineStyle(newContentState, editorState.getSelection(), style)); }, editorState.getCurrentContent());
};
exports.clearInlineStyles = clearInlineStyles;
var getEditorBounds = function (editor) {
    var fakeClientRect = (0, draft_js_1.getVisibleSelectionRect)(window);
    return {
        selectionRect: fakeClientRect ? {
            top: fakeClientRect === null || fakeClientRect === void 0 ? void 0 : fakeClientRect.top,
            left: fakeClientRect === null || fakeClientRect === void 0 ? void 0 : fakeClientRect.left
        } : null,
        editorRect: editor.getBoundingClientRect()
    };
};
exports.getEditorBounds = getEditorBounds;
var getLineNumber = function (editorState) {
    var currentBlockKey = editorState.getSelection().getStartKey();
    return editorState.getCurrentContent().getBlockMap()
        .keySeq().findIndex(function (k) { return k === currentBlockKey; });
};
exports.getLineNumber = getLineNumber;
//# sourceMappingURL=utils.js.map