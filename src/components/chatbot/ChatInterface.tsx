import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, Loader2 } from "lucide-react";
import { AssessmentHistory } from "@/types/assessment";
import { pipeline } from "@huggingface/transformers";
import { buildResultExplanation } from "./utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  assessment: AssessmentHistory;
  onClose: () => void;
}

// Lightweight medical knowledge base (used to ground responses)
const knowledgeBase = [
  {
    title: "Common Symptoms",
    keywords: ["pain", "period", "cramps", "pelvic", "dyspareunia", "sex", "bowel", "urinary", "fatigue"],
    content:
      "Endometriosis symptoms often include severe period pain (dysmenorrhea), chronic pelvic pain, pain with sex (dyspareunia), bowel or urinary pain around periods, heavy bleeding, spotting, bloating, and fatigue. Severity doesn't always match disease extent.",
  },
  {
    title: "Risk Factors",
    keywords: ["family", "genetic", "relative", "age", "menarche", "early", "short", "cycle", "bmi", "infertility", "ca125", "crp"],
    content:
      "Higher risk is associated with a family history in first‑degree relatives, early menarche, shorter cycles, low BMI in some studies, and certain inflammatory markers (e.g., elevated CRP) though CA‑125 is supportive not diagnostic.",
  },
  {
    title: "Diagnosis",
    keywords: ["diagnosis", "confirm", "scan", "ultrasound", "mri", "laparoscopy", "stage"],
    content:
      "Definitive diagnosis is via laparoscopy, but many cases are managed based on clinical features and imaging. Transvaginal ultrasound or MRI can detect ovarian endometriomas and deep disease; staging ranges I–IV and does not equal pain severity.",
  },
  {
    title: "First‑line Management",
    keywords: ["treatment", "manage", "pain relief", "nsaid", "hormone", "ocp", "pill", "progestin", "iud"],
    content:
      "First‑line options include NSAIDs for pain and hormonal suppression (combined oral contraceptives, continuous regimens; progestins like norethindrone or dienogest; levonorgestrel IUD). Tailor to symptoms, side‑effects, and pregnancy plans.",
  },
  {
    title: "Fertility Considerations",
    keywords: ["fertility", "pregnancy", "infertility", "conception", "ivf"],
    content:
      "For those trying to conceive, referral to a gynecologist or fertility specialist is recommended. Options include timed intercourse guidance, surgical management in selected cases, or assisted reproduction (e.g., IVF) depending on age and stage.",
  },
  {
    title: "When to Seek Care",
    keywords: ["urgent", "warning", "severe", "bleeding", "fever", "pregnant"],
    content:
      "Seek prompt medical care for severe uncontrolled pain, heavy bleeding causing weakness, fever with pelvic pain, new severe bowel/urinary symptoms, or if pregnant with abdominal pain.",
  },
  {
    title: "Lifestyle & Self‑care",
    keywords: ["diet", "exercise", "sleep", "stress", "heat", "physio"],
    content:
      "Many benefit from pelvic floor physiotherapy, gentle exercise, heat therapy, sleep hygiene, stress reduction, and anti‑inflammatory dietary patterns. Track symptoms to see what helps.",
  },
  {
    title: "Follow‑up & Next Steps",
    keywords: ["next", "follow", "referral", "specialist", "plan"],
    content:
      "Document symptom patterns, try first‑line therapies, and arrange follow‑up. Consider referral to an endometriosis‑experienced clinician if pain persists or fertility is a goal.",
  },
] as const;

