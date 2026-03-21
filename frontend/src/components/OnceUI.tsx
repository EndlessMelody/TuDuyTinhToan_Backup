import React from 'react';

// ---- Flex Container (Column) ----
export const Column = React.forwardRef<HTMLDivElement, any>(({
  fillWidth, fillHeight, fill, align, justify, padding, paddingX, paddingY, paddingBottom,
  gap, background, radius, overflow, position, border, borderRight, borderLeft, borderBottom, borderTop,
  flex, className, style, children, ...props
}, ref) => {
  const paddingVal = padding === 'xl' ? '48px' : padding === 'l' ? '32px' : padding === 'm' ? '16px' : padding === 's' ? '8px' : undefined;
  const px = paddingX === 'xl' ? '48px' : paddingX === 'l' ? '32px' : paddingX === 'm' ? '16px' : paddingX === 's' ? '8px' : undefined;
  const py = paddingY === 'xl' ? '48px' : paddingY === 'l' ? '32px' : paddingY === 'm' ? '16px' : paddingY === 's' ? '8px' : undefined;
  const pb = paddingBottom === 'xl' ? '48px' : paddingBottom === 'l' ? '32px' : paddingBottom === 'm' ? '16px' : paddingBottom === 's' ? '8px' : undefined;

  const borderVal = border === 'neutral-alpha-weak' ? '1px solid rgba(255,255,255,0.08)' : undefined;
  const bgVal = background === 'page' ? '#0A0A0A' : background === 'surface' ? '#141414' : background === 'overlay' ? 'rgba(0,0,0,0.8)' : undefined;
  const radiusVal = radius === 'xl' ? '32px' : radius === 'l' ? '24px' : radius === 'm' ? '16px' : radius === 's' ? '8px' : undefined;

  return (
    <div ref={ref} className={className} style={{
      display: 'flex', flexDirection: 'column',
      width: (fillWidth || fill) ? '100%' : undefined,
      height: (fillHeight || fill) ? '100%' : undefined,
      alignItems: align === 'center' ? 'center' : align === 'end' ? 'flex-end' : undefined,
      justifyContent: justify === 'center' ? 'center' : justify === 'end' ? 'flex-end' : justify === 'between' ? 'space-between' : undefined,
      padding: paddingVal,
      paddingLeft: px, paddingRight: px,
      paddingTop: py, paddingBottom: pb || py,
      gap: gap ? `${gap}px` : undefined,
      backgroundColor: bgVal,
      borderRadius: radiusVal,
      overflow: overflow === 'hidden' ? 'hidden' : undefined,
      position: position === 'relative' ? 'relative' : position === 'sticky' ? 'sticky' : position === 'absolute' ? 'absolute' : undefined,
      border: borderVal,
      borderRight: borderRight === 'neutral-alpha-weak' ? '1px solid rgba(255,255,255,0.08)' : undefined,
      borderLeft: borderLeft === 'neutral-alpha-weak' ? '1px solid rgba(255,255,255,0.08)' : undefined,
      borderBottom: borderBottom === 'neutral-alpha-weak' ? '1px solid rgba(255,255,255,0.08)' : undefined,
      borderTop: borderTop === 'neutral-alpha-weak' ? '1px solid rgba(255,255,255,0.08)' : undefined,
      flex: flex,
      ...style
    }} {...props}>
      {children}
    </div>
  );
});
Column.displayName = "Column";

// ---- Flex Container (Row) ----
export const Row = React.forwardRef<HTMLDivElement, any>(({
  fillWidth, fillHeight, fill, align, justify, horizontal, vertical,
  padding, paddingX, paddingY, gap, background, radius,
  overflow, position, border, borderRight, borderLeft, borderBottom, borderTop,
  flex, className, style, children, ...props
}, ref) => {
  const paddingVal = padding === 'xl' ? '48px' : padding === 'l' ? '32px' : padding === 'm' ? '16px' : padding === 's' ? '8px' : undefined;
  const px = paddingX === 'xl' ? '48px' : paddingX === 'l' ? '32px' : paddingX === 'm' ? '16px' : paddingX === 's' ? '8px' : undefined;
  const py = paddingY === 'xl' ? '48px' : paddingY === 'l' ? '32px' : paddingY === 'm' ? '16px' : paddingY === 's' ? '8px' : undefined;

  // horizontal/vertical map to justify/align for Row
  const justifyVal = horizontal === 'between' ? 'space-between' : horizontal === 'center' ? 'center' : horizontal === 'end' ? 'flex-end' :
    justify === 'between' ? 'space-between' : justify === 'center' ? 'center' : justify === 'end' ? 'flex-end' : undefined;
  const alignVal = vertical === 'center' ? 'center' : vertical === 'end' ? 'flex-end' :
    align === 'center' ? 'center' : align === 'end' ? 'flex-end' : undefined;

  const borderVal = border === 'neutral-alpha-weak' ? '1px solid rgba(255,255,255,0.08)' : undefined;
  const bgVal = background === 'page' ? '#0A0A0A' : background === 'surface' ? '#141414' : background === 'overlay' ? 'rgba(0,0,0,0.8)' : undefined;
  const radiusVal = radius === 'xl' ? '32px' : radius === 'l' ? '24px' : radius === 'm' ? '16px' : radius === 's' ? '8px' : undefined;

  return (
    <div ref={ref} className={className} style={{
      display: 'flex', flexDirection: 'row',
      width: (fillWidth || fill) ? '100%' : undefined,
      height: (fillHeight || fill) ? '100%' : undefined,
      alignItems: alignVal,
      justifyContent: justifyVal,
      padding: paddingVal,
      paddingLeft: px, paddingRight: px,
      paddingTop: py, paddingBottom: py,
      gap: gap ? `${gap}px` : undefined,
      backgroundColor: bgVal,
      borderRadius: radiusVal,
      overflow: overflow === 'hidden' ? 'hidden' : undefined,
      position: position === 'relative' ? 'relative' : position === 'sticky' ? 'sticky' : undefined,
      border: borderVal,
      borderRight: borderRight === 'neutral-alpha-weak' ? '1px solid rgba(255,255,255,0.08)' : undefined,
      borderLeft: borderLeft === 'neutral-alpha-weak' ? '1px solid rgba(255,255,255,0.08)' : undefined,
      borderBottom: borderBottom === 'neutral-alpha-weak' ? '1px solid rgba(255,255,255,0.08)' : undefined,
      borderTop: borderTop === 'neutral-alpha-weak' ? '1px solid rgba(255,255,255,0.08)' : undefined,
      flex: flex,
      ...style
    }} {...props}>
      {children}
    </div>
  );
});
Row.displayName = "Row";

