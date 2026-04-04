import type { CollectionConfig, Where } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'publishedAt'],
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => {
      if (!req.user) return false
      return {
        or: [
          { status: { equals: 'published' } },
          { author: { equals: req.user.id } },
        ],
      } as Where
    },
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, req }) => {
        if (operation !== 'create') return data
        if (!req.user) return data

        return {
          ...data,
          author: req.user.id,
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-fill from title, or set manually. Used in URLs.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) =>
            value ?? data?.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        ],
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'deck',
      type: 'textarea',
      admin: {
        description: 'A short preview sentence shown below the title.',
      },
    },
    {
      name: 'body',
      type: 'richText',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published'],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
    {
      name: 'likes',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
  ],
}
