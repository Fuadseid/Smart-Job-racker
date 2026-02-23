export const contactEndpoints = (builder) => ({
    createConrtact: builder.mutation({
        query: (data) => ({
            url: `contact`,
            method: "POST",
            body: data
        }),
    }), 
})