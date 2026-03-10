import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'productos', 
        loadComponent: ()=>import ('./products/lista-productos-grid/lista-productos-grid').then(m=> m.ListaProductos),
        
    },
    {
        path: 'admin',
        loadComponent: () => import('./admin/admin-layout/admin-layout').then(m => m.AdminLayout),
        children: [
        {
            path: 'config',
            loadComponent: () => import('./admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
        },
        {
            path: 'productos',
            loadComponent: () => import('./admin/admin-productos/admin-productos').then(m => m.AdminProductos)
        },
        // Redirigir /admin a /admin/config por defecto
        { path: '', redirectTo: 'config', pathMatch: 'full' }
        ]
    },
    {
        path:'**',
        redirectTo:'productos'
    }
];
