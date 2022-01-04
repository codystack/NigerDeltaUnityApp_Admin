"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var material_1 = require("@mui/material");
var Link = function (props) {
    var _a = props.contentState.getEntity(props.entityKey).getData(), url = _a.url, className = _a.className;
    return (react_1.default.createElement(material_1.Link, { href: url, className: className + " editor-anchor", target: "_blank" }, props.children));
};
exports.default = Link;
//# sourceMappingURL=Link.js.map