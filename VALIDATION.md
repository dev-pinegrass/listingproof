# Validation — September 6, 2026

Current implementation: 15 domain tests and 4 local HTTP tests pass. TypeScript, application lint and production build passed. Coverage includes source offsets, invalid citations, nonverbatim quotes, missing/duplicate findings, grounded replacements, quantities, compound claims, conflicting sources, input limits and fixture isolation.

Live evidence: 20/20 development-authored synthetic reference classifications matched Nova Lite output using the application prompt and shared validator. This was not blind or independent; evaluation/results.json records the initial run. Subsequent full local API -> scoped Lambda -> Nova Lite -> validator testing succeeded. An initial quantity abstention motivated a narrow deterministic quantity path; the 20-case record predates that change.

The backend rejected an unauthenticated request with 401 and returned actual model output with server authentication. The private hosted app was deployed with backend secrets configured. No AWS root credentials are stored in hosted services.

No browser visual or interaction QA was requested or performed. Deployment success and local HTTP testing do not establish hosted browser end-to-end behavior. Optional WebMCP read-back lacks a supported validation context in this run.

Installation reported 11 dependency advisories (1 low, 2 moderate, 8 high). No automatic breaking upgrades applied. Exact provenance is not semantic correctness; every output needs human review.
