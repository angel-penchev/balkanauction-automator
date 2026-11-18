# Agents

The skills for this repository are in `.agents/skills`. Claude Code reads them
through `.claude/skills`. They come from
[qoax-agent-skills](https://github.com/qoax-community/qoax-agent-skills), and
`skills-lock.json` pins them. Do not edit them here. Change a skill in
qoax-agent-skills, then run
`DISABLE_TELEMETRY=1 npx skills@1.7.3 update -p -y` on a computer that has a
`~/.claude` directory.

Each `.claude/skills/<name>` is a symbolic link. On Windows, turn on Developer
Mode and clone with `git clone -c core.symlinks=true`. Without the links,
Claude Code loads none of the skills. The
[qoax-agent-skills README](https://github.com/qoax-community/qoax-agent-skills#symbolic-links)
shows how to repair a clone.

## Web guidance

The `modern-web-guidance` skill gives guidance for HTML, CSS and client-side
JavaScript. It runs the `modern-web-guidance` CLI with npx. The
`chrome-extensions` skill gives guidance for Chrome extensions. Code must also
work in the Firefox build.

- The `modern-web-guidance` skill needs Node 22 or later and access to
  registry.npmjs.org.
- Use the CLI version that the `modern-web-guidance` skill names.
- Do not run these commands of the `modern-web-guidance` CLI: `install`,
  `update`, `uninstall`, `set-baseline`, `set-allow-origin-trials` and
  `set-allow-volatile-features`.
- Do not install a `modern-web-guidance` plugin from another marketplace
  for this repository.

**Browser Support:** Chrome 111 or later and Firefox 128 or later. The
extension uses Manifest V3 and has one build for each browser
(`vite.config.chrome.ts` and `vite.config.firefox.ts`). These are the oldest
versions that Tailwind CSS 4 supports. `manifest.json` sets no minimum
version.
