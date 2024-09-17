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
  const [jsonUrl, setJsonUrl] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const jsonData = JSON.stringify({ screens, globalConfig }, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    setJsonUrl(url);
  };

  return (
    <div className=" mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-6xl font-extrabold mb-8 text-gray-900 leading-tight">
        Screen Configurations
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Submit and Download JSON */}
        <Button
          type="submit"
          className="w-full mt-4 hover:scale-105 transition-transform"
        >
          Generate JSON
        </Button>
      </form>
      {jsonUrl && (
        <div className="mt-6">
          <a
            href={jsonUrl}
            download="screen-config-data.json"
            className="inline-flex items-center justify-center w-full"
          >
            <Button className="w-full mt-4 hover:scale-105 transition-transform">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download JSON
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
