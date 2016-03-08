const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const createLabel = require("../lib/createLabel").createLabel;
const expect = Code.expect;
lab.experiment("Test for create label", function() {
  // tests
  lab.test('The create Label method should return a buffer', (done) => {
    var mergeData = {
      first_name: "Emmanuel",
      last_name: "Nyachoke",
      middle_name: "A",
      identifier: "473305528-1",
      gender: "male"
    }
    return createLabel({mergeData:mergeData,template:'labelwithname'})
      .then((aValue) => {
        expect(aValue).to.be.a.buffer();
      }).catch((error)=> {
        expect(error).to.exist();
        done(error);
      });
  });
});
