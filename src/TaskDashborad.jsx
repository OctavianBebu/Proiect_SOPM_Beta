import React, { useEffect, useState } from "react"; 
import Layout from "./Layout";

const TaskDashborad = () => {
  const [tasks, setTasks] = useState([]); //array to store tasks
  const [textInput, setTextInput] = useState(""); //string to store input value from text input field
  const [selectedPriority, setSelectedPriority] = useState("High"); //string to store selected priority
  const [selectedTask, setSelectedTask] = useState(null); //variable to store currently selected task

  
  //this  retrieves tasks from local storage
  //using useEffect
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks"); //this retrieves the value stored under "tasks" and assigns the variable to storedTasks
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks)); //if there are tasks stored in local storage , sets the tasks state using stateTasks 
      //parses stored task into JS 
    }
  }, []); //this ensures that it runs once

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks)); //this updates the value stored in the local storage
        
    //converts the current state of "tasks" array into a JSON string then stores it in local storage
  }, [tasks]);  //this makes it run whenever there is a change in "tasks" 

  // With Help Of State Management We Handle Input Change
  const handleTextInputChange = (event) => {    //defines a function handleTextInputChange with "event " as a parameter
    setTextInput(event.target.value); //retrieves the current value of the input field at the time of the change event. 
    //This value is then set as the new state for the textInput variable using the setTextInput function.
  };
  // handlePriorityChange
  const handlePriorityChange = (event) => {
    setSelectedPriority(event.target.value);    //same as setTextInput
  };

  // Handle Function When Click On Submit
  const handleTaskSubmit = () => {
    if (textInput.trim() === "") {  //*trim method removes whitespace from string : spaces, tabs etc.
        //if the trimmed value if an empty string  , returns without executing anything more
      return;
    }
    // Selecting The New Task To Put
    const newTask = {
      text: textInput, //assign current value of textInput
      priority: selectedPriority, //assigns current value of selectedPriority
    };

    setTasks([...tasks, newTask]); //updates  task array with a new object defined by newTask
    setTextInput(""); //clears textInput field to input a new task
    setSelectedPriority("High"); //default priority for a task
  };

  const getTasksByPriority = (priority) => {
    return tasks.filter((task) => task.priority === priority); //filters tasks based on "priority" parameter
  };

  const handleEditTask = (editedText) => {
    const updatedTasks = tasks.map((task) => 
      task === selectedTask ? { ...task, text: editedText } : task  //creates a new task with updating text in editedText
      //if the task is not the selected task return without changes
    );
    setTasks(updatedTasks);
    setSelectedTask(null); //clears selection of tasks after edit
  };

  const handleChangePriority = (newPriority) => {
    const updatedTasks = tasks.map((task) =>
      task === selectedTask ? { ...task, priority: newPriority } : task
    );
    setTasks(updatedTasks);
    setSelectedTask(null); 
  };

  const handleDeleteTask = () => {
    const updatedTasks = tasks.filter((task) => task !== selectedTask); //=> an array of tasks without the selected task
    setTasks(updatedTasks);
    setSelectedTask(null);
  };

  return (
    <div className="p-8">
      <div className="lg:flex grid gap-2 items-center font-main">
        <div className="">
          <input
            type="text"
            value={textInput}
            onChange={handleTextInputChange}
            className="w-full lg:w-96 border rounded p-2"
            placeholder="Enter task"
          />
        </div>
        <div className="">
          <select
            value={selectedPriority}
            onChange={handlePriorityChange}
            className="w-full border rounded p-2"
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
        <button onClick={handleTaskSubmit} className="btn btn-secondary">
          Add Task
        </button>
      </div>

      <div className="mt-8 space-y-4 text-black ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* High Priority */}
          <Layout
            getTasksByPriority={getTasksByPriority}
            setSelectedTask={setSelectedTask}
            selectedTask={selectedTask}
            handleEditTask={handleEditTask}
            handleChangePriority={handleChangePriority}
            handleDeleteTask={handleDeleteTask}
            level="High"
          />
          {/* Medium Priority */}
          <Layout
            getTasksByPriority={getTasksByPriority}
            setSelectedTask={setSelectedTask}
            selectedTask={selectedTask}
            handleEditTask={handleEditTask}
            handleChangePriority={handleChangePriority}
            handleDeleteTask={handleDeleteTask}
            level="Medium"
          />
          {/* Low Priority */}
          <Layout
            getTasksByPriority={getTasksByPriority}
            setSelectedTask={setSelectedTask}
            selectedTask={selectedTask}
            handleEditTask={handleEditTask}
            handleChangePriority={handleChangePriority}
            handleDeleteTask={handleDeleteTask}
            level="Low"
          />
        </div>
      </div>
    </div>
  );
};

export default TaskDashborad;
