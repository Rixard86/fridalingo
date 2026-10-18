import { ReviewLesson } from "@/components/lesson/ReviewLesson";
import { RequireLogin } from "@/components/RequireLogin";

export default function ReviewPage() {
  return (
    <RequireLogin>
      <ReviewLesson />
    </RequireLogin>
  );
}
