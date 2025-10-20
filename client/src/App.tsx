import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";

const moduleRoutes = new Set([
  "dashboard",
  "screens",
  "media",
  "playlists",
  "layouts",
  "apps",
  "publish",
  "myplan",
  "settings",
  "account",
]);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/:module*">
        {(params) => {
          const moduleParamRaw = params["module*"];
          const moduleParam = Array.isArray(moduleParamRaw)
            ? moduleParamRaw[0]
            : moduleParamRaw;

          if (moduleParam && moduleRoutes.has(moduleParam)) {
            return <Dashboard />;
          }

          return <NotFound />;
        }}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;