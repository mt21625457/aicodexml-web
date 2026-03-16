import { Component } from '@angular/core';
import {ProfilePreferencesComponent} from '@common/settings/admin/profile-preferences/profile-preferences.component';
import {ProfileKeyStorageComponent} from '@common/settings/admin/profile-key-storage/profile-key-storage.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'sm-webapp-configuration',
    imports: [
        ProfilePreferencesComponent,
        ProfileKeyStorageComponent,
        TranslatePipe,
    ],
    templateUrl: './webapp-configuration.component.html',
    styleUrl: './webapp-configuration.component.scss'
})
export class WebappConfigurationComponent {

}
