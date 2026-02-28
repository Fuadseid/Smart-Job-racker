export const jobEndpoints = (builder) => ({
  createJobs: builder.mutation({
    query: (data) => ({
      url: `create-job`,
      method: "POST",
      body: data,
    }),
  }),
  getJobs: builder.query({
    query: () => "jobs",
  }),
  getJobbyId: builder.query({
    query: (id) => `jobs/${id}`,
  }),
  updateJob: builder.mutation({
    query: ({ id, ...data }) => ({
      url: `jobs/${id}`,
      method: "PUT",
      body: data,
    }),
  }),
  deleteJob: builder.mutation({
    query: (id) => ({
      url: `jobs/${id}`,
      method: "DELETE",
    }),
  }),
  getRecentjob: builder.query({
    query: () => "/recent-job",
  }),
  saveJob: builder.mutation({
    query: (data) => ({
      url: "/save-job",
      method: "POST",
      body: data,
    }),
  }),
  unsaveJob: builder.mutation({
    query: (id) => ({
      url: `/unsave-job/${id}`,
      method: "DELETE",
    }),
  }),
  getAllsaved: builder.query({
    query: () => "/get-all-saved",
  }),
  getIssaved: builder.mutation({
    query:(data)=>({
      url:"/get-is-saved",
      method:"POST",
      body:data
    })
  })
});
