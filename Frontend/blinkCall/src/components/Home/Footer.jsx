import React from "react";


const Footer = () => {
    return (
      <footer className="w-full bg-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              © 2025 VideoCall App. All rights reserved.
            </div>
            <div className="space-x-4">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  };


export default Footer;

