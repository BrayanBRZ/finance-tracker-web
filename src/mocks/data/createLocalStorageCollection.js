function seedCollection(storageKey, initialData) {
  localStorage.setItem(storageKey, JSON.stringify(initialData))
  return initialData
}

export function createLocalStorageCollection({ storageKey, initialData }) {
  return {
    read() {
      const storedData = localStorage.getItem(storageKey)

      if (!storedData) {
        return seedCollection(storageKey, initialData)
      }

      try {
        return JSON.parse(storedData)
      } catch {
        return seedCollection(storageKey, initialData)
      }
    },

    write(data) {
      localStorage.setItem(storageKey, JSON.stringify(data))
    },
  }
}
