import { NextResponse } from "next/server";

export const runtime = "edge";

type Body = { headers?: string[]; sample?: string[] };

const FIELD_KEYWORDS: Record<string, string[]> = {
  name: ["שם", "name", "full", "לקוח", "שם מלא"],
  age: ["גיל", "age"],
  gender: ["מין", "מגדר", "gender", "sex"],
  birth: ["לידה", "birth", "dob", "תאריך לידה", "ת.לידה"],
  phone: ["טלפון", "phone", "נייד", "mobile", "cell"],
  status: ["סטטוס", "status", "דרגה", "סוג", "tier"],
};
const FIELDS = Object.keys(FIELD_KEYWORDS);

function localMap(headers: string[]): Record<string, number | null> {
  const m: Record<string, number | null> = {};
  for (const f of FIELDS) {
    const idx = headers.findIndex((h) => FIELD_KEYWORDS[f].some((k) => h.toLowerCase().includes(k.toLowerCase())));
    m[f] = idx >= 0 ? idx : null;
  }
  return m;
}

/**
 * Maps arbitrary spreadsheet headers to NEXUS customer fields. Uses Claude when
 * ANTHROPIC_API_KEY is set, otherwise a keyword heuristic. Always returns a mapping.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Body;
  const headers = body.headers ?? [];
  const key = process.env.ANTHROPIC_API_KEY;
  if (!headers.length) return NextResponse.json({ mapping: {}, source: "local" });
  if (!key) return NextResponse.json({ mapping: localMap(headers), source: "local" });

  const prompt =
    `אתה ממפה עמודות של קובץ לקוחות לשדות המערכת של NEXUS.\n` +
    `שדות: ${FIELDS.join(", ")} (birth = תאריך לידה).\n` +
    `לפניך כותרות העמודות (לפי אינדקס שמתחיל מ-0) ושורת דוגמה. החזר אך ורק אובייקט JSON שממפה כל שדה לאינדקס העמודה המתאים, או null אם אין התאמה. הכותרות עשויות להיות בעברית או אנגלית.\n` +
    `כותרות: ${JSON.stringify(headers)}\n` +
    `דוגמה: ${JSON.stringify(body.sample ?? [])}\n` +
    `החזר רק JSON, למשל: {"name":0,"age":1,"gender":2,"birth":3,"phone":null,"status":null}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6", max_tokens: 300, messages: [{ role: "user", content: prompt }] }),
    });
    if (!res.ok) return NextResponse.json({ mapping: localMap(headers), source: "local" });
    const data = await res.json();
    const text: string = data?.content?.map((c: { text?: string }) => c.text || "").join("") || "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return NextResponse.json({ mapping: localMap(headers), source: "local" });
    const parsed = JSON.parse(match[0]) as Record<string, number | null>;
    // keep only known fields, coerce to number|null
    const mapping: Record<string, number | null> = {};
    for (const f of FIELDS) {
      const v = parsed[f];
      mapping[f] = typeof v === "number" && v >= 0 && v < headers.length ? v : null;
    }
    return NextResponse.json({ mapping, source: "ai" });
  } catch {
    return NextResponse.json({ mapping: localMap(headers), source: "local" });
  }
}
