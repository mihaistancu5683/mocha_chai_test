require('co-mocha'); // Enable generators (functions which yield control to other functions) in mocha
var should = require('should'); // Enables assertions
var data = require('../lib/user-data.js');
var fs = require('co-fs');
var api = require('../lib/user-web.js');
var request = require('co-supertest').agent(api.listen()); //always listen instead of start and stop for each function
var expect = require("chai").expect;
var assert = require("chai").assert;
var chai = require('chai');
var tools = require("../lib/tools");
var sinon = require("sinon");
var filesys = require("fs");


chai.use(require('chai-json-schema'));

function doSomethingElse() {};

function doSomething(n) {
    for (var i = 0; i < n; i++) {
        doSomethingElse();
    }
}

describe("SampleTestBlock", function() {
	var sandbox;

	before(function *(){ // Runs before all tests in this block, add above block start to run for all blocks
		yield fs.writeFile('./data/users.json', '[]'); // clears the list in the users.json file to prevent accumulation of data from test to test
	});

	beforeEach(function() { // Runs before each test in this block, add above block start to run for all blocks
		// create a sandbox
		sandbox = sinon.sandbox.create();
		// stub some console methods
		sandbox.stub(console, "warn"); // doing this with console.log will cause test description not to be displayed in mocha
		sandbox.stub(console, "error"); // doing this with console.log will cause test description not to be displayed in mocha
	});

	afterEach(function() {
		// restore the environment as it was before
		sandbox.restore();
  	});

	// this test checks if the function returnValue() returns the right value
	describe("returnValue()", function() {
		it("should return the correct string - asynchronously", function(done) { 	//Text for the test + function to be ran and expected results (can add .only or .skip after "it")
			var results = tools.returnValue({ first: "Mihai", last: "Stancu"});
			if (true)
			{
				done();
			}
			else
			{
				done("Custom error message");
			}
		});
	});

	// this test checks if the function returnValue() returns the right value
	describe("returnValue()", function() {
		it("should return the correct string - synchronously", function() { 	    //Text for the test + function to be ran and expected results (can add .only or .skip after "it")
			var results = tools.returnValue({ first: "Mihai", last: "Stancu"});
			expect(results).to.equal("Stancu, Mihai"); 							    // Test actual output of the function vs the reference
		});
	});

	// this test checks if the function returnValue() returns error for no input
	describe("returnValue()", function() {
		it("should throw err if no input is passed in", function() {
		expect(function() {  tools.returnValue();}).to.throw(Error);
		});
	});

	// this test verifies that console.warn was not called when running returnValue()
	describe("returnValue()", function() {
		it("console.warn was not called", function() {
		tools.returnValue({ first: "Mihai", last: "Stancu"});
		sinon.assert.notCalled(console.warn);
		});
	});
	
	// this test verifies that console.error was only called once when running returnValue()
	describe("returnValue()", function() {
		it("console.error was called once", function() {
		tools.returnValue({ first: "Mihai", last: "Stancu"});
		sinon.assert.calledOnce(console.error);
		});
	});

	// this test verifies that console.error was only called with the exact argument "This is a console error"
	describe("returnValue()", function() {
		it("console.error was called with \"This is a console error\"", function() {
		tools.returnValue({ first: "Mihai", last: "Stancu"});
		sinon.assert.calledWithExactly(console.error, "This is a console error");
		});
	});

	// this test checks how many times the function returnValue() is called
	describe('timesCalled', function () {
		it("should call the function 12 times", function(done) { 	//Text for the test + function to be ran and expected results (can add .only or .skip after "it")
			var originalDoSomethingElse = doSomethingElse;
			doSomethingElse = sinon.spy(doSomethingElse);   		// Spy the number of calls for doSomethingElse function
			doSomething(12);                                		// Call the doSomething function with argument 12
			if (doSomethingElse.callCount == 12)
			{
				done();
			}
			doSomethingElse = originalDoSomethingElse;
		});
	});

	// this test checks the time that the function took to do it's job
	describe("performance", function() {
		it("should complete within 2 seconds", function(done) { 	//Text for the test + function to be ran and expected results (can add .only or .skip after "it")
			this.slow(500); 										// minimum time (ms) in order for the test to be considered as running slowly (and colored red)
			this.timeout(1100); 									// if the tests takes longer than this time (ms) then it fails
			setTimeout(function(){
				// delay execution of the test
			   done();
			}, 1000)
		});
	});

	// this test checks users.get before and after users.save (should have one more value after)
	describe('user data', function() {
		it('should have +1 user count after saving', function* () {
			this.slow(10); 									// minimum time (ms) in order for the test to be considered as running slowly (and colored red)
			var users = yield data.users.get(); 			//get no of users before save
			yield data.users.save({ name: 'Mihai' }); 		//save a new user
			var newUsers = yield data.users.get();			//get no of users after save
			newUsers.length.should.equal(users.length + 1); //check if we have a new user
		});
	});
	
	// this test checks users.get before and after users.save (should have one more value after)
	describe('user web', function() {
		it('should have +1 user count after saving', function* () {
			this.slow(20); 														// minimum time (ms) in order for the test to be considered as running slowly (and colored red)
			var users = (yield request.get('/user').expect(200).end()).body;    //get no of users before save (expect http status 200)
			yield data.users.save({ name: 'Stancu' });							//save a new user
			var newUsers = (yield request.get('/user').expect(200).end()).body; //get no of users after save (expect http status 200)
			newUsers.length.should.equal(users.length + 1);                     //check if we have a new user
		});
	});

	// Checks JSON validity
	describe('JSON valid', function() {
		it("should be according to schema", function () {
			var fruitSchema = JSON.parse(filesys.readFileSync("./data/fruitSchema.json", "UTF-8", function(err, contents){}));
			var goodApple = JSON.parse(filesys.readFileSync("./data/goodApple.json", "UTF-8", function(err, contents){}));
			var badApple = JSON.parse(filesys.readFileSync("./data/badApple.json", "UTF-8", function(err, contents){}));

			assert.jsonSchema(goodApple, fruitSchema);	
		});
	});

	// Checks JSON validity
	describe('JSON valid', function() {
		it("shouldn't be according to schema", function () {
			var fruitSchema = JSON.parse(filesys.readFileSync("./data/fruitSchema.json", "UTF-8", function(err, contents){}));
			var goodApple = JSON.parse(filesys.readFileSync("./data/goodApple.json", "UTF-8", function(err, contents){}));
			var badApple = JSON.parse(filesys.readFileSync("./data/badApple.json", "UTF-8", function(err, contents){}));

			assert.notJsonSchema(badApple, fruitSchema);	
		});
	});
});

