/**
 * 获取命令行参数
 */
export function getProcessArgs(): Record<string, string> {
  const args = process.argv.slice(2);
  const result: Record<string, string> = {};
  args.forEach(item => {
    const [key, value] = item.split("=")
    if (key.indexOf("--") === 0) {
      result[key.slice(2)] = value;
    }
  })
  return result;
}
