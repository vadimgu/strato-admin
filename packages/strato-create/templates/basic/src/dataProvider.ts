type AnyRecord = { id: string | number; [key: string]: unknown };

// Initial data
const initialData: Record<string, AnyRecord[]> = {
  products: [
    { id: '1', name: 'Product 1', description: 'A great product' },
    { id: '2', name: 'Product 2', description: 'Another great product' },
  ],
};

// Simple in-memory/localStorage data provider
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dataProvider: any = {
  getList: async (resource: string) => {
    const data = JSON.parse(
      localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []),
    );
    return {
      data,
      total: data.length,
    };
  },
  getOne: async (resource: string, params: { id: string | number }) => {
    const data: AnyRecord[] = JSON.parse(
      localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []),
    );
    const record = data.find((r) => r.id === params.id);
    if (!record) {
      throw new Error('Record not found');
    }
    return { data: record };
  },
  getMany: async (resource: string, params: { ids: (string | number)[] }) => {
    const data: AnyRecord[] = JSON.parse(
      localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []),
    );
    return { data: data.filter((r) => params.ids.includes(r.id)) };
  },
  getManyReference: async (resource: string, params: { target: string; id: string | number }) => {
    const data: AnyRecord[] = JSON.parse(
      localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []),
    );
    const filteredData = data.filter((r) => r[params.target] === params.id);
    return { data: filteredData, total: filteredData.length };
  },
  update: async (resource: string, params: { id: string | number; data: Partial<AnyRecord> }) => {
    const data: AnyRecord[] = JSON.parse(
      localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []),
    );
    const index = data.findIndex((r) => r.id === params.id);
    if (index === -1) {
      throw new Error('Record not found');
    }
    data[index] = { ...data[index], ...params.data };
    localStorage.setItem(`strato-data-${resource}`, JSON.stringify(data));
    return { data: data[index] };
  },
  updateMany: async (resource: string, params: { ids: (string | number)[]; data: Partial<AnyRecord> }) => {
    const data: AnyRecord[] = JSON.parse(
      localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []),
    );
    params.ids.forEach((id) => {
      const index = data.findIndex((r) => r.id === id);
      if (index !== -1) {
        data[index] = { ...data[index], ...params.data };
      }
    });
    localStorage.setItem(`strato-data-${resource}`, JSON.stringify(data));
    return { data: params.ids };
  },
  create: async (resource: string, params: { data: Omit<AnyRecord, 'id'> }) => {
    const data: AnyRecord[] = JSON.parse(
      localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []),
    );
    const newRecord: AnyRecord = { ...params.data, id: Math.random().toString(36).substr(2, 9) };
    data.push(newRecord);
    localStorage.setItem(`strato-data-${resource}`, JSON.stringify(data));
    return { data: newRecord };
  },
  delete: async (resource: string, params: { id: string | number; previousData: AnyRecord }) => {
    const data: AnyRecord[] = JSON.parse(
      localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []),
    );
    const filteredData = data.filter((r) => r.id !== params.id);
    localStorage.setItem(`strato-data-${resource}`, JSON.stringify(filteredData));
    return { data: params.previousData };
  },
  deleteMany: async (resource: string, params: { ids: (string | number)[] }) => {
    const data: AnyRecord[] = JSON.parse(
      localStorage.getItem(`strato-data-${resource}`) || JSON.stringify(initialData[resource] || []),
    );
    const filteredData = data.filter((r) => !params.ids.includes(r.id));
    localStorage.setItem(`strato-data-${resource}`, JSON.stringify(filteredData));
    return { data: params.ids };
  },
};
