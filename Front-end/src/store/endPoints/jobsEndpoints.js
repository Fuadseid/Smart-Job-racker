export const jobEndpoints = (builder) => ({
    createJobs: builder.mutation({
        query: (data) => ({
            url: `create-job`,
            method: "POST",
            body: data
        }),
    }),
    getJobs:builder.query({
        query:()=>'jobs'
    }),
    getJobbyId:builder.query({
        query:(id)=>`jobs/${id}`
    }) ,
updateJob: builder.mutation({
  query: ({ id, ...data }) => ({
    url: `jobs/${id}`,
    method: "PUT",
    body: data
  })
}),
deleteJob: builder.mutation({
  query: (id) => ({
    url: `jobs/${id}`,
    method: "DELETE"
  })
}),
getRecentjob: builder.query({
    query:()=>'/recent-job'
})
})