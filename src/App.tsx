import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import DashboardPage from '@/pages/DashboardPage';
import ClaimsPage from '@/pages/ClaimsPage';
import TypeAPage from '@/pages/TypeAPage';
import TypeBPage from '@/pages/TypeBPage';
import TypeCPage from '@/pages/TypeCPage';
import EstimationPage from '@/pages/EstimationPage';
import ApprovePage from '@/pages/ApprovePage';
import OpinionPage from '@/pages/OpinionPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/claims" element={<ClaimsPage />} />
        <Route path="/type-a" element={<TypeAPage />} />
        <Route path="/type-b" element={<TypeBPage />} />
        <Route path="/type-c" element={<TypeCPage />} />
        <Route path="/estimation" element={<EstimationPage />} />
        <Route path="/approve" element={<ApprovePage />} />
        <Route path="/opinion" element={<OpinionPage />} />
      </Route>
    </Routes>
  );
}
