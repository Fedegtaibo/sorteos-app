import type { CSSProperties, SVGProps } from 'react';
import {
  activaIconDefinitions,
  type ActivaIconName,
} from './icon-definitions';

export type ActivaIconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: ActivaIconName;
  size?: 16 | 20 | 24 | 32 | number;
  strokeWidth?: number;
  title?: string;
};

export function ActivaIcon({
  name,
  size = 24,
  strokeWidth = 2,
  title,
  style,
  ...props
}: ActivaIconProps) {
  const icon = activaIconDefinitions[name];
  const accessibleTitle = title ?? icon.label;
  const mergedStyle: CSSProperties = {
    display: 'inline-block',
    flexShrink: 0,
    verticalAlign: 'middle',
    ...style,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title ? accessibleTitle : undefined}
      focusable="false"
      style={mergedStyle}
      dangerouslySetInnerHTML={{ __html: icon.body }}
      {...props}
    />
  );
}
