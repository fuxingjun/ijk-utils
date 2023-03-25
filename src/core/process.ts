/**
 * 获取命令行参数
 */
export function getProcessArgs(): Record<string, string> {
  const args = process.argv.slice(2);
  const result: Record<string, string> = {};
  args.forEach(item => {
    const splitIndex = item.indexOf("=")
    const key = item.slice(0, splitIndex)
    const value = item.slice(splitIndex + 1)
    if (key.indexOf("--") === 0) {
      result[key.slice(2)] = value;
    }
  })
  return result;
}
