"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var immutable_1 = __importDefault(require("immutable"));
var classnames_1 = __importDefault(require("classnames"));
var styles_1 = require("@mui/styles");
var material_1 = require("@mui/material");
var draft_js_1 = require("draft-js");
var Toolbar_1 = __importDefault(require("./components/Toolbar"));
var Link_1 = __importDefault(require("./components/Link"));
var Media_1 = __importDefault(require("./components/Media"));
var Blockquote_1 = __importDefault(require("./components/Blockquote"));
var CodeBlock_1 = __importDefault(require("./components/CodeBlock"));
var UrlPopover_1 = __importDefault(require("./components/UrlPopover"));
var Autocomplete_1 = __importDefault(require("./components/Autocomplete"));
var utils_1 = require("./utils");
var styles = function (theme) {
    var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
    return (0, styles_1.createStyles)({
        root: ((_b = (_a = theme === null || theme === void 0 ? void 0 : theme.overrides) === null || _a === void 0 ? void 0 : _a.MUIRichTextEditor) === null || _b === void 0 ? void 0 : _b.root) || {},
        container: ((_d = (_c = theme === null || theme === void 0 ? void 0 : theme.overrides) === null || _c === void 0 ? void 0 : _c.MUIRichTextEditor) === null || _d === void 0 ? void 0 : _d.container) || {
            margin: theme.spacing(1, 0, 0, 0),
            position: "relative",
            fontFamily: theme.typography.body1.fontFamily,
            fontSize: theme.typography.body1.fontSize,
            '& figure': {
                margin: 0
            }
        },
        inheritFontSize: ((_g = (_f = theme === null || theme === void 0 ? void 0 : theme.overrides) === null || _f === void 0 ? void 0 : _f.MUIRichTextEditor) === null || _g === void 0 ? void 0 : _g.inheritFontSize) || {
            fontSize: "inherit"
        },
        editor: ((_j = (_h = theme === null || theme === void 0 ? void 0 : theme.overrides) === null || _h === void 0 ? void 0 : _h.MUIRichTextEditor) === null || _j === void 0 ? void 0 : _j.editor) || {},
        editorContainer: ((_l = (_k = theme === null || theme === void 0 ? void 0 : theme.overrides) === null || _k === void 0 ? void 0 : _k.MUIRichTextEditor) === null || _l === void 0 ? void 0 : _l.editorContainer) || {
            margin: theme.spacing(1, 0, 0, 0),
            cursor: "text",
            width: "100%",
            padding: theme.spacing(0, 0, 1, 0)
        },
        editorReadOnly: ((_o = (_m = theme === null || theme === void 0 ? void 0 : theme.overrides) === null || _m === void 0 ? void 0 : _m.MUIRichTextEditor) === null || _o === void 0 ? void 0 : _o.editorReadOnly) || {
            borderBottom: "none"
        },
        error: ((_q = (_p = theme === null || theme === void 0 ? void 0 : theme.overrides) === null || _p === void 0 ? void 0 : _p.MUIRichTextEditor) === null || _q === void 0 ? void 0 : _q.error) || {
            borderBottom: "2px solid red"
        },
        hidePlaceholder: ((_s = (_r = theme === null || theme === void 0 ? void 0 : theme.overrides) === null || _r === void 0 ? void 0 : _r.MUIRichTextEditor) === null || _s === void 0 ? void 0 : _s.hidePlaceholder) || {
            display: "none"
        },
        placeHolder: ((_u = (_t = theme === null || theme === void 0 ? void 0 : theme.overrides) === null || _t === void 0 ? void 0 : _t.MUIRichTextEditor) === null || _u === void 0 ? void 0 : _u.placeHolder) || {
            color: theme.palette.grey[600],
            position: "absolute",
            outline: "none"
        },
        linkPopover: ((_w = (_v = theme === null || theme === void 0 ? void 0 : theme.overrides) === null || _v === void 0 ? void 0 : _v.MUIRichTextEditor) === null || _w === void 0 ? void 0 : _w.linkPopover) || {
            padding: theme.spacing(2, 2, 2, 2)
        },
        linkTextField: ((_y = (_x = theme === null || theme === void 0 ? void 0 : theme.overrides) === null || _x === void 0 ? void 0 : _x.MUIRichTextEditor) === null || _y === void 0 ? void 0 : _y.linkTextField) || {
            width: "100%"
        },
        anchorLink: ((_0 = (_z = theme === null || theme === void 0 ? void 0 : theme.overrides) === null || _z === void 0 ? void 0 : _z.MUIRichTextEditor) === null || _0 === void 0 ? void 0 : _0.anchorLink) || {},
        toolbar: ((_2 = (_1 = theme === null || theme === void 0 ? void 0 : theme.overrides) === null || _1 === void 0 ? void 0 : _1.MUIRichTextEditor) === null || _2 === void 0 ? void 0 : _2.toolbar) || {},
        inlineToolbar: ((_4 = (_3 = theme === null || theme === void 0 ? void 0 : theme.overrides) === null || _3 === void 0 ? void 0 : _3.MUIRichTextEditor) === null || _4 === void 0 ? void 0 : _4.inlineToolbar) || {
            maxWidth: "180px",
            position: "absolute",
            padding: "5px",
            zIndex: 10
        }
    });
};
var blockRenderMap = immutable_1.default.Map({
    'blockquote': {
        element: "blockquote",
        wrapper: react_1.default.createElement(Blockquote_1.default, null)
    },
    'code-block': {
        element: "pre",
        wrapper: react_1.default.createElement(CodeBlock_1.default, null)
    }
});
var styleRenderMap = {
    'STRIKETHROUGH': {
        textDecoration: "line-through"
    },
    'HIGHLIGHT': {
        backgroundColor: "yellow"
    }
};
var hasCommandModifier = draft_js_1.KeyBindingUtil.hasCommandModifier;
var autocompleteMinSearchCharCount = 2;
var lineHeight = 26;
var defaultInlineToolbarControls = ["bold", "italic", "underline", "clear"];
var findLinkEntities = function (contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(function (character) {
        var entityKey = character.getEntity();
        return (entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'LINK');
    }, callback);
};
var findDecoWithRegex = function (regex, contentBlock, callback) {
    var text = contentBlock.getText();
    var matchArr, start;
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length);
    }
};
var useEditorState = function (props) {
    var decorators = [
        {
            strategy: findLinkEntities,
            component: Link_1.default,
        }
    ];
    if (props.decorators) {
        props.decorators.forEach(function (deco) { return decorators.push({
            strategy: function (contentBlock, callback) {
                findDecoWithRegex(deco.regex, contentBlock, callback);
            },
            component: deco.component
        }); });
    }
    var decorator = new draft_js_1.CompositeDecorator(decorators);
    var defaultValue = props.defaultValue || props.value;
    return (defaultValue)
        ? draft_js_1.EditorState.createWithContent((0, draft_js_1.convertFromRaw)(JSON.parse(defaultValue)), decorator)
        : draft_js_1.EditorState.createEmpty(decorator);
};
var MUIRichTextEditor = function (props, ref) {
    var _a, _b, _c;
    var classes = props.classes, controls = props.controls, customControls = props.customControls;
    var _d = (0, react_1.useState)({}), state = _d[0], setState = _d[1];
    var _f = (0, react_1.useState)(false), focus = _f[0], setFocus = _f[1];
    var _g = (0, react_1.useState)(""), searchTerm = _g[0], setSearchTerm = _g[1];
    var _h = (0, react_1.useState)(0), selectedIndex = _h[0], setSelectedIndex = _h[1];
    var _j = (0, react_1.useState)(function () { return useEditorState(props); }), editorState = _j[0], setEditorState = _j[1];
    var _k = (0, react_1.useState)(""), focusMediaKey = _k[0], setFocusMediaKey = _k[1];
    var editorRef = (0, react_1.useRef)(null);
    var editorId = props.id || "mui-rte";
    var toolbarPositionRef = (0, react_1.useRef)(undefined);
    var editorStateRef = (0, react_1.useRef)(editorState);
    var autocompleteRef = (0, react_1.useRef)(undefined);
    var autocompleteSelectionStateRef = (0, react_1.useRef)(undefined);
    var autocompletePositionRef = (0, react_1.useRef)(undefined);
    var autocompleteLimit = props.autocomplete ? props.autocomplete.suggestLimit || 5 : 5;
    var isFirstFocus = (0, react_1.useRef)(true);
    var customBlockMapRef = (0, react_1.useRef)(undefined);
    var customStyleMapRef = (0, react_1.useRef)(undefined);
    var isFocusedWithMouse = (0, react_1.useRef)(false);
    var selectionRef = (0, react_1.useRef)({
        start: 0,
        end: 0
    });
    /**
     * Exposed methods
     */
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        focus: function () {
            handleFocus();
        },
        save: function () {
            handleSave();
        },
        insertAtomicBlock: function (name, data) {
            handleInsertAtomicBlockSync(name, data);
        },
        insertAtomicBlockSync: function (name, data) {
            handleInsertAtomicBlockSync(name, data);
        },
        insertAtomicBlockAsync: function (name, promise, placeholder) {
            handleInsertAtomicBlockAsync(name, promise, placeholder);
        }
    }); });
    (0, react_1.useEffect)(function () {
        var editorState = useEditorState(props);
        setEditorState(editorState);
        toggleMouseUpListener(true);
        return function () {
            toggleMouseUpListener();
        };
    }, [props.value, props.defaultValue]);
    (0, react_1.useEffect)(function () {
        if (props.onChange) {
            props.onChange(editorState);
        }
        editorStateRef.current = editorState;
    }, [editorState]);
    (0, react_1.useEffect)(function () {
        toolbarPositionRef.current = state.toolbarPosition;
    }, [state.toolbarPosition]);
    (0, react_1.useEffect)(function () {
        if (searchTerm.length < autocompleteMinSearchCharCount) {
            setSelectedIndex(0);
        }
    }, [searchTerm]);
    var clearSearch = function () {
        setSearchTerm("");
        autocompletePositionRef.current = undefined;
        autocompleteSelectionStateRef.current = undefined;
    };
    var handleMouseUp = function (event) {
        var nodeName = event.target.nodeName;
        clearSearch();
        if (nodeName === "IMG" || nodeName === "VIDEO") {
            return;
        }
        setTimeout(function () {
            var _a;
            var selection = editorStateRef.current.getSelection();
            if (selection.isCollapsed() || (toolbarPositionRef !== undefined &&
                selectionRef.current.start === selection.getStartOffset() &&
                selectionRef.current.end === selection.getEndOffset())) {
                var selectionInfo = (0, utils_1.getSelectionInfo)(editorStateRef.current);
                if (selectionInfo.entityType === "IMAGE") {
                    focusMedia(selectionInfo.block);
                    return;
                }
                setState(__assign(__assign({}, state), { toolbarPosition: undefined }));
                return;
            }
            selectionRef.current = {
                start: selection.getStartOffset(),
                end: selection.getEndOffset()
            };
            var editor = (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.editor;
            if (!editor) {
                return;
            }
            var _b = (0, utils_1.getEditorBounds)(editor), editorRect = _b.editorRect, selectionRect = _b.selectionRect;
            if (!selectionRect) {
                return;
            }
            var position = {
                top: editor.offsetTop - 48 + (selectionRect.top - editorRect.top),
                left: editor.offsetLeft + (selectionRect.left - editorRect.left)
            };
            setState(__assign(__assign({}, state), { toolbarPosition: position }));
        }, 1);
    };
    var findAutocompleteStrategy = function (chars) {
        if (!props.autocomplete) {
            return undefined;
        }
        var acArray = props.autocomplete.strategies.filter(function (ac) { return ac.triggerChar === chars; });
        if (acArray.length) {
            return acArray[0];
        }
        return undefined;
    };
    var updateAutocompletePosition = function () {
        var _a;
        var editor = (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.editor;
        if (!editor) {
            return;
        }
        var _b = (0, utils_1.getEditorBounds)(editor), editorRect = _b.editorRect, selectionRect = _b.selectionRect;
        var line = (0, utils_1.getLineNumber)(editorState);
        var top = selectionRect ? selectionRect.top : editorRect.top + (lineHeight * line);
        var left = selectionRect ? selectionRect.left : editorRect.left;
        var position = {
            top: editor.offsetTop + (top - editorRect.top) + lineHeight,
            left: editor.offsetLeft + (left - editorRect.left)
        };
        if (!autocompleteSelectionStateRef.current) {
            autocompleteSelectionStateRef.current = editorStateRef.current.getSelection();
        }
        autocompletePositionRef.current = position;
    };
    var insertAutocompleteSuggestionAsAtomicBlock = function (name, selection, value) {
        var block = (0, utils_1.atomicBlockExists)(name, props.customControls);
        if (!block) {
            return;
        }
        var contentState = draft_js_1.Modifier.removeRange(editorStateRef.current.getCurrentContent(), selection, "forward");
        var newEditorState = draft_js_1.EditorState.push(editorStateRef.current, contentState, "remove-range");
        var withAtomicBlock = insertAtomicBlock(newEditorState, name.toUpperCase(), {
            value: value
        }, {
            selection: newEditorState.getCurrentContent().getSelectionAfter()
        });
        handleChange(withAtomicBlock);
    };
    var insertAutocompleteSuggestionAsText = function (selection, value) {
        var currentContentState = editorState.getCurrentContent();
        var entityKey = currentContentState.createEntity("AC_ITEM", 'IMMUTABLE').getLastCreatedEntityKey();
        var contentState = draft_js_1.Modifier.replaceText(editorStateRef.current.getCurrentContent(), selection, value, editorStateRef.current.getCurrentInlineStyle(), entityKey);
        var newEditorState = draft_js_1.EditorState.push(editorStateRef.current, contentState, "insert-characters");
        if (autocompleteRef.current.insertSpaceAfter === false) {
            handleChange(newEditorState);
        }
        else {
            var addSpaceState = draft_js_1.Modifier.insertText(newEditorState.getCurrentContent(), newEditorState.getSelection(), " ", newEditorState.getCurrentInlineStyle());
            handleChange(draft_js_1.EditorState.push(newEditorState, addSpaceState, "insert-characters"));
        }
    };
    var handleAutocompleteSelected = function (index) {
        var itemIndex = index || selectedIndex;
        var items = getAutocompleteItems();
        if (items.length > itemIndex) {
            var item = items[itemIndex];
            var currentSelection = autocompleteSelectionStateRef.current;
            var offset = currentSelection.getFocusOffset() + searchTerm.length + 1;
            var newSelection = currentSelection.merge({
                'focusOffset': offset
            });
            if (autocompleteRef.current.atomicBlockName) {
                var name_1 = autocompleteRef.current.atomicBlockName;
                insertAutocompleteSuggestionAsAtomicBlock(name_1, newSelection, item.value);
            }
            else {
                insertAutocompleteSuggestionAsText(newSelection, item.value);
            }
        }
        handleAutocompleteClosed();
    };
    var handleAutocompleteClosed = function () {
        clearSearch();
        setSelectedIndex(0);
        refocus();
    };
    var getAutocompleteItems = function () {
        if (searchTerm.length < autocompleteMinSearchCharCount) {
            return [];
        }
        return autocompleteRef.current.items
            .filter(function (item) { return (item.keys.filter(function (key) { return key.includes(searchTerm); }).length > 0); })
            .splice(0, autocompleteLimit);
    };
    var handleChange = function (state) {
        setEditorState(state);
    };
    var handleBeforeInput = function (chars, editorState) {
        if (chars === " " && searchTerm.length) {
            clearSearch();
        }
        else if (autocompleteSelectionStateRef.current) {
            setSearchTerm(searchTerm + chars);
        }
        else {
            var strategy = findAutocompleteStrategy(chars);
            if (strategy) {
                autocompleteRef.current = strategy;
                updateAutocompletePosition();
            }
        }
        return isMaxLengthHandled(editorState, 1);
    };
    var handleEditorFocus = function () {
        handleFocus();
        if (isFocusedWithMouse.current === true) {
            isFocusedWithMouse.current = false;
            return;
        }
        var nextEditorState = draft_js_1.EditorState.forceSelection(editorState, editorState.getSelection());
        setTimeout(function () { return (setEditorState(draft_js_1.EditorState.moveFocusToEnd(nextEditorState))); }, 0);
    };
    var handlePlaceholderFocus = function () {
        if (isFirstFocus.current === false) {
            focusEditor();
            return;
        }
        handleFocus();
        isFirstFocus.current = false;
    };
    var handleFocus = function () {
        focusEditor();
        if (props.onFocus) {
            props.onFocus();
        }
    };
    var focusEditor = function () {
        setFocus(true);
        setTimeout(function () { var _a; return (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, 0);
    };
    var handleBlur = function () {
        isFocusedWithMouse.current = false;
        setFocus(false);
        if (props.onBlur) {
            props.onBlur();
        }
        if (!state.anchorUrlPopover) {
            setState(__assign(__assign({}, state), { toolbarPosition: undefined }));
        }
    };
    var handleMouseDown = function () {
        isFocusedWithMouse.current = true;
    };
    var handleClearFormat = function () {
        if (customStyleMapRef.current === undefined) {
            return;
        }
        var withoutStyles = (0, utils_1.clearInlineStyles)(editorState, customStyleMapRef.current);
        var selectionInfo = (0, utils_1.getSelectionInfo)(editorState);
        var newEditorState = draft_js_1.EditorState.push(editorState, withoutStyles, 'change-inline-style');
        setEditorState(draft_js_1.RichUtils.toggleBlockType(newEditorState, selectionInfo.blockType));
    };
    var handleSave = function () {
        if (props.onSave) {
            props.onSave(JSON.stringify((0, draft_js_1.convertToRaw)(editorState.getCurrentContent())));
        }
    };
    var handleInsertAtomicBlockSync = function (name, data) {
        var block = (0, utils_1.atomicBlockExists)(name, props.customControls);
        if (!block) {
            return;
        }
        var newEditorState = insertAtomicBlock(editorState, block.name.toUpperCase(), data, {
            selection: editorState.getCurrentContent().getSelectionAfter()
        });
        updateStateForPopover(newEditorState);
    };
    var handleInsertAtomicBlockAsync = function (name, promise, placeholder) {
        var selection = insertAsyncAtomicBlockPlaceholder(name, placeholder);
        var offset = selection.getFocusOffset() + 1;
        var newSelection = selection.merge({
            'focusOffset': offset
        });
        promise.then(function (response) {
            var newEditorState = insertAtomicBlock(editorStateRef.current, name, response.data, {
                selection: newSelection
            });
            handleChange(newEditorState);
        }).catch(function (error) {
            if (error) {
                return;
            }
            var newContentState = draft_js_1.Modifier.removeRange(editorStateRef.current.getCurrentContent(), newSelection, "forward");
            handleChange(draft_js_1.EditorState.push(editorStateRef.current, newContentState, "remove-range"));
        });
    };
    var insertAsyncAtomicBlockPlaceholder = function (name, placeholder) {
        var placeholderName = placeholder || name + "...";
        var currentContentState = editorStateRef.current.getCurrentContent();
        var entityKey = currentContentState.createEntity("ASYNC_ATOMICBLOCK", 'IMMUTABLE').getLastCreatedEntityKey();
        var contentState = draft_js_1.Modifier.insertText(editorStateRef.current.getCurrentContent(), currentContentState.getSelectionAfter(), placeholderName, undefined, entityKey);
        var selection = currentContentState.getSelectionAfter();
        var newEditorState = draft_js_1.EditorState.push(editorStateRef.current, contentState, "insert-characters");
        handleChange(newEditorState);
        return selection;
    };
    var handleKeyCommand = function (command, editorState) {
        var newState = draft_js_1.RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            handleChange(newState);
            return "handled";
        }
        else {
            if (command.includes("mui-autocomplete")) {
                if (command === "mui-autocomplete-insert") {
                    handleAutocompleteSelected();
                }
                if (command === "mui-autocomplete-end") {
                    handleAutocompleteClosed();
                }
                return "handled";
            }
            if (props.keyCommands) {
                var keyCommand = props.keyCommands.find(function (comm) { return comm.name === command; });
                if (keyCommand) {
                    var newState_1 = keyCommand.callback(editorState);
                    handleChange(newState_1);
                    return "handled";
                }
            }
        }
        return "not-handled";
    };
    var handleCustomClick = function (style, id) {
        if (!props.customControls) {
            return;
        }
        for (var _i = 0, _a = props.customControls; _i < _a.length; _i++) {
            var control = _a[_i];
            if (control.name.toUpperCase() === style) {
                if (control.onClick) {
                    setTimeout(function () { var _a; return (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.blur(); }, 0);
                    var newState = control.onClick(editorState, control.name, document.getElementById(id));
                    if (newState) {
                        if (newState.getSelection().isCollapsed()) {
                            setEditorState(newState);
                        }
                        else {
                            updateStateForPopover(newState);
                        }
                    }
                    else {
                        if (!editorState.getSelection().isCollapsed()) {
                            refocus();
                        }
                    }
                }
                break;
            }
        }
    };
    var handleUndo = function () {
        setEditorState(draft_js_1.EditorState.undo(editorState));
    };
    var handleRedo = function () {
        setEditorState(draft_js_1.EditorState.redo(editorState));
    };
    var handlePrompt = function (lastState, type, inlineMode) {
        var selectionInfo = (0, utils_1.getSelectionInfo)(lastState);
        var contentState = lastState.getCurrentContent();
        var linkKey = selectionInfo.linkKey;
        var data = undefined;
        if (linkKey) {
            var linkInstance = contentState.getEntity(linkKey);
            data = linkInstance.getData();
        }
        setState({
            urlData: data,
            urlKey: linkKey,
            toolbarPosition: !inlineMode ? undefined : state.toolbarPosition,
            anchorUrlPopover: !inlineMode ? document.getElementById(editorId + "-" + type + "-control-button")
                : document.getElementById(editorId + "-" + type + "-control-button-toolbar"),
            urlIsMedia: type === "media" ? true : undefined
        });
    };
    var handlePromptForLink = function (inlineMode) {
        var selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
            handlePrompt(editorState, "link", inlineMode);
        }
    };
    var handlePromptForMedia = function (inlineMode, newState) {
        var lastState = newState || editorState;
        handlePrompt(lastState, "media", inlineMode);
    };
    var handleConfirmPrompt = function (isMedia) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (isMedia) {
            confirmMedia.apply(void 0, args);
            return;
        }
        confirmLink.apply(void 0, args);
    };
    var handleToolbarClick = function (style, type, id, inlineMode) {
        if (type === "inline") {
            return toggleInlineStyle(style);
        }
        if (type === "block") {
            return toggleBlockType(style);
        }
        switch (style) {
            case "UNDO":
                handleUndo();
                break;
            case "REDO":
                handleRedo();
                break;
            case "LINK":
                handlePromptForLink(inlineMode);
                break;
            case "IMAGE":
                handlePromptForMedia(inlineMode);
                break;
            case "clear":
                handleClearFormat();
                break;
            case "save":
                handleSave();
                break;
            default:
                handleCustomClick(style, id);
        }
    };
    var handlePastedText = function (text, _html, editorState) {
        return isMaxLengthHandled(editorState, text.length);
    };
    var handleReturn = function (_e, editorState) {
        return isMaxLengthHandled(editorState, 1);
    };
    var isMaxLengthHandled = function (editorState, nextLength) {
        var currentLength = editorState.getCurrentContent().getPlainText('').length;
        return (0, utils_1.isGreaterThan)(currentLength + nextLength, props.maxLength) ? "handled" : "not-handled";
    };
    var toggleMouseUpListener = function (addAfter) {
        var _a;
        if (addAfter === void 0) { addAfter = false; }
        var editor = (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.editor;
        if (!editor) {
            return;
        }
        editor.removeEventListener("mouseup", handleMouseUp);
        if (addAfter) {
            editor.addEventListener("mouseup", handleMouseUp);
        }
    };
    var removeLink = function () {
        var selection = editorState.getSelection();
        setEditorState(draft_js_1.RichUtils.toggleLink(editorState, selection, null));
    };
    var confirmLink = function (url) {
        var urlKey = state.urlKey;
        if (!url) {
            if (urlKey) {
                removeLink();
            }
            dismissPopover();
            return;
        }
        var contentState = editorState.getCurrentContent();
        var replaceEditorState = editorState;
        var data = {
            url: url,
            className: classes.anchorLink
        };
        if (urlKey) {
            contentState.replaceEntityData(urlKey, data);
            replaceEditorState = draft_js_1.EditorState.push(editorState, contentState, "apply-entity");
        }
        else {
            var contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', data);
            var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            var newEditorState = draft_js_1.EditorState.set(editorState, { currentContent: contentStateWithEntity });
            replaceEditorState = draft_js_1.RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey);
        }
        updateStateForPopover(replaceEditorState);
    };
    var removeMedia = function () {
        var blockKey = editorState.getSelection().getStartKey();
        var contentState = editorState.getCurrentContent();
        var mediaBlock = contentState.getBlockForKey(blockKey);
        var newContentState = (0, utils_1.removeBlockFromMap)(editorState, mediaBlock);
        var newEditorState = draft_js_1.EditorState.push(editorState, newContentState, "remove-range");
        setEditorState(newEditorState);
    };
    var confirmMedia = function (url, width, height, alignment, type) {
        var urlKey = state.urlKey;
        if (!url) {
            if (urlKey) {
                removeMedia();
            }
            dismissPopover();
            return;
        }
        var contentState = editorState.getCurrentContent();
        var data = {
            url: url,
            width: width,
            height: height,
            alignment: alignment,
            type: type
        };
        if (urlKey) {
            contentState.replaceEntityData(urlKey, data);
            var newEditorState = draft_js_1.EditorState.push(editorState, contentState, "apply-entity");
            updateStateForPopover(draft_js_1.EditorState.forceSelection(newEditorState, newEditorState.getCurrentContent().getSelectionAfter()));
        }
        else {
            var newEditorState = insertAtomicBlock(editorState, "IMAGE", data);
            updateStateForPopover(draft_js_1.EditorState.forceSelection(newEditorState, newEditorState.getCurrentContent().getSelectionAfter()));
        }
        setFocusMediaKey("");
    };
    var updateStateForPopover = function (editorState) {
        setEditorState(editorState);
        dismissPopover();
    };
    var dismissPopover = function () {
        refocus();
        setState(__assign(__assign({}, state), { anchorUrlPopover: undefined, urlKey: undefined, urlIsMedia: undefined, urlData: undefined }));
    };
    var refocus = function () {
        setTimeout(function () { var _a; return (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.blur(); }, 0);
        setTimeout(function () { var _a; return (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, 1);
    };
    var toggleBlockType = function (blockType) {
        setEditorState(draft_js_1.RichUtils.toggleBlockType(editorState, blockType));
    };
    var toggleInlineStyle = function (inlineStyle) {
        setEditorState(draft_js_1.RichUtils.toggleInlineStyle(editorState, inlineStyle));
    };
    var focusMedia = function (block) {
        var newSeletion = draft_js_1.SelectionState.createEmpty(block.getKey());
        var newEditorState = draft_js_1.EditorState.forceSelection(editorStateRef.current, newSeletion);
        editorStateRef.current = newEditorState;
        setFocusMediaKey(block.getKey());
        setEditorState(newEditorState);
        handlePromptForMedia(false, newEditorState);
    };
    var getStyleMap = function () {
        if (customStyleMapRef.current === undefined) {
            setupStyleMap();
        }
        return customStyleMapRef.current;
    };
    var setupStyleMap = function () {
        var _a;
        var customStyleMap = JSON.parse(JSON.stringify(styleRenderMap));
        (_a = props.customControls) === null || _a === void 0 ? void 0 : _a.filter(function (control) { return control.type === "inline" && control.inlineStyle; }).forEach(function (control) {
            customStyleMap[control.name.toUpperCase()] = control.inlineStyle;
        });
        customStyleMapRef.current = customStyleMap;
    };
    var getBlockMap = function () {
        if (customBlockMapRef.current === undefined) {
            setupBlockMap();
        }
        return customBlockMapRef.current;
    };
    var setupBlockMap = function () {
        var _a;
        var customBlockMap = {};
        (_a = props.customControls) === null || _a === void 0 ? void 0 : _a.filter(function (control) { return control.type === "block" && control.blockWrapper; }).forEach(function (control) {
            customBlockMap[control.name.toUpperCase()] = {
                element: "div",
                wrapper: control.blockWrapper
            };
        });
        customBlockMapRef.current = draft_js_1.DefaultDraftBlockRenderMap.merge(blockRenderMap, immutable_1.default.Map(customBlockMap));
    };
    var blockRenderer = function (contentBlock) {
        var blockType = contentBlock.getType();
        if (blockType === 'atomic') {
            var contentState = editorState.getCurrentContent();
            var entity = contentBlock.getEntityAt(0);
            if (entity) {
                var type = contentState.getEntity(entity).getType();
                if (type === "IMAGE") {
                    return {
                        component: Media_1.default,
                        editable: false,
                        props: {
                            onClick: focusMedia,
                            readOnly: props.readOnly,
                            focusKey: focusMediaKey
                        }
                    };
                }
                else {
                    var block = (0, utils_1.atomicBlockExists)(type.toLowerCase(), props.customControls);
                    if (block) {
                        return {
                            component: block.atomicComponent,
                            editable: false,
                            props: contentState.getEntity(contentBlock.getEntityAt(0)).getData()
                        };
                    }
                }
            }
        }
        return null;
    };
    var styleRenderer = function (style) {
        var customStyleMap = getStyleMap();
        var styleNames = style.toJS();
        return styleNames.reduce(function (styles, styleName) {
            styles = customStyleMap[styleName];
            return styles;
        }, {});
    };
    var insertAtomicBlock = function (editorState, type, data, options) {
        var contentState = editorState.getCurrentContent();
        var contentStateWithEntity = contentState.createEntity(type, 'IMMUTABLE', data);
        var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        var newEditorStateRaw = draft_js_1.EditorState.set(editorState, __assign({ currentContent: contentStateWithEntity }, options));
        return draft_js_1.AtomicBlockUtils.insertAtomicBlock(newEditorStateRaw, entityKey, ' ');
    };
    var getAutocompleteKeyEvent = function (keyboardEvent) {
        var itemsLength = getAutocompleteItems().length;
        var limit = autocompleteLimit > itemsLength ? itemsLength : autocompleteLimit;
        switch (keyboardEvent.key) {
            case "ArrowDown":
                if ((selectedIndex === 0 && itemsLength === 1) || (selectedIndex + 1 === limit)) {
                    setSelectedIndex(0);
                }
                else {
                    setSelectedIndex(selectedIndex + 1 < limit ? selectedIndex + 1 : selectedIndex);
                }
                return "mui-autocomplete-navigate";
            case "ArrowUp":
                if (selectedIndex) {
                    setSelectedIndex(selectedIndex - 1);
                }
                else {
                    setSelectedIndex(limit - 1);
                }
                return "mui-autocomplete-navigate";
            case "Enter":
                return "mui-autocomplete-insert";
            case "Escape":
                return "mui-autocomplete-end";
            default:
                return null;
        }
    };
    var updateSearchTermForKeyBinding = function (keyBinding) {
        var text = editorStateRef.current.getCurrentContent().getLastBlock().getText();
        if (keyBinding === "backspace"
            && autocompleteRef.current
            && text.substr(text.length - 1) === autocompleteRef.current.triggerChar) {
            clearSearch();
        }
        else if (autocompletePositionRef.current
            && keyBinding === "backspace"
            && searchTerm.length) {
            setSearchTerm(searchTerm.substr(0, searchTerm.length - 1));
        }
        else if (!autocompletePositionRef.current &&
            (keyBinding === "backspace"
                || keyBinding === "split-block")) {
            clearSearch();
        }
    };
    var keyBindingFn = function (e) {
        if (hasCommandModifier(e) && props.keyCommands) {
            var comm = props.keyCommands.find(function (comm) { return comm.key === e.keyCode; });
            if (comm) {
                return comm.name;
            }
        }
        if (searchTerm) {
            var autocompleteEvent = getAutocompleteKeyEvent(e);
            if (autocompleteEvent) {
                return autocompleteEvent;
            }
        }
        var keyBinding = (0, draft_js_1.getDefaultKeyBinding)(e);
        updateSearchTermForKeyBinding(keyBinding);
        return keyBinding;
    };
    var renderToolbar = props.toolbar === undefined || props.toolbar;
    var inlineToolbarControls = props.inlineToolbarControls || defaultInlineToolbarControls;
    var editable = props.readOnly === undefined || !props.readOnly;
    var className = "";
    var placeholder = null;
    if (!focus) {
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            placeholder = (react_1.default.createElement("div", { className: (0, classnames_1.default)(classes.editorContainer, classes.placeHolder, (_a = {},
                    _a[classes.error] = props.error,
                    _a)), tabIndex: 0, onFocus: handlePlaceholderFocus }, props.label || ""));
            className = classes.hidePlaceholder;
        }
    }
    return (react_1.default.createElement("div", { id: editorId + "-root", className: classes.root },
        react_1.default.createElement("div", { id: editorId + "-container", className: (0, classnames_1.default)(classes.container, (_b = {},
                _b[classes.inheritFontSize] = props.inheritFontSize,
                _b)) },
            props.autocomplete && autocompletePositionRef.current ?
                react_1.default.createElement(Autocomplete_1.default, { items: getAutocompleteItems(), top: autocompletePositionRef.current.top, left: autocompletePositionRef.current.left, onClick: handleAutocompleteSelected, selectedIndex: selectedIndex })
                : null,
            props.inlineToolbar && editable && state.toolbarPosition ?
                react_1.default.createElement(material_1.Paper, { className: classes.inlineToolbar, style: {
                        top: state.toolbarPosition.top,
                        left: state.toolbarPosition.left
                    } },
                    react_1.default.createElement(Toolbar_1.default, { id: editorId, editorState: editorState, onClick: handleToolbarClick, controls: inlineToolbarControls, customControls: customControls, inlineMode: true, isActive: true }))
                : null,
            renderToolbar ?
                react_1.default.createElement(Toolbar_1.default, { id: editorId, editorState: editorState, onClick: handleToolbarClick, controls: controls, customControls: customControls, className: classes.toolbar, disabled: !editable, size: props.toolbarButtonSize, isActive: focus })
                : null,
            placeholder,
            react_1.default.createElement("div", { id: editorId + "-editor", className: classes.editor },
                react_1.default.createElement("div", { id: editorId + "-editor-container", className: (0, classnames_1.default)(className, classes.editorContainer, (_c = {},
                        _c[classes.editorReadOnly] = !editable,
                        _c[classes.error] = props.error,
                        _c)), onMouseDown: handleMouseDown, onBlur: handleBlur },
                    react_1.default.createElement(draft_js_1.Editor, __assign({ blockRenderMap: getBlockMap(), blockRendererFn: blockRenderer, customStyleFn: styleRenderer, editorState: editorState, onChange: handleChange, onFocus: handleEditorFocus, readOnly: props.readOnly, handleKeyCommand: handleKeyCommand, handleBeforeInput: handleBeforeInput, handlePastedText: handlePastedText, handleReturn: handleReturn, keyBindingFn: keyBindingFn, ref: editorRef }, props.draftEditorProps)))),
            state.anchorUrlPopover ?
                react_1.default.createElement(UrlPopover_1.default, { data: state.urlData, anchor: state.anchorUrlPopover, onConfirm: handleConfirmPrompt, isMedia: state.urlIsMedia })
                : null)));
};
exports.default = (0, styles_1.withStyles)(styles, { withTheme: true, name: "MUIRichTextEditor" })((0, react_1.forwardRef)(MUIRichTextEditor));
//# sourceMappingURL=MUIRichTextEditor.js.map