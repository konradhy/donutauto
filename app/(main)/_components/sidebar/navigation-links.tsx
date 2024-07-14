"use client";

import {
  Home,
  PieChart,
  Users,
  Calendar,
  Settings,
  HelpCircle,
  LucideIcon,
  Plus,
  Building,
  Group,
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
    link: "/customers/list",
    name: "customers",
  },
  {
    title: "Campaigns",
    icon: Calendar,
    variant: "ghost",
    link: "/campaigns",
    name: "campaigns",
  },
  {
    title: "New Customer",
    icon: Plus,
    variant: "ghost",
    link: "/customers/add",
    name: "new-customer",
  },
  {
    title: "Multi Customer Upload",
    icon: Group,
    variant: "ghost",
    link: "/customers/bulk-upload",
    name: "bulk-upload",
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
    title: "Organization",
    icon: Building,
    variant: "ghost",
    link: "/organization",
    name: "organization",
  },
  {
    title: "Help",
    icon: HelpCircle,
    variant: "ghost",
    link: "/help",
    name: "help",
  },
];
