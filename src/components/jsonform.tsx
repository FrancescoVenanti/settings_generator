"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DownloadIcon } from "lucide-react";

// JSON structure to emulate
const initialScreens: Screen[] = [
  {
    name: "splashscreen",
    isChecked: true,
    config: {
      isSplashButtonBottom: {
        value: true,
        name: "Splash screen button at the bottom",
        description:
          "If true, the button will be at the bottom of the screen, otherwise it will be at the top",
      },
      videoOnSplash: {
        value: true,
        name: "Video on splash screen",
        description:
          "If true, the splash screen will have a video, otherwise it will have an image carousel",
      },
    },
  },
  {
    name: "where_to_eat_screen",
    isChecked: true,
    config: {},
  },
  {
    name: "order_screen",
    isChecked: true,
    config: {
      isSidebarLeft: {
        value: true,
        name: "Sidebar on the left",
        description:
          "If true, the sidebar will be on the left, otherwise it will be on the right",
      },
      home: {
        value: true,
        name: "Home",
        description: "If true, the home button will be visible",
      },
      offers: {
        value: true,
        name: "Offers",
        description: "If true, the offers button will be visible",
      },
    },
  },
  {
    name: "order_recap_screen",
    isChecked: true,
    config: {
      groupedByCategory: {
        value: true,
        name: "Grouped by category",
        description:
          "If true, the items will be grouped by category, otherwise they will be displayed in a list",
      },
      callToActionTop: {
        value: true,
        name: "Call to action at the top",
        description:
          "If true, the call to action will be at the top of the screen, otherwise it will be at the bottom",
      },
      areSameItemsGrouped: {
        value: true,
        name: "Same items grouped",
        description:
          "If true, the same items will be grouped, otherwise they will be displayed separately",
      },
      badgeForOneElement: {
        value: true,
        name: "Badge for one element",
        description:
          "If true, the badge will be displayed for one element, otherwise it will be displayed for more than one element",
      },
    },
  },
  {
    name: "select_payment_screen",
    isChecked: true,
    config: {},
  },
  {
    name: "post_payment_screen",
    isChecked: true,
    config: {},
  },
];

const initialGlobalConfig = {
  isDarkMode: {
    value: true,
    name: "Dark mode",
    description:
      "If true, the app will be in dark mode, otherwise it will be in light mode",
  },
};

type Screen = {
  name: string;
  isChecked: boolean;
  config: Record<string, { value: any; name: string; description: string }>;
};

export default function ScreenConfigForm() {
  const [screens, setScreens] = useState<Screen[]>(initialScreens);
  const [globalConfig, setGlobalConfig] = useState(initialGlobalConfig);
  const [jsonUrl, setJsonUrl] = useState<string | null>(null);

  // Handle checkbox and config field changes
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
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-6xl font-bold mb-6 text-black">
        Screen Configurations
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {screens.map((screen, index) => (
          <div key={screen.name} className="space-y-4">
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

        {/* Submit and Download JSON */}
        <Button type="submit" className="w-full mt-4">
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
            <Button className="w-full">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download JSON
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
