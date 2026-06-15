// AllScale Org Chart — main app
// React + native HTML5 drag-and-drop. State persisted to localStorage.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

const STORAGE_KEY = "allscale_org_chart_v2";
const LEGACY_STORAGE_KEY = "allscale_org_chart_v1";

// ----- helpers -------------------------------------------------------------

const uid = (prefix = "id") =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
window.uid = uid;

const initials = (name) => {
  if (!name) return "?";
  const cleaned = name.replace(/\([^)]+\)/g, " ").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0][0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
};

// Stable color seed per person — picks a soft tint
const tintFor = (id, isLeader = false) => {
  // Unified palette: every leader gets the same navy treatment;
  // every team member gets the same mint treatment.
  if (isLeader) return { bg: "#0C3124", fg: "#FFFFFF" };  // deep brand green
  return { bg: "#E8F5EE", fg: "#0C3124" };                // mint (Jony-style)
};

// Search-match helper: highlights query inside a string
const Highlight = ({ text, query }) => {
  if (!query || !text) return text || "";
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="hl">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
};

// ----- migration ----------------------------------------------------------
// New shape:
//   people     : [{ id, name, role, isLeader, openRole? }]
//   board      : { id:'board', memberIds:[] }
//   executives : [{ id, personId, title, tag, departments:[{ id, name, subtitle, note?, leadIds:[], memberIds:[] }] }]
//
// Legacy shape stored people inline inside board.members and dept.members. This
// migration flattens everyone into `people` (deduping by id) and converts inline
// member arrays into `memberIds`/`leadIds` references.
function migrateLegacy(legacy) {
  const peopleById = new Map();
  const upsert = (p) => {
    if (!p || !p.id) return;
    const cur = peopleById.get(p.id) || {};
    peopleById.set(p.id, {
      id: p.id,
      name: p.name || cur.name || "",
      role: p.role || cur.role || "",
      isLeader: cur.isLeader || p.isLeader || false,
      openRole: p.openRole || cur.openRole || false,
    });
  };

  // Executives become people too (with isLeader=true), keyed by their personId
  const executives = (legacy.executives || []).map(e => {
    const personId = e.personId || `p_${e.id}`;
    upsert({ id: personId, name: e.name, role: e.title, isLeader: true });
    const departments = (e.departments || []).map(d => {
      const leadIds = [], memberIds = [];
      (d.members || []).forEach(m => {
        upsert(m);
        (m.level === "lead" ? leadIds : memberIds).push(m.id);
      });
      return {
        id: d.id, name: d.name, subtitle: d.subtitle, note: d.note,
        leadIds, memberIds,
      };
    });
    return { id: e.id, personId, title: e.title, tag: e.tag, departments };
  });

  const board = { id: "board", memberIds: [] };
  (legacy.board?.members || []).forEach(m => {
    upsert(m);
    board.memberIds.push(m.id);
  });

  return { people: Array.from(peopleById.values()), board, executives };
}

const buildSeedState = () => migrateLegacy(window.ORG_SEED);


const loadState = () => {
  // Try v2 first (new shape)
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.people && parsed.board && parsed.executives) return parsed;
    }
  } catch (e) { /* ignore */ }

  // Fall back to legacy v1 and migrate
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) return migrateLegacy(JSON.parse(raw));
  } catch (e) { /* ignore */ }

  return buildSeedState();
};

const saveState = (state) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
};

// ----- top-level app -------------------------------------------------------

