import { Link } from "react-router";

type OnboardingHeaderProps = {
  title: string;
  rightText?: string;
  rightTo?: string;
  titlePosition?: "center" | "right";
};

export function OnboardingHeader({
  title,
  rightText,
  rightTo,
  titlePosition = "center",
}: OnboardingHeaderProps) {
  const renderRight = () => {
    if (titlePosition === "right") {
      return (
        <span className="font-['Inter'] text-[18px] font-medium leading-6.75 text-[#777777]">
          {title}
        </span>
      );
    }

    if (rightText) {
      if (rightTo) {
        return (
          <Link
            to={rightTo}
            className="font-['Inter'] text-base font-normal leading-6 text-[#9EACC0]"
          >
            {rightText}
          </Link>
        );
      }

      return (
        <span className="font-['Inter'] text-base font-normal leading-6 text-[#9EACC0]">
          {rightText}
        </span>
      );
    }

    return <span className="w-28" aria-hidden="true" />;
  };

  return (
    <header className="w-full border-b border-[#DDE3ED] bg-white">
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 lg:px-0">
        <img
          src="/TruekhmerLogo.svg"
          alt="True Khmer"
          className="h-25 w-auto object-contain sm:h-27 -mb-9 -mt-10"
        />

        {titlePosition === "center" ? (
          <p className="absolute left-1/2 -translate-x-1/2 font-['Inter'] text-[18px] font-medium leading-6.75 text-[#777777]">
            {title}
          </p>
        ) : (
          <span className="w-28" aria-hidden="true" />
        )}

        {renderRight()}
      </div>
    </header>
  );
}
