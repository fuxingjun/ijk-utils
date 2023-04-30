const expect = require("expect.js");
import { type } from "../src/core";

describe("function type", function () {
  describe('param x', function () {
    it("正确的测试用例", function () {
      expect(type(undefined)).to.equal("undefined");
      expect(type(null)).to.equal("null");
      expect(type(true)).to.equal("boolean");
      expect(type(1)).to.equal("number");
      expect(type("")).to.equal("string");
      expect(type(Symbol())).to.equal("symbol");
      expect(type({})).to.equal("object");
      expect(type([])).to.equal("array");
      expect(type(/a/)).to.equal("regexp");
      expect(type(Math)).equal("math");
      expect(type(new Number(1))).equal("Number");
      expect(type(new String("1"))).equal("String");
      expect(type(new Boolean(false))).to.equal("Boolean");

      function A() {
      }

      // @ts-ignore
      expect(type(new A())).to.equal("A");
      expect(type(new Map())).to.equal("map");
      expect(type(new Set())).to.equal("set");
    });
  });
});
