"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PostItem = {
  title: string;
  slug: string;
};

function clampPage(value: number, totalPages: number) {
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.min(value, totalPages);
}

export default function SearchResultsClient({
  query,
  breedNames,
  posts,
  initialBreedsPage,
  initialPostsPage,
}: {
  query: string;
  breedNames: string[];
  posts: PostItem[];
  initialBreedsPage: number;
  initialPostsPage: number;
}) {
  const ITEMS_PER_PAGE = 12;
  const ROW_HEIGHT_PX = 44;
  const PAGINATION_HEIGHT_PX = 56;

  const totalBreedsPages = Math.max(1, Math.ceil(breedNames.length / ITEMS_PER_PAGE));
  const totalPostsPages = Math.max(1, Math.ceil(posts.length / ITEMS_PER_PAGE));

  const [breedsPage, setBreedsPage] = useState(() => clampPage(initialBreedsPage, totalBreedsPages));
  const [postsPage, setPostsPage] = useState(() => clampPage(initialPostsPage, totalPostsPages));
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  useEffect(() => {
    setBreedsPage((prev) => clampPage(prev, totalBreedsPages));
    setPostsPage((prev) => clampPage(prev, totalPostsPages));
  }, [totalBreedsPages, totalPostsPages]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (breedsPage > 1) url.searchParams.set("b", String(breedsPage));
    else url.searchParams.delete("b");
    if (postsPage > 1) url.searchParams.set("p", String(postsPage));
    else url.searchParams.delete("p");
    window.history.replaceState(null, "", url.toString());
  }, [breedsPage, postsPage]);

  const visibleBreeds = useMemo(() => {
    const start = (breedsPage - 1) * ITEMS_PER_PAGE;
    return breedNames.slice(start, start + ITEMS_PER_PAGE);
  }, [breedNames, breedsPage]);

  const visiblePosts = useMemo(() => {
    const start = (postsPage - 1) * ITEMS_PER_PAGE;
    return posts.slice(start, start + ITEMS_PER_PAGE);
  }, [posts, postsPage]);

  const canPrevBreeds = breedsPage > 1;
  const canNextBreeds = breedsPage < totalBreedsPages;
  const canPrevPosts = postsPage > 1;
  const canNextPosts = postsPage < totalPostsPages;

  const listHeight = ITEMS_PER_PAGE * ROW_HEIGHT_PX;
  const rowBaseStyle = useMemo(
    () =>
      ({
        height: ROW_HEIGHT_PX,
        display: "flex",
        alignItems: "center",
        borderRadius: 10,
        paddingLeft: 12,
        paddingRight: 12,
        transition: "background-color 160ms ease, transform 160ms ease",
      }) as const,
    [ROW_HEIGHT_PX]
  );
  const rowHoverStyle = useMemo(
    () =>
      ({
        backgroundColor: "#F9F3EC",
        transform: "translateX(2px)",
      }) as const,
    []
  );
  const rowTextStyle = useMemo(
    () =>
      ({
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }) as const,
    []
  );
  const rowSeparatorStyle = useMemo(
    () =>
      ({
        boxShadow: "inset 0 -1px rgba(0, 0, 0, 0.06)",
      }) as const,
    []
  );

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-6">
        <div className="bg-white p-4 d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between gap-3 rounded-3 px-3 py-2 mb-3" style={{ backgroundColor: "#F9F3EC" }}>
            <h2 className="h6 mb-0 text-uppercase fw-bold" style={{ letterSpacing: 0.8 }}>
              Breeds
            </h2>
            <div className="d-flex align-items-center gap-3">
              <Link
                href={`/breeds?name=${encodeURIComponent(query)}`}
                className="link-dark link-underline link-underline-opacity-0 link-underline-opacity-100-hover"
                style={{ fontSize: 13 }}
              >
                Open breeds
              </Link>
              <div className="text-muted" style={{ fontSize: 12 }}>
                {breedNames.length}
              </div>
            </div>
          </div>

          <div className="flex-grow-1" style={{ height: listHeight, overflow: "hidden" }}>
            {breedNames.length === 0 ? (
              <div className="text-muted">No breeds found.</div>
            ) : (
              <ul className="list-unstyled m-0 d-flex flex-column" style={{ gap: 0 }}>
                {visibleBreeds.map((name, idx) => (
                  <li key={name}>
                    <Link
                      href={`/breeds/${encodeURIComponent(name)}`}
                      className="d-block link-dark text-decoration-none"
                      onMouseEnter={() => setHoveredKey(`breed:${name}`)}
                      onMouseLeave={() => setHoveredKey((k) => (k === `breed:${name}` ? null : k))}
                    >
                      <div
                        style={
                          hoveredKey === `breed:${name}`
                            ? { ...rowBaseStyle, ...rowHoverStyle }
                            : idx === visibleBreeds.length - 1
                              ? rowBaseStyle
                              : { ...rowBaseStyle, ...rowSeparatorStyle }
                        }
                      >
                        <span className="fw-semibold" style={rowTextStyle}>
                          {name}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="d-flex align-items-center justify-content-between gap-3 mt-3" style={{ minHeight: PAGINATION_HEIGHT_PX }}>
            <button
              type="button"
              className="btn btn-outline-secondary px-3 py-2"
              disabled={!canPrevBreeds}
              onClick={() => setBreedsPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <div className="text-muted fw-semibold" style={{ fontSize: 16 }}>
              Page {breedsPage} of {totalBreedsPages}
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary px-3 py-2"
              disabled={!canNextBreeds}
              onClick={() => setBreedsPage((p) => Math.min(totalBreedsPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-6">
        <div className="bg-white p-4 d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between gap-3 rounded-3 px-3 py-2 mb-3" style={{ backgroundColor: "#F9F3EC" }}>
            <h2 className="h6 mb-0 text-uppercase fw-bold" style={{ letterSpacing: 0.8 }}>
              Articles
            </h2>
            <div className="d-flex align-items-center gap-3">
              <Link
                href="/blog"
                className="link-dark link-underline link-underline-opacity-0 link-underline-opacity-100-hover"
                style={{ fontSize: 13 }}
              >
                Open blog
              </Link>
              <div className="text-muted" style={{ fontSize: 12 }}>
                {posts.length}
              </div>
            </div>
          </div>

          <div className="flex-grow-1" style={{ height: listHeight, overflow: "hidden" }}>
            {posts.length === 0 ? (
              <div className="text-muted">No articles found.</div>
            ) : (
              <ul className="list-unstyled m-0 d-flex flex-column" style={{ gap: 0 }}>
                {visiblePosts.map((post, idx) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${encodeURIComponent(post.slug)}`}
                      className="d-block link-dark text-decoration-none"
                      onMouseEnter={() => setHoveredKey(`post:${post.slug}`)}
                      onMouseLeave={() => setHoveredKey((k) => (k === `post:${post.slug}` ? null : k))}
                    >
                      <div
                        style={
                          hoveredKey === `post:${post.slug}`
                            ? { ...rowBaseStyle, ...rowHoverStyle }
                            : idx === visiblePosts.length - 1
                              ? rowBaseStyle
                              : { ...rowBaseStyle, ...rowSeparatorStyle }
                        }
                      >
                        <span className="fw-semibold" style={rowTextStyle}>
                          {post.title}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="d-flex align-items-center justify-content-between gap-3 mt-3" style={{ minHeight: PAGINATION_HEIGHT_PX }}>
            <button
              type="button"
              className="btn btn-outline-secondary px-3 py-2"
              disabled={!canPrevPosts}
              onClick={() => setPostsPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <div className="text-muted fw-semibold" style={{ fontSize: 16 }}>
              Page {postsPage} of {totalPostsPages}
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary px-3 py-2"
              disabled={!canNextPosts}
              onClick={() => setPostsPage((p) => Math.min(totalPostsPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
