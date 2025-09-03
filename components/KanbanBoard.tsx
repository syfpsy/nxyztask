'use client'

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { useStore } from '@/lib/store'
import { useAuthStore } from '@/lib/authStore'
import TaskCard from './TaskCard'
import { Column as ColumnType, Task } from '@/types'
import { Plus } from 'lucide-react'
import AddTaskModal from './AddTaskModal'
import EditTaskModal from './EditTaskModal'
import { useState, useEffect } from 'react'

const KanbanBoard = () => {
  const { columns, tasks, moveTask, fetchInitialData, loading, error } = useStore() // Get fetchInitialData, loading, error
  const { userRole } = useAuthStore()
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    fetchInitialData() // Fetch data from server on mount
  }, [fetchInitialData])

  const isDragDisabled = userRole !== 'admin'

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || isDragDisabled) return

    const { source, destination, draggableId } = result
    if (source.droppableId !== destination.droppableId) {
      moveTask(draggableId, destination.droppableId)
    }
  }

  const handleEditClick = (task: Task) => {
    setEditingTask(task)
    setIsEditTaskModalOpen(true)
  }

  if (!isClient || loading) {
    return <p className="text-gray-700 dark:text-gray-300">Loading board...</p>
  }

  if (error) {
    return <p className="text-red-500 dark:text-red-400">Error: {error}</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Project Tasks</h2>
        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-100">{column.title}</h3>
              <Droppable droppableId={column.id} isDropDisabled={isDragDisabled}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] rounded-md p-2 ${
                      snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900' : 'bg-gray-50 dark:bg-gray-700'
                    } ${isDragDisabled ? 'cursor-not-allowed' : ''}`}
                  >
                    {tasks
                      .filter(task => task.column === column.id)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={isDragDisabled}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-2 ${
                                snapshot.isDragging ? 'opacity-50' : 'opacity-100'
                              }`}
                            >
                              <TaskCard task={task} onEditClick={handleEditClick} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
      />

      <EditTaskModal
        isOpen={isEditTaskModalOpen}
        onClose={() => {
          setIsEditTaskModalOpen(false)
          setEditingTask(null)
        }}
        taskToEdit={editingTask}
      />
    </div>
  )
}

export default KanbanBoard