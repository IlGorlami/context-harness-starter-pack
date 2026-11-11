---
name: process-meeting
description: Process one meeting the user owned or took part in (Fireflies first, Wispr Flow fallback) from the full transcript into confirmed decisions, action items and open questions, every item linked to the task board or Slack, then create the follow-up meeting-notes draft for the attendees (Slack draft in the team or management channel for internal calls, Gmail draft to the client with management CC and build BCC for client calls, DM for 1-1s), each draft carrying the recording link, and save a meeting note in the project folder. Use when the user runs /process-meeting, or asks to follow up on a call, summarize a meeting for the client or team, or write the post-call email or Slack summary.
---

# /process-meeting

One meeting per run. Read-only on every external system except two writes: one meeting note in the project folder and one unsent draft (Slack or Gmail). Never a send.

## Needs

| Connector | Used in |
|---|---|
| Meeting recorder (Fireflies or Wispr Flow) | Step 1 (locate the meeting), Step 2 (transcript and AI notes) |
| Task board | Step 2 (linking), Step 4 (link check) |
| Slack | Step 2 (linking), Step 6 (Slack drafts for internal calls and DMs) |
| Gmail | Step 2 (linking), Step 6 (Gmail drafts for client calls and email 1-1s) |

If a needed connector is missing, stop and tell the user which one.

## Hard rules

- The full transcript is the source of truth. The recorder's AI notes (Fireflies summary, Wispr Flow notes) are a cross-check run AFTER the transcript pass, never the base.
- Every decision, action item and open question carries at least one link: a task board task, sprint, list or folder, a Slack message or channel, a scope doc tab, a Gmail thread, or (last resort) the recording `?t=` timestamp. An item with no link is flagged to the user, never shipped silently.
- Link form: `[title (id)](url)`, never a bare id.
- No draft is created before the user confirms all three sections (Step 5).
- Message bodies: full prose, human dates (`Mon Oct 5`), no em dashes, no `yyyy-mm-dd`. Client-visible drafts link only what the client can open (task board items and the meeting recording yes; Slack permalinks and per-item `?t=` deep links no). Sections only the user reads: short, tables.
- Every draft includes the meeting recording link (Fireflies `https://app.fireflies.ai/view/<id>`, the Wispr Flow share link, or the link from whatever recorder took the call) in its opening frame, so attendees can check the source themselves.
- Drafts are created with the connector's draft tools, for example `slack_send_message_draft` (Slack) and `create_draft` (Gmail). Your connector's tool names may differ.
- Conflict between the transcript and the task board or Slack: surface it in a `CONFLICT DETECTED` block (source A, source B, needs the user). Never resolve it silently.

## Audience routing

Classify the meeting from the attendee list against the `People` table in the project's `CLAUDE.md` (`<project>/CLAUDE.md` or `<project>/.claude/CLAUDE.md`). Its columns are `Person | Role | Side | How to reach`, where `Side` is `client`, `management` or `build`. Channels come from the same file's `External resources` table. The class fixes where the draft goes and who it addresses.

| Meeting | Who was on the call | Draft |
|---|---|---|
| Client | any `client` attendee | Gmail draft. To: client attendees. CC: everyone on the `management` side. BCC: everyone on the `build` side. Subject `Notes from call today - <Project>` unless replying on an existing thread |
| Internal, management | us only, `management` side only, no `build` side | Slack draft in the `Management channel` |
| Internal, team | us only, at least one `build` side person | Slack draft in the `Team channel` |
| 1-1 | the user plus one other person | Draft to that person's DM, wherever chats with them usually happen: the Slack DM in their `How to reach` cell, else their email (Gmail draft). A channel with no draft connector: give the body inline for the user to paste and say so |

Ambiguous (mixed management and build with no client, gaps in the `People` table, channel missing from `External resources`, 1-1 with no known DM): one AskUserQuestion in Step 0 with the three classes as options. Never guess the channel.

## Steps

### 0. Inputs
Capture from the prompt: meeting link or transcript, project, audience class if stated. If the project has no `CLAUDE.md`, ask before continuing. A user-only explainer is produced only when asked for; the default output is the attendee follow-up draft.

