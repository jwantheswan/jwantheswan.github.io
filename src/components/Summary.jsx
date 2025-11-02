import React from 'react';

/**
 * Summary component - Project stats and cost breakdown by role
 */
function Summary({ allocations, hourlyRate, roles }) {
  // Calculate totals
  const totalAllocations = Object.keys(
    allocations.reduce((acc, a) => {
      acc[a.groupId] = true;
      return acc;
    }, {})
  ).length;

  const totalHours = allocations.reduce((sum, a) => sum + a.hoursPerWeek * a.weeks, 0);
  const totalCost = totalHours * hourlyRate;

  const uniqueRoles = [...new Set(allocations.map(a => a.role))];

  // Calculate cost by role
  const costByRole = allocations.reduce((acc, allocation) => {
    const cost = allocation.hoursPerWeek * allocation.weeks * hourlyRate;
    acc[allocation.role] = (acc[allocation.role] || 0) + cost;
    return acc;
  }, {});

  // Sort roles by cost descending
  const sortedRoles = Object.entries(costByRole)
    .sort(([, a], [, b]) => b - a)
    .map(([role, cost]) => ({
      role,
      cost,
      color: roles.find(r => r.name === role)?.color || '#3b82f6',
    }));

  const maxCost = Math.max(...sortedRoles.map(r => r.cost), 1);

  // Format cost in thousands
  const formatCost = (cost) => {
    if (cost >= 1000) {
      return `$${(cost / 1000).toFixed(1)}k`;
    }
    return `$${cost.toFixed(0)}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 animate-fadeIn">
      <h2 className="text-xl font-bold mb-4">Project Summary</h2>

      <div className="grid grid-cols-2 gap-8">
        {/* Left: Project stats */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Project Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-300">Total Allocations</span>
              <span className="font-semibold">{totalAllocations}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-300">Total Hours</span>
              <span className="font-semibold">{totalHours}h</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-300">Total Cost</span>
              <span className="font-semibold text-blue-400">${totalCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-300">Unique Roles</span>
              <span className="font-semibold">{uniqueRoles.length}</span>
            </div>
          </div>
        </div>

        {/* Right: Cost by role */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Cost by Role</h3>
          <div className="space-y-3">
            {sortedRoles.length === 0 ? (
              <p className="text-gray-500 text-sm">No allocations yet</p>
            ) : (
              sortedRoles.map(({ role, cost, color }) => (
                <div key={role} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 truncate max-w-[128px]" title={role}>
                      {role}
                    </span>
                    <span className="font-semibold">{formatCost(cost)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${(cost / maxCost) * 100}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
