import { Extension, type Editor, type Range } from "@tiptap/core";
import Suggestion, { type SuggestionProps, type SuggestionKeyDownProps } from "@tiptap/suggestion";

export type SlashItem = {
  title: string;
  hint: string;
  keywords: string;
  command: (ctx: { editor: Editor; range: Range }) => void;
};

export const SLASH_ITEMS: SlashItem[] = [
  {
    title: "Heading",
    hint: "Section title",
    keywords: "heading h1 title",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run(),
  },
  {
    title: "Bullet list",
    hint: "Unordered list",
    keywords: "bullet list ul",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Numbered list",
    hint: "Ordered list",
    keywords: "numbered ordered list ol",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "Quote",
    hint: "Blockquote",
    keywords: "quote blockquote",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: "Code block",
    hint: "Monospace block",
    keywords: "code snippet pre",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Divider",
    hint: "Horizontal rule",
    keywords: "divider rule hr line",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
];

export type SlashState = {
  open: boolean;
  items: SlashItem[];
  selected: number;
  rect: { left: number; top: number; bottom: number } | null;
  execute: ((item: SlashItem) => void) | null;
};

/**
 * Slash-command extension. UI-agnostic: pushes menu state out through
 * `onState`, receives keyboard navigation back through the returned plugin.
 */
export function createSlashCommand(onState: (s: SlashState) => void) {
  let current: { props: SuggestionProps<SlashItem> | null; selected: number } = {
    props: null,
    selected: 0,
  };

  const emit = (open: boolean) => {
    const props = current.props;
    onState({
      open,
      items: props?.items ?? [],
      selected: current.selected,
      rect: open && props?.clientRect ? (props.clientRect() as DOMRect) : null,
      execute:
        open && props
          ? (item: SlashItem) => {
              props.command(item);
            }
          : null,
    });
  };

  return Extension.create({
    name: "slashCommand",
    addProseMirrorPlugins() {
      return [
        Suggestion<SlashItem>({
          editor: this.editor,
          char: "/",
          items: ({ query }) =>
            SLASH_ITEMS.filter((i) =>
              (i.title + " " + i.keywords).toLowerCase().includes(query.toLowerCase()),
            ),
          command: ({ editor, range, props }) => props.command({ editor, range }),
          render: () => ({
            onStart: (props) => {
              current = { props, selected: 0 };
              emit(true);
            },
            onUpdate: (props) => {
              current.props = props;
              if (current.selected >= props.items.length) current.selected = 0;
              emit(true);
            },
            onKeyDown: (props: SuggestionKeyDownProps) => {
              const items = current.props?.items ?? [];
              if (props.event.key === "ArrowDown") {
                current.selected = (current.selected + 1) % Math.max(items.length, 1);
                emit(true);
                return true;
              }
              if (props.event.key === "ArrowUp") {
                current.selected =
                  (current.selected - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1);
                emit(true);
                return true;
              }
              if (props.event.key === "Enter") {
                const item = items[current.selected];
                if (item && current.props) current.props.command(item);
                return true;
              }
              if (props.event.key === "Escape") {
                emit(false);
                return true;
              }
              return false;
            },
            onExit: () => {
              current = { props: null, selected: 0 };
              emit(false);
            },
          }),
        }),
      ];
    },
  });
}
