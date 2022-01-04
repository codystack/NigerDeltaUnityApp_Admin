"use strict";
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
var FormatBold_1 = __importDefault(require("@mui/icons-material/FormatBold"));
var FormatItalic_1 = __importDefault(require("@mui/icons-material/FormatItalic"));
var FormatUnderlined_1 = __importDefault(require("@mui/icons-material/FormatUnderlined"));
var StrikethroughS_1 = __importDefault(require("@mui/icons-material/StrikethroughS"));
var Highlight_1 = __importDefault(require("@mui/icons-material/Highlight"));
var Title_1 = __importDefault(require("@mui/icons-material/Title"));
var InsertLink_1 = __importDefault(require("@mui/icons-material/InsertLink"));
var PhotoLibrary_1 = __importDefault(require("@mui/icons-material/PhotoLibrary"));
var FormatListNumbered_1 = __importDefault(require("@mui/icons-material/FormatListNumbered"));
var FormatListBulleted_1 = __importDefault(require("@mui/icons-material/FormatListBulleted"));
var FormatQuote_1 = __importDefault(require("@mui/icons-material/FormatQuote"));
var Code_1 = __importDefault(require("@mui/icons-material/Code"));
var FormatClear_1 = __importDefault(require("@mui/icons-material/FormatClear"));
var Save_1 = __importDefault(require("@mui/icons-material/Save"));
var Undo_1 = __importDefault(require("@mui/icons-material/Undo"));
var Redo_1 = __importDefault(require("@mui/icons-material/Redo"));
var ToolbarButton_1 = __importDefault(require("./ToolbarButton"));
var utils_1 = require("../utils");
var STYLE_TYPES = [
    {
        label: 'H2',
        name: "title",
        style: 'header-two',
        icon: react_1.default.createElement(Title_1.default, null),
        type: "block"
    },
    {
        label: 'Bold',
        name: "bold",
        style: 'BOLD',
        icon: react_1.default.createElement(FormatBold_1.default, null),
        type: "inline"
    },
    {
        label: 'Italic',
        name: "italic",
        style: 'ITALIC',
        icon: react_1.default.createElement(FormatItalic_1.default, null),
        type: "inline"
    },
    {
        label: 'Underline',
        name: "underline",
        style: 'UNDERLINE',
        icon: react_1.default.createElement(FormatUnderlined_1.default, null),
        type: "inline"
    },
    {
        label: 'Strikethrough',
        name: "strikethrough",
        style: 'STRIKETHROUGH',
        icon: react_1.default.createElement(StrikethroughS_1.default, null),
        type: "inline"
    },
    {
        label: 'Highlight',
        name: "highlight",
        style: 'HIGHLIGHT',
        icon: react_1.default.createElement(Highlight_1.default, null),
        type: "inline"
    },
    {
        label: 'Undo',
        name: "undo",
        style: "UNDO",
        icon: react_1.default.createElement(Undo_1.default, null),
        type: "callback",
    },
    {
        label: 'Redo',
        name: "redo",
        style: "REDO",
        icon: react_1.default.createElement(Redo_1.default, null),
        type: "callback",
    },
    {
        label: 'Link',
        name: "link",
        style: 'LINK',
        icon: react_1.default.createElement(InsertLink_1.default, null),
        type: "callback",
        id: "link-control"
    },
    {
        label: 'Media',
        name: "media",
        style: 'IMAGE',
        icon: react_1.default.createElement(PhotoLibrary_1.default, null),
        type: "callback",
        id: "media-control"
    },
    {
        label: 'UL',
        name: "bulletList",
        style: 'unordered-list-item',
        icon: react_1.default.createElement(FormatListBulleted_1.default, null),
        type: "block"
    },
    {
        label: 'OL',
        name: "numberList",
        style: 'ordered-list-item',
        icon: react_1.default.createElement(FormatListNumbered_1.default, null),
        type: "block"
    },
    {
        label: 'Blockquote',
        name: "quote",
        style: 'blockquote',
        icon: react_1.default.createElement(FormatQuote_1.default, null),
        type: "block"
    },
    {
        label: 'Code Block',
        name: "code",
        style: 'code-block',
        icon: react_1.default.createElement(Code_1.default, null),
        type: "block"
    },
    {
        label: 'Clear',
        name: "clear",
        style: 'clear',
        icon: react_1.default.createElement(FormatClear_1.default, null),
        type: "callback"
    },
    {
        label: 'Save',
        name: "save",
        style: 'save',
        icon: react_1.default.createElement(Save_1.default, null),
        type: "callback"
    }
];
var Toolbar = function (props) {
    var _a = (0, react_1.useState)(props.controls ? [] : STYLE_TYPES), availableControls = _a[0], setAvailableControls = _a[1];
    var editorState = props.editorState;
    var id = props.inlineMode ? "-inline-toolbar" : "-toolbar";
    (0, react_1.useEffect)(function () {
        if (!props.controls) {
            return;
        }
        var filteredControls = [];
        var controls = props.controls.filter(function (control, index) { return props.controls.indexOf(control) >= index; });
        controls.forEach(function (name) {
            var style = STYLE_TYPES.find(function (style) { return style.name === name; });
            if (style) {
                filteredControls.push(style);
            }
            else if (props.customControls) {
                var customControl = props.customControls.find(function (style) { return style.name === name; });
                if (customControl && customControl.type !== "atomic" &&
                    (customControl.icon || customControl.component)) {
                    filteredControls.push({
                        id: customControl.id || (customControl.name + "Id"),
                        name: customControl.name,
                        label: customControl.name,
                        style: customControl.name.toUpperCase(),
                        icon: customControl.icon,
                        component: customControl.component,
                        type: customControl.type,
                        clickFnName: "onCustomClick"
                    });
                }
            }
        });
        setAvailableControls(filteredControls);
    }, [props.controls, props.customControls]);
    return (react_1.default.createElement("div", { id: "" + props.id + id, className: props.className }, availableControls.map(function (style) {
        if (props.inlineMode &&
            (style.type !== "inline" && (style.name !== "link" && style.name !== "clear"))) {
            return null;
        }
        var active = false;
        var action = props.onClick;
        if (!props.isActive) {
            active = false;
        }
        else if (style.type === "inline") {
            active = editorState.getCurrentInlineStyle().has(style.style);
        }
        else if (style.type === "block") {
            var selection = editorState.getSelection();
            var block = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
            if (block) {
                active = style.style === block.getType();
            }
        }
        else {
            if (style.style === "IMAGE" || style.style === "LINK") {
                active = style.style === (0, utils_1.getSelectionInfo)(editorState).entityType;
            }
        }
        return (react_1.default.createElement(ToolbarButton_1.default, { id: style.id, editorId: props.id, key: "key-" + style.label, active: active, label: style.label, onClick: action, style: style.style, type: style.type, icon: style.icon, component: style.component, inlineMode: props.inlineMode, disabled: props.disabled, size: props.size }));
    })));
};
exports.default = Toolbar;
//# sourceMappingURL=Toolbar.js.map