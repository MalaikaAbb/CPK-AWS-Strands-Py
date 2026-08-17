# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-08-17

### 12:31 UTC — 1 page, highest severity high

**High — CopilotPopup** · _local snapshot edit, not an upstream change_

`/strands/prebuilt-components/popup` · route `/prebuilt-components/popup` · under “Basic setup” · in a `typescript` block

8 code lines changed.

````diff
- 
+ <CopilotPopup
+ agentId="prebuilt-popup"
+ defaultOpen={true}
+ labels={{
+ chatInputPlaceholder: "Ask the popup anything...",
+ }}
+ />
````
