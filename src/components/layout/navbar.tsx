import { Menu } from "lucide-react";
import Link from "next/link";
import type { HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import type { Session } from "@/lib/auth";
import { LogInButton } from "../auth/log-in-button";
import { LogOutButton } from "../auth/log-out-button";
import { SignUpButton } from "../auth/sign-up-button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

interface NavbarProps {
  session: Session | null;
}

export function Navbar({ session }: NavbarProps) {
  return (
    <header>
      <div className="container flex justify-between py-2 items-center">
        <div className="flex gap-4 items-center">
          <Link className={"text-2xl font-bold"} href="/">
            OWTV Test App
          </Link>
          <div className="flex items-center gap-2">
          <Link href="/teams">Teams</Link>
          <Link href="/admin">Admin</Link>
          </div>
        </div>

        <MobileMenu session={session} className="md:hidden" />
        <div className="max-md:hidden flex gap-2 items-center">
          <MenuButtons session={session} />
        </div>
      </div>
    </header>
  );
}

function MobileMenu({
  session,
  ...props
}: HTMLAttributes<HTMLDivElement> & NavbarProps) {
  console.debug("navbar.tsx:43 > session", session);

  return (
    <div {...props}>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu aria-label="Toggle Menu" className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="p-6">
          <SheetTitle>Todo List App</SheetTitle>
          <SheetDescription aria-describedby={undefined} />
          <nav className="grid gap-2 ">
            <MenuButtons session={session} />
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function MenuButtons({ session }: NavbarProps) {
  if (!session?.user) {
    return (
      <>
        <LogInButton>Log In</LogInButton>
        <SignUpButton variant="secondary">Sign Up</SignUpButton>
      </>
    );
  }

  return (
    <>
      <LogOutButton />
      <Avatar>
        <AvatarImage src={session.user.image ?? ""} />
        <AvatarFallback>
          {/* Show first two letters of email as fallback */}
          {session.user.email?.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </>
  );
}
