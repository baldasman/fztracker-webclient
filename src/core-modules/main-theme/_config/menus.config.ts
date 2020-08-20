import { OpenSystemModalComponent } from '../components/features/system/open-system/open-system-modal.component';
import { AboutModalComponent } from '../components/features/help/about-modal/about-modal.component';
// import { NewditSystemModalComponent } from '../components/features/system/newdit-system/newdit-system-modal.component';

export enum menuDatasources {
  closeSystem = 'CLOSE_SYSTEM',
  exportSystemWebtool = 'EXPORT_SYSTEM_WEBTOOL',
  exportSystemWorkspace = 'EXPORT_SYSTEM_WORKSPACE',
  importSystemWebtool = 'IMPORT_SYSTEM_WEBTOOL',
  importSystemWorkspace = 'IMPORT_SYSTEM_WORKSPACE',
  saveSystem = 'SAVE_SYSTEM'
}

export const menus = {
  header: {
    self: {},
    items: [
      {
        title: 'app.menus.system',
        root: true,
        alignment: 'left',
        toggle: 'click',
        submenu: [
          // ADD SYSTEM FEATURE
          // {
          //   title: 'app.menus.new',
          //   bullet: 'dot',
          //   icon: 'fas fa-file',
          //   modal: {
          //     component: NewditSystemModalComponent,
          //     class: 'dialog-width-25'
          //   }
          // },
          {
            title: 'app.menus.open',
            bullet: 'dot',
            icon: 'fas fa-folder-open',
            modal: {
              component: OpenSystemModalComponent,
              class: 'dialog-width-25'
            }
          },
          {
            title: 'app.menus.save',
            bullet: 'dot',
            icon: 'fas fa-cloud-upload-alt',
            datasource: menuDatasources.saveSystem
          },
          {
            title: 'app.menus.advanced',
            bullet: 'dot',
            icon: 'fas fa-mouse-pointer',
            submenu: [
              {
                title: 'app.menus.import_project',
                icon: 'fas fa-upload',
                datasource: menuDatasources.importSystemWorkspace
                // submenu: [
                //   {
                //     title: 'app.menus.workspace',
                //     datasource: menuDatasources.importSystemWorkspace
                //   },
                //   {
                //     title: 'app.menus.webtool',
                //     datasource: menuDatasources.importSystemWebtool
                //   }
                // ]
              },
              // {
              //   title: 'app.menus.export',
              //   icon: 'fas fa-download',
              //   submenu: [
              //     {
              //       title: 'app.menus.workspace',
              //       datasource: menuDatasources.exportSystemWorkspace,
              //     },
              //     {
              //       title: 'app.menus.webtool',
              //       datasource: menuDatasources.exportSystemWebtool,
              //     }
              //   ]
              // }
            ]
          },
          {
            title: 'app.menus.close',
            bullet: 'dot',
            icon: 'fas fa-times',
            datasource: menuDatasources.closeSystem
          }
        ]
      },
      {
        title: 'app.menus.help',
        root: true,
        alignment: 'left',
        toggle: 'click',
        submenu: [
          {
            title: 'app.menus.about',
            bullet: 'dot',
            icon: 'flaticon-interface-7',
            modal: {
              component: AboutModalComponent,
              class: 'dialog-width-50'
            }
          }
        ]
      }
    ]
  }
};