function App() {
  const [state, setState] = useState(loadState);
  const [query, setQuery] = useState("");
  const [editingPerson, setEditingPerson] = useState(null); // {execId, deptId, member} | null
  const [editingDept,   setEditingDept]   = useState(null); // {execId, dept} | null
  const [adding, setAdding] = useState(null); // {kind:'person'|'dept'|'exec', execId?, deptId?}
  const [zoom, setZoom] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [pinPrompt, setPinPrompt] = useState(false);

  // ------ GitHub sync state ------------------------------------------------
  // sync.status: 'loading' | 'synced' | 'offline' | 'pushing' | 'error' | 'dirty'
  // sha tracks the last-known commit-of-file from GitHub for write conflict detection.
  // dirty = local has unpushed changes.
  const [sync, setSync] = useState({ status: "loading", sha: null, lastPushedAt: null, error: null });
  const [tokenPrompt, setTokenPrompt] = useState(false); // shown when user clicks Publish without a token
  const dirtyRef = useRef(false); // tracks whether state changes after initial load are user-driven

  // Initial load: try GitHub, fall back to localStorage.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, sha } = await window.GH_SYNC.fetchData();
        if (cancelled) return;
        if (data && data.people && data.executives) {
          setState(data);
          setSync(s => ({ ...s, status: "synced", sha, error: null }));
        } else {
          // Empty repo file or missing — keep local state, mark as needing first push
          setSync(s => ({ ...s, status: "synced", sha, error: null }));
        }
      } catch (e) {
        if (cancelled) return;
        setSync(s => ({ ...s, status: "offline", error: e.message }));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { saveState(state); }, [state]);

  // Mark dirty whenever state changes after the initial load completes.
  // We only flip status to 'dirty' once we're past the loading phase.
  useEffect(() => {
    if (sync.status === "loading") return;
    if (!dirtyRef.current) {
      // Skip the very first state update (which is the load itself).
      dirtyRef.current = true;
      return;
    }
    setSync(s => (s.status === "pushing" ? s : { ...s, status: "dirty" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Manual push to GitHub
  const publish = useCallback(async () => {
    if (!window.GH_SYNC.hasToken()) {
      setTokenPrompt(true);
      return;
    }
    setSync(s => ({ ...s, status: "pushing", error: null }));
    try {
      const newSha = await window.GH_SYNC.pushData(state, sync.sha);
      setSync({ status: "synced", sha: newSha, lastPushedAt: Date.now(), error: null });
    } catch (e) {
      console.error("[GH_SYNC] Publish failed:", e);
      setSync(s => ({ ...s, status: "error", error: e.message }));
    }
  }, [state, sync.sha]);

  // Pull latest from GitHub (used after a conflict, or to refresh)
  const pullLatest = useCallback(async () => {
    setSync(s => ({ ...s, status: "loading", error: null }));
    try {
      const { data, sha } = await window.GH_SYNC.fetchData();
      if (data && data.people && data.executives) setState(data);
      dirtyRef.current = false;
      setSync({ status: "synced", sha, lastPushedAt: null, error: null });
    } catch (e) {
      setSync(s => ({ ...s, status: "offline", error: e.message }));
    }
  }, []);

  // Lock the page in view mode by default
  useEffect(() => {
    document.body.classList.toggle("is-locked", !editMode);
  }, [editMode]);

  // Auto-lock after 10 minutes of inactivity (security hygiene)
  useEffect(() => {
    if (!editMode) return;
    let timer;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setEditMode(false), 10 * 60 * 1000);
    };
    reset();
    const events = ["mousemove", "keydown", "click"];
    events.forEach(ev => window.addEventListener(ev, reset));
    return () => {
      clearTimeout(timer);
      events.forEach(ev => window.removeEventListener(ev, reset));
    };
  }, [editMode]);

  // ------ helpers ---------------------------------------------------------
  // Map of personId -> count of placements (board + dept leads + dept members),
  // used for the ×N "in N depts" badge.
  const placementCount = useMemo(() => {
    const counts = new Map();
    const bump = (id) => { if (id) counts.set(id, (counts.get(id) || 0) + 1); };
    state.board.memberIds.forEach(bump);
    state.executives.forEach(e => {
      // A leader at the top of a column counts as a placement on the chart.
      bump(e.personId);
      e.departments.forEach(d => {
        d.leadIds.forEach(bump);
        d.memberIds.forEach(bump);
      });
    });
    return counts;
  }, [state]);

  const peopleById = useMemo(() => {
    const m = new Map();
    state.people.forEach(p => m.set(p.id, p));
    return m;
  }, [state.people]);

  // ------ people-list mutations -------------------------------------------
  const upsertMasterPerson = (person) => {
    setState(prev => {
      const next = structuredClone(prev);
      const i = next.people.findIndex(p => p.id === person.id);
      if (i >= 0) next.people[i] = { ...next.people[i], ...person };
      else next.people.push(person);
      return next;
    });
  };

  const deleteMasterPerson = (personId) => {
    setState(prev => {
      const next = structuredClone(prev);
      next.people = next.people.filter(p => p.id !== personId);
      next.board.memberIds = next.board.memberIds.filter(id => id !== personId);
      next.executives.forEach(e => {
        // If this person *is* an executive, drop the column entirely
        e.departments.forEach(d => {
          d.leadIds = d.leadIds.filter(id => id !== personId);
          d.memberIds = d.memberIds.filter(id => id !== personId);
        });
      });
      next.executives = next.executives.filter(e => e.personId !== personId);
      return next;
    });
  };

  // ------ placement mutations ---------------------------------------------
  // Add a personId to a destination (board or {execId, deptId, asLead}).
  const placePerson = (personId, dest) => {
    setState(prev => {
      const next = structuredClone(prev);
      if (dest.deptId === "board") {
        if (!next.board.memberIds.includes(personId)) next.board.memberIds.push(personId);
        return next;
      }
      const exec = next.executives.find(e => e.id === dest.execId);
      const dept = exec?.departments.find(d => d.id === dest.deptId);
      if (!dept) return prev;
      const list = dest.asLead ? "leadIds" : "memberIds";
      // Remove from the OTHER list in this dept first (so toggling lead/team works)
      dept.leadIds = dept.leadIds.filter(id => id !== personId);
      dept.memberIds = dept.memberIds.filter(id => id !== personId);
      dept[list].push(personId);
      return next;
    });
  };

  // Remove a placement (does NOT delete the person from the master list).
  const removePlacement = (personId, fromDeptId) => {
    setState(prev => {
      const next = structuredClone(prev);
      if (fromDeptId === "board") {
        next.board.memberIds = next.board.memberIds.filter(id => id !== personId);
      } else {
        next.executives.forEach(e => e.departments.forEach(d => {
          if (d.id === fromDeptId) {
            d.leadIds = d.leadIds.filter(id => id !== personId);
            d.memberIds = d.memberIds.filter(id => id !== personId);
          }
        }));
      }
      return next;
    });
  };

  // ------ dept mutations --------------------------------------------------
  const upsertDept = (execId, dept) => {
    setState(prev => {
      const next = structuredClone(prev);
      const exec = next.executives.find(e => e.id === execId);
      const i = exec.departments.findIndex(d => d.id === dept.id);
      if (i >= 0) exec.departments[i] = { ...exec.departments[i], ...dept };
      else exec.departments.push({ ...dept, leadIds: dept.leadIds || [], memberIds: dept.memberIds || [] });
      return next;
    });
  };

  const removeDept = (execId, deptId) => {
    if (!confirm("Delete this department? People will remain in the People list.")) return;
    setState(prev => {
      const next = structuredClone(prev);
      const exec = next.executives.find(e => e.id === execId);
      exec.departments = exec.departments.filter(d => d.id !== deptId);
      return next;
    });
  };

  // Move a person between departments / board.
  // For drag-drop: from = {deptId, execId?, asLead?}, to = {deptId, execId?, asLead?, index?}
  const movePerson = (personId, from, to) => {
    setState(prev => {
      const next = structuredClone(prev);
      const removeFrom = (loc) => {
        if (loc.deptId === "board") {
          next.board.memberIds = next.board.memberIds.filter(id => id !== personId);
          return;
        }
        const exec = next.executives.find(e => e.id === loc.execId);
        const dept = exec?.departments.find(d => d.id === loc.deptId);
        if (!dept) return;
        dept.leadIds = dept.leadIds.filter(id => id !== personId);
        dept.memberIds = dept.memberIds.filter(id => id !== personId);
      };
      const insertInto = (loc) => {
        if (loc.deptId === "board") {
          const arr = next.board.memberIds;
          if (typeof loc.index === "number") arr.splice(loc.index, 0, personId);
          else arr.push(personId);
          return;
        }
        const exec = next.executives.find(e => e.id === loc.execId);
        const dept = exec?.departments.find(d => d.id === loc.deptId);
        if (!dept) return;
        const arr = loc.asLead ? dept.leadIds : dept.memberIds;
        if (typeof loc.index === "number") arr.splice(loc.index, 0, personId);
        else arr.push(personId);
      };
      if (from) removeFrom(from);
      // Avoid duplicates if someone drops on a list that already has them
      if (to.deptId === "board") {
        if (next.board.memberIds.includes(personId)) return next;
      } else {
        const exec = next.executives.find(e => e.id === to.execId);
        const dept = exec?.departments.find(d => d.id === to.deptId);
        if (dept && (dept.leadIds.includes(personId) || dept.memberIds.includes(personId))) return next;
      }
      insertInto(to);
      return next;
    });
  };

  const moveDept = (execId, deptId, toExecId, toIndex) => {
    setState(prev => {
      const next = structuredClone(prev);
      const fromExec = next.executives.find(e => e.id === execId);
      const i = fromExec.departments.findIndex(d => d.id === deptId);
      if (i < 0) return prev;
      const [moved] = fromExec.departments.splice(i, 1);
      const toExec = next.executives.find(e => e.id === toExecId);
      if (typeof toIndex === "number") toExec.departments.splice(toIndex, 0, moved);
      else toExec.departments.push(moved);
      return next;
    });
  };

  const removeExec = (execId) => {
    if (!confirm("Remove this leader column? The person will remain in the People list.")) return;
    setState(prev => {
      const next = structuredClone(prev);
      next.executives = next.executives.filter(e => e.id !== execId);
      return next;
    });
  };

  // ------ search ----------------------------------------------------------
  const matchSet = useMemo(() => {
    if (!query) return null;
    const q = query.toLowerCase();
    const hits = new Set();
    const hit = (s) => s && s.toLowerCase().includes(q);
    state.people.forEach(p => {
      if (hit(p.name) || hit(p.role)) hits.add(p.id);
    });
    state.executives.forEach(e => {
      if (hit(e.title) || hit(e.tag)) hits.add(e.id);
      e.departments.forEach(d => {
        if (hit(d.name) || hit(d.subtitle) || hit(d.note)) hits.add(d.id);
      });
    });
    return hits;
  }, [query, state]);

  const matchCount = matchSet ? matchSet.size : 0;

  // ------ keyboard --------------------------------------------------------
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("org-search")?.focus();
      }
      if (e.key === "Escape") {
        setEditingPerson(null); setEditingDept(null); setAdding(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ------ render ----------------------------------------------------------
  const totalPeople = state.people.length;

  // Hydrate dept memberIds/leadIds into person objects for rendering
  const hydrateDept = (d) => ({
    ...d,
    leads: d.leadIds.map(id => peopleById.get(id)).filter(Boolean),
    members: d.memberIds.map(id => peopleById.get(id)).filter(Boolean),
  });

  return (
    <div className="app">
      <Header
        query={query}
        setQuery={setQuery}
        matchCount={matchCount}
        totalPeople={totalPeople}
        execCount={state.executives.length}
        deptCount={state.executives.reduce((s, e) => s + e.departments.length, 0)}
        onAddExec={() => editMode && setAdding({ kind: "exec" })}
        onAddPerson={() => editMode && setEditingPerson({ kind: "new" })}
        onReset={() => {
          if (!editMode) return;
          if (confirm("Reset to seed data? This will erase your changes.")) {
            setState(buildSeedState());
          }
        }}
        zoom={zoom}
        setZoom={setZoom}
        editMode={editMode}
        onToggleEditMode={() => {
          if (editMode) setEditMode(false);
          else setPinPrompt(true);
        }}
        sync={sync}
        onPublish={publish}
        onPullLatest={pullLatest}
      />

      <div className="layout">
        <PeopleSidebar
          people={state.people}
          placementCount={placementCount}
          editMode={editMode}
          onAdd={() => setEditingPerson({ kind: "new" })}
          onEdit={(p) => setEditingPerson({ kind: "edit", person: p })}
          onDelete={(p) => {
            const placements = placementCount.get(p.id) || 0;
            const msg = placements
              ? `Delete ${p.name}? They will be removed from ${placements} place${placements === 1 ? "" : "s"} on the chart.`
              : `Delete ${p.name}?`;
            if (confirm(msg)) deleteMasterPerson(p.id);
          }}
          query={query}
          matchSet={matchSet}
        />

        <main className="canvas">
          <div className="zoom-wrap" style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>
            {/* Board */}
            <BoardStrip
              board={{
                ...state.board,
                members: state.board.memberIds.map(id => peopleById.get(id)).filter(Boolean),
              }}
              query={query}
              matchSet={matchSet}
              placementCount={placementCount}
              onEditPerson={(m) => setEditingPerson({ kind: "edit", person: m })}
              onAddPerson={() => setAdding({ kind: "place", deptId: "board" })}
              onRemove={(personId) => {
                const p = state.people.find(x => x.id === personId);
                const name = p?.name || "this person";
                if (confirm(`Remove ${name} from the Board?\n\nThey will stay in the People list and other departments.`)) {
                  removePlacement(personId, "board");
                }
              }}
              onMove={(personId, fromDeptId, _toDeptId, toIndex) => {
                const from = fromDeptId === "board"
                  ? { deptId: "board" }
                  : findLocation(state, fromDeptId, personId);
                movePerson(personId, from, { deptId: "board", index: toIndex });
              }}
            />

            {/* Trunk → executives */}
            <div className="trunk" aria-hidden="true">
              <div className="trunk-line" />
            </div>

            <div className="exec-row">
              {state.executives.map((exec, ei) => {
                const execPerson = peopleById.get(exec.personId);
                return (
                  <ExecColumn
                    key={exec.id}
                    exec={{
                      ...exec,
                      name: execPerson?.name || "",
                      departments: exec.departments.map(hydrateDept),
                    }}
                    allExecs={state.executives}
                    index={ei}
                    query={query}
                    matchSet={matchSet}
                    placementCount={placementCount}
                    onEditExec={() => execPerson && setEditingPerson({ kind: "edit", person: execPerson, execId: exec.id })}
                    onRemoveExec={() => removeExec(exec.id)}
                    onAddDept={() => setAdding({ kind: "dept", execId: exec.id })}
                    onEditDept={(d) => setEditingDept({ execId: exec.id, dept: d })}
                    onRemoveDept={(d) => removeDept(exec.id, d.id)}
                    onAddPersonToDept={(d, asLead) => setAdding({ kind: "place", execId: exec.id, deptId: d.id, asLead })}
                    onEditPerson={(_d, m) => setEditingPerson({ kind: "edit", person: m })}
                    onRemovePerson={(personId, deptId) => {
                      const p = state.people.find(x => x.id === personId);
                      const name = p?.name || "this person";
                      const dept = exec.departments.find(d => d.id === deptId);
                      const deptName = dept?.name || "this department";
                      if (confirm(`Remove ${name} from ${deptName}?\n\nThey will stay in the People list and other departments.`)) {
                        removePlacement(personId, deptId);
                      }
                    }}
                    onMovePerson={(personId, fromDeptId, toDeptId, toIndex, asLead) => {
                      const from = fromDeptId === "board"
                        ? { deptId: "board" }
                        : findLocation(state, fromDeptId, personId);
                      const toExec = state.executives.find(e => e.departments.some(d => d.id === toDeptId));
                      movePerson(personId, from, {
                        deptId: toDeptId,
                        execId: toExec?.id,
                        asLead: !!asLead,
                        index: toIndex,
                      });
                    }}
                    onMoveDept={moveDept}
                  />
                );
              })}

              <button
                className="add-exec-col"
                onClick={() => setAdding({ kind: "exec" })}
                title="Add a leader"
              >
                <span className="plus">+</span>
                <span>Add leader</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* modals */}
      {editingPerson && (
        <PersonModal
          ctx={editingPerson}
          onClose={() => setEditingPerson(null)}
          onSave={(person) => {
            upsertMasterPerson(person);
            setEditingPerson(null);
          }}
          onDelete={() => {
            if (editingPerson.kind === "edit") {
              const p = editingPerson.person;
              const placements = placementCount.get(p.id) || 0;
              const msg = placements
                ? `Delete ${p.name}? They will be removed from ${placements} place${placements === 1 ? "" : "s"} on the chart.`
                : `Delete ${p.name}?`;
              if (confirm(msg)) {
                deleteMasterPerson(p.id);
                setEditingPerson(null);
              }
            }
          }}
        />
      )}

      {editingDept && (
        <DeptModal
          dept={editingDept.dept}
          onClose={() => setEditingDept(null)}
          onSave={(d) => { upsertDept(editingDept.execId, d); setEditingDept(null); }}
          onDelete={() => { removeDept(editingDept.execId, editingDept.dept.id); setEditingDept(null); }}
        />
      )}

      {adding && adding.kind === "place" && (
        <PlacePersonModal
          state={state}
          ctx={adding}
          peopleById={peopleById}
          placementCount={placementCount}
          onClose={() => setAdding(null)}
          onPlace={(personId, asLead) => {
            placePerson(personId, { execId: adding.execId, deptId: adding.deptId, asLead });
            setAdding(null);
          }}
          onCreateNew={() => {
            const dest = { execId: adding.execId, deptId: adding.deptId, asLead: adding.asLead };
            setAdding(null);
            setEditingPerson({ kind: "new", placeAfterCreate: dest });
          }}
        />
      )}

      {adding && adding.kind === "dept" && (
        <DeptModal
          dept={{ id: uid("d"), name: "", subtitle: "", leadIds: [], memberIds: [] }}
          onClose={() => setAdding(null)}
          onSave={(d) => { upsertDept(adding.execId, d); setAdding(null); }}
        />
      )}

      {adding && adding.kind === "exec" && (
        <AddExecModal
          people={state.people}
          executives={state.executives}
          onClose={() => setAdding(null)}
          onCreate={({ personId, title, tag }) => {
            setState(prev => {
              const next = structuredClone(prev);
              // Mark the chosen person as leader
              const p = next.people.find(p => p.id === personId);
              if (p) p.isLeader = true;
              next.executives.push({
                id: uid("e"), personId, title, tag, departments: [],
              });
              return next;
            });
            setAdding(null);
          }}
          onCreateNewPerson={() => {
            setAdding(null);
            setEditingPerson({ kind: "new", makeLeaderAfter: true });
          }}
        />
      )}

      <footer className="footnote">
        <span>{editMode
          ? "Edit mode · drag people between departments · drag departments between leaders · ⌘K to search · changes save automatically"
          : "View only · click the lock to enter edit mode"}</span>
      </footer>

      {pinPrompt && (
        <PinModal
          onClose={() => setPinPrompt(false)}
          onSuccess={() => { setEditMode(true); setPinPrompt(false); }}
        />
      )}

      {tokenPrompt && (
        <TokenModal
          onClose={() => setTokenPrompt(false)}
          onSave={(tok) => {
            window.GH_SYNC.setToken(tok);
            setTokenPrompt(false);
            // Immediately try to push now that we have a token
            publish();
          }}
        />
      )}
    </div>
  );
}

// Helper used for drag-from locations in renders above.
function findLocation(state, deptId, personId) {
  if (deptId === "board") return { deptId: "board" };
  for (const e of state.executives) {
    for (const d of e.departments) {
      if (d.id !== deptId) continue;
      const asLead = d.leadIds.includes(personId);
      return { deptId, execId: e.id, asLead };
    }
  }
  return { deptId };
}

window.App = App;
