"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import OptionFilterSelect from "@/components/filters/OptionFilterSelect";
import Preloader from "@/components/ui/Preloader";

export default function SheltersSorter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const basePath = pathname || "/shelters";
  const [isPending, startTransition] = useTransition();

  const currentRaw = (searchParams?.get("sort") || "").trim().toLowerCase();
  const current = currentRaw === "newest" || currentRaw === "added" || currentRaw === "updated" ? currentRaw : "";
  const options = [
    { value: "", label: "Default" },
    { value: "newest", label: "Newest available" },
    { value: "added", label: "Newly added" },
    { value: "updated", label: "Recently updated" },
  ];

  return (
    <>
      {isPending && <Preloader overlay />}
      <OptionFilterSelect
        value={current}
        options={options}
        placeholder="Default"
        onChange={(nextSort: string) => {
          const params = new URLSearchParams(searchParams?.toString() || "");
          params.delete("page");
          if (!nextSort) params.delete("sort");
          else params.set("sort", nextSort);
          const q = params.toString();
          startTransition(() => {
            router.push(q ? `${basePath}?${q}` : basePath);
          });
        }}
      />
    </>
  );
}
