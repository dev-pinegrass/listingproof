# AI Builders — ListingProof

Status: individual registration verified; fresh project proposed.

## Requirement summary

Create the project during the event, beginning August 21. Deadline: September 16, 8:30 AM IST. Deliver a working AI product, public source/setup instructions, project description, team details, documentation, a demo up to five minutes and a presentation up to ten slides. The organizer confirms founders/developers may enter despite the student-only display error. The September update makes Discord membership and an introduction mandatory. [Rules](https://ai-builders-hackathon-2026.devpost.com/rules) · [Requirements](https://ai-builders-hackathon-2026.devpost.com/) · [Update](https://ai-builders-hackathon-2026.devpost.com/updates/46223-join-the-ai-builders-hackathon-discord)

## Product proposal

A seller pastes a draft product listing and a supplier specification. ListingProof splits the listing into factual claims and identifies whether each is supported, contradicted or unsupported by the supplied evidence. It produces an editable revision with source references, without inventing certifications or performance claims.

This is an evidence-checking writing tool, not a legal-compliance certification service. It must abstain when the provided documents are insufficient. All demonstration product data is synthetic and individually created for this entry.

Minimum flow: two text inputs → claim extraction → source matching → deterministic numeric checks → evidence report → reviewed revision → export. Start with pasted text, not OCR, PDFs, marketplace login or automatic publishing.

Proposed architecture: a small web app, server-only model adapter, source segmentation with stable IDs, structured claim schema, deterministic quantities/units checks and an exportable report. Choose model/provider after checking available accounts. A fake model path must be visibly called a fixture preview.

## Ordered build tasks

- [ ] Create a new dated repository with standalone ownership/provenance records.
- [ ] Define claim, source, finding and proposed revision schemas.
- [ ] Build the five seed fixtures; expand to 20 held-out examples before scoring.
- [ ] Implement source-span validation so invented citations are rejected.
- [ ] Add structured model extraction and supported/contradicted/unsupported classifications.
- [ ] Add unit normalization and explicit handling of missing specifications.
- [ ] Present original text and revised wording side by side, with approval for each edit.
- [ ] Run a blind comparison with manual review and document disagreements.
- [ ] Produce a downloadable report and a clean, judge-accessible demo.

## Acceptance targets

On the seed cases: 5/5 correct classifications and no invented source IDs. On the later 20-case evaluation: target at least 90% classification agreement with a manually labeled reference. Measure precision on unsupported-claim flags separately from recall. These are proposed thresholds, not results. Fail visibly on provider errors; never show unverified output as approved.

## Demo outline — target 4:00

0:00–0:30: seller's draft contains a subtle material or quantity mismatch.
0:30–1:30: analyze; inspect exact evidence for the contradiction.
1:30–2:20: show an unsupported certification and an abstention.
2:20–3:00: accept a grounded revision and export the report.
3:00–3:40: explain architecture and show measured evaluation.
3:40–4:00: limitations and next iteration.

## Ten-slide content outline

1. Problem and intended user.
2. Concrete before/after example.
3. End-to-end workflow.
4. Evidence model and classification contract.
5. AI role versus deterministic checks.
6. Architecture and implementation.
7. Evaluation design and measured results.
8. User experience and feedback.
9. Limitations, errors and lessons.
10. Working demo, source and next steps.

## Submission assembly

- [ ] Verify Discord membership; post the prepared introduction only with explicit sending authorization or let the user post it.
- [ ] Fresh commit history beginning September 6; disclose all dependencies and generated assistance.
- [ ] Public repository and clear setup/model configuration instructions.
- [ ] Working demo; English documentation; <=5-minute video; <=10-slide deck.
- [ ] Individual entrant and contributor details are accurate.
- [ ] Retain judging access through September 20; scheduled results September 25.

Do not import TenderLoop or company assets as the entry. Registration does not by itself determine ownership of submitted work. First milestone: five cases produce a traceable report using fixture outputs, followed by real-model verification.
