import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean; // проверили ли мы сессию при старте
  request: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  request: false,
  error: null
};


export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const res = await registerUserApi(data);
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res.user as TUser;
    } catch (e) {
      return rejectWithValue(
        (e as { message?: string }).message ?? 'Register error'
      );
    }
  }
);


export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data);
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res.user as TUser;
    } catch (e) {
      return rejectWithValue(
        (e as { message?: string }).message ?? 'Login error'
      );
    }
  }
);


export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res.user as TUser;
    } catch (e) {
      return rejectWithValue(
        (e as { message?: string }).message ?? 'Fetch user error'
      );
    }
  }
);


export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const res = await updateUserApi(data);
      return res.user as TUser;
    } catch (e) {
      return rejectWithValue(
        (e as { message?: string }).message ?? 'Update user error'
      );
    }
  }
);

// 5) Logout
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return true;
    } catch (e) {
      return rejectWithValue(
        (e as { message?: string }).message ?? 'Logout error'
      );
    } finally {
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action: { payload: boolean }) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.request = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.request = false;
        state.error = String(action.payload ?? action.error.message);
      })

      // login
      .addCase(loginUser.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.request = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.request = false;
        state.error = String(action.payload ?? action.error.message);
      })

      // fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.request = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.request = false;
        state.user = null;
        state.isAuthChecked = true;
        state.error = String(action.payload ?? action.error.message);
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.request = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.request = false;
        state.error = String(action.payload ?? action.error.message);
      })

      // logout
      .addCase(logoutUser.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.request = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.request = false;
        state.user = null;
        state.isAuthChecked = true;
        state.error = String(action.payload ?? action.error.message);
      });
  }
});

export const { setAuthChecked } = userSlice.actions;
export default userSlice.reducer;