import type { CollectionConfig } from 'payload';

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    defaultColumns: ['body', 'author', 'post'],
  },
  access: {
    create: ({ req }) => Boolean(req.user),
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
      hooks: {
        beforeValidate: [
          ({ value, req, operation }) => {
            if (operation === 'create') return req.user?.id ?? value
            return value
          },
        ],
      },
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
  // Access Control: 
  // - Admins can create, read, update, delete any comment
  // - Users can create comments, read all comments, but can only update/delete their own comments
  access: {
    // Create Access
    create: ({ req: {user} }) => {
      return !!user // Only logged in users can create comments
    },
    // Read Access
    read: ({ req: {user} }) => {
      return !!user // Only logged in users can read comments
    },
    // Update Access:    
    update: ({ req: {user} }) => {
      if (!user) return false; // Only logged in users can update comments
      if (user.role === 'admin') return true; // Admins can update any comment
      return { author: { equals: user.id } }; // Users can only update their own comments
    },
    // Delete Access:
    delete: ({ req: {user} }) => {
      if (!user) return false; // Only logged in users can delete comments
      if (user.role === 'admin') return true; // Admins can delete any comment
      return { author: { equals: user.id } }; // Users can only delete their own comments
    },
  },
}
