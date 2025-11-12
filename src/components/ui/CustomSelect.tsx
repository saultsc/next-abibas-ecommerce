'use client';

import {
	Autocomplete,
	FormControl,
	FormHelperText,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from '@mui/material';
import React, { useMemo } from 'react';
import { IoClose } from 'react-icons/io5';

export interface SelectOption {
	value: string | number;
	label: string;
}

export interface CustomSelectProps {
	id?: string;
	label: string;
	labelId?: string;
	value: string | number | '';
	onChange: (value: string | number | '') => void;
	options: SelectOption[];
	error?: boolean;
	helperText?: React.ReactNode;
	variant?: 'filled' | 'outlined' | 'standard';
	fullWidth?: boolean;
	className?: string;
	disabled?: boolean;
	required?: boolean;
	clearable?: boolean;
	loading?: boolean;
	onSearch?: (searchTerm: string) => void | Promise<void>;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
	id,
	label,
	labelId,
	value,
	onChange,
	options,
	error,
	helperText,
	variant = 'filled',
	fullWidth = true,
	className,
	disabled,
	required,
	clearable = false,
	loading = false,
	onSearch,
}) => {
	const resolvedLabelId = labelId ?? `${id ?? 'custom-select'}-label`;
	const resolvedId = id ?? `${resolvedLabelId}-input`;

	// Si existe onSearch, el componente es searchable
	const isSearchable = !!onSearch;

	if (isSearchable) {
		const selectedOption = useMemo(
			() => options.find((o) => String(o.value) === String(value)) ?? null,
			[options, value]
		);

		return (
			<div className={className}>
				<Autocomplete
					disablePortal
					options={options}
					value={selectedOption}
					getOptionLabel={(option) => option.label}
					isOptionEqualToValue={(opt, val) => String(opt.value) === String(val?.value)}
					onChange={(_, newValue) =>
						onChange(newValue ? (newValue.value as string | number) : '')
					}
					onInputChange={(_, newInputValue, reason) => {
						if (onSearch) {
							onSearch(newInputValue);
						}
					}}
					disabled={disabled}
					disableClearable={!clearable}
					loading={loading}
					renderInput={(params) => (
						<TextField
							{...params}
							label={`${label}${required ? ' *' : ''}`}
							variant={variant}
							error={!!error}
							helperText={helperText}
							fullWidth={fullWidth}
						/>
					)}
				/>
			</div>
		);
	}

	const showClearButton = clearable && value !== '' && !disabled;

	return (
		<FormControl
			variant={variant}
			className={className}
			fullWidth={fullWidth}
			error={!!error}
			disabled={disabled}>
			<InputLabel id={resolvedLabelId}>
				{label}
				{required ? ' *' : ''}
			</InputLabel>
			<Select
				labelId={resolvedLabelId}
				id={resolvedId}
				value={value}
				label={label}
				onChange={(e) => onChange(e.target.value as string)}
				endAdornment={
					showClearButton ? (
						<IconButton
							size="small"
							onClick={(e) => {
								e.stopPropagation();
								onChange('');
							}}
							sx={{
								position: 'absolute',
								right: '4px',
								padding: '4px',
								pointerEvents: 'auto',
							}}>
							<IoClose size={18} />
						</IconButton>
					) : null
				}
				sx={
					showClearButton
						? {
								'& .MuiSelect-icon': {
									right: '32px',
								},
						  }
						: undefined
				}>
				{options.map((opt) => (
					<MenuItem key={String(opt.value)} value={opt.value}>
						{opt.label}
					</MenuItem>
				))}
			</Select>
			{helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
		</FormControl>
	);
};
