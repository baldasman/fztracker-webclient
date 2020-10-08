export const locale = {
  lang: 'pt',
  data: {
    // Global app/configuration translations.
    app: {
      title: 'WebTool',
      description: `WebTool é uma ferramenta para facilitar a sua gestão de sistemas!
        <br><br>Esta oferece-lhe uma série de ações que pode realizar tais como gerir gateways (adicionar, editar, remover, etc.) ou gerir dispositivos dessas gateways de forma bastante simples.
        <br><br>Também permite importar ou exportar os seus workspaces de forma a que consiga continuar a trabalhar fora desta ferramenta ou atualizar algum trabalho feito anteriormente noutra plataforma.`,

      date_formats: {
        full: 'EEEE, d \'de\' MMMM \'de\' y \'às\' HH:mm:ss',
        short: 'dd-MM-yyyy HH:mm'
      },

      menus: {
        about: 'Sobre',
        advanced: 'Avançado',
        close: 'Fechar',
        export: 'Exportar',
        help: 'Ajuda',
        import_project: 'Importar projeto',
        new: 'Novo',
        open: 'Abrir',
        save: 'Gravar',
        system: 'Administrador',
        webtool: 'Webtool',
        workspace: 'Workspace'
      }
    },

    // Single words, ALWAYS lowercased.
    dictionary: {
      about: 'sobre',
      actions: 'ações',
      active: 'ativo',
      add: 'adicionar',
      added: 'adicionado',
      address: 'endereço',
      all: 'todos',
      bindings: 'bindings',
      cancel: 'cancelar',
      choose: 'escolher',
      clear: 'limpar',
      close: 'fechar',
      completed: 'completo',
      communications: 'comunicações',
      congratulations: 'parabéns',
      connect: 'ligar',
      connected: 'conectado',
      confirm: 'confirmar',
      coordinates: 'coordenadas',
      coordinator: 'coordenador',
      create: 'criar',
      current: 'actual',
      date: 'data',
      delete: 'apagar',
      deploy: 'deploy',
      deploying: 'a fazer deploy',
      deployed: 'Feito deploy',
      description: 'descrição',
      desktop: 'desktop',
      device: 'device',
      devices: 'devices',
      disconnect: 'desligar',
      edit: 'editar',
      edited: 'editado',
      entity: 'entidade',
      error: 'erro',
      filter: 'filtrar',
      format: 'formato',
      finish: 'concluir',
      gateway: 'gateway',
      gateways: 'gateways',
      group: 'grupo',
      groups: 'grupos',
      hi: 'olá',
      id: 'identificador',
      import: 'importar',
      inactive: 'inactivo',
      keep: 'manter',
      lat: 'lat',
      latitude: 'latitude',
      location: 'localização',
      loading: 'a carregar...',
      log: 'log',
      longitude: 'longitude',
      manufacturer: 'fabricante',
      modules: 'módulos',
      name: 'nome',
      no: 'não',
      notes: 'notas',
      new: 'novo',
      next: 'próximo',
      off: 'desligado',
      ok: 'ok',
      on: 'ligado',
      open: 'abrir',
      or: 'ou',
      output: 'saída',
      parameter: 'parâmetro',
      parameters: 'parâmetros',
      parity: 'paridade',
      pending: 'pendente',
      property: 'propriedade',
      previous: 'anterior',
      proceed: 'prosseguir',
      ready: 'pronto',
      realtime: 'realtime',
      remaining: 'restante',
      replace: 'substituir',
      registers: 'registos',
      restore: 'repor',
      save: 'gravar',
      saved: 'gravado',
      search: 'procurar',
      select: 'selecionar',
      settings: 'configurações',
      submit: 'submeter',
      start: 'início',
      state: 'estado',
      status: 'estado',
      system: 'sistema',
      tag: 'tag',
      timezone: 'fuso horário',
      token: 'token',
      type: 'tipo',
      value: 'valor',
      version: 'versão',
      yes: 'sim',
      zone: 'zona'
    },

    // Forms (fields) related translations
    forms: {
      apn: { label: 'APN' },
      gprs: { label: 'GPRS' },
      password: { label: 'Password' },
      user: { label: 'User' },
      zone: { label: 'Zona', placeholder: 'Escolha a zona mais apropriada', management_default_title: 'Lista de zonas' }
    },

    // Specific translations to specific features (modules).
    features: {
      authentication: {
        messages: {
          all_fields_filled: 'Por favor, preencha todos os campos',
          login_error: 'A autenticação falhou. Verifique a informação e tente novamente',
          login_success: 'Login efectuado com successo'
        }
      },
      home: {
        gateway: {
          routes: {
            application_bindings: 'Application Bindings',
            console: 'Consola',
            dashboard: 'Dashboard',
            field_devices: 'Field Devices',
            projects: 'Projetos'
          }
        }
      },
      console: {
        labels: {
          get: 'Get',
          set: 'Set',
        },
        messages: {
          gateway_offline: 'A gateway <b>{{gatewayName}}</b> está <b>offline</b>.<br />Por favor, verifique a conectividade para poder utilizar a consola.'
        },
        notifications: {
          error_get_command: 'Erro ao obter o valor de {{property}}',
          error_set_command: 'Error ao enviar valor para {{property}}',
          success_set_command: 'Valor enviado para {{property}}',
          status_update_error: 'Não foi possível executar a operação',
          status_update_off: 'Desligado com sucesso',
          status_update_on: 'Ligado com sucesso',
          warning_realtime_off: 'Realtime está desligado. Ligue-o para poder interagir',
        }
      },
      deploy: {
        actions: {
          restore_this_version: 'Restaurar esta versão'
        },
        labels: {
          describe_your_deploy: 'Descreva o seu deploy',
          last_deploy: 'Último deploy'
        },
        messages: {
          choose_gateways_to_deploy: 'Escolha uma ou mais gateways que pretenda fazer deploy',
          deploy_notes_info: 'Se houver mais do que uma Gateway escolhida, cada uma delas irá receber a mesma nota de deploy',
          deploy_started: 'A preparar o deploy...',
          deploy_successful: 'Deploy com sucesso',
          deploy_failed: 'Falha no deploy',
          no_deploy: 'Nenhum deploy',
          error_trying_deploy: 'Erro ao tentar fazer deploy.<br>Por favor grave o <strong>Sistema</strong> e tente fazer <strong>deploy</strong> novamente',
          view_deploy_info: 'Ver informação do deploy'
        },
        notifications: {
          deploy_failed: 'O deploy falhou na gateway {{gateway}}',
          deploy_started: 'O deploy foi iniciado para as gateways escolhidas',
          deploy_successful: 'Deploy com sucesso na gateway {{gateway}}'
        },
        states: {
          STARTED: 'Em preparação',
          PROGRESS: 'Em execução',
          COMPLETE: 'Deploy efectuado com sucesso',
          'ERROR: GATEWAY NOT CONNECTED!': 'Gateway não está conectada',
          'ERROR: EMPTY PROJECT FILE': 'Ficheiro de projeto vazio',
          'ERROR: OPENING PROJECT FILE': 'Erro ao abrir o ficheiro de projeto',
          'ERROR: OPENING PROJECT DEFINITIONS FILE': 'Erro ao abrir ficheiro de definições do projeto',
          'ERROR: UNPACKING PROJECT PACKAGE FILE': 'Erro ao descompactar ficheiro de pacotes do projeto',
          'ERROR: GETTING PROJECT PACKAGE FILE': 'Erro ao obter ficheiro de pacotes do projeto',
          'PROGRESS:100': 'Deploy efectuado com sucesso'
        }
      },
      error_pages: {
        page_not_found: {
          message_01: 'Hum... Parece que alguma coisa não correu bem!',
          message_02: 'De-nos algum tempo enquanto verificamos o que aconteceu.',
          action: 'Seguir para um ambiente mais seguro...'
        }
      },
      errors: {
        loading_resource: 'Erro ao carregar {{resource}}'
      },
      field_devices: {
        delete: {
          field_devices_to_delete: 'Field Devices para serem apagados'
        },
        list: {
          search_filter: 'Filtrar por nome, zona ou nome do template'
        },
        wizard: {
          steps: {
            identification: {
              title: 'Identificação',
              step_title: 'Preencha a informação de identificação',
              description: 'Escolha o nome e localização onde o Field Device estará associado',
              chosen_device_template: 'Field Device template escolhido'
            },
            configuration: {
              title: 'Configuração',
              step_title: 'Preencha a informação de configuração',
              description: 'Preencha a informação necessária à configuração do Field Device'
            }
          }
        }
      },
      gateway_connections: {
        open_gateway_connections_modal: 'Abrir modal de conexões da Gateway'
      },
      gateway_management: {
        actions: {
          choose_equipment: 'Escolher equipamento'
        },
        licensing_states: {
          waiting: 'A aguardar pedido inicial da gateway',
          ongoing_boot: 'Gateway conectada',
          ongoing_waiting_license: 'A aguardar geração de licença',
          retrying: 'A conexão encontra-se instável. A tentar novamente a geração de licença',
          completed_ok: 'Licança criada com sucesso',
          completed_error_timeout: 'A operação excedeu o tempo permitido',
          completed_error: 'Ocorreu um erro',
          completed_error_01: 'A operação falhou ao enviar o pedido de licença',
          completed_error_02: 'A operação falhou. A licença gerada é inválida',
          completed_error_03: 'Não tem autorização para executar a operação solicitada',
          unknown: 'Estado desconhecido...'
        },
        titles: {
          choose_your_equipment: 'Escolha o seu equipamento',
          create_your_gateway: 'Crie a sua gateway',
          register_gateway: 'Registe uma gateway',
          run_this_command: '1. Execute o comando seguinte',
          wait_for_a_license: '2. Aguarde a criação da licença'
        },
        messages: {
          license_created: 'Foi criada uma nova licença com a seguinte informação.',
          create_your_gateway: 'Escolha esta opção se pretender instalar a solução num equipamento compativel.',
          insert_valid_label_key: 'Por favor, insira a Label Key correspondente ao número de série preenchido',
          insert_valid_serial_number: 'Por favor, insira um número de série válido',
          register_gateway: 'Escolha este método quando já tem uma gateway com um número de série e label key válido',
          run_this_command: 'Você necessita de acesso ao equipamento para poder executar o comando abaixo. Verifique também se o mesmo está ligado à internet para poder instalar todos os pacotes necessários.',
          wait_for_a_license: 'Após a execução da instrução acima, ser-lhe-á gerada e atribuída uma licença. Acompanhe o processo aqui, e aguarde pelas próximas instruções.',
          error_try_again: 'Não foi possível de concluir a operação neste momento. Verifique todas as condiçoes necessárias para que possível registar a sua gateway e experimente novamente.'
        }
      },
      application_bindings: {
        list: {
          search_filter: 'Filtrar por nome, zona Field Device'
        },
        wizard: {
          steps: {
            field_devices_list: {
              title: 'Field Device',
              step_title: 'Escolha o Field Device',
              description: 'O application binding ficará associado ao field device que escolher',
            },
            templates_list: {
              title: 'Template',
              step_title: 'Escolha o template a utilizar',
              description: 'Escolha o template mais adequado à sua necessidade',
            },
            identification: {
              title: 'Identificação',
              step_title: 'Preencha a informação de identificação',
              description: 'Escolha o nome e zona onde o application binding estará associado',
            },
            application_objects_list: {
              title: 'Configuração',
              step_title: 'Preencha a informação de configuração',
              description: 'Preencha a informação necessária à configuração de cada application object',
              error_0_items: 'O template escolhido não tem nenhum application object disponível.',
              error_invalid_configuration: 'A configuração de alguns items é inválida. Por favor, reveja as mesmas.',
              label_invalid_configuration: 'Configuração inválida'
            }
          }
        }
      },
      projects: {
        messages: {
          error_fetching_projects: 'Ocorreu um erro ao tentar obter os projetos',
          project_restored_successfully: 'Projeto restaurado com sucesso',
          restore_warning: 'Está prestes a restaurar a versão gravada na <b>"{{date}}"</b>.<br />Toda a informação atual será substituida.<br /><br />Tem a certeza que pretende continuar?'
        },
        titles: {
          list: 'Histórico de projetos'
        }
      },

      dialogs: { // Specific dialogs.
        local_information_detected: {
          title: 'Informação local mais recente encontrada',
          message: 'Foi encontrada uma cópia local mais recente do sistema <b>"{{systemName}}"</b>. Pode restaurar a versão local para que possa persistir as alterações no servidor.<br /><br />Como deseja prosseguir? ',
          load_from_local: 'Restaurar cópia local',
          load_from_server: 'Descartar cópia local e carregar do servidor'
        },
        save_system_and_deploy: {
          title: 'Unsaved changes',
          message: 'Este <b>sistema</b> tem alterações por gravar. Para realizar o <b>deploy</b>, necessita de guardar estas alterações.<br /><br />Quer gravar e continuar?'
        },
        unable_to_load_system: {
          title: 'Erro ao carregar sistema',
          message: 'O sistema não foi possível de carregar. O mesmo pode ser inválido ou poderá ter sido removido.',
          load_from_local: 'Restore local copy',
          load_from_server: 'Discard local copy and load from server'
        }
      },

      system_management: {
        titles: {
          import_project: 'Importar projeto',
        },
        messages: {
          gateways_not_imported: '{{number}} gateway(s) não foram importadas uma vez que não pertencem a este sistema',
          project_imported_successfully: 'Projeto importado com sucesso',
          project_read_successfully: 'Projeto importado com successo!',
          verify_informations_and_select_action: 'Verifique se a informação está correta e escolha uma acção',
        }
      },

      wizards: { // Generic wizards steps.
        steps: {
          summary: {
            title: 'Sumário',
            step_title: 'Um breve sumário das suas escolhas',
            description: 'Visualize toda a informação de configuração'
          }
        }
      }
    },

    labels: {
      add_application_binding: 'Adicionar application binding',
      add_application_bindings_to_field_devices: 'Adicione application bindings aos seus field devices',
      add_field_device: 'Adicionar Field Device',
      add_field_device_from_library: 'Adicionar um Field Device a partir da biblioteca',
      add_gateway: 'Adicionar gateway',
      add_new_module: 'Adicionar novo módulo',
      advanced_options: 'Opções avançadas',
      additional_modules: 'Módulos adicionais',
      all_states: 'Todos os estados',
      application_binding: 'Application Binding',
      application_bindings: 'Application Bindings',
      application_bindings_list: 'Lista de Application Bindings',
      application_bindings_view: 'Ver application bindings',
      application_object: 'Application Object',
      application_objects: 'Application Objects',
      application_objects_total: 'Total de Application Objects',
      application_objects_view: 'Ver application objects',
      apply_filter: 'Aplicar filtro',
      auto_scroll: 'Scroll automático',
      choose_a_location: 'Escolha uma localização',
      choose_another_file: 'Escolha outro ficheiro',
      choose_format: 'Escolha o formato',
      choose_registers: 'Escolha de registos',
      close_system: 'Fechar Sistema',
      communications_channel: 'Canal de comunicações',
      confirm_delete: 'Sim, apagar!',
      connected_field_device: 'Field Device connectado',
      connection_status: 'Estado da conexão',
      connection_type: 'Tipo de conexão',
      create_system: 'Criar Sistema',
      create_a_new_system: 'Criar um novo Sistema',
      create_new_system: 'Criar novo sistema',
      created_by: 'Criado por',
      current_gateway: 'Gateway atual',
      current_gateway_label_key: 'Label key da gateway atual',
      datetime: 'Dia hora',
      delete_application_binding: 'Apagar Application Device',
      delete_device: 'Apagar Device',
      delete_field_device: 'Apagar Field Device',
      delete_field_devices: 'Apagar Field Devices',
      delete_gateway: 'Apagar gateway',
      delete_node: 'Apagar nó',
      deploy_ended_at: 'O deploy acabou {{datetime}}',
      deploy_notes: 'Notas do deploy',
      deploy_started_at: 'O deploy começou {{datetime}}',
      deployed_only: 'Apenas deployed',
      device_driver: 'Driver do dispositivo',
      edit_application_binding: 'Editar Application Binding',
      edit_device: 'Editar Device',
      edit_field_device: 'Editar field fevice',
      edit_gateway: 'Editar gateway',
      edit_system: 'Editar Sistema',
      edit_gateway_details: 'Editar detalhes da gateway',
      edit_module_details: 'Editar detalhes do módulo',
      ethernet: 'Ethernet',
      field_device_groups: 'Grupos do Field Device',
      field_device_template: 'Field Device template',
      field_device: 'Field Device',
      field_devices: 'Field Devices',
      field_devices_list: 'Lista de Field Devices',
      field_devices_total: 'Número total de Field Devices',
      filter_log: 'Filtre as mensagens',
      force_channel_silence: 'Forçar silêncio do canal',
      gateway_connections: 'Conexões da Gateway',
      gateway_details: 'Detalhes da gateway',
      gateway_name_deploy_info: '{{gatewayName}} informação do deploy',
      gprs: 'GPRS',
      individual_notes: 'Notas individuais',
      insert_the: 'Insira a',
      ip_address: 'Endereço IP',
      label_key: 'Label key',
      leave_current_operation: 'Abandonar operação atual',
      main_zone: 'Zona principal',
      manage_zones: 'Gerir zonas',
      missing_historical_data: 'Sem histórico',
      new_gateway: 'Nova gateway',
      new_gateway_label_key: 'Label key da nova gateway',
      no_data: 'Sem dados para mostrar',
      no_results: 'Sem resultados encontrados',
      no_system: 'Sem Sistema',
      no_zones: 'Sem zonas. Adicione a sua primeira.',
      not_connected: 'Não conectado',
      not_ready: 'Não pronto',
      open_existing_system: 'Abrir um Sistema existente',
      open_system: 'Abrir sistema',
      override_system: 'Sobrepor Sistema',
      previous_deploys: 'Deploys anteriores',
      press_to_deploy: 'Carregue para fazer deploy',
      press_to_save: 'Carregue para guardar',
      remote_address: 'Endereço remoto',
      replace_gateway: 'Substituir gateway',
      request_time: 'Tempo do pedido',
      restore_project: 'Repor Projeto',
      save_and_deploy: 'Gravar & Deploy',
      select_entity: 'Selecione entidade',
      select_gateway: 'Selecione uma gateway',
      select_system: 'Selecionar Sistema',
      select_timezone: 'Selecione o fuso horário',
      view_more: 'Ver mais',
      sign_out: 'Sair',
      start_configuring_devices_add_gateway: 'Para começar a configurar Dispositivos, adicione uma gateway',
      stop_bits: 'Stop bits',
      system_coordinates: 'Coordenadas do Sistema',
      system_details: 'Detalhes do Sistema',
      system_entity: 'Entidade do Sistema',
      system_name: 'Nome do sistema',
      system_timezone: 'Fuso horário do sistema',
      toggle_filters: 'Alternar filtros',
      toggle_properties: 'Alternar propriedades',
      unsaved_changes: 'Alterações não gravadas',
      yes_close: 'Sim, fechar',
      yes_create_new: 'Sim, criar novo',
      yes_discard: 'Sim, descartar',
      yes_leave: 'Sim, sair',
      yes_open: 'Sim, abrir',
      yes_save: 'Sim, gravar',
      you_are_on_entity: 'Está na entidade',
      serial_number: 'Número de série',
      zone_path: 'Caminho da zona'
    },

    messages: {
      errors: {
        already_exists: 'Já existe',
        image_not_found: 'Imagem não encontrada',
        invalid_serial_number: 'Número de serie inválido',
        loading_resource: 'Erro ao carregar {{resource}}',
        need_to_be_in_system: 'Precisa de estar num sistema para realizar esta ação',
        serial_number_already_exists: 'O número de série da existe',
        wrong_label_key: 'Por favor, verifque se inseriu o valor correto.',
        wrong_value: 'Valor errado'
      },
      informations: {
        confirm_delete: 'abaixo para confirmar que pretende apagá-lo permanentemente.',
        copied_to_clipboard: 'Copiado para o clipboard',
        delete_confirmation: 'Tem a certeza que deseja apagar?',
        displayed_unsaved_changes: 'Aqui estão dispostas as suas alterações não gravadas',
        field_device_needed: 'Para configurar um application binding, necessita de configurar pelo menos um field device.',
        insert_your_field_device_name: 'Insira o nome do seu Field Device',
        session_ended: 'A sua sessão foi terminada noutra tab.',
        you_have_undeployed_changes: 'Tem alterações não deployed em algumas Gateways',
        you_have_unsaved_changes: 'Tem alterações não guardadas',
        you_have_x_gateways_with_changes: 'Tem {{number}} gateway(s) com alterações'
      },
      notifications: {
        close: {
          success: 'Fechado com sucesso!',
          error: 'Erro ao tentar fechar!'
        },
        create: {
          success: 'Criado com sucesso!',
          error: 'Erro ao tentar criar!'
        },
        delete: {
          success: 'Apagado com sucesso!',
          error: 'Erro ao tentar apagar!'
        },
        edit: {
          success: 'Atualizado com sucesso!',
          error: 'Erro ao tentar atualizar!'
        },
        finish: {
          success: 'Terminado com sucesso',
          error: 'Terminado com erro'
        },
        save: {
          success: 'Guardado com sucesso!',
          error: 'Erro a tentar gravar!'
        },
        system_opened_successfully: 'Sistema aberto com sucesso'
      },
      warnings: {
        delete_application_binding: 'Tem a certeza que pretende remover este <b>application binding</b> ?',
        delete_confirmation_node: 'Tem a certeza que prentende remover este nó?',
        delete_field_device: 'Apagar o(s) seu(s) Field Device(s) é irreversível. Todos os recursos associados serão perdidos.<br>Por favor confirme se quer apagar permanentemente o(s) Field Device(s).',
        delete_gateway_message: 'abaixo para confirmar que pretende apagar a gateway.',
        delete_gateway_confirmation_message: 'Apagar a sua gateway é irreversível. Todos os recursos associados serão perdidos.',
        last_app_device: 'Não existem mais <b>application bindings</b> para o <b>field device</b> associado.<br /><br /><p>Pretende apagar o <b>field device</b>?</p>',
        gateway_deleted: 'A gateway {{gatewayName}} ({{gatewaySN}}) foi apagada na origem e não está disponível.',
        system_changes_will_be_lost: '<b>"{{systemName}}"</b> tem alterações por gravar que irão ser descartadas. <br><br/><p>Tem a certeza que pretende continuar?</p>'
      }
    },

    // Shared translations to serve external / catalog modules.
    shared: {
      dialogs: {
        unsaved_changes: {
          title: 'Sair da operação atual?',
          message: 'Todas as alterações não gravadas serão perdidas. Tem a certeza que pretende sair?',
          confirm_text: 'Sim, sair',
          cancel_text: 'Cancelar'
        }
      },
      forms_module: {
        tree_select: {
          management_default_title: 'Manutenção da lista'
        },
        validations: {
          required: 'Obrigatório',
          invalid_email: 'E-Mail inválido',
          invalid_format: 'Formato inválido',
          invalid_hexadecimal_format: 'Formato hexadecimal inválido',
          invalid_json_format: 'Formato JSON inválido',
          invalid_value: 'Valor inválido',
          min: 'Valor abaixo do permitido',
          minHexadecimal: 'Valor abaixo do permitido',
          max: 'Valor acima do permitido',
          maxHexadecimal: 'Valor acima do permitido',
          min_length: 'Tamanho mínimo',
          max_length: 'Tamanho maximo',
          password_regex: 'A password tem que conter pelo menos 8 caracteres. Entre eles, uma maiúscula, uma minuscula, um número e um caráter especial',
          password_mismatch: 'As passwords não coincidem'
        }
      },
      uploads: {
        are_you_sure_delete_file: 'Tem a certeza que deseja remover o ficheiro?',
        placeholder_message: 'Arraste ou pressione aqui para escolher'
      }
    }
  }
};
