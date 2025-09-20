import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-black/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-600">Jalore Mahotsav</h3>
            <p className="text-sm text-black leading-relaxed">
              Celebrating the rich cultural heritage and traditions of Jalore
              through art, music, dance, and community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-black">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/about"
                className="text-sm text-blue-900/70 transition-colors hover:text-blue-600"
              >
                About Us
              </Link>
              <Link
                href="/sponsors"
                className="text-sm text-blue-900/70 transition-colors hover:text-blue-600"
              >
                Sponsors
              </Link>
              <Link
                href="/highlights"
                className="text-sm text-blue-900/70 transition-colors hover:text-blue-600"
              >
                Highlights
              </Link>
            </nav>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-black">Follow Us</h4>
            <div className="flex space-x-4">
              {/* Facebook */}
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition-colors hover:bg-blue-50 hover:border-blue-600"
                aria-label="Facebook"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition-colors hover:bg-blue-50 hover:border-blue-600"
                aria-label="Instagram"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.73-3.016-1.789H3.03c.568 2.953 3.1 5.175 6.171 5.175 1.508 0 2.896-.537 3.975-1.43l-1.72-1.484c-.678.567-1.549.898-2.481.898-.85 0-1.627-.292-2.257-.778l-.269-.224zm7.424-1.789h-2.403c-.568 1.059-1.719 1.789-3.016 1.789-.932 0-1.803-.331-2.481-.898l-1.72 1.484c1.079.893 2.467 1.43 3.975 1.43 3.071 0 5.603-2.222 6.171-5.175-.566-.629-1.236-1.03-2.026-1.03zm-3.458-2.171c1.297 0 2.448.73 3.016 1.789h2.403c-.568-2.953-3.1-5.175-6.171-5.175-1.508 0-2.896.537-3.975 1.43l1.72 1.484c.678-.567 1.549-.898 2.481-.898.85 0 1.627.292 2.257.778l.269.224z" />
                </svg>
              </a>

              {/* Twitter */}
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition-colors hover:bg-blue-50 hover:border-blue-600"
                aria-label="Twitter"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-black/10 pt-6">
          <p className="text-center text-sm text-blue-900/70">
            &copy; {new Date().getFullYear()} Jalore Mahotsav. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
