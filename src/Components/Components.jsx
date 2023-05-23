import React from 'react';
import ReactDOM from 'react-dom';
import { cx, css } from '@emotion/css';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
export const Button = React.forwardRef((_a, ref) => {
    var { className, active, reversed } = _a, props = __rest(_a, ["className", "active", "reversed"]);
    return (React.createElement("span", Object.assign({}, props, { ref: ref, className: cx(className, css `
          cursor: pointer;
          color: ${reversed
            ? active
                ? 'white'
                : '#aaa'
            : active
                ? 'black'
                : '#ccc'};
        `) })));
});
export const EditorValue = React.forwardRef((_a, ref) => {
    var { className, value } = _a, props = __rest(_a, ["className", "value"]);
    const textLines = value.document.nodes
        .map(node => node.text)
        .toArray()
        .join('\n');
    return (React.createElement("div", Object.assign({ ref: ref }, props, { className: cx(className, css `
            margin: 30px -20px 0;
          `) }),
        React.createElement("div", { className: css `
            font-size: 14px;
            padding: 5px 20px;
            color: #404040;
            border-top: 2px solid #eeeeee;
            background: #f8f8f8;
          ` }, "Slate's value as text"),
        React.createElement("div", { className: css `
            color: #404040;
            font: 12px monospace;
            white-space: pre-wrap;
            padding: 10px 20px;
            div {
              margin: 0 0 0.5em;
            }
          ` }, textLines)));
});
export const Icon = React.forwardRef((_a, ref) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (React.createElement("span", Object.assign({}, props, { ref: ref, className: cx('material-icons', className, css `
          font-size: 22px;
          padding: 4px;
          border-radius:4px;
          vertical-align: text-bottom;
        `) })));
});
export const Instruction = React.forwardRef((_a, ref) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (React.createElement("div", Object.assign({}, props, { ref: ref, className: cx(className, css `
          white-space: pre-wrap;
          margin: 0 -20px 10px;
          padding: 10px 20px;
          font-size: 14px;
          background: #f8f8e8;
        `) })));
});
export const Menu = React.forwardRef((_a, ref) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (React.createElement("div", Object.assign({}, props, { "data-test-id": "menu", ref: ref, className: cx(className, css `
          & > * {
            display: inline-block;
          }
          & > * + * {
            margin-left: 15px;
          }
        `) })));
});
export const Portal = ({ children }) => {
    return typeof document === 'object'
        ? ReactDOM.createPortal(children, document.body)
        : null;
};
export const Toolbar = React.forwardRef((_a, ref) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (React.createElement(Menu, Object.assign({}, props, { ref: ref, className: cx(className, css `
          position: relative;
          padding: 1px 18px 17px;
          margin: 0 -20px;
          border-bottom: 2px solid #eee;
          margin-bottom: 20px;
        `) })));
});
