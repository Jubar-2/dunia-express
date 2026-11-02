"use client";

import * as React from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type as TypeIcon,
  Table as TableIcon,
  MoreHorizontal,
  Code2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

function RichTextEditorInner({
  value = "",
  onChange,
  minHeight = "min-h-[140px]",
  className,
}: RichTextEditorProps) {
  const [showCodeView, setShowCodeView] = React.useState(false);
  const [htmlSource, setHtmlSource] = React.useState(value);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none px-3 py-2.5 focus:outline-none text-neutral-800",
          minHeight
        ),
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      setHtmlSource(html);
      onChange?.(html);
    },
  });

  function toggleCodeView() {
    if (!editor) return;
    if (!showCodeView) {
      setHtmlSource(editor.getHTML());
    } else {
      editor.commands.setContent(htmlSource);
      onChange?.(htmlSource);
    }
    setShowCodeView((v) => !v);
  }

  function handleSourceChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setHtmlSource(val);
    onChange?.(val);
  }

  if (!editor) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-lg border border-neutral-300 bg-neutral-50",
          minHeight,
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-neutral-300 bg-white transition-colors focus-within:border-neutral-400",
        className
      )}
    >
      <Toolbar editor={editor} onToggleCodeView={toggleCodeView} isCodeView={showCodeView} />
      {showCodeView ? (
        <textarea
          value={htmlSource}
          onChange={handleSourceChange}
          className={cn(
            "w-full resize-none border-t border-neutral-200 bg-neutral-900 px-3 py-2.5 font-mono text-xs text-neutral-100 focus:outline-none",
            minHeight
          )}
          spellCheck={false}
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}

function Toolbar({
  editor,
  onToggleCodeView,
  isCodeView,
}: {
  editor: Editor;
  onToggleCodeView: () => void;
  isCodeView: boolean;
}) {
  const [paragraphOpen, setParagraphOpen] = React.useState(false);

  const paragraphLabel = editor.isActive("heading", { level: 1 })
    ? "Heading 1"
    : editor.isActive("heading", { level: 2 })
    ? "Heading 2"
    : editor.isActive("heading", { level: 3 })
    ? "Heading 3"
    : "Paragraph";

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-neutral-200 bg-neutral-50 px-2 py-1.5">
      <div className="relative">
        <button
          type="button"
          onClick={() => setParagraphOpen((v) => !v)}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
        >
          {paragraphLabel}
          <ChevronDown className="h-3 w-3" />
        </button>
        {paragraphOpen && (
          <div className="absolute left-0 top-8 z-10 w-32 rounded-md border border-neutral-200 bg-white py-1 shadow-lg">
            {[
              {
                label: "Paragraph",
                action: () => editor.chain().focus().setParagraph().run(),
              },
              {
                label: "Heading 1",
                action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
              },
              {
                label: "Heading 2",
                action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
              },
              {
                label: "Heading 3",
                action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
              },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => {
                  opt.action();
                  setParagraphOpen(false);
                }}
                className="block w-full px-3 py-1.5 text-left text-xs text-neutral-700 hover:bg-neutral-100"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <Divider />

      <ToolbarButton
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold (Ctrl+B)"
      >
        <BoldIcon className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic (Ctrl+I)"
      >
        <ItalicIcon className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarButton onClick={() => {}} title="Text styles">
        <TypeIcon className="h-3.5 w-3.5" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        title="Align left"
      >
        <AlignLeft className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        title="Align center"
      >
        <AlignCenter className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        title="Align right"
      >
        <AlignRight className="h-3.5 w-3.5" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        active={editor.isActive("link")}
        onClick={() => {
          const currentLink = editor.getAttributes("link").href || "";
          const url = window.prompt("Enter URL", currentLink);
          if (url === null) return;
          if (url === "") {
            editor.chain().focus().unsetLink().run();
          } else {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        title="Add Link"
      >
        <Link2 className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarButton onClick={() => {}} title="Insert Table">
        <TableIcon className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarButton onClick={() => {}} title="More options">
        <MoreHorizontal className="h-3.5 w-3.5" />
      </ToolbarButton>

      <div className="flex-1" />

      <ToolbarButton
        active={isCodeView}
        onClick={onToggleCodeView}
        title="View HTML Source Code"
      >
        <Code2 className="h-3.5 w-3.5" />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  children,
  active,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "rounded p-1.5 text-neutral-600 hover:bg-neutral-200 transition-colors",
        active && "bg-neutral-200 text-neutral-900"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-4 w-px bg-neutral-300 shrink-0" />;
}

export function RichTextEditor(props: RichTextEditorProps) {
  return (
    <React.Suspense
      fallback={
        <div
          className={cn(
            "rounded-md border border-neutral-300 bg-white",
            props.minHeight || "min-h-[140px]",
            props.className
          )}
        />
      }
    >
      <RichTextEditorInner {...props} />
    </React.Suspense>
  );
}
