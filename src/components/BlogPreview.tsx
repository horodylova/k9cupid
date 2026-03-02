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
  const query = `{
    "featured": *[_type == "post" && featured == true] | order(_updatedAt desc)[0] {
      _id,
      title,
      "slug": slug.current,
      mainImage,
      publishedAt,
      _createdAt,
      excerpt,
      featured
    },
    "latest": *[_type == "post"] | order(publishedAt desc)[0...4] {
      _id,
      title,
      "slug": slug.current,
      mainImage,
      publishedAt,
      _createdAt,
      excerpt,
      featured
    }
  }`;

  let blogPosts: BlogPost[] = [];
  
  try {
    const data = await client.fetch<{ featured: SanityPost | null; latest: SanityPost[] }>(query, {}, { next: { revalidate: 30 } });
    
    // Determine the featured post: either the explicitly featured one or the latest one
    const featuredRaw = data.featured || data.latest[0];
    
    // Filter out the featured post from the latest list to avoid duplication
    // We want 3 secondary posts. If featured was in latest, we take the next one.
    // If featured was NOT in latest (old post), we still take 3 from latest.
    const secondaryRaw = data.latest.filter(p => p._id !== featuredRaw?._id).slice(0, 3);
    
    // Combine for processing
    const postsToProcess = featuredRaw ? [featuredRaw, ...secondaryRaw] : secondaryRaw;

    if (postsToProcess.length > 0) {
      blogPosts = postsToProcess.map((post) => {
        const dateSource = post.publishedAt || post._createdAt;
        const dateObj = new Date(dateSource);
        return {
          id: post.slug,
          date: dateObj.getDate().toString(),
          month: dateObj.toLocaleString('default', { month: 'short' }),
          image: post.mainImage ? urlFor(post.mainImage).width(400).height(300).url() : '/images/placeholder.jpg',
          title: post.title,
          excerpt: post.excerpt,
          featured: post._id === featuredRaw?._id, // Mark only the chosen one as featured for UI logic
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
  const secondaryPosts = blogPosts.filter((post) => post.id !== featuredPost?.id);
  const belowFeaturedPost = secondaryPosts[0];
  const sidePosts = secondaryPosts.slice(1, 3);

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
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <Link href={`/blog/${featuredPost.id}`}>
                  <Image
                    src={featuredPost.image}
                    className="img-fluid"
                    alt={featuredPost.title}
                    width={720}
                    height={420}
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
              {belowFeaturedPost && (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <Link href={`/blog/${belowFeaturedPost.id}`}>
                    <Image
                      src={belowFeaturedPost.image}
                      className="img-fluid"
                      alt={belowFeaturedPost.title}
                      width={720}
                      height={360}
                      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                  </Link>
                  <div className="card-body p-4">
                    <div className="text-uppercase text-muted fw-semibold mb-2">
                      {belowFeaturedPost.month} {belowFeaturedPost.date}
                    </div>
                    <Link href={`/blog/${belowFeaturedPost.id}`}>
                      <h4 className="card-title mb-2">{belowFeaturedPost.title}</h4>
                    </Link>
                    <p className="blog-paragraph fs-6 mb-0">{belowFeaturedPost.excerpt}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-5">
              <div className="row g-4">
                {sidePosts.map((post) => (
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
