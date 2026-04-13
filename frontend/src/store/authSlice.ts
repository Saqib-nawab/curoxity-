import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type AuthUser = {
  user_id: string;
  email: string;
  full_name: string;
  email_verified: boolean;
  auth_provider: string;
  role: string;
  status: string;
  onboarding_completed: boolean;
  onboarding_step: string;
  daily_message_limit: number;
  daily_message_used: number;
  daily_message_reset_at: string;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
};

type SignupPayload = {
  full_name: string;
  email: string;
  password: string;
};

type SigninPayload = {
  email: string;
  password: string;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  initialized: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  initialized: false,
  loading: false,
  error: null,
};

const readErrorMessage = async (response: Response) => {
  try {
    const data = await response.json();
    if (typeof data?.detail === 'string' && data.detail.trim()) {
      return data.detail;
    }
  } catch {
    // no-op
  }

  return `Request failed (${response.status})`;
};

export const signupUser = createAsyncThunk<
  AuthUser,
  SignupPayload,
  { rejectValue: string }
>('auth/signupUser', async (payload, { rejectWithValue }) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return rejectWithValue(await readErrorMessage(response));
  }

  const data = await response.json();
  return data.user as AuthUser;
});

export const signinUser = createAsyncThunk<
  AuthUser,
  SigninPayload,
  { rejectValue: string }
>('auth/signinUser', async (payload, { rejectWithValue }) => {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return rejectWithValue(await readErrorMessage(response));
  }

  const data = await response.json();
  return data.user as AuthUser;
});

export const fetchCurrentUser = createAsyncThunk<
  AuthUser,
  void,
  { rejectValue: string }
>('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  const response = await fetch('/api/auth/me', {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 401) {
      return rejectWithValue('Not authenticated');
    }
    return rejectWithValue(await readErrorMessage(response));
  }

  const data = await response.json();
  return data as AuthUser;
});

export const signoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/signoutUser',
  async (_, { rejectWithValue }) => {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
    });

    if (!response.ok) {
      return rejectWithValue(await readErrorMessage(response));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload ?? 'Sign up failed.';
      })

      .addCase(signinUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload ?? 'Sign in failed.';
      })

      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = false;
        state.user = null;
        state.error =
          action.payload === 'Not authenticated'
            ? null
            : (action.payload ?? 'Failed to fetch current user.');
      })

      .addCase(signoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signoutUser.fulfilled, (state) => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(signoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Sign out failed.';
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;