import { NextResponse } from "next/server";

export const runtime = "edge";

type Kind = "title" | "hashtags" | "promo" | "campaign";

type Body = {
  kind?: Kind;
  title?: string;
  genres?: string[];
  category?: string;
  city?: string;
  location?: string;
  time?: string;
  date?: string;
  age?: string;
  promoterName?: string;
  fromPrice?: string;
  channel?: string;
};

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

function facts(b: Body): string {
  return [
    b.title && `שם האירוע: ${b.title}`,
    b.category && `סוג: ${b.category}`,
    b.genres?.length && `ז'אנרים: ${b.genres.join(", ")}`,
    (b.location || b.city) && `מיקום: ${[b.location, b.city].filter(Boolean).join(", ")}`,
    b.date && `תאריך: ${b.date}`,
    b.time && `פתיחת דלתות: ${b.time}`,
    b.fromPrice && `מחיר החל מ-₪${b.fromPrice}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Local fallbacks so every kind works without an API key. */
function localCopy(b: Body): string {
  const g = b.genres?.[0] || "Techno";
  const place = b.city || "Tel Aviv";
  switch (b.kind) {
    case "title":
      return `${g} Nights · ${place}`;
    case "hashtags":
      return [
        "#נקסוס",
        "#חיי_לילה",
        `#${(b.city || "תלאביב").replace(/\s/g, "")}`,
        ...(b.genres || ["מסיבה"]).map((x) => `#${x.replace(/\s/g, "")}`),
        "#מסיבה",
        "#נקסוס_איוונטס",
      ]
        .slice(0, 8)
        .join(" ");
    case "campaign":
      return (
        `🔥 ${b.title || "האירוע הקרוב שלנו"} כבר כאן!${b.city ? ` ${b.city}` : ""}${b.date ? ` · ${b.date}` : ""}.\n` +
        `כרטיסים אחרונים במחירי הזמנה מוקדמת — שריינו עכשיו לפני שאוזל. לינק בהודעה 👇`
      );
    case "promo":
    default:
      return (
        `🔥 ${b.promoterName ? b.promoterName + ", " : ""}בא לי שתהיו שם!\n` +
        `${b.title || "האירוע של העונה"}${b.date ? ` · ${b.date}` : ""}${b.location || b.city ? ` · ${b.location || b.city}` : ""}.\n` +
        `כרטיסים דרך הלינק האישי שלי — כמות מוגבלת, אל תפספסו 👇`
      );
  }
}

function buildPrompt(b: Body): string {
  const persona = `אתה קופירייטר של פלטפורמת חיי לילה ישראלית בשם NEXUS. טון אנרגטי, צעיר ומזמין. החזר רק את התוצאה עצמה בעברית, בלי הסברים.`;
  switch (b.kind) {
    case "title":
      return `${persona}\nהצע שם קצר, קליט ומגניב לאירוע (2-5 מילים, אפשר שילוב אנגלית). בלי מירכאות. החזר שם אחד בלבד.\n\nפרטי האירוע:\n${facts(b)}`;
    case "hashtags":
      return `${persona}\nצור 6-8 האשטגים בעברית (ואם מתאים גם באנגלית) לקידום האירוע ברשתות. הפרד ברווחים, כל אחד מתחיל ב-#, בלי רווחים בתוך האשטג. החזר שורה אחת בלבד.\n\nפרטי האירוע:\n${facts(b)}`;
    case "campaign":
      return `${persona}\nכתוב הודעת קמפיין שיווקית קצרה לשליחה ב-${b.channel || "פוש"} ללקוחות קיימים. 1-2 שורות, אנרגטי, עם קריאה לפעולה ברורה לרכישת כרטיסים. אפשר 1-2 אימוג'י. ${b.channel === "SMS" ? "עד 160 תווים." : ""} החזר רק את הטקסט.\n\nפרטי האירוע:\n${facts(b)}`;
    case "promo":
    default:
      return `${persona}\nכתוב הודעת שיתוף קצרה בסגנון וואטסאפ שיחצן ישלח ללקוחות כדי למכור כרטיסים${b.promoterName ? ` (שם היחצן: ${b.promoterName})` : ""}. 2-3 שורות, אנרגטי, עם קריאה לפעולה ללחוץ על הלינק האישי. אפשר 1-2 אימוג'י.\n\nפרטי האירוע:\n${facts(b)}`;
  }
}

/**
 * General NEXUS copywriter. POST { kind: "title" | "hashtags" | "promo", ...fields }
 * → Hebrew marketing copy from Claude, with a local fallback when no key is set.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Body;
  const key = process.env.ANTHROPIC_API_KEY;

  if (!key) {
    return NextResponse.json({ text: localCopy(body), source: "local" });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        messages: [{ role: "user", content: buildPrompt(body) }],
      }),
    });
    if (!res.ok) return NextResponse.json({ text: localCopy(body), source: "local" });
    const data = await res.json();
    const text: string =
      data?.content?.map((c: { text?: string }) => c.text || "").join("").trim() || localCopy(body);
    return NextResponse.json({ text, source: "ai", model: MODEL });
  } catch {
    return NextResponse.json({ text: localCopy(body), source: "local" });
  }
}
