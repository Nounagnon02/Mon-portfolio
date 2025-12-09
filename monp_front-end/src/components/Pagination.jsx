import React from 'react';

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  hasNextPage,
  hasPrevPage 
}) => {
  return (
    <div className="pagination" role="navigation" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        aria-label="Page précédente"
        className="pagination__btn"
      >
        ← Précédent
      </button>

      <span className="pagination__info" aria-current="page">
        Page {currentPage} sur {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        aria-label="Page suivante"
        className="pagination__btn"
      >
        Suivant →
      </button>
    </div>
  );
};
