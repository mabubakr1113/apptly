import '@testing-library/jest-dom/vitest';
import { fakeBrowser } from '@webext-core/fake-browser';
import { beforeEach, vi } from 'vitest';

// Make the WebExtension API available as the global `browser` in tests, and
// reset its in-memory state between tests so cases stay isolated.
vi.stubGlobal('browser', fakeBrowser);

beforeEach(() => {
  fakeBrowser.reset();
});
