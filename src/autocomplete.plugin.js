/**
 * @name MessageAutocomplete
 * @author ghwosty
 * @description A plugin that autocompletes messages.
 * @version 1.0.1
 */

module.exports = meta => {
    
    var actual = 0;
    var currentIndex = 0;
    // Elements
    const acMessageContainer = document.createElement("div");
    acMessageContainer.classList.add("autocomplete-message-container");
    if (document.body.contains(document.querySelector(".form-3gdLxP"))) document.querySelector(".form-3gdLxP").prepend(acMessageContainer);

    // Eventlisteners
    const messageCheck = document.addEventListener("keydown", (e) => {

        var currentExist = 0;
        const keycode = e.keyCode;
        if (document.activeElement == document.querySelector(".editor-H2NA06") && keycode != 9 && keycode != 38 && keycode != 40) {
            setTimeout(() => {
                if (document.body.contains(document.querySelector(".emptyText-1o0WH_"))) {
                    acMessageContainer.style.display = "none"
                    document.querySelectorAll(".autoc-option").forEach(e => { e.style.background = "transparent" })
                } else {
                    acMessageContainer.style.display = "block"
                    var aco_t = "";
                    for (let i = 0; i < settings.autoCompleteOptions.length; i++) {
                        const option = settings.autoCompleteOptions[i].toString();
                        const text = document.querySelector(".editor-H2NA06").innerText.replaceAll("\n", "").toString();
                        if (settings.autoCompleteOptions[i] == null) continue;
                        if (option == text) continue;
                        if (option.startsWith(text)) {
                            if (actual == 0) {
                                aco_t += "<span class='autoc-option' index ='" + actual + "' style='background-color: #03a1fc;'>" + settings.autoCompleteOptions[i] + "</span>"
                                actual++;
                                continue
                            }
                            aco_t += "<br><span class='autoc-option' index ='" + actual + "'>" + settings.autoCompleteOptions[i] + "</span>"
                            actual++;
                            continue
                        }
                    }
                    if (aco_t == "") {
                        acMessageContainer.style.display = "none";
                        actual = 0;
                        currentExist = 0;
                        currentIndex = 0;
                    } else {
                        acMessageContainer.innerHTML = "<span style='fontWeight: bold; color: #03a1fc;; border-bottom: 1px solid white;'>Autocomplete | Use arrow keys to change, tab to accept.</span><br><br>" + aco_t;
                        actual = 0;
                        currentExist = 0;
                    }
                }

            }, 150)
        }
        document.querySelectorAll(".autoc-option").forEach(ele => {
            currentExist++;
        })

        if (keycode == 9) {
            if (acMessageContainer.style.display == "block") {
                e.preventDefault();
                var selectedText = "";
                document.querySelectorAll(".autoc-option").forEach(ele => {
                    console.log(ele.style.backgroundColor)
                    if (ele.style.backgroundColor == "rgb(3, 161, 252)") {
                        selectedText = ele.innerText.replace(document.querySelector(".editor-H2NA06").innerText.replaceAll("\n", ""), "");
                        return
                    }
                })
                const InsertText = (() => {
                    let ComponentDispatch;
                    return (content) => {
                        if (!ComponentDispatch) ComponentDispatch = BdApi.Webpack.getModule(m => m.dispatchToLastSubscribed && m.emitter.listeners('INSERT_TEXT').length, { searchExports: true });
                        ComponentDispatch.dispatchToLastSubscribed("INSERT_TEXT", {
                            plainText: content
                        });
                    }
                })();
                InsertText(selectedText);
                acMessageContainer.style.display = "none"
            }
        } else if (keycode == 38) {
            if (acMessageContainer.style.display == "block") {
                e.preventDefault();
                currentIndex = currentIndex - 1;
                if (currentIndex < 0) currentIndex = 0;
                if (currentIndex >= currentExist) currentIndex = currentExist - 1;
                console.log(currentIndex + " up arrow")
                document.querySelectorAll(".autoc-option").forEach(ele => {
                    if (ele.getAttribute("index") == currentIndex) {
                        document.querySelectorAll(".autoc-option").forEach(e => { e.style.background = "transparent" })
                        ele.style.backgroundColor = "#03a1fc"
                    }
                })
            }
        } else if (keycode == 40) {
            if (acMessageContainer.style.display == "block") {
                e.preventDefault();
                currentIndex = currentIndex + 1;
                if (currentIndex < 0) currentIndex = 0;
                if (currentIndex >= currentExist) currentIndex = currentExist - 1;
                console.log(currentIndex + " down arrow")
                document.querySelectorAll(".autoc-option").forEach(ele => {
                    if (ele.getAttribute("index") == currentIndex) {
                        document.querySelectorAll(".autoc-option").forEach(e => { e.style.background = "transparent" })
                        ele.style.backgroundColor = "#03a1fc"
                    }
                })
            }
        }
    })

    const defaults = {
        autoCompleteOptions: [],
    }

    const settings = {};
    const stored_data = BdApi.loadData(meta.name, "settings");
    Object.assign(settings, defaults, stored_data);

    function injectCss() {
        BdApi.injectCSS(meta.name, `
        .autocomplete-message-container {
            color: white;
            background-color: #2F3136;
            position: absolute;
            z-index: 999;
            padding: 10px;
            bottom: 110%;
            overflow: scroll;
            width: 400px;
            display: none;
            transition: 1s;
        }
        .autocomplete-message-container::-webkit-scrollbar {
            display: none;
        }

        .autoc-option {
            margin-bottom: 10px;
        }
        `)
    }
    injectCss();
    return {
        start: () => {

        },
        stop: () => {
            acMessageContainer.remove();
            BdApi.clearCSS(meta.name)
            document.removeEventListener("keydown", messageCheck);
        },
        getSettingsPanel: () => {
            const panel = document.createElement("div");

            const autocOptions = document.createElement("div");
            const aco_l = document.createElement("span");
            aco_l.innerHTML = "Autocomplete words (seperated by a new line)<br><br>";
            aco_l.style.verticalAlign = "middle";
            aco_l.style.marginRight = "15px";
            aco_l.style.color = "white";
            const aco_i = document.createElement("textarea");
            aco_i.style.verticalAlign = "middle"
            aco_i.style.width = "250px"
            aco_i.style.height = "250px"
            aco_i.style.fontSize = "14px"
            aco_i.setAttribute("spellcheck", "false")
            const aco_b = document.createElement("br");
            const aco_a = document.createElement("button");
            aco_a.innerHTML = "Apply"
            aco_a.style.cursor = "pointer"
            aco_a.style.color = "White"
            aco_a.style.width = "150px"
            aco_a.style.height = "30px"
            aco_a.style.marginTop = "15px"
            aco_a.style.fontSize = "15px"
            aco_a.style.borderRadius = "5%"
            aco_a.style.backgroundColor = "#3e82e5"
            autocOptions.append(aco_l, aco_i, aco_b, aco_b, aco_a);

            aco_a.addEventListener("click", () => {
                const autoCompleteOptions = aco_i.value.split("\n")
                for (let i = 0; i < autoCompleteOptions.length; i++) {
                    if (autoCompleteOptions[i].replaceAll(" ", "") == "") delete autoCompleteOptions[i]
                }
                console.log(autoCompleteOptions)
                settings.autoCompleteOptions = autoCompleteOptions;
                BdApi.saveData(meta.name, "settings", settings);
                BdApi.alert(meta.name, "Settings applied.")
                acAmount.innerHTML = "You have <i>" + settings.autoCompleteOptions.length + "</i> autocomplete options."
            })

            var aco_t = "";
            for (let i = 0; i < settings.autoCompleteOptions.length; i++) {
                if (settings.autoCompleteOptions[i] == null) continue;
                if (i == 0) {
                    aco_t += settings.autoCompleteOptions[i]
                    continue
                }
                aco_t += "\n" + settings.autoCompleteOptions[i]
            }
            aco_i.value = aco_t;

            const acAmount = document.createElement("p");
            acAmount.innerHTML = "You have <i>" + settings.autoCompleteOptions.length + "</i> autocomplete options."
            acAmount.style.color = "white"

            panel.append(autocOptions, acAmount)
            return panel;
        },
        onSwitch: () => {
            acMessageContainer.style.display = "none";
            document.querySelector(".form-3gdLxP").prepend(acMessageContainer);
        },
    }
}
