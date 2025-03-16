import { create } from "zustand";

// This file acts as a state so that any component can retrieve data from here at any time while the application is running
export const useProductStore = create((set) => ({ // ({}) means you are returning an object, the set refers to what we are going to set as the state of the function and export means that we can use this function across multiple files
    products: [],
    setProducts: (products) => set({ products }),
    createProduct: async (newProduct) => {
        if(!newProduct.name || !newProduct.price || !newProduct.image) {
            return {success:false, message:"Please fill in all fields"}; // Incase the fields are empty
        }
        const res = await fetch("/api/products", { // Over here we only use api/products since we have changed the proxy config in vite.config.js to localhost:5000
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(newProduct)
        })
        const data = await res.json();
        set((state) => ({products:[...state.products, data.data]}))
        return { success:true, message:"Product created successfully" };
    },
    fetchProducts: async () => {
        const res = await fetch("api/products");
        const data = await res.json();
        set({ products: data.data });
    },
    deleteProduct: async (pid) => {
        const res = await fetch(`api/products/${pid}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if(!data.success) return { success: false, message: data.message }

        // updates the UI immediately
        set(state => ({ products: state.products.filter(product => product._id !== pid) }));
        return { success: true, message: data.message };
    },
    updateProduct: async(pid, updatedProduct) => {
        const res = await fetch(`api/products/${pid}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
        });
        const data = await res.json();
        if(!data.success) return { success:false, message:data.message };
        set(state => ({
            products: state.products.map(product => (product._id === pid ? data.data : product)),
        }))
        return { success:true, message:data.message };
    }
}));
