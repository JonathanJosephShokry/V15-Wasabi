import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Home } from './components/Home';
import { TeamPage } from './components/TeamPage';
import { MemberProfile } from './components/MemberProfile';
import { ProjectDetails } from './components/ProjectDetails';
import { AboutPage } from './components/AboutPage';
import { WasabiCards } from './components/WasabiCards';
import { TrainingPage } from './components/TrainingPage';
import { Layout } from './components/Layout';
import { WasabiData, DynamicData } from './types';
import rawData from './data.json';
import dynamicDataRaw from './dynamicData.json';

// Scroll to top on navigation, except when going to Home ("/")
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  const [data, setData] = useState<WasabiData | null>(null);

  useEffect(() => {
    const dynamicData = dynamicDataRaw as DynamicData;
    const baseData = rawData as any;

    // Merge member data
    const mergedMembers = baseData.members.map(member => {
      const dynamicMember = dynamicData.memberData.find(d => d.id === member.id);
      if (dynamicMember) {
        return {
          ...member,
          wabi: dynamicMember.wabi,
          spice: dynamicMember.spice,
          exp: dynamicMember.exp,
          restricted: dynamicMember.restricted,
          statistics: dynamicMember.statistics
        };
      }
      return member;
    });

    // Merge project data
    const mergedProjects = baseData.projects.map(project => {
      const dynamicProject = dynamicData.projectData.find(d => d.id === project.id);
      if (dynamicProject) {
        return {
          ...project,
          members: dynamicProject.members,
          lastCycleLeaderboard: dynamicProject.lastCycleLeaderboard
        };
      }
      return project;
    });

    setData({
      ...baseData,
      members: mergedMembers,
      projects: mergedProjects
    });
  }, []);

  if (!data) return <div className="flex items-center justify-center min-h-screen">Loading Wasabi System...</div>;

  return (
    <Router>
      <ScrollToTop />
      <Layout version={data.version} wasabiRulesLink={data.wasabiRulesLink}>
        <Routes>
          <Route path="/" element={<Home data={data} />} />
          <Route path="/team/:teamId" element={<TeamPage data={data} />} />
          <Route path="/member/:memberId" element={<MemberProfile data={data} />} />
          <Route path="/project/:projectId" element={<ProjectDetails data={data} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cards" element={<WasabiCards data={data} />} />
          <Route path="/training" element={<TrainingPage data={data} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
