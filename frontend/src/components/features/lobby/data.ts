import type { LobbyData } from "./types";

/**
 * Mock lobby sessions used for development and demo purposes.
 * In production, this would be replaced by a real-time API call.
 */
export const MOCK_LOBBIES: LobbyData[] = [
  {
    name: "Spicy Noodle Challenge",
    route: "District 1 Mapping",
    time: "Tonight at 8 PM",
    spots: 4,
    bg: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&h=320&fit=crop",
    accent: "#ED1B24",
    members: [
      {
        name: "Ramona",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop",
        ready: true,
      },
      {
        name: "Khoa",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop",
        ready: true,
      },
      {
        name: "Linh",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop",
        ready: false,
      },
    ],
  },
  {
    name: "Coffee Lovers",
    route: "Hidden cafes tour",
    time: "Tomorrow at 9 AM",
    spots: 6,
    bg: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&h=320&fit=crop",
    accent: "#F59E0B",
    members: [
      {
        name: "Tran",
        avatar:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop",
        ready: true,
      },
      {
        name: "Vy",
        avatar:
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop",
        ready: true,
      },
      {
        name: "Minh",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop",
        ready: false,
      },
      {
        name: "Bao",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop",
        ready: false,
      },
      {
        name: "Duc",
        avatar:
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=64&h=64&fit=crop",
        ready: false,
      },
    ],
  },
];
