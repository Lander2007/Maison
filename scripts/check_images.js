import fs from "fs/promises";
import path from "path";

(async function () {
  const file = path.resolve(
    process.cwd(),
    "src",
    "app",
    "components",
    "ShopGridSection.tsx",
  );
  const filePath = path.normalize(file);
  const src = await fs.readFile(filePath, "utf8");
  const regex = /https:\/\/images\.unsplash\.com[^'"\)\s,]+/g;
  const urls = Array.from(new Set(src.match(regex) || []));
  console.log("Found", urls.length, "unique Unsplash URLs");
  for (const u of urls) {
    try {
      const res = await fetch(u, { method: "HEAD" });
      console.log(u, "->", res.status);
    } catch (err) {
      console.log(u, "-> ERROR", err.message);
    }
  }
})();
