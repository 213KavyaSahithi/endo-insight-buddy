import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ShieldCheck, Brain, AlertTriangle, HelpCircle } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            EndoAI
          </Link>
          <nav className="flex gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/assessment">
              <Button>Start Assessment</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            About EndoAI
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            An AI-powered tool designed to help assess endometriosis risk using clinical data and machine learning.
          </p>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                <CardTitle>How It Works</CardTitle>
              </div>
              <CardDescription>
                Understanding the assessment process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">1. Data Collection</h3>
                <p className="text-muted-foreground">
                  You provide information about your age, symptoms, medical history, and optional biomarker data.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">2. Risk Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI model analyzes your data against clinical patterns and research-based risk factors for endometriosis.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">3. Visual Results</h3>
                <p className="text-muted-foreground">
                  You receive a risk assessment with visual insights showing which factors contribute most to your result, plus personalized recommendations.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Data & Privacy */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <CardTitle>Your Data & Privacy</CardTitle>
              </div>
              <CardDescription>
                Complete privacy, zero compromise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                All your assessment data is stored <strong>locally in your browser</strong> using localStorage. 
                No data is ever sent to external servers or databases.
              </p>
              <p className="text-muted-foreground">
                This means:
              </p>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                <li>Your information stays completely private on your device</li>
                <li>No account creation or personal information required</li>
                <li>You maintain full control over your data</li>
                <li>Clearing your browser data will remove all stored assessments</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Scientific Background */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                <CardTitle>Scientific Background</CardTitle>
              </div>
              <CardDescription>
                Evidence-based approach to risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Endometriosis is a chronic condition affecting approximately 10% of women of reproductive age. 
                Diagnosis often takes years due to the complexity of symptoms and the need for invasive procedures.
              </p>
              <p className="text-muted-foreground">
                This assessment tool uses a machine learning model trained on clinical research data, incorporating 
                known risk factors including:
              </p>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                <li>Symptom severity (dysmenorrhea, pelvic pain, dyspareunia)</li>
                <li>Family history of endometriosis</li>
                <li>Age of menarche and cycle characteristics</li>
                <li>Biomarkers like CA-125 and CRP levels</li>
                <li>Associated conditions and mental health factors</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Limitations */}
        <section className="mb-16">
          <Card className="border-warning">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-warning" />
                <CardTitle>Important Limitations</CardTitle>
              </div>
              <CardDescription>
                Please read carefully before using this tool
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-semibold text-warning">
                This tool is for informational purposes only and is NOT a medical diagnosis.
              </p>
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                <li>The risk assessment is based on statistical patterns and should not replace professional medical evaluation</li>
                <li>Only a qualified healthcare provider can diagnose endometriosis, typically through laparoscopy</li>
                <li>Individual circumstances may vary significantly from statistical predictions</li>
                <li>This tool cannot account for all possible factors affecting endometriosis risk</li>
              </ul>
              <p className="text-muted-foreground">
                <strong>Always consult with a healthcare professional</strong> if you have concerns about endometriosis or 
                experience persistent symptoms.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-primary" />
                <CardTitle>Frequently Asked Questions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">How accurate is this assessment?</h3>
                <p className="text-muted-foreground">
                  The model provides a statistical risk estimate based on research data. Accuracy varies by individual, 
                  and it should be used as a screening tool, not a definitive diagnosis.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Do I need biomarker data?</h3>
                <p className="text-muted-foreground">
                  No, biomarker data (CA-125, CRP) is optional. The assessment can work with symptoms and medical history alone, 
                  though biomarkers may improve accuracy.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Can I retake the assessment?</h3>
                <p className="text-muted-foreground">
                  Yes, you can take the assessment as many times as you like. Each assessment is saved in your browser history.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">What should I do with my results?</h3>
                <p className="text-muted-foreground">
                  Use the results as a conversation starter with your healthcare provider. Print or save the PDF report 
                  to share with your doctor.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="mx-auto max-w-2xl rounded-lg border bg-card p-8 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">Ready to Get Started?</h2>
            <p className="mb-6 text-muted-foreground">
              Take the assessment now to receive your personalized endometriosis risk analysis.
            </p>
            <Link to="/assessment">
              <Button size="lg">Start Assessment</Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            This tool is for informational purposes only and does not constitute medical advice.
          </p>
          <p>&copy; 2025 EndoAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
