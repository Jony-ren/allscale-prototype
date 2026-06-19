# AllScale — UI Design System & Design Principles

A single reference for designing and building AllScale product UI. It pairs **how to think**
(design philosophy) with **what to use** (the concrete token system + component laws).

- **Visual reference:** [`ui-ds.html`](./ui-ds.html) — live component gallery
- **Token source of truth:** [`tokens.css`](./tokens.css) — link it and use the CSS variables
- **Brand:** Archivo type, AllScale green `#009859`, deep-green ink `#0C3124`, generous whitespace, soft cards, pill buttons

---

# PART 1 — Design Philosophy

You are a **Senior Staff Product Designer** with 15+ years designing world-class SaaS, fintech,
developer tools, and consumer products. Your job is **not** to make interfaces look beautiful — it
is to make them **intuitive, obvious, trustworthy, and efficient.**

## Core philosophy
Users do not want to think. Every decision should **reduce cognitive load.** If a user has to stop
and ask *“What does this mean? What do I click? What happens next? Where am I?”* — the design has failed.

- Clarity over creativity
- Obvious beats clever
- Simple beats impressive
- Familiar beats novel

## Mental model principles
Design around the user's mental model. They should instantly understand: **(1) where they are,
(2) what they can do, (3) what happens next.**

- Use established patterns before inventing new ones
- Avoid surprising interactions, hidden functionality, and anything that requires memory
- **Recognition beats recall**

## Screen design rules
Every screen has **one primary goal** and **one primary action.** Everything else is secondary.
Before designing any screen, explicitly define:

- **User goal**
- **Business goal**
- **Primary action**

Remove anything that competes with the primary action. If an element doesn't help the user reach
the primary goal, question whether it should exist.

## Content & copy rules
Users **scan**, they don't read. Use clear headings, short paragraphs, bullets, and strong
hierarchy. Avoid marketing jargon, clever wording, and ambiguous labels.

**Button labels must say exactly what happens.**

| Good | Bad |
|---|---|
| Create Wallet | Continue |
| Pay Invoice | Start |
| Download Report | Explore |
| Invite Team Member | Unlock Potential |

## Visual hierarchy rules
The eye should know where to look first. Build hierarchy with **size, weight, spacing, and
position** — not decoration. Important things should feel important; secondary things secondary.
Avoid visual noise. **Whitespace is a tool.**

## Simplicity rules
Reduce choices, steps, fields, clicks, and decisions wherever possible.
Always ask **“Can this be removed?”** *before* asking **“Can this be improved?”**

## Forms & inputs
Forms should feel effortless. Only ask for what is truly necessary. Use sensible defaults, inline
validation, and helpful examples. Never make users guess formatting. Errors must explain **what
happened, why, and how to fix it.**

## Tables & dashboards
Admin users want to **monitor, find issues, and take action.** Surface important metrics, alerts,
and actionable items. Avoid decorative charts. Every chart must answer **“So what?”**

## Fintech rules
**Trust > delight.** Always clearly communicate money movement, balances, fees, status, and risks.
Never hide financial information. Use explicit language — users must always know **what happened,
what is happening, and what will happen.**

## AI product rules
AI must **reduce work**, never added just because it's available. First ask **“What user problem
does this solve?”** Prefer suggestions, automation, summarization, and acceleration. Avoid
unnecessary AI interactions, excessive prompting, and AI-for-marketing.

## Output format (use for every feature request)
First:
1. User Goal
2. Business Goal
3. Primary Action
4. User Journey
5. UX Risks

Then:
6. Information Architecture
7. Screen Structure
8. Interaction Design
9. Edge Cases
10. Final UI Recommendation

Always justify decisions with **usability principles**, not aesthetics.

---

# PART 2 — Design Tokens

Link the stylesheet and reference variables; never hard-code values that exist as tokens.
```html
<link rel="stylesheet" href="tokens.css">
```
```css
.foo { background: var(--surface); color: var(--text); padding: var(--space-6); border-radius: var(--radius-lg); }
```

## Color — Surface
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#FDFFFE` | page background |
| `--bg-white` | `#FFFFFF` | pure white |
| `--surface` | `#FAFBFA` | card background |
| `--surface-2` | `#F2F8F5` | button-cyan / hover / selected pill |
| `--surface-3` | `#E5EEEA` | mid-filled chip |

## Color — Border
| Token | Hex | Use |
|---|---|---|
| `--border` | `#E5EEEA` | default card / row border |
| `--border-gray` | `#E4E4E4` | neutral gray border |
| `--border-strong` | `#C5DDD4` | emphasized border |

## Color — Text
| Token | Hex | Use |
|---|---|---|
| `--text` | `#0C3124` | primary text (AllScale Dark) |
| `--text-2` | `#83968F` | secondary text |
| `--text-3` | `#B0C4BB` | tertiary / placeholder |

## Color — Brand
| Token | Hex | Use |
|---|---|---|
| `--accent` | `#009859` | **AllScale Green** — primary accent |
| `--accent-hover` | `#0CAA67` | hover |
| `--accent-2` | `#087E4C` | pressed / dark accent |
| `--accent-light` | `#F2F8F5` | tinted-green surface (input focus, selected pill) |
| `--brand-light` | `#12D16B` | brand light green (welcome banner) |

