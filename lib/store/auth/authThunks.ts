import { createAsyncThunk } from '@reduxjs/toolkit';
import { setCredentials, setLoading, setError } from './authSlice';



export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: any, { dispatch }) => {
    console.log(credentials);
    try {
      const response: any = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }
      const data = await response.json();
      console.log("is response data", data);
      return {
        status: response.status,
        user: data.user,
        
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    }
  }
);
