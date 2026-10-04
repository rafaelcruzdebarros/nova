import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;
const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY não foi configurada. A página abrirá, mas a IA não responderá.");
}

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];

    if (!messages.length) {
      return res.status(400).json({ error: "Nenhuma mensagem enviada." });
    }

    if (!ai) {
      return res.status(500).json({
        error: "A chave da API não foi configurada. Crie um arquivo .env com GEMINI_API_KEY."
      });
    }

    const safeMessages = messages
      .slice(-12)
      .filter(
        m =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content.slice(0, 6000) }]
      }));

    const response = await ai.models.generateContent({
      model,
      contents: safeMessages,
      config: {
        systemInstruction: `Você é a Nova, uma assistente de IA amigável e inteligente dentro de um aplicativo de chat.
Responda em português, de forma clara, útil e natural.
Importante: a interface do aplicativo pode mudar o fundo e outros elementos visuais de acordo com o humor detectado na conversa. Quando o usuário perguntar se você muda de cor, explique que o aplicativo pode mudar a cor automaticamente conforme o clima da conversa; não diga que a IA não pode mudar de cor nem atribua a mudança apenas ao sistema operacional.
Não invente que você controla diretamente o CSS ou o computador. A mudança visual é feita pelo aplicativo.`
      }
    });

    res.json({
      answer: response.text || "Não consegui gerar uma resposta."
    });
  } catch (error) {
    console.error("Erro Gemini:", error);
    res.status(500).json({
      error: "Erro ao falar com a IA. Verifique sua chave Gemini, conexão, modelo e acesso à API."
    });
  }
});

app.listen(port, () => {
  console.log(`Mini ChatGPT V2 com Gemini: http://localhost:${port}`);
});
