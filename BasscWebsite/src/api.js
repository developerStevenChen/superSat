/**
 * API base URL resolution (first match wins):
 * 1. window.__RUNTIME_CONFIG__.API_ORIGIN — written at container start from VITE_API_BASE_URL (Railway)
 * 2. import.meta.env.VITE_API_BASE_URL — baked in at webpack build time
 * 3. localhost dev → http://localhost:8000
 */
function resolveApiOrigin() {
  const fromRuntime =
    typeof window !== 'undefined' && window.__RUNTIME_CONFIG__?.API_ORIGIN;
  const candidates = [
    fromRuntime,
    import.meta.env.VITE_API_BASE_URL || '',
  ];
  for (const raw of candidates) {
    const s = (raw || '').trim();
    if (s.startsWith('http://') || s.startsWith('https://')) {
      return s.replace(/\/api\/?$/, '').replace(/\/$/, '');
    }
  }
  if (
    typeof window !== 'undefined' &&
    window.location &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return 'http://localhost:8000';
  }
  return '';
}

/** @returns {string} e.g. https://backend.example.com/api */
export function requireApiBase() {
  const origin = resolveApiOrigin();
  if (!origin) {
    throw new Error(
      'Backend URL not configured. On Railway open superSat_FE → Variables → set VITE_API_BASE_URL to your superSat_BE domain (no /api), then Redeploy. Check /runtime-config.js in the browser.'
    );
  }
  return `${origin}/api`;
}

/** @deprecated Prefer requireApiBase(); empty string when backend URL is not configured. */
export const API_BASE = resolveApiOrigin() ? `${resolveApiOrigin()}/api` : '';

/** Token saved after login; request header Authorization: Token <token>; no CSRF */
const TOKEN_KEY = 'bassc_admin_token';
const TOKEN_EXP_KEY = 'bassc_admin_token_exp';
// 2 hours
const TOKEN_TTL_MS = 2 * 60 * 60 * 1000;

let authToken = '';

function clearStoredToken() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(TOKEN_EXP_KEY);
    }
  } catch {
    // ignore
  }
  authToken = '';
}

function loadTokenFromStorage() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return '';
    const token = window.localStorage.getItem(TOKEN_KEY) || '';
    const expRaw = window.localStorage.getItem(TOKEN_EXP_KEY);
    const exp = expRaw ? Number(expRaw) : 0;
    if (!token || !exp) {
      return '';
    }
    if (Date.now() > exp) {
      clearStoredToken();
      return '';
    }
    return token;
  } catch {
    return '';
  }
}

function saveTokenToStorage(token) {
  authToken = token || '';
  try {
    if (typeof window !== 'undefined' && window.localStorage && token) {
      const exp = Date.now() + TOKEN_TTL_MS;
      window.localStorage.setItem(TOKEN_KEY, token);
      window.localStorage.setItem(TOKEN_EXP_KEY, String(exp));
    }
  } catch {
    // ignore
  }
}

function authHeaders() {
  const h = {};
  const token = loadTokenFromStorage();
  authToken = token;
  if (token) h['Authorization'] = `Token ${token}`;
  return h;
}

/** Token-authenticated fetch (for login-required endpoints) */
export function authFetch(url, options = {}) {
  const headers = { ...authHeaders(), ...options.headers };
  if (typeof options.body === 'object' && !(options.body instanceof FormData) && !(options.body instanceof URLSearchParams)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }
  return fetch(url, { ...options, headers });
}

/**
 * Fetch all homepage assets (carousel, boards, introductions, news, nav)
 */
export async function fetchHomepage() {
  const res = await fetch(`${API_BASE}/homepage/`);
  if (!res.ok) throw new Error('Homepage fetch failed');
  const data = await res.json();
  // Support backend snake_case (e.g. home_page_pic) and camelCase
  const rawHomePagePic = data.homePagePic ?? data.home_page_pic ?? [];
  const rawBoards = data.boards ?? [];
  const rawIntroductions = data.introductions ?? [];
  const rawPathway = data.pathway ?? null;
  const rawClasses = data.classes ?? [];
  const rawNewsList = data.news ?? data.news_list ?? [];
  const rawNavItems = data.navItems ?? data.nav_items ?? [];
  // Normalize image field: backend may return image_url, frontend uses image
  const normImage = (item) => (item ? { ...item, image: item.image ?? item.image_url ?? '' } : item);
  const pathway = rawPathway ? { ...rawPathway, image: rawPathway.image ?? '' } : null;
  return {
    homePagePic: rawHomePagePic.map(normImage),
    boards: rawBoards.map(normImage),
    introductions: rawIntroductions.map(normImage),
    pathway,
    classes: Array.isArray(rawClasses) ? rawClasses : [],
    newsList: rawNewsList.map((n) => (n ? { ...n, primPic: n.primPic ?? n.prim_pic ?? '', images: (n.images || []).map((img) => (typeof img === 'string' ? img : img?.image_url ?? img)) } : n)),
    navItems: rawNavItems,
  };
}

