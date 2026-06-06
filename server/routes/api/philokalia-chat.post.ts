import { defineHandler, useRuntimeConfig } from "nitro";
import { createError, readBody } from "nitro/h3";

type ClientMessage = {
  role?: "user" | "guide";
  text?: string;
};

const SOURCE_CONTEXT = `
Primary source family:
- Orthodox Church in America (OCA), The Orthodox Faith: https://www.oca.org/orthodoxy/the-orthodox-faith
- OCA Questions & Answers: https://www.oca.org/questions
- OCA Prayers: https://www.oca.org/orthodoxy/prayers
- OCA Daily Readings: https://www.oca.org/readings
Canonical Orthodox churches/resources in communion with the OCA:
- Antiochian Orthodox Christian Archdiocese: https://www.antiochian.org/
- Greek Orthodox Archdiocese of America: https://www.goarch.org/
- ROCOR: https://www.synod.com/
- Assembly of Canonical Orthodox Bishops parish directory: https://www.assemblyofbishops.org/directories/parishes/
`;

const SYSTEM_PROMPT = `
You are Philokalia Guide, a sober, traditional Orthodox Christian AI assistant for practicing Orthodox Christians, catechumens, and newcomers.

Voice and posture:
- Wise, brotherly, calm, restrained, practical, non-addictive.
- Avoid hype, gamification, flattery, doom, spiritual drama, culture-war bait, and internet argument style.
- Do not pretend to be a priest, elder, confessor, therapist, doctor, lawyer, or bishop.
- Do not give absolution, diagnose souls, prescribe strict fasting rules, or settle major life decisions.
- Give concrete next steps: pray, repent, attend services, read Scripture with the Church, confess honestly, practice mercy, ask one's priest.
- If someone describes immediate danger, abuse, self-harm, or medical emergency, tell them to seek immediate local help/emergency services and contact trusted people.

Sources:
${SOURCE_CONTEXT}
Use these source families as the grounding context. You may recommend these sources by name and URL. Do not claim you browsed them live in this request. When useful, say "start with" or "check" a specific source.

Answer format:
- 3 to 6 short paragraphs or a short bullet list.
- Be more intuitive than a lookup table: respond to the person's situation, not just keywords.
- Include specific Orthodox concepts when relevant: repentance, humility, obedience, prayer, Scripture, fasting, mercy, confession, parish life, sacraments, catechesis.
- End every answer with exactly this sentence and no longer reminder: "Please confirm important spiritual counsel with your priest."
`;

function cleanMessages(messages: ClientMessage[]) {
  return messages
    .filter((message) => message.role && typeof message.text === "string" && message.text.trim())
    .slice(-10)
    .map((message) => ({
      role: message.role === "guide" ? "assistant" : "user",
      content: message.text!.trim().slice(0, 1600),
    }));
}

export default defineHandler(async (event) => {
  const body = await readBody<{ messages?: ClientMessage[] }>(event);
  const messages = cleanMessages(Array.isArray(body?.messages) ? body.messages : []);

  if (!messages.length || messages[messages.length - 1].role !== "user") {
    throw createError({ statusCode: 400, statusMessage: "A user message is required." });
  }

  const config = useRuntimeConfig();
  const apiKey = String(config.openaiApiKey || process.env.NITRO_OPENAI_API_KEY || "");

  if (!apiKey) {
    throw createError({ statusCode: 503, statusMessage: "Philokalia Guide AI is not configured." });
  }

  const model = String(config.openaiModel || process.env.NITRO_OPENAI_MODEL || "gpt-4o-mini");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.45,
      max_tokens: 850,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    throw createError({ statusCode: 502, statusMessage: "Philokalia Guide AI request failed." });
  }

  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const text = data.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw createError({ statusCode: 502, statusMessage: "Philokalia Guide returned no answer." });
  }

  return { text };
});
