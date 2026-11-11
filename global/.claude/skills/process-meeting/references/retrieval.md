# Retrieval: locator and processor sub-agents

Both sub-agents are spawned with the `Agent` tool, `subagent_type: general-purpose`, `run_in_background: false`. Locator: `model: sonnet`. Processor: `model: opus`. Both are read-only on every external system.

## Connector notes
The tool names below are examples. Your connector's tool names may differ.
- Slack search must pass `channel_types: "public_channel,private_channel"`.
- Task board items resolve by direct id only (ids in the project's `CLAUDE.md`).
- Wispr Flow: `search_meetings` (query, since/until, attendee_emails), `get_meeting` with `view_transcript: {}` (page with `start_char` until no truncation marker), `resolve_share_link` for a pasted link. Timestamps are UTC; convert to the user's local time.
- If a connector denies a read or is absent: report the gap in the bundle.

## Fireflies calls
- Locate: `fireflies_search` with its query grammar, for example `keyword:"<project keyword>" from:YYYY-MM-DD to:YYYY-MM-DD limit:10`. Take the keyword from the `Meeting recordings` row of the project's `CLAUDE.md`, else use the project name. `participants:<email>` narrows further.
- Transcript: `fireflies_get_transcript` (sentences prefixed `[MM:SS - MM:SS] Speaker:`). Deep link: `https://app.fireflies.ai/view/<id>?t=<seconds>`.
- AI notes: `fireflies_get_summary` (overview, action items, keywords). Fetch only after the transcript pass.
- Id from a URL: last path segment of `https://app.fireflies.ai/view/<id>`; strip any `::token` suffix.

## Locator prompt (Sonnet)
```
Find the meeting the user means. Read-only. Do not summarize content.
Hints: <project> / <date or window> / <attendees> / <title words> (whatever Step 0 captured).
1. Read <project CLAUDE.md path> for the recordings keyword (External resources, Meeting recordings row) and attendee emails (People table, How to reach column).
2. Fireflies first (fireflies_search, grammar in 'Fireflies calls'). Window: the stated date, else the last 7 days.
3. No confident match: Wispr Flow (search_meetings, same window, then attendee_emails).
4. Return a markdown table, max 3 rows: title | id | source (fireflies/wisprflow) | start (user's local time) | duration | attendees | confidence (high/medium/low) | reason. `high` only when exactly one meeting fits every hint. State any tool gap.
```

## Processor prompt (Opus)
```
Process one meeting. Read-only on every external system; write only the bundle file.
Meeting: <id> on <source>. Project CLAUDE.md: <path>. Bundle path: <project folder>/.process-meeting-<id>.md
Order is mandatory:
1. TRANSCRIPT PASS. Fetch the full transcript (paginate until complete) and read it end to end before writing anything. Extract:
   - Decisions: what, who decided, ?t= link.
   - Action items: who (exact name), what (verb-led), by when (absolute date or "none set"), side (us/client), [MM:SS](https://app.fireflies.ai/view/<id>?t=<seconds>). Only commitments actually made; unclear owner = "unassigned", never guessed.
   - Open questions: raised and not settled on the call, owner if one was named, ?t= link.
   - Discussion overview: one line per theme in meeting order, ?t= range. Context only, not confirmed by the user.
   - Dates that moved (old vs new), consequences named on the call.
2. AI-NOTES CROSS-CHECK. Only now fetch the AI summary (fireflies_get_summary, or the Wispr Flow summary). For each note item absent from step 1: find it in the transcript; add it with a ?t= link, or reject it with one line saying why. List the diff.
3. LINKING. For every decision, action item and open question, attach at least one link (task board task/sprint/list/folder from the ids in the project CLAUDE.md, Slack message/channel with channel_types public_channel,private_channel, Gmail thread, scope doc tab). Format [title (id)](url). Where the task board or Slack contradicts the transcript, write a "CONFLICT DETECTED" block (source A, source B, needs the user). Items you could not link go under "Unlinked".
4. Write the bundle file with sections: Meeting (title, id link, start/end in the user's local time + UTC, attendees with role and side from the People table, audience class: client / internal-management / internal-team per the People table sides), Discussion overview, Decisions (table), Action items (table: side | owner | what | date | link | ?t=), Open questions (table), Dates moved, AI-notes diff, Conflicts, Unlinked, Sources (one line each, linked, with the detail level retrieved and any tool gap).
Return only the bundle path and the counts (decisions, action items, open questions, unlinked, conflicts).
```

## Bundle sanity check (main agent, Step 3 to 4)
- Every `?t=` value is inside the meeting duration and the displayed MM:SS matches the seconds.
- Every action item has an owner spelled as in the `People` table of the project's `CLAUDE.md`.
- No `yyyy-mm-dd` will leak into a client message body (convert at draft time).
- The Unlinked and Conflicts sections are surfaced verbatim in Step 5.
