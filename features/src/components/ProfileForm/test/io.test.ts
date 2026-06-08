import { afterEach, describe, expect, it, vi } from 'vitest';
import { downloadProfileJson, readProfileJson } from '@apptly/features/components/ProfileForm/io';

const VALID = {
  fullName: 'Ada Lovelace',
  email: 'ada@example.com',
  links: {},
  workHistory: [],
  education: [],
  skills: ['Math'],
  eeo: { gender: 'decline', race: 'decline', veteranStatus: 'decline', disabilityStatus: 'decline' },
  customQA: [],
  documentRefs: [],
};

const fileOf = (text: string) => ({ text: async () => text }) as File;

afterEach(() => vi.restoreAllMocks());

describe('readProfileJson', () => {
  it('parses and validates a well-formed export', async () => {
    const profile = await readProfileJson(fileOf(JSON.stringify(VALID)));
    expect(profile.fullName).toBe('Ada Lovelace');
    expect(profile.skills).toEqual(['Math']);
  });

  it('rejects non-JSON', async () => {
    await expect(readProfileJson(fileOf('not json'))).rejects.toThrow(/not valid JSON/i);
  });

  it('rejects JSON that is not a valid profile', async () => {
    await expect(readProfileJson(fileOf('{"fullName":""}'))).rejects.toThrow(/valid Apptly profile/i);
  });
});

describe('downloadProfileJson', () => {
  it('builds an object URL and clicks a download anchor', () => {
    const click = vi.fn();
    const createUrl = vi.fn(() => 'blob:x');
    const revokeUrl = vi.fn();
    vi.stubGlobal('URL', { createObjectURL: createUrl, revokeObjectURL: revokeUrl });
    vi.spyOn(document, 'createElement').mockReturnValue({ click } as unknown as HTMLAnchorElement);

    downloadProfileJson(VALID as never, 'me.json');

    expect(createUrl).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(revokeUrl).toHaveBeenCalledWith('blob:x');
  });
});
