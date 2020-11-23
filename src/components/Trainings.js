import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import { Button } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
//import moment from 'moment';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

function Trainings() {

    const [trainings, setTrainings] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [id, setId] = useState('');

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

    const deleteTraining = (link) => {
        setId(id);
        if (window.confirm('You really want to delete?')) {
            fetch('https://customerrest.herokuapp.com/api/trainings/' + link.id, {
                method: 'DELETE'
            })
            .then(_ => gridRef.current.refreshCells({rowNodes: getTrainings()}))
            .then(_ => setMsg('Deleted!!!'))
            .then(_ => setOpen(true))
            .catch(err => console.error(err))
        }
    }

    const closeSnackbar = () => {
        setOpen(false);
    }

    let newDate = new Date();
    let today = moment(newDate).toISOString();

    const columns = [
        { headerName: 'Id', field: 'id', sortable: 'true' },
        { headerName: 'First name', field: 'customer.firstname', sortable: true, filter: true },
        { headerName: 'Last name', field: 'customer.lastname', sortable: true, filter: true },
        { headerName: 'Date', field: 'date', sortable: true, filter: true,
            valueFormatter: function (params) {
            return moment(params.value).format('DD.MM.YYYY');
            },
            cellStyle: function(params) {
                if (moment(params.value).isSameOrBefore(today, 'day')) {
                    return {color: 'white', backgroundColor: 'red'};
                } else {
                    return {color: 'black', backgroundColor: 'lime'};
                }
            }
        },
        { headerName: 'Duration (min)', field: 'duration', sortable: true, filter: true}, 
        { headerName: 'Activity', field: 'activity', sortable: true, filter: true },      
        {
            headerName: '',
            field: 'data',
            width: 90,
            cellRendererFramework: (row) => (
                <Button color="secondary" size="small"
                onClick={() => deleteTraining(row.data)}>
                    Delete
                </Button>
            )
        },
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
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                message={msg}
            /> 
            </div>
        </div>
    )
}

export default Trainings;