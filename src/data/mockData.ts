export interface Device {
	id: number;
	name: string;
	location: string;
	status: string;
	quantity: number;
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

export interface User {
	id: number;
	username: string;
	password: string;
}

export const users: User[] = [
	{ id: 1, username: 'admin', password: 'admin' },
	{ id: 2, username: 'user', password: 'user' },
	{ id: 3, username: 'test', password: 'test' }
];

export const devicesRow: Device[] = [
	{ id: 1, name: 'Microphobe', location: 'D9-202', status: 'Active', quantity: 20 },
	{ id: 2, name: 'Eletric Outlet', location: 'D9-202', status: 'Maintenance', quantity: 10 },
	{ id: 3, name: 'Diddy', location: 'Thai Nguyen', status: 'Active', quantity: 5 }
];
export const devicesCol = [
	{ field: 'id', headerName: 'ID', width: 100 },
	{ field: 'name', headrName: 'Name', width: 230 },
	{ field: 'location', headrName: 'Location', width: 300 },
	{ field: 'status', headrName: 'Status', width: 300 },
	{ field: 'quantity', headrName: 'Quantity', width: 300 },
]

export const tickets: Ticket[] = [
	{ id: 1, borrower_id: '20207632', name: 'Nguyen Viet Thanh', tag: 'Student', borrow_time: '15:30', expected_return_in: '17h30', return_time: '00:00', device: 'Microphone', status: 'Borrowed' },
	{ id: 2, borrower_id: '20207632', name: 'Nguyen Viet Thanh', tag: 'Student', borrow_time: '15:30', expected_return_in: '17h30', return_time: '00:00', device: 'Microphone', status: 'Rerturned' },
	{ id: 3, borrower_id: '20207632', name: 'Nguyen Viet Thanh', tag: 'Student', borrow_time: '15:30', expected_return_in: '17h30', return_time: '00:00', device: 'Microphone', status: 'Borrowed' },
	{ id: 4, borrower_id: '20207632', name: 'Nguyen Viet Thanh', tag: 'Student', borrow_time: '15:30', expected_return_in: '17h30', return_time: '00:00', device: 'Microphone', status: 'Overdue' },

];

