import React from "react";

export const Link = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(
  ({ href, children, className, onClick, ...props }, ref) => {
    return (
      <a ref={ref} href={href} className={className} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }
);

Link.displayName = "Link";
export default Link;
