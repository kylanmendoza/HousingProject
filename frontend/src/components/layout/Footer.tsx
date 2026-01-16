// src/components/layout/Footer.tsx
export const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Bozeman Health Employee Housing Portal</p>
          <p className="mt-1">For Bozeman Health employees only</p>
        </div>
      </div>
    </footer>
  );
};
