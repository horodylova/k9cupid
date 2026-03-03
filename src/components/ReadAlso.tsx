import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

interface ReadAlsoProps {
  currentDate: string;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  mainImage: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  publishedAt: string;
  _createdAt: string;
}

export default async function ReadAlso({ currentDate }: ReadAlsoProps) {
  // Fetch 3 posts published BEFORE the current one (previous articles)
  const query = `*[_type == "post" && coalesce(publishedAt, _createdAt) < $currentDate] | order(coalesce(publishedAt, _createdAt) desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    publishedAt,
    _createdAt
  }`;

  const posts = await client.fetch<BlogPost[]>(query, { currentDate });

  if (!posts || posts.length === 0) return null;

  return (
    <div className="read-also-section mt-5 pt-4 border-top">
      <h3 className="text-center mb-4">Read Also</h3>
      <div className="row g-4">
        {posts.map((post) => (
          <div key={post._id} className="col-md-4">
            <Link href={`/blog/${post.slug}`} className="text-decoration-none">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="position-relative" style={{ height: '200px' }}>
                  {post.mainImage ? (
                    <Image
                      src={urlFor(post.mainImage).width(600).height(400).url()}
                      alt={post.title}
                      fill
                      className="object-fit-cover"
                    />
                  ) : (
                    <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center text-muted">
                      No Image
                    </div>
                  )}
                </div>
                <div className="card-body">
                  <h5 className="card-title text-dark mb-0">{post.title}</h5>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
