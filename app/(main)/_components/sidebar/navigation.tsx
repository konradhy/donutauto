"use client";
import { usePathname } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  ChevronsLeft,
  GripVertical,
  MenuIcon,
  Bot,
  Sword,
  Shield,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { NavLink, initialTopLinks } from "./navigation-links";
import { Separator } from "@/components/ui/separator";
import { Nav } from "./nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
//import { useSearch } from "@/hooks/use-search";
import { ThemeToggle } from "@/components/theme-toggle";

export const Navigation = () => {
  const router = useRouter();
  //hooks
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  //const { isOpen, onClose, onOpen } = useSearch();

  //refs
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [isIconised, setIsIconised] = useState(false);

  //mutations
  //const createBattle = useMutation(api.battle.createBattle);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]); //ignore warning. The refs we are working with aren't reactive in the way that the useEffect hook is expecting.

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  //functions
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 100) newWidth = 100;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`,
      );
    }

    if (newWidth < 160) {
      setIsIconised(true);
    } else {
      setIsIconised(false);
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)",
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const [topLinks, setTopLinks] = useState(initialTopLinks);

  useEffect(() => {
    const updateLinkVariants = (links: NavLink[]) => {
      return links.map((link) => ({
        ...link,
        variant:
          link.name && pathname.includes(link.name) ? "default" : "ghost",
      }));
    };

    // @ts-expect-error Variants are correctly set in updateLinkVariants
    setTopLinks(updateLinkVariants(initialTopLinks));
  }, [pathname]);

  const handleCreateBattle = async () => {
    try {
      // const id = await createBattle();
      // router.push(`/dashboard/${id}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full  overflow-y-auto relative flex w-60 flex-col z-[99999] ",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0",
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100",
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>

        <nav className="mt-4 ">
          <TooltipProvider>
            <Nav isCollapsed={isIconised} links={topLinks} />
            <Separator />
            <Nav
              isCollapsed={isIconised}
              links={[
                {
                  title: "Create Battle",
                  icon: Shield,
                  variant: "ghost",
                  // onClick: handleCreateBattle,
                },
                {
                  title: "Join Battle",
                  icon: Sword,
                  variant: "ghost",
                  // onClick: onOpen,
                },
              ]}
            />
            <div
              className={`flex items-center ${isIconised ? "justify-center" : "justify-start"} px-4`}
            >
              <ThemeToggle />
            </div>
          </TooltipProvider>
        </nav>

        <div
          className="flex flex-row-reverse"
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
        >
          <div className="group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 right-0 top-0">
            <div className=" group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-[1px] bg-primary/40 right-0 top-0 " />
          </div>
          <GripVertical className="h-6 w-6 group-hover/sidebar transition cursor-ew-resize   " />
        </div>
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full",
        )}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon
              onClick={resetWidth}
              role="button"
              className="h-6 w-6 text-muted-foreground"
            />
          )}
        </nav>
      </div>
    </>
  );
};
