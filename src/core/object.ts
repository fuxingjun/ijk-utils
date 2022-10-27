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