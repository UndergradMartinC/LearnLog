import type { CollectionConfig } from 'payload';

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    defaultColumns: ['body', 'author', 'post'],
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { author: { equals: user.id } }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { author: { equals: user.id } }
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
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'comments',
      admin: {
        description: 'Set if this comment is a reply to another comment.',
      },
    },
  ],
}
