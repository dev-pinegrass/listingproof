# Validation — September 6, 2026

Passed 12 domain tests and 4 local API tests. Initial TypeScript and application lint checks passed. Exact source offsets, invalid citations, nonverbatim quotes, missing/duplicate findings, replacement grounding, simple unit conversion, input bounds and fixture isolation are covered. Root HTTP response 200.

No live Bedrock request has been made: the existing AWS CLI session expired and interactive sign-in is pending. No live model accuracy score is claimed. No browser visual or interaction QA was requested or performed. Optional WebMCP read-back tool lacks a supported validation context in this run.

Installation reported 11 dependency advisories (1 low, 2 moderate, 8 high). No automatic breaking upgrades applied. The stock UI catalog is retained. Review dependencies before broader access.

The private preview is a fixture demonstration until server-side Bedrock access is configured. Model citations prove provenance only, not semantic correctness; all findings require human review.

Live follow-up: AWS Nova Lite returned the expected classification on 20/20 development-authored synthetic cases using the app's exact prompt and shared validator. This is not independent accuracy measurement. The scoped Lambda backend returned 401 without authentication and 200 with real model output for an authorized synthetic request. Root credentials were not stored in the hosted app.

Full app endpoint check: local Sites route -> scoped AWS Lambda -> Nova Lite -> shared validator returned real Bedrock results. One initial sample response abstained on equivalent capacity; a follow-up exposed model variability. A deterministic path now resolves whole, unambiguous capacity/pack lines only. Compound claims and conflicting source quantities remain conservative. Nineteen local tests pass after this change.
