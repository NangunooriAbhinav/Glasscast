import React from "react";
import { GlassButton, GlassButtonProps } from "./Glass/GlassButton";

export interface ButtonProps extends Omit<GlassButtonProps, "title"> {
  children?: React.ReactNode;
  title?: string;
  text?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  title,
  text,
  ...props
}) => {
  const buttonTitle = title || text || "Button";

  return (
    <GlassButton
      title={buttonTitle}
      variant="primary"
      size="medium"
      material="medium"
      enableHover={true}
      enablePress={true}
      enableRipple={true}
      {...props}
    />
  );
};

// Export common button variants
export const PrimaryButton: React.FC<ButtonProps> = (props) => (
  <Button {...props} variant="primary" />
);

export const SecondaryButton: React.FC<ButtonProps> = (props) => (
  <Button {...props} variant="secondary" />
);

export const OutlineButton: React.FC<ButtonProps> = (props) => (
  <Button {...props} variant="outline" />
);

export const GhostButton: React.FC<ButtonProps> = (props) => (
  <Button {...props} variant="ghost" />
);

// Size variants
export const SmallButton: React.FC<ButtonProps> = (props) => (
  <Button {...props} size="small" />
);

export const LargeButton: React.FC<ButtonProps> = (props) => (
  <Button {...props} size="large" />
);

// Specialized buttons
export const ActionButton: React.FC<ButtonProps> = (props) => (
  <Button
    {...props}
    variant="primary"
    size="large"
    gradient={true}
    pulseOnPress={true}
    enableGlow={true}
  />
);

export const IconButton: React.FC<ButtonProps & { icon: React.ReactNode }> = ({
  icon,
  ...props
}) => (
  <Button
    {...props}
    icon={icon}
    variant="secondary"
    size="medium"
    contentDirection="column"
  />
);
