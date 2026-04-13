const fs = require("fs");
const path = require("path");

const cesiumSource = path.join(__dirname, "..", "node_modules", "cesium", "Build", "Cesium");
const targetDir = path.join(__dirname, "..", "public", "cesium");

const folders = ["Workers", "ThirdParty", "Assets", "Widgets"];

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  
  if (fs.statSync(src).isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

if (!fs.existsSync(cesiumSource)) {
  console.log("Cesium not yet installed, skipping asset copy.");
  process.exit(0);
}

console.log("Copying Cesium assets to public/cesium/...");

for (const folder of folders) {
  const src = path.join(cesiumSource, folder);
  const dest = path.join(targetDir, folder);
  if (fs.existsSync(src)) {
    copyRecursive(src, dest);
    console.log(`  ✓ ${folder}`);
  }
}

console.log("Done.");
