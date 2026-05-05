import React, { useState } from 'react';
import TopBar from './components/OS/TopBar';
import Dock from './components/OS/Dock';
import Desktop from './components/OS/Desktop';
import TerminalWindow from './components/Terminals/TerminalWindow';
import EducationDB from './components/Apps/EducationDB';
import ProjectExplorer from './components/Apps/ProjectExplorer';
import SystemMonitor from './components/Apps/SystemMonitor';
import ContactMe from './components/Apps/ContactMe';

function App() {
  const [apps, setApps] = useState({
    profile: { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
    education: { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
    projects: { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 }, 
    skills: { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 }, 
    contact: { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
  });
  const [maxZ, setMaxZ] = useState(10);

  const updateApp = (name, key, value) => {
    setApps(prev => ({
      ...prev,
      [name]: { ...prev[name], [key]: value }
    }));
  };

  const bringToFront = (name) => {
    const newZ = maxZ + 1;
    setMaxZ(newZ);
    updateApp(name, 'zIndex', newZ);
  };

  const toggleApp = (name) => {
    const app = apps[name];
    if (!app.isOpen) {
      updateApp(name, 'isOpen', true);
      updateApp(name, 'isMinimized', false);
      bringToFront(name);
    } else if (app.isOpen && !app.isMinimized) {
      updateApp(name, 'isMinimized', true);
    } else {
      updateApp(name, 'isMinimized', false);
      bringToFront(name);
    }
  };

    const isAnyAppMaximized = Object.values(apps).some(
    app => app.isOpen && app.isMaximized && !app.isMinimized
  );


   return (
    <div className="h-screen w-screen bg-cover bg-center overflow-hidden relative flex flex-col font-sans" 
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070')" }}>
      
      <div className="absolute inset-0 bg-black/30"></div>
      <TopBar />

      <main className="flex-1 relative p-4 z-10">
        <Desktop toggleApp={toggleApp} />

        {apps.profile.isOpen && !apps.profile.isMinimized && (
          <TerminalWindow zIndex={apps.profile.zIndex} onFocus={() => bringToFront('profile')}
            isMaximized={apps.profile.isMaximized}
            toggleMax={() => updateApp('profile', 'isMaximized', !apps.profile.isMaximized)}
            minimize={() => updateApp('profile', 'isMinimized', true)}
            close={() => updateApp('profile', 'isOpen', false)}
          />
        )}

       {apps.education.isOpen && !apps.education.isMinimized && (
          <EducationDB zIndex={apps.education.zIndex} onFocus={() => bringToFront('education')}
            isMaximized={apps.education.isMaximized}
            toggleMax={() => updateApp('education', 'isMaximized', !apps.education.isMaximized)}
            minimize={() => updateApp('education', 'isMinimized', true)}
            close={() => updateApp('education', 'isOpen', false)}
          />
        )}

         {/* APLIKASI KETIGA: PROJECT EXPLORER */}
       {apps.projects.isOpen && !apps.projects.isMinimized && (
          <ProjectExplorer zIndex={apps.projects.zIndex} onFocus={() => bringToFront('projects')}
          isMaximized={apps.projects.isMaximized}
          toggleMax={() => updateApp('projects', 'isMaximized', !apps.projects.isMaximized)}
          minimize={() => updateApp('projects', 'isMinimized', true)}
          close={() => updateApp('projects', 'isOpen', false)}
        />
      )}

  {/* 4. SKILLS (Ubuntu Style) */}
        {apps.skills.isOpen && !apps.skills.isMinimized && (
          <SystemMonitor 
            zIndex={apps.skills.zIndex}
            onFocus={() => bringToFront('skills')}
            isMaximized={apps.skills.isMaximized}
            toggleMax={() => updateApp('skills', 'isMaximized', !apps.skills.isMaximized)}
            minimize={() => updateApp('skills', 'isMinimized', true)}
            close={() => updateApp('skills', 'isOpen', false)}
          />
        )}

        {/* 5. CONTACT (Messenger Style) */}
        {apps.contact.isOpen && !apps.contact.isMinimized && (
          <ContactMe 
            zIndex={apps.contact.zIndex}
            onFocus={() => bringToFront('contact')}
            isMaximized={apps.contact.isMaximized}
            toggleMax={() => updateApp('contact', 'isMaximized', !apps.contact.isMaximized)}
            minimize={() => updateApp('contact', 'isMinimized', true)}
            close={() => updateApp('contact', 'isOpen', false)}
          />
        )}
      </main>
      

      {/* Kirim status isAnyAppMaximized ke Dock */}
      <Dock 
        apps={apps} 
        toggleApp={toggleApp} 
        isHidden={isAnyAppMaximized} 
      />
    </div>
  );
}

export default App;