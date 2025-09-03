import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, UserRole } from '@/types'

interface AuthState {
  isLoggedIn: boolean
  currentUser: User | null // Changed from userEmail to currentUser
  userRole: UserRole
  registeredUsers: User[]
  login: (email: string, password: string) => boolean
  register: (email: string, password: string, name: string) => boolean
  changePassword: (email: string, currentPassword: string, newPassword: string) => boolean
  updateUserProfile: (email: string, updates: { name?: string; avatar?: string }) => boolean // New action
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      currentUser: null, // Initialize currentUser as null
      userRole: 'guest',
      registeredUsers: [
        { id: 'admin-user', name: 'Admin User', email: 'admin@example.com', password: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&q=80' },
        { id: 'basic-user', name: 'Basic User', email: 'user@example.com', password: 'user', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&q=80' },
        // Admin user: seyficembaskin@gmail.com with updated password
        { id: 'seyfi-admin-new', name: 'Seyfi Cembaskin', email: 'seyficembaskin@gmail.com', password: 'Vuv6kaja0', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Seyfi' },
        // New admin user: info@nxyz.art
        { id: 'nxyz-admin', name: 'NXYZ Admin', email: 'info@nxyz.art', password: 'password', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=NXYZ' },
      ],
      login: (email, password) => {
        const user = get().registeredUsers.find(
          (u) => u.email === email && u.password === password
        )
        if (user) {
          const adminEmails = ['admin@example.com', 'seyficembaskin@gmail.com', 'info@nxyz.art'];
          const role: UserRole = adminEmails.includes(user.email!) ? 'admin' : 'basic'
          set({ isLoggedIn: true, currentUser: user, userRole: role }) // Set currentUser
          return true
        }
        return false
      },
      register: (email, password, name) => {
        const existingUser = get().registeredUsers.some((u) => u.email === email)
        if (existingUser) {
          return false
        }

        const newUser: User = {
          id: `user-${Date.now()}`,
          name: name,
          email: email,
          password: password,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name.replace(/\s/g, '')}`,
        }

        set((state) => ({
          registeredUsers: [...state.registeredUsers, newUser],
          isLoggedIn: true,
          currentUser: newUser, // Set currentUser
          userRole: 'basic',
        }))
        return true
      },
      changePassword: (email, currentPassword, newPassword) => {
        const userIndex = get().registeredUsers.findIndex(
          (u) => u.email === email && u.password === currentPassword
        )

        if (userIndex === -1) {
          return false // User not found or current password incorrect
        }

        set((state) => {
          const updatedUsers = [...state.registeredUsers]
          updatedUsers[userIndex] = {
            ...updatedUsers[userIndex],
            password: newPassword,
          }
          // If the current user's password is changed, update currentUser as well
          if (state.currentUser?.email === email) {
            return { registeredUsers: updatedUsers, currentUser: { ...state.currentUser, password: newPassword } }
          }
          return { registeredUsers: updatedUsers }
        })
        return true
      },
      updateUserProfile: (email, updates) => {
        const userIndex = get().registeredUsers.findIndex((u) => u.email === email);

        if (userIndex === -1) {
          return false; // User not found
        }

        set((state) => {
          const updatedUsers = [...state.registeredUsers];
          const updatedUser = {
            ...updatedUsers[userIndex],
            ...updates,
          };
          updatedUsers[userIndex] = updatedUser;

          // If the current user's profile is changed, update currentUser as well
          if (state.currentUser?.email === email) {
            return { registeredUsers: updatedUsers, currentUser: updatedUser };
          }
          return { registeredUsers: updatedUsers };
        });
        return true;
      },
      logout: () => {
        set({ isLoggedIn: false, currentUser: null, userRole: 'guest' }) // Clear currentUser on logout
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)