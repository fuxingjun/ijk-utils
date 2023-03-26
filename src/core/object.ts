import { toHump } from "./string";

/**
 * 获取对象的值, 中间支持 "."
 * @param object 对象
 * @param path keyPath  a.b.c
 * @returns 对象的值
 */
export function getValueByPath(object: Record<string, any>, path: string) {
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
};

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
