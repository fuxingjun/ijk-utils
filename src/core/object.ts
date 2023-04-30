import { toHump } from "./string";
import { type } from "./type";

/**
 * 获取对象的值, 中间支持 "."
 * @param object 对象
 * @param path keyPath  a.b.c
 * @returns 对象的值
 */
export function getValueByPath(object: Record<string, any>, path: string) {
  if (!object) return object;
  path = path || '';
  const paths = path.split('.');
  let current = object;
  let result = null;
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current) break;

    if (i === j - 1) {
      result = current[path];
      break;
    }
    current = current[path];
  }
  return result;
}

function parseKey(key: string) {
  let realKey = key;
  let type = "object";
  if (key.includes("[]")) {
    realKey = key.replace("[]", "")
    type = "array"
  } else if (key.includes(":")) {
    [realKey, type] = key.split(":");
  }
  return {
    realKey,
    type,
  }
}

function createEmptyData(type: string) {
  if (type.toLowerCase() === "array") {
    return []
  } else if (type.toLowerCase() === "map") {
    return new Map();
  } else if (type.toLowerCase() === "set") {
    return new Set();
  }
  return {}
}

function getValue(obj: Record<string, any>, key: string) {
  const prevType = type(obj)
  if (prevType === "map") {
    return obj.get(key)
  } else if (prevType === "set") {
    return null;
  }
  return obj[key];
}

function setValue(obj: Record<string, any>, key: string, val: any) {
  const prevType = type(obj)
  if (prevType === "map") {
    obj.set(key, val);
  } else if (prevType === "set") {
    obj.add(val);
  } else {
    obj[key] = val;
  }
}

export function setAny(obj: Record<string, any>, key: string, val: any) {
  const keys = key.split(".");

  const root = keys.slice(0, -1).reduce((parent, subKey) => {
    const { realKey, type: vType } = parseKey(subKey);
    const prevValue = getValue(parent, realKey);
    if (!prevValue) {
      setValue(parent, realKey, createEmptyData(vType));
    }
    return getValue(parent, realKey);
  }, obj);

  const lastKey = keys[keys.length - 1]
  setValue(root, lastKey, val);
  return obj;
}

/**
 * 将对象的key转为驼峰
 * @param source
 * @returns {*}
 */
export function objectKey2Hump(source: Record<string, any>): Record<string, any> {
  const type = Object.prototype.toString.call(source);
  if (type === "[object Object]") {
    Reflect.ownKeys(source).forEach(key => {
      if (typeof key !== "string") return;
      if (key.indexOf("_") > -1) {
        const humpKey = toHump(key);
        source[humpKey] = source[key];
        Reflect.deleteProperty(source, key);
        objectKey2Hump(source[humpKey]);
      } else {
        objectKey2Hump(source[key]);
      }
    });
  } else if (type === '[object Array]') {
    source.forEach((item: Record<string, any>) => {
      objectKey2Hump(item);
    });
  }
  return source;
}
