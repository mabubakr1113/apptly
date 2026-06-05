import { defineWorkspace } from 'vitest/config';

// Each package supplies its own vitest config (node env for shared,
// happy-dom + WXT fake-browser for the extension).
export default defineWorkspace(['shared', 'extension']);
