'use client'
import {
  ConvexProvider,
  ConvexReactClient,
} from "convex/react";
const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!,
);
 const ResultsLayout=({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex-1 flex flex-col">
      <ConvexProvider client={convex}>
        {children}
      </ConvexProvider>
    </div>
  );
}
export default ResultsLayout;