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
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'None',
          value: 'none',
        },
      ],
      defaultValue: 'none',
      admin: {
        description: 'Set to admin to grant administrative privileges. Default is "none" for regular users.',
      },
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
