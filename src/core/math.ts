/**
 * 加
 * @param val
 * @returns {number}
 */
export function add(...val: number[]): number {
  let max = 0;
  let count = 0;
  for (let i = 0; i < val.length; i++) {
    const strVal = val[i].toString();
    const index = strVal.indexOf('.');
    let num = 0;
    if (index > -1) {
      num = strVal.length - 1 - index;
      max = num > max ? num : max;
    }
  }
  for (let i = 0; i < val.length; i++) {
    count += Math.round(val[i] * Math.pow(10, max));//Math.round() 函数返回一个数字四舍五入后最接近的整数。
  }
  return count / Math.pow(10, max);
}

/**
 * 乘
 * @param arg1
 * @param arg2
 * @returns {number}
 */
export function multiply(arg1: number, arg2: number): number {
  let m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {
  }
  try {
    m += s2.split(".")[1].length;
  } catch (e) {
  }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/**
 * 减去
 * @param arg1
 * @param arg2
 * @returns {number}
 */
export function subtract(arg1: number, arg2: number): number {
  let r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
}

/**
 * 除以
 * @param val
 * @param valTwo
 * @returns {number}
 */
export function divide(val: number, valTwo = 100): number {
  const strVal = val.toString();
  const strValTwo = valTwo.toString();
  const index = strVal.indexOf('.');
  const indexTwo = strValTwo.indexOf('.');
  const num = [0, 0];
  if (index > -1) {
    num[0] = strVal.length - 1 - index;
  }
  if (indexTwo > -1) {
    num[1] = strValTwo.length - 1 - index;
  }
  return Math.round(val * Math.pow(10, num[0])) / (Math.round((valTwo * Math.pow(10, num[1]))) * Math.pow(10, num[0] - num[1]));
}

export function equalFloat(x: number, y: number) {
  return Math.abs(x - y) < Number.EPSILON;
}
