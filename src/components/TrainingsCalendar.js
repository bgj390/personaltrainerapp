import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
 
function TrainingsCalendar() {

    const localizer = momentLocalizer(moment)
    const [trainings, setTrainings] = useState([])

    useEffect(() => {
      getTrainings()
    });

    const getTrainings = () => {
      fetch('https://customerrest.herokuapp.com/gettrainings')
        .then(response => response.json())
        .then(data => setTrainings(data.map((training) => (
            {
                title: training.activity + ' / ' + 
                    training.customer.firstname + ' ' + 
                    training.customer.lastname + ' ' +
                    training.duration + 'min',
                start: moment.utc(training.date)._d,
                end: moment.utc(training.date).add(training.duration, 'minutes')._d,
                resource: training.customer.id
            })
        )))
        .catch(err => console.error(err))
    }

      return (
        <div className="TrainingsCalendar">
          <Calendar
            localizer={localizer}
            defaultDate={new Date()}
            defaultView='month'
            events={trainings}
            resourceAccessor='resource'
            startAccessor='start'
            endAccessor='end'
            style={{ height: "100vh" }}
          />
        </div>
      );
  }
  
  export default TrainingsCalendar;