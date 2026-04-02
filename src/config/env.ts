/**
 * Environment variable access
 * All VITE_* env vars are accessed through this module.
 */

export const ENV = {
  API_BASE_URL: (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8080',
  BASE_URL: import.meta.env.BASE_URL as string,
} as const;

// #region agent log
fetch('http://127.0.0.1:7888/ingest/1fef7b94-9655-4bda-96fd-3a82377cd632',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'adb972'},body:JSON.stringify({sessionId:'adb972',runId:'runtime-debug',hypothesisId:'H3,H4',location:'src/config/env.ts:11',message:'Resolved client env',data:{apiBaseUrl:ENV.API_BASE_URL,baseUrl:ENV.BASE_URL,hasApiUrl:Boolean(import.meta.env.VITE_API_URL)},timestamp:Date.now()})}).catch(()=>{});
// #endregion
