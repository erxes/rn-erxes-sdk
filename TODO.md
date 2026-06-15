# TODO

## GitHub enhancements (deferred)

Done already: Dependabot (`.github/dependabot.yml`), npm publish provenance
(`--provenance` in `publish.yml`), categorized release notes (`.github/release.yml`).

To add later:

### Quick wins
- [ ] **CodeQL code scanning** — free static security analysis on every PR/push; results in the Security tab.
- [ ] **README badges** — npm version, downloads, license, CI status.
- [ ] **`workflow_dispatch` on `publish.yml`** — manual "Run workflow" button to publish/re-run without cutting a GitHub Release.

### Security & quality
- [ ] **Branch protection on `main`** — require passing CI before merge (more useful once changes flow through PRs).

### Contributor experience
- [ ] **Issue & PR templates** — structured bug/feature forms + PR checklist.
- [ ] **`CODEOWNERS`** — auto-request reviewers on PRs.

### CI efficiency
- [ ] **`concurrency` block** in workflows — auto-cancel superseded runs.

### Optional
- [ ] **`.github/FUNDING.yml`** — sponsor button (if relevant to erxes).
