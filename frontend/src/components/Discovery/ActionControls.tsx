"use client";

import React from "react";
import { Row, IconButton } from "@/components/OnceUI";

interface ActionControlsProps {
  onPass: () => void;
  onLike: () => void;
  disabled?: boolean;
}

export const ActionControls: React.FC<ActionControlsProps> = ({ onPass, onLike, disabled = false }) => {
  return (
    <Row fillWidth justify="center" align="center" gap="24" padding="16">
      <IconButton
        icon={<span>✕</span>} // Placeholder for a standard X icon
        variant="secondary"
        size="l"
        onClick={onPass}
        disabled={disabled}
        tooltip="Pass"
        style={{
          borderRadius: "50%",
          width: "64px",
          height: "64px",
          color: "var(--color-danger)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      />
      <IconButton
        icon={<span>♥</span>} // Placeholder for a standard Heart icon
        variant="primary"
        size="l"
        onClick={onLike}
        disabled={disabled}
        tooltip="Like"
        style={{
          borderRadius: "50%",
          width: "64px",
          height: "64px",
          color: "var(--color-success)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      />
    </Row>
  );
};
