var Lab = require("lab");           // load Lab module
var lab = exports.lab = Lab.script(); //export test script
var Code = require("code");      //assertion library
var server = require("../server/server.js").createServer(3000);

lab.experiment("Route tests", function() {
    // tests
    lab.test("/printer should return and array", function(done) {
        var options = {
            method: "GET",
            url: "/printers"
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);  //  Expect http response status code to be 200 ("Ok")
            Code.expect(response.result).to.be.an.array();
            server.stop(done);  // done() callback is required to end the test.
        });
    });
    lab.test("/print_lab_label should return a success message", function(done) {
      var payload= {
       printer:"DYMO_LabelWriter_450_Turbo",
        template:"labelwithname",
       mergeData:  [
        {
          first_name: "Emmanuel",
          last_name: "Nyachoke",
          middle_name: "A",
          identifier: "473305528-1",
          gender: "male"
        }
      ]};
        var options = {
            method: "POST",
            url: "/print_lab_label",
            payload:payload
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);  //  Expect http response status code to be 200 ("Ok")
            server.stop(done);  // done() callback is required to end the test.
        });
    });
});
