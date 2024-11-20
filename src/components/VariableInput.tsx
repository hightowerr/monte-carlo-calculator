import React from 'react';
import { Variable, DistributionType } from '../types';
import { Settings, Trash2 } from 'lucide-react';
import { distributionInfo } from '../utils/distributions';
import { DistributionInfoCard } from './DistributionInfo';

interface Props {
  variable: Variable;
  onChange: (updated: Variable) => void;
  onDelete: () => void;
}

export function VariableInput({ variable, onChange, onDelete }: Props) {
  const handleNumberInput = (
    key: keyof Variable['params'],
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onChange({
        ...variable,
        params: { ...variable.params, [key]: numValue }
      });
    }
  };

  const info = distributionInfo[variable.distribution];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <input
          type="text"
          value={variable.name}
          onChange={(e) => onChange({ ...variable, name: e.target.value })}
          className="text-lg font-medium bg-transparent border-b border-gray-200 focus:border-blue-500 focus:outline-none"
          placeholder="Variable name"
        />
        <div className="flex gap-2">
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-100 text-red-500 rounded-full transition-colors"
            title="Delete variable"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Distribution Type</label>
        <select
          value={variable.distribution}
          onChange={(e) => onChange({
            ...variable,
            distribution: e.target.value as DistributionType,
            params: {} // Reset params when distribution changes
          })}
          className="w-full px-3 py-2 border rounded-md bg-white"
        >
          {Object.entries(distributionInfo).map(([key, info]) => (
            <option key={key} value={key}>{info.name}</option>
          ))}
        </select>
        <DistributionInfoCard info={info} />
      </div>

      <div className="space-y-3">
        {info.params.map(param => (
          <div key={param.key}>
            <label className="block text-sm text-gray-600 mb-1">
              {param.name}
              <span className="text-gray-400 ml-1">({param.description})</span>
            </label>
            <input
              type="number"
              min={param.min}
              value={variable.params[param.key] ?? param.defaultValue}
              onChange={(e) => handleNumberInput(param.key, e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}