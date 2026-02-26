import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
  ],
  endpoints: [
    {
      path: '/health',
      method: 'get',
      handler: async (req) => {
        return Response.json({
          message: `Hello! I am ok!`,
        })
      }
    }
  ]
}
