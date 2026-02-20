import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

interface BlogPost {
  id: string;
  date: string;
  month: string;
  image: string;
  title: string;
  excerpt: string;
  featured?: boolean;
}

interface SanityPost {
  _id: string;
  title: string;
  slug: string;
  mainImage: { asset: { _ref: string } };
  publishedAt?: string;
  _createdAt: string;
  excerpt: string;
  featured?: boolean;
}

const BlogPreview = async () => {
  const query = `*[_type == "post"] | order(publishedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    publishedAt,
    _createdAt,
    excerpt,
    featured
  }`;

  let blogPosts: BlogPost[] = [];
  
  try {
    const posts = await client.fetch<SanityPost[]>(query, {}, { next: { revalidate: 30 } });
    if (posts && posts.length > 0) {
      blogPosts = posts.map((post) => {
        const dateSource = post.publishedAt || post._createdAt;
        const dateObj = new Date(dateSource);
        return {
          id: post.slug, // Use slug as ID for the link
          date: dateObj.getDate().toString(),
          month: dateObj.toLocaleString('default', { month: 'short' }),
          image: post.mainImage ? urlFor(post.mainImage).width(400).height(300).url() : '/images/placeholder.jpg',
          title: post.title,
          excerpt: post.excerpt,
          featured: post.featured ?? false,
        };
      });
    }
  } catch (error) {
    console.error("Sanity fetch failed (likely due to missing project ID):", error);
  }

  if (blogPosts.length === 0) {
    return null;
  }

  const featuredPost = blogPosts.find((post) => post.featured) ?? blogPosts[0];
  const secondaryPosts = blogPosts.filter((post) => post.id !== featuredPost?.id).slice(0, 2);

  return (
    <section id="latest-blog" className="my-5">
      <div className="container py-5 my-5">
        <div className="row mt-5">
          <div className="section-header d-md-flex justify-content-between align-items-center mb-3">
            <div>
              <div className="text-uppercase text-muted fw-semibold mb-2">Editor’s Pick</div>
              <h2 className="display-3 fw-normal mb-0">From the Blog</h2>
            </div>
            <div>
              <Link href="/blog" className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1">
                Read all
                <svg width="24" height="24" viewBox="0 0 24 24" className="mb-1">
                  <use xlinkHref="#arrow-right"></use>
                </svg>
              </Link>
            </div>
          </div>
        </div>
        {featuredPost && (
          <div className="row g-4">
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                <Link href={`/blog/${featuredPost.id}`}>
                  <Image
                    src={featuredPost.image}
                    className="img-fluid"
                    alt={featuredPost.title}
                    width={720}
                    height={520}
                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  />
                </Link>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-3 text-uppercase text-muted fw-semibold mb-2">
                    <span>Featured Story</span>
                    <span>{featuredPost.month} {featuredPost.date}</span>
                  </div>
                  <Link href={`/blog/${featuredPost.id}`}>
                    <h3 className="card-title mb-3">{featuredPost.title}</h3>
                  </Link>
                  <p className="blog-paragraph fs-6 mb-3">{featuredPost.excerpt}</p>
                  <Link href={`/blog/${featuredPost.id}`} className="blog-read">
                    read more
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="row g-4">
                {secondaryPosts.map((post) => (
                  <div key={post.id} className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                      <Link href={`/blog/${post.id}`}>
                        <Image
                          src={post.image}
                          className="img-fluid"
                          alt={post.title}
                          width={520}
                          height={360}
                          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        />
                      </Link>
                      <div className="card-body p-4">
                        <div className="text-uppercase text-muted fw-semibold mb-2">
                          {post.month} {post.date}
                        </div>
                        <Link href={`/blog/${post.id}`}>
                          <h4 className="card-title mb-2">{post.title}</h4>
                        </Link>
                        <p className="blog-paragraph fs-6 mb-0">{post.excerpt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogPreview;
