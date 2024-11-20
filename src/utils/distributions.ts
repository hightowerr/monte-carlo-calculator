export function normalRandom(mean: number, stdDev: number): number {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

export function uniformRandom(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function triangularRandom(min: number, max: number, mode: number): number {
  const F = (mode - min) / (max - min);
  const rand = Math.random();
  if (rand < F) {
    return min + Math.sqrt(rand * (max - min) * (mode - min));
  } else {
    return max - Math.sqrt((1 - rand) * (max - min) * (max - mode));
  }
}

export function exponentialRandom(rate: number): number {
  return -Math.log(1 - Math.random()) / rate;
}

export function lognormalRandom(mean: number, stdDev: number): number {
  const norm = normalRandom(0, 1);
  return Math.exp(mean + stdDev * norm);
}

export function weibullRandom(shape: number, scale: number): number {
  return scale * Math.pow(-Math.log(1 - Math.random()), 1 / shape);
}

export function calculatePercentile(data: number[], percentile: number): number {
  const sorted = [...data].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export const distributionInfo: Record<string, DistributionInfo> = {
  normal: {
    name: "Normal (Gaussian)",
    description: "Bell-shaped curve, symmetric around the mean. Good for natural phenomena, measurement errors, or any quantity influenced by many small random factors.",
    params: [
      { name: "Mean", key: "mean", description: "Center of the distribution", defaultValue: 100 },
      { name: "Standard Deviation", key: "stdDev", description: "Spread of values around the mean", min: 0, defaultValue: 10 }
    ],
    example: "Customer spending, height, weight"
  },
  uniform: {
    name: "Uniform",
    description: "All values between min and max are equally likely. Good for situations where any value in a range is equally probable.",
    params: [
      { name: "Minimum", key: "min", description: "Lowest possible value", defaultValue: 0 },
      { name: "Maximum", key: "max", description: "Highest possible value", defaultValue: 100 }
    ],
    example: "Random delays, processing times"
  },
  triangular: {
    name: "Triangular",
    description: "Values near the mode are more likely. Good for estimating when you know the minimum, maximum, and most likely value.",
    params: [
      { name: "Minimum", key: "min", description: "Lowest possible value", defaultValue: 0 },
      { name: "Maximum", key: "max", description: "Highest possible value", defaultValue: 100 },
      { name: "Mode", key: "mode", description: "Most likely value", defaultValue: 50 }
    ],
    example: "Project completion time, sales forecasts"
  },
  exponential: {
    name: "Exponential",
    description: "Models time between independent events. Values closer to zero are more likely.",
    params: [
      { name: "Rate", key: "rate", description: "Rate parameter (1/mean)", min: 0, defaultValue: 0.1 }
    ],
    example: "Time between customer arrivals, equipment failures"
  },
  lognormal: {
    name: "Log-normal",
    description: "Right-skewed distribution. Good for quantities that can't be negative and have occasional large values.",
    params: [
      { name: "Mean", key: "mean", description: "Mean of log values", defaultValue: 0 },
      { name: "Standard Deviation", key: "stdDev", description: "Standard deviation of log values", min: 0, defaultValue: 0.5 }
    ],
    example: "Asset prices, income distribution"
  },
  weibull: {
    name: "Weibull",
    description: "Flexible distribution for modeling failure rates and lifetime data.",
    params: [
      { name: "Shape", key: "shape", description: "Shape parameter", min: 0, defaultValue: 2 },
      { name: "Scale", key: "scale", description: "Scale parameter", min: 0, defaultValue: 1 }
    ],
    example: "Equipment lifetime, wind speeds"
  }
};