export type Segment = { id: string; text: string; start: number; end: number };
export type Finding = {
  claimId: string;
  status: 'supported' | 'contradicted' | 'unsupported';
  sourceId: string | null;
  quote: string;
  reason: string;
  replacement: string;
  numericCheck?: string;
};
export type Report = {
  id: string;
  created: string;
  mode: 'bedrock' | 'fixture';
  listing: string;
  source: string;
  claims: Segment[];
  sources: Segment[];
  findings: Finding[];
  model: string;
  durationMs: number;
};
export function segments(text: string, prefix: string): Segment[] {
  const out: Segment[] = [];
  const re = /[^\n.!?]+(?:[.!?](?!\d)|$)/g;
  let m;
  while ((m = re.exec(text))) {
    const value = m[0].trim();
    if (value) {
      const start = m.index + m[0].indexOf(value);
      out.push({
        id: `${prefix}${out.length + 1}`,
        text: value,
        start,
        end: start + value.length,
      });
    }
  }
  return out;
}
export function splitLines(text: string, prefix: string): Segment[] {
  const out: Segment[] = [];
  let start = 0;
  for (const line of text.split('\n')) {
    const value = line.trim();
    if (value) {
      const offset = line.indexOf(value);
      out.push({
        id: `${prefix}${out.length + 1}`,
        text: value,
        start: start + offset,
        end: start + offset + value.length,
      });
    }
    start += line.length + 1;
  }
  return out;
}
function quantity(text: string) {
  const volume = text.match(
    /\b(\d+(?:\.\d+)?)\s*(ml|millilit(?:er|re)s?|l|lit(?:er|re)s?)\b/i,
  );
  if (volume)
    return {
      kind: 'volume',
      value: Number(volume[1]) * (/^(l|lit)/i.test(volume[2]) ? 1000 : 1),
      unit: 'ml',
    };
  const pack = text.match(/\bpack\s*(?:of\s*)?(\d+)\b/i);
  if (pack) return { kind: 'pack', value: Number(pack[1]), unit: 'items' };
  return null;
}
export function numericCheck(claim: string, quote: string) {
  const a = quantity(claim),
    b = quantity(quote);
  if (!a || !b || a.kind !== b.kind) return null;
  return {
    equal: Math.abs(a.value - b.value) < 1e-8,
    detail: `${a.value} ${a.unit} vs ${b.value} ${b.unit}`,
  };
}
export function validateFindings(
  raw: unknown,
  claims: Segment[],
  sources: Segment[],
): Finding[] {
  if (!Array.isArray(raw))
    throw Error('Model returned an invalid findings array.');
  return claims.map((claim) => {
    const matches = raw.filter(
      (r) => r && typeof r === 'object' && r.claimId === claim.id,
    );
    if (matches.length !== 1)
      return {
        claimId: claim.id,
        status: 'unsupported',
        sourceId: null,
        quote: '',
        reason: 'No unique model finding for this claim. Review manually.',
        replacement: '',
      };
    const r = matches[0];
    let status: Finding['status'] = [
      'supported',
      'contradicted',
      'unsupported',
    ].includes(r.status)
      ? r.status
      : 'unsupported';
    const source = sources.find((s) => s.id === r.sourceId);
    const quote = typeof r.quote === 'string' ? r.quote.trim() : '';
    if (!source || !quote || !source.text.includes(quote)) {
      return {
        claimId: claim.id,
        status: 'unsupported',
        sourceId: null,
        quote: '',
        reason:
          'No verifiable source span. Any proposed citation was discarded.',
        replacement: '',
      };
    }
    const numeric = numericCheck(claim.text, quote);
    if (numeric && !numeric.equal) status = 'contradicted';
    const reason =
      typeof r.reason === 'string'
        ? r.reason.slice(0, 600)
        : 'Review the cited evidence.';
    return {
      claimId: claim.id,
      status,
      sourceId: source.id,
      quote,
      reason,
      replacement:
        status === 'supported'
          ? claim.text
          : status === 'contradicted'
            ? quote
            : '',
      ...(numeric ? { numericCheck: numeric.detail } : {}),
    };
  });
}
export const sample = {
  listing:
    'Made from 100% cotton.\nCertified organic.\nCapacity: 500 ml.\nPack of 12.',
  source: 'Material: 60% cotton, 40% polyester.\nCapacity: 0.5 L.\nPack of 6.',
};
export const fixture = [
  {
    claimId: 'C1',
    status: 'contradicted',
    sourceId: 'S1',
    quote: 'Material: 60% cotton, 40% polyester.',
    reason: 'The supplier specifies a blend, not pure cotton.',
  },
  {
    claimId: 'C2',
    status: 'unsupported',
    sourceId: null,
    quote: '',
    reason: 'No organic certification evidence supplied.',
  },
  {
    claimId: 'C3',
    status: 'supported',
    sourceId: 'S2',
    quote: 'Capacity: 0.5 L.',
    reason: '500 ml equals 0.5 L.',
  },
  {
    claimId: 'C4',
    status: 'contradicted',
    sourceId: 'S3',
    quote: 'Pack of 6.',
    reason: 'Pack count differs.',
  },
];
