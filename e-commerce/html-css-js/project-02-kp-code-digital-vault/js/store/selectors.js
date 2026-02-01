export const selectors = {
  user: (state) => state.user,
  isAuthenticated: (state) => Boolean(state.user),
  theme: (state) => state.ui?.theme,
  cartItems: (state) => state.cart,
  cartCount: (state) => state.cart.reduce((sum, item) => sum + item.quantity, 0),
  products: (state) => state.products,
  productsStatus: (state) => state.productsStatus,
  productsError: (state) => state.productsError,
  licenses: (state) => state.licenses,
};
