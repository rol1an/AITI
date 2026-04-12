
const fs = require("fs");
const zh = require("./source_zh.json");
const en = require("./source_en.json");
const ja = require("./source_ja.json");
const tw = require("./source_tw.json");

const data = { "zh-CN": zh, "en": en, "ja": ja, "zh-TW": tw };
let x = fs.readFileSync("src/i18n/messages.ts", "utf-8");

for (const lang of Object.keys(data)) {
  const t = data[lang];
  const startIdx = x.indexOf(lang + ":");
  const resultIdx = x.indexOf("result:", startIdx);
  const endResultIdx = x.indexOf("},", resultIdx) + 2;
  const chars = "characters: " + JSON.stringify(t.characters) + ",\n";
  const arches = "archetypes: " + JSON.stringify(t.archetypes) + ",\n";
  const r = "result: " + JSON.stringify(t.result) + ",\n";
  x = x.slice(0, resultIdx) + r + chars + arches + x.slice(endResultIdx);
}
fs.writeFileSync("src/i18n/messages.ts", x);
console.log("inj ok");

