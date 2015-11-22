module ui {

    import Translator = translator.Translator;
    import Fragment = translator.Fragment;

    function bootstrap() {
        var codeArea = <HTMLTextAreaElement> document.getElementById('code');
        var output = document.getElementById('output');
        var translator = new Translator();
        var lineCache = {};

        function removeAllChildren(element:HTMLElement) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }

        function renderLine(element:HTMLElement, tokens:Fragment[]) {
            var div = document.createElement("div");
            div.className = "line";

            tokens.forEach((e:Fragment) => {
                var span = document.createElement("span");
                span.innerText = e.value;
                span.className = "token " + e.type;

                if (e.hint) {
                    span.title = e.hint;
                }
                div.appendChild(span)
            });
            return div;
        }

        var update = (ev)=> {
            removeAllChildren(output);

            var lines = codeArea.value.split(/\n/);

            var nextCache = {};
            lines.forEach((line) => {
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
}
