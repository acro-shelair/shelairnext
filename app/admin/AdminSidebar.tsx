"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "./actions";
import {
  FileText,
  Users,
  Wrench,
  Building2,
  Tag,
  DollarSign,
  FolderOpen,
  Briefcase,
  MessageSquare,
  Inbox,
  HelpCircle,
  LogOut,
  ExternalLink,
  UserCircle,
  ScrollText,
  Settings2,
  MapPin,
  Home,
  SlidersHorizontal,
  BookMarked,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import shelairLogo from "@/assets/shelair-logo-web.png";
import type { UserProfile, PermissionKey } from "@/lib/rbac";
import { Badge } from "@/components/ui/badge";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  permission?: PermissionKey | "admin_only";
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Content",
    items: [
      { label: "Home Page",   href: "/admin/home",       icon: Home,      permission: "home" },
      { label: "Posts",       href: "/admin/posts",      icon: FileText,  permission: "posts" },
      { label: "Services",    href: "/admin/services",   icon: Wrench,    permission: "services" },
      { label: "Industries",  href: "/admin/industries", icon: Building2, permission: "industries" },
      { label: "Brands",      href: "/admin/brands",     icon: Tag,       permission: "brands" },
      { label: "Projects",    href: "/admin/projects",   icon: Briefcase, permission: "projects" },
      { label: "Locations",   href: "/admin/locations",  icon: MapPin,    permission: "locations" },
    ],
  },
  {
    label: "Engage",
    items: [
      { label: "Messages",     href: "/admin/messages",     icon: Inbox,       permission: "messages" },
      { label: "Pricing",      href: "/admin/pricing",      icon: DollarSign,  permission: "pricing" },
      { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare, permission: "testimonials" },
      { label: "FAQs",         href: "/admin/faqs",         icon: HelpCircle,  permission: "faqs" },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Employee Portal", href: "/admin/portal", icon: BookMarked },
      { label: "Users",           href: "/admin/users",  icon: Users, permission: "admin_only" },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Legal Pages",  href: "/admin/legal",        icon: ScrollText,      permission: "legal" },
      { label: "Settings",     href: "/admin/settings",     icon: SlidersHorizontal, permission: "settings" },
      { label: "Logs",         href: "/admin/logs",         icon: FileText,        permission: "logs" },
      { label: "Maintenance",  href: "/admin/maintenance",  icon: Settings2,       permission: "maintenance" },
    ],
  },
];

function canSeeItem(item: NavItem, profile: UserProfile): boolean {
  if (profile.role === "admin") return true;
  if (item.permission === "admin_only") return false;
  if (!item.permission) return true;
  return profile.permissions.includes(item.permission);
}

function visibleGroups(profile: UserProfile): NavGroup[] {
  return navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canSeeItem(item, profile)),
    }))
    .filter((group) => group.items.length > 0);
}

export default function AdminSidebar({
  userEmail,
  profile,
}: {
  userEmail: string;
  profile: UserProfile;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    await signOutAction();
    router.push("/admin/login");
    router.refresh();
  };

  const groups = visibleGroups(profile);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = (label: string) =>
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-950 border-b border-zinc-800 flex items-center gap-3 px-4 h-14">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Image
            src={shelairLogo}
            alt="Shelair"
            width={28}
            height={28}
            className="rounded-full flex-shrink-0"
          />
          <p className="text-white font-semibold text-sm leading-none">Admin Panel</p>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={closeMobile}
        />
      )}

    <aside className={`fixed inset-y-0 left-0 w-60 bg-zinc-950 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Image
            src={shelairLogo}
            alt="Shelair"
            width={36}
            height={36}
            className="rounded-full flex-shrink-0"
          />
          <div className="flex-1">
            <p className="text-white font-semibold text-sm leading-none">
              Shelair
            </p>
            <p className="text-zinc-500 text-xs mt-0.5">Admin Panel</p>
          </div>
          <button
            onClick={closeMobile}
            className="md:hidden p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600">
        {groups.map((group) => {
          const isCollapsed = !!collapsed[group.label];
          return (
            <div key={group.label}>
              <button
                onClick={() => toggle(group.label)}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-zinc-800/50 transition-colors group"
              >
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400">
                  {group.label}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-transform duration-200 ${
                    isCollapsed ? "-rotate-90" : ""
                  }`}
                />
              </button>

              {!isCollapsed && (
                <div className="space-y-0.5 mt-0.5 mb-2">
                  {group.items.map(({ label, href, icon: Icon }) => {
                    const active = pathname.startsWith(href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={closeMobile}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          active
                            ? "bg-primary text-white"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-zinc-800 space-y-0.5">
        {/* Profile link (employees) */}
        {profile.role === "employee" && (
          <Link
            href="/admin/profile"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              pathname === "/admin/profile"
                ? "bg-primary text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <UserCircle className="w-4 h-4 flex-shrink-0" />
            My Profile
          </Link>
        )}

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          View Site
        </Link>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
        <div className="px-3 pt-3 space-y-1">
          <p className="text-xs text-zinc-600 truncate">{userEmail}</p>
          <Badge
            variant={profile.role === "admin" ? "default" : "secondary"}
            className="text-xs"
          >
            {profile.role === "admin" ? "Administrator" : "Employee"}
          </Badge>
        </div>
      </div>
    </aside>
    </>
  );
}
