'use client'

import { Task } from '@/types'
import { useStore } from '@/lib/store'
import { useAuthStore } from '@/lib/authStore'
import { Calendar, User, Edit, Trash2, MoreVertical } from 'lucide-react'
import { useState } from 'react'

interface TaskCardProps {
  task: Task
  onEditClick: (task: Task) => void
}

const TaskCard = ({ task, onEditClick }: TaskCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { deleteTask } = useStore()
  const { currentUser, userRole } = useAuthStore()

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const canEdit = currentUser?.id === task.assignee?.id || userRole === 'admin'
  const canDelete = userRole === 'admin'

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      {/* Priority Color Line */}
      <div className={`h-1 ${priorityColors[task.priority]}`}></div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-50">{task.title}</h4>
          {(canEdit || canDelete) && (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 hover:bg-gray-100 rounded dark:hover:bg-gray-700"
                aria-label="Task options"
              >
                <MoreVertical size={16} />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 dark:bg-gray-700 dark:border-gray-600">
                  {canEdit && (
                    <button
                      onClick={async () => { // Made async
                        onEditClick(task)
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      <Edit size={16} /> Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={async () => { // Made async
                        await deleteTask(task.id) // Await the async deleteTask
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{task.description}</p>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {task.dueDate && (
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Calendar size={14} />
                {formatDate(task.dueDate)}
              </div>
            )}
          </div>

          {task.assignee && (
            <div className="flex items-center gap-2">
              <img
                src={task.assignee.avatar}
                alt={task.assignee.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">{task.assignee.name}</span>
            </div>
          )}
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskCard