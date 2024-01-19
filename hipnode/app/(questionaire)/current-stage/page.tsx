import Contents from "@/components/shared/Contents/Contents";
import { userCurrentStage } from "@/constants/questionaire";

export default function CurrentStage() {
  return (
    <Contents
      path="/programming-level"
      position="right"
      bg="bg-white dark:bg-secondary-dark-2"
      cardBg="bg-white-800 dark:bg-primary-dark"
      contents={userCurrentStage}
      title="Which best describes the stage you're at right now?"
    />
  );
}
