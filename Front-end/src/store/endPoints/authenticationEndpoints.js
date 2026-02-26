export const authenticationEndpoints = (builder) => ({
  getCsrfToken: builder.query({
    query: () => `user`,
  }),
  signUp: builder.mutation({
    query: (data) => ({
      url: `/auth/register`,
      method: "POST",
      body: data,
    }),
  }),
  login: builder.mutation({
    query: (data) => ({
      url: `/auth/login`,
      method: "POST",
      body: data,
    }),
  }),
});
