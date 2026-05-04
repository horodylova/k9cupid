import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

interface BlogPost {
  id: string;
  date: string;
  month: string;
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
    "featured": *[_type == "post" && featured == true && coalesce(publishedAt, _createdAt) <= now()] | order(_updatedAt desc)[0] {
      _id,
      title,
      "slug": slug.current,
      mainImage,
      publishedAt,
      _createdAt,
      excerpt,
      featured
    },
    "latest": *[_type == "post" && coalesce(publishedAt, _createdAt) <= now()] | order(coalesce(publishedAt, _createdAt) desc)[0...4] {
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

  let blogPosts: Array<BlogPost & { mainImage: SanityPost["mainImage"] | null }> = [];
  
  try {
    const data = await client.fetch<{ featured: SanityPost | null; latest: SanityPost[] }>(query, {}, { next: { revalidate: 30 } });
    
    const featuredRaw = data.featured || data.latest[0];
    
    const secondaryRaw = data.latest.filter(p => p._id !== featuredRaw?._id).slice(0, 3);
    
    const postsToProcess = featuredRaw ? [featuredRaw, ...secondaryRaw] : secondaryRaw;

    if (postsToProcess.length > 0) {
      blogPosts = postsToProcess.map((post) => {
        const dateSource = post.publishedAt || post._createdAt;
        const dateObj = new Date(dateSource);

        return {
          id: post.slug,
          date: dateObj.getDate().toString(),
          month: dateObj.toLocaleString('default', { month: 'short' }),
          mainImage: post.mainImage || null,
          title: post.title,
          excerpt: post.excerpt,
          featured: post._id === featuredRaw?._id,
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
  const firstSidePost = sidePosts[0];
  const secondSidePost = sidePosts[1];

  const getSanityImageUrl = (mainImage: SanityPost["mainImage"] | null, width: number, height: number) => {
    if (!mainImage) return "/images/placeholder.jpg";
    return urlFor(mainImage).width(width).height(height).fit("crop").auto("format").quality(75).url();
  };

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
                    src={getSanityImageUrl(featuredPost.mainImage, 1600, 933)}
                    className="img-fluid"
                    alt={featuredPost.title}
                    width={720}
                    height={420}
                    sizes="(max-width: 992px) 100vw, 58vw"
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
                      src={getSanityImageUrl(belowFeaturedPost.mainImage, 1600, 800)}
                      className="img-fluid"
                      alt={belowFeaturedPost.title}
                      width={720}
                      height={360}
                      sizes="(max-width: 992px) 100vw, 58vw"
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
                {firstSidePost && (
                  <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                      <Link href={`/blog/${firstSidePost.id}`}>
                        <Image
                          src={getSanityImageUrl(firstSidePost.mainImage, 1200, 830)}
                          className="img-fluid"
                          alt={firstSidePost.title}
                          width={520}
                          height={360}
                          sizes="(max-width: 992px) 100vw, 38vw"
                          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        />
                      </Link>
                      <div className="card-body p-4">
                        <div className="text-uppercase text-muted fw-semibold mb-2">
                          {firstSidePost.month} {firstSidePost.date}
                        </div>
                        <Link href={`/blog/${firstSidePost.id}`}>
                          <h4 className="card-title mb-2">{firstSidePost.title}</h4>
                        </Link>
                        <p className="blog-paragraph fs-6 mb-0">{firstSidePost.excerpt}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="col-12">
                  <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden" style={{ background: "#F9F3EC" }}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <Image
                          src="/logo%20CarCupid.png"
                          alt="CarCupid"
                          width={56}
                          height={56}
                          style={{ objectFit: "contain" }}
                          unoptimized
                        />
                        <div>
                          <div className="text-uppercase text-muted fw-semibold" style={{ fontSize: 12, letterSpacing: 0.6 }}>
                            Car Match Quiz
                          </div>
                          <h4 className="card-title mb-0">CarCupid</h4>
                        </div>
                      </div>
                      <p className="blog-paragraph fs-6 mb-3">
                        Unexpected questions + real automotive data. Get a shortlist of cars that match your lifestyle and instincts.
                      </p>
                      <div className="pt-1 ps-1">
                        <a href="https://carcupid.fit/" target="_blank" rel="noreferrer" className="blog-read">
                          take the car quiz
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {secondSidePost && (
                  <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                      <Link href={`/blog/${secondSidePost.id}`}>
                        <Image
                          src={getSanityImageUrl(secondSidePost.mainImage, 1200, 830)}
                          className="img-fluid"
                          alt={secondSidePost.title}
                          width={520}
                          height={360}
                          sizes="(max-width: 992px) 100vw, 38vw"
                          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        />
                      </Link>
                      <div className="card-body p-4">
                        <div className="text-uppercase text-muted fw-semibold mb-2">
                          {secondSidePost.month} {secondSidePost.date}
                        </div>
                        <Link href={`/blog/${secondSidePost.id}`}>
                          <h4 className="card-title mb-2">{secondSidePost.title}</h4>
                        </Link>
                        <p className="blog-paragraph fs-6 mb-0">{secondSidePost.excerpt}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogPreview;
