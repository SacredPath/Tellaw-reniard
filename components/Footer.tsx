import React from "react";

export default function Footer() {
  return (
    <footer className="w-full py-6 text-center text-gray-400 text-sm bg-brand-900 border-t border-yellow-400 mt-12">
      &copy; {new Date().getFullYear()} Doge Initiative. Not affiliated with Dogecoin Foundation. &nbsp;|
      <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline ml-2">Twitter</a>
    </footer>
  );
} 