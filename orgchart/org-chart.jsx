// AllScale Org Chart — interactive prototype
// Single-file React app. Data is in localStorage so edits persist across reloads.

const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ---------- Initial data ----------------------------------------------------

const SEED = {
  board: {
    id: "board",
    title: "Board of directors",
    members: [
      { id: "m-shawn-b", name: "Shunxin (Shawn) Pang", role: "Director" },
      { id: "m-leo-b",   name: "Ruoyang (Leo) Wang",   role: "Director" },
      { id: "m-alisha-b",name: "Jun (Alisha) Li",      role: "Director" },
    ],
  },
  csuite: [
    { id: "ceo",  title: "CEO",                                   name: "Shunxin (Shawn) Pang" },
    { id: "coo",  title: "COO",                                   name: "Ruoyang (Leo) Wang"  },
    { id: "fm",   title: "Fundraising Master",                    name: "Jun (Alisha) Li"     },
    { id: "cto",  title: "CTO",                                   name: "Jianfei (Tom) Chen"  },
    { id: "gc",   title: "General Counsel / Product Owner",       name: "Khalil Lin"          },
  ],
  branches: [
    {
      id: "br-coo",
      label: "Operations & market",
      reportsTo: "coo",
      departments: [
        {
          id: "dep-marketing",
          name: "Marketing & Sales",
          leads: [
            { id: "m-alex",  name: "Alex Chen",  role: "Marketing Lead" },
            { id: "m-min",   name: "Min Shu",    role: "Ecosystem Lead" },
            { id: "m-job-1", name: "Job opening", role: "Marketing Ambassador & BD", vacant: true },
          ],
          members: [
            { id: "m-george",  name: "George Lin",   role: "Community Manager" },
            { id: "m-evelyn",  name: "Evelyn Cheng", role: "Sales & Account Manager" },
            { id: "m-howe",    name: "Howe Wei",     role: "BD Manager — Shenzhen & Hong Kong" },
          ],
        },
        {
          id: "dep-ophr",
          name: "Operation & HR",
          leads: [],
          members: [],
        },
      ],
    },
    {
      id: "br-ceo",
      label: "Core business",
      reportsTo: "ceo",
      departments: [
        {
          id: "dep-bd",
          name: "Business Development",
          note: "Coordinates with Marketing",
          leads: [
            { id: "m-bd-na",   name: "Shawn — NA",     role: "BD lead, North America" },
            { id: "m-bd-apac", name: "Alisha — APAC",  role: "BD lead, Asia-Pacific" },
          ],
          members: [],
        },
        {
          id: "dep-design",
          name: "Design",
          leads: [],
          members: [
            { id: "m-jony", name: "Jony Ren", role: "UI/UX Designer" },
          ],
        },
      ],
    },
    {
      id: "br-fm",
      label: "Fundraising",
      reportsTo: "fm",
      departments: [
        {
          id: "dep-fundraising",
          name: "Fundraising",
          leads: [],
          members: [
            { id: "m-steven", name: "Steven Cen",   role: "BD Manager — Shanghai" },
            { id: "m-thomas", name: "Thomas Zheng", role: "FA" },
          ],
        },
      ],
    },
    {
      id: "br-cto",
      label: "Technology",
      reportsTo: "cto",
      departments: [
        {
          id: "dep-product",
          name: "Product",
          leads: [],
          members: [],
        },
        {
          id: "dep-dev",
          name: "Development",
          leads: [
            { id: "m-xi",     name: "Xi Weng",         role: "System Development Engineer" },
            { id: "m-kai",    name: "Kaishuai Wang",   role: "System Development Engineer" },
            { id: "m-yao",    name: "Yao Wang",        role: "Product Manager" },
            { id: "m-reini",  name: "Reini (Yuxin) Zhou", role: "Intern" },
          ],
          members: [
            { id: "m-peiran",  name: "Peiran Xu",          role: "Quality Engineer" },
            { id: "m-wayne",   name: "Wayne Wang",         role: "System Development Engineer" },
            { id: "m-zihao",   name: "Zihao Huang",        role: "Quality Engineer" },
            { id: "m-jiamin",  name: "Jiamin Ning",        role: "System Development Engineer" },
            { id: "m-echo",    name: "Echo (Mengya) Zeng", role: "Quality Engineer" },
          ],
        },
      ],
    },
    {
      id: "br-legal",
      label: "Legal & compliance",
      reportsTo: "gc",
      departments: [
        {
          id: "dep-legal",
          name: "Compliance & Legal",
          leads: [],
          members: [],
        },
      ],
    },
  ],
};