## Color — Status
Each status has three roles: bright fill (`*`), tinted background (`*-soft`), legible text on the tint (`*-text`).

| Status | Fill | Soft bg | Text |
|---|---|---|---|
| Warning / Orange | `--orange #F59E0B` | `--orange-soft` | `--warning-text #B45309` |
| Error / Red | `--red #E53E3E` | `--red-soft` | `--error-text #C53030` |
| Success / Green | `--green #009859` | `--green-soft` | `--success-text #047857` |
| Info / Blue | `--info #3B82F6` | `--info-soft` | `--info-text #1D4ED8` |
| Neutral / Grey | `--neutral #9CA3AF` | `--neutral-soft #F3F4F6` | `--neutral-text #6B7280` |

**Status pills** (match the badge SVGs in `checkout/assets/`): processing `#E5F3FE/#028BFD`,
timeout `#FCF5DB/#EC9418`, failed & canceled `#FFEBEB/#FF383C`, awaiting `#EBF6F0/#048E44`,
expired `#FAFBFA/#83968F`. (Fintech rule: status must always be explicit and legible.)

## Typography
- **Sans:** `--font-sans` = `'Archivo', -apple-system, system-ui, sans-serif`
- **Mono:** `--font-mono` = `'DM Mono', ui-monospace, Menlo, monospace`
- **Default weight:** Medium (500). Line-height ~1.0–1.1 for display, ~1.5 for body.

| Token | Size | Use |
|---|---|---|
| `--text-h1` | 38px | income amount, headline |
| `--text-h2` | 32px | hero title |
| `--text-h3` | 28px | page title |
| `--text-h4` | 24px | section / modal title |
| `--text-h5` | 22px | card title |
| `--text-h6` | 20px | sub-section / calendar header |
| `--text-lg` | 18px | large body / button text |
| `--text-md` | 16px | default body, button label |
| `--text-sm` | 14px | body small / tab label |
| `--text-caption` | 12px | caption / weekday header |
| `--text-micro` | 10px | badge / amount-in-cell |

**Weights:** `--weight-regular 400`, `--weight-medium 500`, `--weight-semibold 600`, `--weight-bold 700`.
**Tracking:** `--tracking-tight -0.04em` (H1 numbers), `--tracking-snug -0.02em` (most titles + body),
`--tracking-normal 0`, `--tracking-wide .03em` (mono/small caps), `--tracking-wider .08em` (uppercase labels).

## Spacing scale (base-4, matches Figma `--#N-spacer`)
`--space-0` 0 · `--space-0-5` 2 · `--space-1` 4 · `--space-1-5` 6 · `--space-2` 8 · `--space-2-5` 10 ·
`--space-3` 12 · `--space-3-5` 14 · `--space-4` 16 · `--space-5` 20 · `--space-6` 24 · `--space-7` 28 ·
`--space-8` 32 · `--space-10` 40 · `--space-12` 48 · `--space-14` 56 · `--space-16` 64 (px)

## Border radius
| Token | px | Use |
|---|---|---|
| `--radius-xs` | 8 | tiny chip / inline tag |
| `--radius-sm` | 10 | small badge |
| `--radius-md` | 12 | card row, input, calendar cell |
| `--radius-lg` | 18 | card |
| `--radius-xl` | 24 | large card |
| `--radius-2xl` | 28 | modal |
| `--radius-pill` | 30 | filter-dropdown pill |
| `--radius-button` | 40 | primary CTA button |
| `--radius-full` | 999 | fully rounded pill (tabs, FAB) |

