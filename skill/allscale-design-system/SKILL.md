---
name: allscale-design-system
description: AllScale brand design system for web UI and dashboards. ALWAYS use this skill when creating, modifying, or reviewing any UI design, component, dashboard, screen, or front-end artifact for AllScale. Triggers on any mention of building screens, pages, components, UI, dashboards, forms, modals, or layouts — even if the user doesn't explicitly say "use the design system." If AllScale designs are involved in any way, consult this skill first.
---

# AllScale Design System

This skill defines the visual language for all AllScale UI. Follow it precisely. Do not invent new patterns — extend existing ones.

When images are uploaded alongside a design request, they are reference screenshots from the AllScale product. Study them carefully for layout, spacing, and component behaviour before building.

Reference screenshots are stored in `references/screenshots/`. Load them into context when you need to verify a specific pattern.

---

## Brand Identity

**Product**: AllScale — crypto payroll / fintech dashboard  
**Tone**: Clean, trustworthy, modern fintech. Not flashy. Not corporate. Functional with personality.  
**Logo**: "All" wordmark with a green bracket icon. The bracket uses two right-angle shapes forming a partial square — top-left corner open, bottom-right corner open.

---

## Design Philosophy (STRICTLY ENFORCED)

When producing any AllScale design, act as a world-class Senior UI/UX Designer, Product Designer, and Design Strategist — a devoted practitioner of **Michael Polanyi's Tacit Knowledge Theory**:

> *"We know more than we can tell."*

Every screen, component, layout, and interaction MUST be validated against the four principles below before it is considered done. The visual tokens in this skill (color, type, spacing) are tools — these principles are the law.

### 1. Tacit First
Users must understand how to interact through **embodied intuition within seconds** — no tutorials, no instructions, no explanatory text. Every interaction should feel like using a familiar tool: users *feel* what to do before they consciously think about it.

### 2. Subsidiary Awareness → Focal Awareness
The interface fades into the background as subsidiary awareness.
- A great UI is **not** something users look *at*.
- A great UI is something users look *through*.

The user's focus belongs on their goal (paying, sending, checking balance) — never on the chrome.

### 3. Ineffability
**Avoid:** long descriptions, tooltips, tutorial popups, rule explanations, helper text propping up unclear affordances.
**Communicate through:** visual metaphors, motion language, rhythm and timing, spatial relationships, environmental feedback.
The user should understand the system without being explicitly told.

### 4. Personal Commitment
The UI must encourage emotional investment. Users should not feel like they are merely controlling an interface — they should feel like they are *using this app to get what they need*. Every element reinforces **trust, care, user-friendliness**.

### Style requirements
- Human-centered
- Minimal
- Breathable
- Emotionally engaging

### Strictly avoid
- Dense dashboards
- Spreadsheet-like menus
- Excessive text
- Adding a text label when a visual cue would carry the same meaning
- Tooltips / helper text as a crutch for unclear affordances

### The benchmark
After every design, the user should be able to say:

> *"This interface understands me."*

If you cannot honestly imagine the user saying that sentence, the design is not done — redesign.

---

## Color Palette

### Primary Green (brand color — use confidently)
- `--color-primary: #1A9E4A` — main CTA buttons, active nav items, key interactive elements
- `--color-primary-light: #E8F5EE` — subtle backgrounds, ghost button fills, active nav bg, tag backgrounds
- `--color-primary-dark: #157A3A` — hover state on primary buttons
- `--color-primary-text: #1A9E4A` — green text labels (role tags, action links, amounts)

### Neutrals
- `--color-bg: #FFFFFF` — page background (always white, use `#ffffff` explicitly)
- `--color-surface: #F7F8F7` — card/panel backgrounds, light section fills (very slightly warm gray-green tint)
- `--color-border: #E8EAE8` — borders on inputs, cards, dividers
- `--color-text-primary: #0D1F0F` — headings, body, important numbers (near-black with green tint)
- `--color-text-secondary: #6B7A6C` — labels, metadata, timestamps, subtext (muted gray-green)
- `--color-text-disabled: #A8B5A9` — placeholder text

### Accent / Status
- `--color-danger: #E53E3E` — error text, warning notices (red)
- `--color-success-dot: #22C55E` — active status indicator dot
- `--color-badge: #EF4444` — notification badge (red circle with white number)
- `--color-overlay: rgba(0,0,0,0.35)` — modal backdrop

### Dark / Special (used in confirmation modals, hero cards)
- `--color-dark-surface: #0A1A0E` — dark card backgrounds (deep near-black green)
- `--color-dark-accent: #1A9E4A` — glowing green element on dark bg

