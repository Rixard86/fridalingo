import { HomeScreen } from "@/components/home/HomeScreen";
import { RequireLogin } from "@/components/RequireLogin";

export default function Home() {
  return (
    <RequireLogin>
      <HomeScreen />
    </RequireLogin>
  );
}
