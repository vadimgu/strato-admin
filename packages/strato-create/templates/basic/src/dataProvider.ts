import { DataProvider, RaRecord } from '@strato-admin/admin';

// Initial data
const initialData: Record<string, RaRecord[]> = {
  products: [
    { id: '1', name: 'Product 1', description: 'A great product' },
    { id: '2', name: 'Product 2', description: 'Another great product' },
  ],
};

// Simple in-memory/localStorage data provider
export const dataProvider: DataProvider = {
  getList: async (resource) => {
    const data = JSON.parse(localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []));
    return {
      data,
      total: data.length,
    };
  },
  getOne: async (resource, params) => {
    const data = JSON.parse(localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []));
    const record = data.find((r: RaRecord) => r.id === params.id);
    if (!record) {
      throw new Error('Record not found');
    }
    return {
      data: record as any,
    };
  },
  getMany: async (resource, params) => {
    const data = JSON.parse(localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []));
    return {
      data: data.filter((r: RaRecord) => params.ids.includes(r.id)),
    };
  },
  getManyReference: async (resource, params) => {
    const data = JSON.parse(localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []));
    const filteredData = data.filter((r: RaRecord) => r[params.target] === params.id);
    return {
      data: filteredData,
      total: filteredData.length,
    };
  },
  update: async (resource, params) => {
    const data = JSON.parse(localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []));
    const index = data.findIndex((r: RaRecord) => r.id === params.id);
    if (index === -1) {
      throw new Error('Record not found');
    }
    data[index] = { ...data[index], ...params.data };
    localStorage.setItem(`strato-data-${resource}`, JSON.stringify(data));
    return { data: data[index] as any };
  },
  updateMany: async (resource, params) => {
    const data = JSON.parse(localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []));
    params.ids.forEach(id => {
      const index = data.findIndex((r: RaRecord) => r.id === id);
      if (index !== -1) {
        data[index] = { ...data[index], ...params.data };
      }
    });
    localStorage.setItem(`strato-data-${resource}`, JSON.stringify(data));
    return { data: params.ids };
  },
  create: async (resource, params) => {
    const data = JSON.parse(localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []));
    const newRecord = { ...params.data, id: Math.random().toString(36).substr(2, 9) };
    data.push(newRecord);
    localStorage.setItem(`strato-data-${resource}`, JSON.stringify(data));
    return { data: newRecord as any };
  },
  delete: async (resource, params) => {
    const data = JSON.parse(localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []));
    const filteredData = data.filter((r: RaRecord) => r.id !== params.id);
    localStorage.setItem(`strato-data-${resource}`, JSON.stringify(filteredData));
    return { data: params.previousData as any };
  },
  deleteMany: async (resource, params) => {
    const data = JSON.parse(localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []));
    const filteredData = data.filter((r: RaRecord) => !params.ids.includes(r.id));
    localStorage.setItem(`strato-data-${resource}`, JSON.stringify(filteredData));
    return { data: params.ids };
  },
};
