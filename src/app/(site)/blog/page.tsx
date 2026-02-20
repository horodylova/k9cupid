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

const fallbackBlogPosts: BlogPost[] = [
  {
    id: 'finding-your-perfect-canine-companion',
    date: '20',
    month: 'Jan',
    image: '/images/portrait-adorable-little-french-bulldog.jpg',
    title: 'Finding Your Perfect Canine Companion',
    excerpt: 'Choosing the right dog involves understanding your lifestyle, activity level, and living situation.',
  },
  {
    id: 'essential-tips-for-new-dog-parents',
    date: '21',
    month: 'Jan',
    image: '/images/portrait-brown-white-basenji-dog-wearing-white-earbuds-looking-into-camera-isolated-white.jpg',
    title: 'Essential Tips for New Dog Parents',
    excerpt: 'Welcoming a new dog is an exciting journey. Learn the fundamental care tips, from nutrition to training.',
  },
  {
    id: 'creating-a-dog-friendly-home-environment',
    date: '22',
    month: 'Jan',
    image: '/images/adorable-white-bulldog-puppy-portrait.jpg',
    title: 'Creating a Dog-Friendly Home Environment',
    excerpt: 'Make your home safe and comfortable for your four-legged family member. Explore practical ideas.',
  },
];

export default async function BlogPage() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
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
          id: post.slug,
          date: dateObj.getDate().toString(),
          month: dateObj.toLocaleString('default', { month: 'short' }),
          image: post.mainImage ? urlFor(post.mainImage).width(800).height(600).url() : '/images/placeholder.jpg',
          title: post.title,
          excerpt: post.excerpt,
          featured: post.featured ?? false,
        };
      });
    }
  } catch (error) {
    console.error("Sanity fetch failed:", error);
  }

  if (blogPosts.length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      blogPosts = fallbackBlogPosts;
    }
  }

  const featuredPost = blogPosts.find((post) => post.featured) ?? blogPosts[0];
  const gridPosts = blogPosts.filter((post) => post.id !== featuredPost?.id);

  return (
    <>
      <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">Blog</h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">Home</Link>
              <span className="breadcrumb-item active" aria-current="page">Blog</span>
            </nav>
          </div>
        </div>
      </section>

      <div className="my-5 py-5">
        <div className="container">
          {featuredPost && (
            <div className="row g-4 align-items-stretch mb-5">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div className="text-uppercase text-muted fw-semibold mb-2">Editor’s Pick</div>
                    <h2 className="display-5 fw-normal mb-0">Featured Story</h2>
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                  <Link href={`/blog/${featuredPost.id}`}>
                    <Image
                      src={featuredPost.image}
                      className="img-fluid"
                      alt={featuredPost.title}
                      width={960}
                      height={640}
                      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                  </Link>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-4 p-lg-5 d-flex flex-column">
                    <div className="text-uppercase text-muted fw-semibold mb-3">
                      {featuredPost.month} {featuredPost.date}
                    </div>
                    <Link href={`/blog/${featuredPost.id}`}>
                      <h3 className="card-title mb-3">{featuredPost.title}</h3>
                    </Link>
                    <p className="blog-paragraph fs-6 mb-4">{featuredPost.excerpt}</p>
                    <div className="mt-auto">
                      <Link href={`/blog/${featuredPost.id}`} className="blog-read">
                        read more
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="row entry-container">
            {gridPosts.map((post) => (
              <div className="entry-item col-md-4 my-4" key={post.id}>
                <div className="z-1 position-absolute rounded-3 m-2 px-3 pt-1 bg-light">
                  <h3 className="secondary-font text-primary m-0">{post.date}</h3>
                  <p className="secondary-font fs-6 m-0">{post.month}</p>
                </div>
                <div className="card position-relative">
                  <Link href={`/blog/${post.id}`}>
                    <Image
                      src={post.image}
                      className="img-fluid rounded-4"
                      alt={post.title}
                      width={800}
                      height={600}
                      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                  </Link>
                  <div className="card-body p-0">
                    <Link href={`/blog/${post.id}`}>
                      <h3 className="card-title pt-4 pb-3 m-0">{post.title}</h3>
                    </Link>
                    <div className="card-text">
                      <p className="blog-paragraph fs-6">{post.excerpt}</p>
                      <Link href={`/blog/${post.id}`} className="blog-read">read more</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <nav className="navigation paging-navigation text-center mt-3" role="navigation">
            <div className="pagination loop-pagination d-flex justify-content-center align-items-center">
              <Link href="#" className="pagination-arrow d-flex align-items-center mx-3">
                <iconify-icon icon="ic:baseline-keyboard-arrow-left" className="pagination-arrow fs-1"></iconify-icon>
              </Link>
              <span aria-current="page" className="page-numbers mt-2 fs-3 mx-3 current">1</span>
              <Link className="page-numbers mt-2 fs-3 mx-3" href="#">2</Link>
              <Link className="page-numbers mt-2 fs-3 mx-3" href="#">3</Link>
              <Link href="#" className="pagination-arrow d-flex align-items-center mx-3">
                <iconify-icon icon="ic:baseline-keyboard-arrow-right" className="pagination-arrow fs-1"></iconify-icon>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
