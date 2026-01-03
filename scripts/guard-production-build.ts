import fs from "fs";
import path from "path";

type VersionState = { version: string; iosBuildNumber: number; androidVersionCode: number };

function main() {
  const p = path.resolve(process.cwd(), "version.json");
  const v = JSON.parse(fs.readFileSync(p, "utf-8")) as VersionState;

  if (v.androidVersionCode <= 0 || v.iosBuildNumber <= 0) {
    throw new Error("Invalid build numbers in version.json");
  }

  // optional rule: production version must NOT contain dev suffixes etc.
  if (!/^\d+\.\d+\.\d+$/.test(v.version)) {
    throw new Error(`Production version must be semver X.Y.Z. Found: ${v.version}`);
  }

  console.log(`Production build allowed for ${v.version} (${v.androidVersionCode}/${v.iosBuildNumber})`);
}

main();
