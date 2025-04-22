"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Film, MapPin, Ticket, User, LayoutDashboard } from "lucide-react";
import { Button } from "~/components/ui/button";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isAdmin = session?.user.role === "ADMIN";
  const isLoggedIn = status === "authenticated";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-xl font-bold text-purple-700">
              <Ticket className="mr-2 h-6 w-6" />
              BookEZ
            </Link>

            {/* Desktop Navigation */}
            <div className="ml-10 hidden space-x-8 md:flex">
              <NavLink href="/" active={isActive('/')}>Home</NavLink>
              <NavLink href="/movies" active={isActive('/movies')}>
                <Film className="mr-1 h-4 w-4" />
                Movies
              </NavLink>
              <NavLink href="/theaters" active={isActive('/theaters')}>
                <MapPin className="mr-1 h-4 w-4" />
                Theaters
              </NavLink>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            {status === "loading" ? (
              <div className="h-10 w-20 animate-pulse rounded bg-gray-100"></div>
            ) : isLoggedIn ? (
              <>
                <NavLink 
                  href={isAdmin ? "/admin" : "/dashboard"} 
                  active={isActive(isAdmin ? '/admin' : '/dashboard')}
                >
                  <LayoutDashboard className="mr-1 h-4 w-4" />
                  {isAdmin ? "Admin Dashboard" : "My Bookings"}
                </NavLink>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {session.user.name}
                  </span>
                  <Link href="/auth/signout">
                    <Button variant="outline" size="sm">Sign out</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline">Sign in</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu} 
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t md:hidden">
          <div className="container space-y-1 px-4 py-3">
            <MobileNavLink href="/" active={isActive('/')}>Home</MobileNavLink>
            <MobileNavLink href="/movies" active={isActive('/movies')}>
              <Film className="mr-2 h-4 w-4" />
              Movies
            </MobileNavLink>
            <MobileNavLink href="/theaters" active={isActive('/theaters')}>
              <MapPin className="mr-2 h-4 w-4" />
              Theaters
            </MobileNavLink>
            
            {isLoggedIn && (
              <MobileNavLink 
                href={isAdmin ? "/admin" : "/dashboard"}
                active={isActive(isAdmin ? '/admin' : '/dashboard')}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {isAdmin ? "Admin Dashboard" : "My Bookings"}
              </MobileNavLink>
            )}
            
            <div className="mt-3 space-y-2 border-t pt-3">
              {isLoggedIn ? (
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-gray-500" />
                    <span>{session.user.name}</span>
                  </div>
                  <Link href="/auth/signout">
                    <Button className="w-full" variant="outline">Sign out</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Link href="/auth/signin">
                    <Button className="w-full" variant="outline">Sign in</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Desktop Navigation Link
function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`flex items-center px-1 py-2 text-sm font-medium ${
        active ? "text-purple-700" : "text-gray-600 hover:text-purple-700"
      }`}
    >
      {children}
    </Link>
  );
}

// Mobile Navigation Link
function MobileNavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`flex items-center rounded-md px-3 py-2.5 text-sm font-medium ${
        active ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </Link>
  );
}
