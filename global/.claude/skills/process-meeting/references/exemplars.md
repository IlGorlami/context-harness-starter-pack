Paste two of your own best follow-ups under each shape. The skill copies their structure.

# Exemplars: what a good follow-up looks like

## What good follow-ups share
- Opens with a one-line frame, with no commentary about the message. The frame also carries the recording link (`Recording: [Fireflies](https://app.fireflies.ai/view/<id>)`) when the call was recorded.
- Topic-grouped bold headings, one bullet per fact, no paragraphs inside sections.
- Every ticket is a link with the ticket name as anchor; no bare ids. Client drafts: no Slack links or `?t=` deep links; the recording link itself is fine.
- Human dates (`Mon Oct 5`, `Oct 5 to 9`, `9/28`), never ISO.
- Action items split by party (Client / Us), a named owner per item, `(DONE)` marker allowed.
- Closes by inviting correction or questions, not "please confirm".

## Shape A: short summary after a routine call
Use by default. About 230 words. Blocks in order: what is live now; urgent patch (own branch, target date); dates block (one line per deploy or sprint window, ticket linked); decisions; cadence note; "Waiting on you, <name>"; availability; correction invite.

> Hi <names>,
> <one-line frame>. Recording: <recording link>
>
> Live today: <what is live now>
>
> **<Urgent patch, own branch, target date>:**
> - [<ticket name>](<ticket url>)
>
> **Dates in <month>:**
> - <date or window>: [<ticket name>](<ticket url>) <what happens>
>
> **Decisions:**
> - <decision>
>
> **<Cadence note heading>:** <cadence note>
>
> **Waiting on you, <name>:** <what you need and what happens once you have it>
>
> <availability note>
> <correction invite>
>
> <sign-off>

Your examples:

<paste example 1>

<paste example 2>

## Shape B: detailed scoping summary
Use when the call carried scope, roadmap or process decisions, or when a short summary already went out and the client needs the full picture. Numbered sections: 1. Communication (cadence proposal, posed as a question), 2. Action Items (For <client> / For us, owner-led bullets, DONE markers), 3. Roadmap (deploy blocks with dates and linked tickets), 4. Scoping Summary / Decisions (topic-grouped bullets, "should" phrasing for agreed behaviour). Close by inviting questions on the topics covered. Credit a co-author when a section is theirs.

> Hi <names>,
> <one-line frame>. Recording: <recording link>
>
> **1. Communication**
> <cadence proposal, ending in a question>
>
> **2. Action Items**
> For <client>:
> - <owner> to <verb> <what>
> For us:
> - <owner> to <verb> <what>
>
> **3. Roadmap**
> <roadmap block, pattern below>
>
> **4. Scoping Summary / Decisions**
> <decisions block, pattern below>
>
> <close inviting questions>
> <co-author credit, if any>
> <sign-off>

Your examples:

<paste example 1>

<paste example 2>

## Block patterns

Roadmap block pattern (one deploy heading with its date, then linked tickets):
> <Deployment name> (<date>):
> - [<ticket name>](<ticket url>): <short note>
> <Deployment name> (<date>):
> - [<ticket name>](<ticket url>)
> - [<ticket name>](<ticket url>)

Decisions block pattern (topic heading, then "should" bullets):
> <Topic heading>
> - <thing> should <agreed behaviour>
> - <thing> should <agreed behaviour>

## Meeting note frontmatter (Step 6)
```yaml
---
date: YYYY-MM-DD
time: "HH:MM"
attendees: []
project: "<project>"
transcript: "<recording link>"
sources:
  - "[<meeting title> (<id>)](<recording link>), <date> <time> local, <n> min; transcript read in full"
  - "<task board / Slack / Gmail lines, linked>"
---
```
