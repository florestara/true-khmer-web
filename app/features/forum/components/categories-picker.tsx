import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { CategoriesPicker as CategoryOption } from "~/services/forum/forum-types";

interface CategoriesPickerProps {
  name: string;
  categories: CategoryOption[];
  defaultValue?: string;
  onChange?: (id: string) => void;
}

export default function CategoriesPicker({
  name,
  categories,
  defaultValue = "",
  onChange,
}: CategoriesPickerProps) {
  const defaultCategory =
    categories.find((c) => c.id === defaultValue) || categories[0] || null;
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption | null>(defaultCategory);

  useEffect(() => {
    const nextCategory =
      categories.find((c) => c.id === defaultValue) || categories[0] || null;
    setSelectedCategory(nextCategory);
  }, [defaultValue, categories]);

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    if (selectedCategory && onChange) {
      onChange(selectedCategory.id);
    }
  }, [selectedCategory, onChange]);

  return (
    <>
      <input type="hidden" name={name} value={selectedCategory?.id || ""} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="flex h-11 w-full items-center justify-between rounded-lg border border-transparent bg-[#f8fafc] px-3 text-left text-sm font-medium text-[#344256] outline-none transition-colors focus:border-[#2f6fe4]"
          >
            <span>{selectedCategory?.name || "Select Category"}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#99a1af]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-(--radix-dropdown-menu-trigger-width) rounded-lg border-[#e2e8f0] bg-white p-1 shadow-lg"
        >
          {categories.map((category) => (
            <DropdownMenuItem
              key={category.id}
              onSelect={() => setSelectedCategory(category)}
              className="rounded-md px-3 py-2 text-sm font-medium text-[#344256] focus:bg-[#f8fafc] focus:text-[#344256]"
            >
              {category.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
