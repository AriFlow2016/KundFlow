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
export default function Pipeline({ stages, totalValue }: PipelineProps): import("react/jsx-runtime").JSX.Element;
export {};