### 1. Locate the meeting
- Fireflies URL or id, Wispr Flow share link, or pasted transcript given: use it, skip to Step 2.
- Otherwise spawn `Agent` (`subagent_type: general-purpose`, `model: sonnet`, `run_in_background: false`) with the locator prompt in `references/retrieval.md`. It returns up to 3 candidates (title, id, date and time in the user's local time, duration, attendees, source, confidence high/medium/low, one-line reason).
- Exactly one `high` candidate: proceed. Anything else: look yourself as the main agent (same calls, widen the date window, try attendee emails), then AskUserQuestion with one option per candidate. Never guess between two same-day calls.

### 2. Process the transcript
Spawn `Agent` (`subagent_type: general-purpose`, `model: opus`, `run_in_background: false`) with the processor prompt in `references/retrieval.md`. Pass: meeting id and source, the project `CLAUDE.md` path, and the output path for the bundle. The processor:
1. Fetches the full transcript and reads it end to end.
2. Extracts decisions, action items (split us vs client, owner, date, `?t=` link), open questions, and a one-line-per-theme discussion overview.
3. Only then fetches the AI notes (Fireflies summary or Wispr Flow summary) and diffs: anything in the notes missing from its extraction is re-verified against the transcript and added, or rejected with a reason.
4. Cross-references every item with the task board and Slack (ids from the project `CLAUDE.md`) and attaches links. Flags conflicts and unlinked items.
5. Writes the bundle to `<project folder>/.process-meeting-<meeting-id>.md` (working file; deleted in Step 6) and returns the path.

### 3. Read the bundle
Read the working file. Do not trust a summary of it; the confirmation in Step 5 is built from the file.

### 4. Cross-check before confirming
For each item in the bundle, verify a link exists and resolves to the right artifact (ids from the project `CLAUDE.md`). Missing link: look once more yourself in the task board or the project folder's scope doc, then flag. Confirm the audience class and the target channel or recipients from the project `CLAUDE.md`.

### 5. Confirm with the user
Post one inline message (short, tables). Open with a headline, not a section to confirm: meeting title, date, audience class and draft destination, then the discussion overview as one line per theme. This is context for the review; nothing in it needs sign-off. Then three sections:
1. **Decisions**: table `# | Decision | Who decided | Link | ?t=`
2. **Action items**: table `# | Side (Us/Client) | Owner | What | Date | Link | ?t=`
3. **Open questions**: table `# | Question | Owner (if any) | Link | ?t=`

Conflicts and unlinked items go under the table they belong to, marked.
Then AskUserQuestion with three questions (one per section), options: `Confirm as is` / `Edit (I'll say what)` / `Drop items (I'll say which)`. Apply edits, re-show only the changed section, repeat until all three are confirmed.

### 6. Produce the output
If the work folder's `CLAUDE.md` names a voice profile file, read it before drafting. If none is named, skip this step.

**Follow-up draft (always):** pick the shape from `references/exemplars.md`:
- Short summary (default after a routine call): dates block, decisions block, next steps by party, waiting-on block, open questions, a comprehension close. Up to 250 words in email, 150 to 230 on Slack.
- Detailed scoping summary (the call carried scope or roadmap decisions): numbered sections, topic-grouped bullets, action items by party.

Create the draft where the audience routing table says, unsent. The opening frame carries the recording link. Internal Slack drafts may also link Slack permalinks and `?t=` deep links; client Gmail drafts link task board items plus the recording only.

**Explainer (only on request):** for the user only, the three confirmed sections plus what changed vs the previous call and what the user owes next.

**Meeting note (mandatory):**
- If a prep or companion note for this meeting already exists in the project folder (same date, or the same meeting in `sources:`), append a `## Follow-up (processed YYYY-MM-DD)` section to it.
- Otherwise create a meeting note in the project folder: `<project folder>/YYYY-MM-DD <meeting descriptor> follow-up.md`, with frontmatter fields `date`, `time`, `attendees`, `project`, `transcript`, `sources` (see `references/exemplars.md`).
- Body: discussion overview, the confirmed sections, the draft body in a blockquote with its destination (channel, or To/CC/BCC), then a sources list (one line per source, linked, dated).
- Delete the working file from Step 2.

### 7. Report
Answer in at most 8 lines: meeting note path, draft destination (channel, or To/CC/BCC) with its link, what is flagged (unlinked, conflicts). Remind the user that the draft is unsent.

## References
- `references/retrieval.md`: locator and processor sub-agent prompts, Fireflies and Wispr Flow calls, bundle format.
- `references/exemplars.md`: follow-up shapes, block patterns, what good follow-ups share, meeting note frontmatter.