---

## Typography

**Font family**: System sans-serif stack that reads as clean and geometric. In code, use:  
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
```

### Scale
| Role | Size | Weight | Letter-spacing | Color |
|------|------|--------|----------------|-------|
| Hero number (balance) | 48–56px | 500 | -0.02em | `--color-text-primary` |
| Hero decimal | 24–28px | 500 | -0.02em | `--color-text-secondary` |
| Page title (h1) | 28–32px | 500 | -0.02em | `--color-text-primary` |
| Section heading (h2) | 18–20px | 500 | -0.02em | `--color-text-primary` |
| Body / list item name | 15–16px | 500 | -0.02em (16px only) | `--color-text-primary` |
| Label / metadata | 13–14px | 500 | none | `--color-text-secondary` |
| Role tag / badge text | 12–13px | 500 | none | `--color-primary-text` |
| Button text | 15–16px | 500 | -0.02em (16px only) | white or `--color-primary` |

**Key rule**: All text uses font-weight 500 (medium). Text at 16px or above must have `letter-spacing: -0.02em`. Text below 16px has no letter-spacing override.

**Line-height rule (CRITICAL)**: All text in the AllScale design system uses `line-height: 1` (100%). The body default `line-height: 1.5` must be explicitly overridden on every text element. Without this override, inherited line-height inflates the space between adjacent text lines (e.g., a title + subtitle pair at 18px + 12px will have ~15px visual gap instead of the intended ~6px). Always set `line-height: 1` on headings, titles, subtitles, labels, captions, and any stacked text pairs. Only body-copy paragraphs intended for multi-line reading may use `line-height: 1.4–1.5`.

**Financial number rule**: Large financial numbers (balances, amounts) render the whole dollars significantly larger and the cents smaller — creating visual hierarchy through size contrast, not weight.

---

## Spacing & Layout

### Web (3-column layout)
```
[ Sidebar 260px ] [ Main content flex-1 ] [ Right panel 300px ]
```
- Sidebar: fixed, white bg, nav items vertically stacked with generous padding
- Main: scrollable, padded ~32px horizontal, content max-width 530px (centered within the flex-1 column)
- Right panel: fixed, white bg, update/notification feed

### Mobile
- Single column, full-width
- Horizontal padding: 20–24px
- Top nav: logo left, icons right (bell, avatar)
- Bottom CTA button: full-width pill, pinned or near-bottom

### Grid internals
- Card/section padding: 20–24px
- Between sections: 24–32px gap
- List item height: ~64–72px with horizontal padding
- Border radius on cards/sections: 16px
- Border radius on buttons: 999px (full pill)
- Border radius on inputs: 12px
- Border radius on list item avatars: 50% (circle)
- Border radius on small chips/tags: 999px

---

## Component Library

### Buttons

**Primary (filled green pill)**
```css
background: var(--color-primary);
color: white;
border-radius: 999px;
padding: 14px 28px;
font-weight: 500;
font-size: 15px;
```
- Has a small icon on the left (download arrow, plus, etc.)
- Hover: `--color-primary-dark`
- Full-width on mobile

**Secondary (ghost pill)**
```css
background: var(--color-surface);
color: var(--color-text-primary);
border: none;
border-radius: 999px;
padding: 14px 28px;
font-weight: 500;
```
- Used for "Deposit history", "Withdraw", non-primary actions

**Text/link button (green text, no bg)**
```css
color: var(--color-primary);
background: transparent;
font-weight: 500;
```
- Used for "Send email to everyone", "View all", inline actions

**B002 — Icon + Label pill (surface bg)**
```css
display: inline-flex;
align-items: center;
gap: 16px;
background: #FAFBFA;
border: none;
border-radius: 50px;
padding: 12px 18px;
font-size: 16px;
font-weight: 500;
letter-spacing: -0.02em;
color: #0C3124;
cursor: pointer;
font-family: 'Archivo', sans-serif;
```
```html
<button class="btn-b002">
  <img src="assets/icon.svg" width="24" height="24" style="display:block;flex-shrink:0;">
  Label
</button>
```
- Icon strictly `24×24px`, no stroke on button
- Gap between icon and label: `16px`
- Used for secondary action buttons with an SVG icon (e.g. Store Settings)

**Approve/Deny pair**
- Approve: `background: #E8F5EE; color: #1A9E4A; border-radius: 999px;`
- Deny: `background: #F2F4F2; color: #0D1F0F; border-radius: 999px;`
- Both same size, side by side

