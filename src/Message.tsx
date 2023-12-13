import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';

function App() {
  // Starea pentru data selectată în calendar
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="App">
      <header className="App-header">
        <h1>Organizator Activități</h1>
      </header>

      <main className="App-main">
        <div className="App-calendar">
          <h2>Calendar</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
          />
        </div>

        <div className="App-tasks">
          <h2>Activități pentru {selectedDate.toDateString()}</h2>
          {/* Aici poți adăuga componente sau logica pentru afișarea activităților */}
        </div>
      </main>
    </div>
  );
}

export default App;
