"use client";
/**
 * @file /app/modules/leads/components/KanbanView.tsx
 * @description Renders leads as Kanban Cards grouped into life stages. Adapts fluidly to mobile via smart Tab-switching.
 * @dependencies react, lucide-react, @/app/modules/leads/store
 * @workplan WP-011
 */

'use client';

import React, { useState, useEffect } from 'react';
import { LrmLead, useLeadsStore } from '../store';
import { useAuthStore } from '../../team/authStore';
import KanbanCard from './KanbanCard';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const STAGES = [
  { id: 'NEW', label: 'New', dbVal: 'NEW', color: 'bg-blue-500' },
  { id: 'IN_PROGRESS', label: 'In Progress', dbVal: 'IN_PROGRESS', color: 'bg-amber-500' },
  { id: 'INTERESTED', label: 'Interested', dbVal: 'INTERESTED', color: 'bg-teal-500' },
  { id: 'NOT_INTERESTED', label: 'Not Interested', dbVal: 'NOT_INTERESTED', color: 'bg-rose-400' },
  { id: 'CONTACTED', label: 'Contacted', dbVal: 'CONTACTED', color: 'bg-indigo-400' },
  { id: 'FEEDBACK_REQ', label: 'Feedback Req', dbVal: 'FEEDBACK_REQ', color: 'bg-fuchsia-500' },
  { id: 'BOOKED', label: 'Booked', dbVal: 'BOOKED', color: 'bg-violet-600' },
  { id: 'CONVERTED', label: 'Converted', dbVal: 'CONVERTED', color: 'bg-emerald-600' },
  { id: 'LOST', label: 'Lost', dbVal: 'LOST', color: 'bg-slate-400' }
];

interface KanbanProps {
  leads: LrmLead[];
  onSelectLead: (lead: LrmLead) => void;
}

export default function KanbanView({ leads, onSelectLead }: KanbanProps) {
  const updateLead = useLeadsStore((s) => s.updateLead);
  const currentUser = useAuthStore((s) => s.currentUser);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const leadId = draggableId;
    const targetStage = destination.droppableId;
    
    const lead = leads.find(l => l.id === leadId);
    if (lead && lead.stage !== targetStage) {
      await updateLead(leadId, {
        stage: targetStage,
        updaterId: currentUser?.id,
        updaterName: `${currentUser?.firstName} ${currentUser?.lastName}`
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 min-h-0 flex flex-col min-w-0" id="kanban-view-container">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-3 md:gap-4 h-full overflow-y-hidden overflow-x-auto pb-4 font-sans px-1 snap-x snap-mandatory scroll-p-1" id="kanban-board-scroll">
          {STAGES.map((stg) => {
            const colLeads = leads.filter(l => l.stage === stg.id);
            return (
              <Droppable droppableId={stg.id} key={stg.id}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-slate-50/50 dark:bg-slate-900/20 rounded-[12px] p-1.5 md:p-2 flex flex-col h-full w-[44vw] md:w-[275px] shrink-0 border snap-start transition-colors ${snapshot.isDraggingOver ? 'bg-slate-100/50 dark:bg-slate-800/40 border-indigo-200/50 dark:border-indigo-800/40' : 'border-transparent'}`}
                  >
                    <div className="flex items-center justify-between mb-2 md:mb-3 px-1.5 pt-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${stg.color}`} />
                        <span className="text-sm font-black text-slate-700 dark:text-slate-300 tracking-tight">{stg.label}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-white/50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded-full">{colLeads.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin min-h-[50px]">
                      {colLeads.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style}
                            >
                              <KanbanCard 
                                lead={lead} 
                                currentUser={currentUser} 
                                onSelectLead={onSelectLead} 
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {colLeads.length === 0 && !snapshot.isDraggingOver && (
                        <div className="h-full flex items-center justify-center p-4 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-[10px] text-center text-xs text-slate-400 dark:text-slate-600 font-bold">
                          Empty
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
