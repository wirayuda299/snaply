import type { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function getAllUsers() {
      try {
        const res = await fetch("/api/user");
        const allUsers = await res.json();
        setUsers(allUsers);
      } catch (error) {
        toast("Something went wrong");
      }
    }

    getAllUsers();
  }, []);

  return { users };
}
