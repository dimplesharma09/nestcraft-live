import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cartSlice';
import adminProductsReducer from './features/adminProductsSlice';
import adminCategoriesReducer from './features/adminCategoriesSlice';
import adminAttributesReducer from './features/adminAttributesSlice';
import adminVariantsReducer from './features/adminVariantsSlice';
import adminOrdersReducer from './features/adminOrdersSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      adminProducts: adminProductsReducer,
      adminCategories: adminCategoriesReducer,
      adminAttributes: adminAttributesReducer,
      adminVariants: adminVariantsReducer,
      adminOrders: adminOrdersReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
