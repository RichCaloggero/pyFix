let blocks = [];
const blockTypes = [
"def", "if", "else", "elif", "while", "for"
];

export function fix (code) {
blocks = [];
const input = lines(code);
const output = [];
let lastNonblankLineIndex = -1;
let extraLineCount = 0;
let level = 0;

for (let lineIndex in input) {
lineIndex = Number(lineIndex);
const line = input[lineIndex];
//debugger;

if (not(isBlankLine(line))) {
//console.log(`main loop: ${output.length}; ${lineIndex}, ${line};\n${lastNonblankLineIndex}, ${input[lastNonblankLineIndex]}`);

if (isBlockEnd(input[lineIndex], lastNonblankLineIndex >= 0? input[lastNonblankLineIndex] : null)) {
endBlock(input, output, lineIndex, lastNonblankLineIndex, extraLineCount);
extraLineCount += 1;
level -= 1;
} // if

output.push(indent(level) + line.trim());

if (isBlockStart(line)) {
startBlock(input, lineIndex, level);
level += 1;
} // if

lastNonblankLineIndex = lineIndex;

}else {
output.push("");
} // if
} // for

endRemainingBlocks(blocks, output);
return output.join("\n");
} // fix

export function restore (code, stripEndComments = false) {
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
} // if
level -= 1;

} else {
output.push(indent(level) + line.trim());

if (isBlockStart(line)) {
level += 1;
} // if
} // if
} // for

return output.join("\n");
} // restore

function leadingBlanks (line) {
return line? line.match(/^([ \t]*)(.*)$/)[1] : "";
} // leadingBlanks

function indentation (line) {
return leadingBlanks(line);
} // indentation

function indent (count) {
let s = "";
for (let i=0; i<count; i++) s += "\t";
return s;
} // indent

function lines (text) {
return text.trim().split(/\r?\n/);
} // lines

function words (line) {
return line.trim().split(/[ \t\W]/);
} // words

function isEndComment (line) {
return line.trim().startsWith("#end ");
} // isEndComment

function isBlockStart (line) {
return  blockTypes.includes(words(line)[0]) && line.slice(-1) === ":";
} // isBlockStart

function isBlockEnd (line, lastLine) {
if (not(currentBlock()) || not(lastLine)) return false;
return indentation(line) < indentation(lastLine);
} // isBlockEnd

function startBlock (input, index, level) {
const line = input[index];
//console.log(`startBlock: ${index}, ${line}`);
const block = {
level, index,
type: blockType(line),
};

blocks.push(block);
printBlock(block);
return block;
} // startBlock

function blockType (line) {
return words(line)[isFunctionDefinition(line)? 1 : 0]
} // blockType

function isFunctionDefinition (line) {
return words(line)[0] === "def";
} // isFunctionDefinition

function printBlock (block) {
//console.log(`${block.type}: @${block.index}, level ${block.level}`);
} // printBlock

function currentBlock () {
return blocks.length > 0 ? blocks[blocks.length - 1] : null;
} // currentBlock

function endBlock (input, output, index, lastIndex, extraLineCount) {
//console.log(`endBlock: ${index} ${input[index]};\n${lastIndex}, ${output[lastIndex]}`);
if (blocks.length === 0 || lastIndex < 0) return null;
const block = blocks.pop();
printBlock(block);

output.splice(lastIndex+extraLineCount+1, 0, indent(block.level+1) + `#end ${block.type}`);
return block;
} // endBlock

function endRemainingBlocks (blocks, output) {
let count = blocks.length;

while (blocks.length > 0) {
const block = blocks.pop();
output.push(indent(block.level+1) + `#end ${block.type}`);
} // while

if (output.slice(-1)[0].trim() !== "") output.push("");
} // endRemainingBlocks

function isBlankLine (line) {
return not(line) || line.trim().length === 0;
} // isBlankLine

function nextNonblankLine (input, index) {
while (index++ < input.length) {
if (not(isBlankLine(input[index]))) return input[index];
} // while

return "";
} // nextNonblankLine

function findLastNonblankLine (input, index) {
while (index-- >= 0) {
const line = input[index];
if (not(isBlankLine(line))) return line;
} // while

return "";
} // findLastNonblankLine

function not (x) {return !x;}
