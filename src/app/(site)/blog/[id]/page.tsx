import ReadAlso from '@/components/ReadAlso';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from "next";
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { ReactNode } from 'react';
import { PortableTextBlock } from 'sanity';

export const revalidate = 0;

interface SanityImageValue {
  asset?: {
    _ref: string;
    _type: string;
  };
  alt?: string;
  position?: 'right' | 'center' | 'left';
}

interface TextWithIllustration {
  heading?: string;
  text?: PortableTextBlock[];
  image?: SanityImageValue;
  imagePosition?: 'left' | 'right';
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const siteUrl = (process.env.SITE_URL || "https://k9cupid.fit").replace(/\/+$/, "");
  const canonicalUrl = `${siteUrl}/blog/${params.id}`;

  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    excerpt,
    mainImage
  }`;

  let post: { title?: string; excerpt?: string; mainImage?: unknown } | null = null;

  try {
    post = await client.fetch(query, { slug: params.id }, { next: { revalidate: 0 } });
  } catch {
    post = null;
  }

  const fallbackTitle = "k9cupid - Find Your Perfect Dog Match";
  const fallbackDescription = "Discover the dog breed that fits your lifestyle with k9cupid.";

  const title = post?.title ? `${post.title} | k9cupid` : fallbackTitle;
  const description = (post?.excerpt || "").trim() || fallbackDescription;
  const ogTitle = post?.title || fallbackTitle;

  const imageUrl = post?.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : `${siteUrl}/icon.svg`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      title: ogTitle,
      description,
      url: canonicalUrl,
      siteName: "k9cupid",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [imageUrl],
    },
  };
}

function ShareBar({ canonicalUrl, title }: { canonicalUrl: string; title: string }) {
  const shareTitle = title.trim() || "k9cupid";
  const encodedUrl = encodeURIComponent(canonicalUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  return (
    <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 mb-5">
      <Link href="/" className="d-inline-flex align-items-center text-decoration-none">
        <Image
          src="/images/k9cupid-logo-final.png"
          alt="k9cupid"
          width={72}
          height={72}
          style={{ width: 72, height: 72, objectFit: "contain" }}
        />
      </Link>
      <div
        className="secondary-font text-uppercase text-muted fw-semibold"
        style={{ letterSpacing: "0.08em", lineHeight: "1", display: "flex", alignItems: "center" }}
      >
        Share:
      </div>
      <ul className="d-flex flex-wrap justify-content-center align-items-center list-unstyled gap-3 mb-0" style={{ rowGap: 12 }}>
        <li className="social">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="sharebar-social-link"
          >
            <iconify-icon className="sharebar-social-icon" icon="ri:facebook-fill"></iconify-icon>
          </a>
        </li>
        <li className="social">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
            className="sharebar-social-link"
          >
            <iconify-icon className="sharebar-social-icon" icon="ri:twitter-x-fill"></iconify-icon>
          </a>
        </li>
        <li className="social">
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
            className="sharebar-social-link"
          >
            <iconify-icon className="sharebar-social-icon" icon="ri:linkedin-fill"></iconify-icon>
          </a>
        </li>
        <li className="social">
          <a
            href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Telegram"
            className="sharebar-social-link"
          >
            <iconify-icon className="sharebar-social-icon" icon="ri:telegram-fill"></iconify-icon>
          </a>
        </li>
        <li className="social">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} ${canonicalUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
            className="sharebar-social-link"
          >
            <iconify-icon className="sharebar-social-icon" icon="ri:whatsapp-fill"></iconify-icon>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const siteUrl = (process.env.SITE_URL || "https://k9cupid.fit").replace(/\/+$/, "");
  const canonicalUrl = `${siteUrl}/blog/${params.id}`;
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    mainImage,
    publishedAt,
    _createdAt,
    body,
    "categories": categories[]->title,
    tags,
    "prev": *[_type == "post" && publishedAt < ^.publishedAt] | order(publishedAt desc)[0] { "title": title, "slug": slug.current },
    "next": *[_type == "post" && publishedAt > ^.publishedAt] | order(publishedAt asc)[0] { "title": title, "slug": slug.current }
  }`;

  let post = null;

  try {
    post = await client.fetch(query, { slug: params.id }, { next: { revalidate: 0 } });
  } catch (error) {
    console.error("Sanity fetch failed:", error);
  }

  // Fallback if no post found or Sanity not configured
  if (!post) {
    // Ideally render 404 or a placeholder
    // For now, we return the static placeholder for demonstration if slug matches placeholder
    if (params.id === 'finding-your-perfect-canine-companion' || !post) {
         // Return the static template for demo purposes if nothing found
         // But better to just show "Post not found" or keep the static content as a "demo post"
         // I will keep the static content as fallback for now so the page isn't broken
         return (
            <>
              <section id="banner" className="py-3" style={{ background: '#F9F3EC' }}>
                <div className="container">
                  <div className="hero-content py-5 my-3">
                    <h2 className="display-1 mt-3 mb-0">Single <span className="text-primary">Post</span> </h2>
                    <nav className="breadcrumb">
                      <Link className="breadcrumb-item nav-link" href="/">Home</Link>
                      <Link className="breadcrumb-item nav-link" href="#">Pages</Link>
                      <span className="breadcrumb-item active" aria-current="page">Single Post</span>
                    </nav>
                  </div>
                </div>
              </section>
        
              <section className="py-5">
                <div className="container">
                  <div className="mt-5">
                    <div className="post-meta">
                      <span className="post-category">Pets</span> / <span className="meta-date">Feb 22, 2023</span>
                    </div>
                    <h1 className="page-title">10 Reasons to be helpful towards any animals (Demo)</h1>
                    <p className="text-muted">Set up Sanity to see your real content here.</p>
                  </div>
                </div>
              </section>
        
              <div className="mb-5">
                <div className="container">
                  <div className="row">
                    <main className="post-grid">
                      <div className="row">
                        <article className="post-item">
                          <div className="post-content">
                            <div className="post-thumbnail mb-3">
                              <Image 
                                src="/images/blog-large.jpg" 
                                alt="single-post" 
                                className="img-fluid"
                                width={1200}
                                height={800}
                                style={{ width: '100%', height: 'auto' }}
                              />
                            </div>
                            <ShareBar canonicalUrl={canonicalUrl} title="10 Reasons to be helpful towards any animals" />
                            <div className="post-description py-4">
                              <p className="blog-paragraph">
                                <strong>Lorem ipsum dolor sit amet... (Static Content)</strong>
                              </p>
                            </div>
                          </div>
                        </article>
                      </div>
                    </main>
                  </div>
                </div>
              </div>
            </>
         );
    }
  }

  const components = {
    types: {
      image: ({value}: { value: SanityImageValue }) => {
        if (!value?.asset?._ref) {
          return null;
        }

        const position = value.position || 'center';
        let containerClass = "my-5";
        const imageClass = "img-fluid rounded-3";
        let width = 1200;
        let height = 800;

        if (position === 'left') {
          containerClass = "float-md-start me-md-4 mb-3";
          width = 400;
          height = 300;
        } else if (position === 'right') {
          containerClass = "float-md-end ms-md-4 mb-3";
          width = 400;
          height = 300;
        }

        return (
          <div className={containerClass} style={position !== 'center' ? { maxWidth: '300px', width: '100%' } : {}}>
            <Image
              src={urlFor(value).width(width).url()}
              alt={value.alt || 'Blog Image'}
              width={width}
              height={height}
              className={imageClass}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        );
      },
      textWithIllustration: ({value}: { value: TextWithIllustration }) => {
        if (!value?.image?.asset?._ref) return null;
        
        const isRight = value.imagePosition !== 'left';
        
        return (
          <div className="my-5 clearfix">
             <div className={`rounded-3 ${isRight ? 'float-md-end ms-md-4' : 'float-md-start me-md-4'} mb-3`} style={{ maxWidth: '300px', width: '100%' }}>
                <Image 
                    src={urlFor(value.image).width(400).url()}
                    alt={value.image.alt || 'Illustration'}
                    width={400}
                    height={300}
                    className="img-fluid rounded-3"
                    style={{ width: '100%', height: 'auto' }}
                />
             </div>
             <div>
              {value.heading && <h3 className="h3 mb-3">{value.heading}</h3>}
              {value.text && <PortableText value={value.text} components={components} />}
             </div>
          </div>
        );
      },
    },
    block: {
      normal: ({children}: {children?: ReactNode}) => <p className="blog-paragraph">{children}</p>,
      h1: ({children}: {children?: ReactNode}) => <h1 className="display-3 fw-normal my-3">{children}</h1>,
      h2: ({children}: {children?: ReactNode}) => <h2 className="display-4 fw-normal my-3">{children}</h2>,
      h3: ({children}: {children?: ReactNode}) => <h3 className="display-5 fw-normal my-3">{children}</h3>,
      h4: ({children}: {children?: ReactNode}) => <h4 className="display-6 fw-normal my-3">{children}</h4>,
      blockquote: ({children}: {children?: ReactNode}) => <blockquote className="blockquote my-4 ps-4 border-start border-4 border-primary">{children}</blockquote>,
    },
    list: {
      bullet: ({children}: {children?: ReactNode}) => <ul className="blog-paragraph list-unstyled ps-4" style={{listStyleType: 'disc'}}>{children}</ul>,
      number: ({children}: {children?: ReactNode}) => <ol className="blog-paragraph ps-4">{children}</ol>,
    }
  };

  const dateObj = new Date(post.publishedAt || post._createdAt);
  const dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const shareTitle = post.title || "k9cupid";

  return (
    <>
      <section id="banner" className="py-3" style={{ background: '#F9F3EC' }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">
              {post.categories?.[0] ? (
                <>
                  <span className="text-dark">{post.categories[0].split(' ')[0]}</span>
                  {post.categories[0].split(' ').length > 1 && (
                     <span className="text-primary"> {post.categories[0].split(' ').slice(1).join(' ')}</span>
                  )}
                </>
              ) : (
                <>
                  Single <span className="text-primary">Post</span>
                </>
              )}
            </h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">Home</Link>
              <Link className="breadcrumb-item nav-link" href="/blog">Blog</Link>
              <span className="breadcrumb-item active" aria-current="page">{post.title}</span>
            </nav>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="mt-5">
            <div className="post-meta">
              <span className="post-category">{post.categories?.[0] || 'Blog'}</span> / <span className="meta-date">{dateStr}</span>
            </div>
            <h1 className="page-title">{post.title}</h1>
          </div>
        </div>
      </section>

      <div className="mb-5">
        <div className="container">
          <div className="row justify-content-center">
            <main className="post-grid col-lg-9">
              <div className="row">
                <article className="post-item">
                  <div className="post-content">
                    {post.mainImage && (
                      <div className="post-thumbnail mb-3">
                        <Image 
                          src={urlFor(post.mainImage).width(1200).height(800).url()} 
                          alt={post.title} 
                          className="img-fluid"
                          width={1200}
                          height={800}
                          style={{ width: '100%', height: 'auto' }}
                        />
                      </div>
                    )}
                    <ShareBar canonicalUrl={canonicalUrl} title={shareTitle} />
                    <div className="post-description py-4 clearfix">
                      <PortableText value={post.body} components={components} />
                    </div>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mb-5">
                        {post.tags.map((tag: string, index: number) => (
                          <span key={index} className="btn btn-dark btn-sm text-uppercase" style={{ fontSize: '0.9rem', padding: '0.5rem 1.5rem', letterSpacing: '0.1em' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <ReadAlso currentDate={post.publishedAt || post._createdAt} />
                    
                    {(post.prev || post.next) && (
                      <div className="post-navigation py-4 mt-5">
                        <div className="row align-items-center">
                          <div className="col-md-6 mb-3 mb-md-0 text-start">
                            {post.prev && (
                              <Link href={`/blog/${post.prev.slug}`} className="text-decoration-none">
                                <div className="text-muted text-uppercase small mb-1">Previous</div>
                                <h5 className="h5 m-0 text-dark">{post.prev.title}</h5>
                              </Link>
                            )}
                          </div>
                          <div className="col-md-6 text-start text-md-end">
                            {post.next && (
                              <Link href={`/blog/${post.next.slug}`} className="text-decoration-none">
                                <div className="text-muted text-uppercase small mb-1">Next</div>
                                <h5 className="h5 m-0 text-dark">{post.next.title}</h5>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
