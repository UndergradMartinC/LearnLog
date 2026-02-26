import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-fill from name, or set manually. Used in URLs.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) =>
            value ?? data?.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        ],
      },
    },
  ],
}
