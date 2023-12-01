import React, { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

type RequirePermissionType = {
  permission: boolean;
  redirect: string;
  children: React.ReactNode;
} & PropsWithChildren;

function RequirePermission({
  permission,
  redirect,
  children,
}: RequirePermissionType) {
  if (!permission) {
    return <Navigate to={redirect} />;
  } else {
    return children;
  }
}

export default RequirePermission;
