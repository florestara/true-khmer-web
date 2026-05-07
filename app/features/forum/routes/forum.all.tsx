import { motion, useReducedMotion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { ForumSearchLoader } from "~/routes/api/forum/forum-search/forum-search-loader";
import ForumSearchHeader from "../components/sections/forum-search-header";
import ForumSearchResultsSection from "../components/sections/forum-search-results-section";
import { useFetcher, useLoaderData, useSearchParams } from "react-router";
import type { Question } from "~/services/forum/forum-types";
import type { GetQuestionPaginationResponse } from "~/services/forum/forum-types";
import ForumSearchAction from "~/routes/api/forum/forum-search/forum-search-action";

export const loader = ForumSearchLoader;
export const action = ForumSearchAction;

export default function ForumAllPage() {
  const { data, categories } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const isLoading = fetcher.state === "loading";
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search")?.trim() || "";
  const [searchValue, setSearchValue] = useState(search);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [questionList, setQuestionList] = useState<Question[] | undefined>(
    data?.questions,
  );
  const [hasMore, setHasMore] = useState<boolean | undefined>(
    data?.pagination?.hasMore,
  );
  const [nextCursor, setNextCursor] = useState<string | null | undefined>(
    data?.pagination?.nextCursor,
  );

  const isLoadingMore = isLoading && (questionList ?? []).length > 0;

  // When filters are applied but data is empty, trigger fetcher to load data
  useEffect(() => {
    const hasFilters =
      search ||
      searchParams.get("categoryId") ||
      searchParams.get("tagId") ||
      searchParams.get("sortBy") !== "mostRelevant" ||
      searchParams.get("isUnanswered") === "true" ||
      searchParams.get("isTrending") === "true";

    if (
      hasFilters &&
      data.questions.length === 0 &&
      fetcher.state === "idle" &&
      !fetcher.data
    ) {
      fetcher.load(window.location.pathname + window.location.search);
    }
  }, [data, fetcher.state, fetcher.data, search, searchParams]);

  const buildSearchQuery = useCallback(
    (cursor?: string) => {
      const params = new URLSearchParams(searchParams);
      if (cursor) {
        params.set("cursor", cursor);
      }
      return `/forum/search?${params.toString()}`;
    },
    [searchParams],
  );

  useEffect(() => {
    if (data?.questions) {
      setQuestionList(data.questions);
      setHasMore(data.pagination.hasMore);
      setNextCursor(data.pagination.nextCursor ?? undefined);
    }
  }, [data]);

  useEffect(() => {
    const fetcherData = fetcher.data?.data as
      | GetQuestionPaginationResponse
      | undefined;
    if (fetcherData) {
      const fetchedQuestions = fetcherData.questions;
      setQuestionList((prev) => {
        const existingIds = new Set((prev || []).map((q) => q.id));
        const newQuestions = fetchedQuestions.filter(
          (q: Question) => !existingIds.has(q.id),
        );
        return [...(prev || []), ...newQuestions];
      });
      const pagination = fetcherData.pagination;
      setHasMore(pagination.hasMore);
      setNextCursor(pagination.nextCursor ?? undefined);
    }
  }, [fetcher.data?.data]);

  const handleLoadMore = useCallback(() => {
    if (!questionList || questionList.length === 0) return;
    if (fetcher.state === "loading") return;
    if (hasMore === false) return;

    if (nextCursor) {
      fetcher.load(buildSearchQuery(nextCursor));
    }
  }, [
    questionList,
    fetcher.state,
    fetcher.load,
    hasMore,
    nextCursor,
    buildSearchQuery,
  ]);

  const handleSearch = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set("search", value);
    } else {
      nextParams.delete("search");
    }

    setSearchParams(nextParams, {
      replace: true,
      preventScrollReset: true,
    });
  };

  const handleSortByChange = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("sortBy", value);
    setSearchParams(nextParams, {
      replace: true,
      preventScrollReset: true,
    });
  };

  const handleCategoryChange = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === "all-categories") {
      nextParams.delete("categoryId");
    } else {
      nextParams.set("categoryId", value);
    }
    setSearchParams(nextParams, {
      replace: true,
      preventScrollReset: true,
    });
  };

  const handleClearAll = () => {
    const nextParams = new URLSearchParams();
    setSearchParams(nextParams, {
      replace: true,
      preventScrollReset: true,
    });
    setSearchValue("");
    inputRef.current?.focus();
  };

  const handleClearSearchValue = () => {
    setSearchValue("");
    inputRef.current?.focus();
  };

  const categoriesPicker = categories.map((c) => ({
    id: c.id,
    name: c.name,
    count: c.questionCount,
  }));

  const searchKey =
    search +
    (searchParams.get("sortBy") || "") +
    (searchParams.get("categoryId") || "");

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
        }}
      >
        <ForumSearchHeader
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
          onSearch={handleSearch}
          ref={inputRef}
        />
      </motion.div>
      <div key={searchKey}>
        <ForumSearchResultsSection
          search={search}
          data={{ ...data, questions: questionList || [] }}
          categories={categoriesPicker}
          onClearSearch={handleClearAll}
          onClearSearchValue={handleClearSearchValue}
          onSortChange={handleSortByChange}
          onCategoryChange={handleCategoryChange}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          sortBy={searchParams.get("sortBy") || "mostRelevant"}
          categoryId={searchParams.get("categoryId") || "all-categories"}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
}
