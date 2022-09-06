/**
 * @description: 根据背景色计算文字颜色
 * @param {*} color
 * @return {*}
 */
export function calcTextColor(color: string) {
  if (!color) return "inherit";
  const red = parseInt('0x' + color.slice(1, 3));
  const green = parseInt('0x' + color.slice(3, 5));
  const blue = parseInt('0x' + color.slice(5, 7));
  const lightness = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255;
  return lightness > .8 ? "inherit" : "#fff";
}

/**
 * @description: 下划线转换驼峰
 * @param {string} name
 * @return {*}
 */
export function toHump(name: string) {
  return name.replace(/_(\w)/g, function (_all, letter) {
    return letter.toUpperCase();
  });
}

/**
 * @description: 驼峰转换下划线
 * @param {string} name
 * @return {*}
 */
export function toLine(name: string) {
  return name.replace(/([A-Z])/g, "_$1").toLowerCase();
}

/**
 * 将对象的key转为驼峰
 * @param source
 * @returns {*}
 */
export function objectKey2Hump(source: Record<string, any>) {
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
    })
  } else if (type === '[object Array]') {
    source.forEach((item: Record<string, any>) => {
      objectKey2Hump(item);
    })
  }
  return source;
}

/**
 * 将对象的key转为下划线
 * @param source
 * @returns {*}
 */
export function objectKey2Line(source: Record<string, any>) {
  const reg = /([A-Z])/g;
  const type = Object.prototype.toString.call(source);
  if (type === "[object Object]") {
    Reflect.ownKeys(source).forEach(key => {
      if (typeof key !== "string") return;
      if (reg.test(key)) {
        const lineKey = toLine(key);
        source[lineKey] = source[key];
        Reflect.deleteProperty(source, key);
        objectKey2Line(source[lineKey]);
      } else {
        objectKey2Line(source[key]);
      }
    })
  } else if (type === '[object Array]') {
    source.forEach((item: Record<string, any>) => {
      objectKey2Line(item);
    })
  }
  return source;
}

/**
 * 异步函数辅助方法
 * @param asyncFunc
 * @param args
 * @returns {Promise<*[]>}
 */
export async function errorCaptured(asyncFunc: Function, ...args: any[]) {
  try {
    return [null, await asyncFunc(...args)];
  } catch (err) {
    return [err, null];
  }
}

