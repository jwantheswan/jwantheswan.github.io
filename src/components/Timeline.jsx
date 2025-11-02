import React from 'react';

/**
 * Timeline component - Week headers and vertical grid lines
 */
function Timeline({ weeks, weekWidth }) {
  return (
    <div className="relative mb-4">
      {/* Week headers */}
      <div className="flex" style={{ marginLeft: '192px' }}>
        {weeks.map(week => (
          <div
            key={week}
            className="text-center text-sm font-semibold text-gray-400 border-l border-gray-700 first:border-l-0"
            style={{ width: `${weekWidth}px` }}
          >
            Week {week}
          </div>
        ))}
      </div>

      {/* Vertical grid lines */}
      <div className="absolute top-8 bottom-0 left-0 right-0 pointer-events-none" style={{ marginLeft: '192px' }}>
        {weeks.map(week => (
          <div
            key={week}
            className="absolute top-0 bottom-0 border-l border-gray-700/50"
            style={{ left: `${week * weekWidth}px` }}
          />
        ))}
      </div>
    </div>
  );
}

export default Timeline;
