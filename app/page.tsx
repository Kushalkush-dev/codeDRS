import { Button } from "@/components/ui/button";
import Logout from "@/modules/auth/components/Logout";
import { requireAuth } from "@/modules/auth/utils/auth-utils";

export default async function Home() {
  await requireAuth();
  return (
    <div className="flex h-screen w-screen justify-center items-center">

      <Logout>

        <Button className="w-50 h-10">
          Logout
        </Button>
      </Logout>

    </div>
  );
}
