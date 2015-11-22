/**
 * Translate special characters into the pronouncable names.
 */
module translator {

    export var contractions = {
        '--': 'phep',
        '+-': 'slep',
        '++': 'slus',
        '==': 'stet',
        '+<': 'glus',
        '+>': 'gras',
        '-<': 'gelp',
        '->': 'garp'
    };
    export var style = {
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
        '!': 'zap',
    };

    export interface Fragment {
        type: string; // 'symbol' | 'literal' | 'contraction'
        value: string;
        hint: string;
    }

    export class Translator {
        public constructor() {
        }

        public translate(input:string):Fragment[] {
            var result = [];

            input.split(/\s+/).forEach((word) => {
                console.log(input, word);
                result.push(this.translateToken(word));
            });

            return [].concat.apply([], result); // Merge multiple arrays into single array
        }

        /**
         * Translate a word into the urbit-slang.
         * @param token
         * @returns {Array}
         */
        private translateToken(token:string):Fragment[] {
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
                            value: style[symbolBuffer],
                            hint: symbolBuffer
                        }
                    );
                    symbolBuffer = null;
                }
            }

            for (var i = 0; i < token.length; i++) {
                var current = token.charAt(i);
                var pronunciation = style[current];

                if (pronunciation !== undefined) {
                    flushLiteral();
                    if (symbolBuffer == null) {
                        symbolBuffer = current;
                    } else {

                        var joined = symbolBuffer + current;
                        var con = contractions[joined];
                        if (con) {
                            symbolBuffer = null;
                            result.push({
                                type: 'contraction',
                                value: con,
                                hint: joined
                            })
                        } else {
                            flushSymbol();
                            symbolBuffer = current;
                        }

                    }
                } else {
                    flushSymbol();
                    literalBuffer += current;
                }
            }

            // Clear out any remaining state
            flushLiteral();
            flushSymbol();

            return result;
        }
    }
}

