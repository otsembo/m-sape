export const saveUser =  (uid: string): void => localStorage.setItem("uid", uid);
export const getUser = (): string|null => localStorage.getItem("uid");
export const removeUser = (): void => localStorage.removeItem("uid");
