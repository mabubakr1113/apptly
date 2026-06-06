import { apptlyContract } from '@apptly/shared';
import { initTsrReactQuery } from '@ts-rest/react-query/v5';
import { createApiFetcher } from '@apptly/features/lib/api/runtime';

export const tsr = initTsrReactQuery(apptlyContract, {
  baseUrl: '',
  api: createApiFetcher(),
  validateResponse: true,
});
