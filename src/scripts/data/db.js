import { openDB } from 'idb';

const DB_NAME = 'dicostory-db';
const DB_VERSION = 2;
const STORE_FAVORITES = 'favorite-stories';
const STORE_OUTBOX = 'outbox-stories';
const STORE_CACHED = 'cached-stories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(database) {
    if (!database.objectStoreNames.contains(STORE_FAVORITES)) {
      database.createObjectStore(STORE_FAVORITES, { keyPath: 'id' });
    }
    if (!database.objectStoreNames.contains(STORE_OUTBOX)) {
      database.createObjectStore(STORE_OUTBOX, { keyPath: 'id', autoIncrement: true });
    }
    if (!database.objectStoreNames.contains(STORE_CACHED)) {
      database.createObjectStore(STORE_CACHED, { keyPath: 'id' });
    }
  },
});

const DatabaseHelper = {
  // --- FAVORITE STORIES (Bookmark Offline) ---
  async getFavoriteStories() {
    const db = await dbPromise;
    return db.getAll(STORE_FAVORITES);
  },

  async getFavoriteStory(id) {
    if (!id) return null;
    const db = await dbPromise;
    return db.get(STORE_FAVORITES, id);
  },

  async isFavoriteStory(id) {
    if (!id) return false;
    const story = await this.getFavoriteStory(id);
    return Boolean(story);
  },

  async saveFavoriteStory(story) {
    if (!story || !story.id) return;
    const db = await dbPromise;
    return db.put(STORE_FAVORITES, story);
  },

  async deleteFavoriteStory(id) {
    if (!id) return;
    const db = await dbPromise;
    return db.delete(STORE_FAVORITES, id);
  },

  // --- OUTBOX STORIES (Background / Offline Sync) ---
  async saveOutboxStory(story) {
    const db = await dbPromise;
    return db.add(STORE_OUTBOX, {
      ...story,
      createdAt: new Date().toISOString(),
    });
  },

  async getOutboxStories() {
    const db = await dbPromise;
    return db.getAll(STORE_OUTBOX);
  },

  async deleteOutboxStory(id) {
    const db = await dbPromise;
    return db.delete(STORE_OUTBOX, id);
  },

  async countOutboxStories() {
    const db = await dbPromise;
    return db.count(STORE_OUTBOX);
  },

  // --- CACHED STORIES (Offline Dynamic Content Cache) ---
  async cacheStories(stories) {
    if (!Array.isArray(stories)) return;
    const db = await dbPromise;
    const tx = db.transaction(STORE_CACHED, 'readwrite');
    for (const story of stories) {
      if (story && story.id) {
        tx.store.put(story);
      }
    }
    await tx.done;
  },

  async getCachedStories() {
    const db = await dbPromise;
    return db.getAll(STORE_CACHED);
  },

  async getCachedStory(id) {
    if (!id) return null;
    const db = await dbPromise;
    return db.get(STORE_CACHED, id);
  },
};

export default DatabaseHelper;
