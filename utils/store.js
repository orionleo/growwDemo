import { create } from "zustand";

const useStore = create((set) => ({
  photos: [],
  photoCache: {},
  userCache: {},
  userPhotosCache: {},
  userPhotocsPageCache:{},
  cacheExpiration: 3600000, // 1 hour in milliseconds
  setPhotos: (photos) => set({ photos }),
  setPhotoCache: (page, data) =>
    set((state) => ({
      photoCache: {
        ...state.photoCache,
        [page]: { data, timestamp: Date.now() }, // Include a timestamp for the cache entry
      },
    })),
  setUserCache: (username) =>
    set(state=>({ userCache: {...state.userCache,[username.username]:{username,timestamp:Date.now()}} })),
  setUserPhotosCache: (userId, photos) =>
    set((state) => ({
      userPhotosCache: { ...state.userPhotosCache, [userId]:{photos,timestamp:Date.now()} },
    })),
    resetUserCache:()=>set({userCache:[]}),
    resetUserPhotosCache:()=>set({userPhotosCache:{}}),
    resetUserPhotocsPageCache:()=>set({userPhotocsPageCache:{}}),
    setUserPhotocsPageCache: (username, page, pics) =>
  set((state) => ({
    userPhotocsPageCache: {
      ...state.userPhotocsPageCache,
      [username]: {
        ...state.userPhotocsPageCache[username],
        [page]: { pics, timestamp: Date.now() }, // Include a timestamp for the cache entry
      },
    },
  })),
}));

export default useStore;
