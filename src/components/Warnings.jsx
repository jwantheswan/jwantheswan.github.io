import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Warnings component - Shows over-allocation warnings
 */
function Warnings({ warnings }) {
  if (warnings.length === 0) return null;

  return (
    <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4 mb-6 animate-slideIn">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-500 mb-2">Over-Allocation Warnings</h3>
          <div className="space-y-1">
            {warnings.map(({ role, hours }) => (
              <div key={role} className="text-sm text-yellow-200">
                <strong>{role}:</strong> {hours}h/week total (over-allocated - consider splitting work)
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Warnings;
