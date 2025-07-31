import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Welcome from "./pages/welcome";
import Home from "./pages/home";
import Camera from "./pages/camera";
import Results from "./pages/results";
import Wallet from "./pages/wallet";
import Stats from "./pages/stats";
import Analytics from "./pages/analytics";
import Database from "./pages/database";
import Profile from "./pages/profile";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/home" component={Home} />
      <Route path="/camera" component={Camera} />
      <Route path="/results" component={Results} />
      <Route path="/wallet" component={Wallet} />
      <Route path="/stats" component={Stats} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/database" component={Database} />
      <Route path="/profile" component={Profile} />
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
