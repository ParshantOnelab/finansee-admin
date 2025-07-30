import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { RootState } from "./store";

// Base query using Authorization header from Redux store
const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    credentials: "omit",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).token;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// Custom base query to handle 401
const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    const result = await baseQueryWithAuth(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const currentPath = window.location.pathname;
        if (currentPath !== "/login") {
            window.location.href = "/login";
        }
    }

    return result;
};

export const api = createApi({
    reducerPath: "customersData",
    baseQuery: customBaseQuery,
    tagTypes: ["Users"],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ email, password }: { email: string; password: string }) => ({
                url: "/admin/login",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: { email, password },
            }),
        }),
        authenticate: builder.query({
            query: () => ({
                url: "/admin/auth/check",
                method: "GET",
            }),
        }),
        registerUser: builder.mutation({
            query: ({ name, email, password, role }: { name: string; email: string; password: string; role: string }) => ({
                url: "/admin/register",
                method: "POST",
                body: { name, email, password, role },
            }),
        }),
        createRoles: builder.mutation({
            query: (body: { role_name: string; features: string[] }) => ({
                url: "/admin/create-role",
                method: "POST",
                body,
            }),
        }),
        getRoles: builder.query({
            query: () => ({
                url: "/admin/get-roles",
                method: "GET",
            }),
        }),
        getUsers: builder.query({
            query: () => ({
                url: "/admin/get-users",
                method: "GET",
            }),
            providesTags: (_result, _error, _arg) => [{ type: "Users" }],
        }),
        changeUserStatus: builder.mutation({
            query: ({ email, status }: { email: string; status: string }) => ({
                url: "/admin/change-user-status",
                method: "PUT",
                body: { email, status },
            }),
            invalidatesTags: ["Users"],
        }),
        changeUserPassword: builder.mutation({
            query: ({ email, password }: { email: string; password: string }) => ({
                url: "/admin/change-user-password",
                method: "PUT",
                body: { email, password },
            }),
        }),
        getCustomers: builder.query({
            query: ({ product_name, bias }: { product_name: string; bias: string }) => ({
                url: `/segment-by-product-and-bias?product_name=${product_name}&bias=${bias}`,
                method: "GET",
            }),
        }),
        getCustomerById: builder.query({
            query: (uid: string) => ({
                url: `/recommend?customer_id=${uid}`,
                method: "GET",
            }),
        }),
        getTopInsights: builder.query({
            query: () => ({
                url: "/top-insights",
                method: "GET",
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/admin/logout",
                method: "POST",
            }),
        }),
    }),
});

export const {
    useGetCustomersQuery,
    useGetCustomerByIdQuery,
    useGetTopInsightsQuery,
    useLoginMutation,
    useRegisterUserMutation,
    useGetRolesQuery,
    useGetUsersQuery,
    useChangeUserStatusMutation,
    useChangeUserPasswordMutation,
    useAuthenticateQuery,
    useLogoutMutation,
    useCreateRolesMutation,
} = api;
