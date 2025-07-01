import { DataProvider } from "@refinedev/core";
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
  limit,
  startAfter,
  DocumentSnapshot
} from "firebase/firestore";
import { db } from "../config/firebase";

// Firebase data provider for Refine
export const firebaseDataProvider: DataProvider = {
  // Get list of resources with pagination and filtering
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
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
    }));

    return {
      data,
      total: data.length, // Note: Firestore doesn't provide total count efficiently
    };
  },

  // Get single resource by ID
  getOne: async ({ resource, id }) => {
    const docRef = doc(db, resource, id as string);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error("Document not found");
    }

    return {
      data: {
        id: docSnap.id,
        ...docSnap.data(),
      },
    };
  },

  // Create new resource
  create: async ({ resource, variables }) => {
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
      },
    };
  },

  // Update existing resource
  update: async ({ resource, id, variables }) => {
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
      },
    };
  },

  // Delete resource
  deleteOne: async ({ resource, id }) => {
    const docRef = doc(db, resource, id as string);
    await deleteDoc(docRef);

    return {
      data: { id },
    };
  },

  // Get multiple resources by IDs
  getMany: async ({ resource, ids }) => {
    const data = await Promise.all(
      ids.map(async (id) => {
        const docRef = doc(db, resource, id as string);
        const docSnap = await getDoc(docRef);
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      })
    );

    return { data };
  },

  // Create multiple resources
  createMany: async ({ resource, variables }) => {
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
    );

    return { data };
  },

  // Delete multiple resources
  deleteMany: async ({ resource, ids }) => {
    await Promise.all(
      ids.map(async (id) => {
        const docRef = doc(db, resource, id as string);
        await deleteDoc(docRef);
      })
    );

    return { data: ids.map((id) => ({ id })) };
  },

  // Update multiple resources
  updateMany: async ({ resource, ids, variables }) => {
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
    );

    return { data };
  },

  // Get API URL (not applicable for Firestore)
  getApiUrl: () => "",
};
