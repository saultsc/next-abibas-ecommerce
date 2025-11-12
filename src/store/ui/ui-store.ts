import { create } from 'zustand';

interface State {
	isSideMenuOpen: boolean;
	isAdminSidebarCollapsed: boolean;

	openSideMenu: () => void;
	closeSideMenu: () => void;
	toggleAdminSidebar: () => void;
	setAdminSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUiStore = create<State>()((set) => ({
	isSideMenuOpen: false,
	isAdminSidebarCollapsed: false,

	openSideMenu: () => set({ isSideMenuOpen: true }),
	closeSideMenu: () => set({ isSideMenuOpen: false }),
	toggleAdminSidebar: () =>
		set((state) => ({ isAdminSidebarCollapsed: !state.isAdminSidebarCollapsed })),
	setAdminSidebarCollapsed: (collapsed: boolean) => set({ isAdminSidebarCollapsed: collapsed }),
}));
