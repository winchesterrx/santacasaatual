/**
 * Cache de cliente com localStorage + in-memory
 * Estratégia: Stale-While-Revalidate
 *  - Retorna dados do cache instantaneamente (se existir)
 *  - Atualiza em background automaticamente após TTL
 */

const CACHE_PREFIX = "sc_cache_";
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutos

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Cache em memória (mais rápido que localStorage para acessos repetidos na mesma sessão)
const memoryCache = new Map<string, CacheEntry<any>>();

function isExpired(entry: CacheEntry<any>): boolean {
  return Date.now() - entry.timestamp > entry.ttl;
}

/** Lê do cache em memória ou localStorage */
export function cacheGet<T>(key: string): T | null {
  const fullKey = CACHE_PREFIX + key;

  // 1. Tenta memória primeiro (mais rápido)
  const mem = memoryCache.get(fullKey);
  if (mem) return mem.data as T;

  // 2. Tenta localStorage
  try {
    const raw = localStorage.getItem(fullKey);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    // Carrega de volta na memória
    memoryCache.set(fullKey, entry);
    return entry.data;
  } catch {
    return null;
  }
}

/** Salva no cache em memória e localStorage */
export function cacheSet<T>(key: string, data: T, ttl = DEFAULT_TTL_MS): void {
  const fullKey = CACHE_PREFIX + key;
  const entry: CacheEntry<T> = { data, timestamp: Date.now(), ttl };
  memoryCache.set(fullKey, entry);
  try {
    localStorage.setItem(fullKey, JSON.stringify(entry));
  } catch {
    // localStorage cheio — limpa entradas antigas
    clearOldEntries();
  }
}

/** Verifica se a entrada está expirada */
export function cacheIsStale(key: string): boolean {
  const fullKey = CACHE_PREFIX + key;
  const mem = memoryCache.get(fullKey);
  if (mem) return isExpired(mem);
  try {
    const raw = localStorage.getItem(fullKey);
    if (!raw) return true;
    const entry: CacheEntry<any> = JSON.parse(raw);
    return isExpired(entry);
  } catch {
    return true;
  }
}

/** Invalida uma chave (ex: após salvar no admin) */
export function cacheInvalidate(key: string): void {
  const fullKey = CACHE_PREFIX + key;
  memoryCache.delete(fullKey);
  try { localStorage.removeItem(fullKey); } catch { /* noop */ }
}

/** Remove entradas antigas do localStorage */
function clearOldEntries(): void {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
    keys.forEach(k => {
      try {
        const entry: CacheEntry<any> = JSON.parse(localStorage.getItem(k) || "{}");
        if (isExpired(entry)) localStorage.removeItem(k);
      } catch {
        localStorage.removeItem(k);
      }
    });
  } catch { /* noop */ }
}

/**
 * Wrapper principal: Stale-While-Revalidate
 * - Se tem cache (mesmo expirado): retorna imediatamente
 * - Se expirado: dispara atualização em background
 * - Se não tem cache: busca normalmente e salva
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = DEFAULT_TTL_MS
): Promise<T> {
  const cached = cacheGet<T>(key);
  const stale = cacheIsStale(key);

  if (cached !== null) {
    // Tem dados — retorna imediatamente
    if (stale) {
      // Expirado: atualiza em background sem bloquear a UI
      fetcher().then(fresh => cacheSet(key, fresh, ttl)).catch(() => { /* silencioso */ });
    }
    return cached;
  }

  // Sem cache — busca e salva
  const fresh = await fetcher();
  cacheSet(key, fresh, ttl);
  return fresh;
}
