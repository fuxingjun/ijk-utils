export * from "./io"
export * from "./process"

/**
 * @description: 根据背景色计算文字颜色
 * @param {*} color
 * @return {*}
 */
export function calcTextColor(color: string): string {
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
export function toHump(name: string): string {
  return name.replace(/_(\w)/g, function (_all, letter) {
    return letter.toUpperCase();
  });
}

/**
 * @description: 驼峰转换下划线
 * @param {string} name
 * @return {*}
 */
export function toLine(name: string): string {
  return name.replace(/([A-Z])/g, "_$1").toLowerCase();
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

/**
 * 将对象的key转为下划线
 * @param source
 * @returns {*}
 */
export function objectKey2Line(source: Record<string, any>): Record<string, any> {
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
    });
  } else if (type === '[object Array]') {
    source.forEach((item: Record<string, any>) => {
      objectKey2Line(item);
    });
  }
  return source;
}

/**
 * 异步函数辅助方法
 * @param asyncFunc
 * @param args
 * @returns {Promise<*[]>}
 */
export async function errorCaptured(asyncFunc: Function, ...args: any[]): Promise<any> {
  try {
    return [null, await asyncFunc(...args)];
  } catch (err) {
    return [err, null];
  }
}

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
export const getTextWidth = (function () {
  let canvas: HTMLCanvasElement;
  return function getTextWidth(
    text: string,
    font: string = 'bold 12px system-ui, —apple-system, Segoe UI, Roboto, Emoji, Helvetica, Arial, sans-serif'
  ): number {
    // re-use canvas object for better performance
    !canvas && (canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d')!;
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  };
})();

interface TreeOption {
  parentIdKey?: string;
  idKey?: string;
  nameKey?: string;
  /**
   * 判断是否根节点的方法
   */
  isRootNode?: Function;
}

/**
 * 默认选项
 */
const defaultOption = {
  parentIdKey: 'parentId',
  idKey: 'id',
  nameKey: 'name',
  isRootNode(parentId: number | string): boolean {
    return parentId === 0;
  }
};

/**
 * 数组转树结构
 * @param {*} list 原数组
 * @param {*} option 配置项 parentIdKey: parentId的key, idKey: id的key, nameKey: name的key, isRootNode: 判断是否为根节点的方法
 * @returns {Record<string, any>[]}
 */
export function list2Tree(
  list: Record<string, any>[],
  option: TreeOption = defaultOption
): Record<string, any>[] {
  const parentIdKey = option.parentIdKey || defaultOption.parentIdKey;
  const idKey = option.idKey || defaultOption.idKey;
  const nameKey = option.nameKey || defaultOption.nameKey;
  const isRootNode = option.isRootNode || defaultOption.isRootNode;
  const map = new Map();
  const result: Record<string, any>[] = [];
  list.forEach(item => {
    // 如果是根节点, push 到结果
    if (isRootNode(item[parentIdKey])) {
      result.push(item);
    } else {
      // 如果父节点已存到map, 将节点存到父节点children
      if (map.has(item[parentIdKey])) {
        const parent = map.get(item[parentIdKey]);
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(item);
      } else {
        // 如果父节点还没有存到map, 用id 和children组成对象存入map, 后面遍历到父节点时, 再存入其它信息
        map.set(item[parentIdKey], {
          id: item[parentIdKey],
          children: [item],
        });
      }
    }
    // 如果当前节点没有存到map, 存到map
    if (!map.has(item[idKey])) {
      map.set(item[idKey], item);
    } else {
      const current = map.get(item[idKey]);
      // 如果map中已存在item, 判断是否是前面遍历时只存了id和children, 是的话将children合并进去
      if (!current[nameKey]) {
        item.children = current.children;
        map.set(item[idKey], item);
      }
    }
  });
  return result;
}