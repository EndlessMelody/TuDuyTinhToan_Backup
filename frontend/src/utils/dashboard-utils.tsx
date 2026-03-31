import React from "react";
import { Sun, UtensilsCrossed, Coffee, Wine, Moon } from "lucide-react";

import { ContextOption } from "@/types/dashboard";

export function getDynamicContext(): ContextOption {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) {
    return {
      title: "Morning Energy Boost",
      icon: <Sun size={20} color="#FBBF24" />,
      accent: "#FBBF24",
      tags: ["Breakfast", "Coffee", "Juice Bar", "Bakery"],
    };
  } else if (hour >= 11 && hour < 15) {
    return {
      title: "Lunch Power-Up",
      icon: <UtensilsCrossed size={20} color="#F97316" />,
      accent: "#F97316",
      tags: ["Rice", "Noodles", "Quick Bites", "Healthy"],
    };
  } else if (hour >= 15 && hour < 19) {
    return {
      title: "Afternoon Chill & Snacks",
      icon: <Coffee size={20} color="#A78BFA" />,
      accent: "#A78BFA",
      tags: ["Cafe", "Dessert", "Boba", "Chill Spots"],
    };
  } else if (hour >= 19 && hour < 22) {
    return {
      title: "Dinner & Unwind",
      icon: <Wine size={20} color="#F472B6" />,
      accent: "#F472B6",
      tags: ["BBQ", "Hotpot", "Fine Dining", "Rooftop"],
    };
  } else {
    return {
      title: "Dĩ An Late Night Cravings",
      icon: <Moon size={20} color="#60A5FA" />,
      accent: "#60A5FA",
      tags: ["Street Food", "24h Spots", "Ramen", "Midnight Snacks"],
    };
  }
}
