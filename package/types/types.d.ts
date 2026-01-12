export interface SnythConfig {
  version: string;
  projectType: 'react' | 'react-native' | 'nextjs';
  ts: boolean;
  mode: 'both' | 'light' | 'dark';
  dir: string;
  components: string[];
  createdAt: string;
}

export interface ComponentType {
  id: string;
  name: string;
  language: {
    ts: string;
    js: string;
  };
  fileName: {
    ts: string;
    js: string;
  };
  dependencies: string[];
}
export interface ListType {
  components: string[];
}
