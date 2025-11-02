import React from 'react';

/**
 * ResourceRow component - Individual resource allocation bar
 * Height proportional to hours, draggable, selectable
 */
function ResourceRow({
  allocation,
  index,
  totalInGroup,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onDragStart,
  weekWidth,
}) {
  // Calculate bar dimensions
  // Height formula: (hours / 40) * 64px
  const barHeight = (allocation.hoursPerWeek / 40) * 64;
  const barWidth = allocation.weeks * weekWidth - 8;
  const barLeft = allocation.startWeek * weekWidth + 4;

  // Label for resource (show index if multiple in group)
  const label = totalInGroup > 1
    ? `${allocation.role} ${index + 1}`
    : allocation.role;

  return (
    <div className="relative h-20">
      {/* Left sidebar with resource label */}
      <div className="absolute left-0 w-48 h-full flex items-center px-4">
        <div className="text-sm">
          <div className="font-medium text-gray-300 truncate">{label}</div>
          <div className="text-xs text-gray-500">{allocation.hoursPerWeek}h/week</div>
        </div>
      </div>

      {/* Resource bar */}
      <div
        className={`absolute top-2 rounded cursor-move transition-all duration-300 ease-out ${
          isSelected
            ? 'ring-4 ring-yellow-400'
            : isHovered
            ? 'ring-2 ring-white scale-105'
            : ''
        }`}
        style={{
          left: barLeft,
          width: barWidth,
          height: barHeight,
          backgroundColor: allocation.color,
        }}
        onClick={() => onSelect(allocation.id)}
        onMouseEnter={() => onHover(allocation.id)}
        onMouseLeave={() => onHover(null)}
        onMouseDown={(e) => onDragStart(allocation.id, e)}
      >
        {/* Bar content */}
        <div className="p-2 text-white text-sm font-semibold flex items-center justify-between h-full">
          <span className="truncate">{allocation.role}</span>
          <span className="ml-2 whitespace-nowrap">{allocation.hoursPerWeek}h</span>
        </div>
      </div>
    </div>
  );
}

export default ResourceRow;
