/** Optional local Trello importer. No credentials are stored in the project. */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const plan = JSON.parse(
  await fs.readFile(path.join(root, "docs/trello-roadmap.json"), "utf8"),
);
if (!process.argv.includes("--apply")) {
  console.log("PREVIEW ONLY — no Trello requests or changes.");
  console.log(plan.name);
  for (const list of plan.lists) {
    const cards = plan.cards.filter((c) => c.list === list);
    console.log(`\n${list} (${cards.length})`);
    cards.forEach((c) => console.log("  " + c.title));
  }
  console.log(
    "\nTo create/reuse this roadmap: node tools/create-trello-roadmap.mjs --apply",
  );
  process.exit(0);
}
if (!process.stdin.isTTY) {
  console.error("Run --apply in an interactive VS Code terminal.");
  process.exit(1);
}
async function ask(label, secret = false) {
  process.stdout.write(label);
  let result = "";
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve, reject) => {
    function done() {
      process.stdin.off("data", read);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");
    }
    function read(buffer) {
      for (const char of buffer.toString()) {
        if (char === "\u0003") {
          done();
          reject(new Error("Cancelled."));
          return;
        }
        if (char === "\r" || char === "\n") {
          done();
          resolve(result.trim());
          return;
        }
        if (char === "\u007f" || char === "\b") {
          if (result) {
            result = result.slice(0, -1);
            if (!secret) process.stdout.write("\b \b");
          }
        } else if (char >= " ") {
          result += char;
          if (!secret) process.stdout.write(char);
        }
      }
    }
    process.stdin.on("data", read);
  });
}
let secretKey = "",
  secretToken = "";
async function api(method, route, values = {}) {
  const url = new URL("https://api.trello.com/1" + route);
  const headers = {
    Authorization: `OAuth oauth_consumer_key="${secretKey}", oauth_token="${secretToken}"`,
  };
  let body;
  if (method === "GET") url.search = new URLSearchParams(values).toString();
  else {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(values);
  }
  await new Promise(resolve => setTimeout(resolve, 125));
  const response = await fetch(url, {
    method,
    headers,
    body,
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok)
    throw new Error(
      `Trello returned HTTP ${response.status} during ${method} ${route.split("/").slice(0, 2).join("/")}. Check account access and inspect the board before rerunning.`,
    );
  return response.json();
}
try {
  console.log(
    "This creates/reuses one private roadmap board inside a Workspace you select. It adds lists, cards and checklists. It does not invite anyone or delete existing content.",
  );
  secretKey = await ask("Trello API key (hidden): ", true);
  secretToken = await ask("Trello token (hidden): ", true);
  if (!/^[a-zA-Z0-9]+$/.test(secretKey) || !/^[a-zA-Z0-9]+$/.test(secretToken))
    throw new Error(
      "Enter the API key and token only, without spaces or quotes.",
    );
  const orgs = await api("GET", "/members/me/organizations", {
    fields: "displayName,name",
  });
  if (!orgs.length)
    throw new Error("Create a Trello Workspace first, then rerun.");
  orgs.forEach((o, i) => console.log(`${i + 1}. ${o.displayName} (${o.name})`));
  const choice = Number(await ask("Workspace number: "));
  const org = orgs[choice - 1];
  if (!org) throw new Error("Invalid Workspace number.");
  const confirm = await ask(
    `Type CREATE to add/reuse "${plan.name}" in "${org.displayName}": `,
  );
  if (confirm !== "CREATE") throw new Error("No board changes were requested.");
  const boards = await api("GET", `/organizations/${org.id}/boards`, {
    fields: "id,name,url,closed",
  });
  const matches = boards.filter((b) => !b.closed && b.name === plan.name);
  if (matches.length > 1)
    throw new Error(
      "More than one board has this name. Rename the extra board before importing.",
    );
  const board =
    matches[0] ??
    (await api("POST", "/boards/", {
      name: plan.name,
      idOrganization: org.id,
      defaultLists: false,
      prefs_permissionLevel: "private",
      desc: "WeatherWindow monthly roadmap. Documentation, technologies, features, verification, release, and submission. Cards carry acceptance checklists; implemented code must still be verified locally.",
    }));
  console.log("Board: " + board.url);
  const lists = await api("GET", `/boards/${board.id}/lists`, {
    filter: "open",
  });
  for (const name of plan.lists) {
    if (!lists.some((l) => l.name === name)) {
      lists.push(
        await api("POST", "/lists", { name, idBoard: board.id, pos: "bottom" }),
      );
    }
  }
  const existing = await api("GET", `/boards/${board.id}/cards`, {
    filter: "open",
    fields: "id,name,desc",
  });
  for (const card of plan.cards) {
    const marker = `[WeatherWindow roadmap ID: ${card.id}]`;
    let saved = existing.find((c) => c.desc?.includes(marker));
    if (!saved) {
      saved = await api("POST", "/cards", {
        idList: lists.find((l) => l.name === card.list).id,
        name: card.title,
        desc: `${marker}\n\nStatus: ${card.status}\n\n${card.description}\n\nAcceptance details and sources: docs/TRELLO_CARDS.md in your GitHub repository. Add the actual repository link after creation.`,
        pos: "bottom",
      });
      existing.push(saved);
      console.log("Created " + card.title);
    } else console.log("Reusing " + card.title);
    const checklists = await api("GET", `/cards/${saved.id}/checklists`, {
      checkItems: "all",
    });
    const checklist =
      checklists.find((c) => c.name === "Acceptance checklist") ??
      (await api("POST", "/checklists", {
        idCard: saved.id,
        name: "Acceptance checklist",
      }));
    const items = checklist.checkItems ?? [];
    for (const name of card.checklist) {
      if (!items.some((x) => x.name === name)) {
        await api("POST", `/checklists/${checklist.id}/checkItems`, {
          name,
          checked: false,
          pos: "bottom",
        });
      }
    }
  }
  console.log("\nRoadmap complete: " + board.url);
  console.log(
    "Next: attach/link your prior artifacts, verify the instructor identity, invite creatorrob to the Workspace and Board, and set real dates. No invitations or uploads were sent by this script.",
  );
} catch (e) {
  console.error("\n" + (e instanceof Error ? e.message : "Import stopped."));
  console.error(
    "If a network error occurred after a change, inspect the board before rerunning. Matching ID markers let a later run reuse existing cards.",
  );
  process.exitCode = 1;
} finally {
  secretKey = "";
  secretToken = "";
}
