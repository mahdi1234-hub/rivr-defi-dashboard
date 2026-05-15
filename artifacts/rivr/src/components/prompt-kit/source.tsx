import * as React from "react"
import { ExternalLink } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type SourceContextValue = { href: string }
const SourceContext = React.createContext<SourceContextValue>({ href: "" })

function Source({
  children,
  href,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { href: string }) {
  return (
    <SourceContext.Provider value={{ href }}>
      <Popover>
        <div className={cn("inline-flex", className)} {...props}>
          {children}
        </div>
      </Popover>
    </SourceContext.Provider>
  )
}

function SourceTrigger({
  className,
  showFavicon = false,
  ...props
}: React.HTMLAttributes<HTMLButtonElement> & { showFavicon?: boolean }) {
  const { href } = React.useContext(SourceContext)
  const domain = React.useMemo(() => {
    try {
      return new URL(href).hostname.replace("www.", "")
    } catch {
      return href
    }
  }, [href])

  return (
    <PopoverTrigger asChild>
      <button
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/25 backdrop-blur-sm px-2.5 py-1 text-[11px] text-[rgba(30,50,90,0.7)] hover:bg-white/40 hover:text-[rgba(30,50,90,0.9)] transition-colors cursor-pointer",
          className
        )}
        {...props}
      >
        {showFavicon && (
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
            alt=""
            className="size-3.5 rounded-sm"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = "none"
            }}
          />
        )}
        <span className="font-normal">{domain}</span>
      </button>
    </PopoverTrigger>
  )
}

function SourceContent({
  title,
  description,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  title: string
  description?: string
}) {
  const { href } = React.useContext(SourceContext)

  return (
    <PopoverContent
      className={cn(
        "w-80 p-3 bg-white/80 backdrop-blur-xl border border-white/30 rounded-xl shadow-lg",
        className
      )}
      {...props}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col gap-1.5"
      >
        <div className="flex items-start justify-between gap-2">
          <span className="text-[13px] font-medium text-[rgba(30,50,90,0.95)] leading-snug group-hover:underline line-clamp-2">
            {title}
          </span>
          <ExternalLink className="size-3.5 text-[rgba(30,50,90,0.4)] flex-shrink-0 mt-0.5" />
        </div>
        {description && (
          <p className="text-[11px] text-[rgba(30,50,90,0.55)] line-clamp-3 leading-relaxed">
            {description}
          </p>
        )}
        <span className="text-[10px] text-[rgba(30,50,90,0.4)] truncate mt-0.5">
          {href}
        </span>
      </a>
    </PopoverContent>
  )
}

export { Source, SourceTrigger, SourceContent }
