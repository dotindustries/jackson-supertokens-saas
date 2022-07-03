import { ResourceType } from '@app/config/auth';

export type ResourceFactory = () => {
  resource: { objectId: string; objectType: ResourceType } | undefined;
  isLoading: boolean;
};
export type PermissionRequirement = {
  permission: string;
  subject?: { objectId: string; objectType: ResourceType };
  resourceFn: ResourceFactory;
};