/** Get single course by slug (for /class/:slug page) */
export async function fetchCourseBySlug(slug) {
  const res = await fetch(`${API_BASE}/courses/by_slug/${encodeURIComponent(slug)}/`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Course fetch failed');
  return res.json();
}

/** Get list of courses (for /class list and dashboard) */
export async function fetchCourses() {
  const res = await fetch(`${API_BASE}/courses/`);
  if (!res.ok) throw new Error('Courses list failed');
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results || []);
}

/** Get list of class sessions (for class schedule) */
export async function fetchClasses() {
  const res = await fetch(`${API_BASE}/classes/`);
  if (!res.ok) throw new Error('Classes list failed');
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results || []);
}

/** Get list of athletes (for /athlete page) */
export async function fetchAthletes() {
  const res = await fetch(`${API_BASE}/athletes/`);
  if (!res.ok) throw new Error('Athletes list failed');
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results || []);
}

/** Get list of coaches (for /coach page) */
export async function fetchCoaches() {
  const res = await fetch(`${API_BASE}/coaches/`);
  if (!res.ok) throw new Error('Coaches list failed');
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results || []);
}

/** Get list of events (for /event page) */
export async function fetchEvents() {
  const res = await fetch(`${API_BASE}/events/`);
  if (!res.ok) throw new Error('Events list failed');
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results || []);
}

/** Get list of awards (for /award page) */
export async function fetchAwards() {
  const res = await fetch(`${API_BASE}/awards/`);
  if (!res.ok) throw new Error('Awards list failed');
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results || []);
}

/** Get site contact info (single record, for Contact page) */
export async function fetchContactInfo() {
  const res = await fetch(`${API_BASE}/contactinfo/`);
  if (!res.ok) return null;
  const data = await res.json();
  const list = Array.isArray(data) ? data : (data.results || []);
  return list[0] || null;
}

// ---------- Superuser admin management ----------

export async function listAdmins() {
  const res = await authFetch(`${API_BASE}/auth/admins/`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to list admins');
  return data.admins || [];
}

export async function createAdmin(username, password) {
  const res = await authFetch(`${API_BASE}/auth/admins/`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create admin');
  return data;
}

export async function deactivateAdmin(id) {
  const res = await authFetch(`${API_BASE}/auth/admins/${id}/deactivate/`, {
    method: 'POST',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to revoke admin');
  }
}

// ---------- Dashboard auth (Token, no CSRF) ----------
export async function login(username, password) {
  const url = `${requireApiBase()}/auth/login/`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const text = await res.text();
  if (text.trimStart().startsWith('<')) {
    throw new Error(
      `Server returned HTML instead of JSON. Request was sent to: ${url}. Set VITE_API_BASE_URL on Railway superSat_FE to your superSat_BE URL and Redeploy. Open /runtime-config.js to verify.`
    );
  }
  const data = JSON.parse(text);
  if (!res.ok) throw new Error(data.detail || data.error || 'Login failed');
  saveTokenToStorage(data.token || '');
  return data;
}

export async function logout() {
  await authFetch(`${API_BASE}/auth/logout/`, { method: 'POST' });
  clearStoredToken();
}

export async function fetchMe() {
  const res = await fetch(`${API_BASE}/auth/me/`, { headers: authHeaders() });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error('Failed to get user');
  return res.json();
}

// ---------- Get Start / Try out (public submit, no login) ----------
export async function submitIntentClient(data) {
  const res = await fetch(`${API_BASE}/intentclients/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grade: data.grade?.trim() || '',
      student_name: data.student_name?.trim() || '',
      age: data.age ? Number(data.age) : null,
      phone: data.phone?.trim() || '',
      email: data.email?.trim() || '',
      zipcode: data.zipcode?.trim() || '',
    }),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.detail || result.student_name?.[0] || result.email?.[0] || 'Submit failed');
  return result;
}

// ---------- Dashboard image upload (Railway Bucket) ----------
export async function uploadImage(file) {
  const form = new FormData();
  form.append('image', file);
  const res = await authFetch(`${API_BASE}/upload/`, { method: 'POST', body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.url;
}

// ---------- Dashboard CRUD (login required) ----------
function listUrl(resource) {
  return `${API_BASE}/${resource}/`;
}
function detailUrl(resource, id) {
  return `${API_BASE}/${resource}/${id}/`;
}

export async function dashboardList(resource) {
  const res = await fetch(listUrl(resource), { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch list');
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results || []);
}

export async function dashboardCreate(resource, body) {
  const res = await authFetch(listUrl(resource), {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.error || JSON.stringify(err) || 'Create failed');
  }
  return res.json();
}

export async function dashboardUpdate(resource, id, body) {
  const res = await authFetch(detailUrl(resource, id), {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.error || JSON.stringify(err) || 'Update failed');
  }
  return res.json();
}

export async function dashboardDelete(resource, id) {
  const res = await authFetch(detailUrl(resource, id), { method: 'DELETE' });
  if (!res.ok) throw new Error('Delete failed');
}
