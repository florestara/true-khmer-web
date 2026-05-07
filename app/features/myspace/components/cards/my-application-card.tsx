import { Calendar, Clock, MapPin, MoreVertical } from "lucide-react";
import { cn, resolveImageURL } from "~/lib/utils";
import type { Application } from "~/services/volunteer/types/application";
import type { Opportunity } from "~/services/volunteer/types/opportunities";

type ApplicationStatus = "confirmed" | "pending" | "rejected" | "interview";

interface MyApplicationCardProps {
  application: Application;
  opportunity: Opportunity;
  status: ApplicationStatus;
  appliedDate: string;
  shiftDate?: string;
  shiftTime?: string;
  location?: string;
  coverImageUrl?: string;
  onMenuClick?: () => void;
  className?: string;
}

const typeConfig = {
  bgClass: "bg-[#ECFDF5] border border-[#84EBB4]",
  textClass: "text-[#059669]",
};

const statusConfig: Record<
  ApplicationStatus,
  { label: string; bgClass: string; textClass: string; borderClass: string }
> = {
  confirmed: {
    label: "Confirmed",
    bgClass: "bg-[#69F6B8]",
    textClass: "text-[#005A3C]",
    borderClass: "border-transparent",
  },
  pending: {
    label: "Pending",
    bgClass: "bg-[#FEF3C7]",
    textClass: "text-[#92400E]",
    borderClass: "border-transparent",
  },
  rejected: {
    label: "Rejected",
    bgClass: "bg-[#FEE2E2]",
    textClass: "text-[#991B1B]",
    borderClass: "border-transparent",
  },
  interview: {
    label: "Interview",
    bgClass: "bg-[#DBEAFE]",
    textClass: "text-[#1E40AF]",
    borderClass: "border-transparent",
  },
};

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

function formatTime(timeString: string): string {
  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return timeString;
  }
}

export default function MyApplicationCard({
  application,
  opportunity,
  status,
  appliedDate,
  shiftDate,
  shiftTime,
  location,
  coverImageUrl,
  onMenuClick,
  className,
}: MyApplicationCardProps) {
  const statusInfo = statusConfig[status] || statusConfig.pending;
  const imageUrl = resolveImageURL(
    coverImageUrl || opportunity.coverImageKey,
    "/images/ngos/ngo-logo-placeholder.png",
  );

  const typeLabel =
    opportunity.category?.name || application.role?.title || "Volunteer";
  const title =
    opportunity.title || application.role?.title || "Untitled Position";
  const formattedShiftDate = shiftDate ? formatDate(shiftDate) : null;
  const formattedShiftTime = shiftTime || null;

  return (
    <div
      className={cn(
        "flex flex-row gap-4 rounded-2xl bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
        className,
      )}
    >
      <div className="relative h-39.75 w-62.75 shrink-0 overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
        <span
          className={cn(
            "absolute left-4.25 top-[13.5px] inline-flex items-center gap-1.25 rounded-full px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.05em]",
            typeConfig.bgClass,
            typeConfig.textClass,
          )}
        >
          {typeLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="text-[22px] font-bold leading-8.25 text-[#344256]">
              {title}
            </h3>
            <p className="text-[14px] font-medium leading-5.25 text-[#65758B]">
              Applied {formatDate(appliedDate)}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-[0.05em]",
                statusInfo.bgClass,
                statusInfo.textClass,
              )}
            >
              {statusInfo.label}
            </span>
            <button
              type="button"
              onClick={onMenuClick}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="size-4 text-[#747779]" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 pb-2">
          {formattedShiftDate && (
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-[#65758B] shrink-0" />
              <span className="text-[14px] leading-5 text-[#65758B]">
                {formattedShiftDate}
              </span>
            </div>
          )}
          {formattedShiftTime && (
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-[#65758B] shrink-0" />
              <span className="text-[14px] leading-5 text-[#65758B]">
                {formattedShiftTime}
              </span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-[#65758B] shrink-0" />
              <span className="text-[14px] leading-5 text-[#65758B] truncate">
                {location}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
