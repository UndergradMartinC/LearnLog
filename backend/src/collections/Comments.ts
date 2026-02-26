import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    defaultColumns: ['body', 'author', 'post'],
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
    {
      name: 'likes',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
  ],
}
