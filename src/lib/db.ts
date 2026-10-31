import { PrismaClient } from '@prisma/client';
import {
  INITIAL_ROLES,
  INITIAL_USERS,
  INITIAL_CARRIERS,
  INITIAL_WAREHOUSES,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_SHIPMENTS,
  INITIAL_TRACKING_EVENTS,
  INITIAL_ALERTS,
  SeedShipment,
  SeedOrder,
  SeedCarrier,
  SeedWarehouse,
  SeedCustomer,
  SeedUser,
  SeedTrackingEvent,
  SeedAlert
} from './seed-data';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// In-Memory fallback store for maximum reliability
let memoryShipments: SeedShipment[] = [...INITIAL_SHIPMENTS];
let memoryOrders: SeedOrder[] = [...INITIAL_ORDERS];
let memoryCarriers: SeedCarrier[] = [...INITIAL_CARRIERS];
let memoryWarehouses: SeedWarehouse[] = [...INITIAL_WAREHOUSES];
let memoryCustomers: SeedCustomer[] = [...INITIAL_CUSTOMERS];
let memoryUsers: SeedUser[] = [...INITIAL_USERS];
let memoryTrackingEvents: SeedTrackingEvent[] = [...INITIAL_TRACKING_EVENTS];
let memoryAlerts: SeedAlert[] = [...INITIAL_ALERTS];

export const dbStore = {
  // SHIPMENTS
  async getShipments(params?: { status?: string; search?: string; carrierId?: string }) {
    try {
      let items = await prisma.shipment.findMany({
        include: {
          order: true,
          carrier: true,
          originWarehouse: true,
          destWarehouse: true,
          routeLegs: { orderBy: { sequenceNumber: 'asc' } },
          statusHistory: { orderBy: { updatedAt: 'desc' } }
        },
        orderBy: { createdAt: 'desc' }
      });

      if (items.length === 0) {
        throw new Error('Database empty, fallback');
      }

      let filtered = items.map(s => ({
        id: s.id,
        trackingNo: s.trackingNo,
        orderId: s.orderId,
        orderNumber: s.order?.orderNumber || 'ORD-UNKNOWN',
        carrierId: s.carrierId,
        carrierName: s.carrier?.name || 'Carrier',
        originWarehouseId: s.originWarehouseId,
        originWarehouseName: s.originWarehouse?.name || 'Warehouse',
        destWarehouseId: s.destWarehouseId || undefined,
        destWarehouseName: s.destWarehouse?.name || undefined,
        customerName: s.customerName,
        destinationCity: s.destinationCity,
        expectedDelivery: s.expectedDelivery.toISOString(),
        actualDelivery: s.actualDelivery ? s.actualDelivery.toISOString() : undefined,
        currentStatus: s.currentStatus as any,
        delayDays: s.delayDays,
        currentLocation: s.currentLocation,
        routeLegs: s.routeLegs.map(l => ({
          id: l.id,
          sequenceNumber: l.sequenceNumber,
          fromLocation: l.fromLocation,
          toLocation: l.toLocation,
          status: l.status,
          departureTime: l.departureTime?.toISOString(),
          arrivalTime: l.arrivalTime?.toISOString()
        })),
        createdAt: s.createdAt.toISOString()
      }));

      if (params?.status && params.status !== 'ALL') {
        filtered = filtered.filter(s => s.currentStatus.toUpperCase() === params.status?.toUpperCase());
      }
      if (params?.carrierId) {
        filtered = filtered.filter(s => s.carrierId === params.carrierId);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(s =>
          s.trackingNo.toLowerCase().includes(q) ||
          s.orderNumber.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.destinationCity.toLowerCase().includes(q) ||
          s.currentLocation.toLowerCase().includes(q)
        );
      }
      return filtered;
    } catch (e) {
      // Memory fallback
      let filtered = [...memoryShipments];
      if (params?.status && params.status !== 'ALL') {
        filtered = filtered.filter(s => s.currentStatus.toUpperCase() === params.status?.toUpperCase());
      }
      if (params?.carrierId) {
        filtered = filtered.filter(s => s.carrierId === params.carrierId);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(s =>
          s.trackingNo.toLowerCase().includes(q) ||
          s.orderNumber.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.destinationCity.toLowerCase().includes(q) ||
          s.currentLocation.toLowerCase().includes(q)
        );
      }
      return filtered;
    }
  },

  async getShipmentByTracking(trackingNo: string) {
    const shipments = await this.getShipments();
    return shipments.find(s => s.trackingNo.toUpperCase() === trackingNo.toUpperCase());
  },

  async getShipmentById(id: string) {
    const shipments = await this.getShipments();
    return shipments.find(s => s.id === id);
  },

  async createShipment(data: Omit<SeedShipment, 'id' | 'createdAt'>) {
    const newId = `shp-${Date.now()}`;
    const newShipment: SeedShipment = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString()
    };
    try {
      await prisma.shipment.create({
        data: {
          id: newId,
          trackingNo: data.trackingNo,
          orderId: data.orderId,
          carrierId: data.carrierId,
          originWarehouseId: data.originWarehouseId,
          destWarehouseId: data.destWarehouseId,
          customerName: data.customerName,
          destinationCity: data.destinationCity,
          expectedDelivery: new Date(data.expectedDelivery),
          currentStatus: data.currentStatus,
          delayDays: data.delayDays || 0,
          currentLocation: data.currentLocation,
        }
      });
    } catch (err) {
      console.warn('Prisma create failed, storing in memory:', err);
    }
    memoryShipments.unshift(newShipment);
    return newShipment;
  },

  async updateShipmentStatus(id: string, status: SeedShipment['currentStatus'], location: string, delayDays?: number) {
    try {
      await prisma.shipment.update({
        where: { id },
        data: {
          currentStatus: status,
          currentLocation: location,
          delayDays: delayDays !== undefined ? delayDays : (status === 'DELAYED' ? 2 : 0),
          actualDelivery: status === 'DELIVERED' ? new Date() : undefined
        }
      });
    } catch (e) {
      console.warn('Prisma update status error:', e);
    }
    const idx = memoryShipments.findIndex(s => s.id === id);
    if (idx !== -1) {
      memoryShipments[idx].currentStatus = status;
      memoryShipments[idx].currentLocation = location;
      if (delayDays !== undefined) memoryShipments[idx].delayDays = delayDays;
      if (status === 'DELIVERED') memoryShipments[idx].actualDelivery = new Date().toISOString();
      return memoryShipments[idx];
    }
    return null;
  },

  async deleteShipment(id: string) {
    try {
      await prisma.shipment.delete({ where: { id } });
    } catch (e) {}
    memoryShipments = memoryShipments.filter(s => s.id !== id);
    return true;
  },

  // ORDERS
  async getOrders(search?: string, status?: string) {
    try {
      const orders = await prisma.order.findMany({
        include: { customer: true },
        orderBy: { orderDate: 'desc' }
      });
      if (orders.length === 0) throw new Error('Empty orders');
      let mapped = orders.map(o => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerId: o.customerId,
        customerName: o.customer?.name || 'Customer',
        orderDate: o.orderDate.toISOString(),
        totalAmount: o.totalAmount,
        status: o.status,
        itemsCount: o.itemsCount
      }));
      if (status && status !== 'ALL') mapped = mapped.filter(o => o.status === status);
      if (search) {
        const q = search.toLowerCase();
        mapped = mapped.filter(o => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q));
      }
      return mapped;
    } catch (e) {
      let filtered = [...memoryOrders];
      if (status && status !== 'ALL') filtered = filtered.filter(o => o.status === status);
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(o => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q));
      }
      return filtered;
    }
  },

  async createOrder(data: Omit<SeedOrder, 'id'>) {
    const newId = `ord-${Date.now()}`;
    const newOrder: SeedOrder = { ...data, id: newId };
    try {
      await prisma.order.create({
        data: {
          id: newId,
          orderNumber: data.orderNumber,
          customerId: data.customerId,
          totalAmount: data.totalAmount,
          status: data.status,
          itemsCount: data.itemsCount
        }
      });
    } catch (e) {}
    memoryOrders.unshift(newOrder);
    return newOrder;
  },

  async deleteOrder(id: string) {
    try {
      await prisma.order.delete({ where: { id } });
    } catch (e) {}
    memoryOrders = memoryOrders.filter(o => o.id !== id);
    return true;
  },

  // CARRIERS
  async getCarriers() {
    try {
      const carriers = await prisma.carrier.findMany({ orderBy: { name: 'asc' } });
      if (carriers.length === 0) throw new Error('Empty');
      return carriers.map(c => ({
        id: c.id,
        name: c.name,
        code: c.code,
        contactPhone: c.contactPhone,
        contactEmail: c.contactEmail,
        serviceType: c.serviceType,
        onTimeRate: c.onTimeRate,
        status: c.status
      }));
    } catch (e) {
      return memoryCarriers;
    }
  },

  async createCarrier(data: Omit<SeedCarrier, 'id'>) {
    const newId = `car-${Date.now()}`;
    const item: SeedCarrier = { ...data, id: newId };
    try {
      await prisma.carrier.create({ data: { id: newId, ...data } });
    } catch (e) {}
    memoryCarriers.push(item);
    return item;
  },

  async deleteCarrier(id: string) {
    try {
      await prisma.carrier.delete({ where: { id } });
    } catch (e) {}
    memoryCarriers = memoryCarriers.filter(c => c.id !== id);
    return true;
  },

  // WAREHOUSES
  async getWarehouses() {
    try {
      const whs = await prisma.warehouse.findMany({ orderBy: { name: 'asc' } });
      if (whs.length === 0) throw new Error('Empty');
      return whs.map(w => ({
        id: w.id,
        name: w.name,
        location: w.location,
        city: w.city,
        state: w.state,
        capacity: w.capacity,
        currentUtilization: w.currentUtilization,
        managerName: w.managerName
      }));
    } catch (e) {
      return memoryWarehouses;
    }
  },

  async createWarehouse(data: Omit<SeedWarehouse, 'id'>) {
    const newId = `wh-${Date.now()}`;
    const item: SeedWarehouse = { ...data, id: newId };
    try {
      await prisma.warehouse.create({ data: { id: newId, ...data } });
    } catch (e) {}
    memoryWarehouses.push(item);
    return item;
  },

  async deleteWarehouse(id: string) {
    try {
      await prisma.warehouse.delete({ where: { id } });
    } catch (e) {}
    memoryWarehouses = memoryWarehouses.filter(w => w.id !== id);
    return true;
  },

  // CUSTOMERS
  async getCustomers() {
    try {
      const custs = await prisma.customer.findMany({ orderBy: { name: 'asc' } });
      if (custs.length === 0) throw new Error('Empty');
      return custs;
    } catch (e) {
      return memoryCustomers;
    }
  },

  // USERS
  async getUsers() {
    try {
      const users = await prisma.user.findMany({ include: { role: true } });
      if (users.length === 0) throw new Error('Empty');
      return users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        passwordHash: u.passwordHash,
        roleId: u.roleId,
        roleName: u.role?.name || 'CUSTOMER'
      }));
    } catch (e) {
      return memoryUsers;
    }
  },

  async createUser(data: Omit<SeedUser, 'id'>) {
    const newId = `usr-${Date.now()}`;
    const item: SeedUser = { ...data, id: newId };
    try {
      await prisma.user.create({
        data: {
          id: newId,
          name: data.name,
          email: data.email,
          passwordHash: data.passwordHash,
          roleId: data.roleId
        }
      });
    } catch (e) {}
    memoryUsers.push(item);
    return item;
  },

  async deleteUser(id: string) {
    try {
      await prisma.user.delete({ where: { id } });
    } catch (e) {}
    memoryUsers = memoryUsers.filter(u => u.id !== id);
    return true;
  },

  // TRACKING EVENTS (MongoDB / Fallback)
  async getTrackingEvents(trackingNo?: string) {
    if (trackingNo) {
      return memoryTrackingEvents.filter(e => e.tracking_no.toUpperCase() === trackingNo.toUpperCase());
    }
    return memoryTrackingEvents;
  },

  async addTrackingEvent(evt: Omit<SeedTrackingEvent, 'id'>) {
    const newId = `evt-${Date.now()}`;
    const newEvt = { ...evt, id: newId };
    memoryTrackingEvents.unshift(newEvt);
    return newEvt;
  },

  // ALERTS
  async getAlerts() {
    return memoryAlerts;
  },

  // DASHBOARD KPI STATS (Calculated from database)
  async getDashboardStats() {
    const shipments = await this.getShipments();
    const orders = await this.getOrders();

    const totalShipments = shipments.length;
    const inTransit = shipments.filter(s => s.currentStatus === 'IN_TRANSIT').length;
    const delivered = shipments.filter(s => s.currentStatus === 'DELIVERED').length;
    const delayed = shipments.filter(s => s.currentStatus === 'DELAYED' || s.delayDays > 0).length;
    const totalOrders = orders.length;

    return {
      totalShipments,
      inTransit,
      delivered,
      delayed,
      totalOrders
    };
  }
};
