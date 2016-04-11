const printer = require('printer');
const Promise = require("bluebird");
module.exports.print = print;
/** This function wraps the printer module in a promise
 * @param object with a mandatory type and data
  @param printerName name of the printer to use
 * @return printer a promise
 */
function print(parameters) {
  var data = parameters.data;
  var type = parameters.type;
  var printerName = parameters.printerName.trim();
   return new Promise(function(resolve, reject) {
     var p = printer.printDirect({
       data: data,
       type: 'PDF',
       printer: printerName,
       success: function(jobID) {
         var message = {
           success: 'Print job sent',
           jobId: jobID,
           status: 'success'
         };
         resolve(message);
       },
       error: function(err) {
         var message = {
           message: 'Print job not created',
           status: err
         };
         reject(message);
       }
     });
   });
}
