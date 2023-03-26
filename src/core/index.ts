export * from "./io"
export * from "./process"
export * from "./object"
export * from "./string"

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
