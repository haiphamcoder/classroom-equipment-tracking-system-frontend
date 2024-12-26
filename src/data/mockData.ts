export interface Device {
	id: number,
	name: string,
	roomName: string,
	buildingName: string,
	status: 'AVAILABLE' | 'UNAVAILABLE' | 'BORROWED' | 'DAMAGED' | 'NORMAL' | 'LOST'
	quantity: number,
	action: string,
}

export interface Ticket {
	id: number,
	borrowerName: string,
	staffName: string,
	date: string
	borrowTime: string,
	returnDeadline: string,
	status: 'BORROWED' | 'RETURNED' | 'OVERDUE' | 'CANCELED',
	items: Array<Items>,
	action: string,
}
export interface Items {
	id: number,
	equipmentName: string,
	quantity: number,
	status: 'AVAILABLE' | 'UNAVAILABLE' | 'BORROWED' | 'DAMAGED' | 'NORMAL' | 'LOST',
	notes: string,
}
export interface NewTicket {
	borrowerId: number,
	staffId: number,
	borrowTime: string,
	returnDeadline: string,
	items: Array<NewTicketItems>,
}
export interface NewTicketItems {
	equipmentId: number,
	quantity: number,
	notes: string,
}
export interface NewDevice {
	name: string,
	roomId: number,
	quantity: number,
}
export interface UpdateDevice {
	id: number,
	name: string,
	status: DeviceStatus,
	quantity: number,
}
export interface UpdateTicket {
	orderId: number,
	newDeadline: string,
}
type DeviceStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'BORROWED' | 'DAMAGED' | 'NORMAL' | 'LOST'
export interface RoomListId {
	roomId: number,
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
export const Staff: User[] = [];

export interface TicketExport {
	borrowerName: string;
	status: 'BORROWED' | 'RETURNED' | 'OVERDUE' | 'CANCELED',
	startDate: string;
	endDate: string;
	sortBy: 'BORROWER';
	sortDirection: string;
}
export interface ReturnOrderItem {
	orderItemId: number;
	returnQuantity: number;
	status: 'AVAILABLE' | 'UNAVAILABLE' | 'BORROWED' | 'DAMAGED' | 'NORMAL' | 'LOST',
	notes: string;
}

export interface ReturnOrderRequest {
	orderId: number;
	staffId: number;
	items: ReturnOrderItem[];
}
