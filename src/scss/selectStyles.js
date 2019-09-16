export const invisibleSelectStyleNoArrow = {
	control: (base,state) => ({
		...base,
		minHeight: 30,
		backgroundColor: state.isFocused?'white':'inherit',
		borderWidth:0,
		borderRadius: 0
	}),
	dropdownIndicator: base => ({
		...base,
		color: "transparent",
		padding: 4,
	}),
	clearIndicator: base => ({
		...base,
		padding: 4,
	}),
	multiValue: base => ({
		...base,
		backgroundColor: "#F2F1F1",
		borderRadius: 0
	}),
	valueContainer: base => ({
		...base,
		padding: '0px 6px',
		borderRadius: 0
	}),
	input: base => ({
		...base,
		margin: 0,
		padding: 0,
		backgroundColor: "#F2F1F1",
		borderRadius: 0
	}),
	indicatorSeparator: base => ({
		...base,
		width: 0,
	}),

};

export const sidebarSelectStyle = {
	singleValue: (provided, state) => {
		return { ...provided, marginLeft:30, color: "#212121" };
	},
	indicatorSeparator:(provided, state) => {
		return { ...provided, width:0,  };
	},
	control:(provided, state) => {
		return { ...provided, background: "#F7F7F7", borderRadius: 0 , borderWidth: "0", height: 40 };
	},
	input:(provided, state) => {
		return { ...provided, marginLeft:30 };
	},
	placeholder:(provided, state) => {
		return { ...provided, marginLeft:30 };
	},
};

export const selectStyle = {
	control: base => ({
		...base,
		minHeight: 30,
		backgroundColor: 'white',
		borderRadius: 0
	}),
	dropdownIndicator: base => ({
		...base,
		padding: 4,
	}),
	clearIndicator: base => ({
		...base,
		padding: 4,
	}),
	multiValue: base => ({
		...base,
		backgroundColor: 'white',
		borderRadius: 0
	}),
	valueContainer: base => ({
		...base,
		padding: '0px 6px',
		borderRadius: 0
	}),
	input: base => ({
		...base,
		margin: 0,
		padding: 0,
		backgroundColor: 'white',
		borderRadius: 0
	}),
	indicatorSeparator: base => ({
		...base,
		width: 0,
	}),

};

export const invisibleSelectStyle = {
	control: (base,state) => ({
		...base,
		minHeight: 30,
		backgroundColor: state.isFocused?'white':'inherit',
		borderWidth:0,
		borderRadius: 0
	}),
	dropdownIndicator: base => ({
		...base,
		padding: 4,
	}),
	clearIndicator: base => ({
		...base,
		padding: 4,
	}),
	multiValue: base => ({
		...base,
		backgroundColor: "#F2F1F1",
		borderRadius: 0
	}),
	valueContainer: base => ({
		...base,
		padding: '0px 6px',
		borderRadius: 0
	}),
	input: base => ({
		...base,
		margin: 0,
		padding: 0,
		backgroundColor: "#F2F1F1",
		borderRadius: 0
	}),
	indicatorSeparator: base => ({
		...base,
		width: 0,
	}),

};

export const disabledSelectStyle = {
	control: base => ({
		...base,
		minHeight: 30,
		backgroundColor: '#ced4da',
		borderRadius: 0
	}),
	dropdownIndicator: base => ({
		...base,
		padding: 4,
	}),
	clearIndicator: base => ({
		...base,
		padding: 4,
	}),
	multiValue: base => ({
		...base,
		backgroundColor: 'white',
		borderRadius: 0
	}),
	valueContainer: base => ({
		...base,
		padding: '0px 6px',
		borderRadius: 0
	}),
	input: base => ({
		...base,
		margin: 0,
		padding: 0,
		backgroundColor: '#ced4da',
		borderRadius: 0
	}),
	indicatorSeparator: base => ({
		...base,
		width: 0,
	}),

};


export const CRMMertelSelectStyle = {
	control: base => ({
		...base,
		minHeight: 30,
		backgroundColor: 'white',
		borderRadius: 4.13,
		fontWeight: 600,
		fontSize: 11,
	  alignItems: "center",
	}),
	dropdownIndicator: base => ({
		...base,
		padding: 4,
	}),
	clearIndicator: base => ({
		...base,
		padding: 4,
	}),
	multiValue: base => ({
		...base,
		backgroundColor: 'white',
		borderRadius: 0,
	}),
	valueContainer: base => ({
		...base,
		padding: '0px 6px',
		borderRadius: 0,
	}),
	input: base => ({
		...base,
		margin: 0,
		padding: 0,
		backgroundColor: 'white',
		borderRadius: 0,
	}),
	indicatorSeparator: base => ({
		...base,
		width: 0,
	}),

};
