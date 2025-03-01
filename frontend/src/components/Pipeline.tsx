interface PipelineStage {
  name: string;
  value: number;
  count: number;
  color: string;
}

interface PipelineProps {
  stages: PipelineStage[];
  totalValue: number;
}

export default function Pipeline({ stages, totalValue }: PipelineProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Säljpipeline</h3>
      <div className="space-y-4">
        {stages.map((stage) => (
          <div key={stage.name}>
            <div className="flex items-center justify-between text-sm font-medium text-gray-900">
              <span>{stage.name}</span>
              <span>{stage.count} affärer | {stage.value.toLocaleString('sv-SE')} kr</span>
            </div>
            <div className="mt-1 relative">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                <div
                  style={{ width: `${(stage.value / totalValue) * 100}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${stage.color}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
