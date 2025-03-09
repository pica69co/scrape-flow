import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-emerald-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Sorry, the page you are looking for does not exist.
        </p>
        <div className="flex flex-col justify-center sm:flex-row gap-4">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-2 bg-emerald-500 text-white font-bold rounded-md hover:bg-primary/80 transition-colors"
          >
            <ArrowLeft className="size-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        If you think this is a mistake, please contact our support team or try
        again later.
      </footer>
    </div>
  );
};

export default NotFound;
