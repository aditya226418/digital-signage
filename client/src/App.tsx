import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PublishStoreProvider } from "@/hooks/usePublishStore";
import { RolesProvider } from "@/contexts/RolesContext";
import { NpsProvider } from "@/hooks/useNpsStore";
import ActiveQuickplayBar from "@/components/ActiveQuickplayBar";
import FloatingNpsWidget from "@/components/FloatingNpsWidget";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";

const moduleRoutes = new Set([
  "dashboard",
  "screens",
  "media",
  "compositions",
  "apps",
  "publish",
  "stores",
  "myplan",
  "settings",
  "account",
]);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/:module/:id">
        {(params) => {
          const moduleParam = params.module;

          if (moduleParam && moduleRoutes.has(moduleParam)) {
            return <Dashboard />;
          }

          return <NotFound />;
        }}
      </Route>
      <Route path="/:module">
        {(params) => {
          const moduleParam = params.module;

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
        <RolesProvider>
          <PublishStoreProvider>
            <NpsProvider>
              <Toaster />
              <Sonner position="top-right" richColors />
              <ActiveQuickplayBar />
              <FloatingNpsWidget />
              <Router />
            </NpsProvider>
          </PublishStoreProvider>
        </RolesProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;