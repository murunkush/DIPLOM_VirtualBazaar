"use client";

import Navbar from "./navbar";

type Props = {
  user: {
    username: string;
    email: string;
  };
};

export default function NavbarWrapper({ user }: Props) {
  return <Navbar user={user} />;
}