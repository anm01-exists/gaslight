import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite]",
        className,
      )}
    />
  );
};

// Card Loading Skeleton
export const CardSkeleton = () => (
  <div className="border-0 shadow-student rounded-lg bg-card/80 backdrop-blur p-6 space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>

    <div className="flex flex-wrap gap-2">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-5 w-14" />
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-14" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-10" />
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-border/40">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = () => (
  <tr className="border-b border-border/40">
    <td className="p-4">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </td>
    <td className="p-4">
      <div className="space-y-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-12" />
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-16" />
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-20" />
    </td>
    <td className="p-4">
      <Skeleton className="h-6 w-16 rounded-full" />
    </td>
    <td className="p-4">
      <div className="flex items-center space-x-1">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </td>
  </tr>
);

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
  <div className="border-0 shadow-student rounded-lg bg-card p-6">
    <div className="text-center space-y-4">
      <Skeleton className="h-8 w-8 rounded-lg mx-auto" />
      <Skeleton className="h-8 w-16 mx-auto" />
      <Skeleton className="h-4 w-20 mx-auto" />
      <Skeleton className="h-5 w-24 mx-auto rounded-full" />
    </div>
  </div>
);

// Message Skeleton
export const MessageSkeleton = () => (
  <div className="flex justify-start mb-4">
    <div className="max-w-[70%] p-3 rounded-lg bg-muted space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center justify-end mt-1">
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  </div>
);

// Navigation Skeleton
export const NavigationSkeleton = () => (
  <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
    <div className="container mx-auto px-4">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-6 w-24" />
        </div>

        <div className="hidden md:flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2 px-3 py-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-16 h-8" />
          <Skeleton className="w-20 h-8" />
        </div>
      </div>
    </div>
  </nav>
);

// Page Loading with multiple skeletons
export const PageLoadingSkeleton = ({
  type = "cards",
}: {
  type?: "cards" | "table" | "stats" | "messages";
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case "cards":
        return (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        );
      case "table":
        return (
          <div className="border rounded-lg">
            <table className="w-full">
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))}
              </tbody>
            </table>
          </div>
        );
      case "stats":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
        );
      case "messages":
        return (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <MessageSkeleton key={i} />
            ))}
          </div>
        );
      default:
        return <CardSkeleton />;
    }
  };

  return <div className="animate-pulse">{renderSkeleton()}</div>;
};

export default Skeleton;
