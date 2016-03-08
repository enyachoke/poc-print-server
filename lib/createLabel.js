const Promise = require("bluebird");
const fs = require('fs');
const exec = Promise.promisify(require('child_process').exec);
const json2csv = Promise.promisify(require('json2csv'));
const readFilePromise = Promise.promisify(fs.readFile, fs);
const randomstring = require("randomstring");
const writeFile = Promise.promisify(fs.writeFile);
const base = process.env.PWD;
module.exports.createLabel = createLabel;
/** This function wraps the printer module in a promise
 * @param a parameter object containing options for the function
 * @return a promise with a file buffer
 */
function createLabel(parameters) {
  var tempFile = randomstring.generate({
    length: 12,
    charset: 'alphabetic'
  });
  var mergeData = parameters.mergeData;
  var template = parameters.template;
  return new Promise(function(resolve, reject) {
    json2csv({
      data: mergeData,
      hasCSVColumnTitle: false
    }).then(function(csv) {
      return writeFile(tempFile + '.csv', csv, {});
    }).then(function(result) {
      return exec("glabels-3-batch "+base+"/templates/" + template + ".glabels --input=" +
      base + "/"+tempFile + ".csv" + " --output=" +base + "/"+ tempFile + ".pdf");
    }).then(function(result) {
      return readFilePromise(base + "/"+tempFile + ".pdf");
    })
    .then(function(buffer) {
      removeTempFiles(tempFile);
      resolve(buffer);
    })
    .catch(function(err) {
      removeTempFiles(tempFile);
      reject(err);
    });
  });
}
function removeTempFiles(tempFile) {
  fs.unlink(base + "/"+tempFile+'.pdf');
  fs.unlink(base + "/"+tempFile+'.csv');
}
