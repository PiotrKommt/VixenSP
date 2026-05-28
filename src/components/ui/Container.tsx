import { cn } from "@/lib/utils";

type ContainerProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/** Width-constrained, responsively padded content wrapper. */
export function Container<T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...props
}: ContainerProps<T>) {
  const Tag = as ?? "div";
  return (
    <Tag className={cn("mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </Tag>
  );
}
