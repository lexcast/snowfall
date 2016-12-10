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

  getConfig(key) {
    return atom.config.get('snowfall.' + key);
  },

  toggle() {
    this.active ? this.stopSnow() : this.startSnow();
    this.active = !this.active;
  }
};
