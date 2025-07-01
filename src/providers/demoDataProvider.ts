import { DataProvider } from "@refinedev/core";

// Demo data provider using localStorage (no Firebase needed)
export const demoDataProvider: DataProvider = {
  // Get list of resources
  getList: async ({ resource, pagination, filters, sorters }) => {
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
      data: paginatedData,
      total: data.length,
    };
  },

  // Get single resource by ID
  getOne: async ({ resource, id }) => {
    const storageKey = `demo-${resource}`;
    const stored = localStorage.getItem(storageKey);
    const data = stored ? JSON.parse(stored) : [];
    
    const item = data.find((item: any) => item.id === id);
    if (!item) {
      throw new Error("Item not found");
    }

    return { data: item };
  },

  // Create new resource
  create: async ({ resource, variables }) => {
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

    return { data: newItem };
  },

  // Update existing resource
  update: async ({ resource, id, variables }) => {
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

    return { data: data[index] };
  },

  // Delete resource
  deleteOne: async ({ resource, id }) => {
    const storageKey = `demo-${resource}`;
    const stored = localStorage.getItem(storageKey);
    const data = stored ? JSON.parse(stored) : [];
    
    const filteredData = data.filter((item: any) => item.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(filteredData));

    return { data: { id } };
  },

  // Get multiple resources by IDs
  getMany: async ({ resource, ids }) => {
    const storageKey = `demo-${resource}`;
    const stored = localStorage.getItem(storageKey);
    const data = stored ? JSON.parse(stored) : [];
    
    const items = data.filter((item: any) => ids.includes(item.id));
    return { data: items };
  },

  // Create multiple resources
  createMany: async ({ resource, variables }) => {
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

    return { data: newItems };
  },

  // Delete multiple resources
  deleteMany: async ({ resource, ids }) => {
    const storageKey = `demo-${resource}`;
    const stored = localStorage.getItem(storageKey);
    const data = stored ? JSON.parse(stored) : [];
    
    const filteredData = data.filter((item: any) => !ids.includes(item.id));
    localStorage.setItem(storageKey, JSON.stringify(filteredData));

    return { data: ids.map((id) => ({ id })) };
  },

  // Update multiple resources
  updateMany: async ({ resource, ids, variables }) => {
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
    return { data: resultItems };
  },

  // Get API URL
  getApiUrl: () => "demo://localhost",
};
