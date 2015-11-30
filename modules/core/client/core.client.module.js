'use strict';

// ×¢²áºËÐÄÄ£¿é¼°ÒÀÀµ
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);
