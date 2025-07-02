import { 
  DataProvider,
  BaseRecord,
  GetListParams,
  GetListResponse,
  GetOneParams,
  GetOneResponse,
  CreateParams,
  CreateResponse,
  UpdateParams,
  UpdateResponse,
  DeleteOneParams,
  DeleteOneResponse,
  GetManyParams,
  GetManyResponse,
  CreateManyParams,
  CreateManyResponse,
  DeleteManyParams,
  DeleteManyResponse,
  UpdateManyParams,
  UpdateManyResponse
} from "@refinedev/core";

// Demo data provider using localStorage (no Firebase needed)
export const demoDataProvider: DataProvider = {
  // Get list of resources
  getList: async <TData extends BaseRecord = BaseRecord>({ resource, pagination, filters, sorters }: GetListParams): Promise<GetListResponse<TData>> => {
    const storageKey = `demo-${resource}`;
    const stored = localStorage.getItem(storageKey);
    let data = stored ? JSON.parse(stored) : [];

    // Apply filters
    if (filters) {
      filters.forEach((filter) => {
        if (filter.operator === "eq") {
          data = data.filter((item: any) => item[filter.field] === filter.value);
        }
      });
    }

    // Apply sorting
    if (sorters) {
      sorters.forEach((sorter) => {
        data.sort((a: any, b: any) => {
          const aVal = a[sorter.field];
          const bVal = b[sorter.field];
          if (sorter.order === "asc") {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      });
    }

    // Apply pagination
    let paginatedData = data;
    if (pagination) {
      const { current = 1, pageSize = 10 } = pagination;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;
      paginatedData = data.slice(start, end);
    }

    return {
      data: paginatedData as TData[],
      total: data.length,
    };
  },

  // Get single resource by ID
  getOne: async <TData extends BaseRecord = BaseRecord>({ resource, id }: GetOneParams): Promise<GetOneResponse<TData>> => {
    const storageKey = `demo-${resource}`;
    const stored = localStorage.getItem(storageKey);
    const data = stored ? JSON.parse(stored) : [];
    
    const item = data.find((item: any) => item.id === id);
    if (!item) {
      throw new Error("Item not found");
    }

    return { data: item as TData };
  },

  // Create new resource
  create: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, variables }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
    const storageKey = `demo-${resource}`;
    const stored = localStorage.getItem(storageKey);
    const data = stored ? JSON.parse(stored) : [];
    
    const newItem = {
      ...variables,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    data.push(newItem);
    localStorage.setItem(storageKey, JSON.stringify(data));

    return { data: newItem as unknown as TData };
  },

  // Update existing resource
  update: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, id, variables }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
    const storageKey = `demo-${resource}`;
    const stored = localStorage.getItem(storageKey);
    const data = stored ? JSON.parse(stored) : [];
    
    const index = data.findIndex((item: any) => item.id === id);
    if (index === -1) {
      throw new Error("Item not found");
    }
    
    data[index] = {
      ...data[index],
      ...variables,
      updatedAt: new Date(),
    };
    
    localStorage.setItem(storageKey, JSON.stringify(data));

    return { data: data[index] as TData };
  },

  // Delete resource
  deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, id }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
    const storageKey = `demo-${resource}`;
    const stored = localStorage.getItem(storageKey);
    const data = stored ? JSON.parse(stored) : [];
    
    const filteredData = data.filter((item: any) => item.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(filteredData));

    return { data: { id } as TData };
  },

  // Get multiple resources by IDs
  getMany: async <TData extends BaseRecord = BaseRecord>({ resource, ids }: GetManyParams): Promise<GetManyResponse<TData>> => {
    const storageKey = `demo-${resource}`;
    const stored = localStorage.getItem(storageKey);
    const data = stored ? JSON.parse(stored) : [];
    
    const items = data.filter((item: any) => ids.includes(item.id));
    return { data: items as TData[] };
  },

  // Create multiple resources
  createMany: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, variables }: CreateManyParams<TVariables>): Promise<CreateManyResponse<TData>> => {
    const storageKey = `demo-${resource}`;
    const stored = localStorage.getItem(storageKey);
    const data = stored ? JSON.parse(stored) : [];
    
    const newItems = variables.map((variable: any) => ({
      ...variable,
      id: Date.now().toString() + Math.random(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    
    data.push(...newItems);
    localStorage.setItem(storageKey, JSON.stringify(data));

    return { data: newItems as unknown as TData[] };
  },

  // Delete multiple resources
  deleteMany: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, ids }: DeleteManyParams<TVariables>): Promise<DeleteManyResponse<TData>> => {
    const storageKey = `demo-${resource}`;
    const stored = localStorage.getItem(storageKey);
    const data = stored ? JSON.parse(stored) : [];
    
    const filteredData = data.filter((item: any) => !ids.includes(item.id));
    localStorage.setItem(storageKey, JSON.stringify(filteredData));

    return { data: ids.map((id) => ({ id })) as TData[] };
  },

  // Update multiple resources
  updateMany: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, ids, variables }: UpdateManyParams<TVariables>): Promise<UpdateManyResponse<TData>> => {
    const storageKey = `demo-${resource}`;
    const stored = localStorage.getItem(storageKey);
    const data = stored ? JSON.parse(stored) : [];
    
    const updatedItems = data.map((item: any) => {
      if (ids.includes(item.id)) {
        return {
          ...item,
          ...variables,
          updatedAt: new Date(),
        };
      }
      return item;
    });
    
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
    
    const resultItems = updatedItems.filter((item: any) => ids.includes(item.id));
    return { data: resultItems as TData[] };
  },

  // Get API URL
  getApiUrl: () => "demo://localhost",
};