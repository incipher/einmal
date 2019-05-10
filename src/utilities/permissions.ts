import { Permissions } from 'expo';

export const acquireCameraPermission = async (): Promise<boolean> => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA);
  return status === 'granted';
};
