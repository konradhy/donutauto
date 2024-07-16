import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"
          ></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
        <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg"></div>
        <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
