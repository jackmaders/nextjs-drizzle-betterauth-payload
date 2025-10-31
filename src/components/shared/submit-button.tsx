import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function SubmitButton({
  children,
  className,
  ...props
}: ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();
  return (
    <Button
      className={cn("flex items-center justify-center", className)}
      type="submit"
      disabled={pending}
      {...props}
    >
      <span className={cn({ invisible: pending })}>{children}</span>
      <LoaderCircle
        className={cn("animate-spin invisible absolute", { visible: pending })}
      />
    </Button>
  );
}