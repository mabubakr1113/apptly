/** Thrown for any non-success API response (and for a missing auth token). */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type TsRestErrorBody = { error?: { code?: string; message?: string } };
type TsRestErrorResponse = { status: number; body: TsRestErrorBody };

const isTsRestErrorResponse = (err: unknown): err is TsRestErrorResponse =>
  typeof err === 'object' &&
  err !== null &&
  'status' in err &&
  typeof (err as { status?: unknown }).status === 'number' &&
  'body' in err;

/** Human-friendly message for an unknown thrown value (used by toast/error UI). */
export const messageForError = (err: unknown): string => {
  if (err instanceof ApiError) {
    if (err.code === 'no_token' || err.status === 401) return 'Please sign in again.';
    return err.message;
  }
  if (isTsRestErrorResponse(err)) {
    if (err.status === 401 || err.body.error?.code === 'no_token') return 'Please sign in again.';
    return err.body.error?.message ?? `Request failed (${err.status})`;
  }
  if (err instanceof Error && err.message) return err.message;
  return 'Could not reach the server. Please try again.';
};
