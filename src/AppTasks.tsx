import React, { useState } from 'react';
import './App.css';

enum TaskStatus {
  Upcoming = 'U',
  Overdue = 'O',
  Canceled = 'C',
  Done = 'D',
}

interface Task {
  name: string;
  description: string;
  tag: string;
  time?: Date; // Optional time property
  status: TaskStatus;
}

interface AppTasksProps {
  activities: { [key: string]: Task[] };
  selectedDate: Date;
  removeTask: (dateKey: string, index: number) => void;
  setAddTaskModalOpen: (isOpen: boolean) => void;
}

const AppTasks: React.FC<AppTasksProps> = ({ activities, selectedDate, removeTask, setAddTaskModalOpen }) => {
  const [sortCriteria, setSortCriteria] = useState<keyof Task>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});
  const tasksOnDate = activities[selectedDate.toISOString().split('T')[0]] || [];

  // Sorting the Tasks
  const sortedTasks = tasksOnDate.sort((a, b) => {
    const aValue = a[sortCriteria];
    const bValue = b[sortCriteria];

    if (sortOrder === 'asc') {
      return String(aValue).localeCompare(String(bValue));
    } else {
      return String(bValue).localeCompare(String(aValue));
    }
  });

  const toggleExpand = (index: number) => {
    setExpandedTasks({
      ...expandedTasks,
      [index]: !expandedTasks[index],
    });
  };

  const displayedTasks = sortedTasks.slice(0, 100);

  const getStatusClass = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.Upcoming:
        return 'upcoming-class';
      case TaskStatus.Overdue:
        return 'overdue-class';
      case TaskStatus.Canceled:
        return 'canceled-class';
      case TaskStatus.Done:
        return 'done-class';
      default:
        return '';
    }
  };

  const getStatusText = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.Upcoming:
        return 'U';
      case TaskStatus.Overdue:
        return 'O';
      case TaskStatus.Canceled:
        return 'C';
      case TaskStatus.Done:
        return 'D';
      default:
        return '?';
    }
  };

  return (
    <div className="App-List-Body">
      <div className="TaskList">
        <div className="TaskList-header">
          <h2>Daily Activities</h2>
          {/* Sorting Controls */}
          <div className="sorting-controls" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label htmlFor="sortCriteria"></label>
              <select
                id="sortCriteria"
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value as keyof Task)}
              >
                <option value="name">Task Name</option>
                <option value="tag">Priority</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label htmlFor="sortOrder"></label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="TaskList-content">
          <ul>
            {displayedTasks.map((task, index) => (
              <li key={index} style={{ backgroundColor: 'lightgrey' }}>
                <div className="TaskDetails">
                  <div className="TitleAndDelete">
                    <strong>{task.name}</strong>
                    <button className="DeleteButton" onClick={() => removeTask(selectedDate.toISOString().split('T')[0], index)}>
                      X
                    </button>
                  </div>
                  <div className="Tags">
                    <span className={getStatusClass(task.status)}>{getStatusText(task.status)}</span>
                    <span>{task.tag}</span>
                    <span>{task.time && task.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {!expandedTasks[index] && (
                    <div className="ToggleExpandButton">
                      <button className="DetailsButton" onClick={() => toggleExpand(index)}>
                        ▼
                      </button>
                    </div>
                  )}

                  {expandedTasks[index] && <p style={{ backgroundColor: 'lightgrey' }}>{task.description}</p>}

                  {expandedTasks[index] && (
                    <div className="ToggleExpandButton">
                      <button className="DetailsButton" onClick={() => toggleExpand(index)}>
                        {expandedTasks[index] ? '▲' : '▼'}
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppTasks;
