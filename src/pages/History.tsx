import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAssessmentHistory, clearHistory } from "@/utils/storage";
import { Home, Eye, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const History = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [history, setHistory] = useState(getAssessmentHistory());

  const handleViewAssessment = (assessment: any) => {
    navigate('/results', { state: { assessment } });
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all assessment history? This action cannot be undone.")) {
      clearHistory();
      setHistory([]);
      toast({
        title: "History Cleared",
        description: "All assessment history has been deleted.",
      });
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'default';
      case 'moderate':
        return 'secondary';
      case 'high':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Assessment History</span>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Assessment History</h1>
            <p className="text-muted-foreground">
              {history.length} {history.length === 1 ? 'assessment' : 'assessments'} recorded
            </p>
          </div>
          {history.length > 0 && (
            <Button variant="outline" onClick={handleClearHistory}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear History
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Assessments Yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't completed any assessments yet. Take your first assessment to see it here.
            </p>
            <Button asChild>
              <Link to="/assessment">Start Assessment</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((assessment) => (
              <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        Assessment - {new Date(assessment.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </CardTitle>
                      <CardDescription>
                        {new Date(assessment.date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </CardDescription>
                    </div>
                    <Badge variant={getRiskBadgeVariant(assessment.result.riskLevel)}>
                      {assessment.result.riskLevel} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Probability</p>
                      <p className="text-lg font-semibold">
                        {(assessment.result.probability * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <p className="text-lg font-semibold">
                        {(assessment.result.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Predicted Stage</p>
                      <p className="text-lg font-semibold">
                        Stage {assessment.result.stage}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => handleViewAssessment(assessment)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Full Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button asChild>
            <Link to="/assessment">Take New Assessment</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default History;
