import { Goose, type GooseMood } from "./Goose";

const MOOD_ANIMATIONS: Record<GooseMood, string> = {
  happy: "animate-goose-bob",
  cheer: "animate-goose-jump",
  sad: "animate-goose-shake",
  think: "animate-goose-bob",
};

interface GooseSaysProps {
  message: string;
  mood?: GooseMood;
  outfit?: string | null;
}

export function GooseSays({ message, mood = "happy", outfit = null }: GooseSaysProps) {
  return (
    <div className="flex items-end gap-3">
      <Goose mood={mood} outfit={outfit} className={`w-28 shrink-0 ${MOOD_ANIMATIONS[mood]}`} />
      <div className="relative mb-10 animate-pop-in rounded-2xl border-2 border-swan bg-white px-4 py-3 text-lg font-bold">
        <span className="absolute -left-2 bottom-4 h-4 w-4 rotate-45 border-b-2 border-l-2 border-swan bg-white" />
        {message}
      </div>
    </div>
  );
}
