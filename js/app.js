/**
 * Translate special characters into the pronouncable names.
 */
var translator;
(function (translator) {
    translator.contractions = {
        '--': 'phep',
        '+-': 'slep',
        '++': 'slus',
        '==': 'stet',
        '+<': 'glus',
        '+>': 'gras',
        '-<': 'gelp',
        '->': 'garp'
    };
    translator.style = {
        ' ': 'ace',
        '|': 'bar',
        '\\': 'bas',
        '$': 'buc',
        '_': 'cab',
        '%': 'cen',
        ':': 'col',
        ',': 'com',
        '"': 'doq',
        '.': 'dot',
        '/': 'fas',
        '<': 'gal',
        '>': 'gar',
        '#': 'hax',
        '-': 'hep',
        '{': 'kel',
        '}': 'ker',
        '^': 'ket',
        '+': 'lus',
        '&': 'pam',
        '@': 'pat',
        '(': 'pel',
        ')': 'per',
        '[': 'sel',
        ';': 'sem',
        ']': 'ser',
        '~': 'sig',
        '\'': 'soq',
        '*': 'tar',
        '`': 'tec',
        '=': 'tis',
        '?': 'wut',
        '!': 'zap'
    };
    var Translator = (function () {
        function Translator() {
        }
        Translator.prototype.translate = function (input) {
            var _this = this;
            var result = [];
            input.split(/\s+/).forEach(function (word) {
                console.log(input, word);
                result.push(_this.translateToken(word));
            });
            return [].concat.apply([], result); // Merge multiple arrays into single array
        };
        /**
         * Translate a word into the urbit-slang.
         * @param token
         * @returns {Array}
         */
        Translator.prototype.translateToken = function (token) {
            var result = [];
            var literalBuffer = "";
            var symbolBuffer = null;
            function flushLiteral() {
                if (literalBuffer.length > 0) {
                    result.push({
                        type: 'literal',
                        value: literalBuffer,
                        hint: null
                    });
                    literalBuffer = "";
                }
            }
            function flushSymbol() {
                if (symbolBuffer !== null) {
                    result.push({
                        type: 'symbol',
                        value: translator.style[symbolBuffer],
                        hint: symbolBuffer
                    });
                    symbolBuffer = null;
                }
            }
            for (var i = 0; i < token.length; i++) {
                var current = token.charAt(i);
                var pronunciation = translator.style[current];
                if (pronunciation !== undefined) {
                    flushLiteral();
                    if (symbolBuffer == null) {
                        symbolBuffer = current;
                    }
                    else {
                        var joined = symbolBuffer + current;
                        var con = translator.contractions[joined];
                        if (con) {
                            symbolBuffer = null;
                            result.push({
                                type: 'contraction',
                                value: con,
                                hint: joined
                            });
                        }
                        else {
                            flushSymbol();
                            symbolBuffer = current;
                        }
                    }
                }
                else {
                    flushSymbol();
                    literalBuffer += current;
                }
            }
            // Clear out any remaining state
            flushLiteral();
            flushSymbol();
            return result;
        };
        return Translator;
    })();
    translator.Translator = Translator;
})(translator || (translator = {}));
var ui;
(function (ui) {
    var Translator = translator.Translator;
    function bootstrap() {
        var codeArea = document.getElementById('code');
        var output = document.getElementById('output');
        var translator = new Translator();
        var lineCache = {};
        function removeAllChildren(element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
        function renderLine(element, tokens) {
            var div = document.createElement("div");
            div.className = "line";
            tokens.forEach(function (e) {
                var span = document.createElement("span");
                span.innerText = e.value;
                span.className = "token " + e.type;
                if (e.hint) {
                    span.title = e.hint;
                }
                div.appendChild(span);
            });
            return div;
        }
        var update = function (ev) {
            removeAllChildren(output);
            var lines = codeArea.value.split(/\n/);
            var nextCache = {};
            lines.forEach(function (line) {
                var result = lineCache[line] || translator.translate(line);
                nextCache[line] = result;
                output.appendChild(renderLine(output, result));
            });
            lineCache = nextCache;
        };
        codeArea.onchange = update;
        codeArea.onkeyup = update;
        codeArea.focus();
        window.setTimeout(update);
    }
    bootstrap();
})(ui || (ui = {}));
