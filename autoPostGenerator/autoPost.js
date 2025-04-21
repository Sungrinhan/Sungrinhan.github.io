const { execSync } = require("child_process");
const path = require("path");

function run(script) {
  console.log(`▶️  Running ${script}...`);
  execSync(`node ${path.join(__dirname, script)}`, { stdio: "inherit" });
}

function gitCommitAndPush() {
  console.log("Start Git commit & push...");

  try {
    execSync("git add .", { stdio: "inherit" });
    execSync(`git commit -m "auto: add blog post and topic for today"`, {
      stdio: "inherit",
    });
    execSync("git push", { stdio: "inherit" });
  } catch (err) {
    console.error("Git 작업 중 오류 발생:", err.message);
  }
}

async function main() {
  run("generateTopic.js");
  run("generatePost.js");
  gitCommitAndPush();
}

main();
