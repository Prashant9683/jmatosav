import Link from "next/link";

export default function Footer() {
  // We can get the locale if needed, but for simple links it's not required
  // as Next.js will maintain the current locale.
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p>
          &copy; {new Date().getFullYear()} Jalore Mahotsav. All rights
          reserved.
        </p>
        <div className="flex space-x-6">
          <Link href="/about" className="hover:text-white transition-colors">
            About Us
          </Link>
          <Link href="/sponsors" className="hover:text-white transition-colors">
            Sponsors
          </Link>
          <Link
            href="/highlights"
            className="hover:text-white transition-colors"
          >
            Highlights
          </Link>
        </div>
      </div>
    </footer>
  );
}
