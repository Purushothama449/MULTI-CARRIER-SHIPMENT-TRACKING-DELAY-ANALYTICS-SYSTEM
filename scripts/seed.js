const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const INITIAL_ROLES = [
  { id: 'role-admin', name: 'ADMIN', description: 'Full system administration access' },
  { id: 'role-staff', name: 'WAREHOUSE_STAFF', description: 'Warehouse and dispatch management' },
  { id: 'role-driver', name: 'CARRIER_DRIVER', description: 'Driver and pickup/delivery tracking' },
  { id: 'role-customer', name: 'CUSTOMER', description: 'Customer order and shipment view' },
];

const INITIAL_USERS = [
  { id: 'usr-1', name: 'Admin User', email: 'admin@shiptrack.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-admin' },
  { id: 'usr-2', name: 'Rajesh Kumar', email: 'rajesh@shiptrack.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-staff' },
  { id: 'usr-3', name: 'Vikram Singh', email: 'vikram@bluedart.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-driver' },
  { id: 'usr-4', name: 'Rohit Sharma', email: 'rohit@gmail.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-customer' },
  { id: 'usr-5', name: 'Priya Mehta', email: 'priya@gmail.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-customer' },
  { id: 'usr-6', name: 'Arjun Kumar', email: 'arjun@gmail.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-customer' },
  { id: 'usr-7', name: 'Sneha Reddy', email: 'sneha@gmail.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-customer' },
  { id: 'usr-8', name: 'Karan Patel', email: 'karan@gmail.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-customer' },
  { id: 'usr-9', name: 'Ananya Roy', email: 'ananya@gmail.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-customer' },
  { id: 'usr-10', name: 'Suresh Iyer', email: 'suresh@delhivery.com', passwordHash: '$2a$10$wT33vG2a5t9.W.G.S1vH0e8yZ2D6/0V4r2bN5A6s7D8e9F0g1H2i3', roleId: 'role-staff' }
];

const INITIAL_CARRIERS = [
  { id: 'car-1', name: 'BlueDart', code: 'BLUEDART', contactPhone: '+91 1800 209 6161', contactEmail: 'support@bluedart.com', serviceType: 'Express', onTimeRate: 92.0, status: 'ACTIVE' },
  { id: 'car-2', name: 'Delhivery', code: 'DELHIVERY', contactPhone: '+91 124 6719500', contactEmail: 'support@delhivery.com', serviceType: 'Standard', onTimeRate: 86.0, status: 'ACTIVE' },
  { id: 'car-3', name: 'DTDC', code: 'DTDC', contactPhone: '+91 80 2536 5032', contactEmail: 'customersupport@dtdc.com', serviceType: 'Express', onTimeRate: 78.0, status: 'ACTIVE' },
  { id: 'car-4', name: 'FedEx', code: 'FEDEX', contactPhone: '+91 1800 419 4339', contactEmail: 'india@fedex.com', serviceType: 'Express', onTimeRate: 81.0, status: 'ACTIVE' },
  { id: 'car-5', name: 'Ecom Express', code: 'ECOMEXP', contactPhone: '+91 8376 888 888', contactEmail: 'info@ecomexpress.in', serviceType: 'Same Day', onTimeRate: 69.0, status: 'ACTIVE' }
];

const INITIAL_WAREHOUSES = [
  { id: 'wh-1', name: 'Bangalore Warehouse', location: 'Peenya Industrial Area', city: 'Bangalore', state: 'Karnataka', capacity: 15000, currentUtilization: 13500, managerName: 'Ramesh Naidu' },
  { id: 'wh-2', name: 'Chennai Hub', location: 'Sriperumbudur Logistics Park', city: 'Chennai', state: 'Tamil Nadu', capacity: 12000, currentUtilization: 9400, managerName: 'Karthik Subramanian' },
  { id: 'wh-3', name: 'Mumbai Hub', location: 'Bhiwandi Logistics Hub', city: 'Mumbai', state: 'Maharashtra', capacity: 20000, currentUtilization: 16800, managerName: 'Sachin Tendulkar' },
  { id: 'wh-4', name: 'Delhi Hub', location: 'Okhla Industrial Estate', city: 'Delhi', state: 'Delhi NCR', capacity: 18000, currentUtilization: 14200, managerName: 'Amit Shah' },
  { id: 'wh-5', name: 'Hyderabad Warehouse', location: 'Shamshabad Trade Zone', city: 'Hyderabad', state: 'Telangana', capacity: 10000, currentUtilization: 7100, managerName: 'Venkatesh Rao' },
  { id: 'wh-6', name: 'Kolkata Hub', location: 'Dankuni Express Zone', city: 'Kolkata', state: 'West Bengal', capacity: 11000, currentUtilization: 8200, managerName: 'Subhash Bose' },
  { id: 'wh-7', name: 'Ahmedabad Warehouse', location: 'Sanand Industrial Hub', city: 'Ahmedabad', state: 'Gujarat', capacity: 9000, currentUtilization: 6500, managerName: 'Jignesh Patel' },
  { id: 'wh-8', name: 'Pune Hub', location: 'Chakan MIDC', city: 'Pune', state: 'Maharashtra', capacity: 8500, currentUtilization: 5900, managerName: 'Prakash Deshmukh' }
];

