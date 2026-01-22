import dynamic from 'next/dynamic';
import BlogPreview from "@/components/BlogPreview";

const Banner = dynamic(() => import('@/components/Banner'), { ssr: false });

export default function Home() {
  return (
    <main>
      <Banner />
      <BlogPreview />
    </main>
  );
}
