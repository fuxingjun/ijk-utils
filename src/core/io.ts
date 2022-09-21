import fs from "fs";

/**
 * 遍历目录中的文件
 * @param src
 * @param callback
 */
export function fileDisplay(src: fs.PathLike, callback: Function) {
  fs.readdir(src, function (err, paths) {
    if (err) {
      callback(err)
    } else {
      paths.forEach(function (path) {
        const _src = src + '/' + path;
        fs.stat(_src, function (err, stat) {
          if (err) {
            callback(err);
          } else {
            // 判断是文件还是目录
            if (stat.isFile()) {
              callback(null, _src);
            } else if (stat.isDirectory()) {
              // 当是目录，递归操作
              fileDisplay(_src, callback)
            }
          }
        })
      })
    }
  })
}
