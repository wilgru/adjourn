import { colours } from "src/colours/colours.constant";
import { Button } from "src/common/components/Button/Button";

type EmptyStateProps = {
  text: string;
  onAdd?: () => void;
};

export const EmptyState = ({ text, onAdd }: EmptyStateProps) => {
  return (
    <div className="h-full w-full flex-1 flex flex-col items-center justify-center gap-3">
      <h1 className="text-gray-400 text-lg">{text}</h1>

      {onAdd && (
        <Button
          variant="ghost-strong"
          size="md"
          colour={colours.grey}
          iconName="plus"
          ariaLabel="Add"
          onClick={onAdd}
        />
      )}
    </div>
  );
};