const INITIAL_CUSTOMERS = [
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

const INITIAL_ORDERS = [
  { id: 'ord-1001', orderNumber: 'ORD1001', customerId: 'cust-1', orderDate: new Date('2025-09-15T09:30:00Z'), totalAmount: 12500.00, status: 'SHIPPED', itemsCount: 3 },
  { id: 'ord-1002', orderNumber: 'ORD1002', customerId: 'cust-2', orderDate: new Date('2025-09-16T11:15:00Z'), totalAmount: 8900.50, status: 'DELIVERED', itemsCount: 2 },
  { id: 'ord-1003', orderNumber: 'ORD1003', customerId: 'cust-3', orderDate: new Date('2025-09-17T14:45:00Z'), totalAmount: 34500.00, status: 'SHIPPED', itemsCount: 5 },
  { id: 'ord-1004', orderNumber: 'ORD1004', customerId: 'cust-4', orderDate: new Date('2025-09-18T10:20:00Z'), totalAmount: 15400.00, status: 'SHIPPED', itemsCount: 1 },
  { id: 'ord-1005', orderNumber: 'ORD1005', customerId: 'cust-5', orderDate: new Date('2025-09-19T16:00:00Z'), totalAmount: 6700.00, status: 'DELIVERED', itemsCount: 4 },
  { id: 'ord-1006', orderNumber: 'ORD1006', customerId: 'cust-6', orderDate: new Date('2025-09-20T12:30:00Z'), totalAmount: 22100.00, status: 'PROCESSING', itemsCount: 2 },
  { id: 'ord-1007', orderNumber: 'ORD1007', customerId: 'cust-7', orderDate: new Date('2025-09-21T08:10:00Z'), totalAmount: 19800.00, status: 'SHIPPED', itemsCount: 3 },
  { id: 'ord-1008', orderNumber: 'ORD1008', customerId: 'cust-8', orderDate: new Date('2025-09-22T15:20:00Z'), totalAmount: 4120.00, status: 'DELIVERED', itemsCount: 1 },
  { id: 'ord-1009', orderNumber: 'ORD1009', customerId: 'cust-9', orderDate: new Date('2025-09-23T17:40:00Z'), totalAmount: 28900.00, status: 'SHIPPED', itemsCount: 6 },
  { id: 'ord-1010', orderNumber: 'ORD1010', customerId: 'cust-10', orderDate: new Date('2025-09-24T13:00:00Z'), totalAmount: 9350.00, status: 'PENDING', itemsCount: 2 }
];

const INITIAL_SHIPMENTS = [
  {
    id: 'shp-102345',
    trackingNo: 'TRK102345',
    orderId: 'ord-1001',
    carrierId: 'car-1',
    originWarehouseId: 'wh-1',
    destWarehouseId: 'wh-3',
    customerName: 'Rohit Sharma',
    destinationCity: 'Mumbai',
    expectedDelivery: new Date('2025-10-02T18:00:00Z'),
    currentStatus: 'IN_TRANSIT',
    delayDays: 0,
    currentLocation: 'Bangalore Hub',
    createdAt: new Date('2025-09-25T10:00:00Z')
  },
  {
    id: 'shp-102346',
    trackingNo: 'TRK102346',
    orderId: 'ord-1002',
    carrierId: 'car-2',
    originWarehouseId: 'wh-1',
    destWarehouseId: 'wh-1',
    customerName: 'Priya Mehta',
    destinationCity: 'Bangalore',
    expectedDelivery: new Date('2025-09-29T17:00:00Z'),
    actualDelivery: new Date('2025-09-29T16:15:00Z'),
    currentStatus: 'DELIVERED',
    delayDays: 0,
    currentLocation: 'Bangalore',
    createdAt: new Date('2025-09-26T09:00:00Z')
  },
  {
    id: 'shp-102347',
    trackingNo: 'TRK102347',
    orderId: 'ord-1003',
    carrierId: 'car-3',
    originWarehouseId: 'wh-1',
    destWarehouseId: 'wh-2',
    customerName: 'Arjun Kumar',
    destinationCity: 'Chennai',
    expectedDelivery: new Date('2025-09-28T12:00:00Z'),
    currentStatus: 'DELAYED',
    delayDays: 2,
    currentLocation: 'Chennai Hub',
    createdAt: new Date('2025-09-24T08:00:00Z')
  },
  {
    id: 'shp-102348',
    trackingNo: 'TRK102348',
    orderId: 'ord-1004',
    carrierId: 'car-1',
    originWarehouseId: 'wh-1',
    destWarehouseId: 'wh-5',
    customerName: 'Sneha Reddy',
    destinationCity: 'Hyderabad',
    expectedDelivery: new Date('2025-10-03T15:00:00Z'),
    currentStatus: 'IN_TRANSIT',
    delayDays: 0,
    currentLocation: 'In Transit',
    createdAt: new Date('2025-09-27T11:00:00Z')
  },
  {
    id: 'shp-102349',
    trackingNo: 'TRK102349',
    orderId: 'ord-1005',
    carrierId: 'car-2',
    originWarehouseId: 'wh-3',
    destWarehouseId: 'wh-7',
    customerName: 'Karan Patel',
    destinationCity: 'Ahmedabad',
    expectedDelivery: new Date('2025-09-27T18:00:00Z'),
    actualDelivery: new Date('2025-09-27T17:30:00Z'),
    currentStatus: 'DELIVERED',
    delayDays: 0,
    currentLocation: 'Ahmedabad',
    createdAt: new Date('2025-09-24T14:00:00Z')
  },
  {
    id: 'shp-102350',
    trackingNo: 'TRK102350',
    orderId: 'ord-1007',
    carrierId: 'car-4',
    originWarehouseId: 'wh-1',
    destWarehouseId: 'wh-1',
    customerName: 'Vikram Joshi',
    destinationCity: 'Bangalore',
    expectedDelivery: new Date('2025-09-29T10:00:00Z'),
    currentStatus: 'DELAYED',
    delayDays: 1,
    currentLocation: 'Bangalore Hub',
    createdAt: new Date('2025-09-26T12:00:00Z')
  },
  {
    id: 'shp-102351',
    trackingNo: 'TRK102351',
    orderId: 'ord-1009',
    carrierId: 'car-5',
    originWarehouseId: 'wh-3',
    destWarehouseId: 'wh-3',
    customerName: 'Rohit Sharma',
    destinationCity: 'Mumbai',
    expectedDelivery: new Date('2025-09-27T09:00:00Z'),
    currentStatus: 'DELAYED',
    delayDays: 3,
    currentLocation: 'Mumbai Hub',
    createdAt: new Date('2025-09-23T07:00:00Z')
  },
  {
    id: 'shp-102352',
    trackingNo: 'TRK102352',
    orderId: 'ord-1003',
    carrierId: 'car-3',
    originWarehouseId: 'wh-2',
    destWarehouseId: 'wh-5',
    customerName: 'Sneha Reddy',
    destinationCity: 'Hyderabad',
    expectedDelivery: new Date('2025-09-29T14:00:00Z'),
    currentStatus: 'DELAYED',
    delayDays: 1,
    currentLocation: 'In Transit',
    createdAt: new Date('2025-09-25T16:00:00Z')
  },
  {
    id: 'shp-102353',
    trackingNo: 'TRK102353',
    orderId: 'ord-1009',
    carrierId: 'car-5',
    originWarehouseId: 'wh-4',
    destWarehouseId: 'wh-4',
    customerName: 'Manish Verma',
    destinationCity: 'Delhi',
    expectedDelivery: new Date('2025-09-26T11:00:00Z'),
    currentStatus: 'DELAYED',
    delayDays: 4,
    currentLocation: 'Delhi Hub',
    createdAt: new Date('2025-09-21T10:00:00Z')
  }
];

async function main() {
  console.log('🌱 Starting Database Seeding for ShipTrack...');

  // Clean tables
  await prisma.shipmentStatusHistory.deleteMany({});
  await prisma.routeLeg.deleteMany({});
  await prisma.shipment.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.carrier.deleteMany({});
  await prisma.warehouse.deleteMany({});

  // Seed Roles
  for (const role of INITIAL_ROLES) {
    await prisma.role.create({ data: role });
  }

  // Seed Users
  for (const user of INITIAL_USERS) {
    await prisma.user.create({ data: user });
  }

  // Seed Carriers
  for (const carrier of INITIAL_CARRIERS) {
    await prisma.carrier.create({ data: carrier });
  }

  // Seed Warehouses
  for (const wh of INITIAL_WAREHOUSES) {
    await prisma.warehouse.create({ data: wh });
  }

  // Seed Customers
  for (const customer of INITIAL_CUSTOMERS) {
    await prisma.customer.create({ data: customer });
  }

  // Seed Orders
  for (const order of INITIAL_ORDERS) {
    await prisma.order.create({ data: order });
  }

  // Seed Shipments
  for (const shp of INITIAL_SHIPMENTS) {
    await prisma.shipment.create({ data: shp });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
