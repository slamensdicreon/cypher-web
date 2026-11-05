'use client';

export default function PrintButton() {
  return (
    <button type="button" className="btn pc-print" onClick={() => window.print()}>
      Print the postcards
    </button>
  );
}
