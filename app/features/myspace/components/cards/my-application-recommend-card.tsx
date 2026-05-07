import { Button } from "~/components/ui/button";
import { cn, resolveImageURL } from "~/lib/utils";
import type { Opportunity } from "~/services/volunteer/types/opportunities";
import { ArrowRight } from "lucide-react";
import { Card } from "~/components/ui/card";

interface MyApplicationRecommendCardProps {
  opportunities?: Opportunity[];
  onDiscoverMore?: () => void;
  onOpportunityClick?: (opportunity: Opportunity) => void;
  className?: string;
}

export function MyApplicationRecommendCard({
  opportunities = [],
  onDiscoverMore,
  onOpportunityClick,
  className,
}: MyApplicationRecommendCardProps) {
  if (opportunities.length === 0) {
    return null;
  }

  return (
    <Card
      className={cn(
        "shadow-none flex flex-col gap-6 rounded-2xl  bg-white p-6",
        className,
      )}
    >
      {/* Header */}
      <h2 className="text-[14px] font-bold uppercase tracking-[0.05em] text-[#2C2F31]">
        Recommended for You
      </h2>

      {/* Opportunities List */}
      <div className="flex flex-col gap-4 pb-2">
        {opportunities.map((opportunity) => (
          <OpportunityListItem
            key={opportunity.id}
            opportunity={opportunity}
            onClick={() => onOpportunityClick?.(opportunity)}
          />
        ))}
      </div>

      {/* Discover More Button */}
      <Button
        onClick={onDiscoverMore}
        className="flex items-center justify-center gap-2 rounded-lg border border-[#e9eaeb] bg-transparent px-3 py-3 text-sm font-medium text-[#454A53] hover:bg-gray-50 active:bg-gray-100 transition-colors"
      >
        Discover more
        <ArrowRight className="size-4" />
      </Button>
    </Card>
  );
}

interface OpportunityListItemProps {
  opportunity: Opportunity;
  onClick?: () => void;
}

function OpportunityListItem({
  opportunity,
  onClick,
}: OpportunityListItemProps) {
  const logoUrl = resolveImageURL(
    opportunity.organizer?.avatarUrl || undefined,
    "/images/ngos/ngo-logo-placeholder.png",
  );
  const organizerName = opportunity.organizer?.name || "Unknown";

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 w-full text-left hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
    >
      {/* NGO Logo */}
      <div className="size-10 rounded-lg border border-[#e8e8e8] overflow-hidden shrink-0 bg-gray-100">
        <img
          src={logoUrl}
          alt={`${organizerName} logo`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-[14px] font-semibold leading-[19.25px] text-[#2C2F31] truncate">
          {opportunity.title}
        </p>
        <p className="text-[12px] font-normal leading-4 text-[#595C5E] truncate">
          {organizerName}
        </p>
      </div>
    </button>
  );
}
