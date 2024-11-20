import React from 'react';
import { DistributionInfo } from '../types';
import { Info } from 'lucide-react';

interface Props {
  info: DistributionInfo;
}

export function DistributionInfoCard({ info }: Props) {
  return (
    <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
      <div className="flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-blue-900">{info.description}</p>
          <p className="text-blue-700 mt-1">
            <strong>Example uses:</strong> {info.example}
          </p>
        </div>
      </div>
    </div>
  );
}