import fs from "fs";
import path from "path";

/**
 * 遍历目录中的文件
 * @param src
 * @param callback
 */
export function fileDisplay(src: string, callback: Function) {
  fs.readdir(src, function (err, paths) {
    if (err) {
      callback(err);
    } else {
      paths.forEach(function (_path) {
        const _src = path.join(src, _path);
        fs.stat(_src, function (err, stat) {
          if (err) {
            callback(err);
          } else {
            // 判断是文件还是目录
            if (stat.isFile()) {
              callback(null, _src);
            } else if (stat.isDirectory()) {
              // 当是目录，递归操作
              fileDisplay(_src, callback);
            }
          }
        });
      });
    }
  });
}
