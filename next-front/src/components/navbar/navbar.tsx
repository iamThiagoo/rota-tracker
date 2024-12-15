import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu";
  import Link from "next/link";
  
  export function Navbar() {
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="flex gap-x-5">
            <Link href="/new-route" legacyBehavior passHref>
              <NavigationMenuLink className="text-white hover:opacity-80">
                Nova Rota
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }
  
  export default Navbar;
  