import Link from "next/link";

export default function NotFound() {
  return <main id="main" className="not-found"><p>404</p><h1>Page not found.</h1><Link href="/">Return to the portfolio →</Link></main>;
}
