/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */
"use strict";

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        })
      );
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

const nullthrows = require("nullthrows");

function getInternalOptions(_ref) {
  let transform = _ref.transform,
    resolve = _ref.resolve,
    onProgress = _ref.onProgress,
    experimentalImportBundleSupport = _ref.experimentalImportBundleSupport,
    shallow = _ref.shallow;
  let numProcessed = 0;
  let total = 0;
  return {
    experimentalImportBundleSupport,
    transform,
    resolve,
    onDependencyAdd: () => onProgress && onProgress(numProcessed, ++total),
    onDependencyAdded: () => onProgress && onProgress(++numProcessed, total),
    shallow
  };
}
/**
 * Dependency Traversal logic for the Delta Bundler. This method calculates
 * the modules that should be included in the bundle by traversing the
 * dependency graph.
 * Instead of traversing the whole graph each time, it just calculates the
 * difference between runs by only traversing the added/removed dependencies.
 * To do so, it uses the passed passed graph dependencies and it mutates it.
 * The paths parameter contains the absolute paths of the root files that the
 * method should traverse. Normally, these paths should be the modified files
 * since the last traversal.
 */

function traverseDependencies(_x, _x2, _x3) {
  return _traverseDependencies.apply(this, arguments);
}

function _traverseDependencies() {
  _traverseDependencies = _asyncToGenerator(function*(paths, graph, options) {
    const delta = {
      added: new Set(),
      modified: new Set(),
      deleted: new Set(),
      inverseDependencies: new Map()
    };
    const internalOptions = getInternalOptions(options);

    for (const path of paths) {
      // Only process the path if it's part of the dependency graph. It's possible
      // that this method receives a path that is no longer part of it (e.g if a
      // module gets removed from the dependency graph and just afterwards it gets
      // modified), and we have to ignore these cases.
      if (graph.dependencies.get(path)) {
        delta.modified.add(path);
        yield traverseDependenciesForSingleFile(
          path,
          graph,
          delta,
          internalOptions
        );
      }
    }

    const added = new Map();
    const modified = new Map();
    const deleted = new Set();

    for (const path of delta.deleted) {
      // If a dependency has been marked both as added and deleted, it means that
      // this is a renamed file (or that dependency has been removed from one path
      // but added back in a different path). In this case the addition and
      // deletion "get cancelled".
      if (!delta.added.has(path)) {
        deleted.add(path);
      }

      delta.modified.delete(path);
      delta.added.delete(path);
    }

    for (const path of delta.added) {
      added.set(path, nullthrows(graph.dependencies.get(path)));
    }

    for (const path of delta.modified) {
      // Similarly to the above, a file can be marked as both added and modified
      // when its path and dependencies have changed. In this case, we only
      // consider the addition.
      if (!delta.added.has(path)) {
        modified.set(path, nullthrows(graph.dependencies.get(path)));
      }
    }

    return {
      added,
      modified,
      deleted
    };
  });
  return _traverseDependencies.apply(this, arguments);
}

function initialTraverseDependencies(_x4, _x5) {
  return _initialTraverseDependencies.apply(this, arguments);
}

function _initialTraverseDependencies() {
  _initialTraverseDependencies = _asyncToGenerator(function*(graph, options) {
    const delta = {
      added: new Set(),
      modified: new Set(),
      deleted: new Set(),
      inverseDependencies: new Map()
    };
    const internalOptions = getInternalOptions(options);
    yield Promise.all(
      graph.entryPoints.map(path =>
        traverseDependenciesForSingleFile(path, graph, delta, internalOptions)
      )
    );
    reorderGraph(graph, {
      shallow: options.shallow
    });
    return {
      added: graph.dependencies,
      modified: new Map(),
      deleted: new Set()
    };
  });
  return _initialTraverseDependencies.apply(this, arguments);
}

function traverseDependenciesForSingleFile(_x6, _x7, _x8, _x9) {
  return _traverseDependenciesForSingleFile.apply(this, arguments);
}

function _traverseDependenciesForSingleFile() {
  _traverseDependenciesForSingleFile = _asyncToGenerator(function*(
    path,
    graph,
    delta,
    options
  ) {
    options.onDependencyAdd();
    yield processModule(path, graph, delta, options);
    options.onDependencyAdded();
  });
  return _traverseDependenciesForSingleFile.apply(this, arguments);
}

function processModule(_x10, _x11, _x12, _x13) {
  return _processModule.apply(this, arguments);
}

