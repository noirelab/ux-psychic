# UX-PSYCHIC

Predict hesitation, not minds. A behavioral UX skill for AI coding agents that audits, redesigns, and implements ethical product flows — without dark patterns.

## What it does

UX-PSYCHIC analyzes your product through six behavioral lenses:

| Lens | Focus |
|------|-------|
| **Smart defaults** | Reduce blank-state decisions with safe, reversible defaults |
| **Honest momentum** | Show real progress; never fabricate completion |
| **Value before gates** | Give value before asking for signup, payment, or permissions |
| **User investment** | Let users create meaningful work before commitment |
| **Truthful consequences** | Frame real consequences neutrally; no threats or confirmshaming |
| **Transparent contrast** | Honest price comparisons with totals, cadence, and assumptions |

## Modes

The skill operates in four modes inferred from your request:

1. **Audit** — diagnose friction, return prioritized recommendations
2. **Redesign** — produce a concrete flow, copy, and interaction spec
3. **Implement** — inspect the codebase and make changes directly
4. **Review** — evaluate a diff or implementation for regressions

## Install

### From npm (recommended)

```bash
npm install ux-psychic
```

Postinstall copies the skill to `.claude/skills/`, `.agents/skills/`, and `.opencode/skills/` in your project.

### CLI

```bash
npx ux-psychic             # install to current project
npx ux-psychic -g          # install globally (user-level)
npx ux-psychic uninstall   # remove from project
npx ux-psychic status      # check installation
npx ux-psychic --dry       # preview without changes
```

### Manual

```bash
mkdir -p .claude/skills .agents/skills .opencode/skills
cp -R ux-psychic .claude/skills/
cp -R ux-psychic .agents/skills/
cp -R ux-psychic .opencode/skills/
```

## Usage

```
/ux-psychic audite o checkout e implemente as melhorias
/ux-psychic analise o fluxo de onboarding
/ux-psychic revise a experiência de cadastro
```

Works with **OpenCode**, **Claude Code**, and **Codex**.

## Dark-pattern firewall

The skill explicitly rejects:
- Fake progress, activity, scarcity, or countdowns
- Confirmshaming ("No, I prefer to fail", "I'll risk it")
- Hidden cancellation or forced continuity
- Preselected paid add-ons or consent
- Misleading anchors, hidden fees, or decoy pricing
- Withholding computed results to capture leads

## Structure

```
SKILL.md                      # Main skill definition
references/principles.md      # Detailed behavioral UX guide
references/audit-scorecard.md # Systematic audit scorecard
agents/openai.yaml            # Codex interface config
scripts/install.js            # Install/uninstall CLI
```

## License

MIT
