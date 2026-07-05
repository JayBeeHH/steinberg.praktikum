export function Label({ children, htmlFor }) {
  return (
    <label className="label-field" htmlFor={htmlFor}>
      {children}
    </label>
  );
}
