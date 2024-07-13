"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useProductStore } from "../store/getUserFromCookie";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, ShoppingCart, Heart, Mountain } from "lucide-react";

async function fetchProfileUser() {
  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }
  try {
    const response = await fetch("http://localhost:8080/api/user", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return;
  }
}

const NavBar = () => {
  const router = useRouter();

  const logoutState = useProductStore((state) => state.logoutState);
  const setUser = useProductStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);
  const logout = () => {
    localStorage.removeItem("token");
    router.push('/');
    logoutState();
  };

  useEffect(() => {
    (async () => {
      const profile = await fetchProfileUser();
      setUser(profile);
      setLoading(false);
    })();
  }, [setUser]);

  const user = useProductStore((state) => state.user);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-6 w-6" />
      </div>
    )
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-background shadow-md z-50 px-4 md:px-6 h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <Mountain className="w-6 h-6" />
        <span className="sr-only">Home</span>
      </Link>
      <div className="flex items-center gap-4">
        {isClient && user && user.isAdmin && (
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        )}
        <Link href="/orders">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="w-5 h-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        </Link>
        <Link href="/cart">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ShoppingCart className="w-5 h-5" />
            <span className="sr-only">Cart</span>
          </Button>
        </Link>
        <Link href="/whishlist">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Heart className="w-5 h-5" />
            <span className="sr-only">Wishlist</span>
          </Button>
        </Link>
        {isClient && user ? (
          <Button variant="outline" onClick={logout}>
            Log Out
          </Button>
        ) : (
          isClient && (
            <Link href="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
          )
        )}
      </div>
    </header>
  );
};

export default NavBar;
