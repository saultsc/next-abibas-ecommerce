import { TableClickableWrapper } from '@/components';

export type Column<T> = {
	header: React.ReactNode;
	cell: (row: T) => React.ReactNode;
	className?: string;
};

interface Props<T> {
	columns: Column<T>[];
	rows: T[];
	rowHrefs?: string[];
	onRowClick?: (row: T) => void;
}

export const Table = <T,>({ columns, rows, rowHrefs, onRowClick }: Props<T>) => {
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
				{rows.map((row, rIdx) => {
					const rowKey = (row as any).id ?? rIdx;
					const href = rowHrefs?.[rIdx];
					const isClickable = !!(href || onRowClick);

					return (
						<TableClickableWrapper
							key={rowKey}
							isClickable={isClickable}
							href={href}
							onRowClick={onRowClick ? () => onRowClick(row) : undefined}>
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
						</TableClickableWrapper>
					);
				})}
			</tbody>
		</table>
	);
};
