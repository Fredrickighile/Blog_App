import React from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import logo1 from "../img/logo1.png";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 py-8 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Brand and copyright */}
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <Link to="/" className="mb-2">
              <img src={logo1} alt="Blog Logo" className="h-8 w-auto" />
            </Link>
            <span className="text-sm text-gray-500">
              &copy; {currentYear} Blog Application. All rights reserved.
            </span>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-4 md:mb-0">
            <Link
              to="/?cat=art"
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
            >
              Art
            </Link>
            <Link
              to="/?cat=technology"
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
            >
              Technology
            </Link>
            <Link
              to="/?cat=food"
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
            >
              Food
            </Link>
            <Link
              to="/?cat=design"
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
            >
              Design
            </Link>
            <Link
              to="/?cat=cinema"
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
            >
              Cinema
            </Link>
            <Link
              to="/?cat=science"
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
            >
              Science
            </Link>
          </div>

          {/* Social links */}
          <div className="flex space-x-4">
            <a
              href="https://www.linkedin.com/in/fredrick-ighile-968403280/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-700 transition-colors"
              aria-label="LinkedIn"
            >
              <FiLinkedin className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/Fredrickighile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="GitHub"
            >
              <FiGithub className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Bottom links */}
        <div className="border-t border-gray-200 mt-6 pt-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex space-x-4 text-sm mb-4 md:mb-0">
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
          <span className="text-gray-500 text-sm">
            Made with ❤️ for the community
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