// ---- Grid ----
export const Grid = React.forwardRef<HTMLDivElement, any>(({ columns, gap, padding, background, style, children, ...props }, ref) => (
  <div ref={ref} style={{
    display: 'grid',
    gridTemplateColumns: columns || '1fr',
    gap: gap ? `${gap}px` : undefined,
    padding: padding === 'l' ? '64px' : padding === 'm' ? '32px' : undefined,
    backgroundColor: background === 'page' ? '#0A0A0A' : background === 'surface' ? '#141414' : undefined,
    ...style
  }} {...props}>
    {children}
  </div>
));
Grid.displayName = "Grid";

// ---- Typography ----
export const Heading = ({ variant, style, children, ...props }: any) => {
  const sizeMap: Record<string, string> = {
    'display-strong-xl': '4rem', 'display-strong-l': '3.5rem', 'display-strong-m': '2.5rem', 'display-strong-s': '2rem',
    'heading-strong-xl': '2rem', 'heading-strong-l': '1.5rem', 'heading-strong-m': '1.25rem', 'heading-strong-s': '1rem', 'heading-strong-xs': '0.875rem',
  };
  const fontSize = (variant && sizeMap[variant]) || '1.25rem';
  return <h2 style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", margin: 0, fontSize, fontWeight: 700, lineHeight: 1.2, ...style }} {...props}>{children}</h2>;
};

export const Text = ({ variant, style, children, ...props }: any) => {
  const sizeMap: Record<string, string> = {
    'body-default-xl': '1.125rem', 'body-default-l': '1rem', 'body-default-m': '0.9375rem',
    'body-default-s': '0.875rem', 'body-default-xs': '0.75rem',
  };
  const fontSize = (variant && sizeMap[variant]) || '0.9375rem';
  return <p style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", margin: 0, fontSize, lineHeight: 1.5, ...style }} {...props}>{children}</p>;
};

// ---- Button ----
export const Button = ({ size, variant, fillWidth, onClick, style, children, ...props }: any) => (
  <button onClick={onClick} style={{
    padding: size === 'l' ? '14px 28px' : size === 's' ? '8px 16px' : '10px 20px',
    backgroundColor: variant === 'secondary' ? 'rgba(255,255,255,0.1)' : variant === 'tertiary' ? 'transparent' : '#ED1B24',
    color: 'white',
    border: variant === 'secondary' ? '1px solid rgba(255,255,255,0.15)' : 'none',
    borderRadius: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    width: fillWidth ? '100%' : 'auto',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    fontSize: size === 'l' ? '0.95rem' : size === 's' ? '0.8rem' : '0.875rem',
    transition: 'all 0.2s ease',
    ...style
  }} {...props}>
    {children}
  </button>
);

// ---- IconButton ----
export const IconButton = ({ icon, variant, size, onClick, disabled, style, tooltip, ...props }: any) => (
  <button onClick={onClick} disabled={disabled} title={tooltip} style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: variant === 'secondary' ? '1px solid rgba(255,255,255,0.15)' : 'none',
    backgroundColor: variant === 'secondary' ? 'rgba(255,255,255,0.08)' : variant === 'tertiary' ? 'transparent' : 'transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: '12px',
    width: size === 'l' ? '48px' : size === 's' ? '28px' : '36px',
    height: size === 'l' ? '48px' : size === 's' ? '28px' : '36px',
    padding: 0,
    transition: 'all 0.2s ease',
    ...style
  }} {...props}>
    {icon}
  </button>
);

// ---- Input ----
export const Input = ({ placeholder, style, ...props }: any) => (
  <input placeholder={placeholder} style={{
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: 'white',
    outline: 'none',
    width: '100%',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    fontSize: '0.875rem',
    ...style
  }} {...props} />
);

// ---- Avatar ----
export const Avatar = ({ size = 'm', src, style, ...props }: any) => {
  const sizeMap: Record<string, string> = { xl: '64px', l: '48px', m: '36px', s: '28px', xs: '20px' };
  const dim = sizeMap[size] || '36px';
  return <img src={src} alt="" style={{
    width: dim, height: dim, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, ...style
  }} {...props} />;
};
