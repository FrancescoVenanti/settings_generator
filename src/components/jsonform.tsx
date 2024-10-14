"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import screenConfigData from "../assets/screen-config-data.json";

type Screen = {
  name: string;
  isChecked: boolean;
  config: Record<string, { value: any; name: string; description: string }>;
};

export default function ScreenConfigForm() {
  const [screens, setScreens] = useState(screenConfigData.screens as Screen[]);
  const [globalConfig, setGlobalConfig] = useState(
    screenConfigData.globalConfig
  );

  const handleCheckboxChange = (
    index: number,
    field: keyof (typeof screens)[0]
  ) => {
    setScreens((prevScreens) =>
      prevScreens.map((screen, i) =>
        i === index ? { ...screen, [field]: !screen[field] } : screen
      )
    );
  };

  const handleConfigChange = (
    screenIndex: number,
    configField: string,
    value: boolean
  ) => {
    setScreens((prevScreens) =>
      prevScreens.map((screen, i) =>
        i === screenIndex
          ? {
              ...screen,
              config: {
                ...screen.config,
                [configField]: { ...screen.config[configField], value },
              },
            }
          : screen
      )
    );
  };

  // Function to generate and trigger the JSON download
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const jsonData = JSON.stringify({ screens, globalConfig }, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "screen-config-data.json";
    link.click();
  };

  return (
    <div className=" mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="sticky top-2 bg-white/90 p-2 backdrop-blur-md rounded-md flex items-center mb-8">
          <h1 className="text-4xl m-0 font-extrabold text-gray-900 leading-tight">
            Screen Configurations
          </h1>
          {/* Submit and Download JSON */}
          <Button
            type="submit"
            variant="violet"
            className=" hover:scale-105 ms-auto transition-transform"
          >
            Download JSON
          </Button>
        </div>

        {screens.map((screen, index) => (
          <div
            key={screen.name}
            className="space-y-4 p-4 border rounded-lg shadow-lg hover:shadow-md transition-shadow"
          >
            <h2 className="text-3xl font-semibold text-black">{screen.name}</h2>

            {/* isChecked checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`isChecked-${index}`}
                checked={screen.isChecked}
                onCheckedChange={() => handleCheckboxChange(index, "isChecked")}
              />
              <Label
                className="text-black text-lg"
                htmlFor={`isChecked-${index}`}
              >
                Is the page visible?
              </Label>
            </div>

            {/* Config options with tooltip */}
            {Object.keys(screen.config).map((configField) => (
              <div
                key={configField}
                className="flex items-center space-x-2 text-black"
              >
                <Checkbox
                  id={`${screen.name}-${configField}`}
                  checked={screen.config[configField].value}
                  onCheckedChange={(e) =>
                    handleConfigChange(
                      index,
                      configField,
                      !screen.config[configField].value
                    )
                  }
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipContent>
                      {screen.config[configField].description}
                    </TooltipContent>
                    <TooltipTrigger asChild>
                      <Label
                        className="text-black text-lg cursor-pointer"
                        htmlFor={`${screen.name}-${configField}`}
                      >
                        {screen.config[configField].name}
                      </Label>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
        ))}

        {/* Global Config */}
        <div className="space-y-4 p-4 border rounded-lg shadow-lg hover:shadow-md transition-shadow">
          <h2 className="text-3xl font-semibold text-black">Global Config</h2>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDarkMode"
              checked={globalConfig.isDarkMode.value}
              onCheckedChange={() =>
                setGlobalConfig((prev) => ({
                  ...prev,
                  isDarkMode: {
                    ...prev.isDarkMode,
                    value: !prev.isDarkMode.value,
                  },
                }))
              }
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipContent>
                  {globalConfig.isDarkMode.description}
                </TooltipContent>
                <TooltipTrigger asChild>
                  <Label className="text-black" htmlFor="isDarkMode">
                    {globalConfig.isDarkMode.name}
                  </Label>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </form>
    </div>
  );
}
