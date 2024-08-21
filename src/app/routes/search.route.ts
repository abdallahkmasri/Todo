import { Routes } from "@angular/router";
import { SearchListComponent } from "../components/search/list.component";

export const SearchRoutes: Routes = [
    {
        path:':searchparams',
        component: SearchListComponent
    }
]