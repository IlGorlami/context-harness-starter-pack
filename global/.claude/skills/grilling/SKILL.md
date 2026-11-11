---
name: grilling
description: >-
  Grill the user relentlessly about a plan, decision, or idea until you reach a shared understanding. Work the design tree in rounds: ask the whole unblocked frontier each round, numbered, and carry your own recommended answer on every question. Look up every fact yourself instead of spending the user's answers on it; put only genuine decisions to them. Interview only, writes nothing. Use when the user wants to stress-test their thinking, pressure-test a plan or a scope call, or uses any "grill" trigger phrase.
---

# Grilling

## What this does
Interview the user relentlessly about a plan, decision, or idea until you reach a shared understanding. Map it as a **design tree**: every decision branches into the decisions that hang off it.

Interview only. This skill writes nothing, anywhere.

## Work the tree in rounds
The **frontier** is every decision whose prerequisites are already settled: the questions you can ask *now* without guessing at answers you have not heard yet.

Ask the whole frontier in one round. Number each question and give your recommended answer. Then wait for the user's answers before the next round.

A question whose answer depends on another question still open in this round belongs to a *later* round, not this one. Each round of answers reshapes the tree: settled decisions push the frontier outward and unblock the questions that depended on them. Recompute the frontier, ask the next round.

## Question format
```
❓ **Q1** - **<question title>**: <question body, may run several paragraphs, may offer multiple choices>

➡️ <your recommended answer>
```

## Operating rules (non-negotiable)
- **Every question carries your recommended answer.** Never ask an open question with no position of your own. State the recommendation, state why, then let the user confirm, correct, or reject it.
- **Facts you look up. Decisions you ask.** If an answer exists anywhere in the environment, go find it. Never spend one of the user's answers on something you could have read.
- **Dispatch sub-agents for facts, and do not block on them.** A running exploration is just an unsettled prerequisite: only the questions downstream of it wait for the sub-agent to report. Ask the rest of the frontier now.
- **Say what you looked up and what you found.** If a lookup contradicts what the user just told you, surface the contradiction instead of swallowing it. That is one of the most valuable things a grill produces.
- **Do not act until the user confirms shared understanding.** No code, no writes, no messages. The grill ends when they say it ends.

## What counts as a decision worth asking about
Ask about: scope boundaries; trade-offs with real alternatives; anything hard to reverse; anything that commits the user or a third party to something; anything where two sources disagree and only the user can adjudicate; anything where your recommendation could plausibly be wrong.

Do not ask about: facts already on record; mechanical details; choices with an obvious default and no real downside. State the default and move on.

## Stopping
The grill is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Close with a short recap: what got settled, what is still open. Then stop and wait.

## Provenance
Merged from `mattpocock/skills`, `skills/productivity/grilling` (design tree, frontier rounds, question format, non-blocking sub-agent dispatch) plus local rules (a recommendation on every question, the decision-versus-fact test, contradiction surfacing, closing recap). Upstream: https://github.com/mattpocock/skills

Vendored deliberately, and deliberately absent from `~/.agents/.skill-lock.json`, so `npx skills update` cannot overwrite the merge. To pull upstream changes, diff against the source above by hand.
