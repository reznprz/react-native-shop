import fs from "fs";
import path from "path";

type ReleaseType = "patch" | "minor" | "major";

type VersionState = {
  version: string;
  iosBuildNumber: number;
  androidVersionCode: number;
};

function assertReleaseType(x: string): asserts x is ReleaseType {
  if (x !== "patch" && x !== "minor" && x !== "major") {
    throw new Error(`Invalid release type: ${x}. Use patch|minor|major`);
  }
}

function parseSemver(v: string) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v);
  if (!m) throw new Error(`Invalid semver: ${v}`);
  return { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]) };
}

function bumpSemver(v: string, type: ReleaseType) {
  const s = parseSemver(v);
  if (type === "patch") return `${s.major}.${s.minor}.${s.patch + 1}`;
  if (type === "minor") return `${s.major}.${s.minor + 1}.0`;
  return `${s.major + 1}.0.0`;
}

function main() {
  const releaseType = process.argv[2] ?? "patch";
  assertReleaseType(releaseType);

  const filePath = path.resolve(process.cwd(), "version.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const current = JSON.parse(raw) as VersionState;

  const next: VersionState = {
    version: bumpSemver(current.version, releaseType),
    iosBuildNumber: current.iosBuildNumber + 1,
    androidVersionCode: current.androidVersionCode + 1,
  };

  fs.writeFileSync(filePath, JSON.stringify(next, null, 2) + "\n", "utf-8");

  console.log("Version bumped:");
  console.log(`  version:           ${current.version} -> ${next.version}`);
  console.log(`  iosBuildNumber:    ${current.iosBuildNumber} -> ${next.iosBuildNumber}`);
  console.log(`  androidVersionCode:${current.androidVersionCode} -> ${next.androidVersionCode}`);
}

main();