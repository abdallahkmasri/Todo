import { Routes } from "@angular/router";
import { DashboardComponent } from "../components/dashboard/list.component";
import { TaskDetailComponent } from "../components/task/detail.component";

export const DashboardRoute: Routes = [
    {
        path: '',
        component: DashboardComponent,
    },
    {
        path: ':id',
        component: TaskDetailComponent
    }
]