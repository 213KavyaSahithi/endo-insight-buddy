import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface Props {
  recommendations: string[];
}

const Recommendations = ({ recommendations }: Props) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Recommended Next Steps</h2>
      <p className="text-muted-foreground mb-6">
        Based on your assessment, consider the following actions
      </p>

      <ul className="space-y-3">
        {recommendations.map((rec, idx) => (
          <li key={idx} className="flex gap-3">
            <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-foreground">{rec}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default Recommendations;
