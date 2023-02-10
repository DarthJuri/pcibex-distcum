PennController.CheckPreloaded()

PennController.ResetPrefix()

DebugOff()

Sequence(
    "consent",
    "demography",
    "instructions",
    "practise",
    "experiment-start",
    rshuffle("experiment", "fillers"),
    "send",
    "completion_screen"
)

newTrial("consent",
    newHtml("souhlas", "souhlas.html")
        .cssContainer({"width": "720px"})
        .checkboxWarning("Před dalším pokračováním je potřeba zaškrtnout souhlas.")
        .print()
    ,
    newButton("continue", "Klikněte pro pokračování")
        .center()
        .print()
        .wait(getHtml("souhlas").test.complete()
            .failure(getHtml("souhlas").warn())
        )
)

newTrial("demography",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print(),
    newText("demo-gender", "Pohlaví:"),
    newTextInput("gender")
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print(),
    newText("demo-age", "Věk:"),
    newTextInput("age")
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print(),
    newText("demo-school", "Název školy (0, pokud nejste student):"),
    newTextInput("school")
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print(),
    newButton("wait", "Uložit a pokračovat")
        .center()
        .print()
        .wait(),
    newVar("gender-var")
        .global()
        .set(getTextInput("gender")),
    newVar("age-var")
        .global()
        .set(getTextInput("age")),
    newVar("school-var")
        .global()
        .set(getTextInput("school")),
    newVar("ID")
        .global()
        .set(Date.now())
)

newTrial("instructions",
    newHtml("instrukce", "instrukce.html")
        .cssContainer({"width": "720px"})
        .print()
    ,
    newButton("continue", "Klikněte pro pokračování")
        .center()
        .print()
        .wait()
)

newTrial("experiment-start",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print(),
    newText("experiment-start-text", "Nyní začíná ostré testování"),
    newButton("start-btn", "Začít s experimentem")
        .center()
        .print()
        .wait()
)

Template("practise.csv", row =>
    newTrial("practise",
        newImage("pr-example_image", row.image)
            .size(720)
            .center()
            .print(),
        newText("pr-sentence", row.sentence)
            .css("margin", "5px")
            .css("font-size", "30")
            .size(540),
        newAudio("pr-sentence_audio", row.sentence_audio),
        newButton("pr-play_sentence", "▶️")
            .css("font-size", "45")
            .css("background-color", "rgba(255, 255, 255, 0.0)")
            .css("border-width", "0px")
            .callback(
                getAudio("pr-sentence_audio").play()    
            ),
        newCanvas("pr-sentence_canvas", 600, 80)
            .add(0, 0, getText("pr-sentence"))
            .add(550, 0, getButton("pr-play_sentence"))
            .css("text-align", "center")
            .center()
            .print(),
        newImage("pr-ok", "tick.png")
            .size(100, 100),
        newImage("pr-nok", "cross.png")
            .size(100, 100),
        newCanvas("pr-selection_canvas", 300, 100)
            .add(0, 0, getImage("pr-ok"))
            .add(200, 0, getImage("pr-nok"))
            .center()
            .print(),
        newText("pr-explain_text", row.explain)
            .css("margin", "5px")
            .css("font-size", "18")
            .size(600),
        newCanvas("pr-explanation", 600, 80)
            .add(0, 0, getText("pr-explain_text"))
            .center()
            .print(),
        newTimer("break", 200)
            .start()
            .wait(),
        newSelector("pr-selection")
            .add(getImage("pr-ok"), getImage("pr-nok"))
            //.shuffle()
            .wait()
            .log(),
        getAudio("pr-sentence_audio").stop()
    )
    .log("pr-item", row.item) // item number
    .log("ID", getVar("ID"))
    .log("school", getVar("school-var"))
    .log("age", getVar("age-var"))
    .log("gender", getVar("gender-var"))
)

Template("items.csv", row =>
    newTrial("experiment",
        newImage("example_image", row.image)
            .size(720)
            .center()
            .print(),
        newText("sentence", row.sentence)
            .css("margin", "5px")
            .css("font-size", "30")
            .center()
            .size(540),
        newAudio("sentence_audio", row.sentence_audio),
        newButton("play_sentence", "▶️")
            .css("font-size", "45")
            .css("background-color", "rgba(255, 255, 255, 0.0)")
            .css("border-width", "0px")
            .callback(
                getAudio("sentence_audio").play()    
            ),
        newCanvas("sentence_canvas", 600, 80)
            .add(0, 0, getText("sentence"))
            .add(550, 0, getButton("play_sentence"))
            .css("text-align", "center")
            .center()
            .print(),
        newImage("ok", "tick.png")
            .size(100, 100),
        newImage("nok", "cross.png")
            .size(100, 100),
        newCanvas("selection_canvas", 300, 100)
            .add(0, 0, getImage("ok"))
            .add(200, 0, getImage("nok"))
            .center()
            .print(),
        newTimer("break", 200)
            .start()
            .wait(),
        newSelector("selection")
            .add(getImage("ok"), getImage("nok"))
            //.shuffle()
            .wait()
            .log(),
        getAudio("sentence_audio").stop()
    )
    .log("group", row.group) 
    .log("item", row.item) // item number
    .log("condition", row.condition) // image and sentence type
    .log("ID", getVar("ID"))
    .log("school", getVar("school-var"))
    .log("age", getVar("age-var"))
    .log("gender", getVar("gender-var"))
)

Template("fillers.csv", row =>
    newTrial("fillers",
        newImage("f_example_image", row.image)
            .size(720)
            .center()
            .print(),
        newText("f_sentence", row.sentence)
            .css("margin", "5px")
            .css("font-size", "30")
            .center()
            .size(540),
        newAudio("f_sentence_audio", row.sentence_audio),
        newButton("f_play_sentence", "▶️")
            .css("font-size", "45")
            .css("background-color", "rgba(255, 255, 255, 0.0)")
            .css("border-width", "0px")
            .callback(
                getAudio("f_sentence_audio").play()    
            ),
        newCanvas("f_sentence_canvas", 600, 80)
            .add(0, 0, getText("f_sentence"))
            .add(550, 0, getButton("f_play_sentence"))
            .css("text-align", "center")
            .center()
            .print(),
        newImage("f_ok", "tick.png")
            .size(100, 100),
        newImage("f_nok", "cross.png")
            .size(100, 100),
        newCanvas("f_selection_canvas", 300, 100)
            .add(0, 0, getImage("f_ok"))
            .add(200, 0, getImage("f_nok"))
            .center()
            .print(),
        newTimer("break", 200)
            .start()
            .wait(),
        newSelector("f_selection")
            .add(getImage("f_ok"), getImage("f_nok"))
            .wait()
            .log(),
        getAudio("f_sentence_audio").stop()
    )
    .log("f_item", row.item) // type of the image
    .log("f_condition", row.condition) // version of the sentence_audio
    .log("ID", getVar("ID"))
    .log("school", getVar("school-var"))
    .log("age", getVar("age-var"))
    .log("gender", getVar("gender-var"))
)

SendResults("send", "Odeslat")

newTrial("completion_screen",
    newText("thanks", "Odpovědi byly odeslané, děkuji za Váš čas. Nyní můžete zavřít okno prohlížeče.")
        .center()
        .print(),
    newButton("wait", "")
        .wait()
)
.setOption("countsForProgressBar",false)