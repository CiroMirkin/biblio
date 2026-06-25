import { glob } from "glob"
import { unlinkSync, rmSync } from "fs"

const dirs = ["dist", "dist-electron", "dist-ts", "release"]

const ignore = [
    "eslint.config.js",
    "src/types/electron.d.ts",
    "electron/types/marcjs.d.ts",
]

const searchDirs = ["electron", "src", "tests", "shared"]

for (const dir of dirs) {
    rmSync(dir, { recursive: true, force: true })
}

const patterns = searchDirs.flatMap(dir => [
    `${dir}/**/*.js`,
    `${dir}/**/*.d.ts`,
])
const rootPatterns = ["./*.js", "./*.d.ts"]

const files = glob.sync([...patterns, ...rootPatterns], {
    ignore: ignore.map(f => `./${f}`),
})

for (const file of files) {
    unlinkSync(file)
}
