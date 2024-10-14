import JsonForm from "@/components/jsonform";
import ThemeForm from "@/components/themeform";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <main className="flex items-stretch justify-start sm:items-start p-10 gap-10">
      <Tabs defaultValue="settings" className="w-1/2">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <JsonForm />
        </TabsContent>
        <TabsContent value="theme">
          <ThemeForm />
        </TabsContent>
      </Tabs>
      <div className="w-1/2 bg-white/30 h-screen sticky top-0 rounded-md"></div>
    </main>
  );
}
