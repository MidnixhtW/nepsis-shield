import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { PageContainer } from "@/components/app/PageContainer";
import { PremiumSurface } from "@/components/app/PremiumSurface";

const NotFound = () => {

  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <PageContainer width="compact" className="grid place-items-center py-10">
      <PremiumSurface className="w-full max-w-lg text-center sm:p-8">
        <span className="premium-icon-mark mx-auto"><OrthodoxCrossIcon className="h-6 w-6" /></span>
        <p className="premium-eyebrow mt-5">Lost path</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          That route doesn’t exist: <span className="font-mono text-foreground/80">{location.pathname}</span>
        </p>
        <div className="mt-6">
          <Button asChild className="rounded-2xl"><a href="/">Return to Today</a></Button>
        </div>
      </PremiumSurface>
    </PageContainer>
  );

};

export default NotFound;