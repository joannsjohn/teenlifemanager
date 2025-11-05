import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RootStackParamList, MainTabParamList } from '../types';

type ScreenName = keyof RootStackParamList;
type TabName = keyof MainTabParamList;

interface NavigationContextType {
  currentScreen: ScreenName;
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
  screenHistory: ScreenName[];
}

interface TabNavigationContextType {
  currentTab: TabName;
  navigateTab: (tab: TabName) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);
const TabNavigationContext = createContext<TabNavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

export const useTabNavigation = () => {
  const context = useContext(TabNavigationContext);
  if (!context) {
    throw new Error('useTabNavigation must be used within TabNavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
  initialScreen?: ScreenName;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ 
  children, 
  initialScreen = 'Test' 
}) => {
  const [screenHistory, setScreenHistory] = useState<ScreenName[]>([initialScreen]);

  const navigate = (screen: ScreenName) => {
    setScreenHistory(prev => [...prev, screen]);
  };

  const goBack = () => {
    setScreenHistory(prev => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  const currentScreen = screenHistory[screenHistory.length - 1];

  return (
    <NavigationContext.Provider value={{ currentScreen, navigate, goBack, screenHistory }}>
      {children}
    </NavigationContext.Provider>
  );
};

interface TabNavigationProviderProps {
  children: ReactNode;
  initialTab?: TabName;
}

export const TabNavigationProvider: React.FC<TabNavigationProviderProps> = ({
  children,
  initialTab = 'Schedule'
}) => {
  const [currentTab, setCurrentTab] = useState<TabName>(initialTab);

  const navigateTab = (tab: TabName) => {
    setCurrentTab(tab);
  };

  return (
    <TabNavigationContext.Provider value={{ currentTab, navigateTab }}>
      {children}
    </TabNavigationContext.Provider>
  );
};

