1. install sbx
2. `sbx login`
3. `sbx secret set -g github -t "$(gh auth token)"`
4. `sbx run claude` -> login
5. (remove all containers so far -> credentials are not being injected)

PRD/Specification should be a chunk that can each be a PR.
If that PR feels is going to be too big, break it down into several sub specs.
