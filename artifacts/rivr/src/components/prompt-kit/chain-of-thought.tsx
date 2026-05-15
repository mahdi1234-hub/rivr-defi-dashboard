import * as React from "react"
import { ChevronDown } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

function ChainOfThought({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      {children}
    </div>
  )
}

function ChainOfThoughtStep({
  children,
  className,
  defaultOpen = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "rounded-xl border border-white/20 bg-white/20 backdrop-blur-sm px-3 py-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </Collapsible>
  )
}

function ChainOfThoughtTrigger({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <CollapsibleTrigger
      className={cn(
        "flex w-full items-center justify-between text-[12px] font-normal text-[rgba(30,50,90,0.65)] hover:text-[rgba(30,50,90,0.9)] transition-colors group",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-[rgba(30,50,90,0.4)] group-hover:bg-[rgba(30,50,90,0.7)] transition-colors" />
        {children}
      </span>
      <ChevronDown className="size-3 text-[rgba(30,50,90,0.4)] transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
  )
}

function ChainOfThoughtContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <CollapsibleContent>
      <div
        className={cn(
          "mt-2 flex flex-col gap-1 border-t border-white/20 pt-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContent>
  )
}

function ChainOfThoughtItem({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "text-[11px] text-[rgba(30,50,90,0.55)] flex items-start gap-1.5 leading-relaxed",
        className
      )}
      {...props}
    >
      <span className="mt-1.5 size-1 rounded-full bg-[rgba(30,50,90,0.3)] flex-shrink-0" />
      {children}
    </div>
  )
}

export {
  ChainOfThought,
  ChainOfThoughtStep,
  ChainOfThoughtTrigger,
  ChainOfThoughtContent,
  ChainOfThoughtItem,
}
