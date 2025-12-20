import { useEffect, useRef } from "react";

// Safe defaults so the gallery can render even if data is incomplete.
// Render text that may include explicit LaTeX delimiters.
// We do NOT auto-wrap the entire string in math mode so normal prose stays readable.
const MathText = ({ value, className }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.textContent = value ?? "";
    const mj = window?.MathJax;
    mj?.typesetPromise?.([ref.current]);
  }, [value]);

  return <p ref={ref} className={className} />;
};

export default function Gallery({ pieces = [], selectedPiece, onSelectPiece, onClose }) {
  useEffect(() => {
    const mj = window?.MathJax;
    mj?.typesetPromise?.();
  }, [pieces, selectedPiece]);
  return (
    <section className="panel active" id="gallery" aria-label="Gallery">
      <div className="section-head">
        <h3>Gallery of Works</h3>
        <span className="badge">Made with Python</span>
      </div>
      <div className="gallery-grid">
        {pieces.map((piece) => (
          <article
            key={piece.title}
            className="gallery-card"
            role="button"
            tabIndex={0}
            onClick={() => onSelectPiece(piece)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectPiece(piece);
              }
            }}
          >
            {piece.image ? (
              <div className="gallery-visual has-img">
                <img src={piece.image} alt={`${piece.title} visualization`} className="gallery-img" />
              </div>
            ) : (
              <div className="gallery-visual" style={{ backgroundImage: piece.palette }} />
            )}

            <div className="gallery-meta">
              <div className="gallery-title">{piece.title}</div>
              <MathText value={piece.text} className="gallery-text" />
              <div className="pill-row">
                {(piece.tags ?? []).map((tag) => (
                  <span key={tag} className="pill">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      {selectedPiece && (
        <div className="modal-overlay" onClick={onClose}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedPiece.title} details`}
            onClick={(e) => e.stopPropagation()}
          >
            {selectedPiece.image ? (
              <img src={selectedPiece.image} alt={`${selectedPiece.title} full view`} className="modal-img" />
            ) : (
              <div className="modal-visual" style={{ backgroundImage: selectedPiece.palette }} />
            )}

            <div className="modal-body">
              <div className="modal-head">
                <div>
                  <div className="modal-title">{selectedPiece.title}</div>
                  <div className="pill-row">
                    {(selectedPiece.tags ?? []).map((tag) => (
                      <span key={tag} className="pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="modal-close" type="button" onClick={onClose}>
                  X
                </button>
              </div>
              <MathText value={selectedPiece.text} className="modal-text" />
              <MathText value={selectedPiece.details} className="modal-muted" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
