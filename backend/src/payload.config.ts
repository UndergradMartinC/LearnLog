import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Comments } from './collections/Comments'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/** Public URL of this Payload/Next app (admin + API). Required on csrf so browser Origin matches and auth cookies are accepted. */
const serverURL =
  process.env.PAYLOAD_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
/** Frontend that talks to the API (e.g. Astro). */
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:4321'

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Tags, Posts, Comments],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      ssl: { rejectUnauthorized: false },
    },
  }),
  sharp,
  cors: [serverURL, frontendURL],
  // Origins allowed to send cookie-based auth; must include serverURL (sanitizer also appends serverURL when non-empty).
  csrf: [serverURL, frontendURL],
  plugins: [],
})
