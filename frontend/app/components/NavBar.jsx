"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useProductStore } from "../store/getUserFromCookie";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import MobileNavbar from "./MobileNavbar";
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
  const router = useRouter()

  const logoutState = useProductStore((state) => state.logoutState);
  const setUser = useProductStore((state) => state.setUser);
  const logout = () => {
    localStorage.removeItem("token");
    router.push('/')
    logoutState();
  };

  useEffect(() => {
    (async () => {
      const profile = await fetchProfileUser();
      setUser(profile);
    })();
  }, [setUser]);

  const user = useProductStore((state) => state.user);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="w-full">
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4">
        <Link
          href="/"
          className="flex justify-center items-center text-white font-bold"
        >
          <Image
            src="/logo.svg"
            alt="MyShop logo"
            width={38}
            height={38}
            className="object-contain"
          />
          MyShop
        </Link>
        {isClient && user && user.isAdmin ?(  <Link
              href="/dashboard">
              <Button>
                Dashboard
              </Button>
            </Link>) : (<></>)}
        {isClient && user ? (
          <>
          <MobileNavbar />
          <div className="hidden md:flex lg:flex gap-4 text-xl font- items-center">
          <Link
              href="/cart">
              <Button>
                My cart
              </Button>
            </Link>
            <Link
              href="/whishlist">
              <Button>
                My whishlist
              </Button>
            </Link>
            <Button className="font-bold"
              onClick={logout}
            >
              Log Out
            </Button>
          </div></>
        ) : (
          isClient && (
            <Link href="/auth">
              <Button className="font-bold">
                Sing In
              </Button>
            </Link>
          )
        )}
      </nav>
    </header>
  );
};

export default NavBar;
