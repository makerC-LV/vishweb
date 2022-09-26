const { builtinModules } = require("module")

const pageImgTemplate = 
`
    <div class = "page-wrapper">
        <img class="page-img" src = "./svgs/%SVG_PAGE_FILE%"/>
    </div>
`

const fileTemplate =
    `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta http-equiv="Cache-control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
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

const indexTemplate =
    `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta http-equiv="Cache-control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
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

module.exports =  {pageImgTemplate, fileTemplate, indexTemplate, divTemplate, listenerTemplate }