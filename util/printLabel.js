const printer = require('printer');
const Promise = require("bluebird");
module.exports.printLabel = printLabel;
/** This function wraps the printer module in a promise
 * @param filename name of the file to be printed
  @param printerName name of the printer to use
 * @return printer a promise
 */
function printLabel(filename,printerName) {
   return new Promise(function(resolve, reject) {
     var p = printer.printFile({
       filename: filename,
       printer: printerName,
       success: function(jobID) {
         var message = {
           success: 'Print job sent',
           jobId: jobID
         };
         resolve(message);
       },
       error: function(err) {
         var message = {
           message: 'Print job not created',
           error: err
         };
         reject(message);
       }
     });
   });
}
