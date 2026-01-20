import React from "react";
import { GlassInput, GlassInputProps } from "./Glass/GlassInput";

export interface InputProps extends GlassInputProps {
  // Add any legacy props that need to be maintained
}

export const Input: React.FC<InputProps> = ({ ...props }) => {
  return (
    <GlassInput
      variant="outlined"
      size="medium"
      material="regular"
      enableGlow={true}
      enableReflection={true}
      animated={true}
      clearable={true}
      {...props}
    />
  );
};

// Export common input variants
export const OutlineInput: React.FC<InputProps> = (props) => (
  <Input {...props} variant="outlined" />
);

export const FilledInput: React.FC<InputProps> = (props) => (
  <Input {...props} variant="filled" />
);

export const UnderlineInput: React.FC<InputProps> = (props) => (
  <Input {...props} variant="underlined" />
);

export const BorderlessInput: React.FC<InputProps> = (props) => (
  <Input {...props} variant="borderless" />
);

// Size variants
export const SmallInput: React.FC<InputProps> = (props) => (
  <Input {...props} size="small" />
);

export const LargeInput: React.FC<InputProps> = (props) => (
  <Input {...props} size="large" />
);

// Specialized inputs
export const SearchInput: React.FC<InputProps> = (props) => (
  <Input
    {...props}
    variant="filled"
    material="light"
    borderRadius="full"
    clearable={true}
    enableGlow={true}
    placeholder="Search..."
    leftIcon={<SearchIcon />}
  />
);

export const LocationInput: React.FC<InputProps> = (props) => (
  <Input
    {...props}
    variant="outlined"
    material="frosted"
    enableGlow={true}
    enableReflection={true}
    fullWidth={true}
    placeholder="Enter location..."
    leftIcon={<LocationIcon />}
  />
);

export const FloatingInput: React.FC<InputProps> = (props) => (
  <Input
    {...props}
    variant="filled"
    material="crystal"
    shadowType="heavy"
    enableFocusScale={true}
    focusScale={1.02}
    enableReflection={true}
  />
);

// Simple icon components for inputs
const SearchIcon = () => <span style={{ fontSize: 16, opacity: 0.7 }}>🔍</span>;

const LocationIcon = () => (
  <span style={{ fontSize: 16, opacity: 0.7 }}>📍</span>
);
