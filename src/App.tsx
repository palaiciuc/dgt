import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import CaseStudyPage from "./pages/CaseStudyPage";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import ForgotPassword from "./pages/admin/ForgotPassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCaseStudies from "./pages/admin/AdminCaseStudies";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSolutions from "./pages/admin/AdminSolutions";
import AdminPlatforms from "./pages/admin/AdminPlatforms";
import AdminAIFeatures from "./pages/admin/AdminAIFeatures";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminSidebar from "./components/admin/AdminSidebar";
import SessionTimeoutModal from "./components/admin/SessionTimeoutModal";
import { useSessionTimeout } from "./hooks/useSessionTimeout";

const queryClient = new QueryClient();

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, signOut } = useAuth();
  const { showWarning, timeRemaining, extendSession } = useSessionTimeout();
  
  const handleLogout = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003B8E]"></div></div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8 ml-64">{children}</main>
      <SessionTimeoutModal
        isOpen={showWarning}
        timeRemaining={timeRemaining}
        onExtend={extendSession}
        onLogout={handleLogout}
      />
    </div>
  );
};




const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/case-study/:id" element={<CaseStudyPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />

              <Route path="/admin/case-studies" element={<AdminLayout><AdminCaseStudies /></AdminLayout>} />
              <Route path="/admin/solutions" element={<AdminLayout><AdminSolutions /></AdminLayout>} />
              <Route path="/admin/platforms" element={<AdminLayout><AdminPlatforms /></AdminLayout>} />
              <Route path="/admin/ai-features" element={<AdminLayout><AdminAIFeatures /></AdminLayout>} />
              <Route path="/admin/about" element={<AdminLayout><AdminAbout /></AdminLayout>} />
              <Route path="/admin/submissions" element={<AdminLayout><AdminSubmissions /></AdminLayout>} />
              <Route path="/admin/analytics" element={<AdminLayout><AdminAnalytics /></AdminLayout>} />
              <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
              <Route path="/admin/media" element={<AdminLayout><AdminMedia /></AdminLayout>} />
              <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
