import React, { useCallback, useMemo } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import {
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement,
} from "slate";
import { withHistory } from "slate-history";
import { Button, Icon, Toolbar } from "./Components";
const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};
const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];
const TextEditor = () => {
  const renderElement = useCallback(
    (props) => React.createElement(Element, Object.assign({}, props)),
    []
  );
  const renderLeaf = useCallback(
    (props) => React.createElement(Leaf, Object.assign({}, props)),
    []
  );
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  return React.createElement(
    Slate,
    { editor: editor, value: initialValue },
    React.createElement(
      Toolbar,
      null,
      React.createElement(MarkButton, { format: "bold", icon: "format_bold" }),
      React.createElement(MarkButton, {
        format: "italic",
        icon: "format_italic",
      }),
      React.createElement(MarkButton, {
        format: "underline",
        icon: "format_underlined",
      }),
      React.createElement(MarkButton, { format: "code", icon: "code" }),
      React.createElement(BlockButton, {
        format: "heading-one",
        icon: "looks_one",
      }),
      React.createElement(BlockButton, {
        format: "heading-two",
        icon: "looks_two",
      }),
      React.createElement(BlockButton, {
        format: "block-quote",
        icon: "format_quote",
      }),
      React.createElement(BlockButton, {
        format: "numbered-list",
        icon: "format_list_numbered",
      }),
      React.createElement(BlockButton, {
        format: "bulleted-list",
        icon: "format_list_bulleted",
      }),
      React.createElement(BlockButton, {
        format: "left",
        icon: "format_align_left",
      }),
      React.createElement(BlockButton, {
        format: "center",
        icon: "format_align_center",
      }),
      React.createElement(BlockButton, {
        format: "right",
        icon: "format_align_right",
      }),
      React.createElement(BlockButton, {
        format: "justify",
        icon: "format_align_justify",
      })
    ),
    React.createElement(Editable, {
      renderElement: renderElement,
      renderLeaf: renderLeaf,
      placeholder: "Start typing\u2026",
      spellCheck: true,
      autoFocus: true,
      onKeyDown: (event) => {
        for (const hotkey in HOTKEYS) {
          if (isHotkey(hotkey, event)) {
            event.preventDefault();
            const mark = HOTKEYS[hotkey];
            toggleMark(editor, mark);
          }
        }
      },
    })
  );
};
const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes(editor, newProperties);
  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};
const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );
  return !!match;
};
const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};
const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case "block-quote":
      return React.createElement(
        "blockquote",
        Object.assign({ style: style }, attributes),
        children
      );
    case "bulleted-list":
      return React.createElement(
        "ul",
        Object.assign({ style: style }, attributes),
        children
      );
    case "heading-one":
      return React.createElement(
        "h1",
        Object.assign({ style: style }, attributes),
        children
      );
    case "heading-two":
      return React.createElement(
        "h2",
        Object.assign({ style: style }, attributes),
        children
      );
    case "list-item":
      return React.createElement(
        "li",
        Object.assign({ style: style }, attributes),
        children
      );
    case "numbered-list":
      return React.createElement(
        "ol",
        Object.assign({ style: style }, attributes),
        children
      );
    default:
      return React.createElement(
        "p",
        Object.assign({ style: style }, attributes),
        children
      );
  }
};
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = React.createElement("strong", null, children);
  }
  if (leaf.code) {
    children = React.createElement("code", null, children);
  }
  if (leaf.italic) {
    children = React.createElement("em", null, children);
  }
  if (leaf.underline) {
    children = React.createElement("u", null, children);
  }
  return React.createElement("span", Object.assign({}, attributes), children);
};
const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return React.createElement(
    Button,
    {
      active: isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
      ),
      onMouseDown: (event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      },
    },
    React.createElement(Icon, null, icon)
  );
};
const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return React.createElement(
    Button,
    {
      active: isMarkActive(editor, format),
      onMouseDown: (event) => {
        event.preventDefault();
        toggleMark(editor, format);
      },
    },
    React.createElement(Icon, null, icon)
  );
};
const initialValue = [
  {
    type: "heading-one",
    align: "center",
    children: [
      {
        text: "Content Text Editor",
        bold: true,
      },
    ],
  },
  {
    type: "heading-two",
    align: "center",
    children: [
      { text: "CSE3150", bold: true, looks_one: true, underline: true },
      { text: " FrontEnd FullStack " },
      { text: "Assignment " },
    ],
  },
  {
    type: "block-quote",
    children: [
      {
        text: "Done By,",
        italic: true,
      },
    ],
  },
  {
    type: "numbered-list",
    children: [{ text: "Surya Raghavendra" }],
  },
  // {
  //   type: "numbered-list",
  //   children: [{ text: "Name" }],
  // },
  // {
  //   type: "numbered-list",
  //   children: [{ text: "Name" }],
  // },
];
export default TextEditor;
