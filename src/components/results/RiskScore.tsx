import { Card } from "@/components/ui/card";
import { PredictionResult } from "@/types/assessment";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  result: PredictionResult;
}

const RiskScore = ({ result }: Props) => {
  const { riskLevel, probability, confidence, stage } = result;

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getRiskIcon = () => {
    switch (riskLevel) {
      case 'low': return <CheckCircle className="h-16 w-16" />;
      case 'medium': return <AlertCircle className="h-16 w-16" />;
      case 'high': return <AlertTriangle className="h-16 w-16" />;
    }
  };

  const getRiskLabel = () => {
    switch (riskLevel) {
      case 'low': return 'Low Risk';
      case 'medium': return 'Medium Risk';
      case 'high': return 'High Risk';
    }
  };

  return (
    <Card className={`p-8 border-2 ${getRiskColor()}`}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          {getRiskIcon()}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-2">{getRiskLabel()}</h2>
          <p className="text-lg mb-4">
            {(probability * 100).toFixed(1)}% probability of endometriosis
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Prediction Confidence</p>
              <p className="text-2xl font-bold">{(confidence * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="font-semibold">Predicted Stage</p>
              <p className="text-2xl font-bold">
                {stage === 0 ? 'N/A' : `Stage ${stage}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RiskScore;
