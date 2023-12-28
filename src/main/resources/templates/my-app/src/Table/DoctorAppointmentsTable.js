import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import './tablestyle.css';

const DoctorAppointmentsTable = ({ data }) => {
    const currentDateTime = new Date();

    // Filter out appointments that are not active
    const activeAppointments = data.filter(
        (appointment) => new Date(appointment.appointment_date_time) >= currentDateTime
    );


    const columns = React.useMemo(
        () => [
            {
                Header: '№',
                accessor: (_, index) => index + 1,
            },
            {
                Header: 'День прийому',
                accessor: 'appointment_date_time',
            },
            {
                Header: 'Лікар',
                accessor: 'doctor',
            },
            {
                Header: 'Страховка',
                accessor: (row) => (row.isFree ? '+' : '-'),
            },
            // Add other columns as needed
        ],
        []
    );

    // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    //     columns,
    //     data: activeAppointments, // Use the filtered appointments
    // });
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data, // Use the filtered appointments
    });
    return (
        <table {...getTableProps()} className="custom-table-style">
            <thead>
            {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        ))}
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
};

export default DoctorAppointmentsTable;
