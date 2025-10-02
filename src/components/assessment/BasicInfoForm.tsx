import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AssessmentData } from "@/types/assessment";
import { ArrowRight } from "lucide-react";

interface Props {
  data: Partial<AssessmentData>;
  onUpdate: (data: Partial<AssessmentData>) => void;
  onNext: () => void;
}

const BasicInfoForm = ({ data, onUpdate, onNext }: Props) => {
  const [formData, setFormData] = useState({
    age: data.age || '',
    weight: '',
    height: '',
    bmi: data.bmi || '',
    cycleLength: data.cycleLength || '',
    ageOfMenarche: data.ageOfMenarche || ''
  });

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const handleChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value };
    
    // Auto-calculate BMI
    if ((field === 'weight' || field === 'height') && updated.weight && updated.height) {
      const weight = parseFloat(updated.weight);
      const height = parseFloat(updated.height);
      if (weight > 0 && height > 0) {
        updated.bmi = calculateBMI(weight, height);
      }
    }
    
    setFormData(updated);
  };

  const handleNext = () => {
    onUpdate({
      age: parseInt(formData.age as string),
      bmi: parseFloat(formData.bmi as string),
      cycleLength: parseInt(formData.cycleLength as string),
      ageOfMenarche: parseInt(formData.ageOfMenarche as string)
    });
    onNext();
  };

  const isValid = formData.age && formData.bmi && formData.cycleLength && formData.ageOfMenarche;

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold mb-2 text-foreground">Basic Information</h2>
      <p className="text-muted-foreground mb-6">
        Let's start with some basic health information
      </p>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              placeholder="e.g., 28"
              min="18"
              max="60"
            />
          </div>

          <div>
            <Label htmlFor="ageOfMenarche">Age at First Period *</Label>
            <Input
              id="ageOfMenarche"
              type="number"
              value={formData.ageOfMenarche}
              onChange={(e) => handleChange('ageOfMenarche', e.target.value)}
              placeholder="e.g., 13"
              min="8"
              max="18"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              placeholder="e.g., 65"
              step="0.1"
            />
          </div>

          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => handleChange('height', e.target.value)}
              placeholder="e.g., 165"
              step="0.1"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bmi">BMI *</Label>
            <Input
              id="bmi"
              type="number"
              value={formData.bmi}
              onChange={(e) => handleChange('bmi', e.target.value)}
              placeholder="Auto-calculated or enter manually"
              step="0.1"
            />
          </div>

          <div>
            <Label htmlFor="cycleLength">Menstrual Cycle Length (days) *</Label>
            <Input
              id="cycleLength"
              type="number"
              value={formData.cycleLength}
              onChange={(e) => handleChange('cycleLength', e.target.value)}
              placeholder="e.g., 28"
              min="20"
              max="40"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleNext} disabled={!isValid} size="lg">
            Next Step
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoForm;
