'use babel';

import { CompositeDisposable } from 'atom';
import snowFall from './vendor/snowfall.js';

export default {
  active: false,
  subscriptions: null,
  config: {
    autoToggle: {
      type: 'boolean',
      description: 'Toggle on start.',
      default: true
    },
    count: {
      type: 'integer',
      description: 'Snowflakes count.',
      default: 35,
      minimum: 1,
      maximum: 300
    },
    minSize: {
      type: 'integer',
      description: 'Minimum snowflakes size.',
      default: 2,
      minimum: 1,
      maximum: 50
    },
    maxSize: {
      type: 'integer',
      description: 'Maximum snowflakes size.',
      default: 8,
      minimum: 1,
      maximum: 50
    },
    minSpeed: {
      type: 'integer',
      description: 'Minimum snowflakes speed.',
      default: 1,
      minimum: 1,
      maximum: 50
    },
    maxSpeed: {
      type: 'integer',
      description: 'Maximum snowflakes speed.',
      default: 5,
      minimum: 1,
      maximum: 50
    },
    color: {
      type: 'color',
      description: 'Snowflakes color.',
      default: '#fff'
    },
    shadow: {
      type: 'boolean',
      description: 'Snowflakes shadow.',
      default: true
    },
  },

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.onBlur = this.onWindowBlur.bind(this);
    this.onFocus = this.onWindowFocus.bind(this);

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'snowfall:toggle': () => this.toggle()
    }));

    atom.config.observe('snowfall', (newValue) => {
      if (this.active) {
        this.stopSnow();
        this.startSnow();
      }
    });

    if (this.getConfig('autoToggle')) {
      this.toggle();
    }
  },

  deactivate() {
    this.subscriptions.dispose();
    if (this.active) {
      this.stopSnow();
      this.stopWindowEvents();
    }
    this.subscriptions = false;
    this.active = false;
  },

  startSnow() {
    snowFall.snow(document.body, {
      flakeCount: this.getConfig('count'),
      flakeColor: this.getConfig('color').toRGBAString(),
      minSize: this.getConfig('minSize'),
      maxSize: this.getConfig('maxSize'),
      minSpeed: this.getConfig('minSpeed'),
      maxSpeed: this.getConfig('maxSpeed'),
      shadow: this.getConfig('shadow'),
      round: true
    });
  },

  stopSnow() {
    snowFall.snow(document.body, 'clear');
  },

  startWindowEvents() {
    atom.getCurrentWindow().on('blur', this.onBlur);
    atom.getCurrentWindow().on('focus', this.onFocus);
  },

  stopWindowEvents() {
    atom.getCurrentWindow().removeListener('blur', this.onBlur);
    atom.getCurrentWindow().removeListener('focus', this.onFocus);
  },

  onWindowFocus() {
    if (this.active) {
      this.startSnow();
    }
  },

  onWindowBlur() {
    if (this.active) {
      this.stopSnow();
    }
  },

  getConfig(key) {
    return atom.config.get('snowfall.' + key);
  },

  toggle() {
    if (this.active) {
      this.stopSnow();
      this.stopWindowEvents();
    } else {
      this.startSnow();
      this.startWindowEvents();
    }
    this.active = !this.active;
  }
};
