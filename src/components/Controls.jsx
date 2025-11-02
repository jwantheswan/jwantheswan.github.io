import React from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Controls component - 4 control boxes for adjusting selected resource
 * Shows Duration, Hours, Role, and Start Week with arrow buttons
 */
function Controls({ selectedAllocation, onAdjustWeeks, onAdjustStartWeek, onCycleRole, onAdjustHours, roles }) {
  const isDisabled = !selectedAllocation;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6 animate-slideIn">
      {/* Duration Control */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="text-sm text-gray-400 mb-2">Duration</div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => onAdjustWeeks(selectedAllocation?.id, -1)}
            disabled={isDisabled}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-lg font-semibold">
            {selectedAllocation ? `${selectedAllocation.weeks}w` : '-'}
          </span>
          <button
            onClick={() => onAdjustWeeks(selectedAllocation?.id, 1)}
            disabled={isDisabled}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Hours Control */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="text-sm text-gray-400 mb-2">Hours</div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => onAdjustHours(selectedAllocation?.id, -5)}
            disabled={isDisabled}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronDown size={16} />
          </button>
          <span className="text-lg font-semibold">
            {selectedAllocation ? `${selectedAllocation.hoursPerWeek}h` : '-'}
          </span>
          <button
            onClick={() => onAdjustHours(selectedAllocation?.id, 5)}
            disabled={isDisabled}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronUp size={16} />
          </button>
        </div>
      </div>

      {/* Role Control */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="text-sm text-gray-400 mb-2">Role</div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => onCycleRole(selectedAllocation?.id, -1)}
            disabled={isDisabled}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold truncate max-w-[100px]" title={selectedAllocation?.role}>
            {selectedAllocation ? selectedAllocation.role : '-'}
          </span>
          <button
            onClick={() => onCycleRole(selectedAllocation?.id, 1)}
            disabled={isDisabled}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Start Week Control */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="text-sm text-gray-400 mb-2">Start Week</div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => onAdjustStartWeek(selectedAllocation?.id, -1)}
            disabled={isDisabled}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-lg font-semibold">
            {selectedAllocation !== null ? `W${selectedAllocation.startWeek}` : '-'}
          </span>
          <button
            onClick={() => onAdjustStartWeek(selectedAllocation?.id, 1)}
            disabled={isDisabled}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Controls;
