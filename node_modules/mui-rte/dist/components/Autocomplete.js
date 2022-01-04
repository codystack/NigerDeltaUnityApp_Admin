"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var material_1 = require("@mui/material");
var styles_1 = require("@mui/styles");
var styles = function () { return (0, styles_1.createStyles)({
    container: {
        minWidth: "200px",
        position: "absolute",
        zIndex: 10
    },
    item: {
        cursor: "pointer"
    }
}); };
var Autocomplete = function (props) {
    if (!props.items.length) {
        return null;
    }
    var classes = props.classes;
    return (react_1.default.createElement(material_1.Paper, { className: classes.container, style: {
            top: props.top,
            left: props.left
        } },
        react_1.default.createElement(material_1.List, { dense: true }, props.items.map(function (item, index) { return (react_1.default.createElement(material_1.ListItem, { key: index, className: classes.item, selected: index === props.selectedIndex, onClick: function () { return props.onClick(index); } }, item.content)); }))));
};
exports.default = (0, styles_1.withStyles)(styles, { withTheme: true })(Autocomplete);
//# sourceMappingURL=Autocomplete.js.map