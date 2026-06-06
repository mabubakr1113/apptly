/** Typed react-query key factory — the single source of cache keys. */
export const queryKeys = {
  profile: ['profile'] as const,
  applications: ['applications'] as const,
  documents: ['documents'] as const,
};
