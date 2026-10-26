# WeatherWindow setup GitHub and Trello guide

Frank Gary Jr.

This guide updates your existing technology-demo-lab folder. You will build the main WeatherWindow interface from the wireframes and retain the original lab at a separate URL. You will create the accounts, repository, roadmap, invitations, and video yourself using the steps below.

## 1 Update the existing folder in VS Code

1. Stop the current server by clicking its terminal and pressing Control+C.
2. Make a copy of the whole lab folder as an extra backup if you have your own changes.
3. Download upgrade-weatherwindow.mjs from this response. Finder may save it in Downloads. Keep its .mjs extension.
4. Open your existing technology-demo-lab folder in VS Code. Confirm package.json is visible in Explorer.
5. Drag upgrade-weatherwindow.mjs from Finder into the root of that folder, beside package.json. Do not put it inside src. If you prefer to paste text: create a root file named upgrade-weatherwindow.mjs and paste the downloaded file's complete contents, then save.
6. Select Terminal > New Terminal. Run:

```bash
node --version
```

7. It should show v24.x.x. On your Mac, if Homebrew's old Node still wins, run these separately:

```bash
export PATH="/usr/local/bin:$PATH"
rehash
node --version
```

8. Preview the update. This does not change files:

```bash
node upgrade-weatherwindow.mjs
```

9. Apply it:

```bash
node upgrade-weatherwindow.mjs --apply
```

10. The updater backs up every existing file it replaces to a timestamped .weatherwindow-backup folder, writes a manifest, and installs the product code, preserved lab, tests, guides, roadmap, and wireframe copies. It does not touch your Git history or run remote actions.
11. Run these one at a time:

```bash
npm ci
npm run dev
```

12. Open the exact local URL printed by Vite. The root page is WeatherWindow. The folder name may remain technology-demo-lab; no folder rename is required. The npm package name now says weatherwindow.

If you need to restore: stop Vite, read the backup folder's manifest, copy its saved original files back to the same relative paths, and remove only the files marked newly created if you want a full rollback. Do not delete the backup before reviewing your changes. The updater does not automatically roll back completed work.

## 2 Open the app and the separate Demo Lab

1. Open the local address printed by npm run dev, for example http://127.0.0.1:5173/.
2. That is the main WeatherWindow page. Search for a city, such as Denver.
3. Select the intended city using region/country labels.
4. Change comfort limits and open a matching hour.
5. In a separate browser tab, append demo.html to that same base address, for example http://127.0.0.1:5173/demo.html.
6. The original seven research experiments appear there. The main app intentionally has no lab navigation link.
7. The lab URL is not password-protected. Anyone who knows it can open it.
8. Saved main-app preferences restore automatically on a later visit. Click Change to return to city search. The lab has its own storage key and cannot replace main-app settings.

## 3 Check every wireframe state

1. City recent: choose a city, click Change, and confirm it appears under Recently used.
2. Type-ahead: type at least two letters and select the correct region/country result.
3. Search loading: use browser Developer Tools network throttling to make the inline searching state visible.
4. Search empty: search a nonsense location; edit the retained query to recover.
5. Forecast loading: select a city on a slow connection. City and controls stay available.
6. Main results: inspect the match count, timeline, local dates, and measurements. Live data need not match the sample Denver values in the PDFs.
7. Hour detail: click a matching row/card. Read the three comparisons and supporting conditions. Click again to collapse it.
8. No matches: lower maximum rain or narrow the temperature range until no hours qualify. Widen limits to recover. A zero-match result is not a bug.
9. Forecast failure: after loading a city, switch browser Developer Tools to Offline and click Refresh forecast. Restore the connection and click Retry forecast.
10. Mobile: open browser responsive mode at 390 x 844. Choose Adjust limits, edit a value, close with X or Escape, and verify results change. Swipe the timeline and hour cards.
11. Units and persistence: switch to Celsius, reload, and confirm both city and unit restore. Fahrenheit comparison values stay canonical; changing the display unit alone should not change the matching-hour count.
12. Unavailable values: the automated fixtures cover this case. Missing temperature, wind, or rain probability never counts as a match. Supporting fields can be unavailable without excluding an otherwise valid hour.

## 4 Run the checks from VS Code

Open a second terminal in the same project folder. Leave the app server in its first terminal. Run one command at a time:

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Expected prepared results are 34 unit tests and 14 browser scenarios. Browser tests use controlled API fixtures for repeatability. For real services, do the manual city search and forecast checks as well. To inspect production output, stop the dev server and run:

```bash
npm run preview
```

Open its printed URL and append demo.html to check the built lab page too. Do not double-click index.html. Dependencies and browser downloads require internet access.

## 5 Create the GitHub repository using VS Code

