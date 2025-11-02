import React from 'react';
import { ChevronDown, ChevronRight, ChevronUp, ChevronDown as ChevronDownIcon, Trash2 } from 'lucide-react';

/**
 * GroupHeader component - Shows group total with controls
 * Always rendered but fades to opacity-0 when single resource
 */
function GroupHeader({
  groupId,
  allocations,
  totalHours,
  weeks,
  startWeek,
  color,
  isCollapsed,
  isSingleResource,
  onToggleCollapse,
  onAdjustHours,
  onDelete,
  weekWidth,
}) {
  // Calculate bar dimensions
  const barWidth = weeks * weekWidth - 8;
  const barLeft = startWeek * weekWidth + 4;
  const barHeight = 64;

  return (
    <div className={`relative h-20 transition-opacity duration-300 ${isSingleResource ? 'opacity-0' : 'opacity-100'}`}>
      {/* Left sidebar with group info */}
      <div className="absolute left-0 w-48 h-full flex items-center px-4">
        <div className="text-sm">
          <div className="font-semibold text-gray-300">Group Total</div>
          <div className="text-xs text-gray-500">
            {totalHours}h · {weeks}w · {allocations.length} resource{allocations.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Dashed bar spanning timeline */}
      <div
        className="absolute top-2 border-2 border-dashed rounded transition-all duration-300"
        style={{
          left: barLeft,
          width: barWidth,
          height: barHeight,
          borderColor: `${color}66`, // 40% opacity
          backgroundColor: `${color}10`, // 6% opacity
        }}
      >
        {/* Hour adjustment arrows in center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 bg-gray-900/80 rounded p-1">
          <button
            onClick={() => onAdjustHours(groupId, 5)}
            className="p-1 rounded bg-gray-700 hover:bg-gray-600 transition-all"
            title="Increase hours"
          >
            <ChevronUp size={16} />
          </button>
          <button
            onClick={() => onAdjustHours(groupId, -5)}
            className="p-1 rounded bg-gray-700 hover:bg-gray-600 transition-all"
            title="Decrease hours"
          >
            <ChevronDownIcon size={16} />
          </button>
        </div>

        {/* Collapse/expand chevron (only visible if multiple resources) */}
        {!isSingleResource && (
          <button
            onClick={() => onToggleCollapse(groupId)}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 p-1 rounded bg-gray-900/80 hover:bg-gray-700 transition-all"
            title={isCollapsed ? 'Expand group' : 'Collapse group'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </button>
        )}

        {/* Delete button */}
        <button
          onClick={() => onDelete(groupId)}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 p-1 rounded bg-gray-900/80 hover:bg-red-600 transition-all"
          title="Delete group"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default GroupHeader;
