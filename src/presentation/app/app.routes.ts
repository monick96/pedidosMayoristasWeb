import { Routes } from '@angular/router';
import { adminGuard } from './guard/admin-guard';

export const routes: Routes = [
    {
        path:'productos', 
        loadComponent: ()=>import ('./products/lista-productos-grid/lista-productos-grid').then(m=> m.ListaProductos),
        
    },
    //RUTA DE LOGIN
    {
        path: 'login',
        loadComponent: () => import('./admin/admin-login/admin-login').then(m => m.AdminLogin)
    },
    {
        path: 'admin',
        loadComponent: () => import('./admin/admin-layout/admin-layout').then(m => m.AdminLayout),
        canActivate: [adminGuard],// Protegemos TODAS las rutas hijas de /admin con el guard
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
