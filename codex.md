# Global AI / Code Codex

## Purpose
This document defines how AI (and humans) should think, plan, write, and implement code and content across projects.

It prioritizes:
- clarity
- quality
- maintainability
- calm, structured progress

Over:
- speed
- cleverness

---

## 1. Development Philosophy

### Core Principles

**Single Responsibility**  
Work on one feature, task, or idea at a time. Finish it properly before moving on.

**Clarity First**  
Do not implement anything unless at least 95% of the intent and constraints are understood.

**Quality Over Speed**  
Prefer clean, modular, maintainable solutions over fast or hacky ones.

**Incremental Progress**  
Build in small, verifiable steps. Each step must make sense on its own.

**Calm Systems Beat Clever Tricks**  
Avoid unnecessary complexity, abstraction, or over-engineering.

---

## 2. General Code Standards

### Consistency
- Follow existing project structure, naming, and conventions
- Never introduce a second way of solving the same problem

### Security
- Never expose secrets, API keys, tokens, credentials, or private URLs
- Treat environment variables as mandatory for sensitive values

### Testing & Verification
- Verify changes before considering a task complete
- Prefer simple sanity checks over theoretical correctness

### Documentation
- Update relevant documentation after completing a feature
- Code without explanation is considered incomplete

### Dependencies
- Use latest stable versions only
- Avoid deprecated or abandoned packages
- Prefer fewer dependencies over many small ones

---

## 3. Frontend & Framework Rules

### React / JSX
- Always escape quotes using `&quot;`
- Components must remain readable at a glance
- Avoid deeply nested JSX structures

### TypeScript
- Never use `any`
- Always define explicit types or interfaces
- Prefer strict typing even if it requires more initial work

### Tailwind CSS
- Use correct version syntax (v4 vs v3)
- Verify documentation before implementation
- Prefer semantic utility groupings over long unreadable class chains

---

## 4. Version & Dependency Management
- Always verify latest stable version before installing or upgrading
- Avoid alpha, beta, or RC versions unless explicitly required
- Prioritize security updates
- Do not upgrade dependencies mid-feature unless necessary

---

## 5. Development Workflow

### Planning Phase
- Break complex tasks into small, manageable steps
- Create TODO lists for multi-step work
- Identify unknowns before coding

### Implementation Phase
- Study existing patterns before writing new code
- Reuse utilities and components whenever possible
- Implement the smallest viable version first

### Review Phase
- Re-read the solution from a beginner’s perspective
- Remove anything unnecessary
- Confirm the solution matches the original intent

---

## 6. Content & Writing Rules

### Tone of Voice
- Clear, human, calm, and direct
- No fluff, no hype, no forced enthusiasm
- Prefer clarity over marketing language

### Structure
- Short paragraphs
- Clear headings
- Logical flow

### Quality Bar
- Every sentence must earn its place
- If something can be simpler, it should be
- Avoid repetition unless intentional

---

## 7. Decision-Making Rules
- If unsure, pause and clarify
- If multiple options exist, explain trade-offs
- Never guess silently
- Explicit assumptions are always better than hidden ones

---

## 8. AI Collaboration Rules

When acting as an assistant:
- Ask clarifying questions only when necessary
- Prefer proposing a solid default over endless options
- Be honest if something is a bad idea
- Optimize for long-term usability, not short-term impressiveness

---

## 9. Red Flags (Avoid at All Costs)
- Over-engineering
- Premature abstraction
- Copy-pasting without understanding
- “We’ll clean it later”
- Shiny tools without real benefit

---

## 10. Completion Rule

Done is better than perfect.

- If the solution meets the requirements, it is complete
- Do not repeatedly rework finished features without clear reason

---

## 11. Living Document

This codex evolves over time.

It should adapt to:
- new tools
- new workflows
- better understanding

All changes must simplify, not complicate.

---

## End of Codex
