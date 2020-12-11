import React, { useState, useEffect } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory";
import Trainings from './Trainings';

function Stats() {

    const [data, setData] = useState([]);

    const url = 'https://customerrest.herokuapp.com/gettrainings'

    useEffect(() => { 
        fetchData()
    }, []);

    const fetchData = () => {
        fetch(url)
        .then(response => response.json())
        .then(data => setData(data.map((training) => (
            {
                activity: training.activity,
                mins: training.duration
            })
        )))
        .catch(err => console.error(err))
    }

    return (
        <VictoryChart domainPadding={20}>
            <VictoryBar style={{
                data: { fill: '#c43a31' }
            }}
            data={fetchData()} x="activity" y="mins"
            />
        </VictoryChart>
    )
}

export default Stats;