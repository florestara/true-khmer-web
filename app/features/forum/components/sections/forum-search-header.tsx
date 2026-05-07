import { Search } from "lucide-react";
import BackToButton from "~/components/back-to-button";
import { Button } from "~/components/ui/button";
import { forwardRef } from "react";
import { useLoaderData, useSearchParams } from "react-router";
import type { loader } from "../../routes/forum.all";

interface ForumSearchHeaderProps {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onSearch: (value: string) => void;
}

const ForumSearchHeader = forwardRef<HTMLInputElement, ForumSearchHeaderProps>(
  function ForumSearchHeader(
    { onSearchValueChange, onSearch, searchValue },
    ref,
  ) {
    const [searchParams] = useSearchParams();
    const keywords = searchParams.get("search")?.trim() || "";
    const { data } = useLoaderData<typeof loader>();
    const count = data.questions.length;
    const countResult = `Found ${count} discussion${count > 1 ? "s" : ""}`;
    const handleSearch = () => {
      onSearch(searchValue.trim());
    };

    return (
      <section
        className="w-full flex flex-col items-center px-3.5 pt-10 pb-10"
        style={{
          backgroundImage:
            "linear-gradient(171.139deg, rgb(232, 236, 249) 0%, rgb(234, 238, 251) 16.667%, rgb(236, 240, 253) 33.333%, rgb(238, 242, 255) 50%, rgb(240, 244, 255) 57.143%, rgb(243, 246, 255) 64.286%, rgb(245, 248, 255) 71.429%, rgb(248, 249, 255) 78.571%, rgb(250, 251, 255) 85.714%, rgb(253, 253, 255) 92.857%, rgb(255, 255, 255) 100%)",
        }}
      >
        <div className="w-full max-w-300 flex flex-col gap-5.25 px-0.5">
          <div>
            <BackToButton to="/forum" />
          </div>

          <div className="flex flex-col gap-0.5">
            <h1 className="text-[32px] leading-12 font-bold text-[#2c2f31]">
              Search result: <span className="text-[#2f6fe4]">{keywords}</span>
            </h1>
            <p className="text-base text-[#595c5e] leading-6">{countResult}</p>
          </div>

          <div className="w-full max-w-2xl flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-12 flex-1 items-center rounded-xl border border-[#e1e7ef] bg-white p-2">
              <div className="flex w-full min-w-0 items-center gap-3 px-4">
                <Search className="size-4.5 shrink-0 text-[#8f9294]" />
                <input
                  ref={ref}
                  autoFocus
                  type="search"
                  value={searchValue}
                  onChange={(event) =>
                    onSearchValueChange(event.currentTarget.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder="Search discussions"
                  className="w-full border-0 bg-transparent text-base text-[#2c2f31] placeholder:text-[#abadaf] focus:outline-none"
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSearch}
              className="h-12 rounded-lg bg-[#1c5dd4] px-6 text-sm font-medium text-white hover:bg-[#1651bd]"
            >
              Search
            </Button>
          </div>
        </div>
      </section>
    );
  },
);

export default ForumSearchHeader;
