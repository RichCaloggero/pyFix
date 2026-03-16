var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.js
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));

// pyFix.js
var blocks = [];
var blockTypes = [
  "def",
  "if",
  "else",
  "elif",
  "while",
  "for"
];
function fix(code) {
  blocks = [];
  const input = lines(code);
  const output = [];
  let lastNonblankLineIndex = -1;
  let extraLineCount = 0;
  let level = 0;
  for (let lineIndex in input) {
    lineIndex = Number(lineIndex);
    const line = input[lineIndex];
    if (not(isBlankLine(line))) {
      if (isBlockEnd(input[lineIndex], lastNonblankLineIndex >= 0 ? input[lastNonblankLineIndex] : null)) {
        endBlock(input, output, lineIndex, lastNonblankLineIndex, extraLineCount);
        extraLineCount += 1;
        level -= 1;
      }
      output.push(indent(level) + line.trim());
      if (isBlockStart(line)) {
        startBlock(input, lineIndex, level);
        level += 1;
      }
      lastNonblankLineIndex = lineIndex;
    } else {
      output.push("");
    }
  }
  endRemainingBlocks(blocks, output);
  return output.join("\n");
}
function restore(code, stripEndComments = false) {
  const input = lines(code);
  const output = [];
  let level = 0;
  for (let lineIndex in input) {
    lineIndex = Number(lineIndex);
    const line = input[lineIndex];
    if (isBlankLine(line)) {
      output.push("");
    } else if (isEndComment(line)) {
      if (not(stripEndComments)) {
        output.push(indent(level) + line.trim());
      }
      level -= 1;
    } else {
      output.push(indent(level) + line.trim());
      if (isBlockStart(line)) {
        level += 1;
      }
    }
  }
  return output.join("\n");
}
function leadingBlanks(line) {
  return line ? line.match(/^([ \t]*)(.*)$/)[1] : "";
}
function indentation(line) {
  return leadingBlanks(line);
}
function indent(count) {
  let s = "";
  for (let i = 0; i < count; i++) s += "	";
  return s;
}
function lines(text) {
  return text.trim().split(/\r?\n/);
}
function words(line) {
  return line.trim().split(/[ \t\W]/);
}
function isEndComment(line) {
  return line.trim().startsWith("#end ");
}
function isBlockStart(line) {
  return blockTypes.includes(words(line)[0]) && line.slice(-1) === ":";
}
function isBlockEnd(line, lastLine) {
  if (not(currentBlock()) || not(lastLine)) return false;
  return indentation(line) < indentation(lastLine);
}
function startBlock(input, index, level) {
  const line = input[index];
  const block = {
    level,
    index,
    type: blockType(line)
  };
  blocks.push(block);
  printBlock(block);
  return block;
}
function blockType(line) {
  return words(line)[isFunctionDefinition(line) ? 1 : 0];
}
function isFunctionDefinition(line) {
  return words(line)[0] === "def";
}
function printBlock(block) {
}
function currentBlock() {
  return blocks.length > 0 ? blocks[blocks.length - 1] : null;
}
function endBlock(input, output, index, lastIndex, extraLineCount) {
  if (blocks.length === 0 || lastIndex < 0) return null;
  const block = blocks.pop();
  printBlock(block);
  output.splice(lastIndex + extraLineCount + 1, 0, indent(block.level + 1) + `#end ${block.type}`);
  return block;
}
function endRemainingBlocks(blocks2, output) {
  let count = blocks2.length;
  while (blocks2.length > 0) {
    const block = blocks2.pop();
    output.push(indent(block.level + 1) + `#end ${block.type}`);
  }
  if (output.slice(-1)[0].trim() !== "") output.push("");
}
function isBlankLine(line) {
  return not(line) || line.trim().length === 0;
}
function not(x) {
  return !x;
}

// src/extension.js
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("pyfix.fix", () => transformText(fix)),
    vscode.commands.registerCommand("pyfix.restore", () => transformText((text) => restore(text, false))),
    vscode.commands.registerCommand("pyfix.restoreStrip", () => transformText((text) => restore(text, true)))
  );
}
function deactivate() {
}
function transformText(transform) {
  const editor = vscode.window.activeTextEditor;
  if (not2(editor)) return;
  const document = editor.document;
  const selection = editor.selection;
  const hasSelection = not2(selection.isEmpty);
  const range = hasSelection ? selection : new vscode.Range(
    document.lineAt(0).range.start,
    document.lineAt(document.lineCount - 1).range.end
  );
  const text = document.getText(range);
  const result = transform(text);
  editor.edit((editBuilder) => {
    editBuilder.replace(range, result);
  });
}
function not2(x) {
  return !x;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
