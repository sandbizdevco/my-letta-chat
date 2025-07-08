'use client';

import { useState, useEffect } from 'react';

interface MemoryBlock {
  id: string;
  label: string;
  value: string;
}

export default function MemoryDashboard({ agentId }: { agentId: string }) {
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemoryBlocks();
  }, [agentId]);

  const fetchMemoryBlocks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/agents/${agentId}/memory`);
      if (response.ok) {
        const data = await response.json();
        setMemoryBlocks(data.memoryBlocks || []);
      }
    } catch (error) {
      console.error('Error fetching memory blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Agent Memory</h3>
      
      {memoryBlocks.length === 0 ? (
        <p className="text-gray-500 text-sm">No memory blocks found</p>
      ) : (
        <div className="space-y-4">
          {memoryBlocks.map((block) => (
            <div key={block.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                  {block.label}
                </span>
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {block.value}
              </p>
            </div>
          ))}
        </div>
      )}
      
      <button
        onClick={fetchMemoryBlocks}
        className="mt-4 px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
      >
        Refresh Memory
      </button>
    </div>
  );
}
