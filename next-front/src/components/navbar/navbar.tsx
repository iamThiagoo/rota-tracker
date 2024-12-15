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
            <Link href="/driver" legacyBehavior passHref>
              <NavigationMenuLink className="text-white hover:opacity-80">
                Iniciar Viagem
              </NavigationMenuLink>
            </Link>
            <Link href="/admin" legacyBehavior passHref>
              <NavigationMenuLink className="text-white hover:opacity-80">
                Área Admin
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }
  
  export default Navbar;
  