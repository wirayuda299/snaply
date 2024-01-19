import parse from "html-react-parser";

export default function Parser({ content }: { content: string }) {
  return (
    <div className="prose prose-slate line-clamp-2 pt-3 text-secondary-light prose-p:text-xs">
      {parse(content)}
    </div>
  );
}
