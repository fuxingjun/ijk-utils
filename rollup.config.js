import tsPlugin from "rollup-plugin-typescript2"
import dtsPlugin from "rollup-plugin-dts"
import path from "path"

const pkg = require("./package.json")

/**
 * banner 信息, 会放在生成文件的顶部
 */
const banner = `/**
 * ${pkg.name} ${pkg.version}
 * 个人使用的一些工具方法
 * Licensed under MIT
 */
`

export default [
  {
    input: "./src/core/index.ts",
    output: [
      {
        file: path.resolve(__dirname, "./dist/index.esm.js"),
        format: "es",
        banner,
      },
      {
        file: path.resolve(__dirname, "./dist/index.cjs.js"),
        format: "cjs",
        banner,
      },
      {
        file: path.resolve(__dirname, "./dist/index.js"),
        format: "umd",
        name: "ijk-utils",
        banner,
      },
    ],
    plugins: [
      tsPlugin(),
    ],
  },
  {
    input: "./src/core/index.ts",
    output: {
      file: path.resolve(__dirname, "./dist/index.d.ts"),
      format: "es",
    },
    plugins: [
      dtsPlugin(),
    ],
  },
]
