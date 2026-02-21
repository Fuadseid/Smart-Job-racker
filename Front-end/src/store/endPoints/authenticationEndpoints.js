export const authenticationEndpoints = (builder) => ({
    getCsrfToken: builder.query({
        query: () => `user`,
    }), 
})