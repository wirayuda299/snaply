import parse from "html-react-parser";
import Image from "next/image";

import Statistic from "@/components/interviews/statistic";

export default function InterviewDetail() {
  const tags = ["#technology", "#diversity", "#hr"];

  const exampleData = `
  <p>In a recent interview with HR and people management experts, we explored the significance of leading with empathy in today's business world. Here are the key takeaways:</p>
`;
  return (
    <div className="mx-auto mt-28 h-full min-h-screen w-full max-w-[785px] p-5">
      <section className="flex w-full flex-col justify-center rounded-lg bg-white dark:bg-secondary-dark-2">
        <Image
          className="mx-auto object-cover object-center"
          src={"/banner.png"}
          width={785}
          height={273}
          alt="image"
        />
        <div className="p-5">
          <div className="flex items-center gap-5">
            <h1 className="text-darkSecondary-600 text-lg font-normal">H1</h1>
            <h2 className="text-darkSecondary-900 py-5 text-base font-semibold dark:text-white-800 md:text-[26px]">
              Leading with Empathy: An Interview with HR and People Management
              Experts
            </h2>
          </div>
          <section className="flex flex-wrap items-center justify-between gap-5 ">
            <Statistic />
            <ul className="flex items-center gap-5">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="text-secondary-yellow-90 text-xs font-normal md:text-base"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </section>
          <article className="text-darkSecondary-800 py-5 text-xs font-normal leading-4 md:text-base">
            {parse(exampleData)}
          </article>
        </div>
      </section>
    </div>
  );
}
