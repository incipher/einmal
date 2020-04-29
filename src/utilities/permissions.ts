import { Permissions } from 'react-native-unimodules';

export const requestCameraPermission = (): Promise<
  Permissions.PermissionResponse
> => {
  return Permissions.askAsync(Permissions.CAMERA);
};

export const requestExternalStoragePermission = (): Promise<
  Permissions.PermissionResponse
> => {
  return Permissions.askAsync(Permissions.CAMERA_ROLL);
};
