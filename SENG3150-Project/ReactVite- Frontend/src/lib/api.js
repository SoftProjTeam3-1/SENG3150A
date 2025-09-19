// // Centralized API fetch helper
// // - Automatically attaches Authorization: Bearer <accessToken>
// // - Sends credentials: 'include' so refresh cookie is sent when needed
// // - JSON request/response convenience
// // - Retries once on 401 by attempting /api/auth/refresh

// import { getAccessToken, setAccessTokenExternal } from '../components/Auth/AuthProvider';

// function buildHeaders(extra = {}) {
//   const token = getAccessToken();
//   return {
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     ...extra,
//   };
// }

// async function parseResponse(res) {
//   const ct = res.headers.get('content-type') || '';
//   if (res.status === 204) return null;
//   if (ct.includes('application/json')) return res.json();
//   return res.text();
// }

// async function refreshTokenOnce() {
//   try {
//     const res = await fetch('/api/auth/refresh', {
//       method: 'POST',
//       credentials: 'include',
//     });
//     if (!res.ok) return null;
//     const data = await res.json();
//     if (data && data.accessToken) {
//       // update shared token immediately for this tab
//       setAccessTokenExternal(data.accessToken);
//       return data.accessToken;
//     }
//   } catch (err) { 
//     // swallow network/parse errors during refresh attempt
//     void err; 
//     return null; 
//   }
//   return null;
// }

// /**
//  * apiFetch
//  * @param {string} url
//  * @param {RequestInit & { json?: any, retryOn401?: boolean }} options
//  */
// export async function apiFetch(url, options = {}) {
//   const {
//     headers = {},
//     json,
//     retryOn401 = true,
//     credentials = 'include',
//     ...rest
//   } = options;

//   const init = { ...rest, credentials };
//   init.headers = buildHeaders(headers);

//   if (json !== undefined) {
//     init.method = init.method || 'POST';
//     init.headers = {
//       'Content-Type': 'application/json',
//       ...init.headers,
//     };
//     init.body = JSON.stringify(json);
//   }

//   let res = await fetch(url, init);
//   if (res.status === 401 && retryOn401) {
//     const refreshed = await refreshTokenOnce();
//     if (refreshed) {
//       // Retry once with updated token
//       const retryInit = { ...init, headers: buildHeaders(headers) };
//       res = await fetch(url, retryInit);
//     }
//   }

//   if (!res.ok) {
//     // Bubble up non-OK responses with parsed payload
//     const errPayload = await parseResponse(res).catch(() => null);
//     const e = new Error(`HTTP ${res.status}`);
//     e.status = res.status;
//     e.payload = errPayload;
//     throw e;
//   }

//   return parseResponse(res);
// }

// export const api = {
//   get: (url, opts = {}) => apiFetch(url, { ...opts, method: 'GET' }),
//   post: (url, body, opts = {}) => apiFetch(url, { ...opts, method: 'POST', json: body }),
//   put: (url, body, opts = {}) => apiFetch(url, { ...opts, method: 'PUT', json: body }),
//   delete: (url, body, opts = {}) => apiFetch(url, { ...opts, method: 'DELETE', json: body }),
// };
