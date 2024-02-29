import parse from "html-react-parser";

export default function Parser({ content }: { content: string }) {
  return (
    <div className="prose prose-slate text-secondary-light prose-p:text-xs line-clamp-2 pt-3">
      {parse(content)}
    </div>
  );
}
