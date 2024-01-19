import { Button } from "../ui/button";

type HostMeetupProps = {
  title: string;
  text: string;
  btnLeftText: string;
  btnRightText: string;
};

export default function HostMeetup({
  text,
  title,
  btnLeftText,
  btnRightText,
}: HostMeetupProps) {
  return (
    <div className="w-full rounded-md bg-primary p-3 text-white-700">
      <header>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xs font-medium">{text}</p>
      </header>
      <div className="mt-3 flex justify-between gap-3">
        <Button className="w-28 bg-white text-xs text-primary-dark hover:text-white-700">
          {btnLeftText}
        </Button>
        <Button className="w-28 bg-blue-500 text-xs">{btnRightText}</Button>
      </div>
    </div>
  );
}
