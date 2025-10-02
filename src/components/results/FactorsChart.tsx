import { Card } from "@/components/ui/card";
import { FeatureContribution } from "@/types/assessment";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  factors: FeatureContribution[];
}

const FactorsChart = ({ factors }: Props) => {
  const chartData = factors.map(f => ({
    name: f.feature,
    impact: f.impact,
    value: f.value
  }));

  const getBarColor = (impact: number) => {
    if (impact >= 20) return 'hsl(0, 84%, 60%)';
    if (impact >= 10) return 'hsl(40, 90%, 60%)';
    return 'hsl(340, 75%, 55%)';
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Contributing Factors</h2>
      <p className="text-muted-foreground mb-6">
        These factors contributed most to your risk assessment
      </p>

      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 35]} />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card p-3 border border-border rounded shadow-lg">
                      <p className="font-semibold text-foreground">{payload[0].payload.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Value: {payload[0].payload.value}
                      </p>
                      <p className="text-sm text-primary font-medium">
                        Impact: {payload[0].value}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.impact)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {factors.map((factor, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded">
            <div>
              <p className="font-medium text-foreground">{factor.feature}</p>
              <p className="text-sm text-muted-foreground">Value: {factor.value}</p>
            </div>
            <span className="text-primary font-bold">{factor.impact}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FactorsChart;
