"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var styles_1 = require("@mui/styles");
var styles = function (_a) {
    var palette = _a.palette;
    return (0, styles_1.createStyles)({
        root: {
            fontStyle: "italic",
            color: palette.grey[800],
            borderLeft: "4px solid " + palette.grey.A100
        }
    });
};
var Blockquote = function (props) {
    return (react_1.default.createElement("div", { className: props.classes.root }, props.children));
};
exports.default = (0, styles_1.withStyles)(styles, { withTheme: true })(Blockquote);
//# sourceMappingURL=Blockquote.js.map