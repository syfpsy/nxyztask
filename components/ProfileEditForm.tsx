'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/authStore'

const ProfileEditForm = () => {
  const { currentUser, updateUserProfile } = useAuthStore()
  const [name, setName] = useState(currentUser?.name || '')
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || '') // For URL input
  const [avatarFile, setAvatarFile] = useState<File | null>(null) // For file upload
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || '') // For displaying preview
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setAvatarUrl(currentUser.avatar || '');
      setAvatarPreview(currentUser.avatar || '');
    }
  }, [currentUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string); // Set preview to Base64
      };
      reader.readAsDataURL(file);
      setAvatarUrl(''); // Clear URL input if file is selected
    } else {
      setAvatarFile(null);
      setAvatarPreview(currentUser?.avatar || ''); // Reset preview if no file
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setAvatarUrl(url);
    setAvatarFile(null); // Clear file if URL is typed
    setAvatarPreview(url); // Set preview to URL
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!currentUser?.email) {
      setError('You must be logged in to update your profile.')
      return
    }

    let finalAvatarValue = '';
    if (avatarFile) {
      // If a file is uploaded, use its Base64 string
      finalAvatarValue = avatarPreview;
    } else if (avatarUrl) {
      // Otherwise, if a URL is provided, use it
      finalAvatarValue = avatarUrl;
    }
    // If both are empty, finalAvatarValue will be '', effectively clearing the avatar

    const success = updateUserProfile(currentUser.email, { name, avatar: finalAvatarValue })

    if (success) {
      setMessage('Profile updated successfully!')
    } else {
      setError('Failed to update profile.')
    }
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8 max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Edit Profile</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Profile Picture (Upload or URL)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200 dark:hover:file:bg-blue-800"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
            Or provide a URL:
          </p>
          <input
            type="url"
            value={avatarUrl}
            onChange={handleUrlChange}
            placeholder="e.g., https://example.com/avatar.jpg"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {avatarPreview && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Preview:</span>
              <img src={avatarPreview} alt="Avatar Preview" className="w-8 h-8 rounded-full object-cover" />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition-colors"
        >
          Update Profile
        </button>
        {message && <p className="text-green-600 dark:text-green-400 text-sm mt-2">{message}</p>}
        {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>}
      </form>
    </div>
  )
}

export default ProfileEditForm