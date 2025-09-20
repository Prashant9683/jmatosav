import * as React from "react";
import { cn } from "@/lib/utils";

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("bg-white animate-shimmer rounded-md", className)}
      {...props}
    />
  );
});
Skeleton.displayName = "Skeleton";

const EventCardSkeleton = () => {
  return (
    <div className="border border-black/10 bg-white shadow-md rounded-lg overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full" />

      {/* Content skeleton */}
      <div className="p-6 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4" />

        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Button skeleton */}
        <div className="flex justify-end mt-4">
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
};

const FormSkeleton = () => {
  return (
    <div className="w-full max-w-md border border-black/10 bg-white shadow-xl rounded-lg">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>

        {/* Form fields */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Submit button */}
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Divider */}
        <div className="relative">
          <Skeleton className="h-px w-full" />
        </div>

        {/* Alternative button */}
        <Skeleton className="h-12 w-full" />

        {/* Footer text */}
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
    </div>
  );
};

const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="border border-black/10 bg-white rounded-lg overflow-hidden">
      {/* Table header */}
      <div className="border-b border-black/10 p-4">
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-18" />
        </div>
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="border-b border-black/10 p-4 last:border-b-0"
        >
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero section skeleton */}
      <div className="bg-blue-600 h-[70vh] min-h-[500px] flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <Skeleton className="h-16 w-96 bg-white/20" />
            <Skeleton className="h-6 w-80 bg-white/20" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32 bg-white/20" />
              <Skeleton className="h-12 w-28 bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Content section skeleton */}
      <div className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-16 text-center space-y-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          {/* Grid of cards */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export {
  Skeleton,
  EventCardSkeleton,
  FormSkeleton,
  TableSkeleton,
  PageSkeleton,
};
