import React from 'react';

// Mock Once UI <Column>
export const Column = React.forwardRef<HTMLDivElement, any>(({ fillWidth, fillHeight, align, justify, padding, gap, background, style, children, ...props }, ref) => (
  <div ref={ref} style={{
    display: 'flex', flexDirection: 'column', 
    width: fillWidth ? '100%' : 'auto', 
    height: fillHeight ? '100%' : 'auto', 
    alignItems: align === 'center' ? 'center' : align === 'end' ? 'flex-end' : 'flex-start',
    justifyContent: justify === 'center' ? 'center' : justify === 'end' ? 'flex-end' : 'flex-start',
    padding: padding || 0,
    gap: gap ? `${gap}px` : 0,
    backgroundColor: background === 'page' ? '#121212' : 'transparent',
    ...style
  }} {...props}>
    {children}
  </div>
));
Column.displayName = "Column";

// Mock Once UI <Row>
export const Row = React.forwardRef<HTMLDivElement, any>(({ fillWidth, align, justify, padding, gap, style, children, ...props }, ref) => (
  <div ref={ref} style={{
    display: 'flex', flexDirection: 'row', 
    width: fillWidth ? '100%' : 'auto', 
    alignItems: align === 'center' ? 'center' : align === 'end' ? 'flex-end' : 'flex-start',
    justifyContent: justify === 'center' ? 'center' : justify === 'end' ? 'flex-end' : 'flex-start',
    padding: padding || 0,
    gap: gap ? `${gap}px` : 0,
    ...style
  }} {...props}>
    {children}
  </div>
));
Row.displayName = "Row";

// Mock Once UI <Heading>
export const Heading = ({ variant, style, children }: any) => (
  <h1 style={{ fontFamily: 'sans-serif', margin: 0, ...style }}>{children}</h1>
);

// Mock Once UI <Text>
export const Text = ({ variant, style, children }: any) => (
  <p style={{ fontFamily: 'sans-serif', margin: 0, ...style }}>{children}</p>
);

// Mock Once UI <IconButton>
export const IconButton = ({ icon, variant, size, onClick, disabled, style, tooltip }: any) => (
  <button onClick={onClick} disabled={disabled} title={tooltip} style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', ...style
  }}>
    {icon}
  </button>
);
