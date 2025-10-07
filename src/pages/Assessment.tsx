import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AssessmentData } from "@/types/assessment";
import { predictEndometriosisRisk } from "@/utils/prediction";
import { saveAssessment } from "@/utils/storage";

import BasicInfoForm from "@/components/assessment/BasicInfoForm";
import SymptomsForm from "@/components/assessment/SymptomsForm";
import BiomarkersForm from "@/components/assessment/BiomarkersForm";
import { useToast } from "@/hooks/use-toast";

const Assessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<AssessmentData>>({});

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const updateFormData = (data: Partial<AssessmentData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    // Validate all required fields
    const completeData = formData as AssessmentData;
    
    if (!completeData.age || !completeData.bmi) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }

    // Generate prediction
    const result = predictEndometriosisRisk(completeData);

    // Save to history
    const assessment = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      data: completeData,
      result
    };
    saveAssessment(assessment);

    // Navigate to results
    navigate('/results', { state: { assessment } });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">EndoAI Assessment</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress */}
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* Form Steps */}
        {step === 1 && (
          <BasicInfoForm 
            data={formData} 
            onUpdate={updateFormData} 
            onNext={handleNext}
          />
        )}

        {step === 2 && (
          <SymptomsForm 
            data={formData} 
            onUpdate={updateFormData} 
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 3 && (
          <BiomarkersForm 
            data={formData} 
            onUpdate={updateFormData} 
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
};

export default Assessment;
