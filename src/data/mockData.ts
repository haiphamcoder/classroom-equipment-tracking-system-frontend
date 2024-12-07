export interface Device {
	id: number;
	name: string;
	location: string;
	status: string;
}

export interface Ticket {
	id: number;
	borrower_id: string,
	name: string,
	tag: string,
	borrow_time: string,
	expected_return_in: string,
	return_time: string,
	device: string,
	status: string,
}

export const devicesRow: Device[] = [
	{ id: 1, name: 'Microphobe', location: 'D9-202', status: 'Active' },
	{ id: 2, name: 'Eletric Outlet', location: 'D9-202', status: 'Maintenance' },
	{ id: 3, name: 'Diddy', location: 'Thai Nguyen', status: 'Active' }
];
export const devicesCol = [
	{ field: 'id', headerName: 'ID', width: 100 },
	{ field: 'name', headrName: 'Name', width: 230 },
	{ field: 'location', headrName: 'Location', width: 100 },
	{ field: 'status', headrName: 'Status', width: 300 },
]

export const tickets: Ticket[] = [
	{ id: 1, borrower_id: '20207632', name: 'Nguyen Viet Thanh', tag: 'Student', borrow_time: '15:30', expected_return_in: '17h30', return_time: '00:00', device: 'Microphone', status: 'Borrowed' },
	{ id: 2, borrower_id: '20207632', name: 'Nguyen Viet Thanh', tag: 'Student', borrow_time: '15:30', expected_return_in: '17h30', return_time: '00:00', device: 'Microphone', status: 'Rerturned' },
	{ id: 3, borrower_id: '20207632', name: 'Nguyen Viet Thanh', tag: 'Student', borrow_time: '15:30', expected_return_in: '17h30', return_time: '00:00', device: 'Microphone', status: 'Borrowed' },
	{ id: 4, borrower_id: '20207632', name: 'Nguyen Viet Thanh', tag: 'Student', borrow_time: '15:30', expected_return_in: '17h30', return_time: '00:00', device: 'Microphone', status: 'Overdue' },

];