function _processModule() {
  _processModule = _asyncToGenerator(function*(path, graph, delta, options) {
    // Transform the file via the given option.
    const result = yield options.transform(path); // Get the absolute path of all sub-dependencies (some of them could have been
    // moved but maintain the same relative path).

    const currentDependencies = resolveDependencies(
      path,
      result.dependencies,
      options
    );
    const previousModule = graph.dependencies.get(path) || {
      inverseDependencies: delta.inverseDependencies.get(path) || new Set(),
      path
    };
    const previousDependencies = previousModule.dependencies || new Map(); // Update the module information.

    const module = _objectSpread({}, previousModule, {
      dependencies: new Map(),
      getSource: result.getSource,
      output: result.output
    });

    graph.dependencies.set(module.path, module);

    for (const _ref2 of currentDependencies) {
      var _ref3 = _slicedToArray(_ref2, 2);

      const relativePath = _ref3[0];
      const dependency = _ref3[1];
      module.dependencies.set(relativePath, dependency);
    }

    Array.from(previousDependencies.entries())
      .filter(_ref4 => {
        let _ref5 = _slicedToArray(_ref4, 2),
          relativePath = _ref5[0],
          dependency = _ref5[1];

        return (
          !currentDependencies.has(relativePath) ||
          nullthrows(currentDependencies.get(relativePath)).absolutePath !==
            dependency.absolutePath
        );
      })
      .forEach(_ref6 => {
        let _ref7 = _slicedToArray(_ref6, 2),
          relativePath = _ref7[0],
          dependency = _ref7[1];

        return removeDependency(
          module,
          dependency.absolutePath,
          graph,
          delta,
          new Set()
        );
      }); // Check all the module dependencies and start traversing the tree from each
    // added and removed dependency, to get all the modules that have to be added
    // and removed from the dependency graph.

    const promises = [];

    for (const _ref8 of currentDependencies) {
      var _ref9 = _slicedToArray(_ref8, 2);

      const relativePath = _ref9[0];
      const dependency = _ref9[1];

      if (!options.shallow) {
        if (
          options.experimentalImportBundleSupport &&
          dependency.data.data.isAsync
        ) {
          graph.importBundleNames.add(dependency.absolutePath);
        } else if (
          !previousDependencies.has(relativePath) ||
          nullthrows(previousDependencies.get(relativePath)).absolutePath !==
            dependency.absolutePath
        ) {
          promises.push(
            addDependency(
              module,
              dependency.absolutePath,
              graph,
              delta,
              options
            )
          );
        }
      }
    }

    try {
      yield Promise.all(promises);
    } catch (err) {
      // If there is an error, restore the previous dependency list.
      // This ensures we don't skip over them during the next traversal attempt.
      module.dependencies = previousDependencies;
      throw err;
    }

    return module;
  });
  return _processModule.apply(this, arguments);
}

function addDependency(_x14, _x15, _x16, _x17, _x18) {
  return _addDependency.apply(this, arguments);
}
/**
 * Recursively look up `inverseDependencies` until it is empty,
 * returning a set of paths for the last module that does not have
 * `inverseDependencies`.
 */

function _addDependency() {
  _addDependency = _asyncToGenerator(function*(
    parentModule,
    path,
    graph,
    delta,
    options
  ) {
    // The new dependency was already in the graph, we don't need to do anything.
    const existingModule = graph.dependencies.get(path);

    if (existingModule) {
      existingModule.inverseDependencies.add(parentModule.path);
      return;
    } // This module is being transformed at the moment in parallel, so we should
    // only mark its parent as an inverse dependency.

    const inverse = delta.inverseDependencies.get(path);

    if (inverse) {
      inverse.add(parentModule.path);
      return;
    }

    delta.added.add(path);
    delta.inverseDependencies.set(path, new Set([parentModule.path]));
    options.onDependencyAdd();
    const module = yield processModule(path, graph, delta, options);
    graph.dependencies.set(module.path, module);
    module.inverseDependencies.add(parentModule.path);
    options.onDependencyAdded();
  });
  return _addDependency.apply(this, arguments);
}

function getAllTopLevelInverseDependencies(
  inverseDependencies,
  graph,
  currModule,
  visited
) {
  if (visited.has(currModule)) {
    return new Set();
  }

  visited.add(currModule);

  if (!inverseDependencies.size) {
    return new Set([currModule]);
  }

  return Array.from(inverseDependencies)
    .filter(inverseDep => graph.dependencies.has(inverseDep))
    .reduce((acc, inverseDep) => {
      const mod = graph.dependencies.get(inverseDep);

      if (!mod) {
        return acc;
      }

      getAllTopLevelInverseDependencies(
        mod.inverseDependencies,
        graph,
        inverseDep,
        visited
      ).forEach(x => {
        acc.add(x);
      });
      return acc;
    }, new Set());
}
/**
 * Given `inverseDependencies`, tracing back inverse dependencies to
 * see if it only leads back to `parentModule`.
 */

