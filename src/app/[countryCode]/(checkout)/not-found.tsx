import { Metadata } from "next"
import Link from "next/link"

const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

export const metadata: Metadata = {
  title: "404 | RH",
  description: "The page you are looking for could not be found.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-qw-off-white">
      <p className="font-serif text-[120px] leading-none text-qw-pale-grey select-none">
        404
      </p>
      <p className="font-serif text-[24px] text-qw-light-grey tracking-[0.2em] uppercase mt-6">
        Page Not Found
      </p>
      <p className="font-sans text-[14px] text-qw-medium-grey max-w-md text-center mt-4 leading-relaxed">
        The page you requested is unavailable or may have been moved. Please verify the
        address or return to the homepage to continue browsing.
      </p>
      <Link
        href={`/${DEFAULT_REGION}`}
        className="mt-10 inline-flex items-center justify-center px-10 py-3.5 bg-qw-black text-qw-white text-micro font-sans uppercase tracking-[0.2em] transition-opacity duration-300 hover:opacity-85"
      >
        Return Home
      </Link>
    </div>
  )
}
