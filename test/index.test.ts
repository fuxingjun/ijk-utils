const expect = require("expect.js");
import { calcTextColor, type } from "../src/core"

describe("function calcTextColor", function () {
  describe("param color", function () {
    it("正确的测试用例", function () {
      expect(calcTextColor("#333333")).to.equal("#fff");
    });

    it("边界值测试用例", function () {
      expect(calcTextColor("")).to.equal("inherit");
      expect(calcTextColor("#ffffff")).to.equal("inherit");
      expect(calcTextColor("#000000")).to.equal("#fff");
    });
  });
});


