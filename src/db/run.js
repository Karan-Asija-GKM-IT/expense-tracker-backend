import { up, down } from "./migrate.js";
import { seed, unseed } from "./seed.js";

const command = process.argv[2];

switch (command) {
  case "migrate:up":
    up();
    break;

  case "migrate:down":
    down();
    break;

  case "seed:up":
    seed();
    break;

  case "seed:down":
    unseed();
    break;

  default:
    console.log("Unknown command:", command);
    console.log("Available commands:");
    console.log("  migrate:up");
    console.log("  migrate:down");
    console.log("  seed:up");
    console.log("  seed:down");
}
