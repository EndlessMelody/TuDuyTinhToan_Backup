import React from 'react';

export const Column = React.forwardRef<HTMLDivElement, any>(({ fillWidth, fillHeight, align, justify, padding, gap, background, radius, style, children, ...props }, ref) => (
  <div ref={ref} style={{
    display: 'flex', flexDirection: 'column', 
    width: fillWidth ? '100%' : 'auto', 
    height: fillHeight ? '100%' : 'auto', 
    alignItems: align === 'center' ? 'center' : align === 'end' ? 'flex-end' : 'flex-start',
    justifyContent: justify === 'center' ? 'center' : justify === 'end' ? 'flex-end' : 'flex-start',
    padding: padding === 'xl' ? '48px' : padding === 'l' ? '32px' : padding === 'm' ? '16px' : (padding || 0),
    gap: gap ? `${gap}px` : 0,
    backgroundColor: background === 'page' ? '#121212' : background === 'surface' ? '#1e1e1e' : 'transparent', 
    borderRadius: radius === 'l' ? '24px' : radius === 'm' ? '16px' : undefined,
    ...style
  }} {...props}>
    {children}
  </div>
));
Column.displayName = "Column";

export const Row = React.forwardRef<HTMLDivElement, any>(({ fillWidth, fillHeight, align, justify, padding, gap, background, style, children, ...props }, ref) => (
  <div ref={ref} style={{
    display: 'flex', flexDirection: 'row', 
    width: fillWidth ? '100%' : 'auto', 
    height: fillHeight ? '100%' : 'auto', 
    alignItems: align === 'center' ? 'center' : align === 'end' ? 'flex-end' : 'flex-start',
    justifyContent: justify === 'between' ? 'space-between' : justify === 'center' ? 'center' : justify === 'end' ? 'flex-end' : 'flex-start',
    padding: padding === 'l' ? '32px' : padding === 'm' ? '16px' : (padding || 0),
    gap: gap ? `${gap}px` : 0,
    backgroundColor: background === 'page' ? '#121212' : background === 'surface' ? '#1e1e1e' : 'transparent',
    ...style
  }} {...props}>
    {children}
  </div>
));
Row.displayName = "Row";

export const Grid = React.forwardRef<HTMLDivElement, any>(({ columns, gap, padding, background, style, children, ...props }, ref) => (
  <div ref={ref} style={{
    display: 'grid',
    gridTemplateColumns: columns || '1fr',
    gap: gap ? (isNaN(gap) ? gap : `${gap}px`) : 0,
    padding: padding === 'l' ? '64px' : padding === 'm' ? '32px' : (padding || 0),
    backgroundColor: background === 'page' ? '#121212' : background === 'surface' ? '#1e1e1e' : 'transparent',
    ...style
  }} {...props}>
    {children}
  </div>
));
Grid.displayName = "Grid";

export const Heading = ({ variant, style, children }: any) => (
  <h1 style={{ fontFamily: 'sans-serif', margin: 0, ...style }}>{children}</h1>
);

export const Text = ({ variant, style, children }: any) => (
  <p style={{ fontFamily: 'sans-serif', margin: 0, ...style }}>{children}</p>
);

export const Button = ({ size, variant, fillWidth, style, children }: any) => (
  <button style={{
    padding: size === 'l' ? '16px 32px' : size === 's' ? '8px 16px' : '12px 24px',
    backgroundColor: variant === 'secondary' ? '#333' : '#FF5B26', 
    color: 'white',
    border: 'none',
    borderRadius: '999px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: fillWidth ? '100%' : 'auto',
    ...style
  }}>
    {children}
  </button>
);

export const IconButton = ({ icon, variant, size, onClick, disabled, style, tooltip }: any) => (
  <button onClick={onClick} disabled={disabled} title={tooltip} style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', ...style
  }}>
    {icon}
  </button>
);

export const Input = ({ placeholder, style, ...props }: any) => (
  <input placeholder={placeholder} style={{
    padding: '12px 16px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: 'white',
    outline: 'none',
    width: '100%',
    ...style
  }} {...props} />
);

export const Avatar = ({ size = 'm', src, style, ...props }: any) => (
  <img src={src} style={{
    width: size === 'l' ? '48px' : size === 's' ? '28px' : '36px',
    height: size === 'l' ? '48px' : size === 's' ? '28px' : '36px',
    borderRadius: '50%',
    objectFit: 'cover',
    ...style
  }} {...props} />
);
