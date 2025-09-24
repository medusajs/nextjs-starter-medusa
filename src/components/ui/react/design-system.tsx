/**
 * Welcome to Craft DS this is the design system file for your project.
 * @file ds.tsx
 * @description Provides layout components for structuring pages and a design system for prose content.
 */

import { cn } from "@/lib/utils"

/**
 * Props for layout components.
 *
 * @typedef {Object} DSProps
 * @property {string} [className] - Additional class names.
 * @property {React.ReactNode} [children] - Child elements to render.
 * @property {string} [id] - HTML id attribute.
 * @property {React.CSSProperties} [style] - Inline styles for the element.
 * @property {{ __html: string }} [dangerouslySetInnerHTML] - HTML content to set dangerously.
 * @property {string} [containerClassName] - Additional class names for inner container elements.
 * @property {boolean} [isArticle] - If true, renders the element as an article.
 */

type DSProps = {
  className?: string
  children?: React.ReactNode
  id?: string
  style?: React.CSSProperties
  dangerouslySetInnerHTML?: { __html: string }
  containerClassName?: string
  isArticle?: boolean
  isSpaced?: boolean
}

/**
 * Section component to wrap content in a section element.
 *
 * @param {DSProps} props - Component props.
 * @param {React.ReactNode} props.children - Child elements.
 * @param {string} [props.className] - Additional class names.
 * @param {string} [props.id] - HTML id attribute.
 * @param {React.CSSProperties} [props.style] - Inline styles.
 * @returns {JSX.Element} A section element.
 */
export const Section = ({ children, className, id, style }: DSProps) => (
  <section className={cn("py-2 sm:py-4", className)} id={id} style={style}>
    {children}
  </section>
)

/**
 * Container component to wrap content within a centered div with padding.
 *
 * @param {DSProps} props - Component props.
 * @param {React.ReactNode} props.children - Child elements.
 * @param {string} [props.className] - Additional class names.
 * @param {string} [props.id] - HTML id attribute.
 * @param {React.CSSProperties} [props.style] - Inline styles.
 * @returns {JSX.Element} A div element acting as a container.
 */
export const Container = ({ children, className, id, style }: DSProps) => (
  <div className={cn("container", className)} id={id} style={style}>
    {children}
  </div>
)

/**
 * Nav component to render a navigation container with an inner div.
 *
 * @param {DSProps} props - Component props.
 * @param {React.ReactNode} props.children - Child elements.
 * @param {string} [props.className] - Additional class names for the nav element.
 * @param {string} [props.id] - HTML id attribute.
 * @param {React.CSSProperties} [props.style] - Inline styles.
 * @param {string} [props.containerClassName] - Additional class names for the inner container.
 * @returns {JSX.Element} A nav element with a centered inner container.
 */

export const Nav = ({
  children,
  className,
  id,
  style,
  containerClassName,
}: DSProps) => (
  <nav className={cn(className)} id={id} style={style}>
    <div
      id="nav-container"
      className={cn("container py-3", containerClassName)}
    >
      {children}
    </div>
  </nav>
)

/**
 * Layout component that renders the root HTML element with global settings.
 *
 * @param {DSProps} props - Component props.
 * @param {React.ReactNode} props.children - Child elements.
 * @param {string} [props.className] - Additional class names.
 * @param {React.CSSProperties} [props.style] - Inline styles.
 * @returns {JSX.Element} An HTML element wrapping the entire document.
 */

export const Layout = ({ children, className, style }: DSProps) => (
  <html
    lang="en"
    suppressHydrationWarning
    className={cn("scroll-smooth antialiased focus:scroll-auto", className)}
    style={style}
  >
    {children}
  </html>
)

/**
 * Main component to wrap the primary content of the page.
 *
 * @param {DSProps} props - Component props.
 * @param {React.ReactNode} props.children - Child elements.
 * @param {string} [props.className] - Additional class names.
 * @param {string} [props.id] - HTML id attribute.
 * @param {React.CSSProperties} [props.style] - Inline styles.
 * @returns {JSX.Element} A main element.
 */
export const Main = ({ children, className, id, style }: DSProps) => (
  <main className={cn("", className)} id={id} style={style}>
    {children}
  </main>
)

/**
 * Prose component to render formatted rich text content.
 * Can render as an article or a div based on the isArticle prop.
 *
 * @param {DSProps} props - Component props.
 * @param {React.ReactNode} props.children - Child elements.
 * @param {string} [props.className] - Additional class names.
 * @param {string} [props.id] - HTML id attribute.
 * @param {{ __html: string }} [props.dangerouslySetInnerHTML] - HTML content to be dangerously set.
 * @param {React.CSSProperties} [props.style] - Inline styles.
 * @param {boolean} [props.isArticle=false] - If true, renders as an article element.
 * @returns {JSX.Element} A div or article element containing styled rich text.
 */

