import { TextB } from "@phosphor-icons/react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useState } from "react";
import { colours } from "src/colours/colours.constant";
import { QuillFormattingToolbarButton } from "./QuillFormattingToolbarButton";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: QuillFormattingToolbarButton,
  title: "Controls/QuillFormattingToolbarButton",
  tags: ["Atoms"],
} satisfies Meta<typeof QuillFormattingToolbarButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Story: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);

    return (
      <ToggleGroup.Root
        className="font-medium text-sm flex"
        type="multiple"
        value={value}
        onValueChange={setValue}
      >
        <QuillFormattingToolbarButton {...args} />
      </ToggleGroup.Root>
    );
  },
  args: {
    value: "bold",
    colour: colours.orange,
    children: <TextB size={16} weight="bold" />,
  },
};
