"use client";

import { useState, useEffect } from "react"; // ✅ added useEffect
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { AnimatePresence, motion } from "framer-motion";

import {
  FiHome,
  FiBarChart2,
  FiSettings,
  FiChevronRight,
  FiUsers,
  FiCheckSquare,
  FiUser,
  FiShield,
} from "react-icons/fi";

import { FaArrowLeftLong } from "react-icons/fa6";

type SidebarSheetProps = {
  children: React.ReactNode;
};

type MenuItem = {
  label: string;
  href?: string;
  icon: React.ReactNode;
  disabled?: boolean;
  adminOnly?: boolean;
  children?: {
    label: string;
    href: string;
    disabled?: boolean;
    adminOnly?: boolean;
  }[];
};

const menu: MenuItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <FiHome />,
  },
  {
    label: "Dashboard",
    icon: <FiBarChart2 />,
    children: [
      { label: "Overview", href: "/dashboard" },
      { label: "Analytics", href: "/dashboard/analytics" },
    ],
  },
  {
    label: "Tasks",
    icon: <FiCheckSquare />,
    children: [
      { label: "All Tasks", href: "/dashboard/tasks" },
      { label: "Kanban", href: "/dashboard/tasks/kanban", disabled: true },
    ],
  },
  {
    label: "Team",
    icon: <FiUsers />,
    children: [
      { label: "Members", href: "/dashboard/members", disabled: false },
      { label: "Roles", href: "/team/", disabled: true },
    ],
  },
  {
    label: "Account",
    icon: <FiUser />,
    children: [
      { label: "Profile", href: "/dashboard/profile" },
      { label: "Settings", href: "/dashboard/settings", disabled: true },
    ],
  },
  {
    label: "Admin",
    icon: <FiShield />,
    adminOnly: false,
    children: [
      { label: "Manage Users", href: "/dashboard/admin" },
      { label: "Platform Stats", href: "/dashboard/admin#stats" },
    ],
  },
  {
    label: "Settings",
    icon: <FiSettings />,
    children: [
      { label: "General", href: "/settings/general", disabled: true },
      { label: "Security", href: "/settings/security", disabled: true },
    ],
  },
];

export default function SidebarSheet({ children }: SidebarSheetProps) {
  const user = useAuthStore((s) => s.user);
  const isAdmin = (user as { role?: string } | null)?.role === "admin";

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false); // ✅ controlled open state

  // ✅ lock body scroll when sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggle = (index: number) =>
    setOpenIndex(openIndex === index ? null : index);

  const visibleMenu = menu.filter((item) => !item.adminOnly || isAdmin);

  return (
    // ✅ controlled — open + onOpenChange wired up
    <Sheet modal={false} open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        side="left"
        className="w-80 p-6 bg-card overflow-hidden [&>button]:hidden"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="h-full flex flex-col"
          >

            {/* BACK BUTTON */}
            <div className="flex justify-end mb-6">
              <SheetClose asChild>
                <button className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                  <FaArrowLeftLong className="text-2xl" />
                </button>
              </SheetClose>
            </div>

            {/* HEADER */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Navigation Hub</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Operational command structure
              </p>

              {/* USER PILL */}
              {user && (
                <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                  <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-xs font-semibold text-indigo-700 shrink-0">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  {isAdmin && (
                    <span className="ml-auto text-[9px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-1.5 py-0.5 rounded font-semibold shrink-0">
                      ADMIN
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* MENU */}
            <div className="flex-1 overflow-y-auto space-y-1">
              {visibleMenu.map((item, index) => {
                const isOpen = openIndex === index;
                const subItems = item.children ?? [];

                return (
                  <div key={item.label}>

                    {/* MAIN ROW */}
                    <div
                      onClick={() => !item.disabled && toggle(index)}
                      className={`flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${item.disabled
                          ? "opacity-40 cursor-not-allowed"
                          : "cursor-pointer hover:bg-muted/60"
                        }`}
                    >
                      <div className="flex items-center gap-3 text-sm font-medium">
                        <span className="text-xl text-muted-foreground">
                          {item.icon}
                        </span>

                        {item.href && !item.children ? (
                          <SheetClose asChild>
                            <Link
                              href={item.href}
                              className="hover:text-foreground transition-colors"
                            >
                              {item.label}
                            </Link>
                          </SheetClose>
                        ) : (
                          <span>{item.label}</span>
                        )}

                        {item.adminOnly && (
                          <span className="text-[9px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-1.5 py-0.5 rounded font-semibold">
                            ADMIN
                          </span>
                        )}
                      </div>

                      {item.children && (
                        <motion.span animate={{ rotate: isOpen ? 90 : 0 }}>
                          <FiChevronRight className="text-base text-muted-foreground" />
                        </motion.span>
                      )}
                    </div>

                    {/* SUB ITEMS */}
                    <AnimatePresence>
                      {isOpen && subItems.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-8 mt-1 space-y-1 overflow-hidden border-l pl-4"
                        >
                          {subItems.map((child) => (
                            <div
                              key={child.label}
                              className={`text-sm py-2 px-3 rounded-lg transition-colors ${child.disabled
                                  ? "opacity-40 cursor-not-allowed text-muted-foreground"
                                  : "hover:bg-muted/60 cursor-pointer"
                                }`}
                            >
                              {child.disabled ? (
                                <span className="flex items-center justify-between">
                                  {child.label}
                                  <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                                    Soon
                                  </span>
                                </span>
                              ) : (
                                <SheetClose asChild>
                                  <Link
                                    href={child.href}
                                    className="block w-full hover:text-foreground transition-colors"
                                  >
                                    {child.label}
                                  </Link>
                                </SheetClose>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                );
              })}
            </div>

            {/* FOOTER */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">
                AdminHub · Built by{" "}
                <Link
                  href="https://adeoluwaadeoye.netlify.app"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Adeoluwa Adeoye
                </Link>
              </p>
            </div>

          </motion.div>
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}