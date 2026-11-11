---
paths:
  - "src/**"
---

# Code rules

This rule loads only when Claude reads or edits a matching file. You must change `paths` to your source folders.

Examples to replace:

- Validate every argument at the boundary.
- No new dependency without a stated reason in the commit body.
- Reuse the existing helper before writing a new one.
- <your rule>