function canSafelyRemoveFromParentModule(
  inverseDependencies,
  parentModule,
  graph,
  canBeRemovedSafely,
  delta
) {
  const visited = new Set();
  const topInverseDependencies = getAllTopLevelInverseDependencies(
    inverseDependencies,
    graph,
    "", // current module name
    visited
  );

  if (!topInverseDependencies.size) {
    /**
     * This happens when parentModule and inverseDependencies have a circular dependency.
     * This will eventually become an empty set due to the `visited` Set being the
     * base case for the recursive call.
     */
    return true;
  }

  const undeletedInverseDependencies = Array.from(
    topInverseDependencies
  ).filter(x => !delta.deleted.has(x));
  /**
   * We can only mark the `visited` Set of modules to be safely removable if
   * 1. We do not have top a level module to compare with parentModule.
   *   This can happen when trying to see if we can safely remove from
   *   a module that was deleted. This is why we filtered them out with `delta.deleted`
   * 2. We have one top module and it is parentModule
   */

  const canSafelyRemove =
    !undeletedInverseDependencies.length ||
    (undeletedInverseDependencies.length === 1 &&
      undeletedInverseDependencies[0] === parentModule);

  if (canSafelyRemove) {
    visited.forEach(mod => {
      canBeRemovedSafely.add(mod);
    });
  }

  return canSafelyRemove;
}

function removeDependency(parentModule, absolutePath, graph, delta) {
  let canBeRemovedSafely =
    arguments.length > 4 && arguments[4] !== undefined
      ? arguments[4]
      : new Set();
  const module = graph.dependencies.get(absolutePath);

  if (!module) {
    return;
  }

  module.inverseDependencies.delete(parentModule.path); // Even if there are modules still using parentModule, we want to ensure
  // there is no circular dependency. Thus, we check if it can be safely removed
  // by tracing back the inverseDependencies.

  if (!canBeRemovedSafely.has(module.path)) {
    if (
      module.inverseDependencies.size &&
      !canSafelyRemoveFromParentModule(
        module.inverseDependencies,
        module.path,
        graph,
        canBeRemovedSafely,
        delta
      )
    ) {
      return;
    }
  }

  delta.deleted.add(module.path); // Now we need to iterate through the module dependencies in order to
  // clean up everything (we cannot read the module because it may have
  // been deleted).

  Array.from(module.dependencies.values())
    .filter(
      dependency =>
        !delta.deleted.has(dependency.absolutePath) &&
        dependency.absolutePath !== parentModule.path
    )
    .forEach(dependency =>
      removeDependency(
        module,
        dependency.absolutePath,
        graph,
        delta,
        canBeRemovedSafely
      )
    ); // This module is not used anywhere else!! we can clear it from the bundle

  graph.dependencies.delete(module.path);
}

function resolveDependencies(parentPath, dependencies, options) {
  const resolve = (parentPath, result) => {
    const relativePath = result.name;

    try {
      return [
        relativePath,
        {
          absolutePath: options.resolve(parentPath, relativePath),
          data: result
        }
      ];
    } catch (error) {
      // Ignore unavailable optional dependencies. They are guarded
      // with a try-catch block and will be handled during runtime.
      if (result.data.isOptional !== true) {
        throw error;
      }
    }

    return undefined;
  };

  const resolved = dependencies.reduce((list, result) => {
    const resolvedPath = resolve(parentPath, result);

    if (resolvedPath) {
      list.push(resolvedPath);
    }

    return list;
  }, []);
  return new Map(resolved);
}
/**
 * Re-traverse the dependency graph in DFS order to reorder the modules and
 * guarantee the same order between runs. This method mutates the passed graph.
 */

function reorderGraph(graph, options) {
  const orderedDependencies = new Map();
  graph.entryPoints.forEach(entryPoint => {
    const mainModule = graph.dependencies.get(entryPoint);

    if (!mainModule) {
      throw new ReferenceError("Module not registered in graph: " + entryPoint);
    }

    reorderDependencies(graph, mainModule, orderedDependencies, options);
  });
  graph.dependencies = orderedDependencies;
}

function reorderDependencies(graph, module, orderedDependencies, options) {
  if (module.path) {
    if (orderedDependencies.has(module.path)) {
      return;
    }

    orderedDependencies.set(module.path, module);
  }

  module.dependencies.forEach(dependency => {
    const path = dependency.absolutePath;
    const childModule = graph.dependencies.get(path);

    if (!childModule) {
      if (dependency.data.data.isAsync || options.shallow) {
        return;
      } else {
        throw new ReferenceError("Module not registered in graph: " + path);
      }
    }

    reorderDependencies(graph, childModule, orderedDependencies, options);
  });
}

module.exports = {
  initialTraverseDependencies,
  traverseDependencies,
  reorderGraph
};
