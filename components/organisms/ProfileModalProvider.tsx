"use client";

import { createContext, useCallback, useContext, useState } from "react";
import {
  ProfileModal,
  type ProfileUser,
} from "@/components/organisms/ProfileModal";

interface ProfileModalContextValue {
  open: boolean;
  openProfile: () => void;
  closeProfile: () => void;
}

const ProfileModalContext = createContext<ProfileModalContextValue>({
  open: false,
  openProfile: () => {},
  closeProfile: () => {},
});

function useProfileModal() {
  return useContext(ProfileModalContext);
}

function ProfileModalProvider({
  user,
  children,
}: {
  user?: ProfileUser | null;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const openProfile = useCallback(() => setOpen(true), []);
  const closeProfile = useCallback(() => setOpen(false), []);

  return (
    <ProfileModalContext.Provider value={{ open, openProfile, closeProfile }}>
      {children}
      {open && <ProfileModal user={user} onClose={closeProfile} />}
    </ProfileModalContext.Provider>
  );
}

export { ProfileModalProvider, useProfileModal };
