import { create } from 'zustand';


const useProductStore = create((set) => ({
  products: [],
  allProducts: [],
  user: {
    firstname: '',
    email: '',
  },
  cart: [],
  setUser: (user) => set({ user }),
  logoutState: () => {
    set({ user: null });
  },
  setProducts: (products) => set({ products, allProducts: products }),
  searchProduct: (search) => {
    set((state) => {
      if (search === '') {
        return { products: state.allProducts };
      } else {
        const filteredProducts = state.allProducts.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase())
        );
        return { products: filteredProducts };
      }
    });
  },
  addToCart: (product) => set((state) => ({
    cart: [...state.cart, product],
  })),
  getCart: () => set((state) => state.cart),
}));

export { useProductStore };
