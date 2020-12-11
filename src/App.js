import React, { useState } from 'react';
import './App.css';
import Trainings from './components/Trainings';
import Customers from './components/Customers';
import Calendar from './components/TrainingsCalendar';
import Stats from './components/Stats';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function App() {

  const [value, setValue] = useState('');

  const handleChange = (event, value) => {
    setValue(value);
  };

  return (
    <div className="App">
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h4">
            Personal Trainer App
          </Typography>
        </Toolbar>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab value="customers" label="Customers" />
          <Tab value="trainings" label="Trainings" />
          <Tab value="calendar" label="Calendar" />
          <Tab value="stats" label="stats" />
        </Tabs>
      </AppBar>
      {value === 'customers' && <div><Customers /></div>}
      {value === 'trainings' && <div><Trainings /></div>}
      {value === 'calendar' && <div><Calendar /></div>}
      {value === 'stats' && <div><Stats /></div>}
    </div>
  );
}

export default App;
