import { type Colour } from "src/colours/Colour.type";
import { getAllColours } from "src/colours/utils/getColour";
import { ColourPickerColourButton } from "./ColourPickerColourButton";

type ColourPickerProps = {
  selectedColourName: string;
  onSelectColour: (colour: Colour) => void;
};

export const ColourPicker = ({
  selectedColourName,
  onSelectColour,
}: ColourPickerProps) => {
  const colours = getAllColours();

  return (
    <div className="flex flex-wrap gap-2">
      {colours.map((colour) => (
        <ColourPickerColourButton
          key={colour.name}
          colour={colour}
          selected={selectedColourName === colour.name}
          onClick={onSelectColour}
        />
      ))}
    </div>
  );
};
