// Realistic seed data for ShipTrack Multi-Carrier Shipment System

export interface SeedRole {
  id: string;
  name: 'ADMIN' | 'WAREHOUSE_STAFF' | 'CARRIER_DRIVER' | 'CUSTOMER';
  description: string;
}

export interface SeedUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // bcrypt hash for "password123"
  roleId: string;
  roleName: string;
}

export interface SeedCustomer {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface SeedCarrier {
  id: string;
  name: string;
  code: string;
  contactPhone: string;
  contactEmail: string;
  serviceType: string;
  onTimeRate: number;
  status: string;
}

export interface SeedWarehouse {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  capacity: number;
  currentUtilization: number;
  managerName: string;
}

export interface SeedOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  itemsCount: number;
}

export interface SeedRouteLeg {
  id: string;
  sequenceNumber: number;
  fromLocation: string;
  toLocation: string;
  status: string;
  departureTime?: string;
  arrivalTime?: string;
}

export interface SeedShipment {
  id: string;
  trackingNo: string;
  orderId: string;
  orderNumber: string;
  carrierId: string;
  carrierName: string;
  originWarehouseId: string;
  originWarehouseName: string;
  destWarehouseId?: string;
  destWarehouseName?: string;
  customerName: string;
  destinationCity: string;
  expectedDelivery: string;
  actualDelivery?: string;
  currentStatus: 'PENDING' | 'CONFIRMED' | 'PICKED_UP' | 'IN_TRANSIT' | 'AT_HUB' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'DELAYED' | 'CANCELLED';
  delayDays: number;
  currentLocation: string;
  routeLegs: SeedRouteLeg[];
  createdAt: string;
}

export interface SeedTrackingEvent {
  id: string;
  shipment_id: string;
  tracking_no: string;
  event_type: string;
  location: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  source_device: string;
  remarks: string;
}

export interface SeedAlert {
  id: string;
  title: string;
  message: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  targetUrl: string;
}

export const INITIAL_ROLES: SeedRole[] = [
  { id: 'role-admin', name: 'ADMIN', description: 'Full system administration access' },
  { id: 'role-staff', name: 'WAREHOUSE_STAFF', description: 'Warehouse and dispatch management' },
  { id: 'role-driver', name: 'CARRIER_DRIVER', description: 'Driver and pickup/delivery tracking' },
  { id: 'role-customer', name: 'CUSTOMER', description: 'Customer order and shipment view' },
];

export const INITIAL_USERS: SeedUser[] = [
  { id: 'usr-1', name: 'Admin User', email: 'admin@shiptrack.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-admin', roleName: 'ADMIN' },
  { id: 'usr-2', name: 'Rajesh Kumar', email: 'rajesh@shiptrack.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-staff', roleName: 'WAREHOUSE_STAFF' },
  { id: 'usr-3', name: 'Vikram Singh', email: 'vikram@bluedart.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-driver', roleName: 'CARRIER_DRIVER' },
  { id: 'usr-4', name: 'Rohit Sharma', email: 'rohit@gmail.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-customer', roleName: 'CUSTOMER' },
  { id: 'usr-5', name: 'Priya Mehta', email: 'priya@gmail.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-customer', roleName: 'CUSTOMER' },
  { id: 'usr-6', name: 'Arjun Kumar', email: 'arjun@gmail.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-customer', roleName: 'CUSTOMER' },
  { id: 'usr-7', name: 'Sneha Reddy', email: 'sneha@gmail.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-customer', roleName: 'CUSTOMER' },
  { id: 'usr-8', name: 'Karan Patel', email: 'karan@gmail.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-customer', roleName: 'CUSTOMER' },
  { id: 'usr-9', name: 'Ananya Roy', email: 'ananya@gmail.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-customer', roleName: 'CUSTOMER' },
  { id: 'usr-10', name: 'Suresh Iyer', email: 'suresh@delhivery.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-staff', roleName: 'WAREHOUSE_STAFF' }
];

