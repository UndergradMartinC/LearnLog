import { fetchPayload } from './payload';

type TagDoc = {
  id: number;
  name: string;
  slug: string;
};

type TagsResponse = {
  docs?: TagDoc[];
};

export function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

async function findTagBySlug(slug: string): Promise<TagDoc | null> {
  const query = `/tags?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`;
  const result = await fetchPayload<TagsResponse>(query);
  return result.docs?.[0] ?? null;
}

async function createTag(name: string, slug: string): Promise<TagDoc> {
  return fetchPayload<TagDoc>('/tags', {
    method: 'POST',
    body: JSON.stringify({ name, slug }),
  });
}

export async function resolveTagIds(tagNames: string[]): Promise<number[]> {
  const cleanNames = Array.from(
    new Set(
      tagNames
        .map((name) => name.trim())
        .filter(Boolean),
    ),
  );

  const ids: number[] = [];

  for (const name of cleanNames) {
    const slug = toSlug(name);
    if (!slug) continue;

    let tag = await findTagBySlug(slug);

    if (!tag) {
      try {
        tag = await createTag(name, slug);
      } catch {
        // Handle race where another request creates the same slug first.
        tag = await findTagBySlug(slug);
      }
    }

    if (tag) ids.push(tag.id);
  }

  return ids;
}
