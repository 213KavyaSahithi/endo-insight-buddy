import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { AssessmentData } from "@/types/assessment";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface Props {
  data: Partial<AssessmentData>;
  onUpdate: (data: Partial<AssessmentData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SymptomsForm = ({ data, onUpdate, onNext, onBack }: Props) => {
  const [formData, setFormData] = useState({
    dysmenorrheaScore: data.dysmenorrheaScore ?? 5,
    pelvicPainScore: data.pelvicPainScore ?? 5,
    dyspareuniaScore: data.dyspareuniaScore ?? 5,
    dscheziaScore: data.dscheziaScore ?? 5,
    urinarySymptomsScore: data.urinarySymptomsScore ?? 5,
    mentalHealthScore: data.mentalHealthScore ?? 5,
    familyHistory: data.familyHistory ?? false,
    infertilityStatus: data.infertilityStatus ?? false
  });

  const handleSliderChange = (field: keyof typeof formData, value: number[]) => {
    setFormData(prev => ({ ...prev, [field]: value[0] }));
  };

  const handleSwitchChange = (field: keyof typeof formData, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleNext = () => {
    onUpdate(formData);
    onNext();
  };

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold mb-2 text-foreground">Symptoms & History</h2>
      <p className="text-muted-foreground mb-6">
        Rate your symptoms on a scale of 0-10 (0 = none, 10 = severe)
      </p>

      <div className="space-y-8">
        {/* Pain Symptoms */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-foreground">Pain Symptoms</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Menstrual Cramps (Dysmenorrhea)</Label>
              <span className="text-sm font-medium text-primary">{formData.dysmenorrheaScore}/10</span>
            </div>
            <Slider
              value={[formData.dysmenorrheaScore]}
              onValueChange={(v) => handleSliderChange('dysmenorrheaScore', v)}
              max={10}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Pelvic Pain (non-menstrual)</Label>
              <span className="text-sm font-medium text-primary">{formData.pelvicPainScore}/10</span>
            </div>
            <Slider
              value={[formData.pelvicPainScore]}
              onValueChange={(v) => handleSliderChange('pelvicPainScore', v)}
              max={10}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Pain During Intercourse (Dyspareunia)</Label>
              <span className="text-sm font-medium text-primary">{formData.dyspareuniaScore}/10</span>
            </div>
            <Slider
              value={[formData.dyspareuniaScore]}
              onValueChange={(v) => handleSliderChange('dyspareuniaScore', v)}
              max={10}
              step={1}
            />
          </div>
        </div>

        {/* Other Symptoms */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-foreground">Other Symptoms</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Painful Bowel Movements (Dyschezia)</Label>
              <span className="text-sm font-medium text-primary">{formData.dscheziaScore}/10</span>
            </div>
            <Slider
              value={[formData.dscheziaScore]}
              onValueChange={(v) => handleSliderChange('dscheziaScore', v)}
              max={10}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Urinary Symptoms</Label>
              <span className="text-sm font-medium text-primary">{formData.urinarySymptomsScore}/10</span>
            </div>
            <Slider
              value={[formData.urinarySymptomsScore]}
              onValueChange={(v) => handleSliderChange('urinarySymptomsScore', v)}
              max={10}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Mental Health Impact</Label>
              <span className="text-sm font-medium text-primary">{formData.mentalHealthScore}/10</span>
            </div>
            <Slider
              value={[formData.mentalHealthScore]}
              onValueChange={(v) => handleSliderChange('mentalHealthScore', v)}
              max={10}
              step={1}
            />
          </div>
        </div>

        {/* Medical History */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-foreground">Medical History</h3>
          
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <Label htmlFor="familyHistory" className="cursor-pointer">
              Family History of Endometriosis
            </Label>
            <Switch
              id="familyHistory"
              checked={formData.familyHistory}
              onCheckedChange={(checked) => handleSwitchChange('familyHistory', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <Label htmlFor="infertility" className="cursor-pointer">
              History of Infertility
            </Label>
            <Switch
              id="infertility"
              checked={formData.infertilityStatus}
              onCheckedChange={(checked) => handleSwitchChange('infertilityStatus', checked)}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button onClick={onBack} variant="outline" size="lg">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          <Button onClick={handleNext} size="lg">
            Next Step
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SymptomsForm;

