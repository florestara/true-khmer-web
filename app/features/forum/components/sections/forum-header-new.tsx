import { Search } from "lucide-react";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import AskQuestionDialog from "../dialog/ask-question-dialog";
import type { loader } from "../../routes/forum.new";

const heroBackgroundImage = "/images/hero-background-image.jpg";
const avatarImage = "/images/forum-avatar.jpg";
const trendingIcon = "/icons/apollo-icon.svg";
const activeIcon = "/icons/conversation-icon.svg";

function SearchInput({
  value,
  onChange,
  onSearch,
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch: (v: string) => void;
}) {
  return (
    <div className="flex py-2 h-12 flex-1 items-center gap-3 rounded-lg md:rounded-xl border border-[#e1e7ef] bg-white px-6">
      <Search className="size-4.5 shrink-0 text-[#8f9294]" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch(value);
          }
        }}
        placeholder="Search discussions"
        className="w-full border-0 bg-transparent text-base text-[#abadaf] placeholder:text-[#abadaf] focus:outline-none"
      />
    </div>
  );
}

export default function ForumHeaderNew() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { categories, userId } = useLoaderData<typeof loader>();
  const isAuthenticated = Boolean(userId);

  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden px-4 py-12 md:px-12 md:py-24">
      <img
        src={heroBackgroundImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-25"
      />

      <div className="relative flex w-full max-w-5xl flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center gap-2 text-center md:gap-3">
          <h1 className="text-4xl leading-12 font-semibold tracking-[-1px] text-[#2c2f31] md:text-6xl md:leading-18 md:tracking-[-1.8px]">
            Knowledge is a
            <span className="block bg-linear-to-r from-[#0050d4] to-[#7b9cff] bg-clip-text text-transparent">
              Collective Impact.
            </span>
          </h1>
          <p className="max-w-2xl px-2 text-sm leading-6 text-[#595c5e] md:text-xl md:leading-7">
            Join 50,000+ innovators and creators in a True Khmer community
            wisdom. Shape the future, one conversation at a time.
          </p>
        </div>

        <div className="flex w-full max-w-2xl flex-col gap-4 md:flex-row md:items-center md:justify-center">
          <SearchInput
            value={search}
            onChange={(v) => setSearch(v)}
            onSearch={(v) =>
              navigate(`/forum/all?search=${encodeURIComponent(v)}`)
            }
          />

          <AskQuestionDialog
            categories={categories}
            isAuthenticated={isAuthenticated}
            trigger={
              <button
                type="button"
                className="inline-flex h-8 md:h-12 items-center justify-center gap-2 rounded-lg md:rounded-xl bg-[#0050d4] px-6 text-base font-semibold text-[#f1f2ff] transition-colors hover:bg-[#0044b4]"
              >
                <span className="text-[18px] leading-none">+</span>
                Ask a Question
              </button>
            }
          />
        </div>

        <div className="pointer-events-none absolute -left-2 top-8 hidden -rotate-6 rounded-xl border border-[#d5e2fa] bg-white/80 p-4 shadow-[0px_32px_64px_0px_rgba(44,47,49,0.06)] backdrop-blur-sm lg:block">
          <div className="flex items-center gap-3">
            <img
              src={avatarImage}
              alt=""
              aria-hidden
              className="size-10 rounded-full object-cover"
            />
            <div>
              <p className="text-xs font-bold text-[#2c2f31]">
                New badge earned!
              </p>
              <p className="text-[10px] text-[#595c5e]">Top Contributor</p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-5 top-0 hidden rotate-12 rounded-[14.5px] border border-[#d5edff] bg-white/70 p-5 shadow-[0px_38px_77px_0px_rgba(44,47,49,0.06)] backdrop-blur-md lg:block">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              <img src={trendingIcon} alt="" aria-hidden className="size-3.5" />
              <p className="text-sm font-bold text-[#2c2f31]">Trending Topic</p>
            </div>
            <div className="h-1.25 w-24 rounded-full bg-[#0050d4]/20">
              <div className="h-full w-2/3 rounded-full bg-[#0050d4]" />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-12 left-2 hidden -rotate-12 rounded-xl border border-[#84ebb4] bg-[#1fc16b]/5 p-4 shadow-[0px_32px_64px_0px_rgba(44,47,49,0.06)] backdrop-blur-sm lg:block">
          <div className="flex items-center gap-2">
            <img src={activeIcon} alt="" aria-hidden className="size-3.75" />
            <p className="text-xs font-semibold text-[#2c2f31]">
              1.2k active now
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
