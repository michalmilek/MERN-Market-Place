import React from "react";
import { Layout } from "antd";
import { Link } from "react-router-dom";

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:py-6 lg:px-8 flex flex-col lg:flex-row justify-between items-center">
        <div className="text-center lg:text-left">
          <p className="text-sm">© 2023 Michał Miłek. All rights reserved.</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Link
            to="#"
            className="text-gray-300 hover:text-gray-200 ml-4 font-medium">
            Privacy Policy
          </Link>
          <Link
            to="#"
            className="text-gray-300 hover:text-gray-200 ml-4 font-medium">
            Terms of Service
          </Link>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
