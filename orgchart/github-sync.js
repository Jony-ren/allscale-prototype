// GitHub sync — read/write a JSON file in a public repo.
//
// READS go to raw.githubusercontent.com (no auth needed, no rate cost).
// WRITES use the Contents API with a Personal Access Token (fine-grained,
// contents: read+write on this single repo).

window.GH_SYNC = (function () {
  const OWNER  = "allscale-io";
  const REPO   = "prototype";
  const BRANCH = "main";
  const PATH   = "orgchart-contents/data.json";

  // raw.githubusercontent serves the file with edge caching (~5min). We bust
  // the cache with a timestamp so reloads see fresh data.
  const RAW_URL = () =>
    `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${PATH}?t=${Date.now()}`;

  const API_URL = () =>
    `https://api.github.com/repos/${OWNER}/${REPO}/${PATH}?ref=${BRANCH}`;

  const TOKEN_KEY = "allscale_org_chart_gh_token";

  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; }
  }
  function setToken(t) {
    try {
      if (t) localStorage.setItem(TOKEN_KEY, t);
      else   localStorage.removeItem(TOKEN_KEY);
    } catch {}
  }
  function hasToken() { return !!getToken(); }

  // ----- READ ---------------------------------------------------------------
  // Returns { data, sha } where sha is needed for the next write, OR null if
  // the file doesn't exist yet, OR throws on network error.
  async function fetchData() {
    // First try raw (fast, cache-bypassed) for the data itself.
    let data = null;
    try {
      const resp = await fetch(RAW_URL(), { cache: "no-store" });
      if (resp.status === 404) {
        return { data: null, sha: null };
      }
      if (!resp.ok) throw new Error(`raw fetch ${resp.status}`);
      data = await resp.json();
    } catch (e) {
      // raw failed — fall through to API which is more reliable
    }

    // Fetch sha via the Contents API (lightweight HEAD-ish call). If we have
    // a token, send it (raises rate limit from 60/hr to 5000/hr).
    const headers = { Accept: "application/vnd.github+json" };
    const tok = getToken();
    if (tok) headers.Authorization = `Bearer ${tok}`;

    const apiResp = await fetch(API_URL(), { headers, cache: "no-store" });
    if (apiResp.status === 404) return { data: null, sha: null };
    if (!apiResp.ok) {
      const text = await apiResp.text();
      throw new Error(`GitHub API ${apiResp.status}: ${text.slice(0, 200)}`);
    }
    const meta = await apiResp.json();

    // If we couldn't get data from raw, decode it from the API response.
    if (data == null && meta.content) {
      try {
        const decoded = decodeBase64Utf8(meta.content.replace(/\s/g, ""));
        data = JSON.parse(decoded);
      } catch (e) {
        throw new Error("data.json on GitHub is not valid JSON");
      }
    }

    return { data, sha: meta.sha || null };
  }

  // ----- WRITE --------------------------------------------------------------
  // Pushes a new version of data.json. Requires a token. Returns the new sha.
  async function pushData(data, prevSha, message = "Update org chart data") {
    const tok = getToken();
    if (!tok) throw new Error("No GitHub token saved. Click Publish and add one.");

    const body = {
      message,
      content: encodeBase64Utf8(JSON.stringify(data, null, 2)),
      branch: BRANCH,
    };
    if (prevSha) body.sha = prevSha;

    const resp = await fetch(API_URL().split("?")[0], {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${tok}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (resp.status === 401) throw new Error("Token rejected (401). Check your token has contents:write on this repo.");
    if (resp.status === 403) throw new Error("Token forbidden (403). Token may lack write access to this repo.");
    if (resp.status === 404) throw new Error("Repo or file path not found (404).");
    if (resp.status === 409 || resp.status === 422) {
      // Stale sha — someone else pushed. Caller should re-fetch and retry.
      const e = new Error("Conflict: data was updated remotely. Refresh the page to pull the latest, then re-apply your changes.");
      e.code = "STALE_SHA";
      throw e;
    }
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`GitHub API ${resp.status}: ${text.slice(0, 200)}`);
    }
    const meta = await resp.json();
    return meta.content?.sha || null;
  }

  // ----- base64 helpers (UTF-8 safe) ----------------------------------------
  function encodeBase64Utf8(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function decodeBase64Utf8(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  return {
    OWNER, REPO, BRANCH, PATH,
    getToken, setToken, hasToken,
    fetchData, pushData,
  };
})();
