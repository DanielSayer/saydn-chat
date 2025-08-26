import type { ComponentProps } from "react";
import { LoadingButton } from "./loading-button";
import { AnimatedCheckIcon } from "../icons/animated/check-icon";

type SubmitButtonProps = ComponentProps<typeof LoadingButton> & {
  completeText: string;
  isComplete: boolean;
};

function SubmitButton({
  isComplete,
  completeText,
  isLoading,
  disabled,
  children,
  type = "submit",
  ...props
}: SubmitButtonProps) {
  return (
    <LoadingButton
      isLoading={isLoading}
      type={type}
      disabled={isLoading || disabled || isComplete}
      {...props}
    >
      {isComplete ? (
        <>
          <AnimatedCheckIcon isChecked />
          {completeText}
        </>
      ) : (
        children
      )}
    </LoadingButton>
  );
}

export { SubmitButton };
