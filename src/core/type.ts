export function type(x: any) {
  const t = typeof x;

  if (t == null) {
    return "null";
  }

  if (t !== "object") {
    return t;
  }

  const toString = Object.prototype.toString;

  const innerType = toString.call(x).slice(8, -1);

  const innerLowType = innerType.toLowerCase();

  if (['String', 'Boolean', 'Number'].includes(innerType)) {
    return innerType;
  }

  if (["array", "regexp", "math", "map", "set"].includes(innerLowType)) {
    return innerLowType
  } else if (typeof x?.constructor?.name === "string" && x?.constructor?.name !== "Object") {
    return x?.constructor.name;
  }

  return innerLowType;
}
