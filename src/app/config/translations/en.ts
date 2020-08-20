export const locale = {
  lang: 'en',
  data: {
    // Global app/configuration translations.
    app: {
      title: 'WebTool',
      description: `WebTool is a tool to make your systems management easy!
        <br><br>This will offer you a list of actions you can perform over them such as managing gateways (adding, editing, removing, etc.) or managing devices of those gateways in a very simple way.
        <br><br>It also allows you to import or export your workspaces so that you can either continue working oustide this tool or catching up with some previous work you started elsewhere.`,

      date_formats: {
        full: 'EEEE, MMMM d, y \'at\' h:mm:ss a',
        short: 'M/d/yy, h:mm a'
      },

      menus: {
        about: 'About',
        advanced: 'Advanced',
        close: 'Close',
        export: 'Export',
        help: 'Help',
        import_project: 'Import project',
        new: 'New',
        open: 'Open',
        save: 'Save',
        system: 'System',
        webtool: 'Webtool',
        workspace: 'Workspace'
      }
    },

    // Single words, ALWAYS lowercased.
    dictionary: {
      about: 'about',
      actions: 'actions',
      active: 'active',
      add: 'add',
      added: 'added',
      address: 'address',
      all: 'all',
      bindings: 'bindings',
      cancel: 'cancel',
      choose: 'choose',
      clear: 'clear',
      close: 'close',
      completed: 'completed',
      communications: 'communications',
      congratulations: 'congratulations',
      connect: 'connect',
      connected: 'connected',
      confirm: 'confirm',
      coordinates: 'coordinates',
      coordinator: 'coordinator',
      create: 'create',
      current: 'current',
      date: 'date',
      delete: 'delete',
      deploy: 'deploy',
      deploying: 'deploying',
      deployed: 'deployed',
      description: 'description',
      desktop: 'desktop',
      device: 'device',
      devices: 'devices',
      disconnect: 'disconnect',
      edit: 'edit',
      edited: 'edited',
      entity: 'entity',
      error: 'error',
      filter: 'filter',
      finish: 'finish',
      format: 'format',
      gateway: 'gateway',
      gateways: 'gateways',
      group: 'group',
      groups: 'groups',
      hi: 'hi',
      id: 'identifier',
      import: 'import',
      inactive: 'inactive',
      keep: 'keep',
      lat: 'lat',
      latitude: 'latitude',
      loading: 'loading',
      location: 'location',
      longitude: 'longitude',
      log: 'log',
      manufacturer: 'manufacturer',
      modules: 'modules',
      name: 'name',
      new: 'new',
      next: 'next',
      no: 'no',
      notes: 'notes',
      off: 'off',
      ok: 'ok',
      on: 'on',
      open: 'open',
      or: 'or',
      output: 'output',
      parameter: 'parameter',
      parameters: 'parameters',
      parity: 'parity',
      pending: 'pending',
      previous: 'previous',
      proceed: 'proceed',
      property: 'property',
      ready: 'ready',
      realtime: 'realtime',
      remaining: 'remaining',
      replace: 'replace',
      registers: 'registers',
      restore: 'restore',
      save: 'save',
      saved: 'saved',
      search: 'search',
      select: 'select',
      settings: 'settings',
      submit: 'submit',
      start: 'start',
      state: 'state',
      status: 'status',
      system: 'system',
      tag: 'tag',
      timezone: 'timezone',
      type: 'type',
      token: 'token',
      value: 'value',
      version: 'version',
      yes: 'yes',
      zone: 'zone'
    },

    // Forms (fields) related translations
    forms: {
      apn: { label: 'APN' },
      gprs: { label: 'GPRS' },
      password: { label: 'Password' },
      user: { label: 'User' },
      zone: { label: 'Zone', placeholder: 'Choose the best zone that applies', management_default_title: 'Zones list' }
    },

    // Specific translations to specific features (modules).
    features: {
      authentication: {
        messages: {
          all_fields_filled: 'Please, fill all necessary fields',
          login_error: 'Authentication failed. Please verify your information and try again',
          login_success: 'Login successfull'
        }
      },
      home: {
        gateway: {
          routes: {
            application_bindings: 'Application Bindings',
            console: 'Console',
            dashboard: 'Dashboard',
            field_devices: 'Field Devices',
            projects: 'Projects'
          }
        }
      },
      console: {
        labels: {
          get: 'Get',
          set: 'Set',
        },
        messages: {
          gateway_offline: 'It seems that the gateway <b>{{gatewayName}}</b> is <b>offline</b>.<br />Please, verify the connectivity to be able to use the console.'
        },
        notifications: {
          error_get_command: 'Error fetching {{property}} value',
          error_set_command: 'Error setting value for {{property}}',
          success_set_command: 'Value send for {{property}}',
          status_update_error: 'Unable to perform the requested operation',
          status_update_off: 'Successfully disconnected',
          status_update_on: 'Successfully connected',
          warning_realtime_off: 'Realtime is switch off. Turn it on to be able to interact.',
        }
      },
      deploy: {
        actions: {
          restore_this_version: 'Restore this version'
        },
        labels: {
          describe_your_deploy: 'Describe your deploy',
          last_deploy: 'Last deploy'
        },
        messages: {
          choose_gateways_to_deploy: 'Choose one or more gateways to deploy',
          deploy_notes_info: 'If more than one Gateway is chosen, each Gateway deploy will receive the same deploy note',
          deploy_started: 'Deploy started...',
          deploy_successful: 'Deploy successfull',
          deploy_failed: 'Deploy failed',
          error_trying_deploy: 'There was an error trying to deploy.<br>Please save the <strong>System</strong> and try to <strong>deploy</strong> again',
          no_deploy: 'No deploy',
          view_deploy_info: 'View deploy info'
        },
        notifications: {
          deploy_failed: 'Deploy failed for gateway {{gateway}}',
          deploy_started: 'Deploy started for selected gateways',
          deploy_successful: 'Deploy successfull for gateway {{gateway}}',
        },
        states: {
          STARTED: 'Started',
          PROGRESS: 'Deploying',
          COMPLETE: 'Successful deploy',
          'ERROR: GATEWAY NOT CONNECTED!': 'Gateway not connected',
          'ERROR: EMPTY PROJECT FILE': 'Empty project',
          'ERROR: OPENING PROJECT FILE': 'Error opening project file',
          'ERROR: OPENING PROJECT DEFINITIONS FILE': 'Error opening project definitions file',
          'ERROR: UNPACKING PROJECT PACKAGE FILE': 'Error unpacking project package file',
          'ERROR: GETTING PROJECT PACKAGE FILE': 'Error getting project package file',
          'PROGRESS:100': 'Successful deploy'
        }
      },
      error_pages: {
        page_not_found: {
          message_01: 'Hum... It appears that something went wrong!',
          message_02: 'Give us time while we get it fixed.',
          action: 'Head to the confort of HOME...'
        }
      },
      errors: {
        loading_resource: 'Error loading {{resource}}'
      },
      field_devices: {
        delete: {
          field_devices_to_delete: 'Field Devices to be deleted'
        },
        list: {
          search_filter: 'Filter by name, zone or template name'
        },
        wizard: {
          steps: {
            identification: {
              title: 'Identification',
              step_title: 'Fill the identification information',
              description: 'Choose the a name and the location where the Field Device will be assotiated',
              chosen_device_template: 'Field Device template chosen'
            },
            configuration: {
              title: 'Configuration',
              step_title: 'Fill the necessary configuration',
              description: 'Fill all necessary information to configure this Field Device'
            }
          }
        }
      },
      gateway_connections: {
        open_gateway_connections_modal: 'Open Gateway connections modal'
      },
      gateway_management: {
        actions: {
          choose_equipment: 'Choose equipment'
        },
        licensing_states: {
          waiting: 'Waiting for initial gateway request',
          ongoing_boot: 'Gateway connected',
          ongoing_waiting_license: 'Waiting for license generation',
          retrying: 'Connection is unstable. Retrying license generation',
          completed_ok: 'Successfully created license',
          completed_error_timeout: 'The operation exceeded the allowed timeout',
          completed_error: 'An error occurred',
          completed_error_01: 'The operation failed to send license request',
          completed_error_02: 'The operation failed with an invalid license',
          completed_error_03: 'The operation is not authorized',
          unknown: 'Unknown state...'
        },
        titles: {
          choose_your_equipment: 'Choose your equipment',
          create_your_gateway: 'Create your gateway',
          register_gateway: 'Register a gateway',
          run_this_command: '1. Execute the following command',
          wait_for_a_license: '2. Wait for a license'
        },
        messages: {
          license_created: 'A new license was generated with the below information.',
          create_your_gateway: 'Choose this option to install our solution on a compatible equipment.',
          insert_valid_label_key: 'Please, insert the corresponding label ley of the serial number supplied',
          insert_valid_serial_number: 'Please, insert a valid gateway serial number',
          register_gateway: 'Use this method when you already have a gateway with a valid serial number and label key',
          run_this_command: 'You need to have access to the equipment to be able to execute the following command. Make sure your equipment is connected to the internet to be able to install all necessary packages.',
          wait_for_a_license: 'After executing the above instruction, a license will be generated and assigned to you. Follow the process here, and wait for following instructions.',
          error_try_again: 'The operation cannot be completed at this time. Verify if you have all the necessary conditions to be able to register your gateway, and try again.'
        }
      },
      application_bindings: {
        list: {
          search_filter: 'Filter by name, zone or Field Device'
        },
        wizard: {
          steps: {
            field_devices_list: {
              title: 'Field Device',
              step_title: 'Choose a Field Device',
              description: 'The application binding will be assotiated to the field device that you choose',
            },
            templates_list: {
              title: 'Template',
              step_title: 'Choose the template to apply',
              description: 'Choose the most usefull template to your necessity',
            },
            identification: {
              title: 'Identification',
              step_title: 'Fill the identification information',
              description: 'Choose the a name and zone where the application binding will be assotiated',
            },
            application_objects_list: {
              title: 'Configuration',
              step_title: 'Fill the necessary configuration',
              description: 'Fill all necessary information needed for each application object',
              error_0_items: 'It appears that the chosen template, does not have any application objects available.',
              error_invalid_configuration: 'Some items have invalid configurations. Please, review the information before proceed.',
              label_invalid_configuration: 'Invalid configuration'
            }
          }
        }
      },
      projects: {
        messages: {
          error_fetching_projects: 'An error occurred fetching projects',
          project_restored_successfully: 'Project restaured successfully',
          restore_warning: 'You are about to restore the version saved on <b>"{{date}}"</b>.<br />All current information will be replaced.<br /><br />Are you sure you want to continue?',
        },
        titles: {
          list: 'Project history list'
        }
      },

      dialogs: { // Specific dialogs.
        local_information_detected: {
          title: 'Updated local information found',
          message: 'An updated local copy of <b>"{{systemName}}"</b> was found. You may want to recover your local information to be able to save it to the server.<br /><br />How do you want to proceed?',
          load_from_local: 'Restore local copy',
          load_from_server: 'Discard local copy and load from server'
        },
        save_system_and_deploy: {
          title: 'Unsaved changes',
          message: 'This <b>system</b> has unsaved changes. In order to <b>deploy</b>, you need to save these changes. <br /><br />Do you want to save and continue?'
        },
        unable_to_load_system: {
          title: 'Error loading system',
          message: 'The system could not be loaded. It could be invalid or may have been deleted and no longer exists.',
          load_from_local: 'Restore local copy',
          load_from_server: 'Discard local copy and load from server'
        }
      },

      system_management: {
        titles: {
          import_project: 'Import project',
        },
        messages: {
          gateways_not_imported: '{{number}} gateway(s) were not imported, as they do not belong to this system',
          project_read_successfully: 'Project read successfully!',
          project_imported_successfully: 'Project imported successfully',
          verify_informations_and_select_action: 'Verify if the information is correct and select your action',
        }
      },

      wizards: { // Generic wizards steps.
        steps: {
          summary: {
            title: 'Summary',
            step_title: 'Here is a brief summary',
            description: 'Visualize all the configuration information'
          }
        }
      }
    },

    labels: {
      add_application_binding: 'Add application binding',
      add_application_bindings_to_field_devices: 'Add application bindings into your existing field devices',
      add_field_device: 'Add Field Device',
      add_field_device_from_library: 'Add a field device from field devices library',
      add_gateway: 'Add gateway',
      add_new_module: 'Add new module',
      advanced_options: 'Advanced options',
      additional_modules: 'Additional modules',
      all_states: 'All states',
      application_binding: 'Application Binding',
      application_bindings: 'Application Bindings',
      application_bindings_list: 'Application Bindings list',
      application_bindings_view: 'View application bindings',
      application_object: 'Application Object',
      application_objects: 'Application Objects',
      application_objects_total: 'Application Objects total',
      application_objects_view: 'View application objects',
      apply_filter: 'Apply filter',
      auto_scroll: 'Auto scroll',
      choose_a_location: 'Choose a location',
      choose_another_file: 'Choose another file',
      choose_format: 'Choose format',
      choose_registers: 'Choose registers',
      close_system: 'Close System',
      communications_channel: 'Communications channel',
      confirm_delete: 'Yes, delete!',
      connected_field_device: 'Connected Field Device',
      connection_status: 'Connection status',
      connection_type: 'Connection type',
      create_a_new_system: 'Create a new System',
      create_new_system: 'Create new system',
      create_system: 'Create System',
      created_by: 'Created by',
      current_gateway: 'Current gateway',
      current_gateway_label_key: 'Current gateway label key',
      datetime: 'Date time',
      delete_application_binding: 'Delete Application Binding',
      delete_device: 'Delete Device',
      delete_field_device: 'Delete Field Device',
      delete_field_devices: 'Delete Field Devices',
      delete_gateway: 'Delete gateway',
      delete_node: 'Delete node',
      deploy_ended_at: 'Deploy ended {{datetime}}',
      deploy_notes: 'Deploy notes',
      deploy_started_at: 'Deploy started {{datetime}}',
      deployed_only: 'Deployed only',
      device_driver: 'Device driver',
      edit_application_binding: 'Edit Application Binding',
      edit_device: 'Edit Device',
      edit_field_device: 'Edit field fevice',
      edit_gateway: 'Edit gateway',
      edit_system: 'Edit System',
      edit_gateway_details: 'Edit gateway details',
      edit_module_details: 'Edit module details',
      ethernet: 'Ethernet',
      field_device_groups: 'Field Device groups',
      field_device_template: 'Field Device template',
      field_device: 'Field Device',
      field_devices: 'Field Devices',
      field_devices_list: 'Field Devices list',
      field_devices_total: 'Total number of Field Devices',
      filter_log: 'Filter log',
      force_channel_silence: 'Force channel silence',
      gateway_connections: 'Gateway connections',
      gateway_details: 'Gateway details',
      gateway_name_deploy_info: '{{gatewayName}} deploy info',
      gprs: 'GPRS',
      individual_notes: 'Individual notes',
      insert_the: 'Insert the',
      ip_address: 'IP address',
      label_key: 'Label key',
      leave_current_operation: 'Leave current operation',
      main_zone: 'Main zone',
      manage_zones: 'Manage zones',
      missing_historical_data: 'Missing history',
      new_gateway: 'New gateway',
      new_gateway_label_key: 'New gateway label key',
      no_data: 'No data to display',
      no_results: 'No results found',
      no_system: 'No System',
      no_zones: 'No zones. Add your first one.',
      not_connected: 'Not connected',
      not_ready: 'Not ready',
      open_existing_system: 'Open an existing System',
      open_system: 'Open system',
      override_system: 'Override System',
      press_to_deploy: 'Press to deploy',
      press_to_save: 'Press to save',
      previous_deploys: 'Previous deploys',
      remote_address: 'Remote address',
      replace_gateway: 'Replace gateway',
      request_time: 'Request time',
      restore_project: 'Restore Project',
      save_and_deploy: 'Save & Deploy',
      select_entity: 'Select entity',
      select_gateway: 'Select one gateway',
      select_system: 'Select System',
      select_timezone: 'Select timezone',
      view_more: 'View more',
      sign_out: 'Sign out',
      start_configuring_devices_add_gateway: 'To start configuring your Devices, add a Gateway',
      stop_bits: 'Stop bits',
      system_coordinates: 'System coordinates',
      system_details: 'System details',
      system_entity: 'System entity',
      system_name: 'System name',
      system_timezone: 'System timezone',
      toggle_filters: 'Toggle filters',
      toggle_properties: 'Toggle properties',
      unsaved_changes: 'Unsaved changes',
      yes_close: 'Yes, close',
      yes_create_new: 'Yes, create new',
      yes_discard: 'Yes, discard',
      yes_leave: 'Yes, leave',
      yes_open: 'Yes, open',
      yes_save: 'Yes, save',
      you_are_on_entity: 'You are on entity',
      serial_number: 'Serial number',
      zone_path: 'Zone path'
    },

    messages: {
      errors: {
        already_exists: 'Already exists',
        image_not_found: 'Image not found',
        invalid_serial_number: 'Invalid serial number',
        loading_resource: 'Error loading {{resource}}',
        need_to_be_in_system: 'You need to be in a system to perform this action',
        serial_number_already_exists: 'Serial number already exists',
        wrong_label_key: 'Please make sure you have provided the correct value.',
        wrong_value: 'Wrong value'
      },
      informations: {
        confirm_delete: 'below to confirm you want to permanently delete it',
        copied_to_clipboard: 'Copied to clipboard',
        delete_confirmation: 'Are you sure you want to delete?',
        displayed_unsaved_changes: 'Here are displayed your unsaved changes',
        field_device_needed: 'To configure an application binding, you first need to configure at least one Field Device.',
        insert_your_field_device_name: 'Insert your Field Device\'s name',
        session_ended: 'Your session has ended in another tab.',
        you_have_undeployed_changes: 'You have undeployed changes in some gateways',
        you_have_unsaved_changes: 'You have unsaved changes',
        you_have_x_gateways_with_changes: 'You have {{number}} gateways with changes'
      },
      notifications: {
        close: {
          success: 'Closed successfully!',
          error: 'Error trying to close!'
        },
        create: {
          success: 'Created successfully!',
          error: 'Error trying to create!'
        },
        delete: {
          success: 'Deleted successfully!',
          error: 'Error trying delete!'
        },
        edit: {
          success: 'Updated successfully!',
          error: 'Error trying to update!'
        },
        finish: {
          success: 'Finished successfully',
          error: 'Finished with error'
        },
        save: {
          success: 'Saved successfully!',
          error: 'Error trying to save!'
        },
        system_opened_successfully: 'System opened successfully'
      },
      warnings: {
        delete_application_binding: 'Are you sure you want to delete this <b>application binding</b> ?',
        delete_confirmation_node: 'Are you sure you want to delete this node?',
        delete_field_device: 'Deleting your Field Device(s) is irreversible. All associated resources will be lost. <br>Please confirm if you want to permanently delete selected Field Device(s)',
        delete_gateway_message: 'below to confirm gateway deletion.',
        delete_gateway_confirmation_message: 'Deleting your gateway is irreversible. All associated resources will be lost.',
        last_app_device: 'There are no more <b>application bindings</b> for the associated <b>field device</b>.<br /><br /><p>Do you want to delete the <b>field device</b>?<p>',
        gateway_deleted: 'The gateway {{gatewayName}} ({{gatewaySN}}) was deleted in the source and is not available.',
        system_changes_will_be_lost: '<b>"{{systemName}}"</b> has unsaved changes that will be lost. <br/><br/><p>Are you sure you want to proceed? </p>'
      }
    },

    // Shared translations to serve external / catalog modules.
    shared: {
      dialogs: {
        unsaved_changes: {
          title: 'Leave current operation?',
          message: 'Any unsaved changes will be lost. Are you sure you want to leave?',
          confirm_text: 'Yes, leave',
          cancel_text: 'Cancel'
        }
      },
      forms_module: {
        tree_select: {
          management_default_title: 'Tree management'
        },
        validations: {
          invalid_email: 'Invalid email',
          invalid_format: 'Invalid format.',
          invalid_hexadecimal_format: 'Invalid hexadecimal format',
          invalid_json_format: 'Invalid JSON format',
          invalid_value: 'Invalid value',
          min: 'Value below the minumum allowed',
          min_hexadecimal: 'Value below the minumum allowed',
          max: 'Value above the maximum allowed',
          max_hexadecimal: 'Value above the maximum allowed',
          min_length: 'Min length',
          max_length: 'Max length',
          password_mismatch: 'Passwords don\'t appear to match',
          password_regex: 'The password must contain at least minimum 8 characters: one uppercase, one lowercase, one number and one special character.',
          required: 'Required'
        },
      },
      uploads: {
        are_you_sure_delete_file: 'Are you sure you want to delete this file?',
        placeholder_message: 'Drag or press here to choose file'
      }
    }
  }
};
