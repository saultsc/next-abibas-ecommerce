import { Switch } from '@mui/material';

interface StateSwitchProps {
	state: string;
	onStateChange: (newState: string) => void;
	entityName?: string;
	gender?: 'el' | 'la';
	activeLabel?: string;
	inactiveLabel?: string;
}

export const StateSwitch = ({
	state,
	onStateChange,
	entityName = 'elemento',
	gender = 'el',
	activeLabel,
	inactiveLabel,
}: StateSwitchProps) => {
	const isActive = state === 'A';

	// Determinar los textos finales
	const finalActiveLabel = activeLabel || (gender === 'la' ? 'Activa' : 'Activo');
	const finalInactiveLabel = inactiveLabel || (gender === 'la' ? 'Inactiva' : 'Inactivo');

	return (
		<div className="w-full mb-4">
			<p className="mb-2 font-semibold text-gray-700">Estado</p>
			<div className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-300">
				<div className="flex-1">
					<p className="font-medium text-gray-700">
						Estado de {gender} {entityName}
					</p>
					<p className="text-sm text-gray-500 mt-1">
						{isActive
							? `${gender === 'la' ? 'La' : 'El'} ${entityName} está ${
									gender === 'la' ? 'activa' : 'activo'
							  } y visible para los usuarios`
							: `${gender === 'la' ? 'La' : 'El'} ${entityName} está ${
									gender === 'la' ? 'desactivada' : 'desactivado'
							  } y no será visible`}
					</p>
				</div>
				<div className="flex items-center gap-4 ml-6 shrink-0">
					<span
						className={`text-sm font-medium w-[70px] text-right shrink-0 ${
							isActive ? 'text-green-600' : 'text-gray-400'
						}`}>
						{isActive ? finalActiveLabel : finalInactiveLabel}
					</span>
					<div className="shrink-0">
						<Switch
							checked={isActive}
							onChange={(e) => {
								onStateChange(e.target.checked ? 'A' : 'I');
							}}
							slotProps={{
								input: { 'aria-label': `Estado de ${gender} ${entityName}` },
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
