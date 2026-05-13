import React, { useState, useEffect } from 'react';
import BootLoader from './components/OS/BootLoader';
import TopBar from './components/OS/TopBar';
import Dock from './components/OS/Dock';
import Desktop from './components/OS/Desktop';
import TerminalWindow from './components/Terminals/TerminalWindow';
import ProjectExplorer from './components/Apps/ProjectExplorer';
import SystemMonitor from './components/Apps/SystemMonitor';
import ContactMe from './components/Apps/ContactMe';
import ProjectPreview from './components/Apps/ProjectPreview';
import ExperienceLog from './components/Apps/ExperienceLog';
import MediumRSS from './components/Apps/MediumRSS';
import WallpaperApp from './components/Apps/WallpaperApp';
import WhoAmI from './components/Apps/WhoAmI';
import NetworkMap from './components/Apps/NetworkMap';
import CTFLog from './components/Apps/CTFLog';
import TerminalLive from './components/Apps/TerminalLive';
import Arcade from './components/Apps/Arcade';

function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [wallpaperUrl, setWallpaperUrl] = useState(null);

  const DEFAULT_WALLPAPER = "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070')";

  const [apps, setApps] = useState({
    profile:    { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
    experience: { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
    projects:   { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
    skills:     { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
    contact:    { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
    preview:    { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10, data: null },
    medium:     { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
    wallpaper:  { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
    whoami:     { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
    network:    { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
    ctf:        { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
    terminal:   { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
    arcade:     { isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
  });

  const [maxZ, setMaxZ] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 5500);
    return () => clearTimeout(timer);
  }, []);

  const updateApp = (name, key, value) => {
    setApps(prev => ({ ...prev, [name]: { ...prev[name], [key]: value } }));
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

  const openProject = (projectData) => {
    setApps(prev => ({
      ...prev,
      preview: { ...prev.preview, isOpen: true, isMinimized: false, data: projectData }
    }));
    bringToFront('preview');
  };

  if (isBooting) return <BootLoader />;

  return (
    <div
      className="h-screen w-screen bg-cover bg-center overflow-hidden relative flex flex-col font-sans transition-all duration-1000"
      style={{ backgroundImage: wallpaperUrl ? `url('${wallpaperUrl}')` : DEFAULT_WALLPAPER }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <TopBar />

      <main className="flex-1 relative p-4 z-10">
        <Desktop toggleApp={toggleApp} />

        {/* 1. PROFILE */}
        {apps.profile.isOpen && !apps.profile.isMinimized && (
          <TerminalWindow
            zIndex={apps.profile.zIndex}
            onFocus={() => bringToFront('profile')}
            isMaximized={apps.profile.isMaximized}
            toggleMax={() => updateApp('profile', 'isMaximized', !apps.profile.isMaximized)}
            minimize={() => updateApp('profile', 'isMinimized', true)}
            close={() => updateApp('profile', 'isOpen', false)}
          />
        )}

        {/* 2. EXPERIENCE LOG */}
        {apps.experience.isOpen && !apps.experience.isMinimized && (
          <ExperienceLog
            zIndex={apps.experience.zIndex}
            onFocus={() => bringToFront('experience')}
            isMaximized={apps.experience.isMaximized}
            toggleMax={() => updateApp('experience', 'isMaximized', !apps.experience.isMaximized)}
            minimize={() => updateApp('experience', 'isMinimized', true)}
            close={() => updateApp('experience', 'isOpen', false)}
          />
        )}

        {/* 3. PROJECTS */}
        {apps.projects.isOpen && !apps.projects.isMinimized && (
          <ProjectExplorer
            zIndex={apps.projects.zIndex}
            onFocus={() => bringToFront('projects')}
            isMaximized={apps.projects.isMaximized}
            toggleMax={() => updateApp('projects', 'isMaximized', !apps.projects.isMaximized)}
            minimize={() => updateApp('projects', 'isMinimized', true)}
            close={() => updateApp('projects', 'isOpen', false)}
            onOpenProject={openProject}
          />
        )}

        {/* 4. SKILLS */}
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

        {/* 5. CONTACT */}
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

        {/* 6. PROJECT PREVIEW */}
        {apps.preview.isOpen && !apps.preview.isMinimized && (
          <ProjectPreview
            zIndex={apps.preview.zIndex}
            onFocus={() => bringToFront('preview')}
            data={apps.preview.data}
            isMaximized={apps.preview.isMaximized}
            toggleMax={() => updateApp('preview', 'isMaximized', !apps.preview.isMaximized)}
            minimize={() => updateApp('preview', 'isMinimized', true)}
            close={() => updateApp('preview', 'isOpen', false)}
          />
        )}

        {/* 7. MEDIUM RSS */}
        {apps.medium.isOpen && !apps.medium.isMinimized && (
          <MediumRSS
            zIndex={apps.medium.zIndex}
            onFocus={() => bringToFront('medium')}
            isMaximized={apps.medium.isMaximized}
            toggleMax={() => updateApp('medium', 'isMaximized', !apps.medium.isMaximized)}
            minimize={() => updateApp('medium', 'isMinimized', true)}
            close={() => updateApp('medium', 'isOpen', false)}
          />
        )}

        {/* 8. WALLPAPER */}
        {apps.wallpaper.isOpen && !apps.wallpaper.isMinimized && (
          <WallpaperApp
            zIndex={apps.wallpaper.zIndex}
            onFocus={() => bringToFront('wallpaper')}
            isMaximized={apps.wallpaper.isMaximized}
            toggleMax={() => updateApp('wallpaper', 'isMaximized', !apps.wallpaper.isMaximized)}
            minimize={() => updateApp('wallpaper', 'isMinimized', true)}
            close={() => updateApp('wallpaper', 'isOpen', false)}
            onWallpaperChange={(url) => setWallpaperUrl(url)}
          />
        )}

         {/* 9. WhoAmI */}
        {apps.whoami.isOpen && !apps.whoami.isMinimized && (
          <WhoAmI
            zIndex={apps.whoami.zIndex}
            onFocus={() => bringToFront('whoami')}
            isMaximized={apps.whoami.isMaximized}
            toggleMax={() => updateApp('whoami', 'isMaximized', !apps.whoami.isMaximized)}
            minimize={() => updateApp('whoami', 'isMinimized', true)}
            close={() => updateApp('whoami', 'isOpen', false)}
          />
        )}

          {/* 10. Network Map */}
        {apps.network.isOpen && !apps.network.isMinimized && (
          <NetworkMap
            zIndex={apps.network.zIndex}
            onFocus={() => bringToFront('network')}
            isMaximized={apps.network.isMaximized}
            toggleMax={() => updateApp('network', 'isMaximized', !apps.network.isMaximized)}
            minimize={() => updateApp('network', 'isMinimized', true)}
            close={() => updateApp('network', 'isOpen', false)}
          />
        )}
      
       {/* 10. CTF Log */}
        {apps.ctf.isOpen && !apps.ctf.isMinimized && (
          <CTFLog
            zIndex={apps.ctf.zIndex}
            onFocus={() => bringToFront('ctf')}
            isMaximized={apps.ctf.isMaximized}
            toggleMax={() => updateApp('ctf', 'isMaximized', !apps.ctf.isMaximized)}
            minimize={() => updateApp('ctf', 'isMinimized', true)}
            close={() => updateApp('ctf', 'isOpen', false)}
          />
        )}
          

        {/* 11. Terminal Live */} 
        {apps.terminal.isOpen && !apps.terminal.isMinimized && (
          <TerminalLive
            zIndex={apps.terminal.zIndex}
            onFocus={() => bringToFront('terminal')}
            isMaximized={apps.terminal.isMaximized}
            toggleMax={() => updateApp('terminal', 'isMaximized', !apps.terminal.isMaximized)}
            minimize={() => updateApp('terminal', 'isMinimized', true)}
            close={() => updateApp('terminal', 'isOpen', false)}
          />
        )}

        {/* 12. Arcade */}
        {apps.arcade.isOpen && !apps.arcade.isMinimized && (
          <Arcade
            zIndex={apps.arcade.zIndex}
            onFocus={() => bringToFront('arcade')}
            isMaximized={apps.arcade.isMaximized}
            toggleMax={() => updateApp('arcade', 'isMaximized', !apps.arcade.isMaximized)}
            minimize={() => updateApp('arcade', 'isMinimized', true)}
            close={() => updateApp('arcade', 'isOpen', false)}
          />
        )}
      </main>

      <Dock apps={apps} toggleApp={toggleApp} isHidden={isAnyAppMaximized} />
    </div>
  );
}

export default App;