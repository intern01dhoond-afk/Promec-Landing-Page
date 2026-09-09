import React from "react";

export const Image = ({
  src,
  alt,
  width,
  height,
  className,
  ...props
}: {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      {...props}
    />
  );
};

export default Image;
