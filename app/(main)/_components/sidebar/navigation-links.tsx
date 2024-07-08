"use client";

import {
  Home,
  PieChart,
  Users,
  Calendar,
  Settings,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

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

export const initialTopLinks: NavLink[] = [
  {
    title: "Dashboard",
    icon: Home,
    variant: "default",
    link: "/dashboard",
    name: "dashboard",
  },
  {
    title: "Analytics",
    icon: PieChart,
    variant: "ghost",
    link: "/analytics",
    name: "analytics",
  },
  {
    title: "Customers",
    icon: Users,
    variant: "ghost",
    link: "/customers",
    name: "customers",
  },
  {
    title: "Campaigns",
    icon: Calendar,
    variant: "ghost",
    link: "/campaigns",
    name: "campaigns",
  },
];

export const bottomLinks: NavLink[] = [
  {
    title: "Settings",
    icon: Settings,
    variant: "ghost",
    link: "/settings",
    name: "settings",
  },
  {
    title: "Help",
    icon: HelpCircle,
    variant: "ghost",
    link: "/help",
    name: "help",
  },
];
