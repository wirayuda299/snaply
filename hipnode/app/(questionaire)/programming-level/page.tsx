import Contents from "@/components/shared/Contents/Contents";
import { programmingLevels } from "@/constants/questionaire";

export default function ProgrammingLevel() {
  return (
    <section className=" size-full">
      <Contents
        path="/interest"
        position="right"
        bg="bg-white dark:bg-primary-dark"
        cardBg="bg-white-800 dark:bg-secondary-dark-2 "
        contents={programmingLevels}
        title="Do you know how to code?"
      />
    </section>
  );
}
