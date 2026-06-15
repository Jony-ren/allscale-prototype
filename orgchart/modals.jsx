// AllScale Org Chart — modals (Person, Department, Place, AddExec)

function Modal({ title, onClose, children, footer, wide }) {
  return (
    <div className="scrim" onClick={onClose}>
      <div className={`modal ${wide ? "modal-wide" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} title="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

// ---- Person modal ──────────────────────────────────────────────────────
// Edits a master-list person. ctx is { kind: 'new' | 'edit', person?, ... }.

function PersonModal({ ctx, onClose, onSave, onDelete }) {
  const isNew = ctx.kind === "new";
  const p = ctx.person || {};
  const [name, setName] = React.useState(p.name || "");
  const [role, setRole] = React.useState(p.role || "");
  const [openRole, setOpenRole] = React.useState(!!p.openRole);
  const [isLeader, setIsLeader] = React.useState(!!p.isLeader);

  const save = () => {
    if (!name.trim()) return alert("Name is required.");
    const updated = {
      id: p.id || uid("p"),
      name: name.trim(),
      role: role.trim(),
      openRole: openRole || false,
      isLeader: isLeader || false,
    };
    onSave(updated);
  };

  return (
    <Modal
      title={isNew ? "Add person" : "Edit person"}
      onClose={onClose}
      footer={
        <>
          {!isNew && <button className="ghost danger" onClick={onDelete}>Delete</button>}
          <div className="spacer" />
          <button className="ghost" onClick={onClose}>Cancel</button>
          <button className="primary" onClick={save}>{isNew ? "Add" : "Save"}</button>
        </>
      }
    >
      <Field label="Full name">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex Chen" autoFocus />
      </Field>
      <Field label="Role / title">
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Marketing Lead" />
      </Field>
      <Field label="Flags">
        <label className="check">
          <input type="checkbox" checked={openRole} onChange={(e) => setOpenRole(e.target.checked)} />
          <span>Open role (job opening)</span>
        </label>
        <label className="check">
          <input type="checkbox" checked={isLeader} onChange={(e) => setIsLeader(e.target.checked)} />
          <span>Leader (eligible to head a column on the chart)</span>
        </label>
      </Field>
      {!isNew && (
        <div className="field-hint" style={{ marginTop: 4 }}>
          Tip: this person's chart placements update automatically when you change name or role here.
        </div>
      )}
    </Modal>
  );
}
window.PersonModal = PersonModal;

// ---- Department modal ──────────────────────────────────────────────────

function DeptModal({ dept, onClose, onSave, onDelete }) {
  const [name, setName] = React.useState(dept.name || "");
  const [subtitle, setSubtitle] = React.useState(dept.subtitle || "");
  const [note, setNote] = React.useState(dept.note || "");

  const save = () => {
    if (!name.trim()) return alert("Department name is required.");
    onSave({
      ...dept,
      id: dept.id || uid("d"),
      name: name.trim(),
      subtitle: subtitle.trim() || undefined,
      note: note.trim() || undefined,
    });
  };

  return (
    <Modal
      title={dept.name ? "Edit department" : "Add department"}
      onClose={onClose}
      footer={
        <>
          {onDelete && <button className="ghost danger" onClick={onDelete}>Delete</button>}
          <div className="spacer" />
          <button className="ghost" onClick={onClose}>Cancel</button>
          <button className="primary" onClick={save}>Save</button>
        </>
      }
    >
      <Field label="Department name">
        <input value={name} onChange={(e) => setName(e.target.value)} autoFocus placeholder="Operations & HR" />
      </Field>
      <Field label="Subtitle" hint="Reporting line, region, etc.">
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Reports to COO" />
      </Field>
      <Field label="Note">
        <textarea rows="2" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Coordinates with Marketing" />
      </Field>
    </Modal>
  );
}
window.DeptModal = DeptModal;

// ---- Place-person modal ────────────────────────────────────────────────
// Picker that lists everyone in the master list. User chooses someone and
// they get placed (as Lead or Team) into the destination dept/board.

function PlacePersonModal({ state, ctx, peopleById, placementCount, onClose, onPlace, onCreateNew }) {
  const [query, setQuery] = React.useState("");
  // For dept placements, default to whatever was clicked (asLead) but allow toggling.
  const [asLead, setAsLead] = React.useState(!!ctx.asLead);
  const isBoard = ctx.deptId === "board";

  // Find the dept (so we can compute "already in this dept")
  const dest = React.useMemo(() => {
    if (isBoard) return { name: "Board of Directors", existing: new Set(state.board.memberIds) };
    const exec = state.executives.find(e => e.id === ctx.execId);
    const dept = exec?.departments.find(d => d.id === ctx.deptId);
    return {
      execTitle: exec?.title || "",
      name: dept?.name || "",
      existing: new Set([...(dept?.leadIds || []), ...(dept?.memberIds || [])]),
    };
  }, [state, ctx, isBoard]);

  const sorted = React.useMemo(() => {
    return [...state.people].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [state.people]);

  const filtered = sorted.filter(p => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (p.name || "").toLowerCase().includes(q) || (p.role || "").toLowerCase().includes(q);
  });

  return (
    <Modal
      title={`Add to ${isBoard ? "Board of Directors" : dest.name}`}
      onClose={onClose}
      wide
      footer={
        <>
          <button className="ghost" onClick={onCreateNew}>+ Add new person to People list</button>
          <div className="spacer" />
          <button className="ghost" onClick={onClose}>Cancel</button>
        </>
      }
    >
      {!isBoard && (
        <div className="seg" style={{ marginBottom: 14 }}>
          <button className={`seg-opt ${asLead ? "is-on" : ""}`} onClick={() => setAsLead(true)}>Add as Lead</button>
          <button className={`seg-opt ${!asLead ? "is-on" : ""}`} onClick={() => setAsLead(false)}>Add as Team member</button>
        </div>
      )}

      <div className="ps-search" style={{ marginBottom: 10 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
        </svg>
        <input
          autoFocus
          type="text"
          placeholder="Search people by name or role…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="picker-list">
        {filtered.length === 0 ? (
          <div className="ps-empty">No matching people. Click "+ Add new person" below.</div>
        ) : (
          filtered.map(p => {
            const placed = placementCount.get(p.id) || 0;
            const alreadyHere = dest.existing.has(p.id);
            return (
              <button
                key={p.id}
                className={`picker-row ${alreadyHere ? "is-disabled" : ""}`}
                disabled={alreadyHere}
                onClick={() => onPlace(p.id, asLead)}
                title={alreadyHere ? "Already in this department" : (placed ? `Already placed in ${placed} other place${placed === 1 ? "" : "s"}` : "Click to place")}
              >
                <Avatar id={p.id} name={p.name} size={34} openRole={p.openRole} isLeader={p.isLeader} />
                <div className="picker-text">
                  <div className="picker-name">
                    {p.name}
                    {p.isLeader && <span className="ps-leader-pip" title="Leader">★</span>}
                  </div>
                  <div className="picker-role">{p.role}</div>
                </div>
                <div className="picker-meta">
                  {alreadyHere
                    ? <span className="picker-tag">in this dept</span>
                    : placed
                      ? <span className="picker-tag is-soft">×{placed} elsewhere</span>
                      : <span className="picker-tag is-zero">unplaced</span>}
                </div>
              </button>
            );
          })
        )}
      </div>
    </Modal>
  );
}
window.PlacePersonModal = PlacePersonModal;

// ---- Add-leader modal ──────────────────────────────────────────────────
// Picks an existing person (or makes a new one) and creates a leader column.

function AddExecModal({ people, executives, onClose, onCreate, onCreateNewPerson }) {
  const [query, setQuery] = React.useState("");
  const [personId, setPersonId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tag, setTag] = React.useState("");

  const usedPersonIds = new Set(executives.map(e => e.personId));
  const sorted = React.useMemo(
    () => [...people].sort((a, b) => (a.name || "").localeCompare(b.name || "")),
    [people]
  );

  const filtered = sorted.filter(p => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (p.name || "").toLowerCase().includes(q) || (p.role || "").toLowerCase().includes(q);
  });

  const submit = () => {
    if (!personId) return alert("Pick a person from the list first.");
    if (!title.trim()) return alert("Title is required (e.g. CFO).");
    onCreate({ personId, title: title.trim(), tag: tag.trim() || undefined });
  };

  return (
    <Modal
      title="Add leader column"
      onClose={onClose}
      wide
      footer={
        <>
          <button className="ghost" onClick={onCreateNewPerson}>+ New person first</button>
          <div className="spacer" />
          <button className="ghost" onClick={onClose}>Cancel</button>
          <button className="primary" onClick={submit}>Add column</button>
        </>
      }
    >
      <div className="field-label" style={{ marginBottom: 6 }}>1. Pick the person</div>
      <div className="ps-search" style={{ marginBottom: 10 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
        </svg>
        <input
          autoFocus
          type="text"
          placeholder="Search People…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="picker-list" style={{ maxHeight: 260 }}>
        {filtered.map(p => {
          const used = usedPersonIds.has(p.id);
          return (
            <button
              key={p.id}
              className={`picker-row ${personId === p.id ? "is-selected" : ""} ${used ? "is-disabled" : ""}`}
              disabled={used}
              onClick={() => setPersonId(p.id)}
              title={used ? "Already a leader column" : "Click to select"}
            >
              <Avatar id={p.id} name={p.name} size={34} isLeader={p.isLeader} />
              <div className="picker-text">
                <div className="picker-name">{p.name}</div>
                <div className="picker-role">{p.role}</div>
              </div>
              {used && <span className="picker-tag">already a leader</span>}
            </button>
          );
        })}
      </div>

      <div className="field-label" style={{ margin: "16px 0 6px" }}>2. Column details</div>
      <Field label="Title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="CFO" />
      </Field>
      <Field label="Tag" hint="Short label shown under the leader card.">
        <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Finance" />
      </Field>
    </Modal>
  );
}
window.AddExecModal = AddExecModal;

// ---- GitHub token modal ─────────────────────────────────────────────────
//
// Asked once the first time the user clicks Publish. Stores in localStorage.
// PAT must have contents:read+write on allscale-io/prototype.

function TokenModal({ onClose, onSave }) {
  const existing = (window.GH_SYNC && window.GH_SYNC.getToken()) || "";
  const [token, setToken] = React.useState(existing);
  const [show, setShow]   = React.useState(false);

  const submit = (e) => {
    e?.preventDefault?.();
    const trimmed = token.trim();
    if (!trimmed) return;
    onSave(trimmed);
  };

  return (
    <Modal
      title="Connect to GitHub"
      onClose={onClose}
      wide
      footer={
        <>
          <button className="ghost" onClick={onClose}>Cancel</button>
          {existing && (
            <button
              className="ghost"
              onClick={() => { window.GH_SYNC.setToken(""); setToken(""); }}
              title="Forget the token stored in this browser"
            >
              Forget token
            </button>
          )}
          <button className="primary" onClick={submit} disabled={!token.trim()}>
            Save & publish
          </button>
        </>
      }
    >
      <div className="token-help">
        <p style={{ margin: "0 0 10px" }}>
          Publishing writes <code>data.json</code> to{" "}
          <strong>{window.GH_SYNC?.OWNER}/{window.GH_SYNC?.REPO}</strong>.
          You need a Personal Access Token with permission to write to this repo.
        </p>
        <ol style={{ margin: "0 0 14px 18px", paddingLeft: 4, lineHeight: 1.6, fontSize: 13 }}>
          <li>
            Open{" "}
            <a
              href="https://github.com/settings/personal-access-tokens/new"
              target="_blank"
              rel="noreferrer"
            >GitHub → fine-grained tokens → New token</a>.
          </li>
          <li>Resource owner: <code>allscale-io</code>. Repository access: <em>Only select repositories</em> → pick <code>prototype</code>.</li>
          <li>Repository permissions → <strong>Contents: Read and write</strong>.</li>
          <li>Generate, copy the token, paste below.</li>
        </ol>
      </div>
      <Field label="Personal access token" hint="Stored only in your browser (localStorage). Anyone with access to this browser will be able to publish.">
        <div className="token-input">
          <input
            type={show ? "text" : "password"}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="github_pat_..."
            autoFocus
            onKeyDown={(e) => { if (e.key === "Enter") submit(e); }}
          />
          <button
            type="button"
            className="token-toggle"
            onClick={() => setShow(s => !s)}
            tabIndex={-1}
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </Field>
    </Modal>
  );
}
window.TokenModal = TokenModal;
