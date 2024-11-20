export type DistributionType = 
  | 'normal' 
  | 'uniform' 
  | 'triangular'
  | 'exponential'
  | 'lognormal'
  | 'weibull';

export interface Variable {
  id: string;
  name: string;
  distribution: DistributionType;
  params: {
    mean?: number;
    stdDev?: number;
    min?: number;
    max?: number;
    mode?: number;
    rate?: number;
    shape?: number;
    scale?: number;
  };
}

export interface SimulationResult {
  mean: number;
  median: number;
  percentiles: { [key: number]: number };
  data: number[];
}

export interface DistributionInfo {
  name: string;
  description: string;
  params: {
    name: string;
    key: keyof Variable['params'];
    description: string;
    min?: number;
    defaultValue: number;
  }[];
  example: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  variables: Variable[];
  formula: string;
}