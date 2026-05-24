"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Container from "./Container";

export default function Navbar() {
  const { user, signIn, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-cream/60 bg-cream/90 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="WanderWall" width={36} height={36} />
          <div>
            <p className="text-lg font-semibold text-charcoal">WanderWall</p>
            <p className="text-xs text-charcoal/70">Wall-to-wall discovery</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-charcoal/80 md:flex">
          <Link href="/submit" className="hover:text-charcoal">
            Pin an event
          </Link>
          <Link href="/advertise" className="hover:text-charcoal">
            Advertise
          </Link>
          <Link href="/profile" className="hover:text-charcoal">
            Profile
          </Link>
        </nav>
        {user ? (
          <Button variant="ghost" onClick={signOut}>
            Sign out
          </Button>
        ) : (
          <Button onClick={signIn}>Sign in with Google</Button>
        )}
      </Container>
    </header>
  );
}
