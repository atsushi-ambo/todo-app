import React, { useEffect } from 'react';
import WorkingDndBoard from './components/WorkingDndBoard';
import './App.css';

function App() {
  // Set the document title for the browser tab
  useEffect(() => {
    document.title = "To-Do App";
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* Header content removed as it's managed in the board component */}
      </header>
      <main>
        <WorkingDndBoard />
      </main>
    </div>
  );
}

export default App;