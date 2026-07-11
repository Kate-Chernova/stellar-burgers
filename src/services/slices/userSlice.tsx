import { getUserApi, loginUserApi, logoutApi, registerUserApi, resetPasswordApi, TLoginData, TRegisterData, updateUserApi } from "@api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TUser } from "@utils-types";
import { deleteCookie, getCookie, setCookie } from "../../utils/cookie";

export const fetchGetUser = createAsyncThunk(
  'user/getUser', getUserApi
)

export const fetchUserLogin = createAsyncThunk(
  'user/login', async (data: TLoginData) => {
    const result = await loginUserApi(data);
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    return result;
  }
)

export const fetchUserRegistration = createAsyncThunk(
  'user/registration', async (data: TRegisterData) => {
    const result = await registerUserApi(data);
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    return result;
  }
)

export const fetchUserUpdate = createAsyncThunk(
  'user/update', updateUserApi
)

export const fetchUserLogout = createAsyncThunk(
  'user/logout', logoutApi
)

export const ResetPassword = createAsyncThunk(
  'user/resetPassword', resetPasswordApi
)

export const fetchUserAuth = createAsyncThunk(
  'user/checkAuth', async (_, {dispatch}) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((result) => dispatch(setUser(result.user)))
        .catch(() => {
          localStorage.removeItem('refreshToken');
          deleteCookie('accessToken');
        })
        .finally(() => dispatch(authChecked(true)))
    }
    else {
      dispatch(authChecked(true));
    }
  }
)

interface IUserSlice {
  user: TUser | null;
  AuthCheck: boolean; // isAuthChecked
  isLoading: boolean;
  error?: string | null;
}

const initialState: IUserSlice = {
  user: null,
  AuthCheck: false,
  isLoading: false,
  error: null
}

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    authChecked: (state, action: PayloadAction<boolean>) => {
      state.AuthCheck = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserLogin.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.AuthCheck = true;
      })
      .addCase(fetchUserLogin.rejected, (state, action) => {
        state.error = action.error.message || 'Error login';
        state.AuthCheck = true;
      })

    builder
      .addCase(fetchUserRegistration.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.AuthCheck = true;
      })
      .addCase(fetchUserRegistration.rejected, (state, action) => {
        state.error = action.error.message || 'Error registration';
        state.AuthCheck = true;
      })

    builder
      .addCase(fetchUserUpdate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
    builder
      .addCase(fetchUserLogout.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = null;
      })
    },
    selectors: {
      getUserSelector: (state) => state.user,
      getAuthCheckSelector: (state) => state.AuthCheck,
      getErrorSelector: (state) => state.error
    }
})

export const {setUser, authChecked} = userSlice.actions;

export const {getUserSelector, getAuthCheckSelector, getErrorSelector} = userSlice.selectors;