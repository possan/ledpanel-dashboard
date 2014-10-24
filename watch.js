var branch = 'master';
var remote = 'origin';

var exec = require('child_process').exec;
var fork = require('child_process').fork;

function execAndReturnStdout(command, callback) {
    console.log('executing: ' + command);
    exec(command, function(error, stdout, stderr) {
        /*
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        */
        if (error !== null) {
          console.log('exec error: ' + error);
        }
        if (stdout) {
            callback(stdout.trim());
        } else {
            callback(null);
        }
    });
}

function getLocalVersion(callback) {
    execAndReturnStdout('git rev-parse HEAD', callback);
}

function getRemoteVersion(callback) {
    execAndReturnStdout('git rev-parse ' + remote + '/' + branch, callback);
}

function updateSelf(callback) {
    execAndReturnStdout('git pull ' + remote + ' ' + branch, callback);
}

var runner = null;

function startLoop(callback) {
  runner = fork('test.js');
  setTimeout(callback, 1000);
}

function killProcess(callback) {
  runner.kill()
  setTimeout(callback, 1000);
}

function updateSelfAndRestart(callback) {
  updateSelf(function() {
    killProcess(function() {
      startLoop(callback);
    });
  });
}

function remoteCheck() {
  getRemoteVersion(function(remoteversion) {
    console.log('remote version: ' + remoteversion);
    getLocalVersion(function(localversion) {
      console.log('local version: ' + localversion);
      if (remoteversion && localversion && remoteversion != localversion) {
        console.log('versions differ...');
        updateSelfAndRestart(queueRemoteCheck);
      } else {
        queueRemoteCheck();
      }
    });
  });
}

function queueRemoteCheck(delay) {
  setTimeout(remoteCheck.bind(this), delay || 10000);
}

startLoop(function() {
  queueRemoteCheck(1000);
});
