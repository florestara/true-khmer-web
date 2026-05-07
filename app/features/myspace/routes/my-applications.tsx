import { useLoaderData } from "react-router";
import MyApplicationHeader from "../components/section/my-application-header";
import MyAppicationMainContent from "../components/section/my-application-main-content";
import MyApplicationRightSidebar from "../components/section/my-application-right-sidebar";
import { volunteerLoader } from "~/routes/api/volunteer/volunteer-loader";
import type { Opportunity } from "~/services/volunteer/types/opportunities";

export const loader = volunteerLoader;

export default function MyApplicationPage() {
  const { opportunities } = useLoaderData<typeof loader>();

  // Get up to 2 recommended opportunities
  const recommendedOpportunities: Opportunity[] = (opportunities ?? []).slice(
    0,
    2,
  );

  return (
    <div className="w-full min-h-screen py-12 bg-gray-100">
      <div className="max-w-300 mx-auto flex flex-col gap-8 px-4 lg:px-6">
        <MyApplicationHeader />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <div className="flex-1">
            <MyAppicationMainContent />
          </div>
          <div className="w-full lg:w-80">
            <MyApplicationRightSidebar
              recommendedOpportunities={recommendedOpportunities}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
