import type {
  CategoriesPicker,
  GetQuestionPaginationResponse,
} from "~/services/forum/forum-types";

import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import SearchFiltersSidebar from "./search-filters-sidebar";
import QuestionCard from "../card/question-card";
import EmptySearchResultCard from "../card/empty-search-result-card";
import { useLoaderData } from "react-router";
import type { loader } from "../../routes/forum.all";

interface ForumSearchResultsSectionProps {
  search: string;
  data: GetQuestionPaginationResponse;
  categories: CategoriesPicker[];
  onClearSearch?: () => void;
  onClearSearchValue?: () => void;
  onSortChange?: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  sortBy?: string;
  categoryId?: string;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function ForumSearchResultsSection({
  search,
  data,
  categories,
  onClearSearch,
  onClearSearchValue,
  onSortChange,
  onCategoryChange,
  sortBy,
  categoryId,
  isLoading,
  isLoadingMore,
  onLoadMore,
  hasMore,
}: ForumSearchResultsSectionProps) {
  const { userId } = useLoaderData<typeof loader>();
  const categoriesPicker = categories.map((c) => ({
    id: c.id,
    name: c.name,
    count: c.count,
  }));

  return (
    <section className="bg-[#f8fafc] px-4 pb-14 pt-7 md:px-10 lg:px-0">
      <div className="mx-auto flex w-full max-w-300 flex-col gap-7 lg:flex-row lg:items-start">
        <SearchFiltersSidebar
          search={search}
          categories={categoriesPicker}
          onClearSearch={onClearSearch}
          onClearSearchValue={onClearSearchValue}
          onSortChange={onSortChange}
          onCategoryChange={onCategoryChange}
          sortBy={sortBy}
          categoryId={categoryId}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-7">
          {isLoading && data.questions.length === 0 ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="w-full rounded-2xl border border-[#f1f5f9] bg-white p-4 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </div>
                </div>
                <Skeleton className="h-6 w-3/4 rounded mb-3" />
                <Skeleton className="h-4 w-full rounded mb-2" />
                <Skeleton className="h-4 w-5/6 rounded mb-4" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-5 w-16 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                  <Skeleton className="h-5 w-14 rounded-md" />
                </div>
                <div className="border-t border-[#f9fafb] my-3" />
                <div className="flex gap-4">
                  <Skeleton className="h-8 w-20 rounded-xl" />
                  <Skeleton className="h-8 w-20 rounded-xl" />
                  <Skeleton className="h-8 w-20 rounded-xl" />
                </div>
              </div>
            ))
          ) : data.questions.length === 0 ? (
            <EmptySearchResultCard
              message={search ? "No results found" : "No discussions yet"}
              description={
                search
                  ? "Try using different keywords or change the filters"
                  : "Be the first to start a discussion!"
              }
            />
          ) : (
            data.questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                userId={userId ?? undefined}
                question={question}
                categories={categoriesPicker}
                index={index}
              />
            ))
          )}

          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className="h-10 rounded-xl border-[#dbe3ee] px-6"
              >
                {isLoadingMore ? "Loading..." : "Load more discussions"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
