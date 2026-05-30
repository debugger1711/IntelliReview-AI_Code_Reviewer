import React from 'react';
import { cn } from '../../lib/utils';

export function Avatar({ src, alt, fallback, className, ...props }) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface border border-border",
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
          {fallback || "?"}
        </div>
      )}
    </div>
  );
}