### Navigation (Sidebar)

```css
/* Nav item */
padding: 12px 16px;
border-radius: 12px;
font-size: 15px;
font-weight: 500;
color: var(--color-text-secondary);
cursor: pointer;

/* Active nav item */
background: var(--color-primary-light);
color: var(--color-primary);
font-weight: 500;
```
- No left border accent — the background fill IS the active indicator
- Icons optional but consistent (line icons, 20px, same color as text)

### List Items (team members, transactions)

```css
display: flex;
align-items: center;
padding: 14px 0;
border-bottom: 1px solid var(--color-border);
gap: 12px;
```

**Avatar**: 40px circle, gray bg (`#E8EAE8`), uppercase initial letter, 15px semi-bold  
**Name**: 15px 500 weight, primary color  
**Role tag**: below name, 12px, green text (`--color-primary-text`), no background  
**Status dot**: 8px circle, `--color-success-dot`  
**Amount/date**: right-aligned, amount in 500 weight, date in small secondary color

### Inputs / Search

**MANDATORY input field spec — apply to every text input in every screen:**

| State | Background | Border | Text / Placeholder |
|-------|-----------|--------|-------------------|
| Default | `#FAFBFA` | `#E5EEEA` | placeholder `#83968F` 16px |
| Hover | `#F2F8F5` | `#E5EEEA` | placeholder `#83968F` 16px |
| Focus (active) | `#F2F8F5` | `#009859` | placeholder hidden, cursor blinking; typed text `#0C3124` 16px + clear icon (right) |
| Filled / blurred | `#FAFBFA` | `#E5EEEA` | `#0C3124` 16px |

```css
.input {
  background: #FAFBFA;
  border: 1.5px solid #E5EEEA;
  border-radius: 12px;        /* ALWAYS 12px */
  font-size: 16px;
  color: #0C3124;
  font-family: 'Archivo', sans-serif;
}
.input::placeholder { color: #83968F; }
.input:hover { background: #F2F8F5; }
.input:focus { background: #F2F8F5; border-color: #009859; }
```

**Clear button**: When focused and has text, show `empty.svg` icon (15×15px) absolutely positioned at right edge inside the input. Clicking it clears the field. Implemented via `.input-wrap` wrapper + JS.

```html
<!-- Always wrap text inputs: -->
<div class="input-wrap">
  <input class="input" type="text" placeholder="...">
  <!-- clear button injected by JS via initInputClear() -->
</div>
```

- `border-radius` is always `12px` — never override
- `font-size` is always `16px` — never override
- Multi-line (textarea): same colors, `padding: 12px 14px`, `height: auto`

### Cards / Panels

```css
background: var(--color-surface); /* or white */
border-radius: 16px;
padding: 20px 24px;
```
- No box-shadow on internal panels — rely on bg color difference
- Subtle shadow only on modals: `0 8px 40px rgba(0,0,0,0.12)`

### Modals

```css
/* Overlay — ALL modals MUST use this */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.25);
  display: flex; align-items: flex-start; justify-content: center;
  padding-top: 50px;   /* always 50px from top — never center vertically */
}

/* Modal panel */
background: white;
border-radius: 24px;
max-width: 640px; /* web */ | full-width bottom sheet /* mobile */
```
- **All modals are 50px from the top of the screen** — never vertically centered
- No box-shadow on modal panels
- Backdrop: `rgba(0,0,0,0.25)`
- Two-column layout for edit forms (left: member list nav, right: form fields)
- `...` kebab menu in top-right corner of records
- CTA button at bottom, full-width pill

**Modal close / back button** (applies to ALL modals — MUST follow):
```css
.modal-close, .stores-modal-close, .stores-modal-back {
  width: 40px; height: 40px;
  border-radius: 50%;        /* always circle */
  background: #F2F8F5;
  border: none;
  color: #0C3124;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
  flex-shrink: 0;
}
.modal-close:hover:not(:disabled),
.stores-modal-close:hover,
.stores-modal-back:hover { background: #E5EEEA; }
.modal-close:disabled { opacity: 0.3; cursor: not-allowed; }
```

**Icon inside close button** — always inline SVG, never text `×`:
```html
<!-- Close button -->
<button class="modal-close" onclick="closeModal('...')">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
</button>

<!-- Back button -->
<button class="stores-modal-back" onclick="...">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
</button>
```
- Close icon: `20×20` SVG X (two crossing lines)
- Back icon: `20×20` SVG chevron-left
- 40×40px circle, bg `#F2F8F5`, hover `#E5EEEA`, stroke color `#0C3124`
- **Never** use text `×` or different size/shape

