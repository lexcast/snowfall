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
    }
  },

  activate() {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'snowfall:toggle': () => this.toggle()
    }));

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
    snowFall.snow(document.body);
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