## Shadow
| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,.06)` | badge / pin |
| `--shadow-md` | `0 4px 24px rgba(0,0,0,.08)` | card |
| `--shadow-lg` | `0 8px 40px rgba(0,0,0,.10)` | modal (default) |
| `--shadow-xl` | `0 10px 40px rgba(0,0,0,.30)` | floating panel |
| `--shadow-fab` | `0 6px 20px rgba(12,49,36,.28)` | FAB |
| `--shadow-popover` | `0 4px 16px rgba(0,0,0,.08)` | dropdown / context menu |

## Component sizes
`--btn-h 50` · `--btn-compact-h 39` · `--pill-h 44` · `--topbar-h 64` · `--sbar-w 105` / `--sbar-w-exp 256` ·
`--avatar-md 44` · `--icon-btn 44` · `--modal-w 420` · `--dropdown-min-w 140` (px)

## Motion
| Token | Value | Use |
|---|---|---|
| `--ease-spring` | `cubic-bezier(.34,1.56,.64,1)` | number-flow / bouncy enter |
| `--ease-out` | `cubic-bezier(.23,1,.32,1)` | slide-in panel |
| `--ease-standard` | `cubic-bezier(.4,0,.2,1)` | default |
| `--dur-fast` | 150ms | hover, color, small state |
| `--dur-base` | 220ms | modal open, overlay |
| `--dur-slow` | 350ms | opacity / fade |
| `--dur-spin` | 600ms | number-flow digit roll |

## Z-index
`--z-modal-overlay 500` · `--z-toast 1000` · `--z-fab 9000` · `--z-devnotes 9001`

---

# PART 3 — Component & Layout Laws

## Buttons
- **Primary CTA:** accent-green fill, white text, height `--btn-h` (50px), `--radius-full` pill, Medium 16px. Hover → `--accent-hover`.
- **Secondary:** `--surface-2` fill, `--text` color, same pill shape, no border.
- **Ghost / tertiary:** transparent, `--border` outline or none, `--text-2`.
- **Compact:** height `--btn-compact-h` (39px).
- One **primary** action per screen (see Screen rules). Label = the exact outcome (“Pay Invoice”, not “Continue”).

## Modal header (canonical — follow unless told otherwise)
- Back button **first child, left-anchored**; close button **last child, right-anchored**; `justify-content:space-between`.
- Icon buttons **44×44** (`--icon-btn`), round (`--radius-full`), `--accent-light` bg, inner SVG 18×18 stroke 2.2 `--text`.
- If step 1 has no back action, render the back slot `visibility:hidden` (don't delete it).
- Modal frame width **420px** (`--modal-w`), radius `--radius-2xl` (28px). Title 20px / Medium, lives in the body, not centered in the bar.

## Dropdown / context menu
- Min-width `--dropdown-min-w` (140px), `--bg-white` bg, 1.5px `--border`, `--radius-md`, `--shadow-popover`, 4px padding.
- Items: 10×14 padding, 14px Medium, `--radius-xs`, hover bg `--accent-light` (destructive items keep red text, same hover).

## Status badges / pills
Use the status token triplets above (fill + soft bg + text). Keep status language explicit (Processing, Failed, Awaiting, Expired…) — never rely on color alone.

## Toast — transient confirmation
Bottom-center, auto-dismissing message for "it worked" feedback (not for errors that need action).

```css
.toast{ display:inline-flex; align-items:center; gap:10px;
        background:var(--surface); border:1px solid var(--border);
        border-radius:var(--radius-2xl); padding:12px 18px;
        font:500 15px var(--font-sans); color:var(--text); letter-spacing:var(--tracking-snug);
        box-shadow:var(--shadow-lg); white-space:nowrap; max-width:92vw; }
/* positioning + show/hide */
.toast-live{ position:fixed; left:50%; bottom:28px; z-index:var(--z-toast);
             transform:translateX(-50%) translateY(12px); opacity:0; pointer-events:none;
             transition:opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out); }
.toast-live.show{ opacity:1; transform:translateX(-50%) translateY(0); }
```

| Property | Value |
|---|---|
| Background | `--surface` (`#FAFBFA`), 1px `--border` |
| Radius | `--radius-2xl` (28px) |
| Padding | 12px 18px |
| Text | 15px Medium, `--text`, `--tracking-snug`; leading success icon `assets/check.svg` (18×18), 10px gap |
| Elevation | `--shadow-lg` |
| Position | `fixed`, bottom-center, 28px from bottom, `--z-toast` (1000) |
| Motion | slide up 12px + fade over `--dur-base` (220ms) `--ease-out`; auto-dismiss ~2.5s |

Rules: **one toast at a time**; keep copy to a short outcome (“Saved”, “Wallet address saved”);
use `assets/check.svg` (green check, 18×18) as the success icon. For anything the user must act on, use an inline error or a modal — not a toast.

## Named responsive laws (modals)

### W002A — primary modal → fullscreen, keep Back
Single breakpoint at **633px**. ≥634px: top-centered 420px modal, radius 24, title-only banner
(no back/close), sticky CTA footer. ≤633px: **fullscreen** (100%×100%, radius 0); the **Back button is
shown** (only nav kept), close stays hidden, title centered via an invisible close-spacer; CTA pinned
to the screen bottom. Floating demo FABs hide ≤633px.

### W003A — secondary modal → bottom floating sheet, no buttons
Single breakpoint at **633px**. Title-only banner (no back/close) at all sizes. ≥634px: top-centered
420px modal. ≤633px: **bottom floating sheet** — `max-width 420px`, side margin **≥8px**, **16px from the
bottom (always)**, **all four corners 24px**, **height ≤ `min(520px,92vh)`** (content scrolls inside).
Dismiss via overlay tap. Applies to “Pay with…”, “Pay in”, and the “Payment provider” step.

> Both laws use **one** breakpoint (633px) and drop the canonical header for a centered title — a
> deliberate, documented exception for these specific modals.

---

# How to use this file
1. **Start from Part 1.** Frame every screen by its user goal, business goal, and single primary action; justify with usability, not aesthetics.
2. **Build with Part 2 tokens.** Link `tokens.css`; never hard-code a value that has a token.
3. **Reuse Part 3 components/laws** before inventing new patterns (recognition > recall).
4. **Check against the philosophy** before shipping: Can anything be removed? Is the primary action obvious? Is money/status explicit? Does every element earn its place?
