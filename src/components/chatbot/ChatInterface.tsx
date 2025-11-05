import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X } from "lucide-react";
import { AssessmentHistory } from "@/types/assessment";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  assessment: AssessmentHistory;
  onClose: () => void;
}

const ChatInterface = ({ assessment, onClose }: Props) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm here to help you understand your endometriosis risk assessment. Your risk level is ${assessment.result.riskLevel} (${Math.round(assessment.result.probability * 100)}% probability). Feel free to ask me any questions about your results or endometriosis in general.`,
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Risk level questions
    if (lowerMessage.includes("risk") && (lowerMessage.includes("what") || lowerMessage.includes("mean"))) {
      return `Your risk level is ${assessment.result.riskLevel} with a probability of ${Math.round(assessment.result.probability * 100)}%. This means ${
        assessment.result.riskLevel === "low" 
          ? "you have a lower likelihood of endometriosis based on the factors assessed."
          : assessment.result.riskLevel === "medium"
          ? "you have some risk factors that suggest you should monitor your symptoms and consult with a healthcare provider."
          : "you have several risk factors that warrant medical consultation for proper diagnosis and treatment options."
      }`;
    }

    // Contributing factors
    if (lowerMessage.includes("factor") || lowerMessage.includes("contribute")) {
      const topFactors = assessment.result.factors
        .sort((a, b) => b.impact - a.impact)
        .slice(0, 3)
        .map(f => `${f.feature} (${Math.round(f.impact * 100)}% impact)`)
        .join(", ");
      return `The main factors contributing to your assessment are: ${topFactors}. These were identified based on your responses about symptoms, medical history, and biomarkers.`;
    }

    // Recommendations
    if (lowerMessage.includes("recommend") || lowerMessage.includes("should i") || lowerMessage.includes("next")) {
      return `Based on your assessment, I recommend: ${assessment.result.recommendations.slice(0, 2).join(" ")} Would you like more details about any specific recommendation?`;
    }

    // Symptoms
    if (lowerMessage.includes("symptom")) {
      return "Endometriosis symptoms can include pelvic pain, painful periods, pain during intercourse, heavy menstrual bleeding, and fertility issues. The severity and combination of symptoms vary greatly between individuals. If you're experiencing concerning symptoms, please consult a healthcare provider.";
    }

    // Treatment
    if (lowerMessage.includes("treatment") || lowerMessage.includes("cure")) {
      return "While there's no cure for endometriosis, treatments include pain medication, hormone therapy, and in some cases, surgery. Treatment plans are individualized based on symptoms, severity, and whether you're trying to conceive. A gynecologist specializing in endometriosis can help determine the best approach for your situation.";
    }

    // Confidence
    if (lowerMessage.includes("confidence") || lowerMessage.includes("accurate")) {
      return `The confidence level of your assessment is ${Math.round(assessment.result.confidence * 100)}%. This AI-powered tool analyzes multiple factors, but it's designed for informational purposes only. Always consult with a qualified healthcare provider for proper diagnosis and treatment.`;
    }

    // General endometriosis info
    if (lowerMessage.includes("what is endometriosis") || lowerMessage.includes("endometriosis is")) {
      return "Endometriosis is a condition where tissue similar to the uterine lining grows outside the uterus, commonly on ovaries, fallopian tubes, and pelvic tissues. This can cause pain, inflammation, and fertility issues. It affects approximately 10% of women of reproductive age.";
    }

    // Default response
    return "I can help you understand your assessment results, explain endometriosis risk factors, discuss symptoms, and provide information about next steps. What would you like to know more about?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: generateResponse(input),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);

    setInput("");
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
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
