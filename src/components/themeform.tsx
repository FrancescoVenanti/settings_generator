"use client";
import { useState } from "react";
import themeData from "../assets/theme.json";
import { HexColorPicker } from "react-colorful";
import { Button } from "./ui/button";

// Helper function to update a deep property
const updateNestedField = (object: any, path: string, value: any) => {
  const keys = path.split(".");
  const lastKey = keys.pop() as string;

  const deepObject = keys.reduce((acc, key) => {
    return acc[key] ?? {};
  }, object);

  deepObject[lastKey] = value;
  return { ...object };
};

// Function to download a JSON file
const downloadJsonFile = (data: any, filename: string) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

const ThemeForm = () => {
  const [themes, setThemes] = useState(themeData.themes);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null); // Track which color picker is open

  const handleChange = (themeIndex: number, field: string, value: any) => {
    setThemes((prevThemes) =>
      prevThemes.map((theme, index) =>
        index === themeIndex
          ? updateNestedField({ ...theme }, field, value) // Update deep fields dynamically
          : theme
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedThemeData = { ...themeData, themes };
    downloadJsonFile(updatedThemeData, "updated-theme.json");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto p-6 bg-white text-black rounded-lg shadow-md"
    >
      <div className="sticky top-2 bg-white/90 p-2 mt-2 backdrop-blur-md rounded-md flex items-center mb-8 z-50">
        <h1 className="text-4xl font-extrabold m-0">Theme Configurations</h1>
        {/* Button to generate and download the updated JSON */}
        <Button
          type="submit"
          className="ms-auto hover:scale-105 transition-transform"
        >
          Download JSON
        </Button>
      </div>
      {themes.map((theme, themeIndex) => (
        <div key={themeIndex} className="mb-8 p-4 border rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold capitalize">{theme.name}</h2>

          {/* Colors */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Colors</h3>
            {Object.keys(theme.colors).map((color) => (
              <div key={color} className="mt-2 relative">
                <label className="block font-medium">{color}</label>
                <input
                  type="text"
                  value={theme.colors[color as keyof typeof theme.colors]}
                  onClick={() =>
                    setShowColorPicker(
                      showColorPicker === `${themeIndex}-${color}`
                        ? null
                        : `${themeIndex}-${color}`
                    )
                  } // Toggle color picker
                  onChange={(e) =>
                    handleChange(themeIndex, `colors.${color}`, e.target.value)
                  }
                  className="mt-1 p-2 border rounded-md w-full"
                />

                {/* Color Picker */}
                {showColorPicker === `${themeIndex}-${color}` && (
                  <div className="absolute z-10 mt-2">
                    <HexColorPicker
                      color={theme.colors[color as keyof typeof theme.colors]}
                      onChange={(newColor) =>
                        handleChange(themeIndex, `colors.${color}`, newColor)
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Text Sizes */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Text Sizes</h3>
            {Object.keys(theme.texts.size).map((size) => (
              <div key={size} className="mt-2">
                <label className="block font-medium">{size}</label>
                <input
                  type="text"
                  value={theme.texts.size[
                    size as keyof typeof theme.texts.size
                  ].join(", ")}
                  onChange={(e) =>
                    handleChange(
                      themeIndex,
                      `texts.size.${size}`,
                      e.target.value.split(", ").map(parseFloat)
                    )
                  }
                  className="mt-1 p-2 border rounded-md w-full"
                />
              </div>
            ))}
          </div>

          {/* Shadows */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Shadows</h3>
            {Object.keys(theme.shadows).map((shadowSize) => (
              <div key={shadowSize} className="mt-2">
                <label className="block font-medium">{shadowSize}</label>
                {theme.shadows[shadowSize as keyof typeof theme.shadows].map(
                  (shadow, shadowIndex) => (
                    <div key={shadowIndex} className="mt-2">
                      <label className="block font-medium">
                        Shadow {shadowIndex + 1}
                      </label>
                      <input
                        type="text"
                        value={JSON.stringify(shadow)}
                        onChange={(e) =>
                          handleChange(
                            themeIndex,
                            `shadows.${shadowSize}[${shadowIndex}]`,
                            JSON.parse(e.target.value)
                          )
                        }
                        className="mt-1 p-2 border rounded-md w-full"
                      />
                    </div>
                  )
                )}
              </div>
            ))}
          </div>

          {/* Border Radius */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Border Radius</h3>
            {Object.keys(theme.border.radius).map((radiusSize) => (
              <div key={radiusSize} className="mt-2">
                <label className="block font-medium">{radiusSize}</label>
                <input
                  type="text"
                  value={theme.border.radius[
                    radiusSize as keyof typeof theme.border.radius
                  ].join(", ")}
                  onChange={(e) =>
                    handleChange(
                      themeIndex,
                      `border.radius.${radiusSize}`,
                      e.target.value.split(", ").map(parseFloat)
                    )
                  }
                  className="mt-1 p-2 border rounded-md w-full"
                />
              </div>
            ))}
          </div>

          {/* Padding */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Padding</h3>
            {Object.keys(theme.padding).map((paddingSize) => (
              <div key={paddingSize} className="mt-2">
                <label className="block font-medium">{paddingSize}</label>
                <input
                  type="text"
                  value={theme.padding[
                    paddingSize as keyof typeof theme.padding
                  ].join(", ")}
                  onChange={(e) =>
                    handleChange(
                      themeIndex,
                      `padding.${paddingSize}`,
                      e.target.value.split(", ").map(parseFloat)
                    )
                  }
                  className="mt-1 p-2 border rounded-md w-full"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </form>
  );
};

export default ThemeForm;
