import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, Loader2 } from "lucide-react";
import { AssessmentHistory } from "@/types/assessment";
import { pipeline } from "@huggingface/transformers";

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

    const contextPrompt = `You are a helpful medical assistant specializing in endometriosis. 
The patient has completed a risk assessment with the following results:
- Risk Level: ${assessment.result.riskLevel}
- Probability: ${Math.round(assessment.result.probability * 100)}%
- Confidence: ${Math.round(assessment.result.confidence * 100)}%
- Stage: ${assessment.result.stage}
- Key Contributing Factors: ${assessment.result.factors.slice(0, 3).map(f => f.feature).join(", ")}
- Recommendations: ${assessment.result.recommendations.join("; ")}

Answer the patient's question about their assessment or endometriosis in general. Be concise, supportive, and informative.

Question: ${userMessage}

Answer:`;

    try {
      const output = await generatorRef.current(contextPrompt, {
        max_new_tokens: 150,
        temperature: 0.7,
        do_sample: true,
      });
      return output[0].generated_text;
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
