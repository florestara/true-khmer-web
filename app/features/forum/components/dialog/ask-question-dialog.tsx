import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Link, useFetcher, useLocation, useRevalidator } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import CategoriesPicker from "../categories-picker";
import type {
  CategoriesPicker as CategoryOption,
  Question,
} from "~/services/forum/forum-types";
import type { ForumPostFormFieldErrors } from "~/services/forum/validation";

// Zod validation schema
const askQuestionSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  body: z
    .string()
    .min(5, "Details must be at least 5 characters")
    .max(10000, "Details must be at most 10000 characters"),
  tags: z.array(z.string()).optional(),
  status: z.literal("PUBLISHED"),
  questionId: z.string().optional(),
});

type AskQuestionFormValues = z.infer<typeof askQuestionSchema>;

interface AskQuestionDialogProps {
  categories: CategoryOption[];
  isEditing?: boolean;
  isAuthenticated?: boolean;
  data?: Question | null;
  trigger?: React.ReactNode;
}

export default function AskQuestionDialog({
  categories,
  isEditing,
  isAuthenticated = false,
  data,
  trigger,
}: AskQuestionDialogProps) {
  const fetcher = useFetcher();
  const location = useLocation();
  const isSubmitting = fetcher.state !== "idle";
  const actionData = fetcher.data as
    | {
        data?: { ok?: boolean; question?: unknown };
        fieldErrors?: ForumPostFormFieldErrors;
        message?: string;
      }
    | undefined;

  const revalidator = useRevalidator();
  const redirectTo = `${location.pathname}${location.search}`;
  const loginHref = `/login?redirectTo=${encodeURIComponent(redirectTo)}`;

  // Tag state (managed separately due to dynamic nature)
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(
    data?.tags?.map((tag) => tag.name).filter(Boolean) ?? [],
  );
  const [open, setOpen] = useState(false);

  // React Hook Form setup - NO useEffect for reset!
  const {
    register,
    control,
    handleSubmit,
    formState: { errors: formErrors },
    setValue,
    reset,
  } = useForm<AskQuestionFormValues>({
    resolver: zodResolver(askQuestionSchema),
    defaultValues: {
      title: data?.title ?? "",
      categoryId: data?.category?.id ?? "",
      body: data?.body ?? "",
      tags: data?.tags?.map((tag) => tag.name).filter(Boolean) ?? [],
      status: "PUBLISHED" as const,
      ...(isEditing && data?.id ? { questionId: data.id } : {}),
    },
  });

  // Watch tags to sync hidden input
  const watchedTags = useWatch({ control, name: "tags", defaultValue: [] });
  const submittedTags = [...(watchedTags || []), tagInput.trim()].filter(
    Boolean,
  );

  // Ref to track submission state for toast handling
  const wasSubmitting = useRef(false);

  // Handle fetcher state changes for toasts, form reset, and dialog close
  useEffect(() => {
    if (fetcher.state === "submitting") {
      wasSubmitting.current = true;
    }

    if (wasSubmitting.current && fetcher.state === "idle" && fetcher.data) {
      wasSubmitting.current = false;
      const result = fetcher.data as any;
      const isSuccess =
        result?.data?.ok === true || result?.data?.question != null;
      const hasFieldErrors =
        result?.fieldErrors && Object.values(result.fieldErrors).some(Boolean);

      if (isSuccess) {
        reset();
        setTags([]);
        setTagInput("");
        setOpen(false);
        revalidator.revalidate();
        toast.success(
          isEditing
            ? "Question updated successfully!"
            : "Question posted successfully!",
        );
      } else if (hasFieldErrors) {
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, message]) => {
            if (message) {
              // @ts-expect-error - dynamic error setting
              formErrors[field] = { type: "server", message };
            }
          });
        }
        toast.error(result?.message ?? "Please check the form and try again.");
      } else {
        toast.error("Failed to post question. Please try again.");
      }
    }
  }, [fetcher.state, fetcher.data, isEditing, revalidator]);

  // Add tag handler
  const addTag = (rawValue: string) => {
    const nextTag = rawValue.trim();
    if (!nextTag) return;

    setTags((currentTags) => {
      if (
        currentTags.some((tag) => tag.toLowerCase() === nextTag.toLowerCase())
      ) {
        return currentTags;
      }
      const newTags = [...currentTags, nextTag];
      setValue("tags", newTags, { shouldValidate: true });
      return newTags;
    });
    setTagInput("");
  };

  // Remove tag handler
  const removeTag = (tagToRemove: string) => {
    setTags((currentTags) => {
      const newTags = currentTags.filter((tag) => tag !== tagToRemove);
      setValue("tags", newTags, { shouldValidate: true });
      return newTags;
    });
  };

  // Tag input keyboard handler
  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag(tagInput);
      return;
    }
    if (event.key === "Backspace" && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  // Form submission handler
  const onSubmit = (formData: AskQuestionFormValues) => {
    const submitData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        submitData.append(key, value.join(", "));
      } else if (value !== undefined && value !== null) {
        submitData.append(key, String(value));
      }
    });

    fetcher.submit(submitData, {
      method: isEditing ? "patch" : "post",
      encType: "application/x-www-form-urlencoded",
    });
  };

  // Auth guard for non-editing mode
  if (!isAuthenticated && !isEditing) {
    if (trigger) {
      return <Link to={loginHref}>{trigger}</Link>;
    }
    return (
      <Link
        to={loginHref}
        className="flex h-10 w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg bg-[#2f6fe4] px-6 py-0 text-sm font-medium whitespace-nowrap text-white hover:bg-[#245fca]"
      >
        <Plus size={24} />
        Ask question
      </Link>
    );
  }

  // Helper to get error message (prioritize server errors, fallback to client validation)
  const getErrorMessage = (
    fieldName: keyof Omit<AskQuestionFormValues, "questionId" | "status">,
  ) => {
    const serverError = actionData?.fieldErrors?.[fieldName];
    const clientError = formErrors[fieldName]?.message;
    return (serverError || clientError) as string | undefined;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen && !isSubmitting) {
          reset();
          setTags(data?.tags?.map((tag) => tag.name).filter(Boolean) ?? []);
          setTagInput("");
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant={"default"}
            className="flex h-10 w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg bg-[#2f6fe4] px-6 py-0 text-sm font-medium whitespace-nowrap text-white hover:bg-[#245fca]"
          >
            <Plus size={24} />
            Ask question
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
        className="max-w-[calc(100%-1rem)] gap-4 overflow-hidden rounded-2xl border border-[#e2e8f0] p-6 shadow-lg sm:max-w-130"
      >
        <DialogClose>
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-3.75 right-3.75 h-4 w-4 rounded-sm p-0 text-[#364153]/70 hover:bg-transparent hover:text-[#364153]"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>

        <div className="flex flex-col gap-1.5">
          <DialogTitle className="text-lg leading-7 font-semibold text-[#0f1729]">
            {isEditing ? "Edit question" : "Ask question"}
          </DialogTitle>
          <DialogDescription className="text-sm leading-5 font-normal text-[#6a7282]">
            Share knowledge with the community
          </DialogDescription>
        </div>

        <div className="-mx-6 border-t border-[#e2e8f0]" />

        {/* Key prop forces re-render with new defaults when editing different question */}
        <form
          key={isEditing ? `edit-${data?.id}` : "create-question"}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          {/* Title Field */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs leading-4.5 font-medium text-[#364153]">
              Question title
            </Label>
            <Input
              {...register("title")}
              placeholder="What are the best resources for learning Khmer business law?"
              aria-invalid={Boolean(getErrorMessage("title"))}
              className="h-11 rounded-lg border-transparent bg-[#f8fafc] text-sm text-[#344256] placeholder:text-[#9eacc0] focus-visible:border-[#2f6fe4] focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:border-red-500"
            />
            {getErrorMessage("title") && (
              <p className="text-xs text-red-600">{getErrorMessage("title")}</p>
            )}
          </div>

          {/* Category Field */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs leading-4.5 font-medium text-[#364153]">
              Category
            </Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <CategoriesPicker
                  name={field.name}
                  categories={categories}
                  defaultValue={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {getErrorMessage("categoryId") && (
              <p className="text-xs text-red-600">
                {getErrorMessage("categoryId")}
              </p>
            )}
          </div>

          {/* Body Field */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs leading-4.5 font-medium text-[#364153]">
              Discussion Details
            </Label>
            <Textarea
              {...register("body")}
              placeholder="What are the best resources for learning Khmer business law?"
              aria-invalid={Boolean(getErrorMessage("body"))}
              className="h-30 overflow-x-auto max-w-full text-wrap rounded-lg border border-transparent bg-[#f8fafc] px-3 py-3 text-sm text-[#344256] placeholder:text-[#9eacc0] outline-none focus:border-[#2f6fe4] aria-invalid:border-red-500"
              rows={1}
            />
            {getErrorMessage("body") && (
              <p className="text-xs text-red-600">{getErrorMessage("body")}</p>
            )}
          </div>

          {/* Tags Field */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs leading-4.5 font-medium text-[#364153]">
              Tags
            </Label>

            {/* Hidden input to submit tags with form */}
            <input
              type="hidden"
              {...register("tags")}
              value={submittedTags.join(", ")}
            />

            <Input
              placeholder="Type a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              aria-invalid={Boolean(getErrorMessage("tags"))}
              className="h-11 rounded-lg border-transparent bg-[#f8fafc] text-sm text-[#344256] placeholder:text-[#9eacc0] focus-visible:border-[#2f6fe4] focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:border-red-500"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="inline-flex rounded-md bg-[#edf2f7] px-2.5 py-1 text-xs font-medium text-[#344256]"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-[#64748b] hover:bg-[#d6deea] hover:text-[#0f1729]"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {getErrorMessage("tags") && (
              <p className="text-xs text-red-600">{getErrorMessage("tags")}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-8 rounded-lg border-[#e1e7ef] px-3 text-sm font-medium text-[#1d283a]"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-8 rounded-lg bg-[#2f6fe4] px-3 text-sm font-medium text-white hover:bg-[#245fca]"
            >
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Posting..."
                : isEditing
                  ? "Update question"
                  : "Post question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
