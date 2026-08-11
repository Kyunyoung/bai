/**
 * Supabase Client Initialization & Configuration Module
 */

(function () {
  function isBackendConfigured() {
    return !!(
      window.BAI_CONFIG &&
      typeof window.BAI_CONFIG.SUPABASE_URL === 'string' &&
      window.BAI_CONFIG.SUPABASE_URL.trim().length > 0 &&
      window.BAI_CONFIG.SUPABASE_URL.startsWith('https://') &&
      typeof window.BAI_CONFIG.SUPABASE_PUBLISHABLE_KEY === 'string' &&
      window.BAI_CONFIG.SUPABASE_PUBLISHABLE_KEY.trim().length > 0
    );
  }

  function getSupabaseClient() {
    if (!isBackendConfigured()) {
      return null;
    }
    if (window.supabaseClient) {
      return window.supabaseClient;
    }
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      window.supabaseClient = window.supabase.createClient(
        window.BAI_CONFIG.SUPABASE_URL.trim(),
        window.BAI_CONFIG.SUPABASE_PUBLISHABLE_KEY.trim(),
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true
          }
        }
      );
      return window.supabaseClient;
    }
    return null;
  }

  window.isBackendConfigured = isBackendConfigured;
  window.getSupabaseClient = getSupabaseClient;
})();
