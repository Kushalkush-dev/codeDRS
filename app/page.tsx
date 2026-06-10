import { Button } from "@/components/ui/button";
import { requireAuth } from "@/modules/auth/utils/auth-utils";

export default async function Home() {
  await requireAuth();
  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <Button className="w-50 h-10">Click me</Button>

    </div>
  );
}
