import { PracticeScreen } from "@/components/practice/PracticeScreen";
import { RequireLogin } from "@/components/RequireLogin";

export default function PracticePage() {
  return (
    <RequireLogin>
      <PracticeScreen />
    </RequireLogin>
  );
}
