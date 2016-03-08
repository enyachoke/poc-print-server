const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const print = require("../lib/print").print;
const expect = Code.expect;
lab.experiment("Test for create label", function() {
  // tests
  lab.test('The print function should print', (done) => {
    var buffer = new Buffer("Testing buffer", "utf-8");
    return print({
        printerName: 'DYMO_LabelWriter_450_Turbo',
        data: buffer,
        type: 'TXT'
      })
      .then((aValue) => {
        expect(aValue).to.be.an.object();
        expect(aValue).to.include('jobId');
        expect(aValue).to.include('status');
      }).catch((error) => {
        expect(error).to.exist();
        done(error);
      });
  });
});