**Modal title typography** (applies to ALL modals — MUST follow):
```css
.modal-title {
  font-size: 20px;
  font-weight: 500;
  color: #0C3124;
  letter-spacing: -0.02em;
}
```
- Modal title is always `20px / 500 weight` — never override. (Superseded the prior 28px on 2026-06-10; every modal/overlay/sheet title — picker, method, currency, confirm, etc. — uses 20px/500.)

**Dark confirmation modal** (used for high-stakes confirmations like wallet address):
```css
background: #0A1A0E;
color: white;
border-radius: 24px;
```
- Green glowing illustration/graphic in center
- Primary CTA: full-width green pill
- Secondary action: plain text link below ("Let me double check")

### Tags / Chips

**Test store badge** — used on all sandbox/test store labels everywhere (MUST follow):
```css
.badge-sandbox-style, .badge-sandbox-inline {
  background: #FCF5DB;
  color: var(--orange);   /* amber/orange */
  border: none;           /* no stroke */
  font-size: 14px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  letter-spacing: 0;
  text-transform: none;
  display: inline-flex; align-items: center; gap: 5px;
}
```
```html
<!-- Always include test-store.svg icon on the left -->
<span class="badge badge-sandbox-style">
  <img src="assets/test-store.svg" width="15" height="15" style="display:block;">
  Test store
</span>
```
- Text is always `Test store` (exact casing) — never `SANDBOX`, `Sandbox`, or `TEST STORE`
- Icon: `test-store.svg` 15×15px, left of text
- No border/stroke

```css
/* Role tag (Full-time, Part-time) */
color: var(--color-primary);
font-size: 12px;
font-weight: 500;
/* No background, no border — just colored text */

/* Step badge (Step 1, Step 2) */
border: 1.5px solid var(--color-primary);
border-radius: 999px;
padding: 4px 14px;
color: var(--color-primary);
font-size: 13px;
font-weight: 500;
background: transparent;

/* Numbered circle (1, 2, 3 in import flow) */
background: var(--color-primary-light);
color: var(--color-primary);
border-radius: 50%;
width: 28px; height: 28px;
font-weight: 500;
```

### Toast

Short feedback message that appears fixed at the bottom of the screen and auto-dismisses after 3.5 seconds. Multiple toasts stack vertically with an 8px gap.

