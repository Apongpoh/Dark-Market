"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBtcs = exports.createMultisig = exports.createBtcs = void 0;

var createBtcs = function createBtcs(userId, token, authBtc) {
  return regeneratorRuntime.async(function createBtcs$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch("/api/wallet/create/".concat(userId), {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              Authorization: "Bearer ".concat(token)
            },
            body: authBtc
          }).then(function (res) {
            return res.json();
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 2:
          return _context.abrupt("return", _context.sent);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.createBtcs = createBtcs;

var createMultisig = function createMultisig(userId, token, authBtc) {
  return regeneratorRuntime.async(function createMultisig$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(fetch("/api/wallet/create/multisig/".concat(userId), {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              Authorization: "Bearer ".concat(token)
            },
            body: authBtc
          }).then(function (res) {
            return res.json();
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.createMultisig = createMultisig;

var getBtcs = function getBtcs() {
  return regeneratorRuntime.async(function getBtcs$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(fetch('/api/wallet/btcaccounts', {
            method: 'GET'
          }).then(function (res) {
            return res.json();
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 2:
          return _context3.abrupt("return", _context3.sent);

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.getBtcs = getBtcs;