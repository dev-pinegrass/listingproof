# Judge walkthrough

ListingProof is an individual AI Builders entry by Fatima Farhana Sheikh, created September 6, 2026 with Codex assistance. The hosted prototype is currently private; judging access must be granted before submitting its URL as a working demo.

## Run locally without credentials

Use Node 22.13+ and npm. Run `npm ci`, then `npm run dev -- --port 3102`. Open http://localhost:3102. Use the built-in sample and select fixture preview. This is explicitly synthetic, with no AI invocation. Editing the sample invalidates fixture mode.

Expected sample findings: contradicted material, unsupported organic certification, supported equivalent capacity, contradicted pack count. Inspect the exact source quote for each grounded result. Select reviewed revisions and export the JSON receipt. Manual changes to the draft are not reverified.

## Demonstrate real AI

Configure the server-only backend connection described in ../aws-backend/README.md and restart the server. Select live Bedrock analysis. Confirm that the report identifies Bedrock rather than fixture mode. Try one factual assertion per line. Missing evidence should lead to abstention. Model wording can vary; citations must refer to exact input text.

## Boundaries

The model reads only the supplied text. The app does not fetch supplier documents, certify products, update listings, or verify manual edits. Exports include submitted text and should be shared only when appropriate. Live requests consume AWS resources.
