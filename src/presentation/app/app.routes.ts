import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'home', 
        loadComponent: ()=>import ('./products/lista-productos-grid/lista-productos-grid').then(m=> m.ListaProductos)
    },
    {
        path:'**',
        redirectTo:'home'
    }
];
