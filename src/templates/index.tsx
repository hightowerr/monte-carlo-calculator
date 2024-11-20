import { Template } from '../types';
import { MousePointerClick, BarChart3, TrendingUp, ShoppingCart, Timer, DollarSign } from 'lucide-react';

export const templates: Template[] = [
  {
    id: 'conversion-rate',
    name: 'Web Conversion Rate',
    description: 'Calculate conversion rate based on page visits and click-through rate',
    icon: MousePointerClick,
    variables: [
      {
        id: crypto.randomUUID(),
        name: 'pageVisits',
        distribution: 'normal',
        params: {
          mean: 1000,
          stdDev: 100
        }
      },
      {
        id: crypto.randomUUID(),
        name: 'clickRate',
        distribution: 'triangular',
        params: {
          min: 0.01,
          max: 0.05,
          mode: 0.025
        }
      }
    ],
    formula: 'pageVisits * clickRate'
  },
  {
    id: 'sales-forecast',
    name: 'Sales Forecast',
    description: 'Predict sales based on historical data and growth rate',
    icon: TrendingUp,
    variables: [
      {
        id: crypto.randomUUID(),
        name: 'baseSales',
        distribution: 'normal',
        params: {
          mean: 10000,
          stdDev: 1000
        }
      },
      {
        id: crypto.randomUUID(),
        name: 'growthRate',
        distribution: 'triangular',
        params: {
          min: 0.05,
          max: 0.15,
          mode: 0.1
        }
      }
    ],
    formula: 'baseSales * (1 + growthRate)'
  }
];