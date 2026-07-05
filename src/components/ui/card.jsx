export function Card({ title, subtitle, badge, href, children }) {
  const Element = href ? 'a' : 'article';

  return (
    <Element className={`card-ui ${href ? 'card-ui-link' : ''}`} href={href}>
      <div className="card-head">
        <div>
          <p className="card-subtitle">{subtitle}</p>
          <h3>{title}</h3>
        </div>
        {badge ? <span className="badge-ui">{badge}</span> : null}
      </div>
      <div className="card-body">{children}</div>
    </Element>
  );
}
