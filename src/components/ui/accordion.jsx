import { useState } from 'react';

export function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`accordion-card ${open ? 'open' : ''}`}>
      <button className="accordion-trigger" type="button" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span>{open ? '−' : '+'}</span>
      </button>
      {open ? <div className="accordion-panel">{children}</div> : null}
    </div>
  );
}
