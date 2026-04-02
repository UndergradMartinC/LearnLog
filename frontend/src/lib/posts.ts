import { fetchPayload } from './payload';

export interface CreatePostData {
  title: string;
  deck?: string;
  tags?: number[];
  status: 'draft' | 'published';
  slug?: string;
}

type CreatePostResponse = {
  doc: {
    id: number;
    slug: string;
  };
};

export async function createPost(data: CreatePostData): Promise<CreatePostResponse> {
  try {
    return await fetchPayload<CreatePostResponse>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : '';
    const likelySlugConflict =
      message.includes('slug') &&
      (message.includes('unique') || message.includes('already exists') || message.includes('duplicate'));

    if (!likelySlugConflict) throw error;

    const fallbackSlug = `${data.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')}-${Date.now()}`;

    return fetchPayload<CreatePostResponse>('/posts', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        slug: fallbackSlug,
      }),
    });
  }
}
