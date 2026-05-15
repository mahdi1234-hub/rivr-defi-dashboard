import { Router } from "express";
import type { Request, Response } from "express";

const chatRouter = Router();

const SYSTEM_PROMPT = `You are RIVR AI, an expert DeFi assistant for the RIVR protocol — a next-generation DeFi platform featuring smart vaults, liquid staking, NFT-backed assets, and fluid asset streaming.

IMPORTANT: You must ALWAYS respond with a valid JSON object in this exact structure:
{
  "reasoning": [
    { "title": "Step title", "items": ["item 1", "item 2"] },
    { "title": "Step title", "items": ["item 1", "item 2"] }
  ],
  "message": "Your main response here (plain text, max 200 words)",
  "sources": [
    { "href": "https://example.com", "title": "Source Title", "description": "Brief description of the source" }
  ]
}

Rules:
- Always include 2–3 reasoning steps that show how you are thinking through the user's question.
- The "message" field is your actual response — clear, concise, DeFi-focused.
- Include "sources" ONLY when the question involves a specific company, protocol, product, or topic that has real public web pages (e.g. Ethereum, Uniswap, Coinbase, Aave, etc.). Use real, accurate URLs. Leave "sources" as an empty array [] if not applicable.
- Never wrap the JSON in markdown code blocks. Return raw JSON only.`;

chatRouter.post("/chat", async (req: Request, res: Response) => {
  const { messages } = req.body as {
    messages: { role: string; content: string }[];
  };

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Cerebras API key not configured" });
    return;
  }

  try {
    const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama3.1-8b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 800,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      req.log.error({ status: response.status, err }, "Cerebras API error");
      res.status(502).json({ error: "AI service error" });
      return;
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };

    const raw = data.choices?.[0]?.message?.content ?? "{}";

    let parsed: {
      reasoning?: { title: string; items: string[] }[];
      message?: string;
      sources?: { href: string; title: string; description: string }[];
    } = {};

    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { message: raw, reasoning: [], sources: [] };
    }

    res.json({
      message: parsed.message ?? "",
      reasoning: parsed.reasoning ?? [],
      sources: parsed.sources ?? [],
    });
  } catch (err) {
    req.log.error({ err }, "Chat route error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default chatRouter;
