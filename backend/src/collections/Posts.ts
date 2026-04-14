<<<<<<< HEAD
import type { CollectionConfig, Where } from 'payload'
=======
import type { CollectionConfig } from 'payload'
import { authenticate } from '../lib/auth'
import { HttpError } from '../lib/errors'

// Payload relationship arrays may contain either raw numeric IDs or fully-populated
// objects depending on query depth; normalise both cases to numbers (Postgres IDs).
function extractIds(arr: unknown[]): number[] {
  return arr.map((u) =>
    typeof u === 'object' && u !== null ? Number((u as Record<string, unknown>).id) : Number(u),
  )
}

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
    {
      name: 'dislikes',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
  ],
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
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
  endpoints: [
    {
      path: '/:id/like',
      method: 'post',
      handler: async (req) => {
        try {
          const { id: userId } = await authenticate(req)
          const numericUserId = Number(userId)
          const postId = req.routeParams?.id as string
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const post = (await req.payload.findByID({ collection: 'posts', id: postId })) as any

          const likes: number[] = extractIds(post.likes ?? [])
          const dislikes: number[] = extractIds(post.dislikes ?? [])

          const newLikes = likes.includes(numericUserId) ? likes : [...likes, numericUserId]
          const newDislikes = dislikes.filter((id) => id !== numericUserId)

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const updated = (await req.payload.update({
            collection: 'posts',
            id: postId,
            data: { likes: newLikes, dislikes: newDislikes } as any,
          })) as any

          return Response.json({ likes: (updated.likes ?? []).length, dislikes: (updated.dislikes ?? []).length })
        } catch (err) {
          if (err instanceof HttpError) return Response.json({ error: err.message }, { status: err.statusCode })
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
    {
      path: '/:id/like',
      method: 'delete',
      handler: async (req) => {
        try {
          const { id: userId } = await authenticate(req)
          const numericUserId = Number(userId)
          const postId = req.routeParams?.id as string
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const post = (await req.payload.findByID({ collection: 'posts', id: postId })) as any

          const likes: number[] = extractIds(post.likes ?? [])
          const dislikes: number[] = extractIds(post.dislikes ?? [])

          const newLikes = likes.filter((id) => id !== numericUserId)

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const updated = (await req.payload.update({
            collection: 'posts',
            id: postId,
            data: { likes: newLikes, dislikes } as any,
          })) as any

          return Response.json({ likes: (updated.likes ?? []).length, dislikes: (updated.dislikes ?? []).length })
        } catch (err) {
          if (err instanceof HttpError) return Response.json({ error: err.message }, { status: err.statusCode })
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
    {
      path: '/:id/dislike',
      method: 'post',
      handler: async (req) => {
        try {
          const { id: userId } = await authenticate(req)
          const numericUserId = Number(userId)
          const postId = req.routeParams?.id as string
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const post = (await req.payload.findByID({ collection: 'posts', id: postId })) as any

          const likes: number[] = extractIds(post.likes ?? [])
          const dislikes: number[] = extractIds(post.dislikes ?? [])

          const newDislikes = dislikes.includes(numericUserId) ? dislikes : [...dislikes, numericUserId]
          const newLikes = likes.filter((id) => id !== numericUserId)

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const updated = (await req.payload.update({
            collection: 'posts',
            id: postId,
            data: { likes: newLikes, dislikes: newDislikes } as any,
          })) as any

          return Response.json({ likes: (updated.likes ?? []).length, dislikes: (updated.dislikes ?? []).length })
        } catch (err) {
          if (err instanceof HttpError) return Response.json({ error: err.message }, { status: err.statusCode })
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
    {
      path: '/:id/dislike',
      method: 'delete',
      handler: async (req) => {
        try {
          const { id: userId } = await authenticate(req)
          const numericUserId = Number(userId)
          const postId = req.routeParams?.id as string
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const post = (await req.payload.findByID({ collection: 'posts', id: postId })) as any

          const likes: number[] = extractIds(post.likes ?? [])
          const dislikes: number[] = extractIds(post.dislikes ?? [])

          const newDislikes = dislikes.filter((id) => id !== numericUserId)

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const updated = (await req.payload.update({
            collection: 'posts',
            id: postId,
            data: { likes, dislikes: newDislikes } as any,
          })) as any

          return Response.json({ likes: (updated.likes ?? []).length, dislikes: (updated.dislikes ?? []).length })
        } catch (err) {
          if (err instanceof HttpError) return Response.json({ error: err.message }, { status: err.statusCode })
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
  ],
}
