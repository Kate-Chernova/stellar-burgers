import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { RootState } from '../store';

export type UserData = {
  request: boolean;
  error: string | null;
  response: TUser | null;
  registerData: TRegisterData | null;
  user: TUser | null;
  userOrders: TOrder[];
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loginUserRequest: boolean;
};

export const initialState: UserData = {
  request: false,
  error: null,
  response: null,
  registerData: null,
  user: null,
  userOrders: [],
  isAuthChecked: false,
  isAuthenticated: false,
  loginUserRequest: false
};

export const getUser = createAsyncThunk('users/getUser', async () => {
  const data = await getUserApi();
  return data;
});

export const getOrders = createAsyncThunk('users/getOrders', getOrdersApi);
export const updateUser = createAsyncThunk('users/updateUser', updateUserApi);

export const getRegisterUser = createAsyncThunk(
  'users/register',
  async (registerData: TRegisterData) => {
    const data = await registerUserApi(registerData);
    if (!data.success) {
      throw new Error('Ошибка регистрации');
    }
    if (data.accessToken) {
      setCookie('accessToken', data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data;
  }
);

export const getLoginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: TLoginData) => {
    const data = await loginUserApi({ email, password });
    if (!data.success) {
      throw new Error('Неверный email или пароль');
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

export const getLogoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  localStorage.clear();
  deleteCookie('accessToken');
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    userLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;
    },
    resetAuthState: (state) => {
      state.isAuthChecked = true;
      state.loginUserRequest = false;
      state.request = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Регистрация
      .addCase(getRegisterUser.pending, (state) => {
        state.request = true;
        state.error = null;
        state.isAuthChecked = false;
        state.isAuthenticated = false;
      })
      .addCase(getRegisterUser.rejected, (state, action) => {
        state.request = false;
        state.error = action.error.message as string;
        state.isAuthChecked = true; // ВАЖНО: true при ошибке
        state.isAuthenticated = false;
      })
      .addCase(getRegisterUser.fulfilled, (state, action) => {
        state.request = false;
        state.error = null;
        state.response = action.payload.user;
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
      })

      // Логин
      .addCase(getLoginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
        state.isAuthChecked = false;
        state.isAuthenticated = false;
      })
      .addCase(getLoginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.error.message as string;
        state.isAuthChecked = true; // ВАЖНО: true при ошибке
        state.isAuthenticated = false;
      })
      .addCase(getLoginUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.error = null;
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
      })

      // Проверка авторизации
      .addCase(getUser.pending, (state) => {
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })

      // Обновление пользователя
      .addCase(updateUser.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.request = false;
        state.error = action.error.message as string;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.request = false;
        state.error = null;
        state.response = action.payload.user;
        state.user = action.payload.user;
      })

      // Логаут
      .addCase(getLogoutUser.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(getLogoutUser.rejected, (state, action) => {
        state.request = false;
        state.error = action.error.message as string;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
      })
      .addCase(getLogoutUser.fulfilled, (state) => {
        state.request = false;
        state.error = null;
        state.user = null;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.userOrders = [];
      })

      // Загрузка заказов
      .addCase(getOrders.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.request = false;
        state.error = action.error.message as string;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.request = false;
        state.error = null;
        state.userOrders = action.payload;
      });
  }
});

export const { userLogout, resetError, resetAuthState } = userSlice.actions;

export const getUserData = (state: RootState): UserData => state.user;
export const getUserError = (state: RootState) => state.user.error;
export const getIsLoading = (state: RootState) => state.user.request || state.user.loginUserRequest;

export default userSlice.reducer;