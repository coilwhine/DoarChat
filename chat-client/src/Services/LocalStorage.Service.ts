class LocalStorageService {
  formatKey(key: string): string {
    return `client:${key}`;
  }

  setItem<T>(key: string, value: T): void {
    const formattedKey = this.formatKey(key);
    const valueStringified = JSON.stringify(value);
    localStorage.setItem(formattedKey, valueStringified);
  }

  getItem<T>(key: string): T | null {
    const formattedKey = this.formatKey(key);
    const raw = localStorage.getItem(formattedKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as T;
    } catch {
      console.error("Failed to parse server data for key:", key);
      return null;
    }
  }

  removeItem(key: string): void {
    const formattedKey = this.formatKey(key);
    localStorage.removeItem(formattedKey);
  }
}

const localStorageService = new LocalStorageService();
export default localStorageService;
