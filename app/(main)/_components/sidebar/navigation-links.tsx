"use client";

import { Home, LucideIcon } from "lucide-react";

export interface NavLink {
  title: string;
  label?: string;
  icon: LucideIcon;
  variant: "default" | "ghost";
  onClick?: () => void;
  link?: string;
  hotkey?: string;
  name?: string;
}

export let initialTopLinks: NavLink[] = [
  {
    title: "Home",
    icon: Home,
    variant: "default",
    link: "/dashboard",
    name: "dashboard",
  },
];
