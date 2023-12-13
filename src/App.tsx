import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';
import AppTasks from './AppTasks';

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
  status: TaskStatus;
  time?: Date;
}

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activities, setActivities] = useState<{ [key: string]: Task[] }>({});
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Task>({ name: '', description: '', tag: '1', status: TaskStatus.Upcoming });
  const [sortCriteria, setSortCriteria] = useState<keyof Task>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [statusCycleIndex, setStatusCycleIndex] = useState(0);

  const statusCycleOrder: TaskStatus[] = [TaskStatus.Upcoming, TaskStatus.Overdue, TaskStatus.Canceled, TaskStatus.Done];

  const removeTask = (dateKey: string, index: number) => {
    setActivities((prevActivities) => {
      const newActivities = { ...prevActivities };
      if (newActivities[dateKey]) {
        newActivities[dateKey] = newActivities[dateKey].filter((_, i) => i !== index);
      }
      return newActivities;
    });
  };

  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setNewTask((prevTask) => ({ ...prevTask, [field]: e.target.value }));
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewTask((prevTask) => ({ ...prevTask, tag: e.target.value }));
  };

  // Get the current date and time
  const currentTime = new Date();

  const addTask = () => {
    if (!newTask.name.trim()) {
      // Display an error message or prevent adding an empty task based on your requirements
      return;
    }
  
    const dateKey = selectedDate.toISOString().split('T')[0];
  
    setActivities((prevActivities) => {
      const newActivities = { ...prevActivities };
      const updatedTasks = newActivities[dateKey]
        ? [
          ...newActivities[dateKey],
          { ...newTask, time: new Date(), status: statusCycleOrder[statusCycleIndex] } as Task,
        ]
      : [{ ...newTask, time: new Date(), status: statusCycleOrder[statusCycleIndex] } as Task];
    newActivities[dateKey] = updatedTasks;
    return newActivities;
    });

    setStatusCycleIndex((prevIndex) => (prevIndex + 1) % statusCycleOrder.length);
  
    // Close the modal after adding the task
    setAddTaskModalOpen(false);
    // Reset the newTask state for the next task
    setNewTask({ name: '', description: '', tag: '1', status: TaskStatus.Upcoming });
  };

  const getTotalActivitiesCount = (): number => {
    return Object.values(activities).reduce((total, activitiesOnDate) => total + activitiesOnDate.length, 0);
  };

  // Sorting the Tasks
  const sortedTasks = (activities[selectedDate.toISOString().split('T')[0]] || []).sort((a, b) => {
    const aValue = a[sortCriteria];
    const bValue = b[sortCriteria];

    if (sortOrder === 'asc') {
      return String(aValue).localeCompare(String(bValue));
    } else {
      return String(bValue).localeCompare(String(aValue));
    }
  });


  return (
    <div className="App Body">
      <div className="App-container">
        <header className="App-header">
          <h1>TaskTrax</h1>
        </header>

        <main className="App-main">
          <div className="App-content">
            {/* Create a parent container for both components */}
            <div className="App-task-calendar-container">
              {/* AppTasksList component */}
              <AppTasks
                activities={activities}
                selectedDate={selectedDate}
                removeTask={removeTask}
                setAddTaskModalOpen={setAddTaskModalOpen}
              />

              {/* Calendar component */}
              <div className="App-calendar">
                <h2>Calendar</h2>
                <Calendar
                  onChange={(value) => {
                    if (value instanceof Date) {
                      setSelectedDate(value);
                    }
                  }}
 
                  
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Move the task list outside of App-content */}
      <div className="TaskActivity">
        <h2>Activities for {selectedDate.toDateString()}</h2>
        <p>Total Activities: {getTotalActivitiesCount()}</p>

        {}
        
        {/* Button to open the modal */}
        <button className="AddTaskButton" onClick={() => setAddTaskModalOpen(true)}>Add Task</button>
      </div>

      {isAddTaskModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setAddTaskModalOpen(false)}>
              &times;
            </span>
            <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); addTask(); }}>
              <label htmlFor="taskName">Task Title:</label><br />
              <input
                type="text"
                id="taskNameModal"
                value={newTask.name}
                onChange={(e) => handleTaskInputChange(e, 'name')}
                required
              /><br />

              <br />
              <label htmlFor="taskPriorityModal">Priority:</label><br />
              <select
                id="taskPriorityModal"
                value={newTask.tag}
                onChange={(e) => handlePriorityChange(e)}
              >
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
                <option value="4">Very High</option>
                <option value="5">Urgent</option>
              </select><br />

              <br />
              <label htmlFor="taskDescriptionModal">Task Description:</label><br />
              <textarea
                id="taskDescriptionModal"
                value={newTask.description}
                onChange={(e) => handleTaskInputChange(e, 'description')}
                required
              /><br />

              <button type="button" onClick={() => setAddTaskModalOpen(false)}>
                Close
              </button>
              <button type="submit">Add Task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
