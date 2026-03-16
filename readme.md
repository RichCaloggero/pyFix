# PyFix

Python is an incredibly flexable and well designed language which enjoys world wide popularity thanks in large part to the machine learning and data science communities. However, it has one flaw: it is not a free-format language. This is a pain for developers who must always keep their indentation correct. 

The need to maintain proper indentation also has a negative effect on those who cannot perceive indentation, or for those whose code gets mistakenly reformated due to circumstances beyond their control. For those using screen readers, this is a problem when trying to read python code embedded in media where indentation is not properly communicated, such as PDF files.

To this end, we offer pyFix. It adds comments at the end of blocks which allow the user to understand the code without needing the indentation. The indentation is preserved, however, so the code will run with the included comments, but will be understood by users who cannot perceive the indentation, such as screen reader users reading the code embedded in a PDF file.


- [Run Now in browser](https://richcaloggero.github.io/pyFix/pyFix.html)

## vsCode extension

VSCode is a poerful code editor, and it is mostly accessible. Python files can be read, manipulated, and debugged fairly easily using this editor.

If screen reader indentaion detection is turned on in your screen reader, the code is easily read and indentation is communicated correctly. However, sometimes it is easier to author code flat, and add indentation later. To this end, we have created a vsCode extension combining both the fix() and restore() algorithms from this repository.

### Installing

1. download this repo
2. open vsCode
3. press control+shift+p and type "install from vsix" and press enter
4. browse to "pyfix-0.1.0.vsix" from the downloaded repo and press enter
5. restart vsCode

Now open a python file and press control+shift+f5, or use the command pallet (control+shift+p) and type pyfix, and choose the appropriate command from the list.

### Keyboard shortcuts

- control+shift+f5: add "#end" comments to correctly indented python code
- control+shift+f6: turn code containing "#end" comments into properly indented python code
- control+shift+f7: turn code containing "#end" comments into properly indented python code, and strip "#end" comments