```css
#toast-container {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}

.toast {
  background: #FAFBFA;
  border: 1px solid #E5EEEA;
  border-radius: 28px;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #0C3124;
  letter-spacing: -0.02em;
  box-shadow: 0 8px 40px rgba(0,0,0,0.10);
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: auto;
  animation: toastIn 0.25s ease;
  white-space: nowrap;
}

@keyframes toastIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

```html
<!-- Always include this container once in the page -->
<div id="toast-container"></div>
```

```js
const _toastTimers = new Map();
function toast(msg, type = 'info') {
  const key = `${type}:${msg}`;
  if (_toastTimers.has(key)) return; // deduplicate
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<img src="assets/check.svg" width="24" height="24" style="display:block;flex-shrink:0;">${msg}`;
  container.appendChild(el);
  const timer = setTimeout(() => { el.remove(); _toastTimers.delete(key); }, 3500);
  _toastTimers.set(key, timer);
}
```

- **Background**: `#FAFBFA` — always light surface, never dark
- **Border**: `1px solid #E5EEEA`
- **Border-radius**: `28px` (full pill feel)
- **Icon**: `check.svg` 24×24px, left of text, `display:block;flex-shrink:0`
- **Font**: 16px / 500 / `#0C3124` / `letter-spacing: -0.02em`
- **Shadow**: `0 8px 40px rgba(0,0,0,0.10)`
- **Animation**: slides up 10px + fades in over 0.25s ease
- **Auto-dismiss**: 3500ms; identical toasts deduplicated (won't stack)
- `pointer-events: none` on container so toasts don't block clicks on page

### Notification Badge
```css
background: #EF4444;
color: white;
border-radius: 50%;
width: 20px; height: 20px;
font-size: 11px;
font-weight: 700;
position: absolute;
top: -4px; right: -4px;
```

### Upload / Drop Zone
```css
border: 2px dashed var(--color-border);
border-radius: 16px;
padding: 32px;
text-align: center;
color: var(--color-text-secondary);
```
- Icon above text (green, line-style)
- "CSV only" subtext in disabled color

### Dot Grid Background (decorative)
Used behind hero illustrations (contact page, import page):
```css
background-image: radial-gradient(circle, #C8D5C9 1px, transparent 1px);
background-size: 18px 18px;
```
- Always light gray-green dots, never heavy
- Used as texture behind floating card/image compositions

---

## Modal Header (CANONICAL — always follow this)

Every modal / sheet / sub-flow step that has a header bar uses this exact layout. **No exceptions.** When you generate or modify any modal-like component, default to this pattern unless the user explicitly says otherwise.

### Layout

```
┌─────────────────────────────────────────────┐
│  ◀                                       ✕  │   ← header
├─────────────────────────────────────────────┤
│                                             │
│  body content                               │
│                                             │
└─────────────────────────────────────────────┘
   ↑                                        ↑
   back-button                              close-button
   left-anchored                            right-anchored
```

- **Back button** is the FIRST child of the header — always anchored to the LEFT
- **Close button** is the LAST child of the header — always anchored to the RIGHT
- The header uses `display: flex; justify-content: space-between` to keep them at the edges
- If a step has no back action (first step), render the back slot with `visibility: hidden` so the close stays on the right. Do NOT delete the back element — that would shift the close to the left

### Icon buttons (back / close)

- **Size**: `44×44` (token: `var(--icon-btn)`)
- **Shape**: fully round (`border-radius: var(--radius-full)` = 999px)
- **Background**: `var(--accent-light)` = `#F2F8F5`
- **Hover background**: `var(--surface-3)` = `#E5EEEA`
- **Inner SVG**: 18×18, `stroke-width: 2.2`, color `var(--text)`
- **Border**: none. **Cursor**: pointer. **Transition**: `background var(--dur-fast) var(--ease-standard)`

### Header container

- **Padding**: `16px 18px 4px` (top right bottom left; bottom is tight because the body takes over)
- **Display**: `flex`, `align-items: center`, `justify-content: space-between`, `gap: 10px`

### Modal frame

- **Width**: `420px` (token: `var(--modal-w)`) — fixed across every step of a sub-flow. No width-jitter between screens.
- **Max-width**: `calc(100vw - 32px)` for small screens
- **Border-radius**: `var(--radius-modal)` = 28px
- **Background**: `var(--bg)` = `#FDFFFE`
- **Shadow**: `var(--shadow-md)` or `var(--shadow-lg)` depending on z-stack

### Code template

```html
<div class="modal-frame">
  <div class="modal-header">
    <button class="modal-icon-btn" aria-label="Back">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <button class="modal-icon-btn" aria-label="Close">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
  <!-- body -->
</div>

<style>
.modal-frame      { width: var(--modal-w); border-radius: var(--radius-modal);
                    background: var(--bg); box-shadow: var(--shadow-md); }
.modal-header     { display: flex; justify-content: space-between; align-items: center;
                    gap: 10px; padding: 16px 18px 4px; }
.modal-icon-btn   { width: var(--icon-btn); height: var(--icon-btn);
                    border-radius: var(--radius-full);
                    background: var(--accent-light); color: var(--text);
                    border: none; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: background var(--dur-fast) var(--ease-standard); }
.modal-icon-btn:hover { background: var(--surface-3); }
</style>
```

### Common mistakes — DO NOT do these

- ❌ Centering a title inside the header bar. (Title belongs inside the body, with breathing room.)
- ❌ Making the buttons 30/32/34/36/40px. They are **44**.
- ❌ Using `gap: 1` flex between back and close (pushes close to the middle). Use `space-between`.
- ❌ Different modal widths between sub-steps (creates width-jitter). Lock to 420px.
- ❌ Skipping the back-slot on step 1 (close shifts left). Always render it with `visibility:hidden`.
- ❌ Solid #000 close icon. Use `var(--text)` for color consistency.

---

## Modal Responsive Laws (NAMED — `W0xxA`)

Named responsive recipes for specific modal archetypes. Each law fixes the modal's
**single** breakpoint and the two states around it. When a modal is tagged with one of
these codes, follow the law exactly — it **intentionally overrides** the canonical header
(title centered, back/close removed) for that modal.

Shared rules for every `W0xxA` law:
- **Exactly ONE breakpoint, at `633px`.** No `768px` bottom-sheet fallback — explicitly
  exclude the modal from any shared `@media(max-width:768px)` rule (e.g.
  `.shared-sheet:not(#this-modal)`).
- Desktop state = `≥ 634px`; compact state = `≤ 633px`.
- Banner is **title-only and centered** (the canonical back-left/close-right header does
  NOT apply to these modals).
- Reference implementation: `checkout/checkout-onramp.html`.

### W002A — primary modal → fullscreen (keep Back)

For the main flow modal (e.g. *Card & Local Payments*: offer picker / waiting / success).

| | `≥ 634px` Desktop | `≤ 633px` Compact |
|---|---|---|
| Position | top-centered (`align-items:flex-start; padding:50px 20px`) | **fullscreen** (`padding:0; align-items:stretch`) |
| Frame | `width:420px; max-height:90vh; border-radius:24px` | `width:100%; height:100%; max-height:100%; border-radius:0` |
| Banner | title only — **no back, no close** | **Back button shown** (top-left, the only nav kept); close stays hidden; an invisible close-spacer (`visibility:hidden`) keeps the title centered |

- **CTA pinned to the screen bottom.** The primary action group (Confirm / Cancel) sits at the
  bottom of the viewport in the fullscreen state — not floating after the content. Achieve it by
  letting the active panel fill the body (`flex:1`) and pushing the footer down with
  `margin-top:auto`; that auto-margin absorbs free space (CTA at the very bottom when content is
  short) and collapses to `0` when content overflows, so `position:sticky; bottom:0` still pins it
  while the list scrolls. On desktop the modal is content-height, so the footer simply sits at its
  bottom (sticky, tight gap to the fineprint above).
- Compact state also hides any floating demo/dev FABs (`.onr-dev, .onr-nav, .onr-ip`) below 633px.

```css
#main-modal #back-btn{display:none;}
#main-modal .modal-hd .close-btn{display:none;}
#main-modal .cta-footer{position:sticky;bottom:0;background:var(--bg);} /* pin on scroll */
@media(max-width:633px){
  #main-modal{padding:0;align-items:stretch;}
  #main-modal .modal{width:100%;max-width:100%;height:100%;max-height:100%;border-radius:0;}
  #main-modal #back-btn{display:flex;}                              /* keep Back */
  #main-modal .modal-hd .close-btn{display:flex;visibility:hidden;} /* spacer → centered title */
  /* CTA glued to the screen bottom in fullscreen */
  #main-modal .modal-body{display:flex;flex-direction:column;}
  #main-modal .active-panel{flex:1 1 auto;}
  #main-modal .cta-footer{margin-top:auto;}
}
```

### W003A — secondary modal → bottom floating sheet (no buttons)

For any sub/secondary sheet in the flow. Applied to *Pay with {provider}* (method sheet),
*Pay in* (currency picker), and *Payment provider* (the redirect/handoff step). Tag each such
sheet with a shared class (e.g. `.onr-w003a`) so the law is declared once and reused.

| | `≥ 634px` Desktop | `≤ 633px` Compact |
|---|---|---|
| Position | top-centered (`align-items:flex-start; padding:50px 20px`) | **bottom floating sheet** (`align-items:flex-end; padding:0 8px 16px`) |
| Frame | `width:420px; border-radius:24px` | `width:100%; max-width:420px; border-radius:24px; max-height:min(520px,92vh)` |
| Banner | title only — **no back, no close** | same |

Compact geometry (the floating-sheet guarantees):
- **max-width `420px`** — never wider.
- **side margin ≥ `8px`** — `max(8px, (100vw − 420)/2)`; below 436px it fills minus 8px each side.
- **`16px` from the screen bottom — always.**
- **height never exceeds `520px`** — `max-height:min(520px,92vh)`; taller content scrolls inside.
- **all four corners equal (`24px`)** — it floats (not flush), so bottom radius = top radius.
- Dismiss via overlay tap (no buttons).

```css
#sub-sheet .modal-hd .icon-btn{display:none;}                 /* no back/close */
@media(max-width:633px){
  #sub-sheet{align-items:flex-end;padding:0 8px 16px;}        /* bottom, 8px sides, 16px up */
  #sub-sheet .modal{width:100%;max-width:420px;border-radius:24px;max-height:min(520px,92vh);} /* ≤520px */
}
```

**When the “sheet” is actually a panel inside a W002A modal** (e.g. *Payment provider* is a
step of the main flow, not a standalone overlay): toggle a state class (e.g. `.onr-as-sheet`)
on the W002A overlay while that step is active, and override its fullscreen geometry with
ID-qualified selectors so it wins over the W002A rules. Remove the class when leaving the step
so the modal returns to fullscreen.

```css
@media(max-width:633px){
  #main-modal.as-sheet{padding:0 8px 16px;align-items:flex-end;}
  #main-modal.as-sheet .modal{width:100%;max-width:420px;height:auto;max-height:92vh;border-radius:24px;}
  #main-modal.as-sheet #back-btn, #main-modal.as-sheet .close-btn{display:none;}
}
```

**W002A vs W003A:** both use the single 633px breakpoint and drop the header buttons.
W002A goes **fullscreen** below 633 and **keeps the Back button**; W003A becomes a
**bottom floating sheet** (max 420 · 8px sides · 16px bottom · all corners rounded) with
**no buttons**.

---

## Dropdown Menu (CANONICAL — always follow this)

Every dropdown / context menu / ⋯-button popover / filter popover uses this exact pattern. **No exceptions.** When you generate or modify any dropdown-like component, default to this pattern unless the user explicitly says otherwise.

Source of truth: `checkout/payment-link.html` → Recent Orders → `#dash-more-menu`.

### Container

- **Min-width**: `140px` (token: `var(--dropdown-min-w)`)
- **Background**: `var(--bg-white)` = `#FFFFFF` (NOT `--bg`)
- **Border**: `1.5px solid var(--border)`
- **Border-radius**: `var(--radius-md)` = 12px
- **Box-shadow**: `var(--shadow-popover)` = `0 4px 16px rgba(0,0,0,0.08)`
- **Padding**: `4px` (creates breathing room around items so item hover bg never touches the menu edge)
- **NO `overflow: hidden`** — items round their own corners

### Items

- **Padding**: `10px 14px`
- **Font**: `var(--font-sans)`, size `var(--text-sm)` = 14px, weight `var(--weight-medium)` = 500
- **Color**: `var(--text)` for default, `var(--red)` for destructive
- **Border-radius**: `var(--radius-xs)` = 8px (so hover bg has its own rounded edge inside the menu)
- **Text-align**: `left`
- **Transition**: `background var(--dur-fast) var(--ease-standard)`
- **Hover background**: `var(--accent-light)` for ALL items — including destructive ones. The destructive item keeps its red text but uses the same accent-light hover, so the interaction language stays uniform.

### Position

- `position: absolute` from the trigger button
- `top: calc(100% + 6px)` (6px vertical gap below trigger)
- Anchored to the trigger's side — usually `right: 0` for ⋯ buttons on the right edge of a row
- `z-index` high enough to float above siblings (100+ is typical)

### Code template

```html
<div class="dd-menu">
  <div class="dd-item">Rename</div>
  <div class="dd-item">Duplicate</div>
  <div class="dd-item danger">Delete</div>
</div>

<style>
.dd-menu {
  position: absolute; top: calc(100% + 6px); right: 0;
  min-width: var(--dropdown-min-w);
  background: var(--bg-white);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-popover);
  padding: 4px;
  z-index: 100;
}
.dd-item {
  padding: 10px 14px;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--text);
  text-align: left;
  border-radius: var(--radius-xs);
  cursor: pointer;
  transition: background var(--dur-fast) var(--ease-standard);
}
.dd-item:hover { background: var(--accent-light); }
.dd-item.danger { color: var(--red); }
.dd-item.danger:hover { background: var(--accent-light); }
</style>
```

### Common mistakes — DO NOT do these

- ❌ Making the menu narrower than 140px or wider than 280px without reason. 140px is the canonical floor.
- ❌ Items with no `border-radius` — the hover bg would touch the menu's inner edge and look harsh.
- ❌ Using a red-tinted hover (`--red-soft`) on the destructive item. Hover language stays uniform; red lives only in the text color.
- ❌ Adding `overflow: hidden` on the menu. Items already round their own corners; clipping just hides the breathing-room padding.
- ❌ Skipping the 4px container padding. Without it, items butt against the menu border.
- ❌ Using `--shadow-md` or `--shadow-lg` for elevation. Use `--shadow-popover` (a tighter, less dramatic shadow tuned for floating context menus).
- ❌ Heavy 1px solid border. Use **1.5px** — it's the AllScale standard for popover surfaces.

---

## Illustration / Imagery Style

- **Hero cards**: Gradient green backgrounds (light-to-medium green, radial or wave shapes), white icon centered
- **Confirmation graphics**: Dark background (#0A1A0E), glowing green wallet/icon, circular glow rings
- **Import/onboarding**: Real photos of diverse people in rounded-square cards, stacked/overlapping layout on dot-grid bg
- **Contact page**: Surreal collage — classical sculpture + modern object (AirPods). Unexpected, editorial feel.
- **Never use**: Generic stock illustrations, flat cartoon icons, purple gradients, generic SaaS hero art

---

## Icon Style

- Line icons (not filled), stroke weight ~1.5px
- **MUST use `width="24" height="24"` (24×24px) for all SVG icons** — inline `style="display:block;"` to prevent baseline gap
- Color matches context: white on green buttons, `--color-primary` on ghost elements, `--color-text-secondary` for nav
- Common icons: download-arrow (⬇ inside circle), clock (deposit history), plus (+), search (○ with tail), user/people, settings gear, transfer arrows, bell, filter, store-icon-01 (live store), test-box (test store)

---

## Do / Don't

| ✅ Do | ❌ Don't |
|-------|---------|
| White page background always | Gray or dark page backgrounds |
| Full pill buttons (border-radius: 999px) | Square or slightly-rounded buttons |
| Green as the only accent color | Multiple accent colors |
| Heavy weight for key numbers, light for cents | Uniform weight across financial figures |
| `--color-surface` (#F7F8F7) for card/section bg | Pure white cards on white background (no contrast) |
| Active nav = green text + green-tinted bg | Active nav = left border or underline |
| Dark modal only for high-stakes confirms | Dark surfaces anywhere else |
| Dot-grid as decorative background texture | Dot-grid as structural layout element |
| Real photography for people | Avatars / illustrations for people |
| Approve/Deny as paired pill buttons | Approve/Deny as icon-only or text links |

---

## Order Row Layout (Dashboard / Orders list)

```html
<div class="order-row">
  <div class="order-icon" style="background:#F2F8F5;border-color:#e5eeea;border-radius:50%;">
    <img src="assets/store-icon.svg" width="44" height="44" style="display:block;">
  </div>
  <div class="order-info">
    <div class="order-addr">0x3f2...a91c</div>
    <div class="order-date">Apr 1, 2026 | 09:14</div>
  </div>
  <div class="order-amount-col">
    <div class="order-amount {status}">320.00 USDT</div>
    <div class="order-status-row"><!-- svg or hidden --></div>
  </div>
</div>
```

### Order amount color by status
| Status | Class on `.order-amount` | Color |
|--------|--------------------------|-------|
| Completed | `completed` | `#009859` |
| Processing | `processing` (no extra class) | `#0C3124` |
| Failed | `failed` | `#83968F` |
| Canceled | `canceled` | `#83968F` |
| Timeout | `timeout` | `#83968F` |

```css
.order-amount { font-size: 16px; font-weight: 400; color: #0C3124; }
.order-amount.completed { color: #009859; }
.order-amount.failed, .order-amount.canceled, .order-amount.timeout { color: #83968F; }
```

### Order status icon
- Use SVG image files at `height: 23px` inside `.order-status-row`
- Files: `processing.svg`, `failed.svg`, `canceled.svg`, `timeout.svg`
- **Completed**: hide `.order-status-row` entirely with `class="order-status-row hidden"` (CSS: `display:none`)
- Icon (`.order-icon`): `store-icon.svg`, 44×44px, circle (`border-radius:50%`), bg `#F2F8F5`, border `#e5eeea`

### Date format
`MMM D, YYYY | HH:MM` — e.g. `Apr 1, 2026 | 09:14`

### Typography
- `.order-addr`: 16px, weight 500, `var(--text)`
- `.order-date`: 12px, `var(--text3)`

---

## When Uploading Reference Images

If the user uploads a screenshot from AllScale alongside a request:
1. Identify which screen/flow it represents (dashboard, payroll, people, wallet, modal, mobile)
2. Extract any new patterns not already in this skill
3. Apply those patterns in the output
4. Do not override this skill with contradictory patterns from external design systems (Material, Ant, Shadcn defaults, etc.)

---

## Reference Screenshots Index

Located in `references/screenshots/`:
- `01-dashboard-web.png` — 3-col web dashboard, balance hero, team list, updates panel
- `02-people-web.png` — People page, member count, pending invitations list
- `03-import-modal-web.png` — Preview/Edit modal, two-column, form fields
- `04-wallet-web.png` — Wallet page, activity list, "Welcome" promotional card
- `05-payroll-mobile.png` — Mobile dashboard with tab nav
- `06-deposit-mobile.png` — Mobile step-by-step flow, wire transfer
- `07-contact-mobile.png` — Mobile contact page, dot-grid + sculpture collage
- `08-import-mobile.png` — Mobile import flow, numbered steps, drop zone
- `09-confirm-modal-mobile.png` — Dark confirmation modal, wallet address confirm
