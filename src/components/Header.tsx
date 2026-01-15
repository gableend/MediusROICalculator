"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top eyebrow bar */}
      <div className="hidden lg:block border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center py-2">
            <nav className="flex items-center gap-4 text-sm">
              <button
                type="button"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <polyline
                    points="208 96 128 176 48 96"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                </svg>
                <span>English</span>
              </button>
              <Link
                href="#"
                className="text-gray-600 hover:text-gray-900"
              >
                Contact Us
              </Link>
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 256 256"
                >
                  <circle
                    cx="116"
                    cy="116"
                    r="84"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                  <line
                    x1="175.4"
                    y1="175.4"
                    x2="224"
                    y2="224"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="https://ext.same-assets.com/1543560847/102504094.svg"
              alt="Medius"
              className="h-8"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Solutions
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Pricing Plans
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Why Medius
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Partners
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Customers
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Resources
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Company
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link
              href="#"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
            >
              Book a Demo
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 256 256"
              >
                <line
                  x1="200"
                  y1="56"
                  x2="56"
                  y2="200"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
                <line
                  x1="200"
                  y1="200"
                  x2="56"
                  y2="56"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 256 256"
              >
                <line
                  x1="40"
                  y1="128"
                  x2="216"
                  y2="128"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
                <line
                  x1="40"
                  y1="64"
                  x2="216"
                  y2="64"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
                <line
                  x1="40"
                  y1="192"
                  x2="216"
                  y2="192"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Solutions
              </Link>
              <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Pricing Plans
              </Link>
              <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Why Medius
              </Link>
              <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Partners
              </Link>
              <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Customers
              </Link>
              <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Resources
              </Link>
              <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Company
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
              >
                Book a Demo
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
