// Every permission an admin can be granted, grouped for the create/edit form.
// Field names match the `Admins` model in the backend (including its typos),
// so they can be sent straight to the createAdmin/updateAdmin mutations.

export type AdminPermission =
  | 'canAddProduct'
  | 'canEditProduct'
  | 'canDeleteProduct'
  | 'canVeiwTotalproducts'
  | 'canViewAccessories'
  | 'canAddCategory'
  | 'canEditCategory'
  | 'canDeleteCategory'
  | 'canVeiwTotalCategories'
  | 'canViewOrders'
  | 'canViewFreeSampleOrders'
  | 'canViewAbandonedOrders'
  | 'canViewMeasurementAppointments'
  | 'canViewInstallationAppointments'
  | 'canViewBlogs'
  | 'canViewRedirectUrls'
  | 'canCheckProfit'
  | 'canCheckRevenue'
  | 'canCheckVisitors'
  | 'canViewUsers'
  | 'canViewSales'
  | 'canVeiwAdmins';

export interface AdminPermissionOption {
  name: AdminPermission;
  label: string;
}

export interface AdminPermissionGroup {
  title: string;
  options: AdminPermissionOption[];
}

export const ADMIN_PERMISSION_GROUPS: AdminPermissionGroup[] = [
  {
    title: 'Products',
    options: [
      { name: 'canVeiwTotalproducts', label: 'View Products page' },
      { name: 'canAddProduct', label: 'Add Product' },
      { name: 'canEditProduct', label: 'Edit Product' },
      { name: 'canDeleteProduct', label: 'Delete Product' },
      { name: 'canViewAccessories', label: 'View Accessories page' }
    ]
  },
  {
    title: 'Categories',
    options: [
      { name: 'canVeiwTotalCategories', label: 'View Categories pages' },
      { name: 'canAddCategory', label: 'Add Category' },
      { name: 'canEditCategory', label: 'Edit Category' },
      { name: 'canDeleteCategory', label: 'Delete Category' }
    ]
  },
  {
    title: 'Orders',
    options: [
      { name: 'canViewOrders', label: 'View Orders page' },
      { name: 'canViewFreeSampleOrders', label: 'View Free Sample Orders page' },
      { name: 'canViewAbandonedOrders', label: 'View Abandoned Orders page' }
    ]
  },
  {
    title: 'Appointments',
    options: [
      {
        name: 'canViewMeasurementAppointments',
        label: 'View Measurement Appointments page'
      },
      {
        name: 'canViewInstallationAppointments',
        label: 'View Installation Appointments page'
      }
    ]
  },
  {
    title: 'Content',
    options: [
      { name: 'canViewBlogs', label: 'View Blogs page' },
      { name: 'canViewRedirectUrls', label: 'View Redirect URLs page' }
    ]
  },
  {
    title: 'Dashboard stats',
    options: [
      { name: 'canCheckProfit', label: 'Check Profit' },
      { name: 'canCheckRevenue', label: 'Check Revenue' },
      { name: 'canCheckVisitors', label: 'Check Visitors' },
      { name: 'canViewUsers', label: 'View Users' },
      { name: 'canViewSales', label: 'View Sales' },
      { name: 'canVeiwAdmins', label: 'View Admins' }
    ]
  }
];

export const ADMIN_PERMISSIONS: AdminPermission[] = ADMIN_PERMISSION_GROUPS.flatMap(
  (group) => group.options.map((option) => option.name)
);

// Which permission an admin needs to open each dashboard page. Pages not
// listed here (the dashboard home) are open to every logged-in admin.
export const DASHBOARD_PAGE_PERMISSIONS: Record<string, AdminPermission> = {
  '/dashboard/products': 'canVeiwTotalproducts',
  '/dashboard/accessories': 'canViewAccessories',
  '/dashboard/category': 'canVeiwTotalCategories',
  '/dashboard/subcategory': 'canVeiwTotalCategories',
  '/dashboard/orders': 'canViewOrders',
  '/dashboard/free-sample': 'canViewFreeSampleOrders',
  '/dashboard/abundant': 'canViewAbandonedOrders',
  '/dashboard/measurement-appointment': 'canViewMeasurementAppointments',
  '/dashboard/installation-appointments': 'canViewInstallationAppointments',
  '/dashboard/blogs': 'canViewBlogs',
  '/dashboard/Redirecturls': 'canViewRedirectUrls'
};

export const getRequiredPermission = (
  pathname: string
): AdminPermission | undefined => {
  const match = Object.keys(DASHBOARD_PAGE_PERMISSIONS).find(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );
  return match ? DASHBOARD_PAGE_PERMISSIONS[match] : undefined;
};
