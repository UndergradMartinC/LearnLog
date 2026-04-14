import type { CollectionConfig, PayloadRequest, Where } from 'payload'
import type { Post } from '../payload-types'
import { authenticate } from '../lib/auth'
import { HttpError } from '../lib/errors'

// Payload relationship arrays may contain either raw numeric IDs or fully-populated
// objects depending on query depth; normalise both cases to numbers (Postgres IDs).
function extractIds(arr: unknown[]): number[] {
  return arr.map((u) =>
    typeof u === 'object' && u !== null ? Number((u as Record<string, unknown>).id) : Number(u),
  )
}

async function toggleReaction(
  req: PayloadRequest,
  postId: string,
  field: 'likes' | 'dislikes',
  add: boolean,
): Promise<Response> {
  const { id: userId } = await authenticate(req)
  const numericUserId = Number(userId)
  const opposite = field === 'likes' ? 'dislikes' : 'likes'
  const post = (await req.payload.findByID({ collection: 'posts', id: postId })) as Post

  let newField = extractIds(post[field] ?? [])
  let newOpposite = extractIds(post[opposite] ?? [])

  if (add) {
    if (!newField.includes(numericUserId)) newField.push(numericUserId)
    newOpposite = newOpposite.filter((id) => id !== numericUserId)
  } else {
    newField = newField.filter((id) => id !== numericUserId)
  }

  const updated = (await req.payload.update({
    collection: 'posts',
    id: postId,
    data: { [field]: newField, [opposite]: newOpposite } as Partial<Post>,
  })) as Post

  return Response.json({
    likes: (updated.likes ?? []).length,
    dislikes: (updated.dislikes ?? []).length,
  })
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
  endpoints: [
    {
      path: '/:id/like',
      method: 'post',
      handler: (req) => toggleReaction(req, req.routeParams?.id as string, 'likes', true).catch(
        (err) => err instanceof HttpError
          ? Response.json({ error: err.message }, { status: err.statusCode })
          : Response.json({ error: 'Internal server error' }, { status: 500 }),
      ),
    },
    {
      path: '/:id/like',
      method: 'delete',
      handler: (req) => toggleReaction(req, req.routeParams?.id as string, 'likes', false).catch(
        (err) => err instanceof HttpError
          ? Response.json({ error: err.message }, { status: err.statusCode })
          : Response.json({ error: 'Internal server error' }, { status: 500 }),
      ),
    },
    {
      path: '/:id/dislike',
      method: 'post',
      handler: (req) => toggleReaction(req, req.routeParams?.id as string, 'dislikes', true).catch(
        (err) => err instanceof HttpError
          ? Response.json({ error: err.message }, { status: err.statusCode })
          : Response.json({ error: 'Internal server error' }, { status: 500 }),
      ),
    },
    {
      path: '/:id/dislike',
      method: 'delete',
      handler: (req) => toggleReaction(req, req.routeParams?.id as string, 'dislikes', false).catch(
        (err) => err instanceof HttpError
          ? Response.json({ error: err.message }, { status: err.statusCode })
          : Response.json({ error: 'Internal server error' }, { status: 500 }),
      ),
    },
  ],
}
