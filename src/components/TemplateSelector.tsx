import React from 'react';
import { templates } from '../templates';
import { Variable } from '../types';

interface Props {
  onSelect: (variables: Variable[], formula: string) => void;
}

export function TemplateSelector({ onSelect }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Templates</h2>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <button
              key={template.id}
              onClick={() => onSelect(template.variables, template.formula)}
              className="flex items-start gap-3 p-3 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Icon className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}