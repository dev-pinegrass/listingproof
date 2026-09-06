'use client';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { registerReviewReader } from '@/lib/webmcp';
import { sample, type Report } from '@/lib/review';
export default function Page() {
  const [listing, setListing] = useState(sample.listing),
    [source, setSource] = useState(sample.source),
    [report, setReport] = useState<Report | null>(null),
    [accepted, setAccepted] = useState<string[]>([]),
    [revision, setRevision] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [configured, setConfigured] = useState(false);
  useEffect(() => {
    fetch('/api/analyze')
      .then((r) => r.json() as Promise<{ configured: boolean }>)
      .then((d) => setConfigured(d.configured))
      .catch(() => setError('Could not check service connection.'));
  }, []);
  const currentReview = useRef<unknown>(null);
  useEffect(() => {
    currentReview.current = {
      report,
      acceptedClaimIds: accepted,
      reviewedRevision: revision,
    };
  }, [report, accepted, revision]);
  useEffect(() => registerReviewReader(() => currentReview.current), []);
  function edit(which: 'listing' | 'source', value: string) {
    if (which === 'listing') setListing(value);
    else setSource(value);
    setReport(null);
    setAccepted([]);
    setRevision('');
  }
  async function analyze(mode: 'fixture' | 'bedrock') {
    setBusy(true);
    setError('');
    setReport(null);
    setAccepted([]);
    setRevision('');
    try {
      const r = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing, source, mode }),
      });
      const d = (await r.json()) as Report & { error?: string };
      if (!r.ok) throw Error(d.error);
      setReport(d);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function select(id: string, checked: boolean) {
    const next = checked ? [...accepted, id] : accepted.filter((x) => x !== id);
    setAccepted(next);
    setRevision(
      report?.findings
        .filter((f) => next.includes(f.claimId) && f.replacement)
        .map((f) => f.replacement)
        .join('\n') || '',
    );
  }
  return (
    <main>
      <header>
        <strong>
          Listing<span>Proof</span>
          <sup>↗</sup>
        </strong>
        <p>PRODUCT CLAIM REVIEW</p>
        <small>
          {configured
            ? 'AWS Bedrock connected'
            : 'Bedrock setup pending · fixture available'}
        </small>
      </header>
      <div className="intro">
        <div>
          <p className="eyebrow">BEFORE YOU PUBLISH</p>
          <h1>
            Good listings start
            <br />
            with better evidence.
          </h1>
        </div>
        <p>
          Check each claim against your supplier’s words.
          <br />
          Keep what holds up. Review what doesn’t.
        </p>
      </div>
      <div className="inputgrid">
        <section>
          <div className="sectionhead">
            <label htmlFor="listing">01 / Your listing</label>
            <span>One factual claim per line</span>
          </div>
          <Textarea
            id="listing"
            value={listing}
            onChange={(e) => edit('listing', e.target.value)}
            maxLength={8000}
            disabled={busy}
          />
          <small>{listing.length} / 8,000 characters</small>
        </section>
        <section>
          <div className="sectionhead">
            <label htmlFor="source">02 / Supplier evidence</label>
            <span>One specification per line</span>
          </div>
          <Textarea
            id="source"
            value={source}
            onChange={(e) => edit('source', e.target.value)}
            maxLength={12000}
            disabled={busy}
          />
          <small>Missing evidence will remain unsupported.</small>
        </section>
      </div>
      <div className="toolbar">
        <Button
          disabled={busy || !listing.trim() || !configured}
          onClick={() => analyze('bedrock')}
        >
          {busy ? 'Reviewing…' : 'Review with Bedrock →'}
        </Button>
        <Button
          variant="outline"
          disabled={
            busy || listing !== sample.listing || source !== sample.source
          }
          onClick={() => analyze('fixture')}
        >
          Try fixture preview
        </Button>
        <Button
          variant="ghost"
          disabled={busy}
          onClick={() => {
            edit('listing', sample.listing);
            setSource(sample.source);
          }}
        >
          Reset sample
        </Button>
        <span>Nothing is published automatically.</span>
      </div>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {report ? (
        <>
          <div className="reporthead">
            <div>
              <p className="eyebrow">
                {report.mode === 'fixture'
                  ? 'SYNTHETIC FIXTURE · NO MODEL CALL'
                  : 'BEDROCK ANALYSIS · HUMAN REVIEW REQUIRED'}
              </p>
              <h2>Your evidence review</h2>
            </div>
            <div className="counts">
              {(['supported', 'contradicted', 'unsupported'] as const).map(
                (s) => (
                  <span key={s} className={s}>
                    <b>
                      {report.findings.filter((f) => f.status === s).length}
                    </b>
                    {s}
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="reviewgrid">
            <div>
              {report.findings.map((f) => (
                <article key={f.claimId} className="finding">
                  <div className="sectionhead">
                    <span className={'badge ' + f.status}>{f.status}</span>
                    <code>{f.claimId}</code>
                  </div>
                  <h3>{report.claims.find((c) => c.id === f.claimId)?.text}</h3>
                  <p>{f.reason}</p>
                  {f.sourceId && (
                    <blockquote>
                      <small>{f.sourceId} · Exact source span</small>
                      {f.quote}
                    </blockquote>
                  )}
                  {f.numericCheck && (
                    <p className="numeric">Quantity check: {f.numericCheck}</p>
                  )}
                  <div className="accept">
                    <Checkbox
                      id={'accept-' + f.claimId}
                      checked={accepted.includes(f.claimId)}
                      onCheckedChange={(c) => select(f.claimId, c === true)}
                    />
                    <label htmlFor={'accept-' + f.claimId}>
                      {f.replacement
                        ? 'Include ' +
                          (f.status === 'supported'
                            ? 'original claim'
                            : 'source wording')
                        : 'Acknowledge and omit unsupported claim'}
                    </label>
                  </div>
                </article>
              ))}
            </div>
            <aside>
              <p className="eyebrow">03 / YOUR REVIEWED DRAFT</p>
              <h2>
                Keep the words
                <br />
                you can stand behind.
              </h2>
              <p>Select findings to assemble a draft, then edit it here.</p>
              <Textarea
                aria-label="Reviewed listing"
                value={revision}
                onChange={(e) => setRevision(e.target.value)}
                placeholder="Review a finding to begin…"
              />
              <p className="quiet">
                Manual edits are your wording and are not automatically
                re-verified. Unsupported claims are omitted.
              </p>
              <Button
                disabled={!accepted.length}
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(
                    new Blob(
                      [
                        JSON.stringify(
                          {
                            ...report,
                            acceptedClaimIds: accepted,
                            reviewedRevision: revision,
                            manualRevisionNotReverified: true,
                          },
                          null,
                          2,
                        ),
                      ],
                      { type: 'application/json' },
                    ),
                  );
                  a.download = 'listingproof-report.json';
                  a.click();
                  URL.revokeObjectURL(a.href);
                }}
              >
                Export review receipt ↓
              </Button>
              <small>
                {accepted.length} / {report.findings.length} findings reviewed
              </small>
            </aside>
          </div>
        </>
      ) : (
        <div className="empty">
          <span>↗</span>
          <p>
            The sample contains a material mismatch, an unsupported
            certification, and a pack-count error. Try the fixture to explore
            the review flow.
          </p>
        </div>
      )}
      <footer>
        <span>ListingProof / AI Builders 2026</span>
        <span>
          Evidence review, not product certification. Reports stay in this
          session until exported.
        </span>
      </footer>
    </main>
  );
}
