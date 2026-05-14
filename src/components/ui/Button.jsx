import React from 'react';
import { cn } from '../../utils/utils';

export const Button = React.forwardRef(({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md',
    outline: 'border border-border bg-transparent hover:bg-muted text-foreground',
    ghost: 'bg-transparent hover:bg-muted text-foreground',
    glass: 'glass hover:bg-white/10 text-foreground border-white/20',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
