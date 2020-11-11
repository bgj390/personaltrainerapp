import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

function Trainings() {

    const [trainings, setTrainings] = useState([]);

    const gridRef = useRef();

    useEffect(() => {
        getTrainings();
    }, [])
    const getTrainings = () => {
        fetch('https://customerrest.herokuapp.com/gettrainings')
        .then(response => response.json())
        .then(data => setTrainings(data))
        .catch(err => console.error(err))
    }

    const columns = [
        { headerName: 'First name', field: 'customer.firstname', sortable: true, filter: true },
        { headerName: 'Last name', field: 'customer.lastname', sortable: true, filter: true },
        { headerName: 'Date', field: 'date', sortable: true, filter: true,
        valueFormatter: function (params) {
            return moment(params.value).format('DD.MM.YYYY');
            }, 
        },
        { headerName: 'Duration (min)', field: 'duration', sortable: true, filter: true }, 
        { headerName: 'Activity', field: 'activity', sortable: true, filter: true },      
    ]

    return(
        <div>
            <div className="ag-theme-material" style={{height:'700px', width:'90%', margin:'auto'}}>
            <AgGridReact
                ref={gridRef}
                suppressCellSelection={true}
                onGridReady={ params => {
                    gridRef.current = params.api
                }}
                columnDefs={columns}
                rowData={trainings}
                pagination={true}
                paginationPageSize={10}
                animateRows={true}
            >
            </AgGridReact>
            </div>
        </div>
    )
}

export default Trainings;