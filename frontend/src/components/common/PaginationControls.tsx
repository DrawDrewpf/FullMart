import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  shouldScrollOnChange?: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  shouldScrollOnChange = false
}) => {
  const handlePageChange = (page: number) => {
    onPageChange(page);
    
    // Solo hacer scroll si está habilitado (para paginación inferior)
    if (shouldScrollOnChange) {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
  };
  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center ${className}`}>
      <nav className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Anterior
        </button>
        
        {/* Page Numbers */}
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          let pageNumber;
          if (totalPages <= 7) {
            pageNumber = i + 1;
          } else if (currentPage <= 4) {
            pageNumber = i + 1;
          } else if (currentPage >= totalPages - 3) {
            pageNumber = totalPages - 6 + i;
          } else {
            pageNumber = currentPage - 3 + i;
          }
          
          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === pageNumber
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
        
        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
        </button>
      </nav>
    </div>
  );
};

export default PaginationControls;
