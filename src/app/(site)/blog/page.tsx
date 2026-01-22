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
}

interface SanityPost {
  _id: string;
  title: string;
  slug: string;
  mainImage: { asset: { _ref: string } };
  publishedAt: string;
  excerpt: string;
}

export default async function BlogPage() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    publishedAt,
    excerpt
  }`;

  let blogPosts: BlogPost[] = [];
  
  try {
    const posts = await client.fetch<SanityPost[]>(query, {}, { next: { revalidate: 30 } });
    if (posts && posts.length > 0) {
      blogPosts = posts.map((post) => {
        const dateObj = new Date(post.publishedAt || new Date());
        return {
          id: post.slug,
          date: dateObj.getDate().toString(),
          month: dateObj.toLocaleString('default', { month: 'short' }),
          image: post.mainImage ? urlFor(post.mainImage).width(400).height(300).url() : '/images/placeholder.jpg',
          title: post.title,
          excerpt: post.excerpt,
        };
      });
    }
  } catch (error) {
    console.error("Sanity fetch failed:", error);
  }

  // Fallback if empty
  if (blogPosts.length === 0) {
    blogPosts = [
    {
      id: 'finding-your-perfect-canine-companion',
      date: '20',
      month: 'Jan',
      image: '/images/portrait-adorable-little-french-bulldog.jpg',
      title: 'Finding Your Perfect Canine Companion',
      excerpt: 'Choosing the right dog involves understanding your lifestyle, activity level, and living situation. Discover how to find a furry friend that perfectly matches your personality.',
    },
    {
      id: 'essential-tips-for-new-dog-parents',
      date: '21',
      month: 'Jan',
      image: '/images/portrait-brown-white-basenji-dog-wearing-white-earbuds-looking-into-camera-isolated-white.jpg',
      title: 'Essential Tips for New Dog Parents',
      excerpt: 'Welcoming a new dog is an exciting journey. Learn the fundamental care tips, from nutrition to training, that every new pet parent should know for a smooth transition.',
    },
    {
      id: 'creating-a-dog-friendly-home-environment',
      date: '22',
      month: 'Jan',
      image: '/images/adorable-white-bulldog-puppy-portrait.jpg',
      title: 'Creating a Dog-Friendly Home Environment',
      excerpt: 'Make your home safe and comfortable for your four-legged family member. Explore practical ideas for dog-proofing and creating cozy spaces that your pup will love.',
    },
  ];
  }

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

      <section id="blog" className="my-5">
        <div className="container py-5">
          <div className="row">
            {blogPosts.map((post) => (
              <div className="col-md-4 mb-4" key={post.id}>
                <article className="post-item card border-0 shadow-sm h-100">
                  <div className="image-holder zoom-effect">
                    <Link href={`/blog/${post.id}`}>
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={400}
                        height={300}
                        className="card-img-top object-fit-cover"
                        style={{ height: '300px' }}
                      />
                    </Link>
                  </div>
                  <div className="card-body">
                    <div className="meta-date d-flex align-items-center mb-2">
                      <div className="text-primary fw-bold me-2">{post.date}</div>
                      <div className="text-uppercase text-muted">{post.month}</div>
                    </div>
                    <h3 className="card-title fs-4">
                      <Link href={`/blog/${post.id}`} className="text-decoration-none text-dark">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="card-text text-muted">{post.excerpt}</p>
                    <Link href={`/blog/${post.id}`} className="text-decoration-none text-uppercase fw-bold text-primary">
                      Read more
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
