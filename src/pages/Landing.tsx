import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Activity, Brain, FileText, ShieldCheck, TrendingUp } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b border-border bg-card">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">EndoAI</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/assessment">Start Assessment</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            AI-Powered Endometriosis Risk Assessment
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Advanced machine learning analysis to help identify potential endometriosis risk factors 
            based on your symptoms, medical history, and biomarkers.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/assessment">
                <Activity className="mr-2 h-5 w-5" />
                Take Assessment
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <Brain className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">AI-Powered Analysis</h3>
            <p className="text-muted-foreground">
              Machine learning model trained on clinical data to provide accurate risk predictions.
            </p>
          </Card>
          
          <Card className="p-6">
            <TrendingUp className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">Visual Insights</h3>
            <p className="text-muted-foreground">
              Detailed charts showing which factors contribute most to your risk assessment.
            </p>
          </Card>
          
          <Card className="p-6">
            <FileText className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">PDF Reports</h3>
            <p className="text-muted-foreground">
              Export comprehensive reports to share with your healthcare provider.
            </p>
          </Card>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4 text-foreground">Your Privacy Matters</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All assessments are stored locally on your device. Your medical information 
            never leaves your browser unless you choose to export it.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>This tool is for informational purposes only and should not replace professional medical advice.</p>
          <p className="mt-2">© 2025 EndoAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
