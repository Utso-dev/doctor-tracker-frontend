import { useEffect, useState } from "react";
import { UserService } from "../service/user/user.service";

/**
 * Return user details from server in component
 */
export function useUser(context = null) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      setLoading(true);
      const res = await UserService.getUserDetails({ context });
      if (res.data?.success || res.data?.status === "success") {
        setUser(res.data.data?.user || res.data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return { user, loading, refetch: getUser };
}
