import { createSlice, combineReducers } from "@reduxjs/toolkit";

interface User {
    user_id: string;
    name: number;
    email: string;
    role: string;
}

interface Role {
    role_name: string;
    features: string[];
}

export const usersReducer = createSlice({
    name: "data",
    initialState: [] as User[],
    reducers: {
        setUsersData: (_state, action) => {
            return action.payload;
        }
    }
})

export const roleReducer = createSlice({
    name: "role",
    initialState: [] as Role[],
    reducers: {
        setRoleData: (_state, action) => {
            return action.payload;
        }
    }
})

export const tokenReducer = createSlice({
    name: "token",
    initialState: "",
    reducers: {
        setToken: (_state, action) => action.payload,
        clearToken: () => ""
    }
})

export const { setUsersData } = usersReducer.actions;
export const { setRoleData } = roleReducer.actions;
export const { setToken, clearToken } = tokenReducer.actions;

const rootReducer = combineReducers({
    users: usersReducer.reducer,
    roles: roleReducer.reducer,
    token: tokenReducer.reducer
});

export default rootReducer;
