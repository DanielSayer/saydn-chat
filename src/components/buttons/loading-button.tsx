import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

type LoadingButtonProps = {
  isLoading: boolean;
  loadingText: string;
} & React.ComponentProps<typeof Button>;

function LoadingButton({
  isLoading,
  loadingText,
  disabled,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button {...props} disabled={isLoading || disabled}>
      {isLoading ? (
        <>
          <Loader2 className="animate-spin me-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

export { LoadingButton };
