import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Undo2, Redo2 } from 'lucide-react';
import Controls from './components/Controls';
import Timeline from './components/Timeline';
import GroupHeader from './components/GroupHeader';
import ResourceRow from './components/ResourceRow';
import Summary from './components/Summary';
import Warnings from './components/Warnings';

// Constants
const HOURLY_RATE = 250;
const FULL_TIME_THRESHOLD = 40;
const OVER_ALLOCATION_WARNING = 80;
const WEEK_WIDTH = 80;

// Available roles with colors
const ROLES = [
  { name: 'Senior Developer', color: '#3b82f6' },
  { name: 'Junior Developer', color: '#8b5cf6' },
  { name: 'Designer', color: '#ec4899' },
  { name: 'Product Manager', color: '#f59e0b' },
  { name: 'QA Engineer', color: '#10b981' },
  { name: 'DevOps Engineer', color: '#06b6d4' },
];

// Generate weeks array (0-12)
const WEEKS = Array.from({ length: 13 }, (_, i) => i);

function App() {
  // State management
  const [allocations, setAllocations] = useState([]);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [hoveredAllocation, setHoveredAllocation] = useState(null);
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [nextGroupId, setNextGroupId] = useState(1);
  const [nextId, setNextId] = useState(1);
  const [dragStart, setDragStart] = useState(null);

  // Save state to history after changes
  const saveToHistory = useCallback((newAllocations) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newAllocations);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo/Redo keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          // Redo
          handleRedo();
        } else {
          // Undo
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setAllocations(history[historyIndex - 1]);
      setSelectedAllocation(null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setAllocations(history[historyIndex + 1]);
      setSelectedAllocation(null);
    }
  };

  // Add new allocation
  const handleAddAllocation = () => {
    const newGroupId = nextGroupId;
    const newId = nextId;

    const newAllocation = {
      id: newId,
      role: ROLES[0].name,
      weeks: 2,
      hoursPerWeek: 40,
      startWeek: 1,
      color: ROLES[0].color,
      groupId: newGroupId,
    };

    const newAllocations = [...allocations, newAllocation];
    setAllocations(newAllocations);
    setSelectedAllocation(newId);
    setNextGroupId(nextGroupId + 1);
    setNextId(nextId + 1);
    saveToHistory(newAllocations);
  };

  // Split resources when hours exceed 40
  const splitResourcesByHours = (groupId, totalHours, baseAllocation) => {
    const fullResources = Math.floor(totalHours / FULL_TIME_THRESHOLD);
    const remainingHours = totalHours % FULL_TIME_THRESHOLD;

    const newAllocations = [];
    let currentId = nextId;

    // Create full-time resources
    for (let i = 0; i < fullResources; i++) {
      newAllocations.push({
        ...baseAllocation,
        id: currentId++,
        hoursPerWeek: FULL_TIME_THRESHOLD,
        groupId,
      });
    }

    // Create partial resource if remaining hours
    if (remainingHours > 0) {
      newAllocations.push({
        ...baseAllocation,
        id: currentId++,
        hoursPerWeek: remainingHours,
        groupId,
      });
    }

    setNextId(currentId);
    return newAllocations;
  };

  // Adjust hours for a group
  const adjustHours = (groupId, delta) => {
    const groupAllocations = allocations.filter(a => a.groupId === groupId);
    if (groupAllocations.length === 0) return;

    const totalHours = groupAllocations.reduce((sum, a) => sum + a.hoursPerWeek, 0);
    const newTotalHours = Math.max(5, Math.min(200, totalHours + delta));

    if (newTotalHours === totalHours) return;

    const baseAllocation = groupAllocations[0];
    const otherAllocations = allocations.filter(a => a.groupId !== groupId);

    let newGroupAllocations;
    if (newTotalHours <= FULL_TIME_THRESHOLD) {
      // Merge to single resource
      newGroupAllocations = [{
        ...baseAllocation,
        hoursPerWeek: newTotalHours,
      }];
    } else {
      // Split into multiple resources
      newGroupAllocations = splitResourcesByHours(groupId, newTotalHours, baseAllocation);
    }

    const newAllocations = [...otherAllocations, ...newGroupAllocations];
    setAllocations(newAllocations);

    // Update selection to first resource in group
    if (selectedAllocation && groupAllocations.some(a => a.id === selectedAllocation)) {
      setSelectedAllocation(newGroupAllocations[0].id);
    }

    saveToHistory(newAllocations);
  };

  // Adjust weeks (duration)
  const adjustWeeks = (allocationId, delta) => {
    const allocation = allocations.find(a => a.id === allocationId);
    if (!allocation) return;

    const newWeeks = Math.max(1, Math.min(12, allocation.weeks + delta));
    if (newWeeks === allocation.weeks) return;

    // Adjust startWeek if necessary to keep within bounds
    const maxStartWeek = WEEKS.length - newWeeks;
    const newStartWeek = Math.min(allocation.startWeek, maxStartWeek);

    const newAllocations = allocations.map(a =>
      a.groupId === allocation.groupId
        ? { ...a, weeks: newWeeks, startWeek: newStartWeek }
        : a
    );

    setAllocations(newAllocations);
    saveToHistory(newAllocations);
  };

  // Adjust start week
  const adjustStartWeek = (allocationId, delta) => {
    const allocation = allocations.find(a => a.id === allocationId);
    if (!allocation) return;

    const newStartWeek = Math.max(0, Math.min(WEEKS.length - allocation.weeks, allocation.startWeek + delta));
    if (newStartWeek === allocation.startWeek) return;

    const newAllocations = allocations.map(a =>
      a.groupId === allocation.groupId
        ? { ...a, startWeek: newStartWeek }
        : a
    );

    setAllocations(newAllocations);
    saveToHistory(newAllocations);
  };

  // Cycle through roles
  const cycleRole = (allocationId, direction) => {
    const allocation = allocations.find(a => a.id === allocationId);
    if (!allocation) return;

    const currentIndex = ROLES.findIndex(r => r.name === allocation.role);
    const newIndex = (currentIndex + direction + ROLES.length) % ROLES.length;
    const newRole = ROLES[newIndex];

    const newAllocations = allocations.map(a =>
      a.groupId === allocation.groupId
        ? { ...a, role: newRole.name, color: newRole.color }
        : a
    );

    setAllocations(newAllocations);
    saveToHistory(newAllocations);
  };

  // Delete a group
  const deleteGroup = (groupId) => {
    const newAllocations = allocations.filter(a => a.groupId !== groupId);
    setAllocations(newAllocations);

    if (selectedAllocation && allocations.find(a => a.id === selectedAllocation)?.groupId === groupId) {
      setSelectedAllocation(null);
    }

    saveToHistory(newAllocations);
  };

  // Toggle group collapse
  const toggleGroupCollapse = (groupId) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupId)) {
      newCollapsed.delete(groupId);
    } else {
      newCollapsed.add(groupId);
    }
    setCollapsedGroups(newCollapsed);
  };

  // Drag to reposition
  const handleDragStart = (allocationId, e) => {
    const allocation = allocations.find(a => a.id === allocationId);
    if (!allocation) return;

    setIsDragging(true);
    setDragStart({
      allocationId,
      startX: e.clientX,
      originalStartWeek: allocation.startWeek,
    });
  };

  const handleDragMove = (e) => {
    if (!isDragging || !dragStart) return;

    const allocation = allocations.find(a => a.id === dragStart.allocationId);
    if (!allocation) return;

    const deltaX = e.clientX - dragStart.startX;
    const weeksDelta = Math.round(deltaX / WEEK_WIDTH);
    const newStartWeek = Math.max(0, Math.min(
      WEEKS.length - allocation.weeks,
      dragStart.originalStartWeek + weeksDelta
    ));

    // Update all resources in the group
    const newAllocations = allocations.map(a =>
      a.groupId === allocation.groupId
        ? { ...a, startWeek: newStartWeek }
        : a
    );

    setAllocations(newAllocations);
  };

  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragStart(null);
      saveToHistory(allocations);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, dragStart, allocations]);

  // Group allocations by groupId
  const groupedAllocations = allocations.reduce((acc, allocation) => {
    if (!acc[allocation.groupId]) {
      acc[allocation.groupId] = [];
    }
    acc[allocation.groupId].push(allocation);
    return acc;
  }, {});

  // Calculate warnings
  const roleHoursMap = {};
  allocations.forEach(allocation => {
    const totalHours = allocation.hoursPerWeek;
    roleHoursMap[allocation.role] = (roleHoursMap[allocation.role] || 0) + totalHours;
  });

  const warnings = Object.entries(roleHoursMap)
    .filter(([_, hours]) => hours > OVER_ALLOCATION_WARNING)
    .map(([role, hours]) => ({ role, hours }));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Resource Planner</h1>

          <div className="flex items-center gap-4">
            {/* Undo/Redo buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex === 0}
                className="p-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={20} />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
                className="p-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 size={20} />
              </button>
            </div>

            {/* Add Allocation button */}
            <button
              onClick={handleAddAllocation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-all"
            >
              <Plus size={20} />
              Add Allocation
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Controls */}
        <Controls
          selectedAllocation={allocations.find(a => a.id === selectedAllocation)}
          onAdjustWeeks={adjustWeeks}
          onAdjustStartWeek={adjustStartWeek}
          onCycleRole={cycleRole}
          onAdjustHours={(id, delta) => {
            const allocation = allocations.find(a => a.id === id);
            if (allocation) {
              adjustHours(allocation.groupId, delta);
            }
          }}
          roles={ROLES}
        />

        {/* Warnings */}
        {warnings.length > 0 && <Warnings warnings={warnings} />}

        {/* Timeline and Resources */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 animate-fadeIn">
          <Timeline weeks={WEEKS} weekWidth={WEEK_WIDTH} />

          {/* Resources area */}
          <div className="relative" style={{ marginLeft: '192px' }}>
            {allocations.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <p>No allocations yet. Click the 'Add Allocation' button above to get started.</p>
              </div>
            ) : (
              Object.entries(groupedAllocations).map(([groupId, groupAllocations]) => {
                const isCollapsed = collapsedGroups.has(parseInt(groupId));
                const totalHours = groupAllocations.reduce((sum, a) => sum + a.hoursPerWeek, 0);
                const baseAllocation = groupAllocations[0];
                const isSingleResource = groupAllocations.length === 1;

                return (
                  <div key={groupId} className="mb-2">
                    {/* Group Header */}
                    <GroupHeader
                      groupId={parseInt(groupId)}
                      allocations={groupAllocations}
                      totalHours={totalHours}
                      weeks={baseAllocation.weeks}
                      startWeek={baseAllocation.startWeek}
                      color={baseAllocation.color}
                      isCollapsed={isCollapsed}
                      isSingleResource={isSingleResource}
                      onToggleCollapse={toggleGroupCollapse}
                      onAdjustHours={adjustHours}
                      onDelete={deleteGroup}
                      weekWidth={WEEK_WIDTH}
                    />

                    {/* Individual Resources */}
                    {!isCollapsed && groupAllocations.map((allocation, index) => (
                      <ResourceRow
                        key={allocation.id}
                        allocation={allocation}
                        index={index}
                        totalInGroup={groupAllocations.length}
                        isSelected={selectedAllocation === allocation.id}
                        isHovered={hoveredAllocation === allocation.id}
                        onSelect={setSelectedAllocation}
                        onHover={setHoveredAllocation}
                        onDragStart={handleDragStart}
                        weekWidth={WEEK_WIDTH}
                      />
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Summary */}
        <Summary
          allocations={allocations}
          hourlyRate={HOURLY_RATE}
          roles={ROLES}
        />
      </div>
    </div>
  );
}

export default App;