1. Make or sign into your GitHub account in a browser.
2. In VS Code, select Source Control in the left sidebar. If it says Initialize Repository, click that. If it already shows tracked changes, keep the existing Git history.
3. In the terminal, run git remote -v. If a remote already points to the repository you intend to use, commit and Sync Changes there instead of creating another repository. If it points somewhere else, review that before changing it.
4. Review the changed files. The supplied .gitignore excludes node_modules, dist, backups, updater, environment files, and test output.
5. In Source Control, stage the files with the + controls or Stage All Changes after reviewing them. Do not stage credentials.
6. Enter the commit message: Build WeatherWindow proof of concept and preserve demo lab.
7. Click Commit. If Git asks for a name/email, configure your own identity and then commit. Use the email associated with your GitHub account or your GitHub no-reply email.
8. For a newly initialized repository, run git branch -M main after the first commit so the supplied workflow uses the intended branch. Then click Publish Branch or Publish to GitHub. Follow the GitHub sign-in/authorization prompt from VS Code.
9. Choose weatherwindow as the repository name. Choose public or private according to instructor requirements. A private repo needs the collaborator invite before the instructor can read it.
10. Open the repository in your browser. Confirm src, tests, docs, package.json, package-lock.json, demo.html, and the workflow are present. Confirm node_modules and backup folders are absent.
11. For later edits: Save, review Source Control, stage, enter a new commit message, Commit, then Sync Changes.