const ChatInterface = ({ assessment, onClose }: Props) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm here to help you understand your endometriosis risk assessment. Your risk level is ${assessment.result.riskLevel} (${Math.round(assessment.result.probability * 100)}% probability). Feel free to ask me any questions about your results or endometriosis in general.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const generatorRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const loadModel = async () => {
      try {
        generatorRef.current = await pipeline(
          "text2text-generation",
          "Xenova/LaMini-Flan-T5-77M"
        );
        setModelLoading(false);
      } catch (error) {
        console.error("Failed to load model:", error);
        setModelLoading(false);
        // Show error message to user
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm having trouble loading the AI model. This might be due to a slow connection. Please refresh the page to try again, or ask your questions and I'll do my best to help based on your assessment results.",
          },
        ]);
      }
    };
    loadModel();
  }, []);

  const generateResponse = async (userMessage: string): Promise<string> => {
    if (!generatorRef.current) {
      return "AI model is still loading, please wait a moment...";
    }

    // Build patient-specific facts
    const patientSummary = `Risk Level: ${assessment.result.riskLevel} | Probability: ${Math.round(
      assessment.result.probability * 100
    )}% | Confidence: ${Math.round(assessment.result.confidence * 100)}% | Stage: ${assessment.result.stage}\nTop Factors: ${assessment.result.factors
      .slice(0, 3)
      .map((f) => f.feature)
      .join(", ")}\nRecommendations: ${assessment.result.recommendations.join("; ")}`;

    // Select relevant knowledge snippets (simple keyword scoring)
    const q = userMessage.toLowerCase();
    const ranked = (knowledgeBase as readonly any[])
      .map((doc) => ({
        doc,
        score: (doc.keywords as string[]).reduce((s, k) => s + (q.includes(k) ? 1 : 0), 0),
      }))
      .sort((a, b) => b.score - a.score);
    const topDocs = ranked.slice(0, 3).map((r) => r.doc);
    const docsText = topDocs
      .map((d: any, i: number) => `(${i + 1}) ${d.title}: ${d.content}`)
      .join("\n\n");

    // Recent conversation for context (skip the initial greeting)
    const convo = messages
      .slice(1)
      .slice(-4)
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const contextPrompt = `You are a helpful medical assistant specializing in endometriosis.\n\n` +
      `Follow these rules strictly:\n` +
      `- Base answers on the Patient Summary and Context below.\n` +
      `- If information is insufficient or question is unrelated, say so briefly and suggest a next step.\n` +
      `- Keep answers concise, structured, and actionable. Use bullet points when listing.\n` +
      `- Avoid definitive diagnoses. Add one short safety note at the end: 'This is not a diagnosis.'\n\n` +
      `Patient Summary:\n${patientSummary}\n\n` +
      `Context:\n${docsText || "(No specific context matched; answer using general endometriosis knowledge)"}\n\n` +
      (convo ? `Conversation so far:\n${convo}\n\n` : "") +
      `Question: ${userMessage}\n\nAnswer:`;

    try {
      const output = await generatorRef.current(contextPrompt, {
        max_new_tokens: 220,
        temperature: 0.6,
        do_sample: true,
      });
      let text = output[0].generated_text as string;
      const idx = text.lastIndexOf("Answer:");
      if (idx !== -1) text = text.slice(idx + 7).trim();
      return text.trim();
    } catch (error) {
      console.error("Generation error:", error);
      return "I apologize, but I'm having trouble generating a response. Please try rephrasing your question.";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || modelLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Instant explanation path for result-related queries
    const qLower = userMessage.content.trim().toLowerCase();
    const wantsExplanation =
      (/(\bexplain\b|\bsummary\b|\bsummarize\b|\bsummarise\b|\binterpret\b|break\s*down|detail(s)?)/.test(qLower) &&
        /(\bresult\b|\bassessment\b|\breport\b|\bscore\b)/.test(qLower)) ||
      [
        "explain my result",
        "explain result",
        "explain the result",
        "tell me about my result",
        "explain my assessment",
        "summarize my result",
        "summary of my result",
      ].some((p) => qLower.includes(p));

    if (wantsExplanation) {
      const assistantMessage: Message = {
        role: "assistant",
        content: buildResultExplanation(assessment),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await generateResponse(userMessage.content);
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-md shadow-lg">
      <div className="p-4 border-b border-border flex justify-between items-center bg-primary text-primary-foreground">
        <h3 className="font-semibold">Assessment Assistant</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-primary-foreground hover:bg-primary/80"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {modelLoading && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading AI model... (30-60 seconds on first use)</span>
            </div>
          )}
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your assessment..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" disabled={isLoading || modelLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
