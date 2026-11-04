// pixelbyaj.com: console theme
// 1. Hero: type `whoami`, then stream the headline as LLM-style tokens.
// 2. ask-abhishek: a small working terminal. Answers are pre-written by Abhishek, not generated;
//    the Q&A text is already in the HTML for search engines and no-JS visitors.
(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var EMAIL = "pixelbyaj.dev@gmail.com";

    function wait(ms) {
        return new Promise(function (r) { setTimeout(r, reduceMotion ? 0 : ms); });
    }

    function escapeHtml(s) {
        return s.replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    // Rough BPE-like split: words keep their leading whitespace, punctuation stands alone,
    // long words break into sub-word pieces.
    function tokenize(text) {
        var raw = text.match(/\s*[A-Za-z]+|\s*[^A-Za-z\s]|\s+$/g) || [];
        var out = [];
        raw.forEach(function (piece) {
            var m = piece.match(/^(\s*)([A-Za-z]+)$/);
            if (m && m[2].length > 6) {
                var w = m[2];
                out.push(m[1] + w.slice(0, 4));
                for (var i = 4; i < w.length; i += 4) out.push(w.slice(i, i + 4));
            } else {
                out.push(piece);
            }
        });
        return out;
    }

    // ================= Hero =================
    function runHero() {
        var hero = document.querySelector(".hero");
        if (!hero) return Promise.resolve();

        var typed = hero.querySelector(".typed");
        var headline = hero.querySelector("[data-tokenize]");
        var meta = hero.querySelector(".token-meta");
        var later = hero.querySelectorAll(".whoami, .lede, .actions");

        // Tokenize the headline (keep an accessible name with the plain sentence).
        var spans = [];
        var count = 0;
        if (headline) {
            var text = headline.textContent.replace(/\s+/g, " ").trim();
            var tokens = tokenize(text);
            count = tokens.length;
            headline.setAttribute("aria-label", text);
            headline.textContent = "";
            spans = tokens.map(function (t) {
                var s = document.createElement("span");
                s.className = "tok";
                s.setAttribute("aria-hidden", "true");
                s.textContent = t;
                headline.appendChild(s);
                return s;
            });
        }

        function show(el) { el.classList.add("is-in"); }

        if (reduceMotion) {
            spans.forEach(show);
            Array.prototype.forEach.call(later, show);
            if (meta) meta.textContent = "// " + count + " tokens";
            return Promise.resolve();
        }

        // Type the command
        var cmd = typed ? typed.getAttribute("data-type") : "";
        if (typed) typed.textContent = "";
        var chain = wait(300);
        cmd.split("").forEach(function (ch) {
            chain = chain.then(function () { typed.textContent += ch; return wait(70); });
        });

        return chain
            .then(function () { return wait(180); })
            .then(function () {
                show(later[0]);
                var start = performance.now();
                return new Promise(function (resolve) {
                    var i = 0;
                    (function next() {
                        if (i < spans.length) {
                            if (i > 0) spans[i - 1].classList.remove("is-cursor");
                            spans[i].classList.add("is-cursor");
                            show(spans[i++]);
                            if (meta) meta.textContent = "// streaming " + i + " tokens";
                            setTimeout(next, 55);
                        } else {
                            spans[spans.length - 1].classList.remove("is-cursor");
                            var secs = (performance.now() - start) / 1000;
                            if (meta) meta.textContent = "// " + count + " tokens in " + secs.toFixed(1) + "s";
                            resolve();
                        }
                    })();
                });
            })
            .then(function () {
                for (var i = 1; i < later.length; i++) show(later[i]);
            });
    }

    // ================= Terminal =================
    function setupTerminal() {
        var term = document.querySelector(".term");
        if (!term) return function () { return Promise.resolve(); };

        var log = term.querySelector(".term-log");

        // Pre-written answers from the HTML
        var answers = {};
        Array.prototype.forEach.call(term.querySelectorAll(".qa-item"), function (el) {
            var p = el.querySelector("p");
            answers[el.getAttribute("data-cmd")] = {
                q: el.querySelector("h3").textContent.trim(),
                text: p.textContent.replace(/\s+/g, " ").trim(),
                html: p.innerHTML.replace(/\s+/g, " ").trim()
            };
        });

        var mail = '<a href="mailto:' + EMAIL + '?subject=Let%27s%20talk">' + EMAIL + "</a>";

        var sections = {
            "what-i-build.md": "#build",
            "how-i-build-with-ai.md": "#approach",
            "open-source/": "#work",
            "stack.json": "#stack",
            "talk-to-abhishek.sh": "#talk"
        };

        function answer(key) {
            var a = answers[key];
            return a ? { text: a.text, html: a.html } : null;
        }

        var commands = {
            help: function () {
                var rows = [
                    ["whoami", "who I am"],
                    ["build", "what I build with AI"],
                    ["stack", "what I build with"],
                    ["projects", "my open-source packages"],
                    ["hire", "working together"],
                    ["human", "is this really me?"],
                    ["contact", "how to reach me"],
                    ["ls", "files on this page"],
                    ["clear", "clear the screen"]
                ];
                var text = rows.map(function (r) { return "  " + (r[0] + "          ").slice(0, 10) + r[1]; }).join("\n") +
                    "\n\nGot a question these don't cover? Type it, and I'll turn it into an email to me.";
                return { text: text, html: escapeHtml(text) };
            },
            whoami: function () {
                var t = "Abhishek Joshi. Full-stack developer and AI engineer in Perth, Australia (UTC+8). 16+ years of shipping software.";
                return { text: t, html: t };
            },
            build: function () { return answer("build"); },
            stack: function () { return answer("stack"); },
            hire: function () { return answer("hire"); },
            human: function () { return answer("human"); },
            projects: function () {
                var names = ["ResearchAI", "MSGraph.Mail.Client", "msgraph-email", "IGGraphClient", "Kafka.SignalR",
                    "MQDotnetClient", "ngx-iso-form", "ngx-xml-message", "sitePage.js"];
                var t = names.join("  ") + "\n\n9 packages on NuGet, npm and PyPI.";
                return { text: t + " Details below.", html: escapeHtml(t) + ' <a href="#work">Details below</a>.' };
            },
            contact: function () {
                var t = "email     " + EMAIL + "\ngithub    github.com/pixelbyaj\nlocation  Perth, AU (UTC+8), happy to meet remotely";
                var h = "email     " + mail + '\ngithub    <a href="https://github.com/pixelbyaj" rel="noopener" target="_blank">github.com/pixelbyaj</a>\nlocation  Perth, AU (UTC+8), happy to meet remotely';
                return { text: t, html: h, cls: "line-out" };
            },
            ls: function () {
                var names = Object.keys(sections);
                return {
                    text: names.join("  "),
                    html: names.map(function (n) { return '<a href="' + sections[n] + '">' + n + "</a>"; }).join("  ")
                };
            },
            hello: function () {
                var t = "Hi! Type help to see what I can answer, or ask me something.";
                return { text: t, html: t };
            },
            exit: function () {
                var t = "No need to leave. If you've got this far, send me an email: ";
                return { text: t + EMAIL, html: t + mail };
            }
        };
        commands.hi = commands.hello;
        commands.about = commands.whoami;
        commands.email = commands.contact;
        commands.talk = commands.hire;

        // Free text isn't answered here (there's no model behind this terminal).
        // Instead it becomes an email draft, so the question reaches Abhishek himself.
        function emailDraft(question) {
            var href = "mailto:" + EMAIL +
                "?subject=" + encodeURIComponent("Question from pixelbyaj.com") +
                "&body=" + encodeURIComponent(question + "\n\n");
            var t = "That one deserves a real answer from me, not a canned one.";
            return {
                text: t + " Email it to me.",
                html: escapeHtml(t) + ' <a href="' + escapeHtml(href) + '">Email this question to me</a>' +
                    " and I'll reply personally.",
                cls: "line-ok"
            };
        }

        function run(input) {
            var raw = input.trim();
            var cmd = raw.toLowerCase();
            var first = cmd.split(/\s+/)[0];

            if (!raw) return null;
            if (first === "clear" || first === "cls") return { clear: true };
            if (first === "sudo") {
                return {
                    text: "Permission denied. No root needed to reach me though: " + EMAIL,
                    html: "Permission denied. No root needed to reach me though: " + mail,
                    cls: "line-err"
                };
            }
            if (/^(cat|open|cd|less|more|vim|nano)\s+/.test(cmd)) {
                var target = cmd.split(/\s+/)[1].replace(/^\.\//, "");
                var hit = Object.keys(sections).filter(function (n) { return n.indexOf(target) === 0; })[0];
                if (hit) {
                    return { text: "Opening " + hit + "...", html: "Opening " + hit + "...", cls: "line-ok", go: sections[hit] };
                }
                return { text: first + ": " + target + ": No such file. Try ls.", html: escapeHtml(first + ": " + target + ": No such file. Try ls."), cls: "line-err" };
            }
            if (Object.prototype.hasOwnProperty.call(commands, first) && cmd.split(/\s+/).length === 1) {
                return commands[first]();
            }
            if (/\s/.test(cmd) || /\?$/.test(cmd)) {
                return emailDraft(raw);
            }
            var nf = "command not found: " + raw + ". Type help.";
            return { text: nf, html: escapeHtml(nf), cls: "line-err" };
        }

        function scrollDown() {
            log.scrollTop = log.scrollHeight;
        }

        function addLine(cls) {
            var p = document.createElement("p");
            p.className = "line " + (cls || "line-out");
            log.appendChild(p);
            return p;
        }

        function echo(input) {
            var p = addLine("line-in");
            p.innerHTML = '<span class="u">you</span>@<span class="p">pixelbyaj</span>$ ' + escapeHtml(input);
            scrollDown();
        }

        function stream(el, text, html) {
            return new Promise(function (resolve) {
                if (reduceMotion) {
                    el.innerHTML = html;
                    scrollDown();
                    return resolve();
                }
                var toks = tokenize(text);
                var i = 0;
                el.classList.add("is-streaming");
                el.setAttribute("aria-busy", "true");
                (function next() {
                    if (i < toks.length) {
                        el.textContent += toks[i++];
                        scrollDown();
                        setTimeout(next, 16 + Math.random() * 26);
                    } else {
                        el.innerHTML = html;
                        el.classList.remove("is-streaming");
                        el.removeAttribute("aria-busy");
                        scrollDown();
                        resolve();
                    }
                })();
            });
        }

        // Prompt + input
        var form = document.createElement("form");
        form.className = "term-form";
        form.setAttribute("autocomplete", "off");
        form.innerHTML = '<label for="term-in"><span class="u">you</span>@<span class="p">pixelbyaj</span>$</label>' +
            '<input id="term-in" name="cmd" type="text" spellcheck="false" autocapitalize="off" autocorrect="off" ' +
            'enterkeyhint="send" aria-label="Type a command, for example help" placeholder="type help">';
        term.appendChild(form);
        var input = form.querySelector("input");

        // Suggested commands
        var suggest = document.createElement("ul");
        suggest.className = "term-suggest";
        suggest.setAttribute("aria-label", "Suggested commands");
        ["help", "whoami", "build", "stack", "projects", "hire", "human"].forEach(function (c) {
            var li = document.createElement("li");
            var b = document.createElement("button");
            b.type = "button";
            b.textContent = c;
            b.addEventListener("click", function () { typeAndRun(c); });
            li.appendChild(b);
            suggest.appendChild(li);
        });
        term.appendChild(suggest);

        var busy = false;
        var history = [];
        var hIndex = 0;

        function setBusy(state) {
            busy = state;
            input.disabled = state;
            Array.prototype.forEach.call(suggest.querySelectorAll("button"), function (b) { b.disabled = state; });
        }

        function execute(value) {
            var v = value.trim();
            if (!v) return Promise.resolve();
            history.push(v);
            hIndex = history.length;
            echo(v);
            var res = run(v);
            if (!res) return Promise.resolve();
            if (res.clear) {
                log.innerHTML = "";
                return Promise.resolve();
            }
            return wait(200)
                .then(function () { return stream(addLine(res.cls), res.text, res.html); })
                .then(function () {
                    if (res.go) {
                        var t = document.querySelector(res.go);
                        if (t) t.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
                    }
                });
        }

        function typeAndRun(cmd) {
            if (busy) return;
            setBusy(true);
            input.value = "";
            var chain = Promise.resolve();
            if (!reduceMotion) {
                cmd.split("").forEach(function (ch) {
                    chain = chain.then(function () { input.value += ch; return wait(45); });
                });
            }
            chain.then(function () {
                input.value = "";
                return execute(cmd);
            }).then(function () { setBusy(false); });
        }

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (busy) return;
            var v = input.value;
            input.value = "";
            setBusy(true);
            execute(v).then(function () {
                setBusy(false);
                input.focus();
            });
        });

        input.addEventListener("keydown", function (e) {
            if (e.key === "ArrowUp" && history.length) {
                hIndex = Math.max(0, hIndex - 1);
                input.value = history[hIndex];
                e.preventDefault();
            } else if (e.key === "ArrowDown" && history.length) {
                hIndex = Math.min(history.length, hIndex + 1);
                input.value = history[hIndex] || "";
                e.preventDefault();
            }
        });

        // Clicking the output (not a link) focuses the prompt
        log.addEventListener("click", function (e) {
            if (!e.target.closest("a") && !busy) input.focus();
        });

        // Boot messages
        return function boot() {
            setBusy(true);
            var lines = [
                ["line-dim", "ask-abhishek v2.0, answers pre-written by a human"],
                ["line-out", "Hi, I'm Abhishek. Type help or pick a command below."]
            ];
            var chain = Promise.resolve();
            lines.forEach(function (l) {
                chain = chain.then(function () { return stream(addLine(l[0]), l[1], escapeHtml(l[1])); })
                    .then(function () { return wait(150); });
            });
            return chain.then(function () { setBusy(false); });
        };
    }

    var bootTerminal = setupTerminal();
    runHero().then(bootTerminal);
})();
