const fs = require('fs')

template =
    `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>Composer app</title>
  <link rel="stylesheet" href="medweb.css">
 

</head>
<body>
    <div class = "parent white">
        %DIVS%
    </div>
<script>
window.addEventListener("DOMContentLoaded", ev => {
    %LISTENERS%
})
</script>
</body>

</html>
`

const divTemplate =
    `
<div class="card blue" id = "%ID%">
            <img src="./icons/%ICON%"  class="filter-white"/>
            <div>%TEXT%</div>
        </div>
`

const listenerTemplate =
    `
document.getElementById("%ID%").addEventListener("click", evt => {
    window.location = "./%FILE%";
})
`
const pages = process.argv.filter(e => {
    return (e.endsWith(".html") && !e.endsWith("index.html") && e.indexOf("_") > 0)
})
// findUniqueWords(pages)
const icons = [
    "blood_cells.svg", 
    "back_pain.svg", 
    "blood_drop.svg", 
    "heart.svg", 
    "fetus.svg",
    "inpatient.svg", 
    "syringe.svg", 
    "tb.svg",
]
let iconIndex = 0

let texts = [
    "Anticoagulation",
    "DVT MGMT Path",
    "Enoxaparin",
    "Peri-operative",
    "Thrombo Gynae",
    "Thrombo Ortho",
    "TCG058v4",
    "Thrombo Surgery"
]

let textIndex = 0
// process only one file at a time
let divs = ''
let listeners = ''

for (const page of pages) {
    const file = page.split(/[/]/)[2]
    const id = page.split(/[/.]/)[3]
    // console.log("page", page)
    // console.log("File", file)
    // console.log("id", id)
    addPage(page, file, id)

}

let text = template.replace("%DIVS", divs)
text = text.replace("%LISTENERS%", listeners)

try {
    fs.writeFileSync("./public/index.html", text);
    // file written successfully
} catch (err) {
    console.error(err);
}

// console.log(divs)
// console.log(listeners)

function addPage(page, file, id) {
    divs += getDiv(id)
    listeners += getListener(file, id)
}

function getListener(file, id) {
    let d = listenerTemplate.replace("%ID%", id)
    d = d.replace("%FILE%", file)
    return d
}

function getDiv(id) {
    let d = divTemplate.replace("%ID%", id)
    const icon = icons[(iconIndex++ % icons.length)]
    d = d.replace("%ICON%", icon)
    const text = texts[textIndex++]
    d = d.replace("%TEXT%", text)
    return d
}


function findUniqueWords(names) {
    const wa = []
    for (name of names) {
        wa.push(name.split(/[/ ._]/))
    }
    // console.dir(wa)
    const allWords = new Set()
    const sharedWords = new Set()
    for (const words of wa) {
        for (const w of words) {
            if (allWords.has(w)) {
                sharedWords.add(w)
            } else {
                allWords.add(w)
            }

        }
    }
    for (let i = 0; i < wa.length; i++) {
        wa[i] = wa[i].filter(w => { return !sharedWords.has(w) })
    }
    console.dir(wa)
}

