export interface Employee {
  id: string;
  name: string;
  email: string;
  picture?: string;
  company: {
    id: string;
    name: string;
  };
  manager?: {
    id: string;
    name: string;
  };
  subordinates: {
    id: string;
    name: string;
  }[];
  peers: {
    id: string;
    name: string;
  }[];
  secondLevelSubordinates: {
    id: string;
    name: string;
  }[];
}
