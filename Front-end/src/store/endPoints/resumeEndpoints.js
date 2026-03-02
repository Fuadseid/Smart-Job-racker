export const resumeEndpoints = (builder) => ({
  uploadResume: builder.mutation({
    query: (data) => ({
      url: "/analyze",
      method: "POST",
      body: data,
    }),
  }),
});
