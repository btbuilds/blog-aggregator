import { readConfig, setUser } from "./config";

function main() {
  setUser("Test Name");
  const cfg = readConfig();
  console.log(cfg);
}

main();