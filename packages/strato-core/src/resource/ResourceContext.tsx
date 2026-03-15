import { createContext, useContext } from 'react';

export const ResourceContext = createContext<string | undefined>(undefined);

export const useResource = () => useContext(ResourceContext);
