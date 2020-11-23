import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { Button } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';
import AddTraining from './AddTraining';
import Trainings from './Trainings';

function Customers() {

    const [customers, setCustomers] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');

    const gridRef = useRef();

    useEffect(() => {
        getCustomers();
    }, [])

    const getCustomers = () => {
        fetch('https://customerrest.herokuapp.com/api/customers/')
        .then(response => response.json())
        .then(data => setCustomers(data.content))
        .catch(err => console.error(err))
    }

    useEffect(() => {
        getTrainings();
    }, [])
    
    const getTrainings = () => {
        fetch('https://customerrest.herokuapp.com/api/trainings')
        .then(response => response.json())
        .then(data => setTrainings(data))
        .catch(err => console.error(err))
    }

    const addCustomer = (newCustomer) => {
        fetch('https://customerrest.herokuapp.com/api/customers/', {
            method: 'POST',
            headers: {'Content-type' : 'application/json' },
            body: JSON.stringify(newCustomer)
        })
        .then(_ => gridRef.current.refreshCells({rowNodes: getCustomers()}))
        .then(_ => setMsg('Added succesfully!'))
        .then(_ => setOpen(true))
        .catch(err => console.error(err))
    }

    const updateCustomer = (link, customer) => {
        if (window.confirm('You really want to update?')) {
            fetch(link.links[0].href, {
                method: 'PUT',
                headers: {'Content-type' : 'application/json' },
                body: JSON.stringify(customer)
            })
            .then(_ => gridRef.current.refreshCells({rowNodes: getCustomers()}))
            .then(_ => setMsg('Updated!!!'))
            .then(_ => setOpen(true))
            .catch(err => console.error(err))
        }
    }
    const addTraining = (newTraining) => {
        if (window.confirm('You really want to add?')) {
            fetch('https://customerrest.herokuapp.com/api/trainings', {
                method: 'POST',
                headers: {'Content-type' : 'application/json' },
                body: JSON.stringify(newTraining)
            })
            .then(_ => gridRef.current.refreshCells({rowNodes: getTrainings()}))
            .then(_ => setMsg('Training added!!!'))
            .then(_ => setOpen(true))
            .catch(err => console.error(err))
        }
    }

    const deleteCustomer = (link) => {
        if (window.confirm('You really want to delete?')) {
            fetch(link.links[0].href, {
                method: 'DELETE'
            })
            .then(_ => gridRef.current.refreshCells({rowNodes: getCustomers()}))
            .then(_ => setMsg('Deleted!!!'))
            .then(_ => setOpen(true))
            .catch(err => console.error(err))
        }
    }

    const closeSnackbar = () => {
        setOpen(false);
    }

    const columns = [
        {
            headerName: '',
            width: 170,
            cellRendererFramework: (row) =>  (
                <AddTraining addTraining={addTraining} training={row.data} />
            )},
        { headerName: 'First name', field: 'firstname', sortable: true, filter: true },
        { headerName: 'Last name', field: 'lastname', sortable: true, filter: true },
        { headerName: 'Street address', field: 'streetaddress', sortable: true, filter: true },
        { headerName: 'Postcode', field: 'postcode', sortable: true, filter: true },
        { headerName: 'City', field: 'city', sortable: true, filter: true },
        { headerName: 'Email', field: 'email', sortable: true, filter: true },
        { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
        {
            headerName: '',
            width: 90,
            cellRendererFramework: (row) =>  (
                <EditCustomer updateCustomer={updateCustomer} customer={row.data} />
            )},
        {
            headerName: '',
            width: 90,
            cellRendererFramework: (row) => (
                <Button color="secondary" size="small"
                onClick={() => deleteCustomer(row.data)}>
                    Delete
                </Button>
            )
        },
    ]

    return(
        <div>
            <AddCustomer addCustomer={addCustomer} />
            <div className="ag-theme-material" style={{height:'700px', width:'90%', margin:'auto'}}>
            <AgGridReact
                ref={gridRef}
                suppressCellSelection={true}
                onGridReady={ params => {
                    gridRef.current = params.api
                }}
                columnDefs={columns}
                rowData={customers}
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
    );
}

export default Customers;