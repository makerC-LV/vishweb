const fs = require('fs')
const StreamZip = require('node-stream-zip');

const fileTemplate =
    `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>Composer app</title>
  <link rel="stylesheet" href="medweb.css">
 

</head>
<body>
    <div class = "svg-container">
    
    %PAGES%  

    </div>
</body>

</html>
`

const pageTemplate =
    `
    <div class = "page-wrapper">

    %ONE_PAGE%

    </div>

    `

const zipfiles = process.argv.filter(e => {
    return e.endsWith(".zip")
})
// process only one file at a time

for (zf of zipfiles) {
    convert(zf)
}

function convert(zipfile) {
    const currentFile = zipfile
    const zip = new StreamZip({
        file: zipfile,
        storeEntries: true
    });
    const extract = () => {
        let svg_text = ""
        for (const entry of Object.values(zip.entries())) {
            if (!entry.isDirectory) {
                const cleanText = clean(zip, entry)
                svg_text += cleanText
            }
        }
    
        const htmlText = fileTemplate.replace("%PAGES%", svg_text)
        const va = currentFile.split('/')
        const fName = va[va.length - 1]
        console.log(fName)
        const outName = ('./public/' + va[va.length-1].split(/[ .]/).join("_") + ".html").toLowerCase()
        console.log("Will write " + outName)
        try {
            fs.writeFileSync(outName, htmlText);
            // file written successfully
        } catch (err) {
            console.error(err);
        }
        zip.close()
    }
    zip.on('ready', extract);
}

function clean(zip, entry) {
    const na = entry.name.split(/[_.]/)
    const suffix = na[1] + na[2]
    const text = zip.entryDataSync(entry.name).toString();
    let cleanText = fixIds(text, suffix)
    // cleanText = changeSize(cleanText, 3.0)
    return pageTemplate.replace("%ONE_PAGE%", cleanText)

}

// Doesn't work as expected - every diemnsion needs to be zoomed
function changeSize(text, zoomFactor) {
    //width="595.32pt" height="841.92pt" viewBox="0 0 595.32 841.92"
    const sizeRe = /width="([0-9.]+)pt" height="([0-9.]+)pt" viewBox="0 0 [0-9.]+ [0-9.]+"/
    const m = text.match(sizeRe)
    const w = (parseFloat(m[1]) * zoomFactor).toFixed(2)
    const h = (parseFloat(m[2]) * zoomFactor).toFixed(2)
    const repl = `width="${w}pt" height="${h}pt" viewBox="0 0 ${w} ${h}"`
    return text.replace(sizeRe, repl)
}

function fixIds(text, suffix) {
    let newText = text
    const ids = getIds(text)
    // console.log("found ids:" + ids.length)
    for (const id of ids) {
        newId = id + suffix
        newText = newText.replaceAll(`"${id}"`, `"${newId}"`) // declarations
        newText = newText.replaceAll(`"#${id}"`, `"#${newId}"`)  // uses
    }
    return newText
}

function getIds(text) {
    const re = /id="([^"]+)"/g;

    const ids = []
    let m;

    do {
        m = re.exec(text);
        if (m) {
            ids.push(m[1])
        }
    } while (m);
    return ids
}


