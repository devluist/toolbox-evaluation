let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index.js');
let should = chai.should();

const API_URL = "http://localhost:3500";

chai.use(chaiHttp);
describe("/GET List Files with csv content", () => {

	it("Should return all files with no empty cells", (done) => {
		chai.request(API_URL)
			.get("/files/data")
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a("array");

				const files = res.body;
				for(let i=0; i < files.length; ++i){
					files[i].should.have.property("file");
					files[i].should.have.property("lines");

					const lines = files[i].lines;
					for(let i=0; i < lines.length; ++i){
						lines[i].text.should.not.be.empty;
						lines[i].number.should.not.be.null;
						lines[i].hex.should.not.be.empty;
					}
				}
				done();
			})
	});

	it("Should return only the list of files", (done) => {
		chai.request(API_URL)
			.get("/files/list")
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a("array");

				const files = res.body;
				for(let i=0; i < files.length; ++i){
					files[i].should.not.be.empty;
				}
				done();
			})
	});

	
	it("Should return only 1 file when asking for a valid fileName through query param", (done) => {
		chai.request(API_URL)
			.get("/files/data?fileName=test2.csv")
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.not.be.a("array");

				const file = res.body;
				file.should.have.property("file");
				file.should.have.property("lines");
				done();
			})
	});
});