export const Prose = ({
  children,
  className,
  id,
  dangerouslySetInnerHTML,
  style,
  isArticle = false,
  isSpaced = false,
}: DSProps) => {
  const Component = isArticle ? "article" : "div"

  return (
    <Component
      className={cn(
        // Base classes
        "text-base leading-7 antialiased",
        // Heading styles
        "[&_h1]:text-4xl [&_h1]:font-medium [&_h1]:tracking-tight [&_h1]:text-balance sm:[&_h1]:text-5xl",
        "[&_h2]:text-3xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-balance sm:[&_h2]:text-4xl",
        "[&_h3]:text-2xl [&_h3]:font-medium [&_h3]:tracking-tight [&_h3]:text-balance sm:[&_h3]:text-3xl",
        "[&_h4]:text-xl [&_h4]:tracking-tight [&_h4]:text-balance sm:[&_h4]:text-2xl",
        "[&_h5]:text-lg [&_h5]:tracking-tight [&_h5]:text-balance sm:[&_h5]:text-xl",
        "[&_h6]:text-base [&_h6]:tracking-tight [&_h6]:text-balance sm:[&_h6]:text-lg",
        // Paragraph styles
        "[&_p]:text-base [&_p]:text-pretty",
        // Inline text styles
        "[&_strong]:font-semibold",
        "[&_muted]:text-muted-foreground",
        "[&_em]:italic",
        "[&_del]:line-through",
        "[&_small]:text-sm [&_small]:leading-snug",
        "[&_sub]:align-baseline [&_sub]:text-sm [&_sup]:align-baseline [&_sup]:text-sm",
        // Links (except in headings)
        "[&_a:not(h1_a,h2_a,h3_a,h4_a,h5_a,h6_a)]:text-primary [&_a:not(h1_a,h2_a,h3_a,h4_a,h5_a,h6_a)]:no-underline [&_a:not(h1_a,h2_a,h3_a,h4_a,h5_a,h6_a)]:decoration-primary/50 [&_a:not(h1_a,h2_a,h3_a,h4_a,h5_a,h6_a)]:underline-offset-2 [&_a:not(h1_a,h2_a,h3_a,h4_a,h5_a,h6_a)]:transition-all [&_a:not(h1_a,h2_a,h3_a,h4_a,h5_a,h6_a)]:hover:text-primary/100 [&_a:not(h1_a,h2_a,h3_a,h4_a,h5_a,h6_a)]:hover:underline [&_a:not(h1_a,h2_a,h3_a,h4_a,h5_a,h6_a)]:focus-visible:ring-2 [&_a:not(h1_a,h2_a,h3_a,h4_a,h5_a,h6_a)]:focus-visible:ring-primary/50 [&_a:not(h1_a,h2_a,h3_a,h4_a,h5_a,h6_a)]:focus-visible:outline-hidden",
        // Lists
        "[&_ul]:list-none [&_ul]:space-y-1 [&_ul]:py-3 [&_ul]:pl-0",
        "[&_ul>li]:relative [&_ul>li]:pl-6",
        "[&_ul>li]:before:absolute [&_ul>li]:before:top-[0.6875em] [&_ul>li]:before:left-1 [&_ul>li]:before:h-1.5 [&_ul>li]:before:w-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-foreground/80 [&_ul>li]:before:content-['']",
        "[&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:py-3 [&_ol]:pl-6",
        "[&_ol>ol]:list-[lower-alpha]",
        "[&_ol>ol>ol]:list-[lower-roman]",
        // Definition list
        "[&_dl]:space-y-1 [&_dl]:py-3",
        "[&_dt]:text-sm [&_dt]:leading-snug [&_dt]:font-medium [&_dt:not(:first-child)]:mt-3",
        "[&_dd]:text-sm [&_dd]:leading-snug [&_dd]:text-muted-foreground",
        // List item base styling
        "[&_li]:pl-2 [&_li]:marker:text-foreground/80",
        "[&_li>ol]:mt-2 [&_li>ol]:mb-0 [&_li>ul]:mt-2 [&_li>ul]:mb-0",
        "[&_ul>ul>li]:before:bg-foreground/60",
        "[&_ul>ul>ul>li]:before:bg-foreground/40",
        // Code blocks
        "[&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:border [&_code:not(pre_code)]:bg-muted/50 [&_code:not(pre_code)]:px-1 [&_code:not(pre_code)]:py-px [&_code:not(pre_code)]:font-mono [&_code:not(pre_code)]:text-sm [&_code:not(pre_code)]:font-medium",
        // Title code blocks
        "[&_h1>code:not(pre_code)]:tracking-tight [&_h1>code:not(pre_code)]:text-inherit",
        "[&_h2>code:not(pre_code)]:tracking-tight [&_h2>code:not(pre_code)]:text-inherit",
        "[&_h3>code:not(pre_code)]:tracking-tight [&_h3>code:not(pre_code)]:text-inherit",
        "[&_h4>code:not(pre_code)]:tracking-tight [&_h4>code:not(pre_code)]:text-inherit",
        "[&_h5>code:not(pre_code)]:tracking-tight [&_h5>code:not(pre_code)]:text-inherit",
        "[&_h6>code:not(pre_code)]:tracking-tight [&_h6>code:not(pre_code)]:text-inherit",
        // Specific heading code block sizes
        "[&_h1>code:not(pre_code)]:text-4xl sm:[&_h1>code:not(pre_code)]:text-5xl",
        "[&_h2>code:not(pre_code)]:text-3xl sm:[&_h2>code:not(pre_code)]:text-4xl",
        "[&_h3>code:not(pre_code)]:text-2xl sm:[&_h3>code:not(pre_code)]:text-3xl",
        "[&_h4>code:not(pre_code)]:text-xl sm:[&_h4>code:not(pre_code)]:text-2xl",
        "[&_h5>code:not(pre_code)]:text-lg sm:[&_h5>code:not(pre_code)]:text-xl",
        "[&_h6>code:not(pre_code)]:text-base sm:[&_h6>code:not(pre_code)]:text-lg",
        // Pre blocks
        "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-sm [&_pre]:border [&_pre]:bg-muted/50 [&_pre]:p-4",
        "[&_pre>code]:bg-transparent [&_pre>code]:p-0",
        // Tables
        "[&_table]:my-4 [&_table]:w-full [&_table]:overflow-hidden [&_table]:rounded-sm [&_table]:border",
        "[&_thead]:bg-muted/50",
        "[&_tr]:border-b [&_tr:nth-child(even)]:bg-muted/20",
        "[&_th]:border-r [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold",
        "[&_td]:border-r [&_td]:px-4 [&_td]:py-2",
        // Media
        "[&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-sm [&_img]:border",
        "[&_video]:my-4 [&_video]:h-auto [&_video]:max-w-full [&_video]:rounded-sm [&_video]:border",
        "[&_figure]:my-4",
        "[&_figcaption]:mb-6! [&_figcaption]:text-sm [&_figcaption]:text-muted-foreground",
        // Block elements
        "[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:bg-muted/30 [&_blockquote]:py-2 [&_blockquote]:pl-4! [&_blockquote]:text-muted-foreground",
        "[&_hr]:my-8! [&_hr]:border-t-2 [&_hr]:border-border/50",
        "[&_p:has(>hr)]:my-8! [&_p:has(>hr)]:border-t-2 [&_p:has(>hr)]:border-border/50",
        "[&_details]:my-4 [&_details]:rounded-sm [&_details]:border [&_details]:px-4 [&_details]:py-2",
        "[&_summary]:cursor-pointer [&_summary]:font-semibold focus-visible:[&_summary]:outline-hidden",
        // Interactive elements
        "[&_kbd]:rounded-sm [&_kbd]:border [&_kbd]:bg-muted [&_kbd]:px-1.5 [&_kbd]:py-0.5 [&_kbd]:align-middle [&_kbd]:font-mono [&_kbd]:text-sm [&_kbd]:shadow-xs",
        // Abbreviations
        "[&_abbr]:cursor-help [&_abbr]:border-b [&_abbr]:border-dotted [&_abbr]:decoration-muted-foreground [&_abbr]:underline-offset-2",
        isArticle && "max-w-prose",
        // Space between children
        isSpaced ? "space-y-6" : "",
        // Heading spacing
        isSpaced ? "[&_h1]:mb-4 [&_h1:not(:first-child)]:mt-8" : "",
        isSpaced ? "[&_h2]:mb-4 [&_h2:not(:first-child)]:mt-8" : "",
        isSpaced ? "[&_h3]:mb-3 [&_h3:not(:first-child)]:mt-6" : "",
        isSpaced ? "[&_h4]:mb-3 [&_h4:not(:first-child)]:mt-6" : "",
        isSpaced ? "[&_h5]:mb-2 [&_h5:not(:first-child)]:mt-6" : "",
        isSpaced ? "[&_h6]:mb-2 [&_h6:not(:first-child)]:mt-4" : "",
        className
      )}
      id={id}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      style={style}
    >
      {children}
    </Component>
  )
}