// ---------- Helpers ---------------------------------------------------------

const STORAGE_KEY = "allscale-orgchart-v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return SEED;
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
}
function uid(prefix = "m") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
function initials(name) {
  if (!name) return "—";
  const parts = name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Stable hue per id for the avatar tint — keeps the palette quiet but distinct.
function avatarTint(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  // Bias toward green/teal/sand range to stay in-brand.
  const hues = [150, 162, 138, 100, 40, 28, 200, 180];
  return hues[h % hues.length];
}

// ---------- Drag & drop primitives -----------------------------------------
// We use HTML5 DnD with a thin abstraction.

function useDrag(payload) {
  return {
    draggable: true,
    onDragStart: (e) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("application/json", JSON.stringify(payload));
      // Hint the dragged element style.
      e.currentTarget.classList.add("is-dragging");
    },
    onDragEnd: (e) => e.currentTarget.classList.remove("is-dragging"),
  };
}
function useDrop(accept, onDrop) {
  const [over, setOver] = useState(false);
  return {
    over,
    handlers: {
      onDragOver: (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setOver(true);
      },
      onDragLeave: () => setOver(false),
      onDrop: (e) => {
        e.preventDefault();
        setOver(false);
        try {
          const data = JSON.parse(e.dataTransfer.getData("application/json"));
          if (!accept || accept.includes(data.kind)) onDrop(data, e);
        } catch (err) {}
      },
    },
  };
}

// ---------- Icons (inline, hairline) ---------------------------------------

