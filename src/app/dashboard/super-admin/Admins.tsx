'use client';
import Breadcrumb from 'components/Dashboard/Breadcrumbs/Breadcrumb';
import DefaultLayout from 'components/Dashboard/DefaultLayout';
import AllAdmin from 'components/SuperAdmin/AllAdmin/AllAdmin';
import CreateAdmin from 'components/SuperAdmin/CreateAdmin/CreateAdmin';
import React, { useState } from 'react';
import { ADMIN_PERMISSIONS } from 'data/adminPermissions';

import { Admin } from 'types/type';

const Admins = ({ admins }: { admins: Admin[] }) => {
  const [editAdmin, setEditAdmin] = useState<Admin | undefined>();
  const [selecteMenu, setselecteMenu] = useState<string | null | undefined>(
    'AllAdmin'
  );

  // Only set while editing an existing admin; undefined means "create new".
  // Carries the id so the update mutation knows which admin to change.
  const editValues: Admin | undefined = editAdmin
    ? {
        id: editAdmin.id,
        fullname: editAdmin.fullname,
        email: editAdmin.email,
        password: editAdmin.password,
        status: editAdmin.status || 'DRAFT',
        ...Object.fromEntries(
          ADMIN_PERMISSIONS.map((permission) => [
            permission,
            Boolean(editAdmin[permission])
          ])
        )
      }
    : undefined;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Super Admin" />
      <div className="mt-10">
        {selecteMenu == 'AllAdmin' ? (
          <AllAdmin
            setselecteMenu={setselecteMenu}
            setEditAdmin={setEditAdmin}
            AllAdmins={admins}
          />
        ) : (
          <CreateAdmin
            setselecteMenu={setselecteMenu}
            EditInitialValues={editAdmin}
            setEditProduct={setEditAdmin}
            EditAdminValue={editValues}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default Admins;
