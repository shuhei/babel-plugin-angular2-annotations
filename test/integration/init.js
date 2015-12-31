import 'zone.js/lib/browser/zone-microtask';
import 'reflect-metadata';
import 'babel-polyfill';

import {BrowserDomAdapter} from 'angular2/platform/browser'
BrowserDomAdapter.makeCurrent();
