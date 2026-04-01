/**
 * Lobby Feature — TypeScript Definitions
 * Defines the shape of a lobby session, its participants, and their status.
 */

/** Represents a single member within a lobby session. */
export interface LobbyMember {
  /** Display name */
  name: string;
  /** Avatar image URL */
  avatar: string;
  /** Whether the member has confirmed readiness */
  ready: boolean;
}

/** The readiness status of a lobby session. */
export type LobbyStatus = "waiting" | "full" | "in-progress";

/** Represents a group lobby session. */
export interface LobbyData {
  /** Lobby title / challenge name */
  name: string;
  /** Route or tour description */
  route: string;
  /** Scheduled time */
  time: string;
  /** Maximum participants */
  spots: number;
  /** Background image URL */
  bg: string;
  /** Accent color (hex) used for theming */
  accent: string;
  /** Current participants */
  members: LobbyMember[];
}

/** Props for a single lobby card component. */
export interface LobbyCardProps {
  lobby: LobbyData;
  onClick: () => void;
}

/** Props for the lobby detail modal. */
export interface LobbyModalProps {
  lobby: LobbyData;
  onClose: () => void;
}

/** Props for the lobby section container. */
export interface LobbySectionProps {
  /** Optional initial lobby data. Falls back to internal mock data if omitted. */
  lobbies?: LobbyData[];
}