const Icon = ({ d, size = 16, stroke = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const Icons = {
  search:   <Icon d="M11 19a8 8 0 1 1 5.3-14M21 21l-4.3-4.3" />,
  plus:     <Icon d="M12 5v14M5 12h14" />,
  pencil:   <Icon d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />,
  trash:    <Icon d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />,
  drag:     <Icon d="M9 6h.01M9 12h.01M9 18h.01M15 6h.01M15 12h.01M15 18h.01" stroke={2.2} />,
  chev:     <Icon d="M6 9l6 6 6-6" />,
  close:    <Icon d="M6 6l12 12M18 6L6 18" />,
  reset:    <Icon d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />,
  download: <Icon d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />,
  filter:   <Icon d="M3 5h18M6 12h12M10 19h4" />,
};

// ---------- Avatar ----------------------------------------------------------

function Avatar({ id, name, vacant, size = 36 }) {
  const tint = avatarTint(id);
  const style = vacant
    ? { background: "var(--as-orange-50)", color: "var(--as-orange-500)", borderColor: "var(--as-orange-50)" }
    : {
        background: `oklch(94% 0.04 ${tint})`,
        color: `oklch(34% 0.07 ${tint})`,
        borderColor: `oklch(90% 0.05 ${tint})`,
      };
  return (
    <div className="avatar" style={{ ...style, width: size, height: size }}>
      {vacant ? "+" : initials(name)}
    </div>
  );
}

// ---------- Member card -----------------------------------------------------

function MemberCard({ m, branchId, depId, list, query, onEdit, onDelete }) {
  const drag = useDrag({ kind: "member", id: m.id, branchId, depId, list });
  const match = query && (
    m.name.toLowerCase().includes(query) ||
    (m.role || "").toLowerCase().includes(query)
  );
  const dimmed = query && !match;
  return (
    <div
      className={`mcard ${m.vacant ? "is-vacant" : ""} ${match ? "is-match" : ""} ${dimmed ? "is-dim" : ""}`}
      {...drag}
    >
      <span className="mcard__grip" aria-hidden="true">{Icons.drag}</span>
      <Avatar id={m.id} name={m.name} vacant={m.vacant} />
      <div className="mcard__body">
        <div className="mcard__name">{m.name}</div>
        {m.role ? <div className="mcard__role">{m.role}</div> : null}
      </div>
      <div className="mcard__actions">
        <button className="iconbtn" title="Edit" onClick={() => onEdit(m, branchId, depId, list)}>{Icons.pencil}</button>
        <button className="iconbtn iconbtn--danger" title="Remove" onClick={() => onDelete(m.id, branchId, depId, list)}>{Icons.trash}</button>
      </div>
    </div>
  );
}

// ---------- Member list (a drop zone) --------------------------------------

function MemberList({ items, label, branchId, depId, list, onMoveMember, query, onEdit, onDelete, onAdd, emptyHint }) {
  const drop = useDrop(["member"], (data) => {
    if (data.id) onMoveMember(data, { branchId, depId, list });
  });
  return (
    <div className="mlist-wrap">
      {label ? <div className="mlist-label">{label}</div> : null}
      <div className={`mlist ${drop.over ? "is-over" : ""}`} {...drop.handlers}>
        {items.length === 0 ? (
          <div className="mlist__empty">
            <span>{emptyHint || "Drop members here"}</span>
            <button className="ghostadd" onClick={() => onAdd(branchId, depId, list)}>
              {Icons.plus}<span>Add</span>
            </button>
          </div>
        ) : (
          items.map((m) => (
            <MemberCard
              key={m.id}
              m={m}
              branchId={branchId}
              depId={depId}
              list={list}
              query={query}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
        {items.length > 0 && (
          <button className="rowadd" onClick={() => onAdd(branchId, depId, list)}>
            {Icons.plus}<span>Add member</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- Department card -------------------------------------------------

function DepartmentCard({ branchId, dep, query, ...handlers }) {
  const drag = useDrag({ kind: "dept", id: dep.id, branchId });
  const drop = useDrop(["dept"], (data) => {
    if (data.id !== dep.id) handlers.onMoveDept(data, { branchId, beforeDeptId: dep.id });
  });
  const memberHits = useMemo(() => {
    if (!query) return 0;
    const all = [...(dep.leads || []), ...(dep.members || [])];
    return all.filter(m =>
      m.name.toLowerCase().includes(query) || (m.role || "").toLowerCase().includes(query)
    ).length;
  }, [query, dep]);

  return (
    <article className={`dept ${drop.over ? "is-dept-over" : ""}`} {...drop.handlers}>
      <header className="dept__head">
        <span className="dept__grip" {...drag} title="Drag to reorder">{Icons.drag}</span>
        <h3 className="dept__name">{dep.name}</h3>
        {query && memberHits > 0 ? <span className="dept__hits">{memberHits} match{memberHits === 1 ? "" : "es"}</span> : null}
        <div className="dept__actions">
          <button className="iconbtn" title="Rename" onClick={() => handlers.onRenameDept(branchId, dep.id, dep.name)}>{Icons.pencil}</button>
          <button className="iconbtn iconbtn--danger" title="Delete department" onClick={() => handlers.onDeleteDept(branchId, dep.id)}>{Icons.trash}</button>
        </div>
      </header>
      {dep.note ? <p className="dept__note">{dep.note}</p> : null}

      {(dep.leads && dep.leads.length > 0) || (dep.members && dep.members.length > 0) ? (
        <>
          {dep.leads && (
            <MemberList
              items={dep.leads}
              label={dep.leads.length > 0 ? "Leads" : null}
              branchId={branchId}
              depId={dep.id}
              list="leads"
              onMoveMember={handlers.onMoveMember}
              query={query}
              onEdit={handlers.onEditMember}
              onDelete={handlers.onDeleteMember}
              onAdd={handlers.onAddMember}
              emptyHint={dep.members && dep.members.length === 0 ? "Drag members here, or add a lead" : "Drop a lead here"}
            />
          )}
          {dep.members && dep.members.length > 0 && (
            <MemberList
              items={dep.members}
              label={dep.leads && dep.leads.length > 0 ? "Team" : null}
              branchId={branchId}
              depId={dep.id}
              list="members"
              onMoveMember={handlers.onMoveMember}
              query={query}
              onEdit={handlers.onEditMember}
              onDelete={handlers.onDeleteMember}
              onAdd={handlers.onAddMember}
            />
          )}
          {dep.members && dep.members.length === 0 && dep.leads && dep.leads.length > 0 && (
            <MemberList
              items={[]}
              label="Team"
              branchId={branchId}
              depId={dep.id}
              list="members"
              onMoveMember={handlers.onMoveMember}
              query={query}
              onEdit={handlers.onEditMember}
              onDelete={handlers.onDeleteMember}
              onAdd={handlers.onAddMember}
              emptyHint="Drop team members here"
            />
          )}
        </>
      ) : (
        <MemberList
          items={[]}
          branchId={branchId}
          depId={dep.id}
          list="members"
          onMoveMember={handlers.onMoveMember}
          query={query}
          onEdit={handlers.onEditMember}
          onDelete={handlers.onDeleteMember}
          onAdd={handlers.onAddMember}
          emptyHint="No members yet — drag someone in or add one"
        />
      )}
    </article>
  );
}

// ---------- Branch (vertical column) ---------------------------------------

function Branch({ branch, csuiteById, query, ...handlers }) {
  const drag = useDrag({ kind: "branch", id: branch.id });
  const drop = useDrop(["branch"], (data) => {
    if (data.id !== branch.id) handlers.onMoveBranch(data.id, branch.id);
  });
  const head = csuiteById[branch.reportsTo];
  // Dropzone for moving departments INTO this branch (drop on the branch body).
  const deptIntoBranch = useDrop(["dept"], (data) => {
    handlers.onMoveDept(data, { branchId: branch.id, beforeDeptId: null });
  });

  return (
    <section className={`branch ${drop.over ? "is-branch-over" : ""}`} {...drop.handlers}>
      <header className="branch__head">
        <span className="branch__grip" {...drag} title="Drag to reorder branch">{Icons.drag}</span>
        <div className="branch__title">
          <div className="branch__label">{branch.label}</div>
          {head ? (
            <div className="branch__reports">
              Reports to <strong>{head.title}</strong> · {head.name}
            </div>
          ) : (
            <div className="branch__reports branch__reports--unset">No reporting line set</div>
          )}
        </div>
        <button className="iconbtn" title="Edit branch" onClick={() => handlers.onEditBranch(branch)}>{Icons.pencil}</button>
      </header>

      <div className={`branch__body ${deptIntoBranch.over ? "is-dept-target" : ""}`} {...deptIntoBranch.handlers}>
        {branch.departments.length === 0 ? (
          <div className="branch__empty">No departments yet</div>
        ) : (
          branch.departments.map((dep) => (
            <DepartmentCard
              key={dep.id}
              branchId={branch.id}
              dep={dep}
              query={query}
              {...handlers}
            />
          ))
        )}
        <button className="branch__addDept" onClick={() => handlers.onAddDept(branch.id)}>
          {Icons.plus}<span>Add department</span>
        </button>
      </div>
    </section>
  );
}

// ---------- Top: Board + C-suite -------------------------------------------

function BoardCsuite({ data, query, onEditMember, onDeleteMember, onAddBoard, onEditCsuite }) {
  return (
    <div className="topstack">
      <div className="board">
        <div className="board__head">
          <h2 className="board__title">{data.board.title}</h2>
          <button className="ghostadd" onClick={onAddBoard}>
            {Icons.plus}<span>Add director</span>
          </button>
        </div>
        <div className="board__row">
          {data.board.members.map((m) => {
            const match = query && (m.name.toLowerCase().includes(query) || (m.role || "").toLowerCase().includes(query));
            const dim = query && !match;
            return (
              <div key={m.id} className={`bcard ${match ? "is-match" : ""} ${dim ? "is-dim" : ""}`}>
                <Avatar id={m.id} name={m.name} size={44} />
                <div className="bcard__body">
                  <div className="bcard__name">{m.name}</div>
                  <div className="bcard__role">{m.role || "Director"}</div>
                </div>
                <div className="bcard__actions">
                  <button className="iconbtn" title="Edit" onClick={() => onEditMember(m, "board", null, "members")}>{Icons.pencil}</button>
                  <button className="iconbtn iconbtn--danger" title="Remove" onClick={() => onDeleteMember(m.id, "board", null, "members")}>{Icons.trash}</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="trunk" aria-hidden="true"></div>

      <div className="csuite">
        {data.csuite.map((c) => {
          const match = query && (c.name.toLowerCase().includes(query) || c.title.toLowerCase().includes(query));
          const dim = query && !match;
          return (
            <button
              key={c.id}
              className={`csuite__card ${match ? "is-match" : ""} ${dim ? "is-dim" : ""}`}
              onClick={() => onEditCsuite(c)}
              title="Edit role"
            >
              <Avatar id={c.id} name={c.name} size={44} />
              <div className="csuite__body">
                <div className="csuite__title">{c.title}</div>
                <div className="csuite__name">{c.name || "—"}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Modal -----------------------------------------------------------

function Modal({ title, children, onClose, footer }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="modal-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true">
        <header className="modal__head">
          <h3>{title}</h3>
          <button className="iconbtn" onClick={onClose} aria-label="Close">{Icons.close}</button>
        </header>
        <div className="modal__body">{children}</div>
        {footer ? <footer className="modal__foot">{footer}</footer> : null}
      </div>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {children}
      {hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  );
}

// ---------- App -------------------------------------------------------------

function App() {
  const [data, setData] = useState(loadState);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null); // {kind: 'member'|'csuite'|'branch'|'dept'|'addDept'|'addBoard'|'addMember', payload}
  const [toast, setToast] = useState(null);

  useEffect(() => { saveState(data); }, [data]);

  const csuiteById = useMemo(() => {
    const map = {};
    data.csuite.forEach((c) => { map[c.id] = c; });
    return map;
  }, [data.csuite]);

  const q = query.trim().toLowerCase();

  const stats = useMemo(() => {
    let people = data.board.members.length;
    let depts = 0;
    let vacant = 0;
    data.branches.forEach((b) => {
      depts += b.departments.length;
      b.departments.forEach((d) => {
        people += (d.leads?.length || 0) + (d.members?.length || 0);
        (d.leads || []).forEach(m => { if (m.vacant) vacant++; });
        (d.members || []).forEach(m => { if (m.vacant) vacant++; });
      });
    });
    return { people, depts, vacant, branches: data.branches.length };
  }, [data]);

  // ----- Mutations ---------------------------------------------------------
  const update = (mutator) => setData((prev) => {
    const next = JSON.parse(JSON.stringify(prev));
    mutator(next);
    return next;
  });

  function flash(msg) {
    setToast(msg);
    setTimeout(() => setToast((t) => (t === msg ? null : t)), 2200);
  }

  function findMember(d, branchId, depId, list, id) {
    if (branchId === "board") {
      const arr = d.board.members;
      const idx = arr.findIndex(m => m.id === id);
      return { arr, idx };
    }
    const br = d.branches.find(b => b.id === branchId);
    const dp = br.departments.find(x => x.id === depId);
    const arr = dp[list];
    const idx = arr.findIndex(m => m.id === id);
    return { arr, idx };
  }

  const onMoveMember = (data1, target) => {
    update((d) => {
      const src = findMember(d, data1.branchId, data1.depId, data1.list, data1.id);
      if (src.idx < 0) return;
      const [m] = src.arr.splice(src.idx, 1);
      let dest;
      if (target.branchId === "board") {
        dest = d.board.members;
      } else {
        const br = d.branches.find(b => b.id === target.branchId);
        const dp = br.departments.find(x => x.id === target.depId);
        if (!dp[target.list]) dp[target.list] = [];
        dest = dp[target.list];
      }
      dest.push(m);
    });
    flash("Member moved");
  };

  const onMoveBranch = (srcId, beforeId) => {
    update((d) => {
      const i = d.branches.findIndex(b => b.id === srcId);
      const [b] = d.branches.splice(i, 1);
      const j = d.branches.findIndex(x => x.id === beforeId);
      d.branches.splice(j, 0, b);
    });
  };
  const onMoveDept = (src, target) => {
    update((d) => {
      const srcBr = d.branches.find(b => b.id === src.branchId);
      const i = srcBr.departments.findIndex(x => x.id === src.id);
      const [dep] = srcBr.departments.splice(i, 1);
      const tgtBr = d.branches.find(b => b.id === target.branchId);
      if (target.beforeDeptId == null) {
        tgtBr.departments.push(dep);
      } else {
        const j = tgtBr.departments.findIndex(x => x.id === target.beforeDeptId);
        tgtBr.departments.splice(j, 0, dep);
      }
    });
  };

  const onEditMember = (m, branchId, depId, list) => setModal({ kind: "member", payload: { ...m, branchId, depId, list } });
  const onDeleteMember = (id, branchId, depId, list) => {
    if (!confirm("Remove this member?")) return;
    update((d) => {
      const { arr, idx } = findMember(d, branchId, depId, list, id);
      if (idx >= 0) arr.splice(idx, 1);
    });
  };
  const onAddMember = (branchId, depId, list) => setModal({ kind: "addMember", payload: { branchId, depId, list } });
  const onAddBoard = () => setModal({ kind: "addMember", payload: { branchId: "board", depId: null, list: "members" } });
  const onEditCsuite = (c) => setModal({ kind: "csuite", payload: { ...c } });
  const onEditBranch = (b) => setModal({ kind: "branch", payload: { id: b.id, label: b.label, reportsTo: b.reportsTo } });
  const onAddDept = (branchId) => setModal({ kind: "dept", payload: { branchId, name: "" } });
  const onRenameDept = (branchId, depId, name) => setModal({ kind: "dept", payload: { branchId, depId, name } });
  const onDeleteDept = (branchId, depId) => {
    if (!confirm("Delete department and all its members?")) return;
    update((d) => {
      const br = d.branches.find(b => b.id === branchId);
      br.departments = br.departments.filter(x => x.id !== depId);
    });
  };
  const onAddBranch = () => setModal({ kind: "branch", payload: { id: null, label: "", reportsTo: data.csuite[0]?.id || "" } });
  const onResetAll = () => {
    if (!confirm("Reset everything to the original org chart? This wipes your edits.")) return;
    setData(JSON.parse(JSON.stringify(SEED)));
    flash("Restored");
  };
  const onExportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "org-chart.json"; a.click();
    URL.revokeObjectURL(url);
  };

  // ----- Modal submission --------------------------------------------------
  function submitModal(form) {
    if (!modal) return;
    const m = modal;
    update((d) => {
      if (m.kind === "member") {
        const { branchId, depId, list, id } = m.payload;
        const { arr, idx } = findMember(d, branchId, depId, list, id);
        if (idx >= 0) {
          arr[idx].name = form.name;
          arr[idx].role = form.role;
          arr[idx].vacant = !!form.vacant;
        }
      } else if (m.kind === "addMember") {
        const { branchId, depId, list } = m.payload;
        const newMember = { id: uid("m"), name: form.name, role: form.role, vacant: !!form.vacant };
        if (branchId === "board") {
          d.board.members.push(newMember);
        } else {
          const br = d.branches.find(b => b.id === branchId);
          const dp = br.departments.find(x => x.id === depId);
          if (!dp[list]) dp[list] = [];
          dp[list].push(newMember);
        }
      } else if (m.kind === "csuite") {
        const c = d.csuite.find(x => x.id === m.payload.id);
        if (c) { c.title = form.title; c.name = form.name; }
      } else if (m.kind === "branch") {
        if (m.payload.id) {
          const br = d.branches.find(b => b.id === m.payload.id);
          br.label = form.label; br.reportsTo = form.reportsTo;
        } else {
          d.branches.push({ id: uid("br"), label: form.label, reportsTo: form.reportsTo, departments: [] });
        }
      } else if (m.kind === "dept") {
        const br = d.branches.find(b => b.id === m.payload.branchId);
        if (m.payload.depId) {
          const dp = br.departments.find(x => x.id === m.payload.depId);
          dp.name = form.name;
        } else {
          br.departments.push({ id: uid("dep"), name: form.name, leads: [], members: [] });
        }
      }
    });
    setModal(null);
  }

  // ----- Render ------------------------------------------------------------
  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar__brand">
          <div className="brandmark">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="6" fill="#0C3124"/>
              <path d="M8 16V8h2.5l1.7 5L13.9 8H16v8h-1.5v-5L13 16h-1l-1.5-5v5H8Z" fill="#12D16B"/>
            </svg>
          </div>
          <div className="brand__text">
            <div className="brand__name">AllScale</div>
            <div className="brand__sub">Organization chart</div>
          </div>
        </div>

        <div className="search">
          <span className="search__icon">{Icons.search}</span>
          <input
            type="text"
            placeholder="Search people, roles, teams…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && <button className="search__clear" onClick={() => setQuery("")} aria-label="Clear">{Icons.close}</button>}
        </div>

        <div className="topbar__actions">
          <button className="as-btn-ghost btn-sm" onClick={onAddBranch}>{Icons.plus}<span>New branch</span></button>
          <button className="as-btn-ghost btn-sm" onClick={onExportJson} title="Export JSON">{Icons.download}<span>Export</span></button>
          <button className="as-btn-ghost btn-sm btn-quiet" onClick={onResetAll} title="Reset to defaults">{Icons.reset}</button>
        </div>
      </header>

      <div className="meta-strip">
        <div><span className="meta-num">{stats.people}</span> people</div>
        <div className="dot">·</div>
        <div><span className="meta-num">{stats.branches}</span> branches</div>
        <div className="dot">·</div>
        <div><span className="meta-num">{stats.depts}</span> departments</div>
        {stats.vacant > 0 && <><div className="dot">·</div><div className="meta-vacant"><span className="meta-num">{stats.vacant}</span> open</div></>}
        <div className="meta-spacer"></div>
        <div className="hint as-caption">Drag <span className="grip-inline">{Icons.drag}</span> to reorder · click <span className="grip-inline">{Icons.pencil}</span> to edit</div>
      </div>

      <main className="canvas">
        <BoardCsuite
          data={data}
          query={q}
          onEditMember={onEditMember}
          onDeleteMember={onDeleteMember}
          onAddBoard={onAddBoard}
          onEditCsuite={onEditCsuite}
        />

        <div className="branches">
          {data.branches.map((b, i) => (
            <React.Fragment key={b.id}>
              <Branch
                branch={b}
                csuiteById={csuiteById}
                query={q}
                onMoveMember={onMoveMember}
                onMoveBranch={onMoveBranch}
                onMoveDept={onMoveDept}
                onEditMember={onEditMember}
                onDeleteMember={onDeleteMember}
                onAddMember={onAddMember}
                onEditBranch={onEditBranch}
                onAddDept={onAddDept}
                onRenameDept={onRenameDept}
                onDeleteDept={onDeleteDept}
              />
            </React.Fragment>
          ))}
        </div>
      </main>

      {modal && (
        <ModalForm
          modal={modal}
          csuite={data.csuite}
          onClose={() => setModal(null)}
          onSubmit={submitModal}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ---------- Modal forms -----------------------------------------------------

function ModalForm({ modal, csuite, onClose, onSubmit }) {
  const isMember = modal.kind === "member" || modal.kind === "addMember";
  const isCsuite = modal.kind === "csuite";
  const isBranch = modal.kind === "branch";
  const isDept   = modal.kind === "dept";

  const [form, setForm] = useState(() => {
    if (isMember) return {
      name: modal.payload.name || "",
      role: modal.payload.role || "",
      vacant: !!modal.payload.vacant,
    };
    if (isCsuite) return { title: modal.payload.title, name: modal.payload.name };
    if (isBranch) return { label: modal.payload.label, reportsTo: modal.payload.reportsTo };
    if (isDept)   return { name: modal.payload.name };
    return {};
  });

  const title =
    modal.kind === "addMember" ? (modal.payload.branchId === "board" ? "Add director" : "Add member") :
    modal.kind === "member" ? "Edit member" :
    modal.kind === "csuite" ? "Edit role" :
    modal.kind === "branch" ? (modal.payload.id ? "Edit branch" : "Add branch") :
    modal.kind === "dept"   ? (modal.payload.depId ? "Rename department" : "Add department") :
    "Edit";

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <Modal title={title} onClose={onClose} footer={
      <>
        <button className="as-btn-ghost" onClick={onClose}>Cancel</button>
        <button className="as-btn-primary" onClick={handleSubmit}>Save</button>
      </>
    }>
      <form className="formgrid" onSubmit={handleSubmit}>
        {isMember && (
          <>
            <Field label="Name">
              <input autoFocus className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Jony Ren" />
            </Field>
            <Field label="Role" hint="Title or function — leave blank for directors">
              <input className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. UI/UX Designer" />
            </Field>
            <label className="checkrow">
              <input type="checkbox" checked={!!form.vacant} onChange={(e) => setForm({ ...form, vacant: e.target.checked })} />
              <span>This is an open position (we are hiring)</span>
            </label>
          </>
        )}
        {isCsuite && (
          <>
            <Field label="Title">
              <input autoFocus className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="Name">
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
          </>
        )}
        {isBranch && (
          <>
            <Field label="Branch label">
              <input autoFocus className="input" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Operations & market" />
            </Field>
            <Field label="Reports to">
              <select className="input" value={form.reportsTo} onChange={(e) => setForm({ ...form, reportsTo: e.target.value })}>
                {csuite.map(c => <option key={c.id} value={c.id}>{c.title} — {c.name}</option>)}
              </select>
            </Field>
          </>
        )}
        {isDept && (
          <Field label="Department name">
            <input autoFocus className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Design" />
          </Field>
        )}
        <button type="submit" hidden></button>
      </form>
    </Modal>
  );
}

// ---------- Mount -----------------------------------------------------------
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
