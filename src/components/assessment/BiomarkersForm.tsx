import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AssessmentData } from "@/types/assessment";
import { ArrowLeft, CheckCircle } from "lucide-react";

interface Props {
  data: Partial<AssessmentData>;
  onUpdate: (data: Partial<AssessmentData>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const BiomarkersForm = ({ data, onUpdate, onSubmit, onBack }: Props) => {
  const [formData, setFormData] = useState({
    ca125Level: data.ca125Level || '',
    crpLevel: data.crpLevel || ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onUpdate({
      ca125Level: parseFloat(formData.ca125Level as string) || 0,
      crpLevel: parseFloat(formData.crpLevel as string) || 0
    });
    onSubmit();
  };

  const isValid = formData.ca125Level && formData.crpLevel;

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold mb-2 text-foreground">Biomarkers & Lab Results</h2>
      <p className="text-muted-foreground mb-6">
        Enter your recent blood test results if available
      </p>

      <div className="space-y-6">
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            These are optional but improve prediction accuracy. If you don't have recent lab results, 
            you can enter typical values or skip by entering 0.
          </p>
        </div>

        <div>
          <Label htmlFor="ca125">CA-125 Level (U/mL) *</Label>
          <Input
            id="ca125"
            type="number"
            value={formData.ca125Level}
            onChange={(e) => handleChange('ca125Level', e.target.value)}
            placeholder="e.g., 35 (normal: <35 U/mL)"
            step="0.1"
            min="0"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Normal range: {"<"}35 U/mL. Elevated levels may indicate endometriosis.
          </p>
        </div>

        <div>
          <Label htmlFor="crp">C-Reactive Protein (CRP) Level (mg/L) *</Label>
          <Input
            id="crp"
            type="number"
            value={formData.crpLevel}
            onChange={(e) => handleChange('crpLevel', e.target.value)}
            placeholder="e.g., 3 (normal: <10 mg/L)"
            step="0.1"
            min="0"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Normal range: {"<"}10 mg/L. Inflammation marker that may be elevated.
          </p>
        </div>

        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-foreground mb-2">Before You Submit</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Double-check all entered values for accuracy</li>
            <li>• This assessment is for informational purposes only</li>
            <li>• Results should not replace professional medical advice</li>
            <li>• Consult a healthcare provider for diagnosis and treatment</li>
          </ul>
        </div>

        <div className="flex justify-between pt-4">
          <Button onClick={onBack} variant="outline" size="lg">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid} size="lg">
            <CheckCircle className="mr-2 h-5 w-5" />
            Complete Assessment
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BiomarkersForm;
