# Contributing to Apptly

Apptly is built **module by module**. Every change is feature-branched, reviewed, and passes CI before it reaches `main`.

## Branching model

- **`main`** - always releasable. Protected: no direct pushes; changes land only via reviewed, green PRs.
- **Feature branches** - one branch per module/feature, branched off the latest `main`:
  - `feat/m0-scaffold`
  - `feat/m1-profile-storage`
  - `feat/m2-llm-layer`
  - `feat/m3-resume-parsing`
  - ... one per module through `feat/m11-backend`
- **Other prefixes:** `fix/<slug>`, `chore/<slug>`, `docs/<slug>`, `refactor/<slug>`.

```
git switch main
git pull
git switch -c feat/mN-short-slug
# ...work...
git push -u origin feat/mN-short-slug
```

## Pull requests

1. Open a PR into `main`. Fill out the PR template (what/why, module, screenshots, test notes).
2. Keep PRs scoped to a single module/feature so they stay reviewable.
3. **Critical code check (required before merge):**
   - CI is green: typecheck, lint, tests, and build all pass.
   - A code review has been completed and findings addressed. In Claude Code this is `/code-review` (use `high` or `ultra` for security/PII-touching modules).
   - The module's **Verify** steps have been performed and noted in the PR.
4. **Merge:** use a regular merge commit (no squash); delete the branch after merge.

## Review focus per module

- **Security/PII modules** (profile storage, LLM layer, resume parsing, backend): run the security review (`/security-review`) in addition to the standard code review. Never log or transmit PII outside the user's chosen provider; never commit secrets.
- **Content-script modules** (detection, filler, adapters): review for resilient selectors and fail-soft behavior.

## Commits

- Conventional-style messages: `feat(m1): add Profile zod schema`, `fix(filler): dispatch input event for React controls`.
- No secrets, API keys, resumes, or other PII in the repo or git history.
