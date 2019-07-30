#!/usr/bin/env node
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var execa = _interopDefault(require('execa'));
var preferredPM = _interopDefault(require('preferred-pm'));
var whichPMRuns = _interopDefault(require('which-pm-runs'));
var readPkgUp = _interopDefault(require('read-pkg-up'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var dotenv = _interopDefault(require('dotenv'));
var program = _interopDefault(require('commander'));
var getUnknownArgs = _interopDefault(require('commander-remaining-args'));

var getPackageJson = function (ref) {
  var processCwd = ref.processCwd;

  var packageJson = readPkgUp.sync({
    cwd: processCwd
  });

  if (packageJson) {
    return packageJson.package;
  }

  return undefined;
};

function objectWithoutProperties (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

var getPackageManagerFromPackageJson = function (ref) {
  var processCwd = ref.processCwd;

  var packageJson = getPackageJson({
    processCwd: processCwd
  });

  if (packageJson && packageJson.engines) {
    var ref$1 = packageJson.engines;
    var rest = objectWithoutProperties( ref$1, ["node"] );
    var engines = rest;
    var packageManagers = Object.keys(engines).filter(function (packageManager) { return packageManager; });

    if (packageManagers[0]) {
      return packageManagers[0];
    }
  }

  return undefined;
};

var getPackageManagerFromProcessEnv = function (ref) {
  var processEnv = ref.processEnv;

  if (processEnv.npm_execpath) {
    return processEnv.npm_execpath;
  }

  var pm = whichPMRuns();

  if (pm) {
    return pm.name;
  }

  return undefined;
};

var getPreferredPackageManager = function (ref) {
  var packageManager = ref.packageManager;
  var processCwd = ref.processCwd;
  var processEnv = ref.processEnv;

  try {
    if (packageManager) {
      return Promise.resolve(packageManager);
    }

    var packageManagerFromProcessEnv = getPackageManagerFromProcessEnv({
      processEnv: processEnv
    });

    if (packageManagerFromProcessEnv) {
      return Promise.resolve(packageManagerFromProcessEnv);
    }

    return Promise.resolve(preferredPM(processCwd)).then(function (pm) {
      if (pm) {
        return pm.name;
      }

      var packageManagerFromPackageJson = getPackageManagerFromPackageJson({
        processCwd: processCwd
      });
      return packageManagerFromPackageJson ? packageManagerFromPackageJson : 'npm';
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var getRunningPackageManager = function (ref) {
  var packageManager = ref.packageManager;
  var processEnv = ref.processEnv;

  if (packageManager) {
    return packageManager;
  }

  var packageManagerFromProcessEnv = getPackageManagerFromProcessEnv({
    processEnv: processEnv
  });

  if (packageManagerFromProcessEnv) {
    return packageManagerFromProcessEnv;
  }

  return 'npm';
};

var getNodeEnv = function (ref) {
  var envFile = ref.envFile;
  var processCwd = ref.processCwd;
  var processEnv = ref.processEnv;

  if (processEnv.NODE_ENV) {
    return processEnv.NODE_ENV;
  }

  if (envFile) {
    var envPath = path.isAbsolute(envFile) ? path.resolve(envFile) : path.resolve(processCwd, envFile);
    var envBuffer = fs.readFileSync(envPath);
    var envConfig = dotenv.parse(envBuffer);

    if (envConfig.NODE_ENV) {
      return envConfig.NODE_ENV;
    }
  }

  return 'development';
};

var getProcessEnv = function (ref) {
  var envFile = ref.envFile;
  var processCwd = ref.processCwd;
  var processEnv = ref.processEnv;

  var nodeEnv = getNodeEnv({
    envFile: envFile,
    processCwd: processCwd,
    processEnv: processEnv
  });
  return Object.assign({}, processEnv,
    {NODE_ENV: nodeEnv});
};

var getProgram = function (ref) {
  var processArgv = ref.processArgv;

  program.allowUnknownOption().option('-e, --env-file <path>', 'specify path to .env file').option('-p, --package-manager <pm>', 'specify package manager to run-script');
  var packageJson = getPackageJson({
    processCwd: __dirname
  });

  if (packageJson) {
    if (packageJson.description) {
      program.description(packageJson.description);
    }

    program.version(packageJson.version);
  }

  program.parse(processArgv);
  return program;
};

var getRemainingArgv = function (ref) {
  var program$$1 = ref.program;
  var remainingArgv = ref.remainingArgv;

  if (remainingArgv) {
    return remainingArgv;
  }

  if (program$$1) {
    return getUnknownArgs(program$$1);
  }

  return [];
};

var getRunScript = function (ref) {
  var processEnv = ref.processEnv;
  var runScript = ref.runScript;

  if (runScript) {
    return runScript;
  }

  if (processEnv.npm_lifecycle_event) {
    return processEnv.npm_lifecycle_event;
  }

  return 'start';
};

var byNodeEnv = function (ref) {
  var packageManager = ref.packageManager;
  var processEnv = ref.processEnv;
  var remainingArgv = ref.remainingArgv;
  var runScript = ref.runScript;

  var command = packageManager;
  var args = ['run', (runScript + ":" + (processEnv.NODE_ENV)) ].concat( remainingArgv);
  var options = {
    env: processEnv,
    stdio: 'inherit'
  };
  execa.sync(command, args, options);
};

if (require.main === module || !module.parent) {
  var processArgv = process.argv;
  var processCwd = process.cwd();
  var processEnv = process.env;
  var program$1 = getProgram({
    processArgv: processArgv
  });
  var envFile = program$1.envFile;
  var packageManager = program$1.packageManager;
  byNodeEnv({
    packageManager: getRunningPackageManager({
      packageManager: packageManager,
      processEnv: processEnv
    }),
    processEnv: getProcessEnv({
      envFile: envFile,
      processCwd: processCwd,
      processEnv: processEnv
    }),
    remainingArgv: getRemainingArgv({
      program: program$1
    }),
    runScript: getRunScript({
      processEnv: processEnv
    })
  });
}

var index = (function (ref) {
  if ( ref === void 0 ) ref = {};
  var envFile = ref.envFile;
  var packageManager = ref.packageManager;
  var processCwd = ref.processCwd; if ( processCwd === void 0 ) processCwd = process.cwd();
  var processEnv = ref.processEnv; if ( processEnv === void 0 ) processEnv = process.env;
  var remainingArgv = ref.remainingArgv;
  var runScript = ref.runScript;

  getPreferredPackageManager({
    packageManager: packageManager,
    processCwd: processCwd,
    processEnv: processEnv
  }).then(function (preferredPackageManager) {
    byNodeEnv({
      packageManager: preferredPackageManager,
      processEnv: getProcessEnv({
        envFile: envFile,
        processCwd: processCwd,
        processEnv: processEnv
      }),
      remainingArgv: getRemainingArgv({
        remainingArgv: remainingArgv
      }),
      runScript: getRunScript({
        processEnv: processEnv,
        runScript: runScript
      })
    });
  });
});

module.exports = index;
//# sourceMappingURL=index.js.map
