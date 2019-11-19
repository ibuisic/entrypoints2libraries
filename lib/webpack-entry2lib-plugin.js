const fs = require('fs');
const YAML = require('yamljs');
const glob = require("glob");

function webpackEntry2LibPlugin(options) {
  // Setup the plugin instance with options...
}


webpackEntry2LibPlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', function() {
    // read file
    const content = fs.readFileSync('./build/entrypoints.json');

    // Parse and Stringify JSON
    let entryPoints = JSON.parse(content);
    let entryPointsString = JSON.stringify(entryPoints.entrypoints);

    // Make Adjustments
    var removeArrays = entryPointsString.replace(/\]/g,"}").replace(/\[/g,"{").replace(/\"\//g,'"');
    var adjustCSS = removeArrays.replace(/css\"\:\{\"/g,'css":{"theme":{"').replace(/\.css\"/g,'.css":{}}');
    var adjustJS = adjustCSS.replace(/\.js\"/g,'.js":{}');

    // Return JSON
    var jsonString = JSON.stringify(adjustJS);
    var json = JSON.parse(jsonString);

    // Create YML
    var yamlParsed = YAML.parse(json);
    var yamlString = YAML.stringify(yamlParsed, 6, 2);

    // Write Libraries
    glob.glob("./*.libraries.yml", function (err, files, filename) {
        if (err) return console.log(err);
        filename = files[0];
        fs.writeFile(filename, yamlString, function (err) {
            if (err) return console.log(err);
            console.log('Entrypoints added to ' + filename);
            console.log('Flush your Drupal ca$h');
        });
    });
  });
};

module.exports = webpackEntry2LibPlugin;
