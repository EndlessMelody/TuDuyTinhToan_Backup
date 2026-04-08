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

/** Category of the lobby experience. */
export type LobbyCategory =
  | "Food Challenge"
  | "Coffee Tour"
  | "Street Food"
  | "Hidden Gems"
  | "Night Market"
  | "Brunch"
  | "Ramen Hunt"
  | "Dessert Crawl";

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
  /** Category tag */
  category?: LobbyCategory;
  /** Short description */
  description?: string;
  /** Tags for filtering */
  tags?: string[];
  /** Host info */
  host?: { name: string; avatar: string };
  /** Current status */
  status?: LobbyStatus;
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
