import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { CompetitionList } from "./pages/CompetitionList";
import { CompetitionDetail } from "./pages/CompetitionDetail";
import { TestReview } from "./pages/TestReview";
import { ExamConfig } from "./pages/ExamConfig";
import { TrainingConfig } from "./pages/TrainingConfig";
import { Test } from "./pages/Test";
import { Results } from "./pages/Results";
import { History } from "./pages/History";
import CompetitionManager from "./pages/CompetitionManager";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/competitions" element={<CompetitionList />} />
          <Route path="/competition/:competitionId" element={<CompetitionDetail />} />
          <Route path="/test-review/:testId" element={<TestReview />} />
          <Route path="/competition-manager" element={<CompetitionManager />} />
          <Route path="/exam-config" element={<ExamConfig />} />
          <Route path="/training-config" element={<TrainingConfig />} />
          <Route path="/test" element={<Test />} />
          <Route path="/results" element={<Results />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
