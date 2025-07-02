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
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "../config/firebase";

// Firebase data provider for Refine
export const firebaseDataProvider: DataProvider = {
  // Get list of resources with pagination and filtering
  getList: async <TData extends BaseRecord = BaseRecord>({ resource, pagination, filters, sorters }: GetListParams): Promise<GetListResponse<TData>> => {
    const collectionRef = collection(db, resource);
    let q = query(collectionRef);

    // Apply filters
    if (filters) {
      filters.forEach((filter) => {
        if (filter.operator === "eq") {
          q = query(q, where(filter.field, "==", filter.value));
        }
        // Add more operators as needed
      });
    }

    // Apply sorting
    if (sorters) {
      sorters.forEach((sorter) => {
        q = query(q, orderBy(sorter.field, sorter.order));
      });
    }

    // Apply pagination
    if (pagination) {
      const { current = 1, pageSize = 10 } = pagination;
      const startIndex = (current - 1) * pageSize;

      if (startIndex > 0) {
        // For pagination, we need to implement cursor-based pagination
        // This is a simplified version
        q = query(q, limit(pageSize));
      } else {
        q = query(q, limit(pageSize));
      }
    }

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TData[];

    return {
      data,
      total: data.length, // Note: Firestore doesn't provide total count efficiently
    };
  },

  // Get single resource by ID
  getOne: async <TData extends BaseRecord = BaseRecord>({ resource, id }: GetOneParams): Promise<GetOneResponse<TData>> => {
    const docRef = doc(db, resource, id as string);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Document not found");
    }

    return {
      data: {
        id: docSnap.id,
        ...docSnap.data(),
      } as TData,
    };
  },

  // Create new resource
  create: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, variables }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
    const collectionRef = collection(db, resource);
    const now = new Date();
    const docRef = await addDoc(collectionRef, {
      ...variables,
      createdAt: now,
      updatedAt: now,
    });

    return {
      data: {
        id: docRef.id,
        ...variables,
        createdAt: now,
        updatedAt: now,
      } as unknown as TData,
    };
  },

  // Update existing resource
  update: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, id, variables }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
    const docRef = doc(db, resource, id as string);
    const now = new Date();
    await updateDoc(docRef, {
      ...variables,
      updatedAt: now,
    });

    return {
      data: {
        id,
        ...variables,
        updatedAt: now,
      } as unknown as TData,
    };
  },

  // Delete resource
  deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, id }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
    const docRef = doc(db, resource, id as string);
    await deleteDoc(docRef);

    return {
      data: { id } as TData,
    };
  },

  // Get multiple resources by IDs
  getMany: async <TData extends BaseRecord = BaseRecord>({ resource, ids }: GetManyParams): Promise<GetManyResponse<TData>> => {
    const data = await Promise.all(
      ids.map(async (id) => {
        const docRef = doc(db, resource, id as string);
        const docSnap = await getDoc(docRef);
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      })
    ) as TData[];

    return { data };
  },

  // Create multiple resources
  createMany: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, variables }: CreateManyParams<TVariables>): Promise<CreateManyResponse<TData>> => {
    const data = await Promise.all(
      variables.map(async (variable) => {
        const collectionRef = collection(db, resource);
        const now = new Date();
        const docRef = await addDoc(collectionRef, {
          ...variable,
          createdAt: now,
          updatedAt: now,
        });
        return {
          id: docRef.id,
          ...variable,
          createdAt: now,
          updatedAt: now,
        };
      })
    ) as unknown as TData[];

    return { data };
  },

  // Delete multiple resources
  deleteMany: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, ids }: DeleteManyParams<TVariables>): Promise<DeleteManyResponse<TData>> => {
    await Promise.all(
      ids.map(async (id) => {
        const docRef = doc(db, resource, id as string);
        await deleteDoc(docRef);
      })
    );

    return { data: ids.map((id) => ({ id })) as TData[] };
  },

  // Update multiple resources
  updateMany: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, ids, variables }: UpdateManyParams<TVariables>): Promise<UpdateManyResponse<TData>> => {
    const data = await Promise.all(
      ids.map(async (id) => {
        const docRef = doc(db, resource, id as string);
        const now = new Date();
        await updateDoc(docRef, {
          ...variables,
          updatedAt: now,
        });
        return {
          id,
          ...variables,
          updatedAt: now,
        };
      })
    ) as unknown as TData[];

    return { data };
  },

  // Get API URL (not applicable for Firestore)
  getApiUrl: () => "",
};