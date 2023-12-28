import React from 'react';
import { useTable } from 'react-table';
import "./tablestyle.css";

const TableComponent = ({ data }) => {
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
                Header: "Ім'я",
                accessor: 'doctor_name',
            },
            {
                Header: 'Категорія лікаря',
                accessor: 'doctor_type',
            },
            {
                Header: 'Діагноз',
                accessor: 'diagnosis',
            },
            {
                Header: 'Лікування',
                accessor: 'treatment',
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    if (data.length === 0) {
        return <p>Немає записів.</p>;
    }

    return (
        <table {...getTableProps()} className="custom-table-style">
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map(row => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => (
                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        ))}
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
};

export default TableComponent;
