const expect = require("expect.js");
import { getValueByPath, setAny } from "../src/core"

describe("function getValueByPath", function () {
  describe("param object", function () {
    it("正确的测试用例", function () {
      const target = {
        a: { b: 1 },
        x: 2,
        y: [4, 5, 6],
        z: { y: [7, 8, 9] },
      }
      const target2 = [234, 53, 34];
      expect(getValueByPath(target, "a.b")).to.equal(1);
      expect(getValueByPath(target2, "1")).to.equal(53);
    });

    it("边界值测试用例", function () {
      const target = {
        a: { b: 1 },
        x: 2,
        y: [4, 5, 6],
        z: { y: [7, 8, 9] },
      }
      expect(getValueByPath(target, "")).to.equal(undefined);
    });
  });

  describe("param path", function () {
    it("正确的测试用例", function () {
      const target = {
        a: { b: 1 },
        x: 2,
        y: [4, 5, 6],
        z: { y: [7, 8, 9] },
      }
      expect(getValueByPath(target, "a.b")).to.equal(1);
      expect(getValueByPath(target, "x")).to.equal(2);
      expect(getValueByPath(target, "y.1")).to.equal(5);
      expect(getValueByPath(target, "z.y.1")).to.equal(8);
    });

    it("边界值测试用例", function () {
      const target = {
        a: { b: 1 },
        x: 2,
        y: [4, 5, 6],
        z: { y: [7, 8, 9] },
      }
      expect(getValueByPath(target, "")).to.equal(undefined);
      expect(getValueByPath(target, "a")).to.eql({ b: 1 });
      expect(getValueByPath(target, "z.y")).to.eql([7, 8, 9]);
      expect(getValueByPath(target, "z.")).to.equal(undefined);
    });
  });
});

describe("function setAny", function () {
  describe("param key", function () {
    it("正确的测试用例", function () {
      expect(setAny({}, "a.b.c", 1)).to.eql({ a: { b: { c: 1 } } })
      expect(setAny({}, "a.b[].0", 1)).to.eql({ a: { b: [1] } });
      expect(setAny({}, "a.b:array.0.c", 1)).to.eql({ a: { b: [{ c: 1 }] } });
      expect(setAny({}, "x.y:map.z", 1)).to.eql({ x: { y: new Map([["z", 1]]) } });
      expect(setAny({}, "x.y:set.", 1)).to.eql({ x: { y: new Set([1]) } });
    })
  })
});