If you already created an empty weatherwindow repository on GitHub, use that repository's exact URL instead of Publish to GitHub. After committing locally, run these separately, replacing YOUR_USERNAME:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/weatherwindow.git
git push -u origin main
```

If origin already exists, inspect git remote -v before changing it. Use git remote set-url origin only if changing that remote is intended. Authentication must complete through GitHub/VS Code or a configured credential manager; your account password is not a Git HTTPS password.

## 6 Invite the instructor to GitHub

1. Open the correct repository on GitHub.
2. Select Settings > Collaborators (or the repository access section shown for your account).
3. Select Add people.
4. Search CreatorRob. Verify this is the instructor account specified in your assignment before selecting it.
5. Send the collaborator invitation.
6. Confirm the invitation appears as pending or accepted. Copy the repository URL for submission. Do not claim an invitation was accepted until GitHub shows that state.

## 7 Create the Trello Workspace and board

1. Sign in to Trello, or create an account.
2. Use Create > Create Workspace, or the Workspace creation option in the sidebar.
3. Name it WeatherWindow Development. A description can say: Research, design, implementation, verification, and release roadmap for WeatherWindow.
4. From that Workspace, create a board named WeatherWindow Development Roadmap.
5. Make these lists, in this order:

```text
Documentation and research
Technology stack
Week 1 — Foundation
Week 2 — Core experience
Week 3 — Quality and usability
Week 4 — Release and submission
In progress
Review and testing
Done
```

6. Weeks are relative to the start date you choose. Add actual due dates in Trello once your schedule is known.
7. Follow either the bulk-paste method below or the optional full importer. Do not import twice without checking existing cards.

## 8 Fast Trello method without API credentials

Trello supports creating separate cards from newline-separated titles in its desktop web interface.

1. In VS Code, open docs/TRELLO_BULK_PASTE.txt.
2. Under the first list heading, select only its card-title lines. Do not copy the heading or blank instructions.
3. Copy with Command+C.
4. In Trello, under that matching list, click Add a card and paste with Command+V into the card-title box, not a card description.
5. Choose the option to create separate cards if Trello asks. Each line becomes one card.
6. Repeat for the other six populated lists. The final three lists start empty.
7. Open docs/TRELLO_CARDS.md. It contains the full description, implementation status, and acceptance checklist for every card. Paste the matching details into each card description.
8. For checklists, choose Checklist on a card. Copy that card's checklist item text without the Markdown '- [ ]' prefix, and paste the lines into Add an item. Trello can split separate lines into checklist items.
9. Add a link to docs/TRELLO_CARDS.md in the repository to DOC-01 so the complete roadmap is referenceable from the board even while you finish individual descriptions.

This method quickly creates titles. It does not automatically transfer descriptions or checklists. Use the next method if you want those created automatically too. A CSV is not assumed to be a native universal Trello importer.

## 9 Optional Trello importer for descriptions and checklists

This is a local script you run yourself. It creates/reuses one board and adds the 31 prepared cards with native checklists. It never invites anyone or deletes existing content. Skip this section if bulk paste is enough.

1. Create the Trello Workspace first. The script can create the board inside it, so you do not need to manually create the board for this method.
2. Preview the exact card plan without credentials or remote changes:

```bash
node tools/create-trello-roadmap.mjs --plan
```

3. Follow Trello's official REST API setup instructions: https://support.atlassian.com/trello/docs/getting-started-with-trello-rest-api/.
4. Open the Trello Power-Up administration page shown in those instructions. Create your own integration/Power-Up if needed, open its API Key/Trello Auth section, and generate a key. This does not require adding a paid Power-Up to the app.
5. Use the Token link beside the key to authorize your own account. Grant only the access needed for this import. Keep both values private; do not paste them into chat, source files, Trello cards, or GitHub.
6. In the VS Code terminal run:

```bash
node tools/create-trello-roadmap.mjs --apply
```

7. Paste the key and token into the hidden prompts. They will not appear as you type. Press Enter after each.
8. Select the number for WeatherWindow Development from the returned Workspace list.
9. Verify the displayed Workspace and board name. Type CREATE only if those are correct.
10. Wait for the script to finish. It prints the board URL. If a board with that exact name already exists in that Workspace, it reuses it.
11. The script reuses cards with its own roadmap ID marker and checklist items by exact name. It does not recognize unrelated manually created cards. If you already bulk-pasted cards, choose one method and inspect duplicates before importing.
12. If a request fails, inspect the board before rerunning. Do not remove the ID markers from card descriptions if you want safe reuse.
13. No credentials are saved by the script. Revoke the temporary token in Trello account settings after completing the import if you no longer need it.
14. Replace the generic repository references in documentation cards with actual links, attach your artifacts, set dates, and move cards only after verifying them.

The importer was syntax-checked and previewed locally. Its authenticated write path is supplied for you to execute; no Trello account operation has been performed or verified here.

## 10 Add the artifacts required by the rubric

1. Open DOC-02. Attach the WeatherWindow pitch slides and scope/approval feedback.
2. Open DOC-03. Attach the two feature lists, research report, original demo evidence/source reference, and recording if required.
3. Open DOC-04. Attach Gary_Frank_Week3_ProjectPrototype.pdf and the actual prototyping-tool share link. The supplied 19 wireframe PDFs are in docs/wireframes; attach them or link the repository folder.
4. Open DOC-05. Link the researched AccuWeather and Weather Underground products plus your screenshots/research report.
5. Open DOC-06. Link docs/RESEARCH_LOG.md and add any tutorials, forum answers, or Discord resources you actually used.
6. Open the Technology stack list. Check that Vue, TypeScript, HTML/CSS, Vite, Node/npm, VS Code, APIs, Fetch, AbortController, localStorage, Vitest, Playwright, Git/GitHub, Actions, and Pages are listed in the card descriptions.
7. Work through each feature card and its acceptance criteria. Implemented in supplied code does not mean tested on your Mac or deployed.
8. Check each attachment/link using the account permissions the instructor will have. A local file path on your computer is not a shareable artifact link.

## 11 Invite the instructor to Trello

1. Open the WeatherWindow Development Workspace, not just the board.
2. Open Members, then Invite Workspace members.
3. Search creatorrob. Verify the instructor identity before sending the invitation.
4. Send the Workspace invitation.
5. Open the roadmap board and choose Share. If the board is private, add the verified instructor there too; Workspace membership alone should not be assumed to grant private-board access.
6. Confirm the pending/accepted invitation states. Copy the Workspace and board URLs for submission. If the instructor requests an invitation link, use Trello's invite-link control and share it directly through assignment Feedback.

## 12 Optional GitHub Pages publication

1. Push the source and .github/workflows/deploy.yml to the main branch.
2. Open repository Settings > Pages.
3. Choose GitHub Actions as the build/deployment source.
4. Open the Actions tab and review the workflow. Re-run after fixing any failed step.
5. Open the site URL from the successful deployment. The main app is at the repository's site root.
6. Append demo.html to that root to open the lab; for example https://YOUR_USERNAME.github.io/weatherwindow/demo.html.
7. Refresh both pages directly and confirm assets load. Check live APIs, mobile layout, and saved preferences again on the hosted origin.
8. Hosting availability depends on your account plan/repository settings. A local proof of concept and repository are still separate from public hosting.

## 13 Prepare the submission links and your own video

1. Verify all app functionality you intend to show on your recording computer.
2. Record your own 3–5 minute video. Show the main app, meaningful API work, saved preferences, the independent lab URL, and explain the modules listed in README.md. Compare the new integrated UI against the original isolated experiments.
3. Upload the recording to YouTube as Unlisted and copy the share URL, or upload an MP4 directly as instructed.
4. In assignment Feedback, supply the actual GitHub repository URL, Trello Workspace URL, Trello Board URL, and video URL or MP4. Include invite links only if your instructor requests them.
5. Check the link destinations and permissions. Invitations, artifact attachments, repository creation, board creation, publication, and submission are actions you complete; the supplied code does not claim they already occurred.

## Sources for these processes

VS Code terminal: https://code.visualstudio.com/docs/terminal/getting-started
GitHub existing code: https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github
GitHub collaborators: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/repository-access-and-collaboration/inviting-collaborators-to-a-personal-repository
Trello Workspace: https://support.atlassian.com/trello/docs/creating-a-new-workspace/
Trello invitations: https://support.atlassian.com/trello/docs/inviting-people-to-a-workspace/
Trello bulk paste: https://support.atlassian.com/trello/docs/importing-data-into-trello/
Trello checklist paste: https://support.atlassian.com/trello/docs/adding-checklists-to-cards/
Trello API setup: https://support.atlassian.com/trello/docs/getting-started-with-trello-rest-api/
Vite deployment: https://vite.dev/guide/static-deploy
