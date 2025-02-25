import { useMemo, useState } from 'react';

export function useTables() {
  // Mock data for demonstration
  const [tables] = useState([
    { name: 'Table B2', status: 'occupied', seats: 6, items: 8 },
    { name: 'Table A1', status: 'available', seats: 4, items: 3 },
    { name: 'Table C3', status: 'available', seats: 2, items: 1 },
    { name: 'Table D4', status: 'occupied', seats: 8, items: 6 },
    { name: 'Table E4', status: 'occupied', seats: 8, items: 6 },
    { name: 'Table F4', status: 'occupied', seats: 8, items: 6 },
    { name: 'Table G4', status: 'occupied', seats: 8, items: 6 },
    { name: 'Table B3', status: 'occupied', seats: 6, items: 8 },
    { name: 'Table A3', status: 'available', seats: 4, items: 3 },
    { name: 'Table C4', status: 'available', seats: 2, items: 1 },
    { name: 'Table D6', status: 'occupied', seats: 8, items: 6 },
    { name: 'Table E9', status: 'occupied', seats: 8, items: 6 },
    { name: 'Table F5', status: 'occupied', seats: 8, items: 6 },
    { name: 'Table G1', status: 'occupied', seats: 8, items: 6 },
  ]);

  // Memoized calculations
  const totalTables = useMemo(() => tables.length, [tables]);

  const availableTables = useMemo(() => {
    return tables.filter((table) => table.status === 'available').length;
  }, [tables]);

  const occupiedTables = useMemo(() => {
    return tables.filter((table) => table.status === 'occupied').length;
  }, [tables]);

  const totalCapacity = useMemo(() => {
    return tables.reduce((sum, table) => sum + table.seats, 0);
  }, [tables]);

  const activeOrders = useMemo(() => {
    return tables.reduce((sum, table) => sum + table.items, 0);
  }, [tables]);

  const tableNames = useMemo<string[]>(() => tables.map((table) => table.name), [tables]);

  return {
    tables,
    totalTables,
    availableTables,
    occupiedTables,
    totalCapacity,
    activeOrders,
    tableNames,
  };
}
