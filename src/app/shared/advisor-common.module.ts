import { CommonModule } from "@angular/common";
import { MatInputModule } from '@angular/material/input';
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';


const modules: any[] = [
    CommonModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
]

/**
 * Common modules. import everywhere to prevent having to import many of
 * the commonly udes modules.
 */
@NgModule({
    imports: [...modules],
    exports: [...modules]
})

export class AdvisorCommonModule { }