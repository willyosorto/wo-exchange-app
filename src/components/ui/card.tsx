import { type ComponentProps } from "react";
import { mergeClassNames } from "./utils";

const Card = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="card"
      className={mergeClassNames(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
        className,
      )}
      {...props}
    />
  );
};

const CardHeader = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="card-header"
      className={mergeClassNames(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
};

const CardTitle = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <h4
      data-slot="card-title"
      className={mergeClassNames("leading-none", className)}
      {...props}
    />
  );
};

const CardDescription = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <p
      data-slot="card-description"
      className={mergeClassNames("text-muted-foreground", className)}
      {...props}
    />
  );
};

const CardAction = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="card-action"
      className={mergeClassNames(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
};

const CardContent = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="card-content"
      className={mergeClassNames("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
};

const CardFooter = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="card-footer"
      className={mergeClassNames("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
};

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
