import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AssessmentHistory } from "@/types/assessment";
import { Heart, Download, Home, AlertCircle } from "lucide-react";
import RiskScore from "@/components/results/RiskScore";
import FactorsChart from "@/components/results/FactorsChart";
import Recommendations from "@/components/results/Recommendations";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const assessment = location.state?.assessment as AssessmentHistory;

  if (!assessment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Results Found</h2>
          <p className="text-muted-foreground mb-6">
            Please complete an assessment first.
          </p>
          <Button onClick={() => navigate('/assessment')}>Start Assessment</Button>
        </Card>
      </div>
    );
  }

  const { result } = assessment;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Assessment Results</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-2">
            Assessment Date: {new Date(assessment.date).toLocaleDateString()}
          </p>
          <h1 className="text-3xl font-bold text-foreground">
            Your Endometriosis Risk Assessment
          </h1>
        </div>

        <div className="space-y-6">
          <RiskScore result={result} />
          
          <FactorsChart factors={result.factors} />
          
          <Recommendations recommendations={result.recommendations} />

          <Card className="p-6 bg-muted border-accent">
            <h3 className="font-semibold text-foreground mb-2">Important Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              This AI-powered assessment is designed to provide informational insights only. 
              It should not be used as a substitute for professional medical diagnosis or treatment. 
              If you have concerns about endometriosis or related symptoms, please consult a 
              qualified healthcare provider for proper evaluation and care.
            </p>
          </Card>

          <div className="flex gap-4 justify-center pt-4">
            <Button variant="outline" onClick={() => navigate('/assessment')}>
              Take New Assessment
            </Button>
            <Button variant="outline" onClick={() => navigate('/history')}>
              View History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
