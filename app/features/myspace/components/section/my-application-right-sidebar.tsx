import MyApplicationActivitySummaryCard from "../cards/my-application-activity-summary-card";
import { MyApplicationRecommendCard } from "../cards/my-application-recommend-card";
import type { Opportunity } from "~/services/volunteer/types/opportunities";

interface MyApplicationRightSidebarProps {
  recommendedOpportunities?: Opportunity[];
}

export default function MyApplicationRightSidebar({
  recommendedOpportunities,
}: MyApplicationRightSidebarProps) {
  return (
    <div className="flex flex-col gap-6">
      <MyApplicationActivitySummaryCard />
      <MyApplicationRecommendCard opportunities={recommendedOpportunities} />
    </div>
  );
}
