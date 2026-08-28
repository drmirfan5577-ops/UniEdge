import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminPage from "./pages/AdminPage";
import LegalPage from "./pages/LegalPage";
import GalleryPage from "./pages/GalleryPage";
import ESStudioPage from "./pages/ESStudioPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useThemeStore } from "@/stores/themeStore";

const queryClient = new QueryClient();

function ThemeInitializer() {
  const { theme } = useThemeStore();
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeInitializer />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/legal/:type" element={<LegalPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/studio" element={<ESStudioPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
