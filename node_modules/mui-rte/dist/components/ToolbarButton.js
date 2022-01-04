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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var IconButton_1 = __importDefault(require("@mui/material/IconButton"));
var ToolbarButton = function (props) {
    var size = !props.inlineMode ? (props.size || "medium") : "small";
    var toolbarId = props.inlineMode ? "-toolbar" : "";
    var editorId = props.editorId || "mui-rte";
    var elemId = editorId + "-" + (props.id || props.label) + "-button" + toolbarId;
    var sharedProps = {
        id: elemId,
        onMouseDown: function (e) {
            e.preventDefault();
            if (props.onClick) {
                props.onClick(props.style, props.type, elemId, props.inlineMode);
            }
        },
        disabled: props.disabled || false
    };
    if (props.icon) {
        return (react_1.default.createElement(IconButton_1.default, __assign({}, sharedProps, { "aria-label": props.label, color: props.active ? "primary" : "default", size: size }), props.icon));
    }
    if (props.component) {
        return (react_1.default.createElement(props.component, __assign({}, sharedProps, { active: props.active || false })));
    }
    return null;
};
exports.default = ToolbarButton;
//# sourceMappingURL=ToolbarButton.js.map