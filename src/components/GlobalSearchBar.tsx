'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

type SearchItem = {
  type: "breed" | "post";
  title: string;
  href: string;
};

type SearchResponse = {
  breeds: SearchItem[];
  posts: SearchItem[];
};

type Props = {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  icon?: ReactNode;
};

export default function GlobalSearchBar({
  placeholder = "Search for breeds, articles...",
  className,
  inputClassName,
  icon,
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [breeds, setBreeds] = useState<SearchItem[]>([]);
  const [posts, setPosts] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const flatResults = useMemo(() => [...breeds, ...posts], [breeds, posts]);
  const itemTextStyle = useMemo(
    () =>
      ({
        whiteSpace: "normal",
        lineHeight: 1.25,
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 2,
        overflow: "hidden",
        textOverflow: "ellipsis",
      }) as const,
    []
  );
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const buttonBaseStyle = useMemo(
    () =>
      ({
        transition: "background-color 120ms ease",
      }) as const,
    []
  );
  const buttonHoverStyle = useMemo(
    () =>
      ({
        backgroundColor: "#F9F3EC",
      }) as const,
    []
  );

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    const run = async () => {
      const q = query.trim();
      if (q.length < 2) {
        setBreeds([]);
        setPosts([]);
        setIsOpen(false);
        return;
      }

      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(q)}`);
        if (!res.ok) return;
        const data = (await res.json()) as SearchResponse;
        setBreeds(Array.isArray(data?.breeds) ? data.breeds : []);
        setPosts(Array.isArray(data?.posts) ? data.posts : []);
        setIsOpen(true);
      } catch {
        setIsOpen(false);
      }
    };

    const timeoutId = window.setTimeout(run, 250);
    return () => window.clearTimeout(timeoutId);
  }, [query]);

  const navigateTo = (item: SearchItem) => {
    setIsOpen(false);
    router.push(item.href);
  };

  const submit = () => {
    const q = query.trim();
    if (!q) return;
    setIsOpen(false);
    router.push(`/search/${encodeURIComponent(q)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <div className={className} ref={wrapperRef}>
      <form id="search-form" className="text-center d-flex align-items-center" onSubmit={handleSubmit}>
        <input
          type="text"
          className={inputClassName}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (flatResults.length > 0) setIsOpen(true);
          }}
          autoComplete="off"
        />
        <button type="submit" className="btn p-0 border-0 bg-transparent" aria-label="Search">
          {icon ?? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z"
              />
            </svg>
          )}
        </button>
      </form>

      {isOpen && flatResults.length > 0 && (
        <div
          className="position-absolute start-0 end-0 top-100 mt-1 bg-white border rounded shadow-sm z-3"
          style={{ maxHeight: 240, overflowY: "auto" }}
        >
          {breeds.length > 0 && (
            <div className="px-3 pt-2 pb-1 text-muted" style={{ fontSize: 12, letterSpacing: 0.6 }}>
              Breeds
            </div>
          )}
          <ul className="list-unstyled m-0 text-start">
            {breeds.map((item, idx) => (
              <li
                key={`breed:${item.href}`}
                className={idx === breeds.length - 1 ? "" : "border-bottom"}
                style={{ borderColor: "rgba(0, 0, 0, 0.06)" }}
              >
                <button
                  className="dropdown-item py-2 px-3 w-100 text-start"
                  style={hoveredHref === item.href ? { ...buttonBaseStyle, ...buttonHoverStyle } : buttonBaseStyle}
                  onClick={() => navigateTo(item)}
                  onMouseEnter={() => setHoveredHref(item.href)}
                  onMouseLeave={() => setHoveredHref(null)}
                  type="button"
                >
                  <span style={itemTextStyle}>{item.title}</span>
                </button>
              </li>
            ))}
          </ul>

          {posts.length > 0 && (
            <div
              className="px-3 pt-2 pb-1 text-muted border-top"
              style={{ fontSize: 12, letterSpacing: 0.6, borderColor: "rgba(0, 0, 0, 0.06)" }}
            >
              Articles
            </div>
          )}
          <ul className="list-unstyled m-0 text-start">
            {posts.map((item, idx) => (
              <li
                key={`post:${item.href}`}
                className={idx === posts.length - 1 ? "" : "border-bottom"}
                style={{ borderColor: "rgba(0, 0, 0, 0.06)" }}
              >
                <button
                  className="dropdown-item py-2 px-3 w-100 text-start"
                  style={hoveredHref === item.href ? { ...buttonBaseStyle, ...buttonHoverStyle } : buttonBaseStyle}
                  onClick={() => navigateTo(item)}
                  onMouseEnter={() => setHoveredHref(item.href)}
                  onMouseLeave={() => setHoveredHref(null)}
                  type="button"
                >
                  <span style={itemTextStyle}>{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
