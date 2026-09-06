# ListingProof

Fresh AI Builders Hackathon project created September 6, 2026. Individual entrant project; no prior competition source imported. React/Vinext and the Sites starter are disclosed dependencies. Code was developed with Codex assistance.

## Product

Paste one factual claim per line and one supplier specification per line. Bedrock classifies claims; deterministic validation rejects nonexistent citations and nonverbatim quotes. Simple ml/l and pack-count conflicts override a model's support finding. Review each finding to assemble an editable draft and export a JSON receipt with input text, spans, model metadata and reviewed claim IDs.

No marketplace login, posting, source fetching, or stored customer database. Reports live in the current page session until exported. Inputs are sent to Bedrock for live analysis. The UI never publishes anything.

## Development

Node 22.13+, npm. `npm ci` then `npm run dev -- --port 3102`.

No credentials are required for the built-in fixture preview or default tests. For live analysis, put BEDROCK_BACKEND_URL and BEDROCK_BACKEND_TOKEN in an ignored .dev.vars file; see [backend setup](aws-backend/README.md). Alternatively configure the direct server-only AWS settings from .env.example. Temporary AWS tokens expire. Never commit credentials. The hosted prototype uses a Lambda execution role scoped to Nova Lite, with AWS-managed credential rotation.

Fixture preview is explicitly synthetic and accepts only the exact built-in sample. It does not call AI and will reject edited input. Missing Bedrock access produces an error, never a silent fixture fallback.

## Validation

`node --experimental-strip-types --test tests/review.test.mjs`

With local server running: `node --experimental-strip-types --test tests/http.test.mjs`

`npx tsc --noEmit`, `npx oxlint app lib`, and `npm run build`.

## Limits

Exact source provenance does not prove a model's semantic conclusion. A source may be incorrect. Numeric checks cover simple volume and pack expressions only, not every unit, range, or composite claim. Each line should contain one factual claim. All outputs need human review; this is not product or legal certification. Manual draft edits are not reverified. The initial live evaluation matched 20/20 development-authored synthetic cases; this was not a blind or independent benchmark. See [evaluation notes](evaluation/README.md).

Hackathon rules impose no AI provider requirement. Bedrock was selected to use the existing AWS ecosystem. See HACKATHON.md for submission requirements and deadlines.

## Hosted Bedrock connection

The private hosted app uses the scoped Lambda backend documented in aws-backend/README.md. For local full-flow testing, put BEDROCK_BACKEND_URL and BEDROCK_BACKEND_TOKEN in ignored .dev.vars. Never commit that file. The direct temporary Bedrock-token path remains available for development.
