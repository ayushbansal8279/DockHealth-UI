export interface INameBase {
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
}

export type INameExtends = INameBase & Record<string, any>;