export const INITIAL_CARRIERS: SeedCarrier[] = [
  { id: 'car-1', name: 'BlueDart', code: 'BLUEDART', contactPhone: '+91 1800 209 6161', contactEmail: 'support@bluedart.com', serviceType: 'Express', onTimeRate: 92, status: 'ACTIVE' },
  { id: 'car-2', name: 'Delhivery', code: 'DELHIVERY', contactPhone: '+91 124 6719500', contactEmail: 'support@delhivery.com', serviceType: 'Standard', onTimeRate: 86, status: 'ACTIVE' },
  { id: 'car-3', name: 'DTDC', code: 'DTDC', contactPhone: '+91 80 2536 5032', contactEmail: 'customersupport@dtdc.com', serviceType: 'Express', onTimeRate: 78, status: 'ACTIVE' },
  { id: 'car-4', name: 'FedEx', code: 'FEDEX', contactPhone: '+91 1800 419 4339', contactEmail: 'india@fedex.com', serviceType: 'Express', onTimeRate: 81, status: 'ACTIVE' },
  { id: 'car-5', name: 'Ecom Express', code: 'ECOMEXP', contactPhone: '+91 8376 888 888', contactEmail: 'info@ecomexpress.in', serviceType: 'Same Day', onTimeRate: 69, status: 'ACTIVE' }
];

export const INITIAL_WAREHOUSES: SeedWarehouse[] = [
  { id: 'wh-1', name: 'Bangalore Warehouse', location: 'Peenya Industrial Area', city: 'Bangalore', state: 'Karnataka', capacity: 15000, currentUtilization: 13500, managerName: 'Ramesh Naidu' },
  { id: 'wh-2', name: 'Chennai Hub', location: 'Sriperumbudur Logistics Park', city: 'Chennai', state: 'Tamil Nadu', capacity: 12000, currentUtilization: 9400, managerName: 'Karthik Subramanian' },
  { id: 'wh-3', name: 'Mumbai Hub', location: 'Bhiwandi Logistics Hub', city: 'Mumbai', state: 'Maharashtra', capacity: 20000, currentUtilization: 16800, managerName: 'Sachin Tendulkar' },
  { id: 'wh-4', name: 'Delhi Hub', location: 'Okhla Industrial Estate', city: 'Delhi', state: 'Delhi NCR', capacity: 18000, currentUtilization: 14200, managerName: 'Amit Shah' },
  { id: 'wh-5', name: 'Hyderabad Warehouse', location: 'Shamshabad Trade Zone', city: 'Hyderabad', state: 'Telangana', capacity: 10000, currentUtilization: 7100, managerName: 'Venkatesh Rao' },
  { id: 'wh-6', name: 'Kolkata Hub', location: 'Dankuni Express Zone', city: 'Kolkata', state: 'West Bengal', capacity: 11000, currentUtilization: 8200, managerName: 'Subhash Bose' },
  { id: 'wh-7', name: 'Ahmedabad Warehouse', location: 'Sanand Industrial Hub', city: 'Ahmedabad', state: 'Gujarat', capacity: 9000, currentUtilization: 6500, managerName: 'Jignesh Patel' },
  { id: 'wh-8', name: 'Pune Hub', location: 'Chakan MIDC', city: 'Pune', state: 'Maharashtra', capacity: 8500, currentUtilization: 5900, managerName: 'Prakash Deshmukh' }
];

