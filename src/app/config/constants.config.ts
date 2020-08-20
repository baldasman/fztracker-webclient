
const createInterfaceArray = (s: string, n: number): string[] => {
  return Array.from(Array(n), (_, i) => s + (i + 1));
};


export const CONSTANTS = {
  version: '3.0.0',
  buildNumber: '20200809.1',

  deployStatus: {
    SUCCESS: 'SUCCESS',
    ONGOING: 'ONGOING',
    FAIL: 'FAIL'
  },

  moduleTypes: {
    'DQN Gateway Pro2': {
      name: 'DQN Gateway Pro 2',
      serialNumbers: { first: '21000000', last: '21FFFFFF' },
      interfaces: {
        analogInputs:   createInterfaceArray('ANALOGINPUT', 6),
        analogOutputs:  createInterfaceArray('ANALOGOUTPUT', 3),
        digitalOutputs: createInterfaceArray('DIGITALOUTPUT', 0),
        pwmOutputs:     createInterfaceArray('PWMOUTPUT', 3)
      },
      canBeMaster: true
    },
    'DQN Gateway Pro3': {
      name: 'DQN Gateway Pro 3',
      serialNumbers: { first: '23000000', last: '23FFFFFF' },
      interfaces: {
        analogInputs:   createInterfaceArray('ANALOGINPUT', 6),
        analogOutputs:  createInterfaceArray('ANALOGOUTPUT', 3),
        digitalOutputs: createInterfaceArray('DIGITALOUTPUT', 0),
        pwmOutputs:     createInterfaceArray('PWMOUTPUT', 3)
      },
      canBeMaster: true
    },
    'DQN Gateway Pro4': {
      name: 'DQN Gateway Pro 4',
      serialNumbers: { first: '25000000', last: '25FFFFFF' },
      interfaces: {
        analogInputs:   createInterfaceArray('ANALOGINPUT', 16),
        analogOutputs:  createInterfaceArray('ANALOGOUTPUT', 9),
        digitalOutputs: createInterfaceArray('DIGITALOUTPUT', 0),
        pwmOutputs:     createInterfaceArray('PWMOUTPUT', 3)
      },
      canBeMaster: true
    },
    'DQN Gateway Pro5': {
      name: 'DQN Gateway Pro 5',
      serialNumbers: { first: '28000000', last: '28FFFFFF' },
      interfaces: {
        analogInputs:   createInterfaceArray('ANALOGINPUT', 16),
        analogOutputs:  createInterfaceArray('ANALOGOUTPUT', 8),
        digitalOutputs: createInterfaceArray('DIGITALOUTPUT', 0),
        pwmOutputs:     createInterfaceArray('PWMOUTPUT', 2)
      },
      canBeMaster: true
    },
    'DQN Gateway X1': {
      name: 'DQN Gateway X1',
      serialNumbers: { first: 'E1000000', last: 'E1FFFFFF' },
      interfaces: {
        analogInputs:   createInterfaceArray('ANALOGINPUT', 16),
        analogOutputs:  createInterfaceArray('ANALOGOUTPUT', 8),
        digitalOutputs: createInterfaceArray('DIGITALOUTPUT', 2),
        pwmOutputs:     createInterfaceArray('PWMOUTPUT', 2)
      },
      canBeMaster: true
    },
    'DQN Extender 2': {
      name: 'DQN Extender 2',
      serialNumbers: { first: '44000000', last: '44FFFFFF' },
      interfaces: {
        analogInputs:   createInterfaceArray('ANALOGINPUT', 16),
        analogOutputs:  createInterfaceArray('ANALOGOUTPUT', 8),
        digitalOutputs: createInterfaceArray('DIGITALOUTPUT', 0),
        pwmOutputs:     createInterfaceArray('PWMOUTPUT', 8)
      },
      canBeMaster: false
    },
    'DQN Extender 3': {
      name: 'DQN Extender 3',
      serialNumbers: { first: '43000000', last: '43FFFFFF' },
      interfaces: {
        analogInputs:   createInterfaceArray('ANALOGINPUT', 16),
        analogOutputs:  createInterfaceArray('ANALOGOUTPUT', 8),
        digitalOutputs: createInterfaceArray('DIGITALOUTPUT', 0),
        pwmOutputs:     createInterfaceArray('PWMOUTPUT', 8)
      },
      canBeMaster: false
    },
    'DQN Extender X1': {
      name: 'DQN Extender X1',
      serialNumbers: { first: 'C1000000', last: 'C1FFFFFF' },
      interfaces: {
        analogInputs:   createInterfaceArray('ANALOGINPUT', 16),
        analogOutputs:  createInterfaceArray('ANALOGOUTPUT', 8),
        digitalOutputs: createInterfaceArray('DIGITALOUTPUT', 8),
        pwmOutputs:     createInterfaceArray('PWMOUTPUT', 0)
      },
      canBeMaster: false
    },
    'Generic Gateway': {
      name: 'Generic Gateway',
      serialNumbers: { first: 'E0000000', last: 'E0FFFFFF' },
      interfaces: {
        analogInputs:   createInterfaceArray('ANALOGINPUT', 0),
        analogOutputs:  createInterfaceArray('ANALOGOUTPUT', 0),
        digitalOutputs: createInterfaceArray('DIGITALOUTPUT', 0),
        pwmOutputs:     createInterfaceArray('PWMOUTPUT', 0)
      },
      canBeMaster: true
    }
  }

};
