import React, { useState, useCallback } from 'react';
import { evaluate, parse } from 'mathjs';
import { PlusCircle, Play, Calculator } from 'lucide-react';
import { Variable, SimulationResult } from './types';
import { VariableInput } from './components/VariableInput';
import { ResultsChart } from './components/ResultsChart';
import { TemplateSelector } from './components/TemplateSelector';
import { 
  normalRandom, 
  uniformRandom, 
  triangularRandom, 
  exponentialRandom,
  lognormalRandom,
  weibullRandom,
  calculatePercentile,
  distributionInfo
} from './utils/distributions';

function App() {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [formula, setFormula] = useState('');
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [iterations, setIterations] = useState(10000);
  const [error, setError] = useState<string | null>(null);

  const addVariable = () => {
    const newVar: Variable = {
      id: crypto.randomUUID(),
      name: `var${variables.length + 1}`,
      distribution: 'normal',
      params: {}
    };
    setVariables([...variables, newVar]);
  };

  const updateVariable = (id: string, updated: Variable) => {
    setVariables(variables.map(v => v.id === id ? updated : v));
    setError(null);
  };

  const deleteVariable = (id: string) => {
    setVariables(variables.filter(v => v.id !== id));
    setError(null);
  };

  const handleTemplateSelect = (templateVars: Variable[], templateFormula: string) => {
    setVariables(templateVars);
    setFormula(templateFormula);
    setError(null);
    setResults(null);
  };

  const validateFormula = (formula: string, variableNames: string[]): boolean => {
    try {
      const parsedFormula = parse(formula);
      const usedVariables = new Set<string>();
      parsedFormula.traverse((node: any) => {
        if (node.type === 'SymbolNode') {
          usedVariables.add(node.name);
        }
      });

      const undefinedVariables = Array.from(usedVariables)
        .filter(name => !variableNames.includes(name));

      if (undefinedVariables.length > 0) {
        setError(`Undefined variables in formula: ${undefinedVariables.join(', ')}`);
        return false;
      }

      return true;
    } catch (err) {
      setError(`Invalid formula: ${err instanceof Error ? err.message : 'Syntax error'}`);
      return false;
    }
  };

  const generateRandomValue = (variable: Variable): number => {
    const { distribution, params } = variable;
    switch (distribution) {
      case 'normal':
        return normalRandom(params.mean ?? 0, params.stdDev ?? 1);
      case 'uniform':
        return uniformRandom(params.min ?? 0, params.max ?? 1);
      case 'triangular':
        return triangularRandom(params.min ?? 0, params.max ?? 1, params.mode ?? 0.5);
      case 'exponential':
        return exponentialRandom(params.rate ?? 1);
      case 'lognormal':
        return lognormalRandom(params.mean ?? 0, params.stdDev ?? 1);
      case 'weibull':
        return weibullRandom(params.shape ?? 1, params.scale ?? 1);
      default:
        return 0;
    }
  };

  const runSimulation = useCallback(() => {
    setError(null);
    if (!formula.trim()) {
      setError('Please enter a formula');
      return;
    }
    
    const variableNames = variables.map(v => v.name);
    if (!validateFormula(formula, variableNames)) {
      return;
    }
    
    const results: number[] = [];
    let errorCount = 0;
    
    for (let i = 0; i < iterations; i++) {
      const scope: { [key: string]: number } = {};
      
      variables.forEach(variable => {
        scope[variable.name] = generateRandomValue(variable);
      });

      try {
        const result = evaluate(formula, scope);
        if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
          results.push(result);
        } else {
          errorCount++;
        }
      } catch (error) {
        errorCount++;
        if (errorCount === 1) {
          console.error('Error evaluating formula:', error);
        }
      }
    }

    if (results.length === 0) {
      setError('No valid results generated. Please check your formula and variable ranges.');
      return;
    }

    if (errorCount > 0) {
      setError(`Warning: ${errorCount} iterations failed to evaluate. Results shown are from successful iterations only.`);
    }

    const mean = results.reduce((a, b) => a + b, 0) / results.length;
    const median = calculatePercentile(results, 50);

    const percentiles: { [key: number]: number } = {};
    [5, 25, 50, 75, 95].forEach(p => {
      percentiles[p] = calculatePercentile(results, p);
    });

    setResults({ mean, median, percentiles, data: results });
  }, [formula, variables, iterations]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Monte Carlo Calculator</h1>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Iterations</label>
              <input
                type="number"
                min="100"
                max="100000"
                value={iterations}
                onChange={(e) => setIterations(Math.max(100, Math.min(100000, parseInt(e.target.value) || 100)))}
                className="w-32 px-3 py-2 border rounded-md"
              />
            </div>
            <button
              onClick={runSimulation}
              disabled={!formula.trim() || variables.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={18} />
              Run Simulation
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 space-y-4">
            <TemplateSelector onSelect={handleTemplateSelect} />
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Variables</h2>
                <button
                  onClick={addVariable}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                >
                  <PlusCircle size={18} />
                  Add Variable
                </button>
              </div>
              <div className="space-y-4">
                {variables.map(variable => (
                  <VariableInput
                    key={variable.id}
                    variable={variable}
                    onChange={(updated) => updateVariable(variable.id, updated)}
                    onDelete={() => deleteVariable(variable.id)}
                  />
                ))}
                {variables.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Add variables to use in your formula or select a template above
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-2 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Formula</h2>
              <textarea
                value={formula}
                onChange={(e) => {
                  setFormula(e.target.value);
                  setError(null);
                }}
                placeholder="Enter your formula using variable names (e.g., pageVisits * clickRate)"
                className="w-full h-32 px-3 py-2 border rounded-md resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                Use mathematical operators (+, -, *, /) and variable names in your formula
              </p>
            </div>

            {results && <ResultsChart results={results} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;