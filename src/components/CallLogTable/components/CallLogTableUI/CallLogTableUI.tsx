import { flexRender, Table } from '@tanstack/react-table';
import './CallLogTableUI.scss';
import { CallLogEntryType } from '~/components/CallLogTable/CallLogTable.types.ts';

interface ICallLogTableUIProps {
    table: Table<CallLogEntryType>;
    isLoading?: boolean;
}

const CallLogTableUI = ({ table, isLoading }: ICallLogTableUIProps) => {
    return (
        <div className="call-log-table__container">
            <table className="call-log-table">
                <thead>
                <tr>
                    {table.getFlatHeaders().map(header => (
                        <th
                            key={header.id}
                            style={{ width: header.column.getSize() !== undefined ? header.column.getSize() : 'auto' }}
                        >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {!isLoading ? (
                    table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    Array.from({ length: 30 }).map((_, index) => (
                        <tr key={index} className="skeleton-row">
                            {table.getFlatHeaders().map(header => (
                                <td key={header.id}>
                                    <div className="skeleton skeleton-text"/>
                                </td>
                            ))}
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default CallLogTableUI;
