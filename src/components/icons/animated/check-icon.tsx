import { motion } from "motion/react";

type AnimatedCheckIconProps = {
  isChecked: boolean;
  className?: string;
};

function AnimatedCheckIcon({ isChecked, className }: AnimatedCheckIconProps) {
  return (
    <motion.svg
      data-slot="checkbox-indicator"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="3.5"
      stroke="currentColor"
      className={className}
      initial="unchecked"
      animate={isChecked ? "checked" : "unchecked"}
    >
      <title>Check mark</title>
      <motion.path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
        variants={{
          checked: {
            pathLength: 1,
            opacity: 1,
            transition: {
              duration: 0.4,
              delay: 0.2,
            },
          },
          unchecked: {
            pathLength: 0,
            opacity: 0,
            transition: {
              duration: 0.4,
            },
          },
        }}
      />
    </motion.svg>
  );
}

export { AnimatedCheckIcon };
