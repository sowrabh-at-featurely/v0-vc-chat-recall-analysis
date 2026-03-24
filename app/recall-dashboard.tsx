// @ts-nocheck
"use client";
import { useState, useMemo } from "react";

// DATA
const SYSTEMS = ["openai_file_search", "zeroentropy_file_search"];
const SYS_LABELS = { openai_file_search: "OpenAI File Search", zeroentropy_file_search: "ZeroEntropy" };
const SYS_SHORT = { openai_file_search: "OAI", zeroentropy_file_search: "ZE" };
const SYS_COLORS = {
  openai_file_search: { primary: "#34d399", bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.3)" },
  zeroentropy_file_search: { primary: "#a78bfa", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.3)" },
};
const PERSONAS = ["alok", "benjamin", "charlie_pinto", "eric_theis", "vinit_bhansali"];
const PERSONA_LABELS = { alok: "Alok", benjamin: "Benjamin", charlie_pinto: "Charlie Pinto", eric_theis: "Eric Theis", vinit_bhansali: "Vinit Bhansali" };
const QUESTIONS = [0, 1, 2, 3, 4];
const Q_TEXTS = {
  0: "Walk me through every firm you've worked at",
  1: "What was your very first job out of school?",
  2: "Did you ever work in banking, consulting, or tech before VC?",
  3: "Have you ever been an operator or founder?",
  4: "How did you break into venture capital?",
};
const SYS_AGG = {
  openai_file_search: { retR: 0.6406, retRC: 0.6939, ansR: 0.3193, ansRC: 0.5058, faith: 0.8323, cmr: 0.2915, hall: 32, miss: 98, dist: 6, zero_retrieval: 5, bn_retrieval: 12, bn_answer_gen: 13 },
  zeroentropy_file_search: { retR: 0.7013, retRC: 0.7214, ansR: 0.3521, ansRC: 0.6608, faith: 0.9199, cmr: 0.2063, hall: 12, miss: 53, dist: 12, zero_retrieval: 1, bn_retrieval: 6, bn_answer_gen: 19 },
};
const PERSONA_AGG = {
  openai_file_search: {
    alok: { retR: 0.262, retRC: 0.306, ansR: 0.224, ansRC: 0.276, faith: 0.78, cmr: 0.672, hall: 8, zero_retrieval: 3 },
    benjamin: { retR: 0.888, retRC: 0.942, ansR: 0.374, ansRC: 0.53, faith: 1.0, cmr: 0.058, hall: 0, zero_retrieval: 0 },
    charlie_pinto: { retR: 0.548, retRC: 0.524, ansR: 0.23, ansRC: 0.45, faith: 0.556, cmr: 0.476, hall: 19, zero_retrieval: 2 },
    eric_theis: { retR: 0.794, retRC: 0.882, ansR: 0.35, ansRC: 0.724, faith: 0.91, cmr: 0.09, hall: 3, zero_retrieval: 0 },
    vinit_bhansali: { retR: 0.712, retRC: 0.816, ansR: 0.418, ansRC: 0.548, faith: 0.916, cmr: 0.162, hall: 2, zero_retrieval: 0 },
  },
  zeroentropy_file_search: {
    alok: { retR: 0.700, retRC: 0.707, ansR: 0.463, ansRC: 0.647, faith: 1.0, cmr: 0.293, hall: 0, zero_retrieval: 1 },
    benjamin: { retR: 0.811, retRC: 0.971, ansR: 0.315, ansRC: 0.700, faith: 1.0, cmr: 0.057, hall: 0, zero_retrieval: 0 },
    charlie_pinto: { retR: 0.555, retRC: 0.392, ansR: 0.262, ansRC: 0.569, faith: 0.740, cmr: 0.358, hall: 9, zero_retrieval: 0 },
    eric_theis: { retR: 0.701, retRC: 0.687, ansR: 0.327, ansRC: 0.567, faith: 0.943, cmr: 0.173, hall: 0, zero_retrieval: 0 },
    vinit_bhansali: { retR: 0.740, retRC: 0.850, ansR: 0.394, ansRC: 0.821, faith: 0.917, cmr: 0.150, hall: 3, zero_retrieval: 0 },
  },
};
const Q_AGG = {
  openai_file_search: {
    0: { retR: 0.876, retRC: 0.89, ansR: 0.632, ansRC: 0.804, hall: 4, cmr: 0.066 },
    1: { retR: 0.576, retRC: 0.6, ansR: 0.34, ansRC: 0.65, hall: 1, cmr: 0.2 },
    2: { retR: 0.732, retRC: 0.748, ansR: 0.272, ansRC: 0.516, hall: 1, cmr: 0.252 },
    3: { retR: 0.45, retRC: 0.56, ansR: 0.118, ansRC: 0.194, hall: 19, cmr: 0.44 },
    4: { retR: 0.572, retRC: 0.672, ansR: 0.234, ansRC: 0.364, hall: 7, cmr: 0.5 },
  },
  zeroentropy_file_search: {
    0: { retR: 0.758, retRC: 0.846, ansR: 0.460, ansRC: 0.787, hall: 6, cmr: 0.114 },
    1: { retR: 0.650, retRC: 0.600, ansR: 0.297, ansRC: 0.800, hall: 2, cmr: 0.200 },
    2: { retR: 0.719, retRC: 0.611, ansR: 0.240, ansRC: 0.367, hall: 2, cmr: 0.384 },
    3: { retR: 0.701, retRC: 0.693, ansR: 0.369, ansRC: 0.677, hall: 0, cmr: 0.190 },
    4: { retR: 0.679, retRC: 0.857, ansR: 0.395, ansRC: 0.673, hall: 2, cmr: 0.143 },
  },
};
const ROWS = {
  openai_file_search: {
    alok: [
      { gt:13,cr:9,rR:0.62,rRC:0.67,aR:0.62,aRC:0.67,ms:2,hl:0,dt:0,fa:1.0,cm:0.22,bn:"RET",ch:20,mS:0.539,zr:false },
      { gt:5,cr:3,rR:0,rRC:0,aR:0,aRC:0,ms:5,hl:0,dt:0,fa:1.0,cm:1.0,bn:"RET",ch:0,mS:0,zr:true },
      { gt:16,cr:7,rR:0.69,rRC:0.86,aR:0.5,aRC:0.71,ms:4,hl:0,dt:0,fa:1.0,cm:0.14,bn:"RET",ch:20,mS:0.443,zr:false },
      { gt:10,cr:2,rR:0,rRC:0,aR:0,aRC:0,ms:10,hl:7,dt:0,fa:0,cm:1.0,bn:"RET",ch:0,mS:0,zr:true },
      { gt:12,cr:6,rR:0,rRC:0,aR:0,aRC:0,ms:12,hl:1,dt:0,fa:0.9,cm:1.0,bn:"RET",ch:0,mS:0,zr:true },
    ],
    benjamin: [
      { gt:22,cr:11,rR:1.0,rRC:1.0,aR:0.68,aRC:0.91,ms:0,hl:0,dt:1,fa:1.0,cm:0,bn:"ANS",ch:20,mS:0.599,zr:false },
      { gt:16,cr:4,rR:0.88,rRC:1.0,aR:0.12,aRC:0.25,ms:2,hl:0,dt:0,fa:1.0,cm:0,bn:"ANS",ch:20,mS:0.247,zr:false },
      { gt:15,cr:7,rR:0.87,rRC:0.71,aR:0.33,aRC:0.57,ms:2,hl:0,dt:0,fa:1.0,cm:0.29,bn:"RET",ch:40,mS:0.345,zr:false },
      { gt:30,cr:6,rR:0.7,rRC:1.0,aR:0.03,aRC:0.17,ms:2,hl:0,dt:0,fa:1.0,cm:0,bn:"ANS",ch:20,mS:0.625,zr:false },
      { gt:17,cr:4,rR:1.0,rRC:1.0,aR:0.71,aRC:0.75,ms:0,hl:0,dt:0,fa:1.0,cm:0,bn:"ANS",ch:20,mS:0.331,zr:false },
    ],
    charlie_pinto: [
      { gt:16,cr:6,rR:0.94,rRC:1.0,aR:0.69,aRC:1.0,ms:0,hl:3,dt:1,fa:0.8,cm:0,bn:"ANS",ch:20,mS:0.379,zr:false },
      { gt:3,cr:1,rR:1.0,rRC:1.0,aR:0.33,aRC:1.0,ms:0,hl:1,dt:0,fa:0.8,cm:0,bn:"ANS",ch:20,mS:0.242,zr:false },
      { gt:15,cr:8,rR:0.8,rRC:0.62,aR:0.13,aRC:0.25,ms:2,hl:1,dt:0,fa:0.75,cm:0.38,bn:"ANS",ch:20,mS:0.309,zr:false },
      { gt:15,cr:5,rR:0,rRC:0,aR:0,aRC:0,ms:15,hl:10,dt:0,fa:0,cm:1.0,bn:"RET",ch:0,mS:0,zr:true },
      { gt:16,cr:5,rR:0,rRC:0,aR:0,aRC:0,ms:16,hl:4,dt:0,fa:0.43,cm:1.0,bn:"RET",ch:0,mS:0,zr:true },
    ],
    eric_theis: [
      { gt:13,cr:9,rR:1.0,rRC:1.0,aR:0.85,aRC:1.0,ms:0,hl:0,dt:0,fa:1.0,cm:0,bn:"ANS",ch:20,mS:0.635,zr:false },
      { gt:4,cr:1,rR:1.0,rRC:1.0,aR:0.25,aRC:1.0,ms:0,hl:0,dt:0,fa:1.0,cm:0,bn:"ANS",ch:20,mS:0.424,zr:false },
      { gt:15,cr:4,rR:0.8,rRC:0.75,aR:0.07,aRC:0.25,ms:3,hl:0,dt:0,fa:1.0,cm:0.25,bn:"RET",ch:40,mS:0.531,zr:false },
      { gt:14,cr:5,rR:0.64,rRC:0.8,aR:0.29,aRC:0.8,ms:4,hl:2,dt:0,fa:0.75,cm:0.2,bn:"RET",ch:20,mS:0.722,zr:false },
      { gt:17,cr:7,rR:0.53,rRC:0.86,aR:0.29,aRC:0.57,ms:1,hl:1,dt:2,fa:0.8,cm:0,bn:"ANS",ch:20,mS:0.48,zr:false },
    ],
    vinit_bhansali: [
      { gt:22,cr:9,rR:0.82,rRC:0.78,aR:0.32,aRC:0.44,ms:1,hl:1,dt:2,fa:0.78,cm:0.11,bn:"ANS",ch:20,mS:0.429,zr:false },
      { gt:2,cr:1,rR:1.0,rRC:1.0,aR:1.0,aRC:1.0,ms:0,hl:0,dt:0,fa:1.0,cm:0,bn:"RET",ch:20,mS:0.026,zr:false },
      { gt:12,cr:5,rR:0.5,rRC:0.8,aR:0.33,aRC:0.8,ms:5,hl:0,dt:0,fa:1.0,cm:0.2,bn:"ANS",ch:20,mS:0.029,zr:false },
      { gt:11,cr:1,rR:0.91,rRC:1.0,aR:0.27,aRC:0,ms:0,hl:0,dt:0,fa:1.0,cm:0,bn:"ANS",ch:20,mS:0.030,zr:false },
      { gt:18,cr:4,rR:0.33,rRC:0.5,aR:0.17,aRC:0.5,ms:12,hl:1,dt:0,fa:0.8,cm:0.5,bn:"RET",ch:20,mS:0.029,zr:false },
    ],
  },
  zeroentropy_file_search: {
    alok: [
      { gt:17,cr:7,rR:1.0,rRC:1.0,aR:0.47,aRC:1.0,ms:0,hl:0,dt:0,fa:1.0,cm:0,bn:"ANS",ch:30,mS:0.615,zr:false },
      { gt:5,cr:1,rR:0,rRC:0,aR:0.4,aRC:0,ms:5,hl:0,dt:1,fa:1.0,cm:1.0,bn:"RET",ch:0,mS:0,zr:true },
      { gt:12,cr:6,rR:0.92,rRC:0.83,aR:0.42,aRC:0.83,ms:1,hl:0,dt:0,fa:1.0,cm:0.17,bn:"RET",ch:60,mS:0.454,zr:false },
      { gt:14,cr:5,rR:0.86,rRC:0.8,aR:0.57,aRC:0.8,ms:1,hl:0,dt:1,fa:1.0,cm:0.2,bn:"ANS",ch:54,mS:0.591,zr:false },
      { gt:22,cr:10,rR:0.73,rRC:0.9,aR:0.45,aRC:0.6,ms:1,hl:0,dt:0,fa:1.0,cm:0.1,bn:"ANS",ch:43,mS:0.750,zr:false },
    ],
    benjamin: [
      { gt:34,cr:12,rR:0.59,rRC:1.0,aR:0.41,aRC:0.75,ms:3,hl:0,dt:0,fa:1.0,cm:0,bn:"ANS",ch:19,mS:0.804,zr:false },
      { gt:12,cr:1,rR:0.75,rRC:1.0,aR:0.17,aRC:1.0,ms:1,hl:0,dt:0,fa:1.0,cm:0,bn:"ANS",ch:27,mS:0.410,zr:false },
      { gt:23,cr:7,rR:0.78,rRC:0.86,aR:0,aRC:0,ms:2,hl:0,dt:0,fa:1.0,cm:0.29,bn:"RET",ch:20,mS:0.675,zr:false },
      { gt:13,cr:6,rR:1.0,rRC:1.0,aR:0.46,aRC:1.0,ms:0,hl:0,dt:0,fa:1.0,cm:0,bn:"ANS",ch:25,mS:0.715,zr:false },
      { gt:15,cr:4,rR:0.93,rRC:1.0,aR:0.53,aRC:0.75,ms:0,hl:0,dt:1,fa:1.0,cm:0,bn:"ANS",ch:20,mS:0.667,zr:false },
    ],
    charlie_pinto: [
      { gt:17,cr:7,rR:0.35,rRC:0.43,aR:0.29,aRC:0.43,ms:11,hl:5,dt:1,fa:0.5,cm:0.57,bn:"RET",ch:10,mS:0.917,zr:false },
      { gt:4,cr:1,rR:0.5,rRC:0,aR:0.25,aRC:1.0,ms:1,hl:2,dt:0,fa:0.6,cm:0,bn:"ANS",ch:24,mS:0.563,zr:false },
      { gt:17,cr:5,rR:0.59,rRC:0.2,aR:0.12,aRC:0,ms:5,hl:2,dt:1,fa:0.6,cm:0.8,bn:"ANS",ch:29,mS:0.652,zr:false },
      { gt:11,cr:4,rR:0.55,rRC:0.5,aR:0.36,aRC:0.75,ms:1,hl:0,dt:2,fa:1.0,cm:0.25,bn:"ANS",ch:37,mS:0.744,zr:false },
      { gt:14,cr:6,rR:0.79,rRC:0.83,aR:0.29,aRC:0.67,ms:2,hl:0,dt:1,fa:1.0,cm:0.17,bn:"ANS",ch:30,mS:0.750,zr:false },
    ],
    eric_theis: [
      { gt:13,cr:10,rR:0.85,rRC:0.8,aR:0.77,aRC:0.9,ms:0,hl:0,dt:0,fa:1.0,cm:0,bn:"ANS",ch:12,mS:0.936,zr:false },
      { gt:6,cr:1,rR:1.0,rRC:1.0,aR:0.17,aRC:1.0,ms:0,hl:0,dt:0,fa:1.0,cm:0,bn:"ANS",ch:13,mS:0.889,zr:false },
      { gt:13,cr:6,rR:0.31,rRC:0.17,aR:0,aRC:0,ms:4,hl:0,dt:0,fa:1.0,cm:0.67,bn:"RET",ch:13,mS:0.924,zr:false },
      { gt:10,cr:6,rR:0.6,rRC:0.67,aR:0.2,aRC:0.33,ms:2,hl:0,dt:2,fa:0.71,cm:0,bn:"ANS",ch:14,mS:0.952,zr:false },
      { gt:12,cr:5,rR:0.75,rRC:0.8,aR:0.5,aRC:0.6,ms:1,hl:0,dt:1,fa:1.0,cm:0.2,bn:"ANS",ch:17,mS:0.960,zr:false },
    ],
    vinit_bhansali: [
      { gt:17,cr:7,rR:1.0,rRC:1.0,aR:0.35,aRC:0.86,ms:0,hl:1,dt:1,fa:0.92,cm:0,bn:"ANS",ch:28,mS:0.480,zr:false },
      { gt:4,cr:1,rR:1.0,rRC:1.0,aR:0.5,aRC:1.0,ms:0,hl:0,dt:0,fa:1.0,cm:0,bn:"ANS",ch:20,mS:0.349,zr:false },
      { gt:9,cr:5,rR:1.0,rRC:1.0,aR:0.67,aRC:1.0,ms:0,hl:0,dt:0,fa:1.0,cm:0,bn:"ANS",ch:20,mS:0.349,zr:false },
      { gt:12,cr:4,rR:0.5,rRC:0.5,aR:0.25,aRC:0.5,ms:5,hl:0,dt:0,fa:1.0,cm:0.5,bn:"RET",ch:29,mS:0.742,zr:false },
      { gt:15,cr:4,rR:0.2,rRC:0.75,aR:0.2,aRC:0.75,ms:7,hl:2,dt:0,fa:0.67,cm:0.25,bn:"ANS",ch:29,mS:0.742,zr:false },
    ],
  },
};
const CELL_WINS = {
  openai_file_search: { retR: 12, ansRC: 7 },
  zeroentropy_file_search: { retR: 10, ansRC: 13 },
  tie: { retR: 3, ansRC: 5 },
};
const LAYER_GAPS = {
  openai_file_search: { PERSONA:{t:3,r:0}, MEMORY:{t:14,r:1}, BEHAVIOR:{t:3,r:2}, DOMAIN:{t:5,r:5}, FILE:{t:75,r:65}, PROFESSIONAL:{t:252,r:163}, TRACK_RECORD:{t:15,r:8} },
  zeroentropy_file_search: { BEHAVIOR:{t:2,r:2}, DOMAIN:{t:4,r:2}, FILE:{t:67,r:40}, MEMORY:{t:32,r:26}, PERSONA:{t:4,r:3}, PROFESSIONAL:{t:242,r:180}, TRACK_RECORD:{t:21,r:14} },
};
const SCORE_DIST = {
  openai_file_search: { bands:{"0.0-0.2":117,"0.2-0.4":132,"0.4-0.6":83,"0.6-0.8":90,"0.8-1.0":18}, total:440, mean:0.376 },
  zeroentropy_file_search: { bands:{"0.0-0.2":39,"0.2-0.4":95,"0.4-0.6":116,"0.6-0.8":119,"0.8-1.0":254}, total:623, mean:0.654 },
};
const BN_DIST = {
  openai_file_search: { RETRIEVAL: 12, ANSWER_GENERATION: 13 },
  zeroentropy_file_search: { RETRIEVAL: 6, ANSWER_GENERATION: 19 },
};
const FINDINGS = [
  { severity:"critical", tag:"RETRIEVAL", title:"OpenAI has 5/25 zero-retrieval cases (20%)", detail:"alok Q1,Q3,Q4 and charlie_pinto Q3,Q4 returned no chunks. These 5 cases produced 0% recall and generated 22 of OAI's 32 hallucinations. Empty queries suggest file_search was never invoked." },
  { severity:"critical", tag:"RETRIEVAL", title:"ZeroEntropy has only 1/25 zero-retrieval (4%)", detail:"Only alok Q1 had zero retrieval in ZE — 5x fewer failures than OAI, making ZE more reliable for basic retrieval coverage." },
  { severity:"high", tag:"RETRIEVAL", title:"ZE retrieval recall higher: 70.1% vs 64.1% (+6pp)", detail:"ZE retrieves more ground-truth facts. Gap driven by fewer zero-retrieval cases and higher chunk quality (mean score 0.654 vs 0.376)." },
  { severity:"high", tag:"ANSWER GEN", title:"Answer recall similar despite retrieval gap: OAI 31.9% vs ZE 35.2%", detail:"The 6pp retrieval advantage only yields 3.3pp answer recall gain, suggesting ZE's answer generation doesn't fully exploit its superior retrieval." },
  { severity:"high", tag:"HALLUCINATION", title:"OAI hallucinates 2.7x more: 32 vs 12 fabricated facts", detail:"OAI's 32 hallucinations vs ZE's 12 are concentrated in zero-retrieval cases (22/32 for OAI). charlie_pinto is worst offender: 19 (OAI) and 9 (ZE)." },
  { severity:"high", tag:"BOTTLENECK", title:"Bottleneck shifts RETRIEVAL to ANSWER_GEN with better retrieval", detail:"OAI: 12 RET / 13 ANS (even). ZE: 6 RET / 19 ANS. ZE's better retrieval moves the bottleneck downstream." },
  { severity:"medium", tag:"EVIDENCE GAP", title:"OAI MEMORY layer is 92.9% blind", detail:"OAI retrieves only 1/14 MEMORY facts (92.9% gap) and 0/3 PERSONA facts (100%). ZE much better: 26/32 MEMORY (18.8% gap)." },
  { severity:"medium", tag:"RETRIEVAL", title:"ZE chunk quality far superior: mean score 0.654 vs 0.376", detail:"41% of ZE chunks score >= 0.8 vs only 4% for OAI. ZE distribution is right-skewed; OAI left-skewed." },
  { severity:"medium", tag:"ANSWER GEN", title:"Both systems lose ~50% of retrieved info during answer generation", detail:"OAI: retR 64.1% to ansR 31.9% (50% conversion). ZE: retR 70.1% to ansR 35.2% (50% conversion)." },
  { severity:"medium", tag:"QUESTION TYPE", title:"Q3 ('operator/founder?') shows biggest system gap", detail:"Q3 retR: OAI=0.450 vs ZE=0.700 (+0.250). Also highest hallucination count (19 OAI, 2 ZE)." },
  { severity:"info", tag:"COMPARISON", title:"Cell-by-cell: OAI wins 12/25 retR, ZE wins 10, 3 ties", detail:"retR wins are close. On ansRC: ZE wins 13, OAI wins 7, 5 ties — clearer ZE advantage on critical answer recall." },
  { severity:"info", tag:"DATA QUALITY", title:"No cross-persona contamination detected", detail:"All conversation IDs are unique per persona. No identical answer patterns found." },
];
const RECOMMENDATIONS = [
  { priority:"P0", title:"Fix OAI zero-retrieval for alok & charlie_pinto", detail:"5 questions (20%) returned empty results with no queries. Likely a tool invocation bug. Accounts for 22/32 hallucinations." },
  { priority:"P1", title:"Improve answer generation conversion rate", detail:"Both systems lose ~50% of retrieved facts. Dominant bottleneck for ZE (19/25). Investigate prompt, context window limits, or formatting." },
  { priority:"P1", title:"Address OAI MEMORY & PERSONA layer blind spots", detail:"OAI retrieves 1/14 MEMORY facts and 0/3 PERSONA facts. ZE proves these are retrievable (26/32 MEMORY)." },
  { priority:"P2", title:"Add hallucination guardrails for charlie_pinto", detail:"charlie_pinto: 19/32 OAI hallucinations, 9/12 ZE. Source docs may be ambiguous or model has pretraining contamination." },
  { priority:"P2", title:"Investigate ZE single-query vs OAI multi-query strategy", detail:"ZE sends 1 query/call vs OAI's 4.4 avg. Despite fewer queries, ZE retrieves more relevant chunks." },
  { priority:"P2", title:"Normalize ground truth extraction across evaluator runs", detail:"GT fact counts differ between systems for same persona x question. Makes raw counts non-comparable." },
];
// STYLE HELPERS
const metricColor = (val, invert = false) => {
  const v = invert ? 1 - val : val;
  if (v >= 0.9) return "#34d399";
  if (v >= 0.7) return "#fbbf24";
  if (v >= 0.4) return "#f97316";
  return "#ef4444";
};
const sevColor = { critical: "#ef4444", high: "#f97316", medium: "#fbbf24", info: "#60a5fa" };
const prioColor = { P0: "#ef4444", P1: "#f97316", P2: "#fbbf24" };
const pct = (v) => `${(v * 100).toFixed(1)}%`;
const numFont = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };
const textFont = { fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" };
// COMPONENTS
function StatCard({ label, oai, ze, format = "pct", lowerBetter = false }) {
  const fmtVal = (v) => format === "pct" ? pct(v) : v;
  const oaiColor = format === "pct" ? metricColor(oai, lowerBetter) : (lowerBetter ? (oai <= ze ? "#34d399" : "#ef4444") : (oai >= ze ? "#34d399" : "#ef4444"));
  const zeColor = format === "pct" ? metricColor(ze, lowerBetter) : (lowerBetter ? (ze <= oai ? "#a78bfa" : "#ef4444") : (ze >= oai ? "#a78bfa" : "#ef4444"));
  return (
    <div style={{ background: "#101018", border: "1px solid #1c1c2e", borderRadius: 8, padding: "14px 18px", minWidth: 140 }}>
      <div style={{ ...textFont, fontSize: 11, color: "#9ca3af", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
        <div>
          <span style={{ ...numFont, fontSize: 22, color: oaiColor, fontWeight: 600 }}>{fmtVal(oai)}</span>
          <span style={{ ...textFont, fontSize: 10, color: "#6b7280", marginLeft: 4 }}>OAI</span>
        </div>
        <div>
          <span style={{ ...numFont, fontSize: 22, color: zeColor, fontWeight: 600 }}>{fmtVal(ze)}</span>
          <span style={{ ...textFont, fontSize: 10, color: "#6b7280", marginLeft: 4 }}>ZE</span>
        </div>
      </div>
    </div>
  );
}
function Bar({ value, max, color, width = 120, height = 14 }) {
  const w = max > 0 ? (value / max) * width : 0;
  return (
    <div style={{ width, height, background: "#1c1c2e", borderRadius: 4, overflow: "hidden", display: "inline-block", verticalAlign: "middle" }}>
      <div style={{ width: w, height, background: color, borderRadius: 4, transition: "width 0.3s" }} />
    </div>
  );
}
function OverviewTab() {
  const oai = SYS_AGG.openai_file_search;
  const ze = SYS_AGG.zeroentropy_file_search;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
        <StatCard label="Retrieval Recall" oai={oai.retR} ze={ze.retR} />
        <StatCard label="Ret. Recall (Crit)" oai={oai.retRC} ze={ze.retRC} />
        <StatCard label="Answer Recall" oai={oai.ansR} ze={ze.ansR} />
        <StatCard label="Ans. Recall (Crit)" oai={oai.ansRC} ze={ze.ansRC} />
        <StatCard label="Faithfulness" oai={oai.faith} ze={ze.faith} />
        <StatCard label="Critical Miss Rate" oai={oai.cmr} ze={ze.cmr} lowerBetter />
        <StatCard label="Hallucinations" oai={oai.hall} ze={ze.hall} format="num" lowerBetter />
        <StatCard label="Zero-Retrieval" oai={oai.zero_retrieval} ze={ze.zero_retrieval} format="num" lowerBetter />
      </div>
      <div style={{ background: "#101018", border: "1px solid #1c1c2e", borderRadius: 8, padding: 16, overflowX: "auto" }}>
        <div style={{ ...textFont, fontSize: 13, color: "#e5e7eb", marginBottom: 12, fontWeight: 600 }}>Head-to-Head Comparison</div>
        <table style={{ width: "100%", borderCollapse: "collapse", ...numFont, fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1c1c2e" }}>
              <th style={{ textAlign: "left", padding: "6px 12px", color: "#9ca3af", ...textFont, fontSize: 11 }}>Metric</th>
              <th style={{ textAlign: "right", padding: "6px 12px", color: SYS_COLORS.openai_file_search.primary }}>OAI</th>
              <th style={{ textAlign: "right", padding: "6px 12px", color: SYS_COLORS.zeroentropy_file_search.primary }}>ZE</th>
              <th style={{ textAlign: "right", padding: "6px 12px", color: "#9ca3af" }}>Delta</th>
              <th style={{ textAlign: "center", padding: "6px 12px", color: "#9ca3af", ...textFont }}>Winner</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["retR", oai.retR, ze.retR, false], ["retRC", oai.retRC, ze.retRC, false],
              ["ansR", oai.ansR, ze.ansR, false], ["ansRC", oai.ansRC, ze.ansRC, false],
              ["faith", oai.faith, ze.faith, false], ["cmr", oai.cmr, ze.cmr, true],
              ["hall", oai.hall, ze.hall, true], ["miss", oai.miss, ze.miss, true], ["dist", oai.dist, ze.dist, true],
            ].map(([label, vA, vB, lowerBetter]) => {
              const d = vB - vA;
              const isNum = typeof vA === "number" && vA === Math.round(vA) && vA > 1;
              const winner = lowerBetter ? (vA < vB ? "OAI" : vB < vA ? "ZE" : "—") : (vA > vB ? "OAI" : vB > vA ? "ZE" : "—");
              const winColor = winner === "OAI" ? SYS_COLORS.openai_file_search.primary : winner === "ZE" ? SYS_COLORS.zeroentropy_file_search.primary : "#6b7280";
              return (
                <tr key={label} style={{ borderBottom: "1px solid #0d0d14" }}>
                  <td style={{ padding: "6px 12px", color: "#d1d5db", ...textFont }}>{label}</td>
                  <td style={{ padding: "6px 12px", textAlign: "right", color: "#e5e7eb" }}>{isNum ? vA : pct(vA)}</td>
                  <td style={{ padding: "6px 12px", textAlign: "right", color: "#e5e7eb" }}>{isNum ? vB : pct(vB)}</td>
                  <td style={{ padding: "6px 12px", textAlign: "right", color: d > 0 ? "#34d399" : d < 0 ? "#ef4444" : "#6b7280" }}>
                    {d > 0 ? "+" : ""}{isNum ? d : pct(d)}
                  </td>
                  <td style={{ padding: "6px 12px", textAlign: "center", color: winColor, fontWeight: 600 }}>{winner}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#101018", border: "1px solid #1c1c2e", borderRadius: 8, padding: 16 }}>
          <div style={{ ...textFont, fontSize: 13, color: "#e5e7eb", marginBottom: 12, fontWeight: 600 }}>Bottleneck Distribution</div>
          {SYSTEMS.map(sys => (
            <div key={sys} style={{ marginBottom: 12 }}>
              <div style={{ ...textFont, fontSize: 11, color: SYS_COLORS[sys].primary, marginBottom: 6 }}>{SYS_SHORT[sys]}</div>
              {Object.entries(BN_DIST[sys]).map(([bn, count]) => (
                <div key={bn} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ ...textFont, fontSize: 11, color: "#9ca3af", width: 130, flexShrink: 0 }}>{bn}</span>
                  <Bar value={count} max={25} color={SYS_COLORS[sys].primary} width={100} />
                  <span style={{ ...numFont, fontSize: 12, color: "#e5e7eb" }}>{count}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ background: "#101018", border: "1px solid #1c1c2e", borderRadius: 8, padding: 16 }}>
          <div style={{ ...textFont, fontSize: 13, color: "#e5e7eb", marginBottom: 12, fontWeight: 600 }}>Chunk Score Distribution</div>
          {Object.entries(SCORE_DIST.openai_file_search.bands).map(([band]) => (
            <div key={band} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ ...numFont, fontSize: 10, color: "#9ca3af", width: 55, flexShrink: 0 }}>{band}</span>
              <Bar value={SCORE_DIST.openai_file_search.bands[band]} max={SCORE_DIST.zeroentropy_file_search.total * 0.45} color={SYS_COLORS.openai_file_search.primary} width={80} />
              <span style={{ ...numFont, fontSize: 10, color: SYS_COLORS.openai_file_search.primary, width: 30 }}>{SCORE_DIST.openai_file_search.bands[band]}</span>
              <Bar value={SCORE_DIST.zeroentropy_file_search.bands[band]} max={SCORE_DIST.zeroentropy_file_search.total * 0.45} color={SYS_COLORS.zeroentropy_file_search.primary} width={80} />
              <span style={{ ...numFont, fontSize: 10, color: SYS_COLORS.zeroentropy_file_search.primary, width: 30 }}>{SCORE_DIST.zeroentropy_file_search.bands[band]}</span>
            </div>
          ))}
          <div style={{ ...numFont, fontSize: 10, color: "#6b7280", marginTop: 8 }}>
            Mean: OAI={SCORE_DIST.openai_file_search.mean.toFixed(3)} | ZE={SCORE_DIST.zeroentropy_file_search.mean.toFixed(3)}
          </div>
        </div>
      </div>
      <div style={{ background: "#101018", border: "1px solid #1c1c2e", borderRadius: 8, padding: 16 }}>
        <div style={{ ...textFont, fontSize: 13, color: "#e5e7eb", marginBottom: 12, fontWeight: 600 }}>Per-Question Comparison (retR)</div>
        {QUESTIONS.map(qi => (
          <div key={qi} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ ...textFont, fontSize: 11, color: "#9ca3af", width: 250, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Q{qi}: {Q_TEXTS[qi]}</span>
            <Bar value={Q_AGG.openai_file_search[qi].retR} max={1} color={SYS_COLORS.openai_file_search.primary} width={120} />
            <span style={{ ...numFont, fontSize: 11, color: SYS_COLORS.openai_file_search.primary, width: 45 }}>{pct(Q_AGG.openai_file_search[qi].retR)}</span>
            <Bar value={Q_AGG.zeroentropy_file_search[qi].retR} max={1} color={SYS_COLORS.zeroentropy_file_search.primary} width={120} />
            <span style={{ ...numFont, fontSize: 11, color: SYS_COLORS.zeroentropy_file_search.primary, width: 45 }}>{pct(Q_AGG.zeroentropy_file_search[qi].retR)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function HeatmapTab() {
  const [metric, setMetric] = useState("rR");
  const metricLabels = { rR: "Retrieval Recall", rRC: "Ret. Recall (Crit)", aR: "Answer Recall", aRC: "Ans. Recall (Crit)", fa: "Faithfulness", cm: "Critical Miss Rate" };
  const isInverted = metric === "cm";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {Object.entries(metricLabels).map(([k, label]) => (
          <button key={k} onClick={() => setMetric(k)} style={{
            ...textFont, fontSize: 12, padding: "6px 14px", borderRadius: 6,
            background: metric === k ? "#2d2d44" : "#101018", color: metric === k ? "#e5e7eb" : "#6b7280",
            border: `1px solid ${metric === k ? "#4f46e5" : "#1c1c2e"}`, cursor: "pointer",
          }}>{label}</button>
        ))}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ ...textFont, fontSize: 11, color: "#6b7280", padding: "8px 12px", textAlign: "left" }}>Persona</th>
              {QUESTIONS.map(qi => (
                <th key={qi} style={{ ...textFont, fontSize: 11, color: "#6b7280", padding: "8px 10px", textAlign: "center", minWidth: 120 }}>Q{qi}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERSONAS.map(p => (
              <tr key={p}>
                <td style={{ ...textFont, fontSize: 12, color: "#d1d5db", padding: "6px 12px", whiteSpace: "nowrap" }}>{PERSONA_LABELS[p]}</td>
                {QUESTIONS.map(qi => {
                  const oaiVal = ROWS.openai_file_search[p]?.[qi]?.[metric] ?? 0;
                  const zeVal = ROWS.zeroentropy_file_search[p]?.[qi]?.[metric] ?? 0;
                  const oaiZR = ROWS.openai_file_search[p]?.[qi]?.zr;
                  const zeZR = ROWS.zeroentropy_file_search[p]?.[qi]?.zr;
                  return (
                    <td key={qi} style={{ padding: "4px 6px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                        <div style={{
                          ...numFont, fontSize: 13, fontWeight: 600, padding: "4px 8px", borderRadius: 4, minWidth: 48,
                          background: oaiZR ? "rgba(239,68,68,0.15)" : `rgba(52,211,153,${Math.max(0.05, (isInverted ? 1 - oaiVal : oaiVal) * 0.3)})`,
                          color: metricColor(oaiVal, isInverted), border: oaiZR ? "1px solid rgba(239,68,68,0.4)" : "1px solid transparent",
                        }}>{oaiZR ? "ZR" : pct(oaiVal)}</div>
                        <div style={{
                          ...numFont, fontSize: 13, fontWeight: 600, padding: "4px 8px", borderRadius: 4, minWidth: 48,
                          background: zeZR ? "rgba(239,68,68,0.15)" : `rgba(167,139,250,${Math.max(0.05, (isInverted ? 1 - zeVal : zeVal) * 0.3)})`,
                          color: zeZR ? "#ef4444" : metricColor(zeVal, isInverted), border: zeZR ? "1px solid rgba(239,68,68,0.4)" : "1px solid transparent",
                        }}>{zeZR ? "ZR" : pct(zeVal)}</div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ ...textFont, fontSize: 11, color: "#6b7280", display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: SYS_COLORS.openai_file_search.primary, display: "inline-block" }} /> OAI</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: SYS_COLORS.zeroentropy_file_search.primary, display: "inline-block" }} /> ZE</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "rgba(239,68,68,0.3)", border: "1px solid rgba(239,68,68,0.5)", display: "inline-block" }} /> Zero-Retrieval</span>
        </div>
        <div style={{ background: "#101018", border: "1px solid #1c1c2e", borderRadius: 8, padding: "10px 16px" }}>
          <div style={{ ...textFont, fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>Cell-by-Cell Wins</div>
          <div style={{ ...numFont, fontSize: 12 }}>
            <span style={{ color: SYS_COLORS.openai_file_search.primary }}>retR: OAI {CELL_WINS.openai_file_search.retR}</span>
            <span style={{ color: "#6b7280" }}> / </span>
            <span style={{ color: SYS_COLORS.zeroentropy_file_search.primary }}>ZE {CELL_WINS.zeroentropy_file_search.retR}</span>
            <span style={{ color: "#6b7280" }}> / ties {CELL_WINS.tie.retR}</span>
            <span style={{ color: "#6b7280" }}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <span style={{ color: SYS_COLORS.openai_file_search.primary }}>ansRC: OAI {CELL_WINS.openai_file_search.ansRC}</span>
            <span style={{ color: "#6b7280" }}> / </span>
            <span style={{ color: SYS_COLORS.zeroentropy_file_search.primary }}>ZE {CELL_WINS.zeroentropy_file_search.ansRC}</span>
            <span style={{ color: "#6b7280" }}> / ties {CELL_WINS.tie.ansRC}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
function PersonaTab() {
  const [selectedPersona, setSelectedPersona] = useState("alok");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {PERSONAS.map(p => (
          <button key={p} onClick={() => setSelectedPersona(p)} style={{
            ...textFont, fontSize: 12, padding: "8px 16px", borderRadius: 6,
            background: selectedPersona === p ? "#2d2d44" : "#101018", color: selectedPersona === p ? "#e5e7eb" : "#6b7280",
            border: `1px solid ${selectedPersona === p ? "#4f46e5" : "#1c1c2e"}`, cursor: "pointer",
          }}>{PERSONA_LABELS[p]}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {SYSTEMS.map(sys => {
          const agg = PERSONA_AGG[sys][selectedPersona];
          return (
            <div key={sys} style={{ background: "#101018", border: `1px solid ${SYS_COLORS[sys].border}`, borderRadius: 8, padding: 16 }}>
              <div style={{ ...textFont, fontSize: 13, color: SYS_COLORS[sys].primary, fontWeight: 600, marginBottom: 10 }}>{SYS_LABELS[sys]}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[["retR", agg.retR], ["retRC", agg.retRC], ["ansR", agg.ansR], ["ansRC", agg.ansRC], ["faith", agg.faith], ["cmr", agg.cmr]].map(([k, v]) => (
                  <div key={k}>
                    <span style={{ ...textFont, fontSize: 10, color: "#6b7280" }}>{k} </span>
                    <span style={{ ...numFont, fontSize: 14, color: metricColor(v, k === "cmr"), fontWeight: 600 }}>{pct(v)}</span>
                  </div>
                ))}
                <div>
                  <span style={{ ...textFont, fontSize: 10, color: "#6b7280" }}>hall </span>
                  <span style={{ ...numFont, fontSize: 14, color: agg.hall > 0 ? "#ef4444" : "#34d399", fontWeight: 600 }}>{agg.hall}</span>
                </div>
                <div>
                  <span style={{ ...textFont, fontSize: 10, color: "#6b7280" }}>zero-ret </span>
                  <span style={{ ...numFont, fontSize: 14, color: agg.zero_retrieval > 0 ? "#ef4444" : "#34d399", fontWeight: 600 }}>{agg.zero_retrieval}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {QUESTIONS.map(qi => {
        const oai = ROWS.openai_file_search[selectedPersona]?.[qi];
        const ze = ROWS.zeroentropy_file_search[selectedPersona]?.[qi];
        if (!oai || !ze) return null;
        return (
          <div key={qi} style={{ background: "#101018", border: "1px solid #1c1c2e", borderRadius: 8, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ ...textFont, fontSize: 13, color: "#e5e7eb", fontWeight: 600 }}>Q{qi}: {Q_TEXTS[qi]}</div>
              <div style={{ display: "flex", gap: 6 }}>
                {oai.zr && <span style={{ ...textFont, fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}>OAI Zero-Retrieval</span>}
                {ze.zr && <span style={{ ...textFont, fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}>ZE Zero-Retrieval</span>}
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ ...textFont, fontSize: 10, color: "#6b7280", textAlign: "left", padding: 4 }}>System</th>
                  {["GT", "Crit", "retR", "retRC", "ansR", "ansRC", "miss", "hall", "dist", "faith", "cmr", "bn", "chunks", "mScore"].map(h => (
                    <th key={h} style={{ ...textFont, fontSize: 10, color: "#6b7280", textAlign: "right", padding: 4 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[["OAI", oai, SYS_COLORS.openai_file_search.primary], ["ZE", ze, SYS_COLORS.zeroentropy_file_search.primary]].map(([label, r, color]) => (
                  <tr key={label}>
                    <td style={{ ...textFont, fontSize: 12, color, padding: 4, fontWeight: 600 }}>{label}</td>
                    <td style={{ ...numFont, fontSize: 12, color: "#d1d5db", textAlign: "right", padding: 4 }}>{r.gt}</td>
                    <td style={{ ...numFont, fontSize: 12, color: "#d1d5db", textAlign: "right", padding: 4 }}>{r.cr}</td>
                    <td style={{ ...numFont, fontSize: 12, color: metricColor(r.rR), textAlign: "right", padding: 4 }}>{pct(r.rR)}</td>
                    <td style={{ ...numFont, fontSize: 12, color: metricColor(r.rRC), textAlign: "right", padding: 4 }}>{pct(r.rRC)}</td>
                    <td style={{ ...numFont, fontSize: 12, color: metricColor(r.aR), textAlign: "right", padding: 4 }}>{pct(r.aR)}</td>
                    <td style={{ ...numFont, fontSize: 12, color: metricColor(r.aRC), textAlign: "right", padding: 4 }}>{pct(r.aRC)}</td>
                    <td style={{ ...numFont, fontSize: 12, color: r.ms > 0 ? "#f97316" : "#34d399", textAlign: "right", padding: 4 }}>{r.ms}</td>
                    <td style={{ ...numFont, fontSize: 12, color: r.hl > 0 ? "#ef4444" : "#34d399", textAlign: "right", padding: 4 }}>{r.hl}</td>
                    <td style={{ ...numFont, fontSize: 12, color: r.dt > 0 ? "#fbbf24" : "#34d399", textAlign: "right", padding: 4 }}>{r.dt}</td>
                    <td style={{ ...numFont, fontSize: 12, color: metricColor(r.fa), textAlign: "right", padding: 4 }}>{pct(r.fa)}</td>
                    <td style={{ ...numFont, fontSize: 12, color: metricColor(r.cm, true), textAlign: "right", padding: 4 }}>{pct(r.cm)}</td>
                    <td style={{ ...textFont, fontSize: 11, color: r.bn === "RET" ? "#f97316" : "#60a5fa", textAlign: "right", padding: 4 }}>{r.bn === "RET" ? "RETRIEVAL" : "ANS_GEN"}</td>
                    <td style={{ ...numFont, fontSize: 12, color: "#d1d5db", textAlign: "right", padding: 4 }}>{r.ch}</td>
                    <td style={{ ...numFont, fontSize: 12, color: "#d1d5db", textAlign: "right", padding: 4 }}>{r.mS.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
function FindingsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ ...textFont, fontSize: 15, color: "#e5e7eb", fontWeight: 600, marginBottom: 12 }}>Findings</div>
        {FINDINGS.map((f, i) => (
          <div key={i} style={{ background: "#101018", border: "1px solid #1c1c2e", borderRadius: 8, padding: 14, marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <span style={{
                ...textFont, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: 0.5,
                background: `${sevColor[f.severity]}20`, color: sevColor[f.severity], border: `1px solid ${sevColor[f.severity]}40`,
              }}>{f.severity}</span>
              <span style={{ ...textFont, fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "#1c1c2e", color: "#9ca3af" }}>{f.tag}</span>
              <span style={{ ...textFont, fontSize: 13, color: "#e5e7eb", fontWeight: 600 }}>{f.title}</span>
            </div>
            <div style={{ ...textFont, fontSize: 12, color: "#9ca3af", lineHeight: 1.5, paddingLeft: 4 }}>{f.detail}</div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ ...textFont, fontSize: 15, color: "#e5e7eb", fontWeight: 600, marginBottom: 12 }}>Recommendations</div>
        {RECOMMENDATIONS.map((r, i) => (
          <div key={i} style={{ background: "#101018", border: "1px solid #1c1c2e", borderRadius: 8, padding: 14, marginBottom: 8, display: "flex", gap: 12 }}>
            <span style={{
              ...numFont, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 4, height: "fit-content", flexShrink: 0,
              background: `${prioColor[r.priority]}20`, color: prioColor[r.priority], border: `1px solid ${prioColor[r.priority]}40`,
            }}>{r.priority}</span>
            <div>
              <div style={{ ...textFont, fontSize: 13, color: "#e5e7eb", fontWeight: 600, marginBottom: 4 }}>{r.title}</div>
              <div style={{ ...textFont, fontSize: 12, color: "#9ca3af", lineHeight: 1.5 }}>{r.detail}</div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ ...textFont, fontSize: 15, color: "#e5e7eb", fontWeight: 600, marginBottom: 12 }}>Layer Gap Analysis</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {SYSTEMS.map(sys => (
            <div key={sys} style={{ background: "#101018", border: `1px solid ${SYS_COLORS[sys].border}`, borderRadius: 8, padding: 16 }}>
              <div style={{ ...textFont, fontSize: 13, color: SYS_COLORS[sys].primary, fontWeight: 600, marginBottom: 10 }}>{SYS_LABELS[sys]}</div>
              {Object.entries(LAYER_GAPS[sys]).filter(([_, v]) => v.t > 0).sort((a, b) => ((b[1].t - b[1].r) / b[1].t) - ((a[1].t - a[1].r) / a[1].t)).map(([layer, { t, r }]) => {
                const gap = ((t - r) / t * 100);
                return (
                  <div key={layer} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ ...textFont, fontSize: 11, color: "#9ca3af", width: 100, flexShrink: 0 }}>{layer}</span>
                    <Bar value={t - r} max={Math.max(...Object.values(LAYER_GAPS[sys]).map(v => v.t))} color={gap > 50 ? "#ef4444" : gap > 30 ? "#fbbf24" : "#34d399"} width={80} />
                    <span style={{ ...numFont, fontSize: 11, color: gap > 50 ? "#ef4444" : "#d1d5db" }}>{r}/{t} ({gap.toFixed(0)}% gap)</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// MAIN APP
export default function RecallDashboard() {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "heatmap", label: "Heatmap" },
    { id: "persona", label: "Per-Persona" },
    { id: "findings", label: "Findings" },
  ];
  return (
    <div style={{ background: "#08080d", minHeight: "100vh", color: "#e5e7eb", ...textFont, padding: "20px 24px" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#f9fafb", margin: 0, letterSpacing: -0.3 }}>
          Featurely Recall Evaluation Dashboard
        </h1>
        <p style={{ fontSize: 12, color: "#6b7280", margin: "4px 0 0" }}>
          Digital Twin Retrieval System Comparison — 2 systems x 5 personas x 5 questions
        </p>
      </div>
      <div style={{ display: "flex", gap: 2, marginBottom: 20, borderBottom: "1px solid #1c1c2e", paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            ...textFont, fontSize: 13, padding: "8px 20px", cursor: "pointer",
            background: tab === t.id ? "#101018" : "transparent",
            color: tab === t.id ? "#e5e7eb" : "#6b7280",
            border: "none", borderBottom: tab === t.id ? "2px solid #4f46e5" : "2px solid transparent",
            fontWeight: tab === t.id ? 600 : 400, transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>
      {tab === "overview" && <OverviewTab />}
      {tab === "heatmap" && <HeatmapTab />}
      {tab === "persona" && <PersonaTab />}
      {tab === "findings" && <FindingsTab />}
    </div>
  );
}
