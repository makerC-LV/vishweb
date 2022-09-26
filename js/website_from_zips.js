const { exit } = require("process")
var fs = require('fs');
const StreamZip = require('node-stream-zip');

const {pageImgTemplate, fileTemplate, indexTemplate, divTemplate, listenerTemplate } = require("./templates.js")


const htmlDir = "./docs/"
const iconDir = htmlDir + "icons/"
const svgDir = htmlDir + "svgs/"

const directory = {
'Bridging Treatment for Anticoagulation during Surgical or interventional procedures.zip':
    {icon: "blood_cells.svg", text: "Anticoagulation"},
  'DVT Management Pathway.zip': 
    {icon: "back_pain.svg", text: "DVT Mgmt Path" },
  'Enoxaparin Guidelines - Quick Reference Guidance.zip': 
    {icon: "blood_drop.svg", text: "Enoxaparin" },
  'Guideline for Peri-operative Management of Anticoagulation.zip': 
    {icon: "heart.svg", text: "Peri-operative" },
  'Guideline for VTE Thromboprophylaxis in Gynae Oncology.zip': 
    {icon: "fetus.svg", text: "Thrombo Gynae"},
  'Guidelines for VTE Thromboprophlaxis in Orthopaedics.zip': 
    {icon: "inpatient.svg", text: "Thrombo Ortho"},
  'TCG058V4 Thromboprophylaxis Guideline for Medical Patients.zip': 
    {icon: "syringe.svg", text: "TCG058V4"},
  'VTE Thromboprophylaxis in Surgery.zip': 
    {icon: "tb.svg", text: "Thrombo Surgery"}
}
const texts = [
    "Anticoagulation",
    "DVT MGMT Path",
    "Enoxaparin",
    "Peri-operative",
    "Thrombo Gynae",
    "Thrombo Ortho",
    "TCG058v4",
    "Thrombo Surgery"
]


// const icons = fs.readdirSync(iconDir);
// console.log(icons)

const zipfiles = process.argv.filter(e => {
    return e.endsWith(".zip")
})
console.dir(zipfiles)

if (texts.length != zipfiles.length) {
    console.error("The number of texts does not match the number of files")
    console.dir(texts)
    console.dir(zipfiles)
    exit(1)
}

processFiles(zipfiles).then(() => {
    console.log("exiting")
    exit(0)
})



async function processFiles(zipFiles) {
    let indexDivText = ''
    let indexListenerText = ''
    for (const zf of zipfiles) {
        const va = zf.split('/')
        const fName = va[va.length - 1]
        const fileNamePrefix = va[va.length-1].split(/[ .]/).join("_")
        const htmlFilename = fileNamePrefix + ".html"
        const zip = new StreamZip.async({ file: zf });
        await processOneFile(zip, fileNamePrefix, htmlFilename)
        
        const {icon, text} = directory[fName]
        indexDivText += divTemplate.replace("%ID%", fileNamePrefix).
            replace("%ICON%", icon).
            replace("%TEXT%", text)
        indexListenerText += listenerTemplate.replace("%ID%", fileNamePrefix)
            .replace("%FILE%", htmlFilename)
        
    }
    const indexText = indexTemplate.replace("%DIVS%", indexDivText)
    .replace("%LISTENERS%", indexListenerText)

    fs.writeFileSync(htmlDir + "index.html", indexText)
}

async function processOneFile(zip, fileNamePrefix, htmlFilename) {
    let pageImagesText = ""
    let pageNum = 1
    const entries = await zip.entries();
    for (const entry of Object.values(entries)) {
        if (!entry.isDirectory) {
            console.log("Trying", entry.name)
            // const text = zip.entryDataSync(entry.name).toString();
            const data = await zip.entryData(entry.name);
            const text = data.toString()
            const outfileName = fileNamePrefix + "_Page" + pageNum + ".svg"
            const outPath = svgDir + outfileName
            console.log("Writing", outPath)
            try {
                fs.writeFileSync(outPath, text);
                pageImagesText += pageImgTemplate.replace("%SVG_PAGE_FILE%", outfileName)
            } catch (err) {
                console.error(err);
                exit(1)
            }
            pageNum++
            console.log(entry.name)
        }
    }
    // write html page for zip doc
    const htmlText = fileTemplate.replace("%PAGES", pageImagesText)
    const htmlPath = htmlDir + htmlFilename
    console.log("Writing", htmlPath)
    fs.writeFileSync(htmlPath, htmlText);
}


// function convert(zipfile, fileNamePrefix) {
    
//     const zip = new StreamZip({
//         file: zipfile,
//         storeEntries: true
//     });
//     const extract = () => {

//         let pageImagesText = ""
//         let pageNum = 1
//         for (const entry of Object.values(zip.entries())) {
//             if (!entry.isDirectory) {
//                 const text = zip.entryDataSync(entry.name).toString();
//                 const outName = svgDir + fileNamePrefix + "_Page" + pageNum + ".svg"
//                 console.log("Writing", outName)
//                 try {
//                     fs.writeFileSync(outName, text);
//                     pageImagesText += pageImgTemplate.replace("%SVG_PAGE_FILE%", outName)
//                 } catch (err) {
//                     console.error(err);
//                     exit(1)
//                 }
//                 pageNum++
//             }
//         }
    
//         const htmlText = fileTemplate.replace("%PAGES", pageImagesText)
//         const htmlFilename = fileNamePrefix + ".html"
//         const htmlPath = htmlDir + htmlFilename
//         console.log("Writing", htmlPath)
//         fs.writeFileSync(htmlPath, htmlText);
        
//         indexDivText += divTemplate.replace("%ID%", fileNamePrefix).
//             replace("%ICON%", icons[iconIndex++ % icons.length]).
//             replace("%TEXT%", texts[textIndex++ % texts.length])
//         indexListenerText += listenerTemplate.replace("%ID%", fileNamePrefix)
//             .replace("%FILE%", htmlFilename)
//         //
//         zip.close()
//     }
//     zip.on('ready', extract);
// }




