import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AskQuestionFormState = {
  questionId: string | null;
  title: string;
  categoryId: string;
  body: string;
  tags: string[];
};

export type AskQuestionStore = AskQuestionFormState & {
  setQuestionId: (id: string | null) => void;
  setTitle: (value: string) => void;
  setCategoryId: (value: string) => void;
  setBody: (value: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setTags: (tags: string[]) => void;
  reset: () => void;
  hydrate: (state: Partial<AskQuestionFormState>) => void;
};

const initialState: AskQuestionFormState = {
  questionId: null,
  title: "",
  categoryId: "",
  body: "",
  tags: [],
};

export const useAskQuestionStore = create<AskQuestionStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setQuestionId: (id: string | null) => set({ questionId: id }),
      setTitle: (value: string) => set({ title: value }),
      setCategoryId: (value: string) => set({ categoryId: value }),
      setBody: (value: string) => set({ body: value }),
      addTag: (tag: string) => set((state) => ({ tags: [...state.tags, tag] })),
      removeTag: (tag: string) =>
        set((state) => ({ tags: state.tags.filter((t) => t !== tag) })),
      setTags: (tags: string[]) => set({ tags }),

      reset: () => set(initialState),
      hydrate: (state: Partial<AskQuestionFormState>) =>
        set({ ...get(), ...state }),
    }),
    {
      name: "ask-question-form",
      version: 1,
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          try {
            const item = localStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          } catch (error) {
            console.error(
              `Failed to parse persisted state for "${name}"`,
              error,
            );
            return null;
          }
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error(`Failed to persist state for "${name}"`, error);
          }
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          try {
            localStorage.removeItem(name);
          } catch (error) {
            console.error(
              `Failed to remove persisted state for "${name}"`,
              error,
            );
          }
        },
      },
      partialize: (state) =>
        ({
          questionId: state.questionId,
          title: state.title,
          categoryId: state.categoryId,
          body: state.body,
          tags: state.tags,
        }) as any,
    },
  ),
);
