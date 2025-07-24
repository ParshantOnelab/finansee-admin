import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Base query with credentials
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    credentials: "include",
});

const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const currentPath = window.location.pathname;

        // Avoid redirect loop if already on login page
        if (currentPath !== "/login") {
            localStorage.clear();
            sessionStorage.clear();

            // Optional: dispatch logout action
            // api.dispatch(userLoggedOut());

            window.location.href = "/login";
        }
    }

    return result;
};
export const api = createApi({
    reducerPath: "customersData",
    baseQuery: customBaseQuery,
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ email, password }: { email: string, password: string }) => ({
                url: '/admin/login',
                method: 'POST',
                body: { email, password },
                credentials: 'include',
            }),
        }),
        authenticate: builder.query({
            query: () => ({
                url: '/admin/auth/check',
                method: 'GET',
                credentials: 'include',
            }),
            // providesTags: ['User'],
        }),
        registerUser: builder.mutation({
            query: ({ name, email, password, role }: { name: string, email: string, password: string, role: string }) => ({
                url: '/admin/register',
                method: 'POST',
                body: { name, email, password, role },
                credentials: 'include',
            }),
        }),
        createRoles: builder.mutation({
            query: (body: { role_name: string; features: string[] }) => ({
                url: '/admin/create-role',
                method: 'POST',
                body,
                credentials: 'include',
            }),
        }),
        getRoles: builder.query({
            query: () => ({
                url: '/admin/get-roles',
                method: 'GET',
                credentials: 'include',
            })
        }),
        getUsers: builder.query({
            query: () => ({
                url: '/admin/get-users',
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Users', id }],
        }),
        changeUserStatus: builder.mutation({
            query: ({ email, status }: { email: string, status: string }) => ({
                url: '/admin/change-user-status',
                method: 'PUT',
                body: { email, status },
                credentials: 'include',
            }),
            invalidatesTags: ["Users"]
        }),
        changeUserPassword: builder.mutation({
            query: ({ email, password }: { email: string, password: string }) => ({
                url: '/admin/change-user-password',
                method: 'PUT',
                body: { email, password },
                credentials: 'include',
            }),
        }),
        getCustomers: builder.query({
            query: ({ product_name, bias }: { product_name: string, bias: string }) => ({
                url: `/segment-by-product-and-bias?product_name=${product_name}&bias=${bias}`,
                method: 'GET',
            }),
        }),
        getCustomerById: builder.query({
            query: (uid: string) => ({
                url: `/recommend?customer_id=${uid}`,
                method: 'GET',
            }),
        }),
        getTopInsights: builder.query({
            query: () => ({
                url: '/top-insights',
                method: 'GET',
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/admin/logout",
                method: "POST"
            })
        }),
    }),
})

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
    useCreateRolesMutation
} = api;