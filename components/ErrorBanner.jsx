"use client";
import React from "react";

export default function ErrorBanner({ message = "Something went wrong", onRetry }) {
  return (
    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
      <div className="flex items-center justify-between">
        <div>{message}</div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-4 px-2 py-1 bg-red-100 text-red-700 rounded"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}