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

const BlogPreview = async () => {
  const query = `*[_type == "post"] | order(publishedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    publishedAt,
    excerpt
  }`;

  let blogPosts: BlogPost[] = [];
  
  try {
    const posts = await client.fetch<SanityPost[]>(query, {}, { next: { revalidate: 30 } }); // Revalidate every 30 seconds
    console.log('Fetched posts from Sanity:', posts.length);
    if (posts && posts.length > 0) {
      blogPosts = posts.map((post) => {
        const dateObj = new Date(post.publishedAt || new Date());
        return {
          id: post.slug, // Use slug as ID for the link
          date: dateObj.getDate().toString(),
          month: dateObj.toLocaleString('default', { month: 'short' }),
          image: post.mainImage ? urlFor(post.mainImage).width(400).height(300).url() : '/images/placeholder.jpg',
          title: post.title,
          excerpt: post.excerpt,
        };
      });
    }
  } catch (error) {
    console.error("Sanity fetch failed (likely due to missing project ID):", error);
    // Fallback to static data if Sanity is not configured or fails
  }

  // Fallback static data if no posts found
  if (blogPosts.length === 0) {
    blogPosts = [
    {
      id: 'finding-your-perfect-canine-companion', // changed to slug-like
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
    <section id="latest-blog" className="my-5">
      <div className="container py-5 my-5">
        <div className="row mt-5">
          <div className="section-header d-md-flex justify-content-between align-items-center mb-3">
            <h2 className="display-3 fw-normal">Latest Blog Post</h2>
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
        <div className="row">
          {blogPosts.map((post) => (
            <div key={post.id} className="col-md-4 my-4 my-md-0">
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
                    width={400}
                    height={300}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Link>
                <div className="card-body p-0">
                  <Link href={`/blog/${post.id}`}>
                    <h3 className="card-title pt-4 pb-3 m-0">{post.title}</h3>
                  </Link>
                  <div className="card-text">
                    <p className="blog-paragraph fs-6">{post.excerpt}</p>
                    <Link href={`/blog/${post.id}`} className="blog-read">
                      read more
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