export const INITIAL_CUSTOMERS: SeedCustomer[] = [
  { id: 'cust-1', userId: 'usr-4', name: 'Rohit Sharma', email: 'rohit@gmail.com', phone: '+91 98765 43210', company: 'Mumbai Traders Ltd', address: '45 Marine Drive', city: 'Mumbai', state: 'Maharashtra', pincode: '400020' },
  { id: 'cust-2', userId: 'usr-5', name: 'Priya Mehta', email: 'priya@gmail.com', phone: '+91 98123 45678', company: 'Apex Digital Solutions', address: '12 M.G. Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
  { id: 'cust-3', userId: 'usr-6', name: 'Arjun Kumar', email: 'arjun@gmail.com', phone: '+91 97890 12345', company: 'South Tech Supplies', address: '88 Anna Salai', city: 'Chennai', state: 'Tamil Nadu', pincode: '600002' },
  { id: 'cust-4', userId: 'usr-7', name: 'Sneha Reddy', email: 'sneha@gmail.com', phone: '+91 96543 21098', company: 'Reddy Retail Stores', address: '23 Banjara Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500034' },
  { id: 'cust-5', userId: 'usr-8', name: 'Karan Patel', email: 'karan@gmail.com', phone: '+91 95432 10987', company: 'Patel Overseas', address: '101 CG Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380009' },
  { id: 'cust-6', userId: 'usr-9', name: 'Ananya Roy', email: 'ananya@gmail.com', phone: '+91 94321 09876', company: 'Bengal Arts', address: '5 Park Street', city: 'Kolkata', state: 'West Bengal', pincode: '700016' },
  { id: 'cust-7', name: 'Vikram Joshi', email: 'vikram.j@gmail.com', phone: '+91 93210 98765', company: 'Joshi Automotives', address: '77 FC Road', city: 'Pune', state: 'Maharashtra', pincode: '411004' },
  { id: 'cust-8', name: 'Meera Nambiar', email: 'meera@gmail.com', phone: '+91 92109 87654', company: 'Malabar Spices', address: '14 M.G. Road', city: 'Kochi', state: 'Kerala', pincode: '682016' },
  { id: 'cust-9', name: 'Manish Verma', email: 'manish@gmail.com', phone: '+91 91098 76543', company: 'North Star Corp', address: '18 Connaught Place', city: 'Delhi', state: 'Delhi NCR', pincode: '110001' },
  { id: 'cust-10', name: 'Sunita Aggarwal', email: 'sunita@gmail.com', phone: '+91 90987 65432', company: 'Aggarwal Textiles', address: '33 Sector 17', city: 'Chandigarh', state: 'Punjab', pincode: '160017' }
];

export const INITIAL_ORDERS: SeedOrder[] = [
  { id: 'ord-1001', orderNumber: 'ORD1001', customerId: 'cust-1', customerName: 'Rohit Sharma', orderDate: '2025-09-15T09:30:00Z', totalAmount: 12500.00, status: 'SHIPPED', itemsCount: 3 },
  { id: 'ord-1002', orderNumber: 'ORD1002', customerId: 'cust-2', customerName: 'Priya Mehta', orderDate: '2025-09-16T11:15:00Z', totalAmount: 8900.50, status: 'DELIVERED', itemsCount: 2 },
  { id: 'ord-1003', orderNumber: 'ORD1003', customerId: 'cust-3', customerName: 'Arjun Kumar', orderDate: '2025-09-17T14:45:00Z', totalAmount: 34500.00, status: 'SHIPPED', itemsCount: 5 },
  { id: 'ord-1004', orderNumber: 'ORD1004', customerId: 'cust-4', customerName: 'Sneha Reddy', orderDate: '2025-09-18T10:20:00Z', totalAmount: 15400.00, status: 'SHIPPED', itemsCount: 1 },
  { id: 'ord-1005', orderNumber: 'ORD1005', customerId: 'cust-5', customerName: 'Karan Patel', orderDate: '2025-09-19T16:00:00Z', totalAmount: 6700.00, status: 'DELIVERED', itemsCount: 4 },
  { id: 'ord-1006', orderNumber: 'ORD1006', customerId: 'cust-6', customerName: 'Ananya Roy', orderDate: '2025-09-20T12:30:00Z', totalAmount: 22100.00, status: 'PROCESSING', itemsCount: 2 },
  { id: 'ord-1007', orderNumber: 'ORD1007', customerId: 'cust-7', customerName: 'Vikram Joshi', orderDate: '2025-09-21T08:10:00Z', totalAmount: 19800.00, status: 'SHIPPED', itemsCount: 3 },
  { id: 'ord-1008', orderNumber: 'ORD1008', customerId: 'cust-8', customerName: 'Meera Nambiar', orderDate: '2025-09-22T15:20:00Z', totalAmount: 4120.00, status: 'DELIVERED', itemsCount: 1 },
  { id: 'ord-1009', orderNumber: 'ORD1009', customerId: 'cust-9', customerName: 'Manish Verma', orderDate: '2025-09-23T17:40:00Z', totalAmount: 28900.00, status: 'SHIPPED', itemsCount: 6 },
  { id: 'ord-1010', orderNumber: 'ORD1010', customerId: 'cust-10', customerName: 'Sunita Aggarwal', orderDate: '2025-09-24T13:00:00Z', totalAmount: 9350.00, status: 'PENDING', itemsCount: 2 }
];

export const INITIAL_SHIPMENTS: SeedShipment[] = [
  {
    id: 'shp-102345',
    trackingNo: 'TRK102345',
    orderId: 'ord-1001',
    orderNumber: 'ORD1001',
    carrierId: 'car-1',
    carrierName: 'BlueDart',
    originWarehouseId: 'wh-1',
    originWarehouseName: 'Bangalore Warehouse',
    destWarehouseId: 'wh-3',
    destWarehouseName: 'Mumbai Hub',
    customerName: 'Rohit Sharma',
    destinationCity: 'Mumbai',
    expectedDelivery: '2025-10-02T18:00:00Z',
    currentStatus: 'IN_TRANSIT',
    delayDays: 0,
    currentLocation: 'Bangalore Hub',
    createdAt: '2025-09-25T10:00:00Z',
    routeLegs: [
      { id: 'leg-101', sequenceNumber: 1, fromLocation: 'Bangalore Warehouse', toLocation: 'Bangalore Hub', status: 'COMPLETED', departureTime: '2025-09-25T11:00:00Z', arrivalTime: '2025-09-25T13:30:00Z' },
      { id: 'leg-102', sequenceNumber: 2, fromLocation: 'Bangalore Hub', toLocation: 'Mumbai Hub', status: 'IN_PROGRESS', departureTime: '2025-09-25T14:00:00Z' }
    ]
  },
  {
    id: 'shp-102346',
    trackingNo: 'TRK102346',
    orderId: 'ord-1002',
    orderNumber: 'ORD1002',
    carrierId: 'car-2',
    carrierName: 'Delhivery',
    originWarehouseId: 'wh-1',
    originWarehouseName: 'Bangalore Warehouse',
    destWarehouseId: 'wh-1',
    destWarehouseName: 'Bangalore Hub',
    customerName: 'Priya Mehta',
    destinationCity: 'Bangalore',
    expectedDelivery: '2025-09-29T17:00:00Z',
    actualDelivery: '2025-09-29T16:15:00Z',
    currentStatus: 'DELIVERED',
    delayDays: 0,
    currentLocation: 'Bangalore',
    createdAt: '2025-09-26T09:00:00Z',
    routeLegs: [
      { id: 'leg-201', sequenceNumber: 1, fromLocation: 'Bangalore Warehouse', toLocation: 'Bangalore Hub', status: 'COMPLETED' },
      { id: 'leg-202', sequenceNumber: 2, fromLocation: 'Bangalore Hub', toLocation: 'Customer Address', status: 'COMPLETED' }
    ]
  },
  {
    id: 'shp-102347',
    trackingNo: 'TRK102347',
    orderId: 'ord-1003',
    orderNumber: 'ORD1003',
    carrierId: 'car-3',
    carrierName: 'DTDC',
    originWarehouseId: 'wh-1',
    originWarehouseName: 'Bangalore Warehouse',
    destWarehouseId: 'wh-2',
    destWarehouseName: 'Chennai Hub',
    customerName: 'Arjun Kumar',
    destinationCity: 'Chennai',
    expectedDelivery: '2025-09-28T12:00:00Z',
    currentStatus: 'DELAYED',
    delayDays: 2,
    currentLocation: 'Chennai Hub',
    createdAt: '2025-09-24T08:00:00Z',
    routeLegs: [
      { id: 'leg-301', sequenceNumber: 1, fromLocation: 'Bangalore Warehouse', toLocation: 'Chennai Hub', status: 'COMPLETED' },
      { id: 'leg-302', sequenceNumber: 2, fromLocation: 'Chennai Hub', toLocation: 'Customer Location', status: 'PENDING' }
    ]
  },
  {
    id: 'shp-102348',
    trackingNo: 'TRK102348',
    orderId: 'ord-1004',
    orderNumber: 'ORD1004',
    carrierId: 'car-1',
    carrierName: 'BlueDart',
    originWarehouseId: 'wh-1',
    originWarehouseName: 'Bangalore Warehouse',
    destWarehouseId: 'wh-5',
    destWarehouseName: 'Hyderabad Warehouse',
    customerName: 'Sneha Reddy',
    destinationCity: 'Hyderabad',
    expectedDelivery: '2025-10-03T15:00:00Z',
    currentStatus: 'IN_TRANSIT',
    delayDays: 0,
    currentLocation: 'In Transit',
    createdAt: '2025-09-27T11:00:00Z',
    routeLegs: [
      { id: 'leg-401', sequenceNumber: 1, fromLocation: 'Bangalore Warehouse', toLocation: 'Hyderabad Hub', status: 'IN_PROGRESS' }
    ]
  },
  {
    id: 'shp-102349',
    trackingNo: 'TRK102349',
    orderId: 'ord-1005',
    orderNumber: 'ORD1005',
    carrierId: 'car-2',
    carrierName: 'Delhivery',
    originWarehouseId: 'wh-3',
    originWarehouseName: 'Mumbai Hub',
    destWarehouseId: 'wh-7',
    destWarehouseName: 'Ahmedabad Warehouse',
    customerName: 'Karan Patel',
    destinationCity: 'Ahmedabad',
    expectedDelivery: '2025-09-27T18:00:00Z',
    actualDelivery: '2025-09-27T17:30:00Z',
    currentStatus: 'DELIVERED',
    delayDays: 0,
    currentLocation: 'Ahmedabad',
    createdAt: '2025-09-24T14:00:00Z',
    routeLegs: [
      { id: 'leg-501', sequenceNumber: 1, fromLocation: 'Mumbai Hub', toLocation: 'Ahmedabad Warehouse', status: 'COMPLETED' }
    ]
  },
  {
    id: 'shp-102350',
    trackingNo: 'TRK102350',
    orderId: 'ord-1007',
    orderNumber: 'ORD1007',
    carrierId: 'car-4',
    carrierName: 'FedEx',
    originWarehouseId: 'wh-1',
    originWarehouseName: 'Bangalore Warehouse',
    destWarehouseId: 'wh-1',
    destWarehouseName: 'Bangalore Hub',
    customerName: 'Vikram Joshi',
    destinationCity: 'Bangalore',
    expectedDelivery: '2025-09-29T10:00:00Z',
    currentStatus: 'DELAYED',
    delayDays: 1,
    currentLocation: 'Bangalore Hub',
    createdAt: '2025-09-26T12:00:00Z',
    routeLegs: []
  },
  {
    id: 'shp-102351',
    trackingNo: 'TRK102351',
    orderId: 'ord-1009',
    orderNumber: 'ORD1009',
    carrierId: 'car-5',
    carrierName: 'Ecom Express',
    originWarehouseId: 'wh-3',
    originWarehouseName: 'Mumbai Hub',
    destWarehouseId: 'wh-3',
    destWarehouseName: 'Mumbai Hub',
    customerName: 'Rohit Sharma',
    destinationCity: 'Mumbai',
    expectedDelivery: '2025-09-27T09:00:00Z',
    currentStatus: 'DELAYED',
    delayDays: 3,
    currentLocation: 'Mumbai Hub',
    createdAt: '2025-09-23T07:00:00Z',
    routeLegs: []
  },
  {
    id: 'shp-102352',
    trackingNo: 'TRK102352',
    orderId: 'ord-1003',
    orderNumber: 'ORD1003',
    carrierId: 'car-3',
    carrierName: 'DTDC',
    originWarehouseId: 'wh-2',
    originWarehouseName: 'Chennai Hub',
    destWarehouseId: 'wh-5',
    destWarehouseName: 'Hyderabad Warehouse',
    customerName: 'Sneha Reddy',
    destinationCity: 'Hyderabad',
    expectedDelivery: '2025-09-29T14:00:00Z',
    currentStatus: 'DELAYED',
    delayDays: 1,
    currentLocation: 'In Transit',
    createdAt: '2025-09-25T16:00:00Z',
    routeLegs: []
  },
  {
    id: 'shp-102353',
    trackingNo: 'TRK102353',
    orderId: 'ord-1009',
    orderNumber: 'ORD1009',
    carrierId: 'car-5',
    carrierName: 'Ecom Express',
    originWarehouseId: 'wh-4',
    originWarehouseName: 'Delhi Hub',
    destWarehouseId: 'wh-4',
    destWarehouseName: 'Delhi Hub',
    customerName: 'Manish Verma',
    destinationCity: 'Delhi',
    expectedDelivery: '2025-09-26T11:00:00Z',
    currentStatus: 'DELAYED',
    delayDays: 4,
    currentLocation: 'Delhi Hub',
    createdAt: '2025-09-21T10:00:00Z',
    routeLegs: []
  }
];

export const INITIAL_TRACKING_EVENTS: SeedTrackingEvent[] = [
  { id: 'evt-101', shipment_id: 'shp-102345', tracking_no: 'TRK102345', event_type: 'DEPARTED_HUB', location: 'Bangalore Hub', latitude: 12.9716, longitude: 77.5946, timestamp: '10:32 AM', source_device: 'Carrier App', remarks: 'Departed towards Mumbai Transit' },
  { id: 'evt-102', shipment_id: 'shp-102350', tracking_no: 'TRK102350', event_type: 'ARRIVED_HUB', location: 'Chennai Hub', latitude: 13.0827, longitude: 80.2707, timestamp: '09:15 AM', source_device: 'Hub Scanner', remarks: 'Package scanned at sorting terminal' },
  { id: 'evt-103', shipment_id: 'shp-102351', tracking_no: 'TRK102351', event_type: 'OUT_FOR_DELIVERY', location: 'Hyderabad', latitude: 17.3850, longitude: 78.4867, timestamp: '08:47 AM', source_device: 'Driver App', remarks: 'Out with delivery agent Kumar' },
  { id: 'evt-104', shipment_id: 'shp-102346', tracking_no: 'TRK102346', event_type: 'DELIVERED', location: 'Mumbai', latitude: 19.0760, longitude: 72.8777, timestamp: '07:30 AM', source_device: 'Driver App', remarks: 'Delivered and signed by Priya' },
  { id: 'evt-105', shipment_id: 'shp-102353', tracking_no: 'TRK102353', event_type: 'DELAY_REPORTED', location: 'Delhi Hub', latitude: 28.7041, longitude: 77.1025, timestamp: '06:15 AM', source_device: 'System Monitor', remarks: 'Heavy traffic congestion delay' }
];

export const INITIAL_ALERTS: SeedAlert[] = [
  { id: 'alt-1', title: 'Shipment TRK102353 delayed by 4 days', message: 'Delhi Hub delivery delayed due to local transit bottleneck.', severity: 'HIGH', timestamp: '2 hours ago', targetUrl: '/shipments?status=DELAYED' },
  { id: 'alt-2', title: 'Warehouse Bangalore capacity at 90%', message: 'Utilization is at 13,500 / 15,000 units.', severity: 'MEDIUM', timestamp: '5 hours ago', targetUrl: '/warehouses' },
  { id: 'alt-3', title: 'Carrier DTDC delivery success rate below 70%', message: 'On-time rating dropped to 78%.', severity: 'MEDIUM', timestamp: '1 day ago', targetUrl: '/carriers' },
  { id: 'alt-4', title: '10 shipments pending dispatch', message: 'Pending dispatch at Bangalore and Chennai hubs.', severity: 'LOW', timestamp: '1 day ago', targetUrl: '/shipments?status=PENDING' }
];
