// Real snapshot (compact, chunked) from the fully rewired n8n pipeline - FULL PORTFOLIO RUN
// (execution 1777, Aug 9 2026, all 86 open deals, ~1h35m runtime, zero errors/timeouts).
// NOTE: 68 of 86 deals (79%) came back critical - roughly half driven by real rep_sentiment=Red
// (27 deals org-wide) and half by NextStep notes 30+ days stale. Flagged as an open question,
// not smoothed over. Humana - SharedCred did not complete cleanly - shown as unscored.

import { DEALS_CHUNK_1 } from './dealsChunk1';
import { DEALS_CHUNK_2 } from './dealsChunk2';
import { DEALS_CHUNK_3 } from './dealsChunk3';
import { DEALS_CHUNK_4 } from './dealsChunk4';
import { DEALS_CHUNK_5 } from './dealsChunk5';
import { DEALS_CHUNK_6 } from './dealsChunk6';

export const FALLBACK_DEALS = [...DEALS_CHUNK_1, ...DEALS_CHUNK_2, ...DEALS_CHUNK_3, ...DEALS_CHUNK_4, ...DEALS_CHUNK_5, ...DEALS_CHUNK_6];

export const FALLBACK_UNSCORED = [{"id":"006Um00000YxA9RIAV","name":"Humana - SharedCred","owner":"Steven Emory","value":1349442.88,"stage":3,"closeDate":"2026-11-06","repSentiment":"Red","nextStep":null,"note":"This deal's scoring did not complete cleanly on the full run - no risk_category was returned. Worth a targeted re-run."}];
