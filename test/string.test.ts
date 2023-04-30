const expect = require("expect.js");
import { toHump } from "../src/core"

describe("function toHump", function () {
  describe("param name", function () {
    it("正确的测试用例", function () {
      expect(toHump("a_b")).to.equal("aB");
      expect(toHump("hello_world")).to.equal("helloWorld");
    });

    it("边界值测试用例", function () {
      expect(toHump("")).to.equal("");
    });
  });
})
