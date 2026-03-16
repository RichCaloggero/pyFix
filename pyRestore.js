const blockTypes = [
"def", "if", "else", "elif", "while", "for"
];

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

function indent (count) {
let s = "";
for (let i=0; i<count; i++) s += "\t";
return s;
} // indent

function lines (text) {
return text.trim().split("\n");
} // lines

function words (line) {
return line.trim().split(/[ \t\W]/);
} // words

function isBlockStart (line) {
return blockTypes.includes(words(line)[0]) && line.trim().slice(-1) === ":";
} // isBlockStart

function isEndComment (line) {
return line.trim().startsWith("#end ");
} // isEndComment

function isBlankLine (line) {
return not(line) || line.trim().length === 0;
} // isBlankLine

function not (x) {return !x;}
