import React from 'react';

export type Column<T> = {
	header: React.ReactNode;
	cell: (row: T) => React.ReactNode;
	className?: string;
};

interface Props<T> {
	columns: Column<T>[];
	rows: T[];
}

export const Table = <T,>({ columns, rows }: Props<T>) => {
	return (
		<table className="min-w-full">
			<thead className="bg-gray-200 border-b">
				<tr>
					{columns.map((col, idx) => (
						<th
							key={idx}
							scope="col"
							className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
							{col.header}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.map((row, rIdx) => (
					<tr
						key={(row as any).id ?? rIdx}
						className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
						{columns.map((col, cIdx) => {
							const cellContent = col.cell(row);
							return (
								<td
									key={cIdx}
									className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
										col.className ?? ''
									}`}>
									{cellContent != null && cellContent !== '' ? (
										<>{cellContent}</>
									) : (
										<span className="text-gray-400">N/A</span>
									)}
								</td>
							);
						})}
					</tr>
				))}
			</tbody>
		</table>
	);
};
