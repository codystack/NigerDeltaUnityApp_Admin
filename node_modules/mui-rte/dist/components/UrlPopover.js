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
var Button_1 = __importDefault(require("@mui/material/Button"));
var Grid_1 = __importDefault(require("@mui/material/Grid"));
var Popover_1 = __importDefault(require("@mui/material/Popover"));
var TextField_1 = __importDefault(require("@mui/material/TextField"));
var styles_1 = require("@mui/styles");
var ButtonGroup_1 = __importDefault(require("@mui/material/ButtonGroup"));
var InsertPhoto_1 = __importDefault(require("@mui/icons-material/InsertPhoto"));
var Movie_1 = __importDefault(require("@mui/icons-material/Movie"));
var Check_1 = __importDefault(require("@mui/icons-material/Check"));
var DeleteOutline_1 = __importDefault(require("@mui/icons-material/DeleteOutline"));
var FormatAlignCenter_1 = __importDefault(require("@mui/icons-material/FormatAlignCenter"));
var FormatAlignLeft_1 = __importDefault(require("@mui/icons-material/FormatAlignLeft"));
var FormatAlignRight_1 = __importDefault(require("@mui/icons-material/FormatAlignRight"));
var styles = function (_a) {
    var spacing = _a.spacing;
    return (0, styles_1.createStyles)({
        linkPopover: {
            padding: spacing(2, 2, 2, 2),
            maxWidth: 250
        },
        linkTextField: {
            width: "100%"
        }
    });
};
var UrlPopover = function (props) {
    var _a = (0, react_1.useState)(props.data || {
        url: undefined,
        width: undefined,
        height: undefined,
        alignment: undefined,
        type: undefined
    }), data = _a[0], setData = _a[1];
    var classes = props.classes;
    var onSizeChange = function (value, prop) {
        var _a, _b;
        if (value === "") {
            setData(__assign(__assign({}, data), (_a = {}, _a[prop] = undefined, _a)));
            return;
        }
        var intValue = parseInt(value, 10);
        if (isNaN(intValue)) {
            return;
        }
        setData(__assign(__assign({}, data), (_b = {}, _b[prop] = intValue, _b)));
    };
    return (react_1.default.createElement(Popover_1.default, { open: props.anchor !== undefined, anchorEl: props.anchor, anchorOrigin: {
            vertical: "bottom",
            horizontal: "left"
        }, transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
        } },
        react_1.default.createElement("div", { className: classes.linkPopover },
            react_1.default.createElement(Grid_1.default, { container: true, spacing: 1 },
                react_1.default.createElement(Grid_1.default, { container: true, item: true, xs: true, spacing: 1 },
                    react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                        react_1.default.createElement(TextField_1.default, { className: classes.linkTextField, onChange: function (event) { return setData(__assign(__assign({}, data), { url: event.target.value })); }, label: "URL", defaultValue: props.data && props.data.url, autoFocus: true, InputLabelProps: {
                                shrink: true
                            } })),
                    props.isMedia ?
                        react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                                react_1.default.createElement(ButtonGroup_1.default, { fullWidth: true },
                                    react_1.default.createElement(Button_1.default, { color: (!data.type || data.type === "image") ? "primary" : "inherit", size: "small", onClick: function () { return setData(__assign(__assign({}, data), { type: "image" })); } },
                                        react_1.default.createElement(InsertPhoto_1.default, null)),
                                    react_1.default.createElement(Button_1.default, { color: data.type === "video" ? "primary" : "inherit", size: "small", onClick: function () { return setData(__assign(__assign({}, data), { type: "video" })); } },
                                        react_1.default.createElement(Movie_1.default, null)))),
                            react_1.default.createElement(Grid_1.default, { item: true, xs: 6 },
                                react_1.default.createElement(TextField_1.default, { onChange: function (event) { return onSizeChange(event.target.value, "width"); }, value: data.width || "", label: "Width", InputLabelProps: {
                                        shrink: true
                                    } })),
                            react_1.default.createElement(Grid_1.default, { item: true, xs: 6 },
                                react_1.default.createElement(TextField_1.default, { onChange: function (event) { return onSizeChange(event.target.value, "height"); }, value: data.height || "", label: "Height", InputLabelProps: {
                                        shrink: true
                                    } })),
                            react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                                react_1.default.createElement(ButtonGroup_1.default, { fullWidth: true },
                                    react_1.default.createElement(Button_1.default, { color: data.alignment === "left" ? "primary" : "inherit", size: "small", onClick: function () { return setData(__assign(__assign({}, data), { alignment: "left" })); } },
                                        react_1.default.createElement(FormatAlignLeft_1.default, null)),
                                    react_1.default.createElement(Button_1.default, { color: data.alignment === "center" ? "primary" : "inherit", size: "small", onClick: function () { return setData(__assign(__assign({}, data), { alignment: "center" })); } },
                                        react_1.default.createElement(FormatAlignCenter_1.default, null)),
                                    react_1.default.createElement(Button_1.default, { color: data.alignment === "right" ? "primary" : "inherit", size: "small", onClick: function () { return setData(__assign(__assign({}, data), { alignment: "right" })); } },
                                        react_1.default.createElement(FormatAlignRight_1.default, null)))))
                        : null),
                react_1.default.createElement(Grid_1.default, { container: true, item: true, xs: 12, direction: "row", justifyContent: "flex-end" },
                    props.data && props.data.url ?
                        react_1.default.createElement(Button_1.default, { onClick: function () { return props.onConfirm(props.isMedia, ""); } },
                            react_1.default.createElement(DeleteOutline_1.default, null))
                        : null,
                    react_1.default.createElement(Button_1.default, { onClick: function () { return props.onConfirm(props.isMedia, data.url, data.width, data.height, data.alignment, data.type); } },
                        react_1.default.createElement(Check_1.default, null)))))));
};
exports.default = (0, styles_1.withStyles)(styles, { withTheme: true })(UrlPopover);
//# sourceMappingURL=UrlPopover.js.map