import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { reportType, dateFrom, dateTo } = await request.json();

    const shipments = await dbStore.getShipments();
    const carriers = await dbStore.getCarriers();
    const warehouses = await dbStore.getWarehouses();
    const orders = await dbStore.getOrders();

    let data: any[] = [];
    let title = 'Shipment Analytics Report';

    if (reportType === 'Delayed Shipment Report') {
      title = 'Delayed Shipments Analytics Report';
      data = shipments
        .filter(s => s.currentStatus === 'DELAYED' || s.delayDays > 0)
        .map(s => ({
          'Tracking Number': s.trackingNo,
          'Order ID': s.orderNumber,
          'Customer': s.customerName,
          'Carrier': s.carrierName,
          'Delay (Days)': s.delayDays,
          'Current Location': s.currentLocation,
          'Destination': s.destinationCity,
          'Status': s.currentStatus
        }));
    } else if (reportType === 'Carrier Performance Report') {
      title = 'Carrier On-Time Delivery Report';
      data = carriers.map(c => ({
        'Carrier Name': c.name,
        'Code': c.code,
        'Service Type': c.serviceType,
        'On-Time Rate (%)': `${c.onTimeRate}%`,
        'Contact Phone': c.contactPhone,
        'Status': c.status
      }));
    } else if (reportType === 'Warehouse Report') {
      title = 'Warehouse Capacity & Utilization Report';
      data = warehouses.map(w => ({
        'Warehouse Name': w.name,
        'City': w.city,
        'State': w.state,
        'Capacity': w.capacity,
        'Current Utilization': w.currentUtilization,
        'Utilization (%)': `${Math.round((w.currentUtilization / w.capacity) * 100)}%`,
        'Manager': w.managerName
      }));
    } else {
      title = 'Full Shipment Tracking Summary';
      data = shipments.map(s => ({
        'Tracking No': s.trackingNo,
        'Order ID': s.orderNumber,
        'Customer': s.customerName,
        'Carrier': s.carrierName,
        'Origin Hub': s.originWarehouseName,
        'Destination': s.destinationCity,
        'Status': s.currentStatus,
        'ETA': s.expectedDelivery
      }));
    }

    return NextResponse.json({
      success: true,
      reportTitle: title,
      generatedAt: new Date().toISOString(),
      totalRecords: data.length,
      records: data
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
