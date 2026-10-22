
"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Language = "en" | "hi" | "kn";
type Message = {
  role: "assistant" | "user";
  text: string;
  intent?: string;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

const copy = {
  en: {
    eyebrow: "YOUR DIGITAL FARMING COMPANION",
    title: "Smarter decisions for a healthier farm.",
    subtitle:
      "Ask about crops, soil, irrigation, or plant care. Start with a crop name for the most useful answer.",
    label: "Response language",
    greeting:
      "Hello! I'm your Smart Farming Assistant. Ask me about rice, wheat, tomato, cotton, or maize.",
    placeholder: "e.g. How should I care for rice?",
    send: "Send question",
    suggestions: ["Soil for rice", "Watering tomatoes", "Cotton pest care"],
    crops: "Explore crop topics",
    cropsSub: "Choose a crop to get started",
    status: "API connection",
    connected: "Connected",
    disconnected: "Not connected",
    footer:
      "Prototype for learning and demonstration. Confirm important decisions with local agricultural experts.",
    assistant: "FARMING ASSISTANT",
    you: "YOU",
    thinking: "Checking farming information…",
    networkError:
      "The backend is unavailable. Showing a local demo answer instead. Start FastAPI and check its API endpoint for live AI answers.",
    cropDescriptions: [
      "Water and field management",
      "Soil and growth stages",
      "Moisture and plant health",
      "Field scouting",
      "Growth and irrigation",
    ],
  },
  hi: {
    eyebrow: "आपका डिजिटल कृषि साथी",
    title: "बेहतर खेती के लिए बेहतर निर्णय।",
    subtitle: "फसल, मिट्टी, सिंचाई या पौधों की देखभाल के बारे में पूछें।",
    label: "उत्तर की भाषा",
    greeting:
      "नमस्ते! मैं आपका स्मार्ट फार्मिंग असिस्टेंट हूँ। आप धान, गेहूं, टमाटर, कपास या मक्का के बारे में पूछ सकते हैं।",
    placeholder: "उदाहरण: धान की देखभाल कैसे करें?",
    send: "सवाल भेजें",
    suggestions: ["Soil for rice", "Tomato water", "Cotton pest care"],
    crops: "फसल के विषय",
    cropsSub: "शुरू करने के लिए फसल चुनें",
    status: "API कनेक्शन",
    connected: "जुड़ा हुआ",
    disconnected: "कनेक्ट नहीं है",
    footer: "यह सीखने और प्रदर्शन के लिए एक प्रोटोटाइप है।",
    assistant: "कृषि सहायक",
    you: "आप",
    thinking: "कृषि जानकारी देख रहे हैं…",
    networkError:
      "बैकएंड उपलब्ध नहीं है। स्थानीय डेमो उत्तर दिखाया जा रहा है।",
    cropDescriptions: [
      "पानी और खेत प्रबंधन",
      "मिट्टी और विकास चरण",
      "नमी और पौधों का स्वास्थ्य",
      "खेत की निगरानी",
      "विकास और सिंचाई",
    ],
  },
  kn: {
    eyebrow: "ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಕೃಷಿ ಸಹಾಯಕ",
    title: "ಆರೋಗ್ಯಕರ ಕೃಷಿಗಾಗಿ ಉತ್ತಮ ನಿರ್ಧಾರಗಳು.",
    subtitle: "ಬೆಳೆ, ಮಣ್ಣು, ನೀರಾವರಿ ಅಥವಾ ಸಸ್ಯಗಳ ಪಾಲನೆ ಕುರಿತು ಪ್ರಶ್ನೆ ಕೇಳಿ.",
    label: "ಉತ್ತರದ ಭಾಷೆ",
    greeting:
      "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಫಾರ್ಮಿಂಗ್ ಸಹಾಯಕ. ಭತ್ತ, ಗೋಧಿ, ಟೊಮೇಟೊ, ಹತ್ತಿ ಅಥವಾ ಮೆಕ್ಕೆಜೋಳದ ಬಗ್ಗೆ ಕೇಳಿ.",
    placeholder: "ಉದಾಹರಣೆ: ಭತ್ತವನ್ನು ಹೇಗೆ ಪಾಲಿಸಬೇಕು?",
    send: "ಪ್ರಶ್ನೆ ಕಳುಹಿಸಿ",
    suggestions: ["Soil for rice", "Watering tomatoes", "Cotton pest care"],
    crops: "ಬೆಳೆ ವಿಷಯಗಳು",
    cropsSub: "ಪ್ರಾರಂಭಿಸಲು ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    status: "API ಸಂಪರ್ಕ",
    connected: "ಸಂಪರ್ಕವಾಗಿದೆ",
    disconnected: "ಸಂಪರ್ಕ ಇಲ್ಲ",
    footer: "ಇದು ಕಲಿಕೆ ಮತ್ತು ಪ್ರದರ್ಶನಕ್ಕಾಗಿ ನಿರ್ಮಿಸಿದ ಮಾದರಿ.",
    assistant: "ಕೃಷಿ ಸಹಾಯಕ",
    you: "ನೀವು",
    thinking: "ಕೃಷಿ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ…",
    networkError:
      "ಬ್ಯಾಕೆಂಡ್ ಲಭ್ಯವಿಲ್ಲ. ಸ್ಥಳೀಯ ಡೆಮೊ ಉತ್ತರವನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ.",
    cropDescriptions: [
      "ನೀರು ಮತ್ತು ಹೊಲ ನಿರ್ವಹಣೆ",
      "ಮಣ್ಣು ಮತ್ತು ಬೆಳವಣಿಗೆ",
      "ತೇವಾಂಶ ಮತ್ತು ಸಸ್ಯ ಆರೋಗ್ಯ",
      "ಹೊಲದ ಪರಿಶೀಲನೆ",
      "ಬೆಳವಣಿಗೆ ಮತ್ತು ನೀರಾವರಿ",
    ],
  },
} as const;

const crops = [
  {
    name: "Rice",
    emoji: "🌾",
    prompt: "Tell me about rice soil, water, and care.",
  },
  {
    name: "Wheat",
    emoji: "🌿",
    prompt: "Tell me about wheat soil, water, and care.",
  },
  {
    name: "Tomato",
    emoji: "🍅",
    prompt: "How should I water tomato plants and care for them?",
  },
  {
    name: "Cotton",
    emoji: "☁️",
    prompt: "How should I monitor cotton pests and care for cotton?",
  },
  {
    name: "Maize",
    emoji: "🌽",
    prompt: "Tell me about maize soil, water, and care.",
  },
];

function localFarmingAnswer(question: string) {
  const q = question.toLowerCase();
  let crop = "your crop";
  if (/rice|paddy|వరి|धान|ಭತ್ತ/.test(q)) crop = "rice";
  else if (/wheat|गेहूं|ಗೋಧಿ/.test(q)) crop = "wheat";
  else if (/tomato|टमाटर|ಟೊಮೇಟೊ/.test(q)) crop = "tomato";
  else if (/cotton|कपास|ಹತ್ತಿ/.test(q)) crop = "cotton";
  else if (/maize|corn|मक्का|ಮೆಕ್ಕೆಜೋಳ/.test(q)) crop = "maize";

  if (/water|irrigat|నీరు|पानी|ನೀರು/.test(q)) {
    return {
      intent: "irrigation_demo",
      answer:
        `For ${crop}, check soil moisture before irrigating. Water needs depend on soil type, weather, crop variety, and growth stage. Avoid waterlogging and follow local agricultural recommendations.`,
    };
  }

  if (/pest|disease|insect|వ్యాధి|పురుగు|कीट|रोग/.test(q)) {
    return {
      intent: "pest_or_disease_demo",
      answer:
        `Inspect ${crop} leaves, stems, and nearby plants regularly. Note the visible symptoms and take a clear photo for identification. Use pesticides only after confirming the pest or disease and following local agricultural advice.`,
    };
  }

  if (/soil|మట్టి|मिट्टी|ಮಣ್ಣು/.test(q)) {
    return {
      intent: "soil_demo",
      answer:
        `For ${crop}, begin with a soil test to check pH and nutrient levels. Choose a suitable field with good drainage, and use fertilizer based on test results and local crop recommendations.`,
    };
  }

  if (/fertili[sz]|manure|ఎరువు|खाद|ಗೊಬ್ಬರ/.test(q)) {
    return {
      intent: "fertilizer_demo",
      answer:
        `For ${crop}, base fertilizer selection and quantity on a soil test, crop growth stage, and local agricultural guidance. Avoid applying more fertilizer than recommended.`,
    };
  }

  return {
    intent: "general_demo",
    answer:
      `For ${crop}, good farming starts with healthy soil, suitable seed, timely irrigation, regular pest monitoring, and balanced nutrients. Your local weather, soil test, and crop growth stage help determine the best practices.`,
  };
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);
  const t = copy[language];

  useEffect(() => {
    setMessages([{ role: "assistant", text: t.greeting }]);
  }, [language, t.greeting]);

  useEffect(() => {
    let active = true;

    async function checkBackend() {
      try {
        const response = await fetch(`${API_URL}/health`);
        if (active) setApiConnected(response.ok);
      } catch {
        if (active) setApiConnected(false);
      }
    }

    void checkBackend();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const message = text.trim();
    if (!message || loading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text: message },
    ]);
    setInput("");
    setLoading(true);

    try {
      // FastAPI chat endpoint
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, language }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned HTTP ${response.status}`);
      }

      const data = await response.json();

      // Support common backend response field names.
      const answer = data.answer ?? data.response ?? data.reply;
      if (typeof answer !== "string" || !answer.trim()) {
        throw new Error("Backend response did not contain an answer");
      }

      setApiConnected(true);
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: answer,
          intent: data.intent,
        },
      ]);
    } catch (error) {
      console.error("Chat request failed:", error);
      setApiConnected(false);

      // Keep the chat usable as a demo even if the backend/AI is down.
      const fallback = localFarmingAnswer(message);
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: `${fallback.answer}\n\n(${t.networkError})`,
          intent: fallback.intent,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <main className="page-shell">
      <nav className="topbar">
        <a className="brand" href="#" aria-label="Smart Farming Assistant home">
          <span className="brand-mark">✳</span>
          <span>
            harvest<span className="brand-light">wise</span>
          </span>
        </a>
        <div className="nav-right">
          <span
            className={`connection-dot ${
              apiConnected ? "online" : "offline"
            }`}
          />
          <span className="connection-text">
            {t.status}: {apiConnected ? t.connected : t.disconnected}
          </span>
          <label className="language-select">
            <span className="sr-only">{t.label}</span>
            <select
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as Language)
              }
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>
          </label>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            {t.eyebrow}
          </div>
          <h1>{t.title}</h1>
          <p className="hero-subtitle">{t.subtitle}</p>
          <div className="hero-tags">
            <span>✦ Crop guidance</span>
            <span>✦ Multilingual</span>
            <span>✦ Simple to use</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="sun" />
          <div className="hill hill-back" />
          <div className="hill hill-front" />
          <div className="field-lines">
            <i /><i /><i /><i /><i />
          </div>
          <div className="plant plant-one"><i /><i /><b /></div>
          <div className="plant plant-two"><i /><i /><b /></div>
          <div className="plant plant-three"><i /><i /><b /></div>
          <div className="art-label">
            <span>🌱</span>
            <div>
              <strong>Grow with confidence</strong>
              <small>Knowledge for every season</small>
            </div>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="chat-card">
          <div className="card-heading">
            <div className="heading-icon">✳</div>
            <div>
              <h2>Ask your farming assistant</h2>
              <p>Ask naturally. Start with a crop name.</p>
            </div>
            <span className="live-pill"><span /> LIVE DEMO</span>
          </div>

          <div className="chat-window" aria-live="polite">
            {messages.map((message, index) => (
              <div
                className={`message-row ${message.role}`}
                key={`${index}-${message.role}`}
              >
                {message.role === "assistant" && (
                  <div className="avatar assistant-avatar">✳</div>
                )}
                <div className="message-content">
                  <div className="message-name">
                    {message.role === "assistant" ? t.assistant : t.you}
                  </div>
                  <div
                    className={`bubble ${
                      message.role === "user"
                        ? "user-bubble"
                        : "assistant-bubble"
                    }`}
                  >
                    {message.text}
                  </div>
                  {message.intent && (
                    <span className="intent-tag">
                      Topic detected: {message.intent}
                    </span>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="avatar user-avatar">U</div>
                )}
              </div>
            ))}
            {loading && (
              <div className="loading-line">
                <span /><span /><span /> {t.thinking}
              </div>
            )}
            <div ref={chatEnd} />
          </div>

          <div className="suggestions">
            {t.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                disabled={loading}
                onClick={() => void sendMessage(suggestion)}
              >
                {suggestion}<span>↗</span>
              </button>
            ))}
          </div>

          <form className="composer" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t.placeholder}
              aria-label="Your farming question"
              maxLength={2000}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              {t.send}<span>➤</span>
            </button>
          </form>
          <p className="composer-hint">
            Press send to ask · Maximum 2,000 characters
          </p>
        </div>

        <aside className="side-column">
          <div className="side-card crop-card">
            <div className="side-title">
              <div>
                <span className="section-kicker">QUICK START</span>
                <h2>{t.crops}</h2>
              </div>
              <span className="title-spark">✳</span>
            </div>
            <p className="side-description">{t.cropsSub}</p>
            <div className="crop-list">
              {crops.map((crop, index) => (
                <button
                  className="crop-item"
                  key={crop.name}
                  disabled={loading}
                  onClick={() => void sendMessage(crop.prompt)}
                >
                  <span
                    className={`crop-emoji crop-${crop.name.toLowerCase()}`}
                  >
                    {crop.emoji}
                  </span>
                  <span className="crop-info">
                    <strong>{crop.name}</strong>
                    <small>{t.cropDescriptions[index]}</small>
                  </span>
                  <span className="crop-arrow">↗</span>
                </button>
              ))}
            </div>
          </div>

          <div className="side-card tip-card">
            <div className="tip-icon">✦</div>
            <div>
              <span className="section-kicker">FIELD NOTE</span>
              <h3>Every field is different.</h3>
              <p>
                Soil tests, local weather, crop variety, and growth stage help
                determine the right farming practice.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <footer className="footer">
        <span className="footer-mark">✳</span>
        <span>{t.footer}</span>
        <span className="footer-right">BUILT FOR BETTER HARVESTS</span>
      </footer>
    </main>
  );
}
