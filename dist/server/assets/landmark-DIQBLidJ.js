import { a2 as requireReact, a3 as requireJsxRuntime, r as reactExports } from "./server-C_uSFjLe.js";
var cjs$2 = {};
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var featureBundleBieBX2Jn = {};
var cjs$1 = {};
var cjs = {};
var hasRequiredCjs$2;
function requireCjs$2() {
  if (hasRequiredCjs$2) return cjs;
  hasRequiredCjs$2 = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function addUniqueItem(arr, item) {
      if (arr.indexOf(item) === -1)
        arr.push(item);
    }
    function removeItem(arr, item) {
      const index = arr.indexOf(item);
      if (index > -1)
        arr.splice(index, 1);
    }
    function moveItem([...arr], fromIndex, toIndex) {
      const startIndex = fromIndex < 0 ? arr.length + fromIndex : fromIndex;
      if (startIndex >= 0 && startIndex < arr.length) {
        const endIndex = toIndex < 0 ? arr.length + toIndex : toIndex;
        const [item] = arr.splice(fromIndex, 1);
        arr.splice(endIndex, 0, item);
      }
      return arr;
    }
    const clamp = (min, max, v) => {
      if (v > max)
        return max;
      if (v < min)
        return min;
      return v;
    };
    function formatErrorMessage(message, errorCode) {
      return errorCode ? `${message}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${errorCode}` : message;
    }
    exports.warning = () => {
    };
    exports.invariant = () => {
    };
    const MotionGlobalConfig = {};
    const isNumericalString = (v) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);
    function isObject(value) {
      return typeof value === "object" && value !== null;
    }
    const isZeroValueString = (v) => /^0[^.\s]+$/u.test(v);
    // @__NO_SIDE_EFFECTS__
    function memo(callback) {
      let result;
      return () => {
        if (result === void 0)
          result = callback();
        return result;
      };
    }
    const noop = /* @__NO_SIDE_EFFECTS__ */ (any) => any;
    const combineFunctions = (a, b) => (v) => b(a(v));
    const pipe = (...transformers) => transformers.reduce(combineFunctions);
    const progress = /* @__NO_SIDE_EFFECTS__ */ (from, to, value) => {
      const toFromDifference = to - from;
      return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
    };
    class SubscriptionManager {
      constructor() {
        this.subscriptions = [];
      }
      add(handler) {
        addUniqueItem(this.subscriptions, handler);
        return () => removeItem(this.subscriptions, handler);
      }
      notify(a, b, c) {
        const numSubscriptions = this.subscriptions.length;
        if (!numSubscriptions)
          return;
        if (numSubscriptions === 1) {
          this.subscriptions[0](a, b, c);
        } else {
          for (let i = 0; i < numSubscriptions; i++) {
            const handler = this.subscriptions[i];
            handler && handler(a, b, c);
          }
        }
      }
      getSize() {
        return this.subscriptions.length;
      }
      clear() {
        this.subscriptions.length = 0;
      }
    }
    const secondsToMilliseconds = /* @__NO_SIDE_EFFECTS__ */ (seconds) => seconds * 1e3;
    const millisecondsToSeconds = /* @__NO_SIDE_EFFECTS__ */ (milliseconds) => milliseconds / 1e3;
    function velocityPerSecond(velocity, frameDuration) {
      return frameDuration ? velocity * (1e3 / frameDuration) : 0;
    }
    const warned = /* @__PURE__ */ new Set();
    function hasWarned(message) {
      return warned.has(message);
    }
    function warnOnce(condition, message, errorCode) {
      if (condition || warned.has(message))
        return;
      console.warn(formatErrorMessage(message, errorCode));
      warned.add(message);
    }
    const wrap = (min, max, v) => {
      const rangeSize = max - min;
      return ((v - min) % rangeSize + rangeSize) % rangeSize + min;
    };
    const calcBezier = (t, a1, a2) => (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t;
    const subdivisionPrecision = 1e-7;
    const subdivisionMaxIterations = 12;
    function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
      let currentX;
      let currentT;
      let i = 0;
      do {
        currentT = lowerBound + (upperBound - lowerBound) / 2;
        currentX = calcBezier(currentT, mX1, mX2) - x;
        if (currentX > 0) {
          upperBound = currentT;
        } else {
          lowerBound = currentT;
        }
      } while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
      return currentT;
    }
    function cubicBezier(mX1, mY1, mX2, mY2) {
      if (mX1 === mY1 && mX2 === mY2)
        return noop;
      const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
      return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
    }
    const mirrorEasing = (easing) => (p) => p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
    const reverseEasing = (easing) => (p) => 1 - easing(1 - p);
    const backOut = /* @__PURE__ */ cubicBezier(0.33, 1.53, 0.69, 0.99);
    const backIn = /* @__PURE__ */ reverseEasing(backOut);
    const backInOut = /* @__PURE__ */ mirrorEasing(backIn);
    const anticipate = (p) => p >= 1 ? 1 : (p *= 2) < 1 ? 0.5 * backIn(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
    const circIn = (p) => 1 - Math.sin(Math.acos(p));
    const circOut = reverseEasing(circIn);
    const circInOut = mirrorEasing(circIn);
    const easeIn = /* @__PURE__ */ cubicBezier(0.42, 0, 1, 1);
    const easeOut = /* @__PURE__ */ cubicBezier(0, 0, 0.58, 1);
    const easeInOut = /* @__PURE__ */ cubicBezier(0.42, 0, 0.58, 1);
    function steps(numSteps, direction = "end") {
      return (progress2) => {
        progress2 = direction === "end" ? Math.min(progress2, 0.999) : Math.max(progress2, 1e-3);
        const expanded = progress2 * numSteps;
        const rounded = direction === "end" ? Math.floor(expanded) : Math.ceil(expanded);
        return clamp(0, 1, rounded / numSteps);
      };
    }
    const isEasingArray = (ease) => {
      return Array.isArray(ease) && typeof ease[0] !== "number";
    };
    function getEasingForSegment(easing, i) {
      return isEasingArray(easing) ? easing[wrap(0, easing.length, i)] : easing;
    }
    const isBezierDefinition = (easing) => Array.isArray(easing) && typeof easing[0] === "number";
    const easingLookup = {
      linear: noop,
      easeIn,
      easeInOut,
      easeOut,
      circIn,
      circInOut,
      circOut,
      backIn,
      backInOut,
      backOut,
      anticipate
    };
    const isValidEasing = (easing) => {
      return typeof easing === "string";
    };
    const easingDefinitionToFunction = (definition) => {
      if (isBezierDefinition(definition)) {
        exports.invariant(definition.length === 4, `Cubic bezier arrays must contain four numerical values.`, "cubic-bezier-length");
        const [x1, y1, x2, y2] = definition;
        return cubicBezier(x1, y1, x2, y2);
      } else if (isValidEasing(definition)) {
        exports.invariant(easingLookup[definition] !== void 0, `Invalid easing type '${definition}'`, "invalid-easing-type");
        return easingLookup[definition];
      }
      return definition;
    };
    exports.MotionGlobalConfig = MotionGlobalConfig;
    exports.SubscriptionManager = SubscriptionManager;
    exports.addUniqueItem = addUniqueItem;
    exports.anticipate = anticipate;
    exports.backIn = backIn;
    exports.backInOut = backInOut;
    exports.backOut = backOut;
    exports.circIn = circIn;
    exports.circInOut = circInOut;
    exports.circOut = circOut;
    exports.clamp = clamp;
    exports.cubicBezier = cubicBezier;
    exports.easeIn = easeIn;
    exports.easeInOut = easeInOut;
    exports.easeOut = easeOut;
    exports.easingDefinitionToFunction = easingDefinitionToFunction;
    exports.getEasingForSegment = getEasingForSegment;
    exports.hasWarned = hasWarned;
    exports.isBezierDefinition = isBezierDefinition;
    exports.isEasingArray = isEasingArray;
    exports.isNumericalString = isNumericalString;
    exports.isObject = isObject;
    exports.isZeroValueString = isZeroValueString;
    exports.memo = memo;
    exports.millisecondsToSeconds = millisecondsToSeconds;
    exports.mirrorEasing = mirrorEasing;
    exports.moveItem = moveItem;
    exports.noop = noop;
    exports.pipe = pipe;
    exports.progress = progress;
    exports.removeItem = removeItem;
    exports.reverseEasing = reverseEasing;
    exports.secondsToMilliseconds = secondsToMilliseconds;
    exports.steps = steps;
    exports.velocityPerSecond = velocityPerSecond;
    exports.warnOnce = warnOnce;
    exports.wrap = wrap;
  })(cjs);
  return cjs;
}
var hasRequiredCjs$1;
function requireCjs$1() {
  if (hasRequiredCjs$1) return cjs$1;
  hasRequiredCjs$1 = 1;
  Object.defineProperty(cjs$1, "__esModule", { value: true });
  var motionUtils = /* @__PURE__ */ requireCjs$2();
  const stepsOrder = [
    "setup",
    // Compute
    "read",
    // Read
    "resolveKeyframes",
    // Write/Read/Write/Read
    "preUpdate",
    // Compute
    "update",
    // Compute
    "preRender",
    // Compute
    "render",
    // Write
    "postRender"
    // Compute
  ];
  const statsBuffer = {
    value: null,
    addProjectionMetrics: null
  };
  function createRenderStep(runNextFrame, stepName) {
    let thisFrame = /* @__PURE__ */ new Set();
    let nextFrame = /* @__PURE__ */ new Set();
    let isProcessing = false;
    let flushNextFrame = false;
    const toKeepAlive = /* @__PURE__ */ new WeakSet();
    let latestFrameData = {
      delta: 0,
      timestamp: 0,
      isProcessing: false
    };
    let numCalls = 0;
    function triggerCallback(callback) {
      if (toKeepAlive.has(callback)) {
        step.schedule(callback);
        runNextFrame();
      }
      numCalls++;
      callback(latestFrameData);
    }
    const step = {
      /**
       * Schedule a process to run on the next frame.
       */
      schedule: (callback, keepAlive = false, immediate = false) => {
        const addToCurrentFrame = immediate && isProcessing;
        const queue = addToCurrentFrame ? thisFrame : nextFrame;
        if (keepAlive)
          toKeepAlive.add(callback);
        queue.add(callback);
        return callback;
      },
      /**
       * Cancel the provided callback from running on the next frame.
       */
      cancel: (callback) => {
        nextFrame.delete(callback);
        toKeepAlive.delete(callback);
      },
      /**
       * Execute all schedule callbacks.
       */
      process: (frameData2) => {
        latestFrameData = frameData2;
        if (isProcessing) {
          flushNextFrame = true;
          return;
        }
        isProcessing = true;
        const prevFrame = thisFrame;
        thisFrame = nextFrame;
        nextFrame = prevFrame;
        thisFrame.forEach(triggerCallback);
        if (stepName && statsBuffer.value) {
          statsBuffer.value.frameloop[stepName].push(numCalls);
        }
        numCalls = 0;
        thisFrame.clear();
        isProcessing = false;
        if (flushNextFrame) {
          flushNextFrame = false;
          step.process(frameData2);
        }
      }
    };
    return step;
  }
  const maxElapsed = 40;
  function createRenderBatcher(scheduleNextBatch, allowKeepAlive) {
    let runNextFrame = false;
    let useDefaultElapsed = true;
    const state = {
      delta: 0,
      timestamp: 0,
      isProcessing: false
    };
    const flagRunNextFrame = () => runNextFrame = true;
    const steps = stepsOrder.reduce((acc, key) => {
      acc[key] = createRenderStep(flagRunNextFrame, allowKeepAlive ? key : void 0);
      return acc;
    }, {});
    const { setup, read, resolveKeyframes, preUpdate, update, preRender, render, postRender } = steps;
    const processBatch = () => {
      const useManualTiming = motionUtils.MotionGlobalConfig.useManualTiming;
      const timestamp = useManualTiming ? state.timestamp : performance.now();
      runNextFrame = false;
      if (!useManualTiming) {
        state.delta = useDefaultElapsed ? 1e3 / 60 : Math.max(Math.min(timestamp - state.timestamp, maxElapsed), 1);
      }
      state.timestamp = timestamp;
      state.isProcessing = true;
      setup.process(state);
      read.process(state);
      resolveKeyframes.process(state);
      preUpdate.process(state);
      update.process(state);
      preRender.process(state);
      render.process(state);
      postRender.process(state);
      state.isProcessing = false;
      if (runNextFrame && allowKeepAlive) {
        useDefaultElapsed = false;
        scheduleNextBatch(processBatch);
      }
    };
    const wake = () => {
      runNextFrame = true;
      useDefaultElapsed = true;
      if (!state.isProcessing) {
        scheduleNextBatch(processBatch);
      }
    };
    const schedule = stepsOrder.reduce((acc, key) => {
      const step = steps[key];
      acc[key] = (process2, keepAlive = false, immediate = false) => {
        if (!runNextFrame)
          wake();
        return step.schedule(process2, keepAlive, immediate);
      };
      return acc;
    }, {});
    const cancel = (process2) => {
      for (let i = 0; i < stepsOrder.length; i++) {
        steps[stepsOrder[i]].cancel(process2);
      }
    };
    return { schedule, cancel, state, steps };
  }
  const { schedule: frame, cancel: cancelFrame, state: frameData, steps: frameSteps } = /* @__PURE__ */ createRenderBatcher(typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : motionUtils.noop, true);
  let now;
  function clearTime() {
    now = void 0;
  }
  const time = {
    now: () => {
      if (now === void 0) {
        time.set(frameData.isProcessing || motionUtils.MotionGlobalConfig.useManualTiming ? frameData.timestamp : performance.now());
      }
      return now;
    },
    set: (newTime) => {
      now = newTime;
      queueMicrotask(clearTime);
    }
  };
  const activeAnimations = {
    layout: 0,
    mainThread: 0,
    waapi: 0
  };
  const checkStringStartsWith = (token) => (key) => typeof key === "string" && key.startsWith(token);
  const isCSSVariableName = /* @__PURE__ */ checkStringStartsWith("--");
  const startsAsVariableToken = /* @__PURE__ */ checkStringStartsWith("var(--");
  const isCSSVariableToken = (value) => {
    const startsWithToken = startsAsVariableToken(value);
    if (!startsWithToken)
      return false;
    return singleCssVariableRegex.test(value.split("/*")[0].trim());
  };
  const singleCssVariableRegex = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
  function containsCSSVariable(value) {
    if (typeof value !== "string")
      return false;
    return value.split("/*")[0].includes("var(--");
  }
  const number = {
    test: (v) => typeof v === "number",
    parse: parseFloat,
    transform: (v) => v
  };
  const alpha = {
    ...number,
    transform: (v) => motionUtils.clamp(0, 1, v)
  };
  const scale = {
    ...number,
    default: 1
  };
  const sanitize = (v) => Math.round(v * 1e5) / 1e5;
  const floatRegex = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
  function isNullish(v) {
    return v == null;
  }
  const singleColorRegex = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
  const isColorString = (type, testProp) => (v) => {
    return Boolean(typeof v === "string" && singleColorRegex.test(v) && v.startsWith(type) || testProp && !isNullish(v) && Object.prototype.hasOwnProperty.call(v, testProp));
  };
  const splitColor = (aName, bName, cName) => (v) => {
    if (typeof v !== "string")
      return v;
    const [a, b, c, alpha2] = v.match(floatRegex);
    return {
      [aName]: parseFloat(a),
      [bName]: parseFloat(b),
      [cName]: parseFloat(c),
      alpha: alpha2 !== void 0 ? parseFloat(alpha2) : 1
    };
  };
  const clampRgbUnit = (v) => motionUtils.clamp(0, 255, v);
  const rgbUnit = {
    ...number,
    transform: (v) => Math.round(clampRgbUnit(v))
  };
  const rgba = {
    test: /* @__PURE__ */ isColorString("rgb", "red"),
    parse: /* @__PURE__ */ splitColor("red", "green", "blue"),
    transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
  };
  function parseHex(v) {
    let r = "";
    let g = "";
    let b = "";
    let a = "";
    if (v.length > 5) {
      r = v.substring(1, 3);
      g = v.substring(3, 5);
      b = v.substring(5, 7);
      a = v.substring(7, 9);
    } else {
      r = v.substring(1, 2);
      g = v.substring(2, 3);
      b = v.substring(3, 4);
      a = v.substring(4, 5);
      r += r;
      g += g;
      b += b;
      a += a;
    }
    return {
      red: parseInt(r, 16),
      green: parseInt(g, 16),
      blue: parseInt(b, 16),
      alpha: a ? parseInt(a, 16) / 255 : 1
    };
  }
  const hex = {
    test: /* @__PURE__ */ isColorString("#"),
    parse: parseHex,
    transform: rgba.transform
  };
  const createUnitType = /* @__NO_SIDE_EFFECTS__ */ (unit) => ({
    test: (v) => typeof v === "string" && v.endsWith(unit) && v.split(" ").length === 1,
    parse: parseFloat,
    transform: (v) => `${v}${unit}`
  });
  const degrees = /* @__PURE__ */ createUnitType("deg");
  const percent = /* @__PURE__ */ createUnitType("%");
  const px = /* @__PURE__ */ createUnitType("px");
  const vh = /* @__PURE__ */ createUnitType("vh");
  const vw = /* @__PURE__ */ createUnitType("vw");
  const progressPercentage = /* @__PURE__ */ (() => ({
    ...percent,
    parse: (v) => percent.parse(v) / 100,
    transform: (v) => percent.transform(v * 100)
  }))();
  const hsla = {
    test: /* @__PURE__ */ isColorString("hsl", "hue"),
    parse: /* @__PURE__ */ splitColor("hue", "saturation", "lightness"),
    transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
      return "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
    }
  };
  const color = {
    test: (v) => rgba.test(v) || hex.test(v) || hsla.test(v),
    parse: (v) => {
      if (rgba.test(v)) {
        return rgba.parse(v);
      } else if (hsla.test(v)) {
        return hsla.parse(v);
      } else {
        return hex.parse(v);
      }
    },
    transform: (v) => {
      return typeof v === "string" ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v);
    },
    getAnimatableNone: (v) => {
      const parsed = color.parse(v);
      parsed.alpha = 0;
      return color.transform(parsed);
    }
  };
  const colorRegex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
  function test(v) {
    return isNaN(v) && typeof v === "string" && (v.match(floatRegex)?.length || 0) + (v.match(colorRegex)?.length || 0) > 0;
  }
  const NUMBER_TOKEN = "number";
  const COLOR_TOKEN = "color";
  const VAR_TOKEN = "var";
  const VAR_FUNCTION_TOKEN = "var(";
  const SPLIT_TOKEN = "${}";
  const complexRegex = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
  function analyseComplexValue(value) {
    const originalValue = value.toString();
    const values = [];
    const indexes = {
      color: [],
      number: [],
      var: []
    };
    const types = [];
    let i = 0;
    const tokenised = originalValue.replace(complexRegex, (parsedValue) => {
      if (color.test(parsedValue)) {
        indexes.color.push(i);
        types.push(COLOR_TOKEN);
        values.push(color.parse(parsedValue));
      } else if (parsedValue.startsWith(VAR_FUNCTION_TOKEN)) {
        indexes.var.push(i);
        types.push(VAR_TOKEN);
        values.push(parsedValue);
      } else {
        indexes.number.push(i);
        types.push(NUMBER_TOKEN);
        values.push(parseFloat(parsedValue));
      }
      ++i;
      return SPLIT_TOKEN;
    });
    const split = tokenised.split(SPLIT_TOKEN);
    return { values, split, indexes, types };
  }
  function parseComplexValue(v) {
    return analyseComplexValue(v).values;
  }
  function buildTransformer({ split, types }) {
    const numSections = split.length;
    return (v) => {
      let output = "";
      for (let i = 0; i < numSections; i++) {
        output += split[i];
        if (v[i] !== void 0) {
          const type = types[i];
          if (type === NUMBER_TOKEN) {
            output += sanitize(v[i]);
          } else if (type === COLOR_TOKEN) {
            output += color.transform(v[i]);
          } else {
            output += v[i];
          }
        }
      }
      return output;
    };
  }
  function createTransformer(source) {
    return buildTransformer(analyseComplexValue(source));
  }
  const convertNumbersToZero = (v) => typeof v === "number" ? 0 : color.test(v) ? color.getAnimatableNone(v) : v;
  const convertToZero = (value, splitBefore) => {
    if (typeof value === "number") {
      return splitBefore?.trim().endsWith("/") ? value : 0;
    }
    return convertNumbersToZero(value);
  };
  function getAnimatableNone$1(v) {
    const info = analyseComplexValue(v);
    const transformer = buildTransformer(info);
    return transformer(info.values.map((value, i) => convertToZero(value, info.split[i])));
  }
  const complex = {
    test,
    parse: parseComplexValue,
    createTransformer,
    getAnimatableNone: getAnimatableNone$1
  };
  function hueToRgb(p, q, t) {
    if (t < 0)
      t += 1;
    if (t > 1)
      t -= 1;
    if (t < 1 / 6)
      return p + (q - p) * 6 * t;
    if (t < 1 / 2)
      return q;
    if (t < 2 / 3)
      return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  function hslaToRgba({ hue, saturation, lightness, alpha: alpha2 }) {
    hue /= 360;
    saturation /= 100;
    lightness /= 100;
    let red = 0;
    let green = 0;
    let blue = 0;
    if (!saturation) {
      red = green = blue = lightness;
    } else {
      const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
      const p = 2 * lightness - q;
      red = hueToRgb(p, q, hue + 1 / 3);
      green = hueToRgb(p, q, hue);
      blue = hueToRgb(p, q, hue - 1 / 3);
    }
    return {
      red: Math.round(red * 255),
      green: Math.round(green * 255),
      blue: Math.round(blue * 255),
      alpha: alpha2
    };
  }
  function mixImmediate(a, b) {
    return (p) => p > 0 ? b : a;
  }
  const mixNumber$1 = (from, to, progress) => {
    return from + (to - from) * progress;
  };
  const mixLinearColor = (from, to, v) => {
    const fromExpo = from * from;
    const expo = v * (to * to - fromExpo) + fromExpo;
    return expo < 0 ? 0 : Math.sqrt(expo);
  };
  const colorTypes = [hex, rgba, hsla];
  const getColorType = (v) => colorTypes.find((type) => type.test(v));
  function asRGBA(color2) {
    const type = getColorType(color2);
    motionUtils.warning(Boolean(type), `'${color2}' is not an animatable color. Use the equivalent color code instead.`, "color-not-animatable");
    if (!Boolean(type))
      return false;
    let model = type.parse(color2);
    if (type === hsla) {
      model = hslaToRgba(model);
    }
    return model;
  }
  const mixColor = (from, to) => {
    const fromRGBA = asRGBA(from);
    const toRGBA = asRGBA(to);
    if (!fromRGBA || !toRGBA) {
      return mixImmediate(from, to);
    }
    const blended = { ...fromRGBA };
    return (v) => {
      blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v);
      blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v);
      blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v);
      blended.alpha = mixNumber$1(fromRGBA.alpha, toRGBA.alpha, v);
      return rgba.transform(blended);
    };
  };
  const invisibleValues = /* @__PURE__ */ new Set(["none", "hidden"]);
  function mixVisibility(origin, target) {
    if (invisibleValues.has(origin)) {
      return (p) => p <= 0 ? origin : target;
    } else {
      return (p) => p >= 1 ? target : origin;
    }
  }
  function mixNumber(a, b) {
    return (p) => mixNumber$1(a, b, p);
  }
  function getMixer(a) {
    if (typeof a === "number") {
      return mixNumber;
    } else if (typeof a === "string") {
      return isCSSVariableToken(a) ? mixImmediate : color.test(a) ? mixColor : mixComplex;
    } else if (Array.isArray(a)) {
      return mixArray;
    } else if (typeof a === "object") {
      return color.test(a) ? mixColor : mixObject;
    }
    return mixImmediate;
  }
  function mixArray(a, b) {
    const output = [...a];
    const numValues = output.length;
    const blendValue = a.map((v, i) => getMixer(v)(v, b[i]));
    return (p) => {
      for (let i = 0; i < numValues; i++) {
        output[i] = blendValue[i](p);
      }
      return output;
    };
  }
  function mixObject(a, b) {
    const output = { ...a, ...b };
    const blendValue = {};
    for (const key in output) {
      if (a[key] !== void 0 && b[key] !== void 0) {
        blendValue[key] = getMixer(a[key])(a[key], b[key]);
      }
    }
    return (v) => {
      for (const key in blendValue) {
        output[key] = blendValue[key](v);
      }
      return output;
    };
  }
  function matchOrder(origin, target) {
    const orderedOrigin = [];
    const pointers = { color: 0, var: 0, number: 0 };
    for (let i = 0; i < target.values.length; i++) {
      const type = target.types[i];
      const originIndex = origin.indexes[type][pointers[type]];
      const originValue = origin.values[originIndex] ?? 0;
      orderedOrigin[i] = originValue;
      pointers[type]++;
    }
    return orderedOrigin;
  }
  const mixComplex = (origin, target) => {
    const template = complex.createTransformer(target);
    const originStats = analyseComplexValue(origin);
    const targetStats = analyseComplexValue(target);
    const canInterpolate = originStats.indexes.var.length === targetStats.indexes.var.length && originStats.indexes.color.length === targetStats.indexes.color.length && originStats.indexes.number.length >= targetStats.indexes.number.length;
    if (canInterpolate) {
      if (invisibleValues.has(origin) && !targetStats.values.length || invisibleValues.has(target) && !originStats.values.length) {
        return mixVisibility(origin, target);
      }
      return motionUtils.pipe(mixArray(matchOrder(originStats, targetStats), targetStats.values), template);
    } else {
      motionUtils.warning(true, `Complex values '${origin}' and '${target}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`, "complex-values-different");
      return mixImmediate(origin, target);
    }
  };
  function mix(from, to, p) {
    if (typeof from === "number" && typeof to === "number" && typeof p === "number") {
      return mixNumber$1(from, to, p);
    }
    const mixer = getMixer(from);
    return mixer(from, to);
  }
  const frameloopDriver = (update) => {
    const passTimestamp = ({ timestamp }) => update(timestamp);
    return {
      start: (keepAlive = true) => frame.update(passTimestamp, keepAlive),
      stop: () => cancelFrame(passTimestamp),
      /**
       * If we're processing this frame we can use the
       * framelocked timestamp to keep things in sync.
       */
      now: () => frameData.isProcessing ? frameData.timestamp : time.now()
    };
  };
  const generateLinearEasing = (easing, duration, resolution = 10) => {
    let points = "";
    const numPoints = Math.max(Math.round(duration / resolution), 2);
    for (let i = 0; i < numPoints; i++) {
      points += Math.round(easing(i / (numPoints - 1)) * 1e4) / 1e4 + ", ";
    }
    return `linear(${points.substring(0, points.length - 2)})`;
  };
  const maxGeneratorDuration = 2e4;
  function calcGeneratorDuration(generator) {
    let duration = 0;
    const timeStep = 50;
    let state = generator.next(duration);
    while (!state.done && duration < maxGeneratorDuration) {
      duration += timeStep;
      state = generator.next(duration);
    }
    return duration >= maxGeneratorDuration ? Infinity : duration;
  }
  function createGeneratorEasing(options, scale2 = 100, createGenerator) {
    const generator = createGenerator({ ...options, keyframes: [0, scale2] });
    const duration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
    return {
      type: "keyframes",
      ease: (progress) => {
        return generator.next(duration * progress).value / scale2;
      },
      duration: motionUtils.millisecondsToSeconds(duration)
    };
  }
  const springDefaults = {
    // Default spring physics
    stiffness: 100,
    damping: 10,
    mass: 1,
    velocity: 0,
    // Default duration/bounce-based options
    duration: 800,
    // in ms
    bounce: 0.3,
    visualDuration: 0.3,
    // in seconds
    // Rest thresholds
    restSpeed: {
      granular: 0.01,
      default: 2
    },
    restDelta: {
      granular: 5e-3,
      default: 0.5
    },
    // Limits
    minDuration: 0.01,
    // in seconds
    maxDuration: 10,
    // in seconds
    minDamping: 0.05,
    maxDamping: 1
  };
  function calcAngularFreq(undampedFreq, dampingRatio) {
    return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
  }
  const rootIterations = 12;
  function approximateRoot(envelope, derivative, initialGuess) {
    let result = initialGuess;
    for (let i = 1; i < rootIterations; i++) {
      result = result - envelope(result) / derivative(result);
    }
    return result;
  }
  const safeMin = 1e-3;
  function findSpring({ duration = springDefaults.duration, bounce = springDefaults.bounce, velocity = springDefaults.velocity, mass = springDefaults.mass }) {
    let envelope;
    let derivative;
    motionUtils.warning(duration <= motionUtils.secondsToMilliseconds(springDefaults.maxDuration), "Spring duration must be 10 seconds or less", "spring-duration-limit");
    let dampingRatio = 1 - bounce;
    dampingRatio = motionUtils.clamp(springDefaults.minDamping, springDefaults.maxDamping, dampingRatio);
    duration = motionUtils.clamp(springDefaults.minDuration, springDefaults.maxDuration, motionUtils.millisecondsToSeconds(duration));
    if (dampingRatio < 1) {
      envelope = (undampedFreq2) => {
        const exponentialDecay = undampedFreq2 * dampingRatio;
        const delta = exponentialDecay * duration;
        const a = exponentialDecay - velocity;
        const b = calcAngularFreq(undampedFreq2, dampingRatio);
        const c = Math.exp(-delta);
        return safeMin - a / b * c;
      };
      derivative = (undampedFreq2) => {
        const exponentialDecay = undampedFreq2 * dampingRatio;
        const delta = exponentialDecay * duration;
        const d = delta * velocity + velocity;
        const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq2, 2) * duration;
        const f = Math.exp(-delta);
        const g = calcAngularFreq(Math.pow(undampedFreq2, 2), dampingRatio);
        const factor = -envelope(undampedFreq2) + safeMin > 0 ? -1 : 1;
        return factor * ((d - e) * f) / g;
      };
    } else {
      envelope = (undampedFreq2) => {
        const a = Math.exp(-undampedFreq2 * duration);
        const b = (undampedFreq2 - velocity) * duration + 1;
        return -safeMin + a * b;
      };
      derivative = (undampedFreq2) => {
        const a = Math.exp(-undampedFreq2 * duration);
        const b = (velocity - undampedFreq2) * (duration * duration);
        return a * b;
      };
    }
    const initialGuess = 5 / duration;
    const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
    duration = motionUtils.secondsToMilliseconds(duration);
    if (isNaN(undampedFreq)) {
      return {
        stiffness: springDefaults.stiffness,
        damping: springDefaults.damping,
        duration
      };
    } else {
      const stiffness = Math.pow(undampedFreq, 2) * mass;
      return {
        stiffness,
        damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
        duration
      };
    }
  }
  const durationKeys = ["duration", "bounce"];
  const physicsKeys = ["stiffness", "damping", "mass"];
  function isSpringType(options, keys) {
    return keys.some((key) => options[key] !== void 0);
  }
  function getSpringOptions(options) {
    let springOptions = {
      velocity: springDefaults.velocity,
      stiffness: springDefaults.stiffness,
      damping: springDefaults.damping,
      mass: springDefaults.mass,
      isResolvedFromDuration: false,
      ...options
    };
    if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys)) {
      springOptions.velocity = 0;
      if (options.visualDuration) {
        const visualDuration = options.visualDuration;
        const root = 2 * Math.PI / (visualDuration * 1.2);
        const stiffness = root * root;
        const damping = 2 * motionUtils.clamp(0.05, 1, 1 - (options.bounce || 0)) * Math.sqrt(stiffness);
        springOptions = {
          ...springOptions,
          mass: springDefaults.mass,
          stiffness,
          damping
        };
      } else {
        const derived = findSpring({ ...options, velocity: 0 });
        springOptions = {
          ...springOptions,
          ...derived,
          mass: springDefaults.mass
        };
        springOptions.isResolvedFromDuration = true;
      }
    }
    return springOptions;
  }
  function spring(optionsOrVisualDuration = springDefaults.visualDuration, bounce = springDefaults.bounce) {
    const options = typeof optionsOrVisualDuration !== "object" ? {
      visualDuration: optionsOrVisualDuration,
      keyframes: [0, 1],
      bounce
    } : optionsOrVisualDuration;
    let { restSpeed, restDelta } = options;
    const origin = options.keyframes[0];
    const target = options.keyframes[options.keyframes.length - 1];
    const state = { done: false, value: origin };
    const { stiffness, damping, mass, duration, velocity, isResolvedFromDuration } = getSpringOptions({
      ...options,
      velocity: -motionUtils.millisecondsToSeconds(options.velocity || 0)
    });
    const initialVelocity = velocity || 0;
    const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
    const initialDelta = target - origin;
    const undampedAngularFreq = motionUtils.millisecondsToSeconds(Math.sqrt(stiffness / mass));
    const isGranularScale = Math.abs(initialDelta) < 5;
    restSpeed || (restSpeed = isGranularScale ? springDefaults.restSpeed.granular : springDefaults.restSpeed.default);
    restDelta || (restDelta = isGranularScale ? springDefaults.restDelta.granular : springDefaults.restDelta.default);
    let resolveSpring;
    let resolveVelocity;
    let angularFreq;
    let A;
    let sinCoeff;
    let cosCoeff;
    if (dampingRatio < 1) {
      angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
      A = (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq;
      resolveSpring = (t) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        return target - envelope * (A * Math.sin(angularFreq * t) + initialDelta * Math.cos(angularFreq * t));
      };
      sinCoeff = dampingRatio * undampedAngularFreq * A + initialDelta * angularFreq;
      cosCoeff = dampingRatio * undampedAngularFreq * initialDelta - A * angularFreq;
      resolveVelocity = (t) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        return envelope * (sinCoeff * Math.sin(angularFreq * t) + cosCoeff * Math.cos(angularFreq * t));
      };
    } else if (dampingRatio === 1) {
      resolveSpring = (t) => target - Math.exp(-undampedAngularFreq * t) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t);
      const C = initialVelocity + undampedAngularFreq * initialDelta;
      resolveVelocity = (t) => Math.exp(-undampedAngularFreq * t) * (undampedAngularFreq * C * t - initialVelocity);
    } else {
      const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
      resolveSpring = (t) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        const freqForT = Math.min(dampedAngularFreq * t, 300);
        return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq;
      };
      const P = (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / dampedAngularFreq;
      const sinhCoeff = dampingRatio * undampedAngularFreq * P - initialDelta * dampedAngularFreq;
      const coshCoeff = dampingRatio * undampedAngularFreq * initialDelta - P * dampedAngularFreq;
      resolveVelocity = (t) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        const freqForT = Math.min(dampedAngularFreq * t, 300);
        return envelope * (sinhCoeff * Math.sinh(freqForT) + coshCoeff * Math.cosh(freqForT));
      };
    }
    const generator = {
      calculatedDuration: isResolvedFromDuration ? duration || null : null,
      velocity: (t) => motionUtils.secondsToMilliseconds(resolveVelocity(t)),
      next: (t) => {
        if (!isResolvedFromDuration && dampingRatio < 1) {
          const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
          const sin = Math.sin(angularFreq * t);
          const cos = Math.cos(angularFreq * t);
          const current3 = target - envelope * (A * sin + initialDelta * cos);
          const currentVelocity = motionUtils.secondsToMilliseconds(envelope * (sinCoeff * sin + cosCoeff * cos));
          state.done = Math.abs(currentVelocity) <= restSpeed && Math.abs(target - current3) <= restDelta;
          state.value = state.done ? target : current3;
          return state;
        }
        const current2 = resolveSpring(t);
        if (!isResolvedFromDuration) {
          const currentVelocity = motionUtils.secondsToMilliseconds(resolveVelocity(t));
          state.done = Math.abs(currentVelocity) <= restSpeed && Math.abs(target - current2) <= restDelta;
        } else {
          state.done = t >= duration;
        }
        state.value = state.done ? target : current2;
        return state;
      },
      toString: () => {
        const calculatedDuration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
        const easing = generateLinearEasing((progress) => generator.next(calculatedDuration * progress).value, calculatedDuration, 30);
        return calculatedDuration + "ms " + easing;
      },
      toTransition: () => {
      }
    };
    return generator;
  }
  spring.applyToOptions = (options) => {
    const generatorOptions = createGeneratorEasing(options, 100, spring);
    options.ease = generatorOptions.ease;
    options.duration = motionUtils.secondsToMilliseconds(generatorOptions.duration);
    options.type = "keyframes";
    return options;
  };
  const velocitySampleDuration = 5;
  function getGeneratorVelocity(resolveValue, t, current2) {
    const prevT = Math.max(t - velocitySampleDuration, 0);
    return motionUtils.velocityPerSecond(current2 - resolveValue(prevT), t - prevT);
  }
  function inertia({ keyframes: keyframes2, velocity = 0, power = 0.8, timeConstant = 325, bounceDamping = 10, bounceStiffness = 500, modifyTarget, min, max, restDelta = 0.5, restSpeed }) {
    const origin = keyframes2[0];
    const state = {
      done: false,
      value: origin
    };
    const isOutOfBounds = (v) => min !== void 0 && v < min || max !== void 0 && v > max;
    const nearestBoundary = (v) => {
      if (min === void 0)
        return max;
      if (max === void 0)
        return min;
      return Math.abs(min - v) < Math.abs(max - v) ? min : max;
    };
    let amplitude = power * velocity;
    const ideal = origin + amplitude;
    const target = modifyTarget === void 0 ? ideal : modifyTarget(ideal);
    if (target !== ideal)
      amplitude = target - origin;
    const calcDelta = (t) => -amplitude * Math.exp(-t / timeConstant);
    const calcLatest = (t) => target + calcDelta(t);
    const applyFriction = (t) => {
      const delta = calcDelta(t);
      const latest = calcLatest(t);
      state.done = Math.abs(delta) <= restDelta;
      state.value = state.done ? target : latest;
    };
    let timeReachedBoundary;
    let spring$1;
    const checkCatchBoundary = (t) => {
      if (!isOutOfBounds(state.value))
        return;
      timeReachedBoundary = t;
      spring$1 = spring({
        keyframes: [state.value, nearestBoundary(state.value)],
        velocity: getGeneratorVelocity(calcLatest, t, state.value),
        // TODO: This should be passing * 1000
        damping: bounceDamping,
        stiffness: bounceStiffness,
        restDelta,
        restSpeed
      });
    };
    checkCatchBoundary(0);
    return {
      calculatedDuration: null,
      next: (t) => {
        let hasUpdatedFrame = false;
        if (!spring$1 && timeReachedBoundary === void 0) {
          hasUpdatedFrame = true;
          applyFriction(t);
          checkCatchBoundary(t);
        }
        if (timeReachedBoundary !== void 0 && t >= timeReachedBoundary) {
          return spring$1.next(t - timeReachedBoundary);
        } else {
          !hasUpdatedFrame && applyFriction(t);
          return state;
        }
      }
    };
  }
  function createMixers(output, ease2, customMixer) {
    const mixers = [];
    const mixerFactory = customMixer || motionUtils.MotionGlobalConfig.mix || mix;
    const numMixers = output.length - 1;
    for (let i = 0; i < numMixers; i++) {
      let mixer = mixerFactory(output[i], output[i + 1]);
      if (ease2) {
        const easingFunction = Array.isArray(ease2) ? ease2[i] || motionUtils.noop : ease2;
        mixer = motionUtils.pipe(easingFunction, mixer);
      }
      mixers.push(mixer);
    }
    return mixers;
  }
  function interpolate(input, output, { clamp: isClamp = true, ease: ease2, mixer } = {}) {
    const inputLength = input.length;
    motionUtils.invariant(inputLength === output.length, "Both input and output ranges must be the same length", "range-length");
    if (inputLength === 1)
      return () => output[0];
    if (inputLength === 2 && output[0] === output[1])
      return () => output[1];
    const isZeroDeltaRange = input[0] === input[1];
    if (input[0] > input[inputLength - 1]) {
      input = [...input].reverse();
      output = [...output].reverse();
    }
    const mixers = createMixers(output, ease2, mixer);
    const numMixers = mixers.length;
    const interpolator = (v) => {
      if (isZeroDeltaRange && v < input[0])
        return output[0];
      let i = 0;
      if (numMixers > 1) {
        for (; i < input.length - 2; i++) {
          if (v < input[i + 1])
            break;
        }
      }
      const progressInRange = motionUtils.progress(input[i], input[i + 1], v);
      return mixers[i](progressInRange);
    };
    return isClamp ? (v) => interpolator(motionUtils.clamp(input[0], input[inputLength - 1], v)) : interpolator;
  }
  function fillOffset(offset, remaining) {
    const min = offset[offset.length - 1];
    for (let i = 1; i <= remaining; i++) {
      const offsetProgress = motionUtils.progress(0, remaining, i);
      offset.push(mixNumber$1(min, 1, offsetProgress));
    }
  }
  function defaultOffset(arr) {
    const offset = [0];
    fillOffset(offset, arr.length - 1);
    return offset;
  }
  function convertOffsetToTimes(offset, duration) {
    return offset.map((o) => o * duration);
  }
  function defaultEasing(values, easing) {
    return values.map(() => easing || motionUtils.easeInOut).splice(0, values.length - 1);
  }
  function keyframes({ duration = 300, keyframes: keyframeValues, times, ease: ease2 = "easeInOut" }) {
    const easingFunctions = motionUtils.isEasingArray(ease2) ? ease2.map(motionUtils.easingDefinitionToFunction) : motionUtils.easingDefinitionToFunction(ease2);
    const state = {
      done: false,
      value: keyframeValues[0]
    };
    const absoluteTimes = convertOffsetToTimes(
      // Only use the provided offsets if they're the correct length
      // TODO Maybe we should warn here if there's a length mismatch
      times && times.length === keyframeValues.length ? times : defaultOffset(keyframeValues),
      duration
    );
    const mapTimeToKeyframe = interpolate(absoluteTimes, keyframeValues, {
      ease: Array.isArray(easingFunctions) ? easingFunctions : defaultEasing(keyframeValues, easingFunctions)
    });
    return {
      calculatedDuration: duration,
      next: (t) => {
        state.value = mapTimeToKeyframe(t);
        state.done = t >= duration;
        return state;
      }
    };
  }
  const isNotNull = (value) => value !== null;
  function getFinalKeyframe(keyframes2, { repeat, repeatType = "loop" }, finalKeyframe, speed = 1) {
    const resolvedKeyframes = keyframes2.filter(isNotNull);
    const useFirstKeyframe = speed < 0 || repeat && repeatType !== "loop" && repeat % 2 === 1;
    const index = useFirstKeyframe ? 0 : resolvedKeyframes.length - 1;
    return !index || finalKeyframe === void 0 ? resolvedKeyframes[index] : finalKeyframe;
  }
  const transitionTypeMap = {
    decay: inertia,
    inertia,
    tween: keyframes,
    keyframes,
    spring
  };
  function replaceTransitionType(transition) {
    if (typeof transition.type === "string") {
      transition.type = transitionTypeMap[transition.type];
    }
  }
  class WithPromise {
    constructor() {
      this.updateFinished();
    }
    get finished() {
      return this._finished;
    }
    updateFinished() {
      this._finished = new Promise((resolve) => {
        this.resolve = resolve;
      });
    }
    notifyFinished() {
      this.resolve();
    }
    /**
     * Allows the animation to be awaited.
     *
     * @deprecated Use `finished` instead.
     */
    then(onResolve, onReject) {
      return this.finished.then(onResolve, onReject);
    }
  }
  const percentToProgress = (percent2) => percent2 / 100;
  class JSAnimation extends WithPromise {
    constructor(options) {
      super();
      this.state = "idle";
      this.startTime = null;
      this.isStopped = false;
      this.currentTime = 0;
      this.holdTime = null;
      this.playbackSpeed = 1;
      this.delayState = {
        done: false,
        value: void 0
      };
      this.stop = () => {
        const { motionValue: motionValue2 } = this.options;
        if (motionValue2 && motionValue2.updatedAt !== time.now()) {
          this.tick(time.now());
        }
        this.isStopped = true;
        if (this.state === "idle")
          return;
        this.teardown();
        this.options.onStop?.();
      };
      activeAnimations.mainThread++;
      this.options = options;
      this.initAnimation();
      this.play();
      if (options.autoplay === false)
        this.pause();
    }
    initAnimation() {
      const { options } = this;
      replaceTransitionType(options);
      const { type = keyframes, repeat = 0, repeatDelay = 0, repeatType, velocity = 0 } = options;
      let { keyframes: keyframes$1 } = options;
      const generatorFactory = type || keyframes;
      if (generatorFactory !== keyframes && typeof keyframes$1[0] !== "number") {
        this.mixKeyframes = motionUtils.pipe(percentToProgress, mix(keyframes$1[0], keyframes$1[1]));
        keyframes$1 = [0, 100];
      }
      const generator = generatorFactory({ ...options, keyframes: keyframes$1 });
      if (repeatType === "mirror") {
        this.mirroredGenerator = generatorFactory({
          ...options,
          keyframes: [...keyframes$1].reverse(),
          velocity: -velocity
        });
      }
      if (generator.calculatedDuration === null) {
        generator.calculatedDuration = calcGeneratorDuration(generator);
      }
      const { calculatedDuration } = generator;
      this.calculatedDuration = calculatedDuration;
      this.resolvedDuration = calculatedDuration + repeatDelay;
      this.totalDuration = this.resolvedDuration * (repeat + 1) - repeatDelay;
      this.generator = generator;
    }
    updateTime(timestamp) {
      const animationTime = Math.round(timestamp - this.startTime) * this.playbackSpeed;
      if (this.holdTime !== null) {
        this.currentTime = this.holdTime;
      } else {
        this.currentTime = animationTime;
      }
    }
    tick(timestamp, sample = false) {
      const { generator, totalDuration, mixKeyframes, mirroredGenerator, resolvedDuration, calculatedDuration } = this;
      if (this.startTime === null)
        return generator.next(0);
      const { delay: delay2 = 0, keyframes: keyframes2, repeat, repeatType, repeatDelay, type, onUpdate, finalKeyframe } = this.options;
      if (this.speed > 0) {
        this.startTime = Math.min(this.startTime, timestamp);
      } else if (this.speed < 0) {
        this.startTime = Math.min(timestamp - totalDuration / this.speed, this.startTime);
      }
      if (sample) {
        this.currentTime = timestamp;
      } else {
        this.updateTime(timestamp);
      }
      const timeWithoutDelay = this.currentTime - delay2 * (this.playbackSpeed >= 0 ? 1 : -1);
      const isInDelayPhase = this.playbackSpeed >= 0 ? timeWithoutDelay < 0 : timeWithoutDelay > totalDuration;
      this.currentTime = Math.max(timeWithoutDelay, 0);
      if (this.state === "finished" && this.holdTime === null) {
        this.currentTime = totalDuration;
      }
      let elapsed = this.currentTime;
      let frameGenerator = generator;
      if (repeat) {
        const progress = Math.min(this.currentTime, totalDuration) / resolvedDuration;
        let currentIteration = Math.floor(progress);
        let iterationProgress = progress % 1;
        if (!iterationProgress && progress >= 1) {
          iterationProgress = 1;
        }
        iterationProgress === 1 && currentIteration--;
        currentIteration = Math.min(currentIteration, repeat + 1);
        const isOddIteration = Boolean(currentIteration % 2);
        if (isOddIteration) {
          if (repeatType === "reverse") {
            iterationProgress = 1 - iterationProgress;
            if (repeatDelay) {
              iterationProgress -= repeatDelay / resolvedDuration;
            }
          } else if (repeatType === "mirror") {
            frameGenerator = mirroredGenerator;
          }
        }
        elapsed = motionUtils.clamp(0, 1, iterationProgress) * resolvedDuration;
      }
      let state;
      if (isInDelayPhase) {
        this.delayState.value = keyframes2[0];
        state = this.delayState;
      } else {
        state = frameGenerator.next(elapsed);
      }
      if (mixKeyframes && !isInDelayPhase) {
        state.value = mixKeyframes(state.value);
      }
      let { done } = state;
      if (!isInDelayPhase && calculatedDuration !== null) {
        done = this.playbackSpeed >= 0 ? this.currentTime >= totalDuration : this.currentTime <= 0;
      }
      const isAnimationFinished = this.holdTime === null && (this.state === "finished" || this.state === "running" && done);
      if (isAnimationFinished && type !== inertia) {
        state.value = getFinalKeyframe(keyframes2, this.options, finalKeyframe, this.speed);
      }
      if (onUpdate) {
        onUpdate(state.value);
      }
      if (isAnimationFinished) {
        this.finish();
      }
      return state;
    }
    /**
     * Allows the returned animation to be awaited or promise-chained. Currently
     * resolves when the animation finishes at all but in a future update could/should
     * reject if its cancels.
     */
    then(resolve, reject) {
      return this.finished.then(resolve, reject);
    }
    get duration() {
      return motionUtils.millisecondsToSeconds(this.calculatedDuration);
    }
    get iterationDuration() {
      const { delay: delay2 = 0 } = this.options || {};
      return this.duration + motionUtils.millisecondsToSeconds(delay2);
    }
    get time() {
      return motionUtils.millisecondsToSeconds(this.currentTime);
    }
    set time(newTime) {
      newTime = motionUtils.secondsToMilliseconds(newTime);
      this.currentTime = newTime;
      if (this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0) {
        this.holdTime = newTime;
      } else if (this.driver) {
        this.startTime = this.driver.now() - newTime / this.playbackSpeed;
      }
      if (this.driver) {
        this.driver.start(false);
      } else {
        this.startTime = 0;
        this.state = "paused";
        this.holdTime = newTime;
        this.tick(newTime);
      }
    }
    /**
     * Returns the generator's velocity at the current time in units/second.
     * Uses the analytical derivative when available (springs), avoiding
     * the MotionValue's frame-dependent velocity estimation.
     */
    getGeneratorVelocity() {
      const t = this.currentTime;
      if (t <= 0)
        return this.options.velocity || 0;
      if (this.generator.velocity) {
        return this.generator.velocity(t);
      }
      const current2 = this.generator.next(t).value;
      return getGeneratorVelocity((s) => this.generator.next(s).value, t, current2);
    }
    get speed() {
      return this.playbackSpeed;
    }
    set speed(newSpeed) {
      const hasChanged = this.playbackSpeed !== newSpeed;
      if (hasChanged && this.driver) {
        this.updateTime(time.now());
      }
      this.playbackSpeed = newSpeed;
      if (hasChanged && this.driver) {
        this.time = motionUtils.millisecondsToSeconds(this.currentTime);
      }
    }
    play() {
      if (this.isStopped)
        return;
      const { driver = frameloopDriver, startTime } = this.options;
      if (!this.driver) {
        this.driver = driver((timestamp) => this.tick(timestamp));
      }
      this.options.onPlay?.();
      const now2 = this.driver.now();
      if (this.state === "finished") {
        this.updateFinished();
        this.startTime = now2;
      } else if (this.holdTime !== null) {
        this.startTime = now2 - this.holdTime;
      } else if (!this.startTime) {
        this.startTime = startTime ?? now2;
      }
      if (this.state === "finished" && this.speed < 0) {
        this.startTime += this.calculatedDuration;
      }
      this.holdTime = null;
      this.state = "running";
      this.driver.start();
    }
    pause() {
      this.state = "paused";
      this.updateTime(time.now());
      this.holdTime = this.currentTime;
    }
    complete() {
      if (this.state !== "running") {
        this.play();
      }
      this.state = "finished";
      this.holdTime = null;
    }
    finish() {
      this.notifyFinished();
      this.teardown();
      this.state = "finished";
      this.options.onComplete?.();
    }
    cancel() {
      this.holdTime = null;
      this.startTime = 0;
      this.tick(0);
      this.teardown();
      this.options.onCancel?.();
    }
    teardown() {
      this.state = "idle";
      this.stopDriver();
      this.startTime = this.holdTime = null;
      activeAnimations.mainThread--;
    }
    stopDriver() {
      if (!this.driver)
        return;
      this.driver.stop();
      this.driver = void 0;
    }
    sample(sampleTime) {
      this.startTime = 0;
      return this.tick(sampleTime, true);
    }
    attachTimeline(timeline) {
      if (this.options.allowFlatten) {
        this.options.type = "keyframes";
        this.options.ease = "linear";
        this.initAnimation();
      }
      this.driver?.stop();
      return timeline.observe(this);
    }
  }
  function animateValue(options) {
    return new JSAnimation(options);
  }
  function fillWildcards(keyframes2) {
    for (let i = 1; i < keyframes2.length; i++) {
      keyframes2[i] ?? (keyframes2[i] = keyframes2[i - 1]);
    }
  }
  const radToDeg = (rad) => rad * 180 / Math.PI;
  const rotate = (v) => {
    const angle = radToDeg(Math.atan2(v[1], v[0]));
    return rebaseAngle(angle);
  };
  const matrix2dParsers = {
    x: 4,
    y: 5,
    translateX: 4,
    translateY: 5,
    scaleX: 0,
    scaleY: 3,
    scale: (v) => (Math.abs(v[0]) + Math.abs(v[3])) / 2,
    rotate,
    rotateZ: rotate,
    skewX: (v) => radToDeg(Math.atan(v[1])),
    skewY: (v) => radToDeg(Math.atan(v[2])),
    skew: (v) => (Math.abs(v[1]) + Math.abs(v[2])) / 2
  };
  const rebaseAngle = (angle) => {
    angle = angle % 360;
    if (angle < 0)
      angle += 360;
    return angle;
  };
  const rotateZ = rotate;
  const scaleX = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  const scaleY = (v) => Math.sqrt(v[4] * v[4] + v[5] * v[5]);
  const matrix3dParsers = {
    x: 12,
    y: 13,
    z: 14,
    translateX: 12,
    translateY: 13,
    translateZ: 14,
    scaleX,
    scaleY,
    scale: (v) => (scaleX(v) + scaleY(v)) / 2,
    rotateX: (v) => rebaseAngle(radToDeg(Math.atan2(v[6], v[5]))),
    rotateY: (v) => rebaseAngle(radToDeg(Math.atan2(-v[2], v[0]))),
    rotateZ,
    rotate: rotateZ,
    skewX: (v) => radToDeg(Math.atan(v[4])),
    skewY: (v) => radToDeg(Math.atan(v[1])),
    skew: (v) => (Math.abs(v[1]) + Math.abs(v[4])) / 2
  };
  function defaultTransformValue(name) {
    return name.includes("scale") ? 1 : 0;
  }
  function parseValueFromTransform(transform2, name) {
    if (!transform2 || transform2 === "none") {
      return defaultTransformValue(name);
    }
    const matrix3dMatch = transform2.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
    let parsers;
    let match;
    if (matrix3dMatch) {
      parsers = matrix3dParsers;
      match = matrix3dMatch;
    } else {
      const matrix2dMatch = transform2.match(/^matrix\(([-\d.e\s,]+)\)$/u);
      parsers = matrix2dParsers;
      match = matrix2dMatch;
    }
    if (!match) {
      return defaultTransformValue(name);
    }
    const valueParser = parsers[name];
    const values = match[1].split(",").map(convertTransformToNumber);
    return typeof valueParser === "function" ? valueParser(values) : values[valueParser];
  }
  const readTransformValue = (instance, name) => {
    const { transform: transform2 = "none" } = getComputedStyle(instance);
    return parseValueFromTransform(transform2, name);
  };
  function convertTransformToNumber(value) {
    return parseFloat(value.trim());
  }
  const transformPropOrder = [
    "transformPerspective",
    "x",
    "y",
    "z",
    "translateX",
    "translateY",
    "translateZ",
    "scale",
    "scaleX",
    "scaleY",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skew",
    "skewX",
    "skewY"
  ];
  const transformProps = /* @__PURE__ */ (() => new Set(transformPropOrder))();
  const isNumOrPxType = (v) => v === number || v === px;
  const transformKeys = /* @__PURE__ */ new Set(["x", "y", "z"]);
  const nonTranslationalTransformKeys = transformPropOrder.filter((key) => !transformKeys.has(key));
  function removeNonTranslationalTransform(visualElement) {
    const removedTransforms = [];
    nonTranslationalTransformKeys.forEach((key) => {
      const value = visualElement.getValue(key);
      if (value !== void 0) {
        removedTransforms.push([key, value.get()]);
        value.set(key.startsWith("scale") ? 1 : 0);
      }
    });
    return removedTransforms;
  }
  const positionalValues = {
    // Dimensions
    width: ({ x }, { paddingLeft = "0", paddingRight = "0", boxSizing }) => {
      const width = x.max - x.min;
      return boxSizing === "border-box" ? width : width - parseFloat(paddingLeft) - parseFloat(paddingRight);
    },
    height: ({ y }, { paddingTop = "0", paddingBottom = "0", boxSizing }) => {
      const height = y.max - y.min;
      return boxSizing === "border-box" ? height : height - parseFloat(paddingTop) - parseFloat(paddingBottom);
    },
    top: (_bbox, { top }) => parseFloat(top),
    left: (_bbox, { left }) => parseFloat(left),
    bottom: ({ y }, { top }) => parseFloat(top) + (y.max - y.min),
    right: ({ x }, { left }) => parseFloat(left) + (x.max - x.min),
    // Transform
    x: (_bbox, { transform: transform2 }) => parseValueFromTransform(transform2, "x"),
    y: (_bbox, { transform: transform2 }) => parseValueFromTransform(transform2, "y")
  };
  positionalValues.translateX = positionalValues.x;
  positionalValues.translateY = positionalValues.y;
  const toResolve = /* @__PURE__ */ new Set();
  let isScheduled = false;
  let anyNeedsMeasurement = false;
  let isForced = false;
  function measureAllKeyframes() {
    if (anyNeedsMeasurement) {
      const resolversToMeasure = Array.from(toResolve).filter((resolver) => resolver.needsMeasurement);
      const elementsToMeasure = new Set(resolversToMeasure.map((resolver) => resolver.element));
      const transformsToRestore = /* @__PURE__ */ new Map();
      elementsToMeasure.forEach((element) => {
        const removedTransforms = removeNonTranslationalTransform(element);
        if (!removedTransforms.length)
          return;
        transformsToRestore.set(element, removedTransforms);
        element.render();
      });
      resolversToMeasure.forEach((resolver) => resolver.measureInitialState());
      elementsToMeasure.forEach((element) => {
        element.render();
        const restore = transformsToRestore.get(element);
        if (restore) {
          restore.forEach(([key, value]) => {
            element.getValue(key)?.set(value);
          });
        }
      });
      resolversToMeasure.forEach((resolver) => resolver.measureEndState());
      resolversToMeasure.forEach((resolver) => {
        if (resolver.suspendedScrollY !== void 0) {
          window.scrollTo(0, resolver.suspendedScrollY);
        }
      });
    }
    anyNeedsMeasurement = false;
    isScheduled = false;
    toResolve.forEach((resolver) => resolver.complete(isForced));
    toResolve.clear();
  }
  function readAllKeyframes() {
    toResolve.forEach((resolver) => {
      resolver.readKeyframes();
      if (resolver.needsMeasurement) {
        anyNeedsMeasurement = true;
      }
    });
  }
  function flushKeyframeResolvers() {
    isForced = true;
    readAllKeyframes();
    measureAllKeyframes();
    isForced = false;
  }
  class KeyframeResolver {
    constructor(unresolvedKeyframes, onComplete, name, motionValue2, element, isAsync = false) {
      this.state = "pending";
      this.isAsync = false;
      this.needsMeasurement = false;
      this.unresolvedKeyframes = [...unresolvedKeyframes];
      this.onComplete = onComplete;
      this.name = name;
      this.motionValue = motionValue2;
      this.element = element;
      this.isAsync = isAsync;
    }
    scheduleResolve() {
      this.state = "scheduled";
      if (this.isAsync) {
        toResolve.add(this);
        if (!isScheduled) {
          isScheduled = true;
          frame.read(readAllKeyframes);
          frame.resolveKeyframes(measureAllKeyframes);
        }
      } else {
        this.readKeyframes();
        this.complete();
      }
    }
    readKeyframes() {
      const { unresolvedKeyframes, name, element, motionValue: motionValue2 } = this;
      if (unresolvedKeyframes[0] === null) {
        const currentValue = motionValue2?.get();
        const finalKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
        if (currentValue !== void 0) {
          unresolvedKeyframes[0] = currentValue;
        } else if (element && name) {
          const valueAsRead = element.readValue(name, finalKeyframe);
          if (valueAsRead !== void 0 && valueAsRead !== null) {
            unresolvedKeyframes[0] = valueAsRead;
          }
        }
        if (unresolvedKeyframes[0] === void 0) {
          unresolvedKeyframes[0] = finalKeyframe;
        }
        if (motionValue2 && currentValue === void 0) {
          motionValue2.set(unresolvedKeyframes[0]);
        }
      }
      fillWildcards(unresolvedKeyframes);
    }
    setFinalKeyframe() {
    }
    measureInitialState() {
    }
    renderEndStyles() {
    }
    measureEndState() {
    }
    complete(isForcedComplete = false) {
      this.state = "complete";
      this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, isForcedComplete);
      toResolve.delete(this);
    }
    cancel() {
      if (this.state === "scheduled") {
        toResolve.delete(this);
        this.state = "pending";
      }
    }
    resume() {
      if (this.state === "pending")
        this.scheduleResolve();
    }
  }
  const isCSSVar = (name) => name.startsWith("--");
  function setStyle(element, name, value) {
    isCSSVar(name) ? element.style.setProperty(name, value) : element.style[name] = value;
  }
  const supportsFlags = {};
  function memoSupports(callback, supportsFlag) {
    const memoized = motionUtils.memo(callback);
    return () => supportsFlags[supportsFlag] ?? memoized();
  }
  const supportsScrollTimeline = /* @__PURE__ */ memoSupports(() => window.ScrollTimeline !== void 0, "scrollTimeline");
  const supportsViewTimeline = /* @__PURE__ */ memoSupports(() => window.ViewTimeline !== void 0, "viewTimeline");
  const supportsLinearEasing = /* @__PURE__ */ memoSupports(() => {
    try {
      document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
    } catch (e) {
      return false;
    }
    return true;
  }, "linearEasing");
  const cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
  const supportedWaapiEasing = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: /* @__PURE__ */ cubicBezierAsString([0, 0.65, 0.55, 1]),
    circOut: /* @__PURE__ */ cubicBezierAsString([0.55, 0, 1, 0.45]),
    backIn: /* @__PURE__ */ cubicBezierAsString([0.31, 0.01, 0.66, -0.59]),
    backOut: /* @__PURE__ */ cubicBezierAsString([0.33, 1.53, 0.69, 0.99])
  };
  function mapEasingToNativeEasing(easing, duration) {
    if (!easing) {
      return void 0;
    } else if (typeof easing === "function") {
      return supportsLinearEasing() ? generateLinearEasing(easing, duration) : "ease-out";
    } else if (motionUtils.isBezierDefinition(easing)) {
      return cubicBezierAsString(easing);
    } else if (Array.isArray(easing)) {
      return easing.map((segmentEasing) => mapEasingToNativeEasing(segmentEasing, duration) || supportedWaapiEasing.easeOut);
    } else {
      return supportedWaapiEasing[easing];
    }
  }
  function startWaapiAnimation(element, valueName, keyframes2, { delay: delay2 = 0, duration = 300, repeat = 0, repeatType = "loop", ease: ease2 = "easeOut", times } = {}, pseudoElement = void 0) {
    const keyframeOptions = {
      [valueName]: keyframes2
    };
    if (times)
      keyframeOptions.offset = times;
    const easing = mapEasingToNativeEasing(ease2, duration);
    if (Array.isArray(easing))
      keyframeOptions.easing = easing;
    if (statsBuffer.value) {
      activeAnimations.waapi++;
    }
    const options = {
      delay: delay2,
      duration,
      easing: !Array.isArray(easing) ? easing : "linear",
      fill: "both",
      iterations: repeat + 1,
      direction: repeatType === "reverse" ? "alternate" : "normal"
    };
    if (pseudoElement)
      options.pseudoElement = pseudoElement;
    const animation = element.animate(keyframeOptions, options);
    if (statsBuffer.value) {
      animation.finished.finally(() => {
        activeAnimations.waapi--;
      });
    }
    return animation;
  }
  function isGenerator(type) {
    return typeof type === "function" && "applyToOptions" in type;
  }
  function applyGeneratorOptions({ type, ...options }) {
    if (isGenerator(type) && supportsLinearEasing()) {
      return type.applyToOptions(options);
    } else {
      options.duration ?? (options.duration = 300);
      options.ease ?? (options.ease = "easeOut");
    }
    return options;
  }
  class NativeAnimation extends WithPromise {
    constructor(options) {
      super();
      this.finishedTime = null;
      this.isStopped = false;
      this.manualStartTime = null;
      if (!options)
        return;
      const { element, name, keyframes: keyframes2, pseudoElement, allowFlatten = false, finalKeyframe, onComplete } = options;
      this.isPseudoElement = Boolean(pseudoElement);
      this.allowFlatten = allowFlatten;
      this.options = options;
      motionUtils.invariant(typeof options.type !== "string", `Mini animate() doesn't support "type" as a string.`, "mini-spring");
      const transition = applyGeneratorOptions(options);
      this.animation = startWaapiAnimation(element, name, keyframes2, transition, pseudoElement);
      if (transition.autoplay === false) {
        this.animation.pause();
      }
      this.animation.onfinish = () => {
        this.finishedTime = this.time;
        if (!pseudoElement) {
          const keyframe = getFinalKeyframe(keyframes2, this.options, finalKeyframe, this.speed);
          if (this.updateMotionValue) {
            this.updateMotionValue(keyframe);
          }
          setStyle(element, name, keyframe);
          this.animation.cancel();
        }
        onComplete?.();
        this.notifyFinished();
      };
    }
    play() {
      if (this.isStopped)
        return;
      this.manualStartTime = null;
      this.animation.play();
      if (this.state === "finished") {
        this.updateFinished();
      }
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.finish?.();
    }
    cancel() {
      try {
        this.animation.cancel();
      } catch (e) {
      }
    }
    stop() {
      if (this.isStopped)
        return;
      this.isStopped = true;
      const { state } = this;
      if (state === "idle" || state === "finished") {
        return;
      }
      if (this.updateMotionValue) {
        this.updateMotionValue();
      } else {
        this.commitStyles();
      }
      if (!this.isPseudoElement)
        this.cancel();
    }
    /**
     * WAAPI doesn't natively have any interruption capabilities.
     *
     * In this method, we commit styles back to the DOM before cancelling
     * the animation.
     *
     * This is designed to be overridden by NativeAnimationExtended, which
     * will create a renderless JS animation and sample it twice to calculate
     * its current value, "previous" value, and therefore allow
     * Motion to also correctly calculate velocity for any subsequent animation
     * while deferring the commit until the next animation frame.
     */
    commitStyles() {
      const element = this.options?.element;
      if (!this.isPseudoElement && element?.isConnected) {
        this.animation.commitStyles?.();
      }
    }
    get duration() {
      const duration = this.animation.effect?.getComputedTiming?.().duration || 0;
      return motionUtils.millisecondsToSeconds(Number(duration));
    }
    get iterationDuration() {
      const { delay: delay2 = 0 } = this.options || {};
      return this.duration + motionUtils.millisecondsToSeconds(delay2);
    }
    get time() {
      return motionUtils.millisecondsToSeconds(Number(this.animation.currentTime) || 0);
    }
    set time(newTime) {
      const wasFinished = this.finishedTime !== null;
      this.manualStartTime = null;
      this.finishedTime = null;
      this.animation.currentTime = motionUtils.secondsToMilliseconds(newTime);
      if (wasFinished) {
        this.animation.pause();
      }
    }
    /**
     * The playback speed of the animation.
     * 1 = normal speed, 2 = double speed, 0.5 = half speed.
     */
    get speed() {
      return this.animation.playbackRate;
    }
    set speed(newSpeed) {
      if (newSpeed < 0)
        this.finishedTime = null;
      this.animation.playbackRate = newSpeed;
    }
    get state() {
      return this.finishedTime !== null ? "finished" : this.animation.playState;
    }
    get startTime() {
      return this.manualStartTime ?? Number(this.animation.startTime);
    }
    set startTime(newStartTime) {
      this.manualStartTime = this.animation.startTime = newStartTime;
    }
    /**
     * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
     */
    attachTimeline({ timeline, rangeStart, rangeEnd, observe }) {
      if (this.allowFlatten) {
        this.animation.effect?.updateTiming({ easing: "linear" });
      }
      this.animation.onfinish = null;
      if (timeline && supportsScrollTimeline()) {
        this.animation.timeline = timeline;
        if (rangeStart)
          this.animation.rangeStart = rangeStart;
        if (rangeEnd)
          this.animation.rangeEnd = rangeEnd;
        return motionUtils.noop;
      } else {
        return observe(this);
      }
    }
  }
  const unsupportedEasingFunctions = {
    anticipate: motionUtils.anticipate,
    backInOut: motionUtils.backInOut,
    circInOut: motionUtils.circInOut
  };
  function isUnsupportedEase(key) {
    return key in unsupportedEasingFunctions;
  }
  function replaceStringEasing(transition) {
    if (typeof transition.ease === "string" && isUnsupportedEase(transition.ease)) {
      transition.ease = unsupportedEasingFunctions[transition.ease];
    }
  }
  const sampleDelta = 10;
  class NativeAnimationExtended extends NativeAnimation {
    constructor(options) {
      replaceStringEasing(options);
      replaceTransitionType(options);
      super(options);
      if (options.startTime !== void 0 && options.autoplay !== false) {
        this.startTime = options.startTime;
      }
      this.options = options;
    }
    /**
     * WAAPI doesn't natively have any interruption capabilities.
     *
     * Rather than read committed styles back out of the DOM, we can
     * create a renderless JS animation and sample it twice to calculate
     * its current value, "previous" value, and therefore allow
     * Motion to calculate velocity for any subsequent animation.
     */
    updateMotionValue(value) {
      const { motionValue: motionValue2, onUpdate, onComplete, element, ...options } = this.options;
      if (!motionValue2)
        return;
      if (value !== void 0) {
        motionValue2.set(value);
        return;
      }
      const sampleAnimation = new JSAnimation({
        ...options,
        autoplay: false
      });
      const sampleTime = Math.max(sampleDelta, time.now() - this.startTime);
      const delta = motionUtils.clamp(0, sampleDelta, sampleTime - sampleDelta);
      const current2 = sampleAnimation.sample(sampleTime).value;
      const { name } = this.options;
      if (element && name)
        setStyle(element, name, current2);
      motionValue2.setWithVelocity(sampleAnimation.sample(Math.max(0, sampleTime - delta)).value, current2, delta);
      sampleAnimation.stop();
    }
  }
  const isAnimatable = (value, name) => {
    if (name === "zIndex")
      return false;
    if (typeof value === "number" || Array.isArray(value))
      return true;
    if (typeof value === "string" && // It's animatable if we have a string
    (complex.test(value) || value === "0") && // And it contains numbers and/or colors
    !value.startsWith("url(")) {
      return true;
    }
    return false;
  };
  function hasKeyframesChanged(keyframes2) {
    const current2 = keyframes2[0];
    if (keyframes2.length === 1)
      return true;
    for (let i = 0; i < keyframes2.length; i++) {
      if (keyframes2[i] !== current2)
        return true;
    }
  }
  function canAnimate(keyframes2, name, type, velocity) {
    const originKeyframe = keyframes2[0];
    if (originKeyframe === null) {
      return false;
    }
    if (name === "display" || name === "visibility")
      return true;
    const targetKeyframe = keyframes2[keyframes2.length - 1];
    const isOriginAnimatable = isAnimatable(originKeyframe, name);
    const isTargetAnimatable = isAnimatable(targetKeyframe, name);
    motionUtils.warning(isOriginAnimatable === isTargetAnimatable, `You are trying to animate ${name} from "${originKeyframe}" to "${targetKeyframe}". "${isOriginAnimatable ? targetKeyframe : originKeyframe}" is not an animatable value.`, "value-not-animatable");
    if (!isOriginAnimatable || !isTargetAnimatable) {
      return false;
    }
    return hasKeyframesChanged(keyframes2) || (type === "spring" || isGenerator(type)) && velocity;
  }
  function makeAnimationInstant(options) {
    options.duration = 0;
    options.type = "keyframes";
  }
  const acceleratedValues = /* @__PURE__ */ new Set([
    "opacity",
    "clipPath",
    "filter",
    "transform"
    // TODO: Can be accelerated but currently disabled until https://issues.chromium.org/issues/41491098 is resolved
    // or until we implement support for linear() easing.
    // "background-color"
  ]);
  const browserColorFunctions = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
  function hasBrowserOnlyColors(keyframes2) {
    for (let i = 0; i < keyframes2.length; i++) {
      if (typeof keyframes2[i] === "string" && browserColorFunctions.test(keyframes2[i])) {
        return true;
      }
    }
    return false;
  }
  const colorProperties = /* @__PURE__ */ new Set([
    "color",
    "backgroundColor",
    "outlineColor",
    "fill",
    "stroke",
    "borderColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor"
  ]);
  const supportsWaapi = /* @__PURE__ */ motionUtils.memo(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
  function supportsBrowserAnimation(options) {
    const { motionValue: motionValue2, name, repeatDelay, repeatType, damping, type, keyframes: keyframes2 } = options;
    const subject = motionValue2?.owner?.current;
    if (!(subject instanceof HTMLElement)) {
      return false;
    }
    const { onUpdate, transformTemplate } = motionValue2.owner.getProps();
    return supportsWaapi() && name && /**
    * Force WAAPI for color properties with browser-only color formats
    * (oklch, oklab, lab, lch, etc.) that the JS animation path can't parse.
    */
    (acceleratedValues.has(name) || colorProperties.has(name) && hasBrowserOnlyColors(keyframes2)) && (name !== "transform" || !transformTemplate) && /**
    * If we're outputting values to onUpdate then we can't use WAAPI as there's
    * no way to read the value from WAAPI every frame.
    */
    !onUpdate && !repeatDelay && repeatType !== "mirror" && damping !== 0 && type !== "inertia";
  }
  const MAX_RESOLVE_DELAY = 40;
  class AsyncMotionValueAnimation extends WithPromise {
    constructor({ autoplay = true, delay: delay2 = 0, type = "keyframes", repeat = 0, repeatDelay = 0, repeatType = "loop", keyframes: keyframes2, name, motionValue: motionValue2, element, ...options }) {
      super();
      this.stop = () => {
        if (this._animation) {
          this._animation.stop();
          this.stopTimeline?.();
        }
        this.keyframeResolver?.cancel();
      };
      this.createdAt = time.now();
      const optionsWithDefaults = {
        autoplay,
        delay: delay2,
        type,
        repeat,
        repeatDelay,
        repeatType,
        name,
        motionValue: motionValue2,
        element,
        ...options
      };
      const KeyframeResolver$1 = element?.KeyframeResolver || KeyframeResolver;
      this.keyframeResolver = new KeyframeResolver$1(keyframes2, (resolvedKeyframes, finalKeyframe, forced) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe, optionsWithDefaults, !forced), name, motionValue2, element);
      this.keyframeResolver?.scheduleResolve();
    }
    onKeyframesResolved(keyframes2, finalKeyframe, options, sync2) {
      this.keyframeResolver = void 0;
      const { name, type, velocity, delay: delay2, isHandoff, onUpdate } = options;
      this.resolvedAt = time.now();
      let canAnimateValue = true;
      if (!canAnimate(keyframes2, name, type, velocity)) {
        canAnimateValue = false;
        if (motionUtils.MotionGlobalConfig.instantAnimations || !delay2) {
          onUpdate?.(getFinalKeyframe(keyframes2, options, finalKeyframe));
        }
        keyframes2[0] = keyframes2[keyframes2.length - 1];
        makeAnimationInstant(options);
        options.repeat = 0;
      }
      const startTime = sync2 ? !this.resolvedAt ? this.createdAt : this.resolvedAt - this.createdAt > MAX_RESOLVE_DELAY ? this.resolvedAt : this.createdAt : void 0;
      const resolvedOptions = {
        startTime,
        finalKeyframe,
        ...options,
        keyframes: keyframes2
      };
      const useWaapi = canAnimateValue && !isHandoff && supportsBrowserAnimation(resolvedOptions);
      const element = resolvedOptions.motionValue?.owner?.current;
      let animation;
      if (useWaapi) {
        try {
          animation = new NativeAnimationExtended({
            ...resolvedOptions,
            element
          });
        } catch {
          animation = new JSAnimation(resolvedOptions);
        }
      } else {
        animation = new JSAnimation(resolvedOptions);
      }
      animation.finished.then(() => {
        this.notifyFinished();
      }).catch(motionUtils.noop);
      if (this.pendingTimeline) {
        this.stopTimeline = animation.attachTimeline(this.pendingTimeline);
        this.pendingTimeline = void 0;
      }
      this._animation = animation;
    }
    get finished() {
      if (!this._animation) {
        return this._finished;
      } else {
        return this.animation.finished;
      }
    }
    then(onResolve, _onReject) {
      return this.finished.finally(onResolve).then(() => {
      });
    }
    get animation() {
      if (!this._animation) {
        this.keyframeResolver?.resume();
        flushKeyframeResolvers();
      }
      return this._animation;
    }
    get duration() {
      return this.animation.duration;
    }
    get iterationDuration() {
      return this.animation.iterationDuration;
    }
    get time() {
      return this.animation.time;
    }
    set time(newTime) {
      this.animation.time = newTime;
    }
    get speed() {
      return this.animation.speed;
    }
    get state() {
      return this.animation.state;
    }
    set speed(newSpeed) {
      this.animation.speed = newSpeed;
    }
    get startTime() {
      return this.animation.startTime;
    }
    attachTimeline(timeline) {
      if (this._animation) {
        this.stopTimeline = this.animation.attachTimeline(timeline);
      } else {
        this.pendingTimeline = timeline;
      }
      return () => this.stop();
    }
    play() {
      this.animation.play();
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.complete();
    }
    cancel() {
      if (this._animation) {
        this.animation.cancel();
      }
      this.keyframeResolver?.cancel();
    }
  }
  class GroupAnimation {
    constructor(animations) {
      this.stop = () => this.runAll("stop");
      this.animations = animations.filter(Boolean);
    }
    get finished() {
      return Promise.all(this.animations.map((animation) => animation.finished));
    }
    /**
     * TODO: Filter out cancelled or stopped animations before returning
     */
    getAll(propName) {
      return this.animations[0][propName];
    }
    setAll(propName, newValue) {
      for (let i = 0; i < this.animations.length; i++) {
        this.animations[i][propName] = newValue;
      }
    }
    attachTimeline(timeline) {
      const subscriptions = this.animations.map((animation) => animation.attachTimeline(timeline));
      return () => {
        subscriptions.forEach((cancel, i) => {
          cancel && cancel();
          this.animations[i].stop();
        });
      };
    }
    get time() {
      return this.getAll("time");
    }
    set time(time2) {
      this.setAll("time", time2);
    }
    get speed() {
      return this.getAll("speed");
    }
    set speed(speed) {
      this.setAll("speed", speed);
    }
    get state() {
      return this.getAll("state");
    }
    get startTime() {
      return this.getAll("startTime");
    }
    get duration() {
      return getMax(this.animations, "duration");
    }
    get iterationDuration() {
      return getMax(this.animations, "iterationDuration");
    }
    runAll(methodName) {
      this.animations.forEach((controls) => controls[methodName]());
    }
    play() {
      this.runAll("play");
    }
    pause() {
      this.runAll("pause");
    }
    cancel() {
      this.runAll("cancel");
    }
    complete() {
      this.runAll("complete");
    }
  }
  function getMax(animations, propName) {
    let max = 0;
    for (let i = 0; i < animations.length; i++) {
      const value = animations[i][propName];
      if (value !== null && value > max) {
        max = value;
      }
    }
    return max;
  }
  class GroupAnimationWithThen extends GroupAnimation {
    then(onResolve, _onReject) {
      return this.finished.finally(onResolve).then(() => {
      });
    }
  }
  class NativeAnimationWrapper extends NativeAnimation {
    constructor(animation) {
      super();
      this.animation = animation;
      animation.onfinish = () => {
        this.finishedTime = this.time;
        this.notifyFinished();
      };
    }
  }
  const animationMaps = /* @__PURE__ */ new WeakMap();
  const animationMapKey = (name, pseudoElement = "") => `${name}:${pseudoElement}`;
  function getAnimationMap(element) {
    let map = animationMaps.get(element);
    if (!map) {
      map = /* @__PURE__ */ new Map();
      animationMaps.set(element, map);
    }
    return map;
  }
  function calcChildStagger(children, child, delayChildren, staggerChildren = 0, staggerDirection = 1) {
    const index = Array.from(children).sort((a, b) => a.sortNodePosition(b)).indexOf(child);
    const numChildren = children.size;
    const maxStaggerDuration = (numChildren - 1) * staggerChildren;
    const delayIsFunction = typeof delayChildren === "function";
    return delayIsFunction ? delayChildren(index, numChildren) : staggerDirection === 1 ? index * staggerChildren : maxStaggerDuration - index * staggerChildren;
  }
  const splitCSSVariableRegex = (
    // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
    /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
  );
  function parseCSSVariable(current2) {
    const match = splitCSSVariableRegex.exec(current2);
    if (!match)
      return [,];
    const [, token1, token2, fallback] = match;
    return [`--${token1 ?? token2}`, fallback];
  }
  const maxDepth = 4;
  function getVariableValue(current2, element, depth = 1) {
    motionUtils.invariant(depth <= maxDepth, `Max CSS variable fallback depth detected in property "${current2}". This may indicate a circular fallback dependency.`, "max-css-var-depth");
    const [token, fallback] = parseCSSVariable(current2);
    if (!token)
      return;
    const resolved = window.getComputedStyle(element).getPropertyValue(token);
    if (resolved) {
      const trimmed = resolved.trim();
      return motionUtils.isNumericalString(trimmed) ? parseFloat(trimmed) : trimmed;
    }
    return isCSSVariableToken(fallback) ? getVariableValue(fallback, element, depth + 1) : fallback;
  }
  const underDampedSpring = {
    type: "spring",
    stiffness: 500,
    damping: 25,
    restSpeed: 10
  };
  const criticallyDampedSpring = (target) => ({
    type: "spring",
    stiffness: 550,
    damping: target === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10
  });
  const keyframesTransition = {
    type: "keyframes",
    duration: 0.8
  };
  const ease = {
    type: "keyframes",
    ease: [0.25, 0.1, 0.35, 1],
    duration: 0.3
  };
  const getDefaultTransition = (valueKey, { keyframes: keyframes2 }) => {
    if (keyframes2.length > 2) {
      return keyframesTransition;
    } else if (transformProps.has(valueKey)) {
      return valueKey.startsWith("scale") ? criticallyDampedSpring(keyframes2[1]) : underDampedSpring;
    }
    return ease;
  };
  function resolveTransition(transition, parentTransition) {
    if (transition?.inherit && parentTransition) {
      const { inherit: _, ...rest } = transition;
      return { ...parentTransition, ...rest };
    }
    return transition;
  }
  function getValueTransition(transition, key) {
    const valueTransition = transition?.[key] ?? transition?.["default"] ?? transition;
    if (valueTransition !== transition) {
      return resolveTransition(valueTransition, transition);
    }
    return valueTransition;
  }
  const orchestrationKeys = /* @__PURE__ */ new Set([
    "when",
    "delay",
    "delayChildren",
    "staggerChildren",
    "staggerDirection",
    "repeat",
    "repeatType",
    "repeatDelay",
    "from",
    "elapsed"
  ]);
  function isTransitionDefined(transition) {
    for (const key in transition) {
      if (!orchestrationKeys.has(key))
        return true;
    }
    return false;
  }
  const animateMotionValue = (name, value, target, transition = {}, element, isHandoff) => (onComplete) => {
    const valueTransition = getValueTransition(transition, name) || {};
    const delay2 = valueTransition.delay || transition.delay || 0;
    let { elapsed = 0 } = transition;
    elapsed = elapsed - motionUtils.secondsToMilliseconds(delay2);
    const options = {
      keyframes: Array.isArray(target) ? target : [null, target],
      ease: "easeOut",
      velocity: value.getVelocity(),
      ...valueTransition,
      delay: -elapsed,
      onUpdate: (v) => {
        value.set(v);
        valueTransition.onUpdate && valueTransition.onUpdate(v);
      },
      onComplete: () => {
        onComplete();
        valueTransition.onComplete && valueTransition.onComplete();
      },
      name,
      motionValue: value,
      element: isHandoff ? void 0 : element
    };
    if (!isTransitionDefined(valueTransition)) {
      Object.assign(options, getDefaultTransition(name, options));
    }
    options.duration && (options.duration = motionUtils.secondsToMilliseconds(options.duration));
    options.repeatDelay && (options.repeatDelay = motionUtils.secondsToMilliseconds(options.repeatDelay));
    if (options.from !== void 0) {
      options.keyframes[0] = options.from;
    }
    let shouldSkip = false;
    if (options.type === false || options.duration === 0 && !options.repeatDelay) {
      makeAnimationInstant(options);
      if (options.delay === 0) {
        shouldSkip = true;
      }
    }
    if (motionUtils.MotionGlobalConfig.instantAnimations || motionUtils.MotionGlobalConfig.skipAnimations || element?.shouldSkipAnimations) {
      shouldSkip = true;
      makeAnimationInstant(options);
      options.delay = 0;
    }
    options.allowFlatten = !valueTransition.type && !valueTransition.ease;
    if (shouldSkip && !isHandoff && value.get() !== void 0) {
      const finalKeyframe = getFinalKeyframe(options.keyframes, valueTransition);
      if (finalKeyframe !== void 0) {
        frame.update(() => {
          options.onUpdate(finalKeyframe);
          options.onComplete();
        });
        return;
      }
    }
    return valueTransition.isSync ? new JSAnimation(options) : new AsyncMotionValueAnimation(options);
  };
  function getValueState(visualElement) {
    const state = [{}, {}];
    visualElement?.values.forEach((value, key) => {
      state[0][key] = value.get();
      state[1][key] = value.getVelocity();
    });
    return state;
  }
  function resolveVariantFromProps(props, definition, custom, visualElement) {
    if (typeof definition === "function") {
      const [current2, velocity] = getValueState(visualElement);
      definition = definition(custom !== void 0 ? custom : props.custom, current2, velocity);
    }
    if (typeof definition === "string") {
      definition = props.variants && props.variants[definition];
    }
    if (typeof definition === "function") {
      const [current2, velocity] = getValueState(visualElement);
      definition = definition(custom !== void 0 ? custom : props.custom, current2, velocity);
    }
    return definition;
  }
  function resolveVariant(visualElement, definition, custom) {
    const props = visualElement.getProps();
    return resolveVariantFromProps(props, definition, custom !== void 0 ? custom : props.custom, visualElement);
  }
  const positionalKeys = /* @__PURE__ */ new Set([
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    ...transformPropOrder
  ]);
  const MAX_VELOCITY_DELTA = 30;
  const isFloat = (value) => {
    return !isNaN(parseFloat(value));
  };
  const collectMotionValues = {
    current: void 0
  };
  class MotionValue {
    /**
     * @param init - The initiating value
     * @param config - Optional configuration options
     *
     * -  `transformer`: A function to transform incoming values with.
     */
    constructor(init, options = {}) {
      this.canTrackVelocity = null;
      this.events = {};
      this.updateAndNotify = (v) => {
        const currentTime = time.now();
        if (this.updatedAt !== currentTime) {
          this.setPrevFrameValue();
        }
        this.prev = this.current;
        this.setCurrent(v);
        if (this.current !== this.prev) {
          this.events.change?.notify(this.current);
          if (this.dependents) {
            for (const dependent of this.dependents) {
              dependent.dirty();
            }
          }
        }
      };
      this.hasAnimated = false;
      this.setCurrent(init);
      this.owner = options.owner;
    }
    setCurrent(current2) {
      this.current = current2;
      this.updatedAt = time.now();
      if (this.canTrackVelocity === null && current2 !== void 0) {
        this.canTrackVelocity = isFloat(this.current);
      }
    }
    setPrevFrameValue(prevFrameValue = this.current) {
      this.prevFrameValue = prevFrameValue;
      this.prevUpdatedAt = this.updatedAt;
    }
    /**
     * Adds a function that will be notified when the `MotionValue` is updated.
     *
     * It returns a function that, when called, will cancel the subscription.
     *
     * When calling `onChange` inside a React component, it should be wrapped with the
     * `useEffect` hook. As it returns an unsubscribe function, this should be returned
     * from the `useEffect` function to ensure you don't add duplicate subscribers..
     *
     * ```jsx
     * export const MyComponent = () => {
     *   const x = useMotionValue(0)
     *   const y = useMotionValue(0)
     *   const opacity = useMotionValue(1)
     *
     *   useEffect(() => {
     *     function updateOpacity() {
     *       const maxXY = Math.max(x.get(), y.get())
     *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
     *       opacity.set(newOpacity)
     *     }
     *
     *     const unsubscribeX = x.on("change", updateOpacity)
     *     const unsubscribeY = y.on("change", updateOpacity)
     *
     *     return () => {
     *       unsubscribeX()
     *       unsubscribeY()
     *     }
     *   }, [])
     *
     *   return <motion.div style={{ x }} />
     * }
     * ```
     *
     * @param subscriber - A function that receives the latest value.
     * @returns A function that, when called, will cancel this subscription.
     *
     * @deprecated
     */
    onChange(subscription) {
      return this.on("change", subscription);
    }
    on(eventName, callback) {
      if (!this.events[eventName]) {
        this.events[eventName] = new motionUtils.SubscriptionManager();
      }
      const unsubscribe = this.events[eventName].add(callback);
      if (eventName === "change") {
        return () => {
          unsubscribe();
          frame.read(() => {
            if (!this.events.change.getSize()) {
              this.stop();
            }
          });
        };
      }
      return unsubscribe;
    }
    clearListeners() {
      for (const eventManagers in this.events) {
        this.events[eventManagers].clear();
      }
    }
    /**
     * Attaches a passive effect to the `MotionValue`.
     */
    attach(passiveEffect, stopPassiveEffect) {
      this.passiveEffect = passiveEffect;
      this.stopPassiveEffect = stopPassiveEffect;
    }
    /**
     * Sets the state of the `MotionValue`.
     *
     * @remarks
     *
     * ```jsx
     * const x = useMotionValue(0)
     * x.set(10)
     * ```
     *
     * @param latest - Latest value to set.
     * @param render - Whether to notify render subscribers. Defaults to `true`
     *
     * @public
     */
    set(v) {
      if (!this.passiveEffect) {
        this.updateAndNotify(v);
      } else {
        this.passiveEffect(v, this.updateAndNotify);
      }
    }
    setWithVelocity(prev, current2, delta) {
      this.set(current2);
      this.prev = void 0;
      this.prevFrameValue = prev;
      this.prevUpdatedAt = this.updatedAt - delta;
    }
    /**
     * Set the state of the `MotionValue`, stopping any active animations,
     * effects, and resets velocity to `0`.
     */
    jump(v, endAnimation = true) {
      this.updateAndNotify(v);
      this.prev = v;
      this.prevUpdatedAt = this.prevFrameValue = void 0;
      endAnimation && this.stop();
      if (this.stopPassiveEffect)
        this.stopPassiveEffect();
    }
    dirty() {
      this.events.change?.notify(this.current);
    }
    addDependent(dependent) {
      if (!this.dependents) {
        this.dependents = /* @__PURE__ */ new Set();
      }
      this.dependents.add(dependent);
    }
    removeDependent(dependent) {
      if (this.dependents) {
        this.dependents.delete(dependent);
      }
    }
    /**
     * Returns the latest state of `MotionValue`
     *
     * @returns - The latest state of `MotionValue`
     *
     * @public
     */
    get() {
      if (collectMotionValues.current) {
        collectMotionValues.current.push(this);
      }
      return this.current;
    }
    /**
     * @public
     */
    getPrevious() {
      return this.prev;
    }
    /**
     * Returns the latest velocity of `MotionValue`
     *
     * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
     *
     * @public
     */
    getVelocity() {
      const currentTime = time.now();
      if (!this.canTrackVelocity || this.prevFrameValue === void 0 || currentTime - this.updatedAt > MAX_VELOCITY_DELTA) {
        return 0;
      }
      const delta = Math.min(this.updatedAt - this.prevUpdatedAt, MAX_VELOCITY_DELTA);
      return motionUtils.velocityPerSecond(parseFloat(this.current) - parseFloat(this.prevFrameValue), delta);
    }
    /**
     * Registers a new animation to control this `MotionValue`. Only one
     * animation can drive a `MotionValue` at one time.
     *
     * ```jsx
     * value.start()
     * ```
     *
     * @param animation - A function that starts the provided animation
     */
    start(startAnimation) {
      this.stop();
      return new Promise((resolve) => {
        this.hasAnimated = true;
        this.animation = startAnimation(resolve);
        if (this.events.animationStart) {
          this.events.animationStart.notify();
        }
      }).then(() => {
        if (this.events.animationComplete) {
          this.events.animationComplete.notify();
        }
        this.clearAnimation();
      });
    }
    /**
     * Stop the currently active animation.
     *
     * @public
     */
    stop() {
      if (this.animation) {
        this.animation.stop();
        if (this.events.animationCancel) {
          this.events.animationCancel.notify();
        }
      }
      this.clearAnimation();
    }
    /**
     * Returns `true` if this value is currently animating.
     *
     * @public
     */
    isAnimating() {
      return !!this.animation;
    }
    clearAnimation() {
      delete this.animation;
    }
    /**
     * Destroy and clean up subscribers to this `MotionValue`.
     *
     * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
     * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
     * created a `MotionValue` via the `motionValue` function.
     *
     * @public
     */
    destroy() {
      this.dependents?.clear();
      this.events.destroy?.notify();
      this.clearListeners();
      this.stop();
      if (this.stopPassiveEffect) {
        this.stopPassiveEffect();
      }
    }
  }
  function motionValue(init, options) {
    return new MotionValue(init, options);
  }
  const isKeyframesTarget = (v) => {
    return Array.isArray(v);
  };
  function setMotionValue(visualElement, key, value) {
    if (visualElement.hasValue(key)) {
      visualElement.getValue(key).set(value);
    } else {
      visualElement.addValue(key, motionValue(value));
    }
  }
  function resolveFinalValueInKeyframes(v) {
    return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
  }
  function setTarget(visualElement, definition) {
    const resolved = resolveVariant(visualElement, definition);
    let { transitionEnd = {}, transition = {}, ...target } = resolved || {};
    target = { ...target, ...transitionEnd };
    for (const key in target) {
      const value = resolveFinalValueInKeyframes(target[key]);
      setMotionValue(visualElement, key, value);
    }
  }
  const isMotionValue = (value) => Boolean(value && value.getVelocity);
  function isWillChangeMotionValue(value) {
    return Boolean(isMotionValue(value) && value.add);
  }
  function addValueToWillChange(visualElement, key) {
    const willChange = visualElement.getValue("willChange");
    if (isWillChangeMotionValue(willChange)) {
      return willChange.add(key);
    } else if (!willChange && motionUtils.MotionGlobalConfig.WillChange) {
      const newWillChange = new motionUtils.MotionGlobalConfig.WillChange("auto");
      visualElement.addValue("willChange", newWillChange);
      newWillChange.add(key);
    }
  }
  function camelToDash(str) {
    return str.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
  }
  const optimizedAppearDataId = "framerAppearId";
  const optimizedAppearDataAttribute = "data-" + camelToDash(optimizedAppearDataId);
  function getOptimisedAppearId(visualElement) {
    return visualElement.props[optimizedAppearDataAttribute];
  }
  function shouldBlockAnimation({ protectedKeys, needsAnimating }, key) {
    const shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
    needsAnimating[key] = false;
    return shouldBlock;
  }
  function animateTarget(visualElement, targetAndTransition, { delay: delay2 = 0, transitionOverride, type } = {}) {
    let { transition, transitionEnd, ...target } = targetAndTransition;
    const defaultTransition = visualElement.getDefaultTransition();
    transition = transition ? resolveTransition(transition, defaultTransition) : defaultTransition;
    const reduceMotion = transition?.reduceMotion;
    if (transitionOverride)
      transition = transitionOverride;
    const animations = [];
    const animationTypeState = type && visualElement.animationState && visualElement.animationState.getState()[type];
    for (const key in target) {
      const value = visualElement.getValue(key, visualElement.latestValues[key] ?? null);
      const valueTarget = target[key];
      if (valueTarget === void 0 || animationTypeState && shouldBlockAnimation(animationTypeState, key)) {
        continue;
      }
      const valueTransition = {
        delay: delay2,
        ...getValueTransition(transition || {}, key)
      };
      const currentValue = value.get();
      if (currentValue !== void 0 && !value.isAnimating() && !Array.isArray(valueTarget) && valueTarget === currentValue && !valueTransition.velocity) {
        frame.update(() => value.set(valueTarget));
        continue;
      }
      let isHandoff = false;
      if (window.MotionHandoffAnimation) {
        const appearId = getOptimisedAppearId(visualElement);
        if (appearId) {
          const startTime = window.MotionHandoffAnimation(appearId, key, frame);
          if (startTime !== null) {
            valueTransition.startTime = startTime;
            isHandoff = true;
          }
        }
      }
      addValueToWillChange(visualElement, key);
      const shouldReduceMotion = reduceMotion ?? visualElement.shouldReduceMotion;
      value.start(animateMotionValue(key, value, valueTarget, shouldReduceMotion && positionalKeys.has(key) ? { type: false } : valueTransition, visualElement, isHandoff));
      const animation = value.animation;
      if (animation) {
        animations.push(animation);
      }
    }
    if (transitionEnd) {
      const applyTransitionEnd = () => frame.update(() => {
        transitionEnd && setTarget(visualElement, transitionEnd);
      });
      if (animations.length) {
        Promise.all(animations).then(applyTransitionEnd);
      } else {
        applyTransitionEnd();
      }
    }
    return animations;
  }
  function animateVariant(visualElement, variant, options = {}) {
    const resolved = resolveVariant(visualElement, variant, options.type === "exit" ? visualElement.presenceContext?.custom : void 0);
    let { transition = visualElement.getDefaultTransition() || {} } = resolved || {};
    if (options.transitionOverride) {
      transition = options.transitionOverride;
    }
    const getAnimation = resolved ? () => Promise.all(animateTarget(visualElement, resolved, options)) : () => Promise.resolve();
    const getChildAnimations = visualElement.variantChildren && visualElement.variantChildren.size ? (forwardDelay = 0) => {
      const { delayChildren = 0, staggerChildren, staggerDirection } = transition;
      return animateChildren(visualElement, variant, forwardDelay, delayChildren, staggerChildren, staggerDirection, options);
    } : () => Promise.resolve();
    const { when } = transition;
    if (when) {
      const [first, last] = when === "beforeChildren" ? [getAnimation, getChildAnimations] : [getChildAnimations, getAnimation];
      return first().then(() => last());
    } else {
      return Promise.all([getAnimation(), getChildAnimations(options.delay)]);
    }
  }
  function animateChildren(visualElement, variant, delay2 = 0, delayChildren = 0, staggerChildren = 0, staggerDirection = 1, options) {
    const animations = [];
    for (const child of visualElement.variantChildren) {
      child.notify("AnimationStart", variant);
      animations.push(animateVariant(child, variant, {
        ...options,
        delay: delay2 + (typeof delayChildren === "function" ? 0 : delayChildren) + calcChildStagger(visualElement.variantChildren, child, delayChildren, staggerChildren, staggerDirection)
      }).then(() => child.notify("AnimationComplete", variant)));
    }
    return Promise.all(animations);
  }
  function animateVisualElement(visualElement, definition, options = {}) {
    visualElement.notify("AnimationStart", definition);
    let animation;
    if (Array.isArray(definition)) {
      const animations = definition.map((variant) => animateVariant(visualElement, variant, options));
      animation = Promise.all(animations);
    } else if (typeof definition === "string") {
      animation = animateVariant(visualElement, definition, options);
    } else {
      const resolvedDefinition = typeof definition === "function" ? resolveVariant(visualElement, definition, options.custom) : definition;
      animation = Promise.all(animateTarget(visualElement, resolvedDefinition, options));
    }
    return animation.then(() => {
      visualElement.notify("AnimationComplete", definition);
    });
  }
  const auto = {
    test: (v) => v === "auto",
    parse: (v) => v
  };
  const testValueType = (v) => (type) => type.test(v);
  const dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto];
  const findDimensionValueType = (v) => dimensionValueTypes.find(testValueType(v));
  function isNone(value) {
    if (typeof value === "number") {
      return value === 0;
    } else if (value !== null) {
      return value === "none" || value === "0" || motionUtils.isZeroValueString(value);
    } else {
      return true;
    }
  }
  const maxDefaults = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
  function applyDefaultFilter(v) {
    const [name, value] = v.slice(0, -1).split("(");
    if (name === "drop-shadow")
      return v;
    const [number2] = value.match(floatRegex) || [];
    if (!number2)
      return v;
    const unit = value.replace(number2, "");
    let defaultValue = maxDefaults.has(name) ? 1 : 0;
    if (number2 !== value)
      defaultValue *= 100;
    return name + "(" + defaultValue + unit + ")";
  }
  const functionRegex = /\b([a-z-]*)\(.*?\)/gu;
  const filter = {
    ...complex,
    getAnimatableNone: (v) => {
      const functions = v.match(functionRegex);
      return functions ? functions.map(applyDefaultFilter).join(" ") : v;
    }
  };
  const mask = {
    ...complex,
    getAnimatableNone: (v) => {
      const parsed = complex.parse(v);
      const transformer = complex.createTransformer(v);
      return transformer(parsed.map((v2) => typeof v2 === "number" ? 0 : typeof v2 === "object" ? { ...v2, alpha: 1 } : v2));
    }
  };
  const int = {
    ...number,
    transform: Math.round
  };
  const transformValueTypes = {
    rotate: degrees,
    rotateX: degrees,
    rotateY: degrees,
    rotateZ: degrees,
    scale,
    scaleX: scale,
    scaleY: scale,
    scaleZ: scale,
    skew: degrees,
    skewX: degrees,
    skewY: degrees,
    distance: px,
    translateX: px,
    translateY: px,
    translateZ: px,
    x: px,
    y: px,
    z: px,
    perspective: px,
    transformPerspective: px,
    opacity: alpha,
    originX: progressPercentage,
    originY: progressPercentage,
    originZ: px
  };
  const numberValueTypes = {
    // Border props
    borderWidth: px,
    borderTopWidth: px,
    borderRightWidth: px,
    borderBottomWidth: px,
    borderLeftWidth: px,
    borderRadius: px,
    borderTopLeftRadius: px,
    borderTopRightRadius: px,
    borderBottomRightRadius: px,
    borderBottomLeftRadius: px,
    // Positioning props
    width: px,
    maxWidth: px,
    height: px,
    maxHeight: px,
    top: px,
    right: px,
    bottom: px,
    left: px,
    inset: px,
    insetBlock: px,
    insetBlockStart: px,
    insetBlockEnd: px,
    insetInline: px,
    insetInlineStart: px,
    insetInlineEnd: px,
    // Spacing props
    padding: px,
    paddingTop: px,
    paddingRight: px,
    paddingBottom: px,
    paddingLeft: px,
    paddingBlock: px,
    paddingBlockStart: px,
    paddingBlockEnd: px,
    paddingInline: px,
    paddingInlineStart: px,
    paddingInlineEnd: px,
    margin: px,
    marginTop: px,
    marginRight: px,
    marginBottom: px,
    marginLeft: px,
    marginBlock: px,
    marginBlockStart: px,
    marginBlockEnd: px,
    marginInline: px,
    marginInlineStart: px,
    marginInlineEnd: px,
    // Typography
    fontSize: px,
    // Misc
    backgroundPositionX: px,
    backgroundPositionY: px,
    ...transformValueTypes,
    zIndex: int,
    // SVG
    fillOpacity: alpha,
    strokeOpacity: alpha,
    numOctaves: int
  };
  const defaultValueTypes = {
    ...numberValueTypes,
    // Color props
    color,
    backgroundColor: color,
    outlineColor: color,
    fill: color,
    stroke: color,
    // Border props
    borderColor: color,
    borderTopColor: color,
    borderRightColor: color,
    borderBottomColor: color,
    borderLeftColor: color,
    filter,
    WebkitFilter: filter,
    mask,
    WebkitMask: mask
  };
  const getDefaultValueType = (key) => defaultValueTypes[key];
  const customTypes = /* @__PURE__ */ new Set([filter, mask]);
  function getAnimatableNone(key, value) {
    let defaultValueType = getDefaultValueType(key);
    if (!customTypes.has(defaultValueType))
      defaultValueType = complex;
    return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : void 0;
  }
  const invalidTemplates = /* @__PURE__ */ new Set(["auto", "none", "0"]);
  function makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name) {
    let i = 0;
    let animatableTemplate = void 0;
    while (i < unresolvedKeyframes.length && !animatableTemplate) {
      const keyframe = unresolvedKeyframes[i];
      if (typeof keyframe === "string" && !invalidTemplates.has(keyframe) && analyseComplexValue(keyframe).values.length) {
        animatableTemplate = unresolvedKeyframes[i];
      }
      i++;
    }
    if (animatableTemplate && name) {
      for (const noneIndex of noneKeyframeIndexes) {
        unresolvedKeyframes[noneIndex] = getAnimatableNone(name, animatableTemplate);
      }
    }
  }
  class DOMKeyframesResolver extends KeyframeResolver {
    constructor(unresolvedKeyframes, onComplete, name, motionValue2, element) {
      super(unresolvedKeyframes, onComplete, name, motionValue2, element, true);
    }
    readKeyframes() {
      const { unresolvedKeyframes, element, name } = this;
      if (!element || !element.current)
        return;
      super.readKeyframes();
      for (let i = 0; i < unresolvedKeyframes.length; i++) {
        let keyframe = unresolvedKeyframes[i];
        if (typeof keyframe === "string") {
          keyframe = keyframe.trim();
          if (isCSSVariableToken(keyframe)) {
            const resolved = getVariableValue(keyframe, element.current);
            if (resolved !== void 0) {
              unresolvedKeyframes[i] = resolved;
            }
            if (i === unresolvedKeyframes.length - 1) {
              this.finalKeyframe = keyframe;
            }
          }
        }
      }
      this.resolveNoneKeyframes();
      if (!positionalKeys.has(name) || unresolvedKeyframes.length !== 2) {
        return;
      }
      const [origin, target] = unresolvedKeyframes;
      const originType = findDimensionValueType(origin);
      const targetType = findDimensionValueType(target);
      const originHasVar = containsCSSVariable(origin);
      const targetHasVar = containsCSSVariable(target);
      if (originHasVar !== targetHasVar && positionalValues[name]) {
        this.needsMeasurement = true;
        return;
      }
      if (originType === targetType)
        return;
      if (isNumOrPxType(originType) && isNumOrPxType(targetType)) {
        for (let i = 0; i < unresolvedKeyframes.length; i++) {
          const value = unresolvedKeyframes[i];
          if (typeof value === "string") {
            unresolvedKeyframes[i] = parseFloat(value);
          }
        }
      } else if (positionalValues[name]) {
        this.needsMeasurement = true;
      }
    }
    resolveNoneKeyframes() {
      const { unresolvedKeyframes, name } = this;
      const noneKeyframeIndexes = [];
      for (let i = 0; i < unresolvedKeyframes.length; i++) {
        if (unresolvedKeyframes[i] === null || isNone(unresolvedKeyframes[i])) {
          noneKeyframeIndexes.push(i);
        }
      }
      if (noneKeyframeIndexes.length) {
        makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name);
      }
    }
    measureInitialState() {
      const { element, unresolvedKeyframes, name } = this;
      if (!element || !element.current)
        return;
      if (name === "height") {
        this.suspendedScrollY = window.pageYOffset;
      }
      this.measuredOrigin = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
      unresolvedKeyframes[0] = this.measuredOrigin;
      const measureKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
      if (measureKeyframe !== void 0) {
        element.getValue(name, measureKeyframe).jump(measureKeyframe, false);
      }
    }
    measureEndState() {
      const { element, name, unresolvedKeyframes } = this;
      if (!element || !element.current)
        return;
      const value = element.getValue(name);
      value && value.jump(this.measuredOrigin, false);
      const finalKeyframeIndex = unresolvedKeyframes.length - 1;
      const finalKeyframe = unresolvedKeyframes[finalKeyframeIndex];
      unresolvedKeyframes[finalKeyframeIndex] = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
      if (finalKeyframe !== null && this.finalKeyframe === void 0) {
        this.finalKeyframe = finalKeyframe;
      }
      if (this.removedTransforms?.length) {
        this.removedTransforms.forEach(([unsetTransformName, unsetTransformValue]) => {
          element.getValue(unsetTransformName).set(unsetTransformValue);
        });
      }
      this.resolveNoneKeyframes();
    }
  }
  const pxValues = /* @__PURE__ */ new Set([
    // Border props
    "borderWidth",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "borderRadius",
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderBottomRightRadius",
    "borderBottomLeftRadius",
    // Positioning props
    "width",
    "maxWidth",
    "height",
    "maxHeight",
    "top",
    "right",
    "bottom",
    "left",
    "inset",
    "insetBlock",
    "insetBlockStart",
    "insetBlockEnd",
    "insetInline",
    "insetInlineStart",
    "insetInlineEnd",
    // Spacing props
    "padding",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "paddingBlock",
    "paddingBlockStart",
    "paddingBlockEnd",
    "paddingInline",
    "paddingInlineStart",
    "paddingInlineEnd",
    "margin",
    "marginTop",
    "marginRight",
    "marginBottom",
    "marginLeft",
    "marginBlock",
    "marginBlockStart",
    "marginBlockEnd",
    "marginInline",
    "marginInlineStart",
    "marginInlineEnd",
    // Typography
    "fontSize",
    // Misc
    "backgroundPositionX",
    "backgroundPositionY"
  ]);
  function applyPxDefaults(keyframes2, name) {
    for (let i = 0; i < keyframes2.length; i++) {
      if (typeof keyframes2[i] === "number" && pxValues.has(name)) {
        keyframes2[i] = keyframes2[i] + "px";
      }
    }
  }
  function isWaapiSupportedEasing(easing) {
    return Boolean(typeof easing === "function" && supportsLinearEasing() || !easing || typeof easing === "string" && (easing in supportedWaapiEasing || supportsLinearEasing()) || motionUtils.isBezierDefinition(easing) || Array.isArray(easing) && easing.every(isWaapiSupportedEasing));
  }
  const supportsPartialKeyframes = /* @__PURE__ */ motionUtils.memo(() => {
    try {
      document.createElement("div").animate({ opacity: [1] });
    } catch (e) {
      return false;
    }
    return true;
  });
  function resolveElements(elementOrSelector, scope, selectorCache) {
    if (elementOrSelector == null) {
      return [];
    }
    if (elementOrSelector instanceof EventTarget) {
      return [elementOrSelector];
    } else if (typeof elementOrSelector === "string") {
      let root = document;
      if (scope) {
        root = scope.current;
      }
      const elements = selectorCache?.[elementOrSelector] ?? root.querySelectorAll(elementOrSelector);
      return elements ? Array.from(elements) : [];
    }
    return Array.from(elementOrSelector).filter((element) => element != null);
  }
  function createSelectorEffect(subjectEffect) {
    return (subject, values) => {
      const elements = resolveElements(subject);
      const subscriptions = [];
      for (const element of elements) {
        const remove = subjectEffect(element, values);
        subscriptions.push(remove);
      }
      return () => {
        for (const remove of subscriptions)
          remove();
      };
    };
  }
  const getValueAsType = (value, type) => {
    return type && typeof value === "number" ? type.transform(value) : value;
  };
  class MotionValueState {
    constructor() {
      this.latest = {};
      this.values = /* @__PURE__ */ new Map();
    }
    set(name, value, render, computed, useDefaultValueType = true) {
      const existingValue = this.values.get(name);
      if (existingValue) {
        existingValue.onRemove();
      }
      const onChange = () => {
        const v = value.get();
        if (useDefaultValueType) {
          this.latest[name] = getValueAsType(v, numberValueTypes[name]);
        } else {
          this.latest[name] = v;
        }
        render && frame.render(render);
      };
      onChange();
      const cancelOnChange = value.on("change", onChange);
      computed && value.addDependent(computed);
      const remove = () => {
        cancelOnChange();
        render && cancelFrame(render);
        this.values.delete(name);
        computed && value.removeDependent(computed);
      };
      this.values.set(name, { value, onRemove: remove });
      return remove;
    }
    get(name) {
      return this.values.get(name)?.value;
    }
  }
  function createEffect(addValue) {
    const stateCache = /* @__PURE__ */ new WeakMap();
    return (subject, values) => {
      const state = stateCache.get(subject) ?? new MotionValueState();
      stateCache.set(subject, state);
      const subscriptions = [];
      for (const key in values) {
        const value = values[key];
        const remove = addValue(subject, state, key, value);
        subscriptions.push(remove);
      }
      return () => {
        for (const cancel of subscriptions)
          cancel();
      };
    };
  }
  function canSetAsProperty(element, name) {
    if (!(name in element))
      return false;
    const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), name) || Object.getOwnPropertyDescriptor(element, name);
    return descriptor && typeof descriptor.set === "function";
  }
  const addAttrValue = (element, state, key, value) => {
    const isProp = canSetAsProperty(element, key);
    const name = isProp ? key : key.startsWith("data") || key.startsWith("aria") ? camelToDash(key) : key;
    const render = isProp ? () => {
      element[name] = state.latest[key];
    } : () => {
      const v = state.latest[key];
      if (v === null || v === void 0) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, String(v));
      }
    };
    return state.set(key, value, render);
  };
  const attrEffect = /* @__PURE__ */ createSelectorEffect(
    /* @__PURE__ */ createEffect(addAttrValue)
  );
  const propEffect = /* @__PURE__ */ createEffect((subject, state, key, value) => {
    return state.set(key, value, () => {
      subject[key] = state.latest[key];
    }, void 0, false);
  });
  function isHTMLElement(element) {
    return motionUtils.isObject(element) && "offsetHeight" in element && !("ownerSVGElement" in element);
  }
  const translateAlias$1 = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective"
  };
  function buildTransform$1(state) {
    let transform2 = "";
    let transformIsDefault = true;
    for (let i = 0; i < transformPropOrder.length; i++) {
      const key = transformPropOrder[i];
      const value = state.latest[key];
      if (value === void 0)
        continue;
      let valueIsDefault = true;
      if (typeof value === "number") {
        valueIsDefault = value === (key.startsWith("scale") ? 1 : 0);
      } else {
        const parsed = parseFloat(value);
        valueIsDefault = key.startsWith("scale") ? parsed === 1 : parsed === 0;
      }
      if (!valueIsDefault) {
        transformIsDefault = false;
        const transformName = translateAlias$1[key] || key;
        transform2 += `${transformName}(${value}) `;
      }
    }
    return transformIsDefault ? "none" : transform2.trim();
  }
  const originProps = /* @__PURE__ */ new Set(["originX", "originY", "originZ"]);
  const addStyleValue = (element, state, key, value) => {
    let render = void 0;
    let computed = void 0;
    if (transformProps.has(key)) {
      if (!state.get("transform")) {
        if (!isHTMLElement(element) && !state.get("transformBox")) {
          addStyleValue(element, state, "transformBox", new MotionValue("fill-box"));
        }
        state.set("transform", new MotionValue("none"), () => {
          element.style.transform = buildTransform$1(state);
        });
      }
      computed = state.get("transform");
    } else if (originProps.has(key)) {
      if (!state.get("transformOrigin")) {
        state.set("transformOrigin", new MotionValue(""), () => {
          const originX = state.latest.originX ?? "50%";
          const originY = state.latest.originY ?? "50%";
          const originZ = state.latest.originZ ?? 0;
          element.style.transformOrigin = `${originX} ${originY} ${originZ}`;
        });
      }
      computed = state.get("transformOrigin");
    } else if (isCSSVar(key)) {
      render = () => {
        element.style.setProperty(key, state.latest[key]);
      };
    } else {
      render = () => {
        element.style[key] = state.latest[key];
      };
    }
    return state.set(key, value, render, computed);
  };
  const styleEffect = /* @__PURE__ */ createSelectorEffect(
    /* @__PURE__ */ createEffect(addStyleValue)
  );
  function addSVGPathValue(element, state, key, value) {
    frame.render(() => element.setAttribute("pathLength", "1"));
    if (key === "pathOffset") {
      return state.set(key, value, () => {
        const offset = state.latest[key];
        element.setAttribute("stroke-dashoffset", `${-offset}`);
      });
    } else {
      if (!state.get("stroke-dasharray")) {
        state.set("stroke-dasharray", new MotionValue("1 1"), () => {
          const { pathLength = 1, pathSpacing } = state.latest;
          element.setAttribute("stroke-dasharray", `${pathLength} ${pathSpacing ?? 1 - Number(pathLength)}`);
        });
      }
      return state.set(key, value, void 0, state.get("stroke-dasharray"));
    }
  }
  const addSVGValue = (element, state, key, value) => {
    if (key.startsWith("path")) {
      return addSVGPathValue(element, state, key, value);
    } else if (key.startsWith("attr")) {
      return addAttrValue(element, state, convertAttrKey(key), value);
    }
    const handler = key in element.style ? addStyleValue : addAttrValue;
    return handler(element, state, key, value);
  };
  const svgEffect = /* @__PURE__ */ createSelectorEffect(
    /* @__PURE__ */ createEffect(addSVGValue)
  );
  function convertAttrKey(key) {
    return key.replace(/^attr([A-Z])/, (_, firstChar) => firstChar.toLowerCase());
  }
  const { schedule: microtask, cancel: cancelMicrotask } = /* @__PURE__ */ createRenderBatcher(queueMicrotask, false);
  const isDragging = {
    x: false,
    y: false
  };
  function isDragActive() {
    return isDragging.x || isDragging.y;
  }
  function setDragLock(axis) {
    if (axis === "x" || axis === "y") {
      if (isDragging[axis]) {
        return null;
      } else {
        isDragging[axis] = true;
        return () => {
          isDragging[axis] = false;
        };
      }
    } else {
      if (isDragging.x || isDragging.y) {
        return null;
      } else {
        isDragging.x = isDragging.y = true;
        return () => {
          isDragging.x = isDragging.y = false;
        };
      }
    }
  }
  function setupGesture(elementOrSelector, options) {
    const elements = resolveElements(elementOrSelector);
    const gestureAbortController = new AbortController();
    const eventOptions = {
      passive: true,
      ...options,
      signal: gestureAbortController.signal
    };
    const cancel = () => gestureAbortController.abort();
    return [elements, eventOptions, cancel];
  }
  function isValidHover(event) {
    return !(event.pointerType === "touch" || isDragActive());
  }
  function hover(elementOrSelector, onHoverStart, options = {}) {
    const [elements, eventOptions, cancel] = setupGesture(elementOrSelector, options);
    elements.forEach((element) => {
      let isPressed = false;
      let deferredHoverEnd = false;
      let hoverEndCallback;
      const removePointerLeave = () => {
        element.removeEventListener("pointerleave", onPointerLeave);
      };
      const endHover = (event) => {
        if (hoverEndCallback) {
          hoverEndCallback(event);
          hoverEndCallback = void 0;
        }
        removePointerLeave();
      };
      const onPointerUp = (event) => {
        isPressed = false;
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
        if (deferredHoverEnd) {
          deferredHoverEnd = false;
          endHover(event);
        }
      };
      const onPointerDown = () => {
        isPressed = true;
        window.addEventListener("pointerup", onPointerUp, eventOptions);
        window.addEventListener("pointercancel", onPointerUp, eventOptions);
      };
      const onPointerLeave = (leaveEvent) => {
        if (leaveEvent.pointerType === "touch")
          return;
        if (isPressed) {
          deferredHoverEnd = true;
          return;
        }
        endHover(leaveEvent);
      };
      const onPointerEnter = (enterEvent) => {
        if (!isValidHover(enterEvent))
          return;
        deferredHoverEnd = false;
        const onHoverEnd = onHoverStart(element, enterEvent);
        if (typeof onHoverEnd !== "function")
          return;
        hoverEndCallback = onHoverEnd;
        element.addEventListener("pointerleave", onPointerLeave, eventOptions);
      };
      element.addEventListener("pointerenter", onPointerEnter, eventOptions);
      element.addEventListener("pointerdown", onPointerDown, eventOptions);
    });
    return cancel;
  }
  const isNodeOrChild = (parent, child) => {
    if (!child) {
      return false;
    } else if (parent === child) {
      return true;
    } else {
      return isNodeOrChild(parent, child.parentElement);
    }
  };
  const isPrimaryPointer = (event) => {
    if (event.pointerType === "mouse") {
      return typeof event.button !== "number" || event.button <= 0;
    } else {
      return event.isPrimary !== false;
    }
  };
  const keyboardAccessibleElements = /* @__PURE__ */ new Set([
    "BUTTON",
    "INPUT",
    "SELECT",
    "TEXTAREA",
    "A"
  ]);
  function isElementKeyboardAccessible(element) {
    return keyboardAccessibleElements.has(element.tagName) || element.isContentEditable === true;
  }
  const textInputElements = /* @__PURE__ */ new Set(["INPUT", "SELECT", "TEXTAREA"]);
  function isElementTextInput(element) {
    return textInputElements.has(element.tagName) || element.isContentEditable === true;
  }
  const isPressing = /* @__PURE__ */ new WeakSet();
  function filterEvents(callback) {
    return (event) => {
      if (event.key !== "Enter")
        return;
      callback(event);
    };
  }
  function firePointerEvent(target, type) {
    target.dispatchEvent(new PointerEvent("pointer" + type, { isPrimary: true, bubbles: true }));
  }
  const enableKeyboardPress = (focusEvent, eventOptions) => {
    const element = focusEvent.currentTarget;
    if (!element)
      return;
    const handleKeydown = filterEvents(() => {
      if (isPressing.has(element))
        return;
      firePointerEvent(element, "down");
      const handleKeyup = filterEvents(() => {
        firePointerEvent(element, "up");
      });
      const handleBlur = () => firePointerEvent(element, "cancel");
      element.addEventListener("keyup", handleKeyup, eventOptions);
      element.addEventListener("blur", handleBlur, eventOptions);
    });
    element.addEventListener("keydown", handleKeydown, eventOptions);
    element.addEventListener("blur", () => element.removeEventListener("keydown", handleKeydown), eventOptions);
  };
  function isValidPressEvent(event) {
    return isPrimaryPointer(event) && !isDragActive();
  }
  const claimedPointerDownEvents = /* @__PURE__ */ new WeakSet();
  function press(targetOrSelector, onPressStart, options = {}) {
    const [targets, eventOptions, cancelEvents] = setupGesture(targetOrSelector, options);
    const startPress = (startEvent) => {
      const target = startEvent.currentTarget;
      if (!isValidPressEvent(startEvent))
        return;
      if (claimedPointerDownEvents.has(startEvent))
        return;
      isPressing.add(target);
      if (options.stopPropagation) {
        claimedPointerDownEvents.add(startEvent);
      }
      const onPressEnd = onPressStart(target, startEvent);
      const onPointerEnd = (endEvent, success) => {
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerCancel);
        if (isPressing.has(target)) {
          isPressing.delete(target);
        }
        if (!isValidPressEvent(endEvent)) {
          return;
        }
        if (typeof onPressEnd === "function") {
          onPressEnd(endEvent, { success });
        }
      };
      const onPointerUp = (upEvent) => {
        onPointerEnd(upEvent, target === window || target === document || options.useGlobalTarget || isNodeOrChild(target, upEvent.target));
      };
      const onPointerCancel = (cancelEvent) => {
        onPointerEnd(cancelEvent, false);
      };
      window.addEventListener("pointerup", onPointerUp, eventOptions);
      window.addEventListener("pointercancel", onPointerCancel, eventOptions);
    };
    targets.forEach((target) => {
      const pointerDownTarget = options.useGlobalTarget ? window : target;
      pointerDownTarget.addEventListener("pointerdown", startPress, eventOptions);
      if (isHTMLElement(target)) {
        target.addEventListener("focus", (event) => enableKeyboardPress(event, eventOptions));
        if (!isElementKeyboardAccessible(target) && !target.hasAttribute("tabindex")) {
          target.tabIndex = 0;
        }
      }
    });
    return cancelEvents;
  }
  function getComputedStyle$2(element, name) {
    const computedStyle = window.getComputedStyle(element);
    return isCSSVar(name) ? computedStyle.getPropertyValue(name) : computedStyle[name];
  }
  function isSVGElement(element) {
    return motionUtils.isObject(element) && "ownerSVGElement" in element;
  }
  const resizeHandlers = /* @__PURE__ */ new WeakMap();
  let observer;
  const getSize = (borderBoxAxis, svgAxis, htmlAxis) => (target, borderBoxSize) => {
    if (borderBoxSize && borderBoxSize[0]) {
      return borderBoxSize[0][borderBoxAxis + "Size"];
    } else if (isSVGElement(target) && "getBBox" in target) {
      return target.getBBox()[svgAxis];
    } else {
      return target[htmlAxis];
    }
  };
  const getWidth = /* @__PURE__ */ getSize("inline", "width", "offsetWidth");
  const getHeight = /* @__PURE__ */ getSize("block", "height", "offsetHeight");
  function notifyTarget({ target, borderBoxSize }) {
    resizeHandlers.get(target)?.forEach((handler) => {
      handler(target, {
        get width() {
          return getWidth(target, borderBoxSize);
        },
        get height() {
          return getHeight(target, borderBoxSize);
        }
      });
    });
  }
  function notifyAll(entries) {
    entries.forEach(notifyTarget);
  }
  function createResizeObserver() {
    if (typeof ResizeObserver === "undefined")
      return;
    observer = new ResizeObserver(notifyAll);
  }
  function resizeElement(target, handler) {
    if (!observer)
      createResizeObserver();
    const elements = resolveElements(target);
    elements.forEach((element) => {
      let elementHandlers = resizeHandlers.get(element);
      if (!elementHandlers) {
        elementHandlers = /* @__PURE__ */ new Set();
        resizeHandlers.set(element, elementHandlers);
      }
      elementHandlers.add(handler);
      observer?.observe(element);
    });
    return () => {
      elements.forEach((element) => {
        const elementHandlers = resizeHandlers.get(element);
        elementHandlers?.delete(handler);
        if (!elementHandlers?.size) {
          observer?.unobserve(element);
        }
      });
    };
  }
  const windowCallbacks = /* @__PURE__ */ new Set();
  let windowResizeHandler;
  function createWindowResizeHandler() {
    windowResizeHandler = () => {
      const info = {
        get width() {
          return window.innerWidth;
        },
        get height() {
          return window.innerHeight;
        }
      };
      windowCallbacks.forEach((callback) => callback(info));
    };
    window.addEventListener("resize", windowResizeHandler);
  }
  function resizeWindow(callback) {
    windowCallbacks.add(callback);
    if (!windowResizeHandler)
      createWindowResizeHandler();
    return () => {
      windowCallbacks.delete(callback);
      if (!windowCallbacks.size && typeof windowResizeHandler === "function") {
        window.removeEventListener("resize", windowResizeHandler);
        windowResizeHandler = void 0;
      }
    };
  }
  function resize(a, b) {
    return typeof a === "function" ? resizeWindow(a) : resizeElement(a, b);
  }
  function observeTimeline(update, timeline) {
    let prevProgress;
    const onFrame = () => {
      const { currentTime } = timeline;
      const percentage = currentTime === null ? 0 : currentTime.value;
      const progress = percentage / 100;
      if (prevProgress !== progress) {
        update(progress);
      }
      prevProgress = progress;
    };
    frame.preUpdate(onFrame, true);
    return () => cancelFrame(onFrame);
  }
  function record() {
    const { value } = statsBuffer;
    if (value === null) {
      cancelFrame(record);
      return;
    }
    value.frameloop.rate.push(frameData.delta);
    value.animations.mainThread.push(activeAnimations.mainThread);
    value.animations.waapi.push(activeAnimations.waapi);
    value.animations.layout.push(activeAnimations.layout);
  }
  function mean(values) {
    return values.reduce((acc, value) => acc + value, 0) / values.length;
  }
  function summarise(values, calcAverage = mean) {
    if (values.length === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0
      };
    }
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: calcAverage(values)
    };
  }
  const msToFps = (ms) => Math.round(1e3 / ms);
  function clearStatsBuffer() {
    statsBuffer.value = null;
    statsBuffer.addProjectionMetrics = null;
  }
  function reportStats() {
    const { value } = statsBuffer;
    if (!value) {
      throw new Error("Stats are not being measured");
    }
    clearStatsBuffer();
    cancelFrame(record);
    const summary = {
      frameloop: {
        setup: summarise(value.frameloop.setup),
        rate: summarise(value.frameloop.rate),
        read: summarise(value.frameloop.read),
        resolveKeyframes: summarise(value.frameloop.resolveKeyframes),
        preUpdate: summarise(value.frameloop.preUpdate),
        update: summarise(value.frameloop.update),
        preRender: summarise(value.frameloop.preRender),
        render: summarise(value.frameloop.render),
        postRender: summarise(value.frameloop.postRender)
      },
      animations: {
        mainThread: summarise(value.animations.mainThread),
        waapi: summarise(value.animations.waapi),
        layout: summarise(value.animations.layout)
      },
      layoutProjection: {
        nodes: summarise(value.layoutProjection.nodes),
        calculatedTargetDeltas: summarise(value.layoutProjection.calculatedTargetDeltas),
        calculatedProjections: summarise(value.layoutProjection.calculatedProjections)
      }
    };
    const { rate } = summary.frameloop;
    rate.min = msToFps(rate.min);
    rate.max = msToFps(rate.max);
    rate.avg = msToFps(rate.avg);
    [rate.min, rate.max] = [rate.max, rate.min];
    return summary;
  }
  function recordStats() {
    if (statsBuffer.value) {
      clearStatsBuffer();
      throw new Error("Stats are already being measured");
    }
    const newStatsBuffer = statsBuffer;
    newStatsBuffer.value = {
      frameloop: {
        setup: [],
        rate: [],
        read: [],
        resolveKeyframes: [],
        preUpdate: [],
        update: [],
        preRender: [],
        render: [],
        postRender: []
      },
      animations: {
        mainThread: [],
        waapi: [],
        layout: []
      },
      layoutProjection: {
        nodes: [],
        calculatedTargetDeltas: [],
        calculatedProjections: []
      }
    };
    newStatsBuffer.addProjectionMetrics = (metrics2) => {
      const { layoutProjection } = newStatsBuffer.value;
      layoutProjection.nodes.push(metrics2.nodes);
      layoutProjection.calculatedTargetDeltas.push(metrics2.calculatedTargetDeltas);
      layoutProjection.calculatedProjections.push(metrics2.calculatedProjections);
    };
    frame.postRender(record, true);
    return reportStats;
  }
  function isSVGSVGElement(element) {
    return isSVGElement(element) && element.tagName === "svg";
  }
  function getOriginIndex(from, total) {
    if (from === "first") {
      return 0;
    } else {
      const lastIndex = total - 1;
      return from === "last" ? lastIndex : lastIndex / 2;
    }
  }
  function stagger(duration = 0.1, { startDelay = 0, from = 0, ease: ease2 } = {}) {
    return (i, total) => {
      const fromIndex = typeof from === "number" ? from : getOriginIndex(from, total);
      const distance = Math.abs(fromIndex - i);
      let delay2 = duration * distance;
      if (ease2) {
        const maxDelay = total * duration;
        const easingFunction = motionUtils.easingDefinitionToFunction(ease2);
        delay2 = easingFunction(delay2 / maxDelay) * maxDelay;
      }
      return startDelay + delay2;
    };
  }
  function transform(...args) {
    const useImmediate = !Array.isArray(args[0]);
    const argOffset = useImmediate ? 0 : -1;
    const inputValue = args[0 + argOffset];
    const inputRange = args[1 + argOffset];
    const outputRange = args[2 + argOffset];
    const options = args[3 + argOffset];
    const interpolator = interpolate(inputRange, outputRange, options);
    return useImmediate ? interpolator(inputValue) : interpolator;
  }
  function followValue(source, options) {
    const initialValue = isMotionValue(source) ? source.get() : source;
    const value = motionValue(initialValue);
    attachFollow(value, source, options);
    return value;
  }
  function attachFollow(value, source, options = {}) {
    const initialValue = value.get();
    let activeAnimation = null;
    let latestValue = initialValue;
    let latestSetter;
    const unit = typeof initialValue === "string" ? initialValue.replace(/[\d.-]/g, "") : void 0;
    const stopAnimation = () => {
      if (activeAnimation) {
        activeAnimation.stop();
        activeAnimation = null;
      }
      value.animation = void 0;
    };
    const startAnimation = () => {
      const currentValue = asNumber$1(value.get());
      const targetValue = asNumber$1(latestValue);
      if (currentValue === targetValue) {
        stopAnimation();
        return;
      }
      const velocity = activeAnimation ? activeAnimation.getGeneratorVelocity() : value.getVelocity();
      stopAnimation();
      activeAnimation = new JSAnimation({
        keyframes: [currentValue, targetValue],
        velocity,
        // Default to spring if no type specified (matches useSpring behavior)
        type: "spring",
        restDelta: 1e-3,
        restSpeed: 0.01,
        ...options,
        onUpdate: latestSetter
      });
    };
    const scheduleAnimation = () => {
      startAnimation();
      value.animation = activeAnimation ?? void 0;
      value["events"].animationStart?.notify();
      activeAnimation?.then(() => {
        value.animation = void 0;
        value["events"].animationComplete?.notify();
      });
    };
    value.attach((v, set) => {
      latestValue = v;
      latestSetter = (latest) => set(parseValue(latest, unit));
      frame.postRender(scheduleAnimation);
    }, stopAnimation);
    if (isMotionValue(source)) {
      let skipNextAnimation = options.skipInitialAnimation === true;
      const removeSourceOnChange = source.on("change", (v) => {
        if (skipNextAnimation) {
          skipNextAnimation = false;
          value.jump(parseValue(v, unit), false);
        } else {
          value.set(parseValue(v, unit));
        }
      });
      const removeValueOnDestroy = value.on("destroy", removeSourceOnChange);
      return () => {
        removeSourceOnChange();
        removeValueOnDestroy();
      };
    }
    return stopAnimation;
  }
  function parseValue(v, unit) {
    return unit ? v + unit : v;
  }
  function asNumber$1(v) {
    return typeof v === "number" ? v : parseFloat(v);
  }
  function subscribeValue(inputValues, outputValue, getLatest) {
    const update = () => outputValue.set(getLatest());
    const scheduleUpdate = () => frame.preRender(update, false, true);
    const subscriptions = inputValues.map((v) => v.on("change", scheduleUpdate));
    outputValue.on("destroy", () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      cancelFrame(update);
    });
  }
  function transformValue(transform2) {
    const collectedValues = [];
    collectMotionValues.current = collectedValues;
    const initialValue = transform2();
    collectMotionValues.current = void 0;
    const value = motionValue(initialValue);
    subscribeValue(collectedValues, value, transform2);
    return value;
  }
  function mapValue(inputValue, inputRange, outputRange, options) {
    const map = transform(inputRange, outputRange, options);
    return transformValue(() => map(inputValue.get()));
  }
  function springValue(source, options) {
    return followValue(source, { type: "spring", ...options });
  }
  function attachSpring(value, source, options) {
    return attachFollow(value, source, { type: "spring", ...options });
  }
  const valueTypes = [...dimensionValueTypes, color, complex];
  const findValueType = (v) => valueTypes.find(testValueType(v));
  function chooseLayerType(valueName) {
    if (valueName === "layout")
      return "group";
    if (valueName === "enter" || valueName === "new")
      return "new";
    if (valueName === "exit" || valueName === "old")
      return "old";
    return "group";
  }
  let pendingRules = {};
  let style = null;
  const css = {
    set: (selector, values) => {
      pendingRules[selector] = values;
    },
    commit: () => {
      if (!style) {
        style = document.createElement("style");
        style.id = "motion-view";
      }
      let cssText = "";
      for (const selector in pendingRules) {
        const rule = pendingRules[selector];
        cssText += `${selector} {
`;
        for (const [property, value] of Object.entries(rule)) {
          cssText += `  ${property}: ${value};
`;
        }
        cssText += "}\n";
      }
      style.textContent = cssText;
      document.head.appendChild(style);
      pendingRules = {};
    },
    remove: () => {
      if (style && style.parentElement) {
        style.parentElement.removeChild(style);
      }
    }
  };
  function getViewAnimationLayerInfo(pseudoElement) {
    const match = pseudoElement.match(/::view-transition-(old|new|group|image-pair)\((.*?)\)/);
    if (!match)
      return null;
    return { layer: match[2], type: match[1] };
  }
  function filterViewAnimations(animation) {
    const { effect } = animation;
    if (!effect)
      return false;
    return effect.target === document.documentElement && effect.pseudoElement?.startsWith("::view-transition");
  }
  function getViewAnimations() {
    return document.getAnimations().filter(filterViewAnimations);
  }
  function hasTarget(target, targets) {
    return targets.has(target) && Object.keys(targets.get(target)).length > 0;
  }
  const definitionNames = ["layout", "enter", "exit", "new", "old"];
  function startViewAnimation(builder) {
    const { update, targets, options: defaultOptions } = builder;
    if (!document.startViewTransition) {
      return new Promise(async (resolve) => {
        await update();
        resolve(new GroupAnimation([]));
      });
    }
    if (!hasTarget("root", targets)) {
      css.set(":root", {
        "view-transition-name": "none"
      });
    }
    css.set("::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*)", { "animation-timing-function": "linear !important" });
    css.commit();
    const transition = document.startViewTransition(async () => {
      await update();
    });
    transition.finished.finally(() => {
      css.remove();
    });
    return new Promise((resolve) => {
      transition.ready.then(() => {
        const generatedViewAnimations = getViewAnimations();
        const animations = [];
        targets.forEach((definition, target) => {
          for (const key of definitionNames) {
            if (!definition[key])
              continue;
            const { keyframes: keyframes2, options } = definition[key];
            for (let [valueName, valueKeyframes] of Object.entries(keyframes2)) {
              if (!valueKeyframes)
                continue;
              const valueOptions = {
                ...getValueTransition(defaultOptions, valueName),
                ...getValueTransition(options, valueName)
              };
              const type = chooseLayerType(key);
              if (valueName === "opacity" && !Array.isArray(valueKeyframes)) {
                const initialValue = type === "new" ? 0 : 1;
                valueKeyframes = [initialValue, valueKeyframes];
              }
              if (typeof valueOptions.delay === "function") {
                valueOptions.delay = valueOptions.delay(0, 1);
              }
              valueOptions.duration && (valueOptions.duration = motionUtils.secondsToMilliseconds(valueOptions.duration));
              valueOptions.delay && (valueOptions.delay = motionUtils.secondsToMilliseconds(valueOptions.delay));
              const animation = new NativeAnimation({
                ...valueOptions,
                element: document.documentElement,
                name: valueName,
                pseudoElement: `::view-transition-${type}(${target})`,
                keyframes: valueKeyframes
              });
              animations.push(animation);
            }
          }
        });
        for (const animation of generatedViewAnimations) {
          if (animation.playState === "finished")
            continue;
          const { effect } = animation;
          if (!effect || !(effect instanceof KeyframeEffect))
            continue;
          const { pseudoElement } = effect;
          if (!pseudoElement)
            continue;
          const name = getViewAnimationLayerInfo(pseudoElement);
          if (!name)
            continue;
          const targetDefinition = targets.get(name.layer);
          if (!targetDefinition) {
            const transitionName = name.type === "group" ? "layout" : "";
            let animationTransition = {
              ...getValueTransition(defaultOptions, transitionName)
            };
            animationTransition.duration && (animationTransition.duration = motionUtils.secondsToMilliseconds(animationTransition.duration));
            animationTransition = applyGeneratorOptions(animationTransition);
            const easing = mapEasingToNativeEasing(animationTransition.ease, animationTransition.duration);
            effect.updateTiming({
              delay: motionUtils.secondsToMilliseconds(animationTransition.delay ?? 0),
              duration: animationTransition.duration,
              easing
            });
            animations.push(new NativeAnimationWrapper(animation));
          } else if (hasOpacity(targetDefinition, "enter") && hasOpacity(targetDefinition, "exit") && effect.getKeyframes().some((keyframe) => keyframe.mixBlendMode)) {
            animations.push(new NativeAnimationWrapper(animation));
          } else {
            animation.cancel();
          }
        }
        resolve(new GroupAnimation(animations));
      });
    });
  }
  function hasOpacity(target, key) {
    return target?.[key]?.keyframes.opacity;
  }
  let builders = [];
  let current = null;
  function next() {
    current = null;
    const [nextBuilder] = builders;
    if (nextBuilder)
      start(nextBuilder);
  }
  function start(builder) {
    motionUtils.removeItem(builders, builder);
    current = builder;
    startViewAnimation(builder).then((animation) => {
      builder.notifyReady(animation);
      animation.finished.finally(next);
    });
  }
  function processQueue() {
    for (let i = builders.length - 1; i >= 0; i--) {
      const builder = builders[i];
      const { interrupt } = builder.options;
      if (interrupt === "immediate") {
        const batchedUpdates = builders.slice(0, i + 1).map((b) => b.update);
        const remaining = builders.slice(i + 1);
        builder.update = () => {
          batchedUpdates.forEach((update) => update());
        };
        builders = [builder, ...remaining];
        break;
      }
    }
    if (!current || builders[0]?.options.interrupt === "immediate") {
      next();
    }
  }
  function addToQueue(builder) {
    builders.push(builder);
    microtask.render(processQueue);
  }
  class ViewTransitionBuilder {
    constructor(update, options = {}) {
      this.currentSubject = "root";
      this.targets = /* @__PURE__ */ new Map();
      this.notifyReady = motionUtils.noop;
      this.readyPromise = new Promise((resolve) => {
        this.notifyReady = resolve;
      });
      this.update = update;
      this.options = {
        interrupt: "wait",
        ...options
      };
      addToQueue(this);
    }
    get(subject) {
      this.currentSubject = subject;
      return this;
    }
    layout(keyframes2, options) {
      this.updateTarget("layout", keyframes2, options);
      return this;
    }
    new(keyframes2, options) {
      this.updateTarget("new", keyframes2, options);
      return this;
    }
    old(keyframes2, options) {
      this.updateTarget("old", keyframes2, options);
      return this;
    }
    enter(keyframes2, options) {
      this.updateTarget("enter", keyframes2, options);
      return this;
    }
    exit(keyframes2, options) {
      this.updateTarget("exit", keyframes2, options);
      return this;
    }
    crossfade(options) {
      this.updateTarget("enter", { opacity: 1 }, options);
      this.updateTarget("exit", { opacity: 0 }, options);
      return this;
    }
    updateTarget(target, keyframes2, options = {}) {
      const { currentSubject, targets } = this;
      if (!targets.has(currentSubject)) {
        targets.set(currentSubject, {});
      }
      const targetData = targets.get(currentSubject);
      targetData[target] = { keyframes: keyframes2, options };
    }
    then(resolve, reject) {
      return this.readyPromise.then(resolve, reject);
    }
  }
  function animateView(update, defaultOptions = {}) {
    return new ViewTransitionBuilder(update, defaultOptions);
  }
  const createAxisDelta = () => ({
    translate: 0,
    scale: 1,
    origin: 0,
    originPoint: 0
  });
  const createDelta = () => ({
    x: createAxisDelta(),
    y: createAxisDelta()
  });
  const createAxis = () => ({ min: 0, max: 0 });
  const createBox = () => ({
    x: createAxis(),
    y: createAxis()
  });
  const visualElementStore = /* @__PURE__ */ new WeakMap();
  function isAnimationControls(v) {
    return v !== null && typeof v === "object" && typeof v.start === "function";
  }
  function isVariantLabel(v) {
    return typeof v === "string" || Array.isArray(v);
  }
  const variantPriorityOrder = [
    "animate",
    "whileInView",
    "whileFocus",
    "whileHover",
    "whileTap",
    "whileDrag",
    "exit"
  ];
  const variantProps = ["initial", ...variantPriorityOrder];
  function isControllingVariants(props) {
    return isAnimationControls(props.animate) || variantProps.some((name) => isVariantLabel(props[name]));
  }
  function isVariantNode(props) {
    return Boolean(isControllingVariants(props) || props.variants);
  }
  function updateMotionValuesFromProps(element, next2, prev) {
    for (const key in next2) {
      const nextValue = next2[key];
      const prevValue = prev[key];
      if (isMotionValue(nextValue)) {
        element.addValue(key, nextValue);
      } else if (isMotionValue(prevValue)) {
        element.addValue(key, motionValue(nextValue, { owner: element }));
      } else if (prevValue !== nextValue) {
        if (element.hasValue(key)) {
          const existingValue = element.getValue(key);
          if (existingValue.liveStyle === true) {
            existingValue.jump(nextValue);
          } else if (!existingValue.hasAnimated) {
            existingValue.set(nextValue);
          }
        } else {
          const latestValue = element.getStaticValue(key);
          element.addValue(key, motionValue(latestValue !== void 0 ? latestValue : nextValue, { owner: element }));
        }
      }
    }
    for (const key in prev) {
      if (next2[key] === void 0)
        element.removeValue(key);
    }
    return next2;
  }
  const prefersReducedMotion = { current: null };
  const hasReducedMotionListener = { current: false };
  const isBrowser = typeof window !== "undefined";
  function initPrefersReducedMotion() {
    hasReducedMotionListener.current = true;
    if (!isBrowser)
      return;
    if (window.matchMedia) {
      const motionMediaQuery = window.matchMedia("(prefers-reduced-motion)");
      const setReducedMotionPreferences = () => prefersReducedMotion.current = motionMediaQuery.matches;
      motionMediaQuery.addEventListener("change", setReducedMotionPreferences);
      setReducedMotionPreferences();
    } else {
      prefersReducedMotion.current = false;
    }
  }
  const propEventHandlers = [
    "AnimationStart",
    "AnimationComplete",
    "Update",
    "BeforeLayoutMeasure",
    "LayoutMeasure",
    "LayoutAnimationStart",
    "LayoutAnimationComplete"
  ];
  let featureDefinitions = {};
  function setFeatureDefinitions(definitions) {
    featureDefinitions = definitions;
  }
  function getFeatureDefinitions() {
    return featureDefinitions;
  }
  class VisualElement {
    /**
     * This method takes React props and returns found MotionValues. For example, HTML
     * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
     *
     * This isn't an abstract method as it needs calling in the constructor, but it is
     * intended to be one.
     */
    scrapeMotionValuesFromProps(_props, _prevProps, _visualElement) {
      return {};
    }
    constructor({ parent, props, presenceContext, reducedMotionConfig, skipAnimations, blockInitialAnimation, visualState }, options = {}) {
      this.current = null;
      this.children = /* @__PURE__ */ new Set();
      this.isVariantNode = false;
      this.isControllingVariants = false;
      this.shouldReduceMotion = null;
      this.shouldSkipAnimations = false;
      this.values = /* @__PURE__ */ new Map();
      this.KeyframeResolver = KeyframeResolver;
      this.features = {};
      this.valueSubscriptions = /* @__PURE__ */ new Map();
      this.prevMotionValues = {};
      this.hasBeenMounted = false;
      this.events = {};
      this.propEventSubscriptions = {};
      this.notifyUpdate = () => this.notify("Update", this.latestValues);
      this.render = () => {
        if (!this.current)
          return;
        this.triggerBuild();
        this.renderInstance(this.current, this.renderState, this.props.style, this.projection);
      };
      this.renderScheduledAt = 0;
      this.scheduleRender = () => {
        const now2 = time.now();
        if (this.renderScheduledAt < now2) {
          this.renderScheduledAt = now2;
          frame.render(this.render, false, true);
        }
      };
      const { latestValues, renderState } = visualState;
      this.latestValues = latestValues;
      this.baseTarget = { ...latestValues };
      this.initialValues = props.initial ? { ...latestValues } : {};
      this.renderState = renderState;
      this.parent = parent;
      this.props = props;
      this.presenceContext = presenceContext;
      this.depth = parent ? parent.depth + 1 : 0;
      this.reducedMotionConfig = reducedMotionConfig;
      this.skipAnimationsConfig = skipAnimations;
      this.options = options;
      this.blockInitialAnimation = Boolean(blockInitialAnimation);
      this.isControllingVariants = isControllingVariants(props);
      this.isVariantNode = isVariantNode(props);
      if (this.isVariantNode) {
        this.variantChildren = /* @__PURE__ */ new Set();
      }
      this.manuallyAnimateOnMount = Boolean(parent && parent.current);
      const { willChange, ...initialMotionValues } = this.scrapeMotionValuesFromProps(props, {}, this);
      for (const key in initialMotionValues) {
        const value = initialMotionValues[key];
        if (latestValues[key] !== void 0 && isMotionValue(value)) {
          value.set(latestValues[key]);
        }
      }
    }
    mount(instance) {
      if (this.hasBeenMounted) {
        for (const key in this.initialValues) {
          this.values.get(key)?.jump(this.initialValues[key]);
          this.latestValues[key] = this.initialValues[key];
        }
      }
      this.current = instance;
      visualElementStore.set(instance, this);
      if (this.projection && !this.projection.instance) {
        this.projection.mount(instance);
      }
      if (this.parent && this.isVariantNode && !this.isControllingVariants) {
        this.removeFromVariantTree = this.parent.addVariantChild(this);
      }
      this.values.forEach((value, key) => this.bindToMotionValue(key, value));
      if (this.reducedMotionConfig === "never") {
        this.shouldReduceMotion = false;
      } else if (this.reducedMotionConfig === "always") {
        this.shouldReduceMotion = true;
      } else {
        if (!hasReducedMotionListener.current) {
          initPrefersReducedMotion();
        }
        this.shouldReduceMotion = prefersReducedMotion.current;
      }
      this.shouldSkipAnimations = this.skipAnimationsConfig ?? false;
      this.parent?.addChild(this);
      this.update(this.props, this.presenceContext);
      this.hasBeenMounted = true;
    }
    unmount() {
      this.projection && this.projection.unmount();
      cancelFrame(this.notifyUpdate);
      cancelFrame(this.render);
      this.valueSubscriptions.forEach((remove) => remove());
      this.valueSubscriptions.clear();
      this.removeFromVariantTree && this.removeFromVariantTree();
      this.parent?.removeChild(this);
      for (const key in this.events) {
        this.events[key].clear();
      }
      for (const key in this.features) {
        const feature = this.features[key];
        if (feature) {
          feature.unmount();
          feature.isMounted = false;
        }
      }
      this.current = null;
    }
    addChild(child) {
      this.children.add(child);
      this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set());
      this.enteringChildren.add(child);
    }
    removeChild(child) {
      this.children.delete(child);
      this.enteringChildren && this.enteringChildren.delete(child);
    }
    bindToMotionValue(key, value) {
      if (this.valueSubscriptions.has(key)) {
        this.valueSubscriptions.get(key)();
      }
      if (value.accelerate && acceleratedValues.has(key) && this.current instanceof HTMLElement) {
        const { factory, keyframes: keyframes2, times, ease: ease2, duration } = value.accelerate;
        const animation = new NativeAnimation({
          element: this.current,
          name: key,
          keyframes: keyframes2,
          times,
          ease: ease2,
          duration: motionUtils.secondsToMilliseconds(duration)
        });
        const cleanup = factory(animation);
        this.valueSubscriptions.set(key, () => {
          cleanup();
          animation.cancel();
        });
        return;
      }
      const valueIsTransform = transformProps.has(key);
      if (valueIsTransform && this.onBindTransform) {
        this.onBindTransform();
      }
      const removeOnChange = value.on("change", (latestValue) => {
        this.latestValues[key] = latestValue;
        this.props.onUpdate && frame.preRender(this.notifyUpdate);
        if (valueIsTransform && this.projection) {
          this.projection.isTransformDirty = true;
        }
        this.scheduleRender();
      });
      let removeSyncCheck;
      if (typeof window !== "undefined" && window.MotionCheckAppearSync) {
        removeSyncCheck = window.MotionCheckAppearSync(this, key, value);
      }
      this.valueSubscriptions.set(key, () => {
        removeOnChange();
        if (removeSyncCheck)
          removeSyncCheck();
        if (value.owner)
          value.stop();
      });
    }
    sortNodePosition(other) {
      if (!this.current || !this.sortInstanceNodePosition || this.type !== other.type) {
        return 0;
      }
      return this.sortInstanceNodePosition(this.current, other.current);
    }
    updateFeatures() {
      let key = "animation";
      for (key in featureDefinitions) {
        const featureDefinition = featureDefinitions[key];
        if (!featureDefinition)
          continue;
        const { isEnabled, Feature: FeatureConstructor } = featureDefinition;
        if (!this.features[key] && FeatureConstructor && isEnabled(this.props)) {
          this.features[key] = new FeatureConstructor(this);
        }
        if (this.features[key]) {
          const feature = this.features[key];
          if (feature.isMounted) {
            feature.update();
          } else {
            feature.mount();
            feature.isMounted = true;
          }
        }
      }
    }
    triggerBuild() {
      this.build(this.renderState, this.latestValues, this.props);
    }
    /**
     * Measure the current viewport box with or without transforms.
     * Only measures axis-aligned boxes, rotate and skew must be manually
     * removed with a re-render to work.
     */
    measureViewportBox() {
      return this.current ? this.measureInstanceViewportBox(this.current, this.props) : createBox();
    }
    getStaticValue(key) {
      return this.latestValues[key];
    }
    setStaticValue(key, value) {
      this.latestValues[key] = value;
    }
    /**
     * Update the provided props. Ensure any newly-added motion values are
     * added to our map, old ones removed, and listeners updated.
     */
    update(props, presenceContext) {
      if (props.transformTemplate || this.props.transformTemplate) {
        this.scheduleRender();
      }
      this.prevProps = this.props;
      this.props = props;
      this.prevPresenceContext = this.presenceContext;
      this.presenceContext = presenceContext;
      for (let i = 0; i < propEventHandlers.length; i++) {
        const key = propEventHandlers[i];
        if (this.propEventSubscriptions[key]) {
          this.propEventSubscriptions[key]();
          delete this.propEventSubscriptions[key];
        }
        const listenerName = "on" + key;
        const listener = props[listenerName];
        if (listener) {
          this.propEventSubscriptions[key] = this.on(key, listener);
        }
      }
      this.prevMotionValues = updateMotionValuesFromProps(this, this.scrapeMotionValuesFromProps(props, this.prevProps || {}, this), this.prevMotionValues);
      if (this.handleChildMotionValue) {
        this.handleChildMotionValue();
      }
    }
    getProps() {
      return this.props;
    }
    /**
     * Returns the variant definition with a given name.
     */
    getVariant(name) {
      return this.props.variants ? this.props.variants[name] : void 0;
    }
    /**
     * Returns the defined default transition on this component.
     */
    getDefaultTransition() {
      return this.props.transition;
    }
    getTransformPagePoint() {
      return this.props.transformPagePoint;
    }
    getClosestVariantNode() {
      return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
    }
    /**
     * Add a child visual element to our set of children.
     */
    addVariantChild(child) {
      const closestVariantNode = this.getClosestVariantNode();
      if (closestVariantNode) {
        closestVariantNode.variantChildren && closestVariantNode.variantChildren.add(child);
        return () => closestVariantNode.variantChildren.delete(child);
      }
    }
    /**
     * Add a motion value and bind it to this visual element.
     */
    addValue(key, value) {
      const existingValue = this.values.get(key);
      if (value !== existingValue) {
        if (existingValue)
          this.removeValue(key);
        this.bindToMotionValue(key, value);
        this.values.set(key, value);
        this.latestValues[key] = value.get();
      }
    }
    /**
     * Remove a motion value and unbind any active subscriptions.
     */
    removeValue(key) {
      this.values.delete(key);
      const unsubscribe = this.valueSubscriptions.get(key);
      if (unsubscribe) {
        unsubscribe();
        this.valueSubscriptions.delete(key);
      }
      delete this.latestValues[key];
      this.removeValueFromRenderState(key, this.renderState);
    }
    /**
     * Check whether we have a motion value for this key
     */
    hasValue(key) {
      return this.values.has(key);
    }
    getValue(key, defaultValue) {
      if (this.props.values && this.props.values[key]) {
        return this.props.values[key];
      }
      let value = this.values.get(key);
      if (value === void 0 && defaultValue !== void 0) {
        value = motionValue(defaultValue === null ? void 0 : defaultValue, { owner: this });
        this.addValue(key, value);
      }
      return value;
    }
    /**
     * If we're trying to animate to a previously unencountered value,
     * we need to check for it in our state and as a last resort read it
     * directly from the instance (which might have performance implications).
     */
    readValue(key, target) {
      let value = this.latestValues[key] !== void 0 || !this.current ? this.latestValues[key] : this.getBaseTargetFromProps(this.props, key) ?? this.readValueFromInstance(this.current, key, this.options);
      if (value !== void 0 && value !== null) {
        if (typeof value === "string" && (motionUtils.isNumericalString(value) || motionUtils.isZeroValueString(value))) {
          value = parseFloat(value);
        } else if (!findValueType(value) && complex.test(target)) {
          value = getAnimatableNone(key, target);
        }
        this.setBaseTarget(key, isMotionValue(value) ? value.get() : value);
      }
      return isMotionValue(value) ? value.get() : value;
    }
    /**
     * Set the base target to later animate back to. This is currently
     * only hydrated on creation and when we first read a value.
     */
    setBaseTarget(key, value) {
      this.baseTarget[key] = value;
    }
    /**
     * Find the base target for a value thats been removed from all animation
     * props.
     */
    getBaseTarget(key) {
      const { initial } = this.props;
      let valueFromInitial;
      if (typeof initial === "string" || typeof initial === "object") {
        const variant = resolveVariantFromProps(this.props, initial, this.presenceContext?.custom);
        if (variant) {
          valueFromInitial = variant[key];
        }
      }
      if (initial && valueFromInitial !== void 0) {
        return valueFromInitial;
      }
      const target = this.getBaseTargetFromProps(this.props, key);
      if (target !== void 0 && !isMotionValue(target))
        return target;
      return this.initialValues[key] !== void 0 && valueFromInitial === void 0 ? void 0 : this.baseTarget[key];
    }
    on(eventName, callback) {
      if (!this.events[eventName]) {
        this.events[eventName] = new motionUtils.SubscriptionManager();
      }
      return this.events[eventName].add(callback);
    }
    notify(eventName, ...args) {
      if (this.events[eventName]) {
        this.events[eventName].notify(...args);
      }
    }
    scheduleRenderMicrotask() {
      microtask.render(this.render);
    }
  }
  class DOMVisualElement extends VisualElement {
    constructor() {
      super(...arguments);
      this.KeyframeResolver = DOMKeyframesResolver;
    }
    sortInstanceNodePosition(a, b) {
      return a.compareDocumentPosition(b) & 2 ? 1 : -1;
    }
    getBaseTargetFromProps(props, key) {
      const style2 = props.style;
      return style2 ? style2[key] : void 0;
    }
    removeValueFromRenderState(key, { vars, style: style2 }) {
      delete vars[key];
      delete style2[key];
    }
    handleChildMotionValue() {
      if (this.childSubscription) {
        this.childSubscription();
        delete this.childSubscription;
      }
      const { children } = this.props;
      if (isMotionValue(children)) {
        this.childSubscription = children.on("change", (latest) => {
          if (this.current) {
            this.current.textContent = `${latest}`;
          }
        });
      }
    }
  }
  class Feature {
    constructor(node) {
      this.isMounted = false;
      this.node = node;
    }
    update() {
    }
  }
  function convertBoundingBoxToBox({ top, left, right, bottom }) {
    return {
      x: { min: left, max: right },
      y: { min: top, max: bottom }
    };
  }
  function convertBoxToBoundingBox({ x, y }) {
    return { top: y.min, right: x.max, bottom: y.max, left: x.min };
  }
  function transformBoxPoints(point, transformPoint) {
    if (!transformPoint)
      return point;
    const topLeft = transformPoint({ x: point.left, y: point.top });
    const bottomRight = transformPoint({ x: point.right, y: point.bottom });
    return {
      top: topLeft.y,
      left: topLeft.x,
      bottom: bottomRight.y,
      right: bottomRight.x
    };
  }
  function isIdentityScale(scale2) {
    return scale2 === void 0 || scale2 === 1;
  }
  function hasScale({ scale: scale2, scaleX: scaleX2, scaleY: scaleY2 }) {
    return !isIdentityScale(scale2) || !isIdentityScale(scaleX2) || !isIdentityScale(scaleY2);
  }
  function hasTransform(values) {
    return hasScale(values) || has2DTranslate(values) || values.z || values.rotate || values.rotateX || values.rotateY || values.skewX || values.skewY;
  }
  function has2DTranslate(values) {
    return is2DTranslate(values.x) || is2DTranslate(values.y);
  }
  function is2DTranslate(value) {
    return value && value !== "0%";
  }
  function scalePoint(point, scale2, originPoint) {
    const distanceFromOrigin = point - originPoint;
    const scaled = scale2 * distanceFromOrigin;
    return originPoint + scaled;
  }
  function applyPointDelta(point, translate, scale2, originPoint, boxScale) {
    if (boxScale !== void 0) {
      point = scalePoint(point, boxScale, originPoint);
    }
    return scalePoint(point, scale2, originPoint) + translate;
  }
  function applyAxisDelta(axis, translate = 0, scale2 = 1, originPoint, boxScale) {
    axis.min = applyPointDelta(axis.min, translate, scale2, originPoint, boxScale);
    axis.max = applyPointDelta(axis.max, translate, scale2, originPoint, boxScale);
  }
  function applyBoxDelta(box, { x, y }) {
    applyAxisDelta(box.x, x.translate, x.scale, x.originPoint);
    applyAxisDelta(box.y, y.translate, y.scale, y.originPoint);
  }
  const TREE_SCALE_SNAP_MIN = 0.999999999999;
  const TREE_SCALE_SNAP_MAX = 1.0000000000001;
  function applyTreeDeltas(box, treeScale, treePath, isSharedTransition = false) {
    const treeLength = treePath.length;
    if (!treeLength)
      return;
    treeScale.x = treeScale.y = 1;
    let node;
    let delta;
    for (let i = 0; i < treeLength; i++) {
      node = treePath[i];
      delta = node.projectionDelta;
      const { visualElement } = node.options;
      if (visualElement && visualElement.props.style && visualElement.props.style.display === "contents") {
        continue;
      }
      if (isSharedTransition && node.options.layoutScroll && node.scroll && node !== node.root) {
        translateAxis(box.x, -node.scroll.offset.x);
        translateAxis(box.y, -node.scroll.offset.y);
      }
      if (delta) {
        treeScale.x *= delta.x.scale;
        treeScale.y *= delta.y.scale;
        applyBoxDelta(box, delta);
      }
      if (isSharedTransition && hasTransform(node.latestValues)) {
        transformBox(box, node.latestValues, node.layout?.layoutBox);
      }
    }
    if (treeScale.x < TREE_SCALE_SNAP_MAX && treeScale.x > TREE_SCALE_SNAP_MIN) {
      treeScale.x = 1;
    }
    if (treeScale.y < TREE_SCALE_SNAP_MAX && treeScale.y > TREE_SCALE_SNAP_MIN) {
      treeScale.y = 1;
    }
  }
  function translateAxis(axis, distance) {
    axis.min += distance;
    axis.max += distance;
  }
  function transformAxis(axis, axisTranslate, axisScale, boxScale, axisOrigin = 0.5) {
    const originPoint = mixNumber$1(axis.min, axis.max, axisOrigin);
    applyAxisDelta(axis, axisTranslate, axisScale, originPoint, boxScale);
  }
  function resolveAxisTranslate(value, axis) {
    if (typeof value === "string") {
      return parseFloat(value) / 100 * (axis.max - axis.min);
    }
    return value;
  }
  function transformBox(box, transform2, sourceBox) {
    const resolveBox = sourceBox ?? box;
    transformAxis(box.x, resolveAxisTranslate(transform2.x, resolveBox.x), transform2.scaleX, transform2.scale, transform2.originX);
    transformAxis(box.y, resolveAxisTranslate(transform2.y, resolveBox.y), transform2.scaleY, transform2.scale, transform2.originY);
  }
  function measureViewportBox(instance, transformPoint) {
    return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint));
  }
  function measurePageBox(element, rootProjectionNode2, transformPagePoint) {
    const viewportBox = measureViewportBox(element, transformPagePoint);
    const { scroll } = rootProjectionNode2;
    if (scroll) {
      translateAxis(viewportBox.x, scroll.offset.x);
      translateAxis(viewportBox.y, scroll.offset.y);
    }
    return viewportBox;
  }
  const translateAlias = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective"
  };
  const numTransforms = transformPropOrder.length;
  function buildTransform(latestValues, transform2, transformTemplate) {
    let transformString = "";
    let transformIsDefault = true;
    for (let i = 0; i < numTransforms; i++) {
      const key = transformPropOrder[i];
      const value = latestValues[key];
      if (value === void 0)
        continue;
      let valueIsDefault = true;
      if (typeof value === "number") {
        valueIsDefault = value === (key.startsWith("scale") ? 1 : 0);
      } else {
        const parsed = parseFloat(value);
        valueIsDefault = key.startsWith("scale") ? parsed === 1 : parsed === 0;
      }
      if (!valueIsDefault || transformTemplate) {
        const valueAsType = getValueAsType(value, numberValueTypes[key]);
        if (!valueIsDefault) {
          transformIsDefault = false;
          const transformName = translateAlias[key] || key;
          transformString += `${transformName}(${valueAsType}) `;
        }
        if (transformTemplate) {
          transform2[key] = valueAsType;
        }
      }
    }
    transformString = transformString.trim();
    if (transformTemplate) {
      transformString = transformTemplate(transform2, transformIsDefault ? "" : transformString);
    } else if (transformIsDefault) {
      transformString = "none";
    }
    return transformString;
  }
  function buildHTMLStyles(state, latestValues, transformTemplate) {
    const { style: style2, vars, transformOrigin } = state;
    let hasTransform2 = false;
    let hasTransformOrigin = false;
    for (const key in latestValues) {
      const value = latestValues[key];
      if (transformProps.has(key)) {
        hasTransform2 = true;
        continue;
      } else if (isCSSVariableName(key)) {
        vars[key] = value;
        continue;
      } else {
        const valueAsType = getValueAsType(value, numberValueTypes[key]);
        if (key.startsWith("origin")) {
          hasTransformOrigin = true;
          transformOrigin[key] = valueAsType;
        } else {
          style2[key] = valueAsType;
        }
      }
    }
    if (!latestValues.transform) {
      if (hasTransform2 || transformTemplate) {
        style2.transform = buildTransform(latestValues, state.transform, transformTemplate);
      } else if (style2.transform) {
        style2.transform = "none";
      }
    }
    if (hasTransformOrigin) {
      const { originX = "50%", originY = "50%", originZ = 0 } = transformOrigin;
      style2.transformOrigin = `${originX} ${originY} ${originZ}`;
    }
  }
  function renderHTML(element, { style: style2, vars }, styleProp, projection) {
    const elementStyle = element.style;
    let key;
    for (key in style2) {
      elementStyle[key] = style2[key];
    }
    projection?.applyProjectionStyles(elementStyle, styleProp);
    for (key in vars) {
      elementStyle.setProperty(key, vars[key]);
    }
  }
  function pixelsToPercent(pixels, axis) {
    if (axis.max === axis.min)
      return 0;
    return pixels / (axis.max - axis.min) * 100;
  }
  const correctBorderRadius = {
    correct: (latest, node) => {
      if (!node.target)
        return latest;
      if (typeof latest === "string") {
        if (px.test(latest)) {
          latest = parseFloat(latest);
        } else {
          return latest;
        }
      }
      const x = pixelsToPercent(latest, node.target.x);
      const y = pixelsToPercent(latest, node.target.y);
      return `${x}% ${y}%`;
    }
  };
  const correctBoxShadow = {
    correct: (latest, { treeScale, projectionDelta }) => {
      const original = latest;
      const shadow = complex.parse(latest);
      if (shadow.length > 5)
        return original;
      const template = complex.createTransformer(latest);
      const offset = typeof shadow[0] !== "number" ? 1 : 0;
      const xScale = projectionDelta.x.scale * treeScale.x;
      const yScale = projectionDelta.y.scale * treeScale.y;
      shadow[0 + offset] /= xScale;
      shadow[1 + offset] /= yScale;
      const averageScale = mixNumber$1(xScale, yScale, 0.5);
      if (typeof shadow[2 + offset] === "number")
        shadow[2 + offset] /= averageScale;
      if (typeof shadow[3 + offset] === "number")
        shadow[3 + offset] /= averageScale;
      return template(shadow);
    }
  };
  const scaleCorrectors = {
    borderRadius: {
      ...correctBorderRadius,
      applyTo: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius"
      ]
    },
    borderTopLeftRadius: correctBorderRadius,
    borderTopRightRadius: correctBorderRadius,
    borderBottomLeftRadius: correctBorderRadius,
    borderBottomRightRadius: correctBorderRadius,
    boxShadow: correctBoxShadow
  };
  function addScaleCorrector(correctors) {
    for (const key in correctors) {
      scaleCorrectors[key] = correctors[key];
      if (isCSSVariableName(key)) {
        scaleCorrectors[key].isCSSVariable = true;
      }
    }
  }
  function isForcedMotionValue(key, { layout, layoutId }) {
    return transformProps.has(key) || key.startsWith("origin") || (layout || layoutId !== void 0) && (!!scaleCorrectors[key] || key === "opacity");
  }
  function scrapeMotionValuesFromProps$1(props, prevProps, visualElement) {
    const style2 = props.style;
    const prevStyle = prevProps?.style;
    const newValues = {};
    if (!style2)
      return newValues;
    for (const key in style2) {
      if (isMotionValue(style2[key]) || prevStyle && isMotionValue(prevStyle[key]) || isForcedMotionValue(key, props) || visualElement?.getValue(key)?.liveStyle !== void 0) {
        newValues[key] = style2[key];
      }
    }
    return newValues;
  }
  function getComputedStyle$1(element) {
    return window.getComputedStyle(element);
  }
  class HTMLVisualElement extends DOMVisualElement {
    constructor() {
      super(...arguments);
      this.type = "html";
      this.renderInstance = renderHTML;
    }
    readValueFromInstance(instance, key) {
      if (transformProps.has(key)) {
        return this.projection?.isProjecting ? defaultTransformValue(key) : readTransformValue(instance, key);
      } else {
        const computedStyle = getComputedStyle$1(instance);
        const value = (isCSSVariableName(key) ? computedStyle.getPropertyValue(key) : computedStyle[key]) || 0;
        return typeof value === "string" ? value.trim() : value;
      }
    }
    measureInstanceViewportBox(instance, { transformPagePoint }) {
      return measureViewportBox(instance, transformPagePoint);
    }
    build(renderState, latestValues, props) {
      buildHTMLStyles(renderState, latestValues, props.transformTemplate);
    }
    scrapeMotionValuesFromProps(props, prevProps, visualElement) {
      return scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
    }
  }
  function isObjectKey(key, object) {
    return key in object;
  }
  class ObjectVisualElement extends VisualElement {
    constructor() {
      super(...arguments);
      this.type = "object";
    }
    readValueFromInstance(instance, key) {
      if (isObjectKey(key, instance)) {
        const value = instance[key];
        if (typeof value === "string" || typeof value === "number") {
          return value;
        }
      }
      return void 0;
    }
    getBaseTargetFromProps() {
      return void 0;
    }
    removeValueFromRenderState(key, renderState) {
      delete renderState.output[key];
    }
    measureInstanceViewportBox() {
      return createBox();
    }
    build(renderState, latestValues) {
      Object.assign(renderState.output, latestValues);
    }
    renderInstance(instance, { output }) {
      Object.assign(instance, output);
    }
    sortInstanceNodePosition() {
      return 0;
    }
  }
  const dashKeys = {
    offset: "stroke-dashoffset",
    array: "stroke-dasharray"
  };
  const camelKeys = {
    offset: "strokeDashoffset",
    array: "strokeDasharray"
  };
  function buildSVGPath(attrs, length, spacing = 1, offset = 0, useDashCase = true) {
    attrs.pathLength = 1;
    const keys = useDashCase ? dashKeys : camelKeys;
    attrs[keys.offset] = `${-offset}`;
    attrs[keys.array] = `${length} ${spacing}`;
  }
  const cssMotionPathProperties = [
    "offsetDistance",
    "offsetPath",
    "offsetRotate",
    "offsetAnchor"
  ];
  function buildSVGAttrs(state, {
    attrX,
    attrY,
    attrScale,
    pathLength,
    pathSpacing = 1,
    pathOffset = 0,
    // This is object creation, which we try to avoid per-frame.
    ...latest
  }, isSVGTag2, transformTemplate, styleProp) {
    buildHTMLStyles(state, latest, transformTemplate);
    if (isSVGTag2) {
      if (state.style.viewBox) {
        state.attrs.viewBox = state.style.viewBox;
      }
      return;
    }
    state.attrs = state.style;
    state.style = {};
    const { attrs, style: style2 } = state;
    if (attrs.transform) {
      style2.transform = attrs.transform;
      delete attrs.transform;
    }
    if (style2.transform || attrs.transformOrigin) {
      style2.transformOrigin = attrs.transformOrigin ?? "50% 50%";
      delete attrs.transformOrigin;
    }
    if (style2.transform) {
      style2.transformBox = styleProp?.transformBox ?? "fill-box";
      delete attrs.transformBox;
    }
    for (const key of cssMotionPathProperties) {
      if (attrs[key] !== void 0) {
        style2[key] = attrs[key];
        delete attrs[key];
      }
    }
    if (attrX !== void 0)
      attrs.x = attrX;
    if (attrY !== void 0)
      attrs.y = attrY;
    if (attrScale !== void 0)
      attrs.scale = attrScale;
    if (pathLength !== void 0) {
      buildSVGPath(attrs, pathLength, pathSpacing, pathOffset, false);
    }
  }
  const camelCaseAttributes = /* @__PURE__ */ new Set([
    "baseFrequency",
    "diffuseConstant",
    "kernelMatrix",
    "kernelUnitLength",
    "keySplines",
    "keyTimes",
    "limitingConeAngle",
    "markerHeight",
    "markerWidth",
    "numOctaves",
    "targetX",
    "targetY",
    "surfaceScale",
    "specularConstant",
    "specularExponent",
    "stdDeviation",
    "tableValues",
    "viewBox",
    "gradientTransform",
    "pathLength",
    "startOffset",
    "textLength",
    "lengthAdjust"
  ]);
  const isSVGTag = (tag) => typeof tag === "string" && tag.toLowerCase() === "svg";
  function renderSVG(element, renderState, _styleProp, projection) {
    renderHTML(element, renderState, void 0, projection);
    for (const key in renderState.attrs) {
      element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key]);
    }
  }
  function scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    const newValues = scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
    for (const key in props) {
      if (isMotionValue(props[key]) || isMotionValue(prevProps[key])) {
        const targetKey = transformPropOrder.indexOf(key) !== -1 ? "attr" + key.charAt(0).toUpperCase() + key.substring(1) : key;
        newValues[targetKey] = props[key];
      }
    }
    return newValues;
  }
  class SVGVisualElement extends DOMVisualElement {
    constructor() {
      super(...arguments);
      this.type = "svg";
      this.isSVGTag = false;
      this.measureInstanceViewportBox = createBox;
    }
    getBaseTargetFromProps(props, key) {
      return props[key];
    }
    readValueFromInstance(instance, key) {
      if (transformProps.has(key)) {
        const defaultType = getDefaultValueType(key);
        return defaultType ? defaultType.default || 0 : 0;
      }
      key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
      return instance.getAttribute(key);
    }
    scrapeMotionValuesFromProps(props, prevProps, visualElement) {
      return scrapeMotionValuesFromProps(props, prevProps, visualElement);
    }
    build(renderState, latestValues, props) {
      buildSVGAttrs(renderState, latestValues, this.isSVGTag, props.transformTemplate, props.style);
    }
    renderInstance(instance, renderState, styleProp, projection) {
      renderSVG(instance, renderState, styleProp, projection);
    }
    mount(instance) {
      this.isSVGTag = isSVGTag(instance.tagName);
      super.mount(instance);
    }
  }
  const numVariantProps = variantProps.length;
  function getVariantContext(visualElement) {
    if (!visualElement)
      return void 0;
    if (!visualElement.isControllingVariants) {
      const context2 = visualElement.parent ? getVariantContext(visualElement.parent) || {} : {};
      if (visualElement.props.initial !== void 0) {
        context2.initial = visualElement.props.initial;
      }
      return context2;
    }
    const context = {};
    for (let i = 0; i < numVariantProps; i++) {
      const name = variantProps[i];
      const prop = visualElement.props[name];
      if (isVariantLabel(prop) || prop === false) {
        context[name] = prop;
      }
    }
    return context;
  }
  function shallowCompare(next2, prev) {
    if (!Array.isArray(prev))
      return false;
    const prevLength = prev.length;
    if (prevLength !== next2.length)
      return false;
    for (let i = 0; i < prevLength; i++) {
      if (prev[i] !== next2[i])
        return false;
    }
    return true;
  }
  const reversePriorityOrder = [...variantPriorityOrder].reverse();
  const numAnimationTypes = variantPriorityOrder.length;
  function createAnimateFunction(visualElement) {
    return (animations) => {
      return Promise.all(animations.map(({ animation, options }) => animateVisualElement(visualElement, animation, options)));
    };
  }
  function createAnimationState(visualElement) {
    let animate = createAnimateFunction(visualElement);
    let state = createState();
    let isInitialRender = true;
    let wasReset = false;
    const buildResolvedTypeValues = (type) => (acc, definition) => {
      const resolved = resolveVariant(visualElement, definition, type === "exit" ? visualElement.presenceContext?.custom : void 0);
      if (resolved) {
        const { transition, transitionEnd, ...target } = resolved;
        acc = { ...acc, ...target, ...transitionEnd };
      }
      return acc;
    };
    function setAnimateFunction(makeAnimator) {
      animate = makeAnimator(visualElement);
    }
    function animateChanges(changedActiveType) {
      const { props } = visualElement;
      const context = getVariantContext(visualElement.parent) || {};
      const animations = [];
      const removedKeys = /* @__PURE__ */ new Set();
      let encounteredKeys = {};
      let removedVariantIndex = Infinity;
      for (let i = 0; i < numAnimationTypes; i++) {
        const type = reversePriorityOrder[i];
        const typeState = state[type];
        const prop = props[type] !== void 0 ? props[type] : context[type];
        const propIsVariant = isVariantLabel(prop);
        const activeDelta = type === changedActiveType ? typeState.isActive : null;
        if (activeDelta === false)
          removedVariantIndex = i;
        let isInherited = prop === context[type] && prop !== props[type] && propIsVariant;
        if (isInherited && (isInitialRender || wasReset) && visualElement.manuallyAnimateOnMount) {
          isInherited = false;
        }
        typeState.protectedKeys = { ...encounteredKeys };
        if (
          // If it isn't active and hasn't *just* been set as inactive
          !typeState.isActive && activeDelta === null || // If we didn't and don't have any defined prop for this animation type
          !prop && !typeState.prevProp || // Or if the prop doesn't define an animation
          isAnimationControls(prop) || typeof prop === "boolean"
        ) {
          continue;
        }
        if (type === "exit" && typeState.isActive && activeDelta !== true) {
          if (typeState.prevResolvedValues) {
            encounteredKeys = {
              ...encounteredKeys,
              ...typeState.prevResolvedValues
            };
          }
          continue;
        }
        const variantDidChange = checkVariantsDidChange(typeState.prevProp, prop);
        let shouldAnimateType = variantDidChange || // If we're making this variant active, we want to always make it active
        type === changedActiveType && typeState.isActive && !isInherited && propIsVariant || // If we removed a higher-priority variant (i is in reverse order)
        i > removedVariantIndex && propIsVariant;
        let handledRemovedValues = false;
        const definitionList = Array.isArray(prop) ? prop : [prop];
        let resolvedValues = definitionList.reduce(buildResolvedTypeValues(type), {});
        if (activeDelta === false)
          resolvedValues = {};
        const { prevResolvedValues = {} } = typeState;
        const allKeys = {
          ...prevResolvedValues,
          ...resolvedValues
        };
        const markToAnimate = (key) => {
          shouldAnimateType = true;
          if (removedKeys.has(key)) {
            handledRemovedValues = true;
            removedKeys.delete(key);
          }
          typeState.needsAnimating[key] = true;
          const motionValue2 = visualElement.getValue(key);
          if (motionValue2)
            motionValue2.liveStyle = false;
        };
        for (const key in allKeys) {
          const next2 = resolvedValues[key];
          const prev = prevResolvedValues[key];
          if (encounteredKeys.hasOwnProperty(key))
            continue;
          let valueHasChanged = false;
          if (isKeyframesTarget(next2) && isKeyframesTarget(prev)) {
            valueHasChanged = !shallowCompare(next2, prev);
          } else {
            valueHasChanged = next2 !== prev;
          }
          if (valueHasChanged) {
            if (next2 !== void 0 && next2 !== null) {
              markToAnimate(key);
            } else {
              removedKeys.add(key);
            }
          } else if (next2 !== void 0 && removedKeys.has(key)) {
            markToAnimate(key);
          } else {
            typeState.protectedKeys[key] = true;
          }
        }
        typeState.prevProp = prop;
        typeState.prevResolvedValues = resolvedValues;
        if (typeState.isActive) {
          encounteredKeys = { ...encounteredKeys, ...resolvedValues };
        }
        if ((isInitialRender || wasReset) && visualElement.blockInitialAnimation) {
          shouldAnimateType = false;
        }
        const willAnimateViaParent = isInherited && variantDidChange;
        const needsAnimating = !willAnimateViaParent || handledRemovedValues;
        if (shouldAnimateType && needsAnimating) {
          animations.push(...definitionList.map((animation) => {
            const options = { type };
            if (typeof animation === "string" && (isInitialRender || wasReset) && !willAnimateViaParent && visualElement.manuallyAnimateOnMount && visualElement.parent) {
              const { parent } = visualElement;
              const parentVariant = resolveVariant(parent, animation);
              if (parent.enteringChildren && parentVariant) {
                const { delayChildren } = parentVariant.transition || {};
                options.delay = calcChildStagger(parent.enteringChildren, visualElement, delayChildren);
              }
            }
            return {
              animation,
              options
            };
          }));
        }
      }
      if (removedKeys.size) {
        const fallbackAnimation = {};
        if (typeof props.initial !== "boolean") {
          const initialTransition = resolveVariant(visualElement, Array.isArray(props.initial) ? props.initial[0] : props.initial);
          if (initialTransition && initialTransition.transition) {
            fallbackAnimation.transition = initialTransition.transition;
          }
        }
        removedKeys.forEach((key) => {
          const fallbackTarget = visualElement.getBaseTarget(key);
          const motionValue2 = visualElement.getValue(key);
          if (motionValue2)
            motionValue2.liveStyle = true;
          fallbackAnimation[key] = fallbackTarget ?? null;
        });
        animations.push({ animation: fallbackAnimation });
      }
      let shouldAnimate = Boolean(animations.length);
      if (isInitialRender && (props.initial === false || props.initial === props.animate) && !visualElement.manuallyAnimateOnMount) {
        shouldAnimate = false;
      }
      isInitialRender = false;
      wasReset = false;
      return shouldAnimate ? animate(animations) : Promise.resolve();
    }
    function setActive(type, isActive) {
      if (state[type].isActive === isActive)
        return Promise.resolve();
      visualElement.variantChildren?.forEach((child) => child.animationState?.setActive(type, isActive));
      state[type].isActive = isActive;
      const animations = animateChanges(type);
      for (const key in state) {
        state[key].protectedKeys = {};
      }
      return animations;
    }
    return {
      animateChanges,
      setActive,
      setAnimateFunction,
      getState: () => state,
      reset: () => {
        state = createState();
        wasReset = true;
      }
    };
  }
  function checkVariantsDidChange(prev, next2) {
    if (typeof next2 === "string") {
      return next2 !== prev;
    } else if (Array.isArray(next2)) {
      return !shallowCompare(next2, prev);
    }
    return false;
  }
  function createTypeState(isActive = false) {
    return {
      isActive,
      protectedKeys: {},
      needsAnimating: {},
      prevResolvedValues: {}
    };
  }
  function createState() {
    return {
      animate: createTypeState(true),
      whileInView: createTypeState(),
      whileHover: createTypeState(),
      whileTap: createTypeState(),
      whileDrag: createTypeState(),
      whileFocus: createTypeState(),
      exit: createTypeState()
    };
  }
  function copyAxisInto(axis, originAxis) {
    axis.min = originAxis.min;
    axis.max = originAxis.max;
  }
  function copyBoxInto(box, originBox) {
    copyAxisInto(box.x, originBox.x);
    copyAxisInto(box.y, originBox.y);
  }
  function copyAxisDeltaInto(delta, originDelta) {
    delta.translate = originDelta.translate;
    delta.scale = originDelta.scale;
    delta.originPoint = originDelta.originPoint;
    delta.origin = originDelta.origin;
  }
  const SCALE_PRECISION = 1e-4;
  const SCALE_MIN = 1 - SCALE_PRECISION;
  const SCALE_MAX = 1 + SCALE_PRECISION;
  const TRANSLATE_PRECISION = 0.01;
  const TRANSLATE_MIN = 0 - TRANSLATE_PRECISION;
  const TRANSLATE_MAX = 0 + TRANSLATE_PRECISION;
  function calcLength(axis) {
    return axis.max - axis.min;
  }
  function isNear(value, target, maxDistance) {
    return Math.abs(value - target) <= maxDistance;
  }
  function calcAxisDelta(delta, source, target, origin = 0.5) {
    delta.origin = origin;
    delta.originPoint = mixNumber$1(source.min, source.max, delta.origin);
    delta.scale = calcLength(target) / calcLength(source);
    delta.translate = mixNumber$1(target.min, target.max, delta.origin) - delta.originPoint;
    if (delta.scale >= SCALE_MIN && delta.scale <= SCALE_MAX || isNaN(delta.scale)) {
      delta.scale = 1;
    }
    if (delta.translate >= TRANSLATE_MIN && delta.translate <= TRANSLATE_MAX || isNaN(delta.translate)) {
      delta.translate = 0;
    }
  }
  function calcBoxDelta(delta, source, target, origin) {
    calcAxisDelta(delta.x, source.x, target.x, origin ? origin.originX : void 0);
    calcAxisDelta(delta.y, source.y, target.y, origin ? origin.originY : void 0);
  }
  function calcRelativeAxis(target, relative, parent, anchor = 0) {
    const anchorPoint = anchor ? mixNumber$1(parent.min, parent.max, anchor) : parent.min;
    target.min = anchorPoint + relative.min;
    target.max = target.min + calcLength(relative);
  }
  function calcRelativeBox(target, relative, parent, anchor) {
    calcRelativeAxis(target.x, relative.x, parent.x, anchor?.x);
    calcRelativeAxis(target.y, relative.y, parent.y, anchor?.y);
  }
  function calcRelativeAxisPosition(target, layout, parent, anchor = 0) {
    const anchorPoint = anchor ? mixNumber$1(parent.min, parent.max, anchor) : parent.min;
    target.min = layout.min - anchorPoint;
    target.max = target.min + calcLength(layout);
  }
  function calcRelativePosition(target, layout, parent, anchor) {
    calcRelativeAxisPosition(target.x, layout.x, parent.x, anchor?.x);
    calcRelativeAxisPosition(target.y, layout.y, parent.y, anchor?.y);
  }
  function removePointDelta(point, translate, scale2, originPoint, boxScale) {
    point -= translate;
    point = scalePoint(point, 1 / scale2, originPoint);
    if (boxScale !== void 0) {
      point = scalePoint(point, 1 / boxScale, originPoint);
    }
    return point;
  }
  function removeAxisDelta(axis, translate = 0, scale2 = 1, origin = 0.5, boxScale, originAxis = axis, sourceAxis = axis) {
    if (percent.test(translate)) {
      translate = parseFloat(translate);
      const relativeProgress = mixNumber$1(sourceAxis.min, sourceAxis.max, translate / 100);
      translate = relativeProgress - sourceAxis.min;
    }
    if (typeof translate !== "number")
      return;
    let originPoint = mixNumber$1(originAxis.min, originAxis.max, origin);
    if (axis === originAxis)
      originPoint -= translate;
    axis.min = removePointDelta(axis.min, translate, scale2, originPoint, boxScale);
    axis.max = removePointDelta(axis.max, translate, scale2, originPoint, boxScale);
  }
  function removeAxisTransforms(axis, transforms, [key, scaleKey, originKey], origin, sourceAxis) {
    removeAxisDelta(axis, transforms[key], transforms[scaleKey], transforms[originKey], transforms.scale, origin, sourceAxis);
  }
  const xKeys = ["x", "scaleX", "originX"];
  const yKeys = ["y", "scaleY", "originY"];
  function removeBoxTransforms(box, transforms, originBox, sourceBox) {
    removeAxisTransforms(box.x, transforms, xKeys, originBox ? originBox.x : void 0, sourceBox ? sourceBox.x : void 0);
    removeAxisTransforms(box.y, transforms, yKeys, originBox ? originBox.y : void 0, sourceBox ? sourceBox.y : void 0);
  }
  function isAxisDeltaZero(delta) {
    return delta.translate === 0 && delta.scale === 1;
  }
  function isDeltaZero(delta) {
    return isAxisDeltaZero(delta.x) && isAxisDeltaZero(delta.y);
  }
  function axisEquals(a, b) {
    return a.min === b.min && a.max === b.max;
  }
  function boxEquals(a, b) {
    return axisEquals(a.x, b.x) && axisEquals(a.y, b.y);
  }
  function axisEqualsRounded(a, b) {
    return Math.round(a.min) === Math.round(b.min) && Math.round(a.max) === Math.round(b.max);
  }
  function boxEqualsRounded(a, b) {
    return axisEqualsRounded(a.x, b.x) && axisEqualsRounded(a.y, b.y);
  }
  function aspectRatio(box) {
    return calcLength(box.x) / calcLength(box.y);
  }
  function axisDeltaEquals(a, b) {
    return a.translate === b.translate && a.scale === b.scale && a.originPoint === b.originPoint;
  }
  function eachAxis(callback) {
    return [callback("x"), callback("y")];
  }
  function buildProjectionTransform(delta, treeScale, latestTransform) {
    let transform2 = "";
    const xTranslate = delta.x.translate / treeScale.x;
    const yTranslate = delta.y.translate / treeScale.y;
    const zTranslate = latestTransform?.z || 0;
    if (xTranslate || yTranslate || zTranslate) {
      transform2 = `translate3d(${xTranslate}px, ${yTranslate}px, ${zTranslate}px) `;
    }
    if (treeScale.x !== 1 || treeScale.y !== 1) {
      transform2 += `scale(${1 / treeScale.x}, ${1 / treeScale.y}) `;
    }
    if (latestTransform) {
      const { transformPerspective, rotate: rotate2, rotateX, rotateY, skewX, skewY } = latestTransform;
      if (transformPerspective)
        transform2 = `perspective(${transformPerspective}px) ${transform2}`;
      if (rotate2)
        transform2 += `rotate(${rotate2}deg) `;
      if (rotateX)
        transform2 += `rotateX(${rotateX}deg) `;
      if (rotateY)
        transform2 += `rotateY(${rotateY}deg) `;
      if (skewX)
        transform2 += `skewX(${skewX}deg) `;
      if (skewY)
        transform2 += `skewY(${skewY}deg) `;
    }
    const elementScaleX = delta.x.scale * treeScale.x;
    const elementScaleY = delta.y.scale * treeScale.y;
    if (elementScaleX !== 1 || elementScaleY !== 1) {
      transform2 += `scale(${elementScaleX}, ${elementScaleY})`;
    }
    return transform2 || "none";
  }
  const borderLabels = [
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderBottomLeftRadius",
    "borderBottomRightRadius"
  ];
  const numBorders = borderLabels.length;
  const asNumber = (value) => typeof value === "string" ? parseFloat(value) : value;
  const isPx = (value) => typeof value === "number" || px.test(value);
  function mixValues(target, follow, lead, progress, shouldCrossfadeOpacity, isOnlyMember) {
    if (shouldCrossfadeOpacity) {
      target.opacity = mixNumber$1(0, lead.opacity ?? 1, easeCrossfadeIn(progress));
      target.opacityExit = mixNumber$1(follow.opacity ?? 1, 0, easeCrossfadeOut(progress));
    } else if (isOnlyMember) {
      target.opacity = mixNumber$1(follow.opacity ?? 1, lead.opacity ?? 1, progress);
    }
    for (let i = 0; i < numBorders; i++) {
      const borderLabel = borderLabels[i];
      let followRadius = getRadius(follow, borderLabel);
      let leadRadius = getRadius(lead, borderLabel);
      if (followRadius === void 0 && leadRadius === void 0)
        continue;
      followRadius || (followRadius = 0);
      leadRadius || (leadRadius = 0);
      const canMix = followRadius === 0 || leadRadius === 0 || isPx(followRadius) === isPx(leadRadius);
      if (canMix) {
        target[borderLabel] = Math.max(mixNumber$1(asNumber(followRadius), asNumber(leadRadius), progress), 0);
        if (percent.test(leadRadius) || percent.test(followRadius)) {
          target[borderLabel] += "%";
        }
      } else {
        target[borderLabel] = leadRadius;
      }
    }
    if (follow.rotate || lead.rotate) {
      target.rotate = mixNumber$1(follow.rotate || 0, lead.rotate || 0, progress);
    }
  }
  function getRadius(values, radiusName) {
    return values[radiusName] !== void 0 ? values[radiusName] : values.borderRadius;
  }
  const easeCrossfadeIn = /* @__PURE__ */ compress(0, 0.5, motionUtils.circOut);
  const easeCrossfadeOut = /* @__PURE__ */ compress(0.5, 0.95, motionUtils.noop);
  function compress(min, max, easing) {
    return (p) => {
      if (p < min)
        return 0;
      if (p > max)
        return 1;
      return easing(motionUtils.progress(min, max, p));
    };
  }
  function animateSingleValue(value, keyframes2, options) {
    const motionValue$1 = isMotionValue(value) ? value : motionValue(value);
    motionValue$1.start(animateMotionValue("", motionValue$1, keyframes2, options));
    return motionValue$1.animation;
  }
  function addDomEvent(target, eventName, handler, options = { passive: true }) {
    target.addEventListener(eventName, handler, options);
    return () => target.removeEventListener(eventName, handler);
  }
  const compareByDepth = (a, b) => a.depth - b.depth;
  class FlatTree {
    constructor() {
      this.children = [];
      this.isDirty = false;
    }
    add(child) {
      motionUtils.addUniqueItem(this.children, child);
      this.isDirty = true;
    }
    remove(child) {
      motionUtils.removeItem(this.children, child);
      this.isDirty = true;
    }
    forEach(callback) {
      this.isDirty && this.children.sort(compareByDepth);
      this.isDirty = false;
      this.children.forEach(callback);
    }
  }
  function delay(callback, timeout) {
    const start2 = time.now();
    const checkElapsed = ({ timestamp }) => {
      const elapsed = timestamp - start2;
      if (elapsed >= timeout) {
        cancelFrame(checkElapsed);
        callback(elapsed - timeout);
      }
    };
    frame.setup(checkElapsed, true);
    return () => cancelFrame(checkElapsed);
  }
  function delayInSeconds(callback, timeout) {
    return delay(callback, motionUtils.secondsToMilliseconds(timeout));
  }
  function resolveMotionValue(value) {
    return isMotionValue(value) ? value.get() : value;
  }
  class NodeStack {
    constructor() {
      this.members = [];
    }
    add(node) {
      motionUtils.addUniqueItem(this.members, node);
      for (let i = this.members.length - 1; i >= 0; i--) {
        const member = this.members[i];
        if (member === node || member === this.lead || member === this.prevLead)
          continue;
        const inst = member.instance;
        if ((!inst || inst.isConnected === false) && !member.snapshot) {
          motionUtils.removeItem(this.members, member);
          member.unmount();
        }
      }
      node.scheduleRender();
    }
    remove(node) {
      motionUtils.removeItem(this.members, node);
      if (node === this.prevLead)
        this.prevLead = void 0;
      if (node === this.lead) {
        const prevLead = this.members[this.members.length - 1];
        if (prevLead)
          this.promote(prevLead);
      }
    }
    relegate(node) {
      for (let i = this.members.indexOf(node) - 1; i >= 0; i--) {
        const member = this.members[i];
        if (member.isPresent !== false && member.instance?.isConnected !== false) {
          this.promote(member);
          return true;
        }
      }
      return false;
    }
    promote(node, preserveFollowOpacity) {
      const prevLead = this.lead;
      if (node === prevLead)
        return;
      this.prevLead = prevLead;
      this.lead = node;
      node.show();
      if (prevLead) {
        prevLead.updateSnapshot();
        node.scheduleRender();
        const { layoutDependency: prevDep } = prevLead.options;
        const { layoutDependency: nextDep } = node.options;
        if (prevDep === void 0 || prevDep !== nextDep) {
          node.resumeFrom = prevLead;
          if (preserveFollowOpacity)
            prevLead.preserveOpacity = true;
          if (prevLead.snapshot) {
            node.snapshot = prevLead.snapshot;
            node.snapshot.latestValues = prevLead.animationValues || prevLead.latestValues;
          }
          if (node.root?.isUpdating)
            node.isLayoutDirty = true;
        }
        if (node.options.crossfade === false)
          prevLead.hide();
      }
    }
    exitAnimationComplete() {
      this.members.forEach((member) => {
        member.options.onExitComplete?.();
        member.resumingFrom?.options.onExitComplete?.();
      });
    }
    scheduleRender() {
      this.members.forEach((member) => member.instance && member.scheduleRender(false));
    }
    removeLeadSnapshot() {
      if (this.lead?.snapshot)
        this.lead.snapshot = void 0;
    }
  }
  const globalProjectionState = {
    /**
     * Global flag as to whether the tree has animated since the last time
     * we resized the window
     */
    hasAnimatedSinceResize: true,
    /**
     * We set this to true once, on the first update. Any nodes added to the tree beyond that
     * update will be given a `data-projection-id` attribute.
     */
    hasEverUpdated: false
  };
  const metrics = {
    nodes: 0,
    calculatedTargetDeltas: 0,
    calculatedProjections: 0
  };
  const transformAxes = ["", "X", "Y", "Z"];
  const animationTarget = 1e3;
  let id = 0;
  function resetDistortingTransform(key, visualElement, values, sharedAnimationValues) {
    const { latestValues } = visualElement;
    if (latestValues[key]) {
      values[key] = latestValues[key];
      visualElement.setStaticValue(key, 0);
      if (sharedAnimationValues) {
        sharedAnimationValues[key] = 0;
      }
    }
  }
  function cancelTreeOptimisedTransformAnimations(projectionNode) {
    projectionNode.hasCheckedOptimisedAppear = true;
    if (projectionNode.root === projectionNode)
      return;
    const { visualElement } = projectionNode.options;
    if (!visualElement)
      return;
    const appearId = getOptimisedAppearId(visualElement);
    if (window.MotionHasOptimisedAnimation(appearId, "transform")) {
      const { layout, layoutId } = projectionNode.options;
      window.MotionCancelOptimisedAnimation(appearId, "transform", frame, !(layout || layoutId));
    }
    const { parent } = projectionNode;
    if (parent && !parent.hasCheckedOptimisedAppear) {
      cancelTreeOptimisedTransformAnimations(parent);
    }
  }
  function createProjectionNode({ attachResizeListener, defaultParent, measureScroll, checkIsScrollRoot, resetTransform }) {
    return class ProjectionNode {
      constructor(latestValues = {}, parent = defaultParent?.()) {
        this.id = id++;
        this.animationId = 0;
        this.animationCommitId = 0;
        this.children = /* @__PURE__ */ new Set();
        this.options = {};
        this.isTreeAnimating = false;
        this.isAnimationBlocked = false;
        this.isLayoutDirty = false;
        this.isProjectionDirty = false;
        this.isSharedProjectionDirty = false;
        this.isTransformDirty = false;
        this.updateManuallyBlocked = false;
        this.updateBlockedByResize = false;
        this.isUpdating = false;
        this.isSVG = false;
        this.needsReset = false;
        this.shouldResetTransform = false;
        this.hasCheckedOptimisedAppear = false;
        this.treeScale = { x: 1, y: 1 };
        this.eventHandlers = /* @__PURE__ */ new Map();
        this.hasTreeAnimated = false;
        this.layoutVersion = 0;
        this.updateScheduled = false;
        this.scheduleUpdate = () => this.update();
        this.projectionUpdateScheduled = false;
        this.checkUpdateFailed = () => {
          if (this.isUpdating) {
            this.isUpdating = false;
            this.clearAllSnapshots();
          }
        };
        this.updateProjection = () => {
          this.projectionUpdateScheduled = false;
          if (statsBuffer.value) {
            metrics.nodes = metrics.calculatedTargetDeltas = metrics.calculatedProjections = 0;
          }
          this.nodes.forEach(propagateDirtyNodes);
          this.nodes.forEach(resolveTargetDelta);
          this.nodes.forEach(calcProjection);
          this.nodes.forEach(cleanDirtyNodes);
          if (statsBuffer.addProjectionMetrics) {
            statsBuffer.addProjectionMetrics(metrics);
          }
        };
        this.resolvedRelativeTargetAt = 0;
        this.linkedParentVersion = 0;
        this.hasProjected = false;
        this.isVisible = true;
        this.animationProgress = 0;
        this.sharedNodes = /* @__PURE__ */ new Map();
        this.latestValues = latestValues;
        this.root = parent ? parent.root || parent : this;
        this.path = parent ? [...parent.path, parent] : [];
        this.parent = parent;
        this.depth = parent ? parent.depth + 1 : 0;
        for (let i = 0; i < this.path.length; i++) {
          this.path[i].shouldResetTransform = true;
        }
        if (this.root === this)
          this.nodes = new FlatTree();
      }
      addEventListener(name, handler) {
        if (!this.eventHandlers.has(name)) {
          this.eventHandlers.set(name, new motionUtils.SubscriptionManager());
        }
        return this.eventHandlers.get(name).add(handler);
      }
      notifyListeners(name, ...args) {
        const subscriptionManager = this.eventHandlers.get(name);
        subscriptionManager && subscriptionManager.notify(...args);
      }
      hasListeners(name) {
        return this.eventHandlers.has(name);
      }
      /**
       * Lifecycles
       */
      mount(instance) {
        if (this.instance)
          return;
        this.isSVG = isSVGElement(instance) && !isSVGSVGElement(instance);
        this.instance = instance;
        const { layoutId, layout, visualElement } = this.options;
        if (visualElement && !visualElement.current) {
          visualElement.mount(instance);
        }
        this.root.nodes.add(this);
        this.parent && this.parent.children.add(this);
        if (this.root.hasTreeAnimated && (layout || layoutId)) {
          this.isLayoutDirty = true;
        }
        if (attachResizeListener) {
          let cancelDelay;
          let innerWidth = 0;
          const resizeUnblockUpdate = () => this.root.updateBlockedByResize = false;
          frame.read(() => {
            innerWidth = window.innerWidth;
          });
          attachResizeListener(instance, () => {
            const newInnerWidth = window.innerWidth;
            if (newInnerWidth === innerWidth)
              return;
            innerWidth = newInnerWidth;
            this.root.updateBlockedByResize = true;
            cancelDelay && cancelDelay();
            cancelDelay = delay(resizeUnblockUpdate, 250);
            if (globalProjectionState.hasAnimatedSinceResize) {
              globalProjectionState.hasAnimatedSinceResize = false;
              this.nodes.forEach(finishAnimation);
            }
          });
        }
        if (layoutId) {
          this.root.registerSharedNode(layoutId, this);
        }
        if (this.options.animate !== false && visualElement && (layoutId || layout)) {
          this.addEventListener("didUpdate", ({ delta, hasLayoutChanged, hasRelativeLayoutChanged, layout: newLayout }) => {
            if (this.isTreeAnimationBlocked()) {
              this.target = void 0;
              this.relativeTarget = void 0;
              return;
            }
            const layoutTransition = this.options.transition || visualElement.getDefaultTransition() || defaultLayoutTransition;
            const { onLayoutAnimationStart, onLayoutAnimationComplete } = visualElement.getProps();
            const hasTargetChanged = !this.targetLayout || !boxEqualsRounded(this.targetLayout, newLayout);
            const hasOnlyRelativeTargetChanged = !hasLayoutChanged && hasRelativeLayoutChanged;
            if (this.options.layoutRoot || this.resumeFrom || hasOnlyRelativeTargetChanged || hasLayoutChanged && (hasTargetChanged || !this.currentAnimation)) {
              if (this.resumeFrom) {
                this.resumingFrom = this.resumeFrom;
                this.resumingFrom.resumingFrom = void 0;
              }
              const animationOptions = {
                ...getValueTransition(layoutTransition, "layout"),
                onPlay: onLayoutAnimationStart,
                onComplete: onLayoutAnimationComplete
              };
              if (visualElement.shouldReduceMotion || this.options.layoutRoot) {
                animationOptions.delay = 0;
                animationOptions.type = false;
              }
              this.startAnimation(animationOptions);
              this.setAnimationOrigin(delta, hasOnlyRelativeTargetChanged);
            } else {
              if (!hasLayoutChanged) {
                finishAnimation(this);
              }
              if (this.isLead() && this.options.onExitComplete) {
                this.options.onExitComplete();
              }
            }
            this.targetLayout = newLayout;
          });
        }
      }
      unmount() {
        this.options.layoutId && this.willUpdate();
        this.root.nodes.remove(this);
        const stack = this.getStack();
        stack && stack.remove(this);
        this.parent && this.parent.children.delete(this);
        this.instance = void 0;
        this.eventHandlers.clear();
        cancelFrame(this.updateProjection);
      }
      // only on the root
      blockUpdate() {
        this.updateManuallyBlocked = true;
      }
      unblockUpdate() {
        this.updateManuallyBlocked = false;
      }
      isUpdateBlocked() {
        return this.updateManuallyBlocked || this.updateBlockedByResize;
      }
      isTreeAnimationBlocked() {
        return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || false;
      }
      // Note: currently only running on root node
      startUpdate() {
        if (this.isUpdateBlocked())
          return;
        this.isUpdating = true;
        this.nodes && this.nodes.forEach(resetSkewAndRotation);
        this.animationId++;
      }
      getTransformTemplate() {
        const { visualElement } = this.options;
        return visualElement && visualElement.getProps().transformTemplate;
      }
      willUpdate(shouldNotifyListeners = true) {
        this.root.hasTreeAnimated = true;
        if (this.root.isUpdateBlocked()) {
          this.options.onExitComplete && this.options.onExitComplete();
          return;
        }
        if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear) {
          cancelTreeOptimisedTransformAnimations(this);
        }
        !this.root.isUpdating && this.root.startUpdate();
        if (this.isLayoutDirty)
          return;
        this.isLayoutDirty = true;
        for (let i = 0; i < this.path.length; i++) {
          const node = this.path[i];
          node.shouldResetTransform = true;
          if (typeof node.latestValues.x === "string" || typeof node.latestValues.y === "string") {
            node.isLayoutDirty = true;
          }
          node.updateScroll("snapshot");
          if (node.options.layoutRoot) {
            node.willUpdate(false);
          }
        }
        const { layoutId, layout } = this.options;
        if (layoutId === void 0 && !layout)
          return;
        const transformTemplate = this.getTransformTemplate();
        this.prevTransformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
        this.updateSnapshot();
        shouldNotifyListeners && this.notifyListeners("willUpdate");
      }
      update() {
        this.updateScheduled = false;
        const updateWasBlocked = this.isUpdateBlocked();
        if (updateWasBlocked) {
          const wasBlockedByResize = this.updateBlockedByResize;
          this.unblockUpdate();
          this.updateBlockedByResize = false;
          this.clearAllSnapshots();
          if (wasBlockedByResize) {
            this.nodes.forEach(forceLayoutMeasure);
          }
          this.nodes.forEach(clearMeasurements);
          return;
        }
        if (this.animationId <= this.animationCommitId) {
          this.nodes.forEach(clearIsLayoutDirty);
          return;
        }
        this.animationCommitId = this.animationId;
        if (!this.isUpdating) {
          this.nodes.forEach(clearIsLayoutDirty);
        } else {
          this.isUpdating = false;
          this.nodes.forEach(ensureDraggedNodesSnapshotted);
          this.nodes.forEach(resetTransformStyle);
          this.nodes.forEach(updateLayout);
          this.nodes.forEach(notifyLayoutUpdate);
        }
        this.clearAllSnapshots();
        const now2 = time.now();
        frameData.delta = motionUtils.clamp(0, 1e3 / 60, now2 - frameData.timestamp);
        frameData.timestamp = now2;
        frameData.isProcessing = true;
        frameSteps.update.process(frameData);
        frameSteps.preRender.process(frameData);
        frameSteps.render.process(frameData);
        frameData.isProcessing = false;
      }
      didUpdate() {
        if (!this.updateScheduled) {
          this.updateScheduled = true;
          microtask.read(this.scheduleUpdate);
        }
      }
      clearAllSnapshots() {
        this.nodes.forEach(clearSnapshot);
        this.sharedNodes.forEach(removeLeadSnapshots);
      }
      scheduleUpdateProjection() {
        if (!this.projectionUpdateScheduled) {
          this.projectionUpdateScheduled = true;
          frame.preRender(this.updateProjection, false, true);
        }
      }
      scheduleCheckAfterUnmount() {
        frame.postRender(() => {
          if (this.isLayoutDirty) {
            this.root.didUpdate();
          } else {
            this.root.checkUpdateFailed();
          }
        });
      }
      /**
       * Update measurements
       */
      updateSnapshot() {
        if (this.snapshot || !this.instance)
          return;
        this.snapshot = this.measure();
        if (this.snapshot && !calcLength(this.snapshot.measuredBox.x) && !calcLength(this.snapshot.measuredBox.y)) {
          this.snapshot = void 0;
        }
      }
      updateLayout() {
        if (!this.instance)
          return;
        this.updateScroll();
        if (!(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty) {
          return;
        }
        if (this.resumeFrom && !this.resumeFrom.instance) {
          for (let i = 0; i < this.path.length; i++) {
            const node = this.path[i];
            node.updateScroll();
          }
        }
        const prevLayout = this.layout;
        this.layout = this.measure(false);
        this.layoutVersion++;
        if (!this.layoutCorrected)
          this.layoutCorrected = createBox();
        this.isLayoutDirty = false;
        this.projectionDelta = void 0;
        this.notifyListeners("measure", this.layout.layoutBox);
        const { visualElement } = this.options;
        visualElement && visualElement.notify("LayoutMeasure", this.layout.layoutBox, prevLayout ? prevLayout.layoutBox : void 0);
      }
      updateScroll(phase = "measure") {
        let needsMeasurement = Boolean(this.options.layoutScroll && this.instance);
        if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === phase) {
          needsMeasurement = false;
        }
        if (needsMeasurement && this.instance) {
          const isRoot = checkIsScrollRoot(this.instance);
          this.scroll = {
            animationId: this.root.animationId,
            phase,
            isRoot,
            offset: measureScroll(this.instance),
            wasRoot: this.scroll ? this.scroll.isRoot : isRoot
          };
        }
      }
      resetTransform() {
        if (!resetTransform)
          return;
        const isResetRequested = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout;
        const hasProjection = this.projectionDelta && !isDeltaZero(this.projectionDelta);
        const transformTemplate = this.getTransformTemplate();
        const transformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
        const transformTemplateHasChanged = transformTemplateValue !== this.prevTransformTemplateValue;
        if (isResetRequested && this.instance && (hasProjection || hasTransform(this.latestValues) || transformTemplateHasChanged)) {
          resetTransform(this.instance, transformTemplateValue);
          this.shouldResetTransform = false;
          this.scheduleRender();
        }
      }
      measure(removeTransform = true) {
        const pageBox = this.measurePageBox();
        let layoutBox = this.removeElementScroll(pageBox);
        if (removeTransform) {
          layoutBox = this.removeTransform(layoutBox);
        }
        roundBox(layoutBox);
        return {
          animationId: this.root.animationId,
          measuredBox: pageBox,
          layoutBox,
          latestValues: {},
          source: this.id
        };
      }
      measurePageBox() {
        const { visualElement } = this.options;
        if (!visualElement)
          return createBox();
        const box = visualElement.measureViewportBox();
        const wasInScrollRoot = this.scroll?.wasRoot || this.path.some(checkNodeWasScrollRoot);
        if (!wasInScrollRoot) {
          const { scroll } = this.root;
          if (scroll) {
            translateAxis(box.x, scroll.offset.x);
            translateAxis(box.y, scroll.offset.y);
          }
        }
        return box;
      }
      removeElementScroll(box) {
        const boxWithoutScroll = createBox();
        copyBoxInto(boxWithoutScroll, box);
        if (this.scroll?.wasRoot) {
          return boxWithoutScroll;
        }
        for (let i = 0; i < this.path.length; i++) {
          const node = this.path[i];
          const { scroll, options } = node;
          if (node !== this.root && scroll && options.layoutScroll) {
            if (scroll.wasRoot) {
              copyBoxInto(boxWithoutScroll, box);
            }
            translateAxis(boxWithoutScroll.x, scroll.offset.x);
            translateAxis(boxWithoutScroll.y, scroll.offset.y);
          }
        }
        return boxWithoutScroll;
      }
      applyTransform(box, transformOnly = false, output) {
        const withTransforms = output || createBox();
        copyBoxInto(withTransforms, box);
        for (let i = 0; i < this.path.length; i++) {
          const node = this.path[i];
          if (!transformOnly && node.options.layoutScroll && node.scroll && node !== node.root) {
            translateAxis(withTransforms.x, -node.scroll.offset.x);
            translateAxis(withTransforms.y, -node.scroll.offset.y);
          }
          if (!hasTransform(node.latestValues))
            continue;
          transformBox(withTransforms, node.latestValues, node.layout?.layoutBox);
        }
        if (hasTransform(this.latestValues)) {
          transformBox(withTransforms, this.latestValues, this.layout?.layoutBox);
        }
        return withTransforms;
      }
      removeTransform(box) {
        const boxWithoutTransform = createBox();
        copyBoxInto(boxWithoutTransform, box);
        for (let i = 0; i < this.path.length; i++) {
          const node = this.path[i];
          if (!hasTransform(node.latestValues))
            continue;
          let sourceBox;
          if (node.instance) {
            hasScale(node.latestValues) && node.updateSnapshot();
            sourceBox = createBox();
            copyBoxInto(sourceBox, node.measurePageBox());
          }
          removeBoxTransforms(boxWithoutTransform, node.latestValues, node.snapshot?.layoutBox, sourceBox);
        }
        if (hasTransform(this.latestValues)) {
          removeBoxTransforms(boxWithoutTransform, this.latestValues);
        }
        return boxWithoutTransform;
      }
      setTargetDelta(delta) {
        this.targetDelta = delta;
        this.root.scheduleUpdateProjection();
        this.isProjectionDirty = true;
      }
      setOptions(options) {
        this.options = {
          ...this.options,
          ...options,
          crossfade: options.crossfade !== void 0 ? options.crossfade : true
        };
      }
      clearMeasurements() {
        this.scroll = void 0;
        this.layout = void 0;
        this.snapshot = void 0;
        this.prevTransformTemplateValue = void 0;
        this.targetDelta = void 0;
        this.target = void 0;
        this.isLayoutDirty = false;
      }
      forceRelativeParentToResolveTarget() {
        if (!this.relativeParent)
          return;
        if (this.relativeParent.resolvedRelativeTargetAt !== frameData.timestamp) {
          this.relativeParent.resolveTargetDelta(true);
        }
      }
      resolveTargetDelta(forceRecalculation = false) {
        const lead = this.getLead();
        this.isProjectionDirty || (this.isProjectionDirty = lead.isProjectionDirty);
        this.isTransformDirty || (this.isTransformDirty = lead.isTransformDirty);
        this.isSharedProjectionDirty || (this.isSharedProjectionDirty = lead.isSharedProjectionDirty);
        const isShared = Boolean(this.resumingFrom) || this !== lead;
        const canSkip = !(forceRecalculation || isShared && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize);
        if (canSkip)
          return;
        const { layout, layoutId } = this.options;
        if (!this.layout || !(layout || layoutId))
          return;
        this.resolvedRelativeTargetAt = frameData.timestamp;
        const relativeParent = this.getClosestProjectingParent();
        if (relativeParent && this.linkedParentVersion !== relativeParent.layoutVersion && !relativeParent.options.layoutRoot) {
          this.removeRelativeTarget();
        }
        if (!this.targetDelta && !this.relativeTarget) {
          if (this.options.layoutAnchor !== false && relativeParent && relativeParent.layout) {
            this.createRelativeTarget(relativeParent, this.layout.layoutBox, relativeParent.layout.layoutBox);
          } else {
            this.removeRelativeTarget();
          }
        }
        if (!this.relativeTarget && !this.targetDelta)
          return;
        if (!this.target) {
          this.target = createBox();
          this.targetWithTransforms = createBox();
        }
        if (this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target) {
          this.forceRelativeParentToResolveTarget();
          calcRelativeBox(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0);
        } else if (this.targetDelta) {
          if (Boolean(this.resumingFrom)) {
            this.applyTransform(this.layout.layoutBox, false, this.target);
          } else {
            copyBoxInto(this.target, this.layout.layoutBox);
          }
          applyBoxDelta(this.target, this.targetDelta);
        } else {
          copyBoxInto(this.target, this.layout.layoutBox);
        }
        if (this.attemptToResolveRelativeTarget) {
          this.attemptToResolveRelativeTarget = false;
          if (this.options.layoutAnchor !== false && relativeParent && Boolean(relativeParent.resumingFrom) === Boolean(this.resumingFrom) && !relativeParent.options.layoutScroll && relativeParent.target && this.animationProgress !== 1) {
            this.createRelativeTarget(relativeParent, this.target, relativeParent.target);
          } else {
            this.relativeParent = this.relativeTarget = void 0;
          }
        }
        if (statsBuffer.value) {
          metrics.calculatedTargetDeltas++;
        }
      }
      getClosestProjectingParent() {
        if (!this.parent || hasScale(this.parent.latestValues) || has2DTranslate(this.parent.latestValues)) {
          return void 0;
        }
        if (this.parent.isProjecting()) {
          return this.parent;
        } else {
          return this.parent.getClosestProjectingParent();
        }
      }
      isProjecting() {
        return Boolean((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
      }
      createRelativeTarget(relativeParent, layout, parentLayout) {
        this.relativeParent = relativeParent;
        this.linkedParentVersion = relativeParent.layoutVersion;
        this.forceRelativeParentToResolveTarget();
        this.relativeTarget = createBox();
        this.relativeTargetOrigin = createBox();
        calcRelativePosition(this.relativeTargetOrigin, layout, parentLayout, this.options.layoutAnchor || void 0);
        copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
      }
      removeRelativeTarget() {
        this.relativeParent = this.relativeTarget = void 0;
      }
      calcProjection() {
        const lead = this.getLead();
        const isShared = Boolean(this.resumingFrom) || this !== lead;
        let canSkip = true;
        if (this.isProjectionDirty || this.parent?.isProjectionDirty) {
          canSkip = false;
        }
        if (isShared && (this.isSharedProjectionDirty || this.isTransformDirty)) {
          canSkip = false;
        }
        if (this.resolvedRelativeTargetAt === frameData.timestamp) {
          canSkip = false;
        }
        if (canSkip)
          return;
        const { layout, layoutId } = this.options;
        this.isTreeAnimating = Boolean(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation);
        if (!this.isTreeAnimating) {
          this.targetDelta = this.relativeTarget = void 0;
        }
        if (!this.layout || !(layout || layoutId))
          return;
        copyBoxInto(this.layoutCorrected, this.layout.layoutBox);
        const prevTreeScaleX = this.treeScale.x;
        const prevTreeScaleY = this.treeScale.y;
        applyTreeDeltas(this.layoutCorrected, this.treeScale, this.path, isShared);
        if (lead.layout && !lead.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1)) {
          lead.target = lead.layout.layoutBox;
          lead.targetWithTransforms = createBox();
        }
        const { target } = lead;
        if (!target) {
          if (this.prevProjectionDelta) {
            this.createProjectionDeltas();
            this.scheduleRender();
          }
          return;
        }
        if (!this.projectionDelta || !this.prevProjectionDelta) {
          this.createProjectionDeltas();
        } else {
          copyAxisDeltaInto(this.prevProjectionDelta.x, this.projectionDelta.x);
          copyAxisDeltaInto(this.prevProjectionDelta.y, this.projectionDelta.y);
        }
        calcBoxDelta(this.projectionDelta, this.layoutCorrected, target, this.latestValues);
        if (this.treeScale.x !== prevTreeScaleX || this.treeScale.y !== prevTreeScaleY || !axisDeltaEquals(this.projectionDelta.x, this.prevProjectionDelta.x) || !axisDeltaEquals(this.projectionDelta.y, this.prevProjectionDelta.y)) {
          this.hasProjected = true;
          this.scheduleRender();
          this.notifyListeners("projectionUpdate", target);
        }
        if (statsBuffer.value) {
          metrics.calculatedProjections++;
        }
      }
      hide() {
        this.isVisible = false;
      }
      show() {
        this.isVisible = true;
      }
      scheduleRender(notifyAll2 = true) {
        this.options.visualElement?.scheduleRender();
        if (notifyAll2) {
          const stack = this.getStack();
          stack && stack.scheduleRender();
        }
        if (this.resumingFrom && !this.resumingFrom.instance) {
          this.resumingFrom = void 0;
        }
      }
      createProjectionDeltas() {
        this.prevProjectionDelta = createDelta();
        this.projectionDelta = createDelta();
        this.projectionDeltaWithTransform = createDelta();
      }
      setAnimationOrigin(delta, hasOnlyRelativeTargetChanged = false) {
        const snapshot = this.snapshot;
        const snapshotLatestValues = snapshot ? snapshot.latestValues : {};
        const mixedValues = { ...this.latestValues };
        const targetDelta = createDelta();
        if (!this.relativeParent || !this.relativeParent.options.layoutRoot) {
          this.relativeTarget = this.relativeTargetOrigin = void 0;
        }
        this.attemptToResolveRelativeTarget = !hasOnlyRelativeTargetChanged;
        const relativeLayout = createBox();
        const snapshotSource = snapshot ? snapshot.source : void 0;
        const layoutSource = this.layout ? this.layout.source : void 0;
        const isSharedLayoutAnimation = snapshotSource !== layoutSource;
        const stack = this.getStack();
        const isOnlyMember = !stack || stack.members.length <= 1;
        const shouldCrossfadeOpacity = Boolean(isSharedLayoutAnimation && !isOnlyMember && this.options.crossfade === true && !this.path.some(hasOpacityCrossfade));
        this.animationProgress = 0;
        let prevRelativeTarget;
        this.mixTargetDelta = (latest) => {
          const progress = latest / 1e3;
          mixAxisDelta(targetDelta.x, delta.x, progress);
          mixAxisDelta(targetDelta.y, delta.y, progress);
          this.setTargetDelta(targetDelta);
          if (this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout) {
            calcRelativePosition(relativeLayout, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0);
            mixBox(this.relativeTarget, this.relativeTargetOrigin, relativeLayout, progress);
            if (prevRelativeTarget && boxEquals(this.relativeTarget, prevRelativeTarget)) {
              this.isProjectionDirty = false;
            }
            if (!prevRelativeTarget)
              prevRelativeTarget = createBox();
            copyBoxInto(prevRelativeTarget, this.relativeTarget);
          }
          if (isSharedLayoutAnimation) {
            this.animationValues = mixedValues;
            mixValues(mixedValues, snapshotLatestValues, this.latestValues, progress, shouldCrossfadeOpacity, isOnlyMember);
          }
          this.root.scheduleUpdateProjection();
          this.scheduleRender();
          this.animationProgress = progress;
        };
        this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
      }
      startAnimation(options) {
        this.notifyListeners("animationStart");
        this.currentAnimation?.stop();
        this.resumingFrom?.currentAnimation?.stop();
        if (this.pendingAnimation) {
          cancelFrame(this.pendingAnimation);
          this.pendingAnimation = void 0;
        }
        this.pendingAnimation = frame.update(() => {
          globalProjectionState.hasAnimatedSinceResize = true;
          activeAnimations.layout++;
          this.motionValue || (this.motionValue = motionValue(0));
          this.motionValue.jump(0, false);
          this.currentAnimation = animateSingleValue(this.motionValue, [0, 1e3], {
            ...options,
            velocity: 0,
            isSync: true,
            onUpdate: (latest) => {
              this.mixTargetDelta(latest);
              options.onUpdate && options.onUpdate(latest);
            },
            onStop: () => {
              activeAnimations.layout--;
            },
            onComplete: () => {
              activeAnimations.layout--;
              options.onComplete && options.onComplete();
              this.completeAnimation();
            }
          });
          if (this.resumingFrom) {
            this.resumingFrom.currentAnimation = this.currentAnimation;
          }
          this.pendingAnimation = void 0;
        });
      }
      completeAnimation() {
        if (this.resumingFrom) {
          this.resumingFrom.currentAnimation = void 0;
          this.resumingFrom.preserveOpacity = void 0;
        }
        const stack = this.getStack();
        stack && stack.exitAnimationComplete();
        this.resumingFrom = this.currentAnimation = this.animationValues = void 0;
        this.notifyListeners("animationComplete");
      }
      finishAnimation() {
        if (this.currentAnimation) {
          this.mixTargetDelta && this.mixTargetDelta(animationTarget);
          this.currentAnimation.stop();
        }
        this.completeAnimation();
      }
      applyTransformsToTarget() {
        const lead = this.getLead();
        let { targetWithTransforms, target, layout, latestValues } = lead;
        if (!targetWithTransforms || !target || !layout)
          return;
        if (this !== lead && this.layout && layout && shouldAnimatePositionOnly(this.options.animationType, this.layout.layoutBox, layout.layoutBox)) {
          target = this.target || createBox();
          const xLength = calcLength(this.layout.layoutBox.x);
          target.x.min = lead.target.x.min;
          target.x.max = target.x.min + xLength;
          const yLength = calcLength(this.layout.layoutBox.y);
          target.y.min = lead.target.y.min;
          target.y.max = target.y.min + yLength;
        }
        copyBoxInto(targetWithTransforms, target);
        transformBox(targetWithTransforms, latestValues);
        calcBoxDelta(this.projectionDeltaWithTransform, this.layoutCorrected, targetWithTransforms, latestValues);
      }
      registerSharedNode(layoutId, node) {
        if (!this.sharedNodes.has(layoutId)) {
          this.sharedNodes.set(layoutId, new NodeStack());
        }
        const stack = this.sharedNodes.get(layoutId);
        stack.add(node);
        const config = node.options.initialPromotionConfig;
        node.promote({
          transition: config ? config.transition : void 0,
          preserveFollowOpacity: config && config.shouldPreserveFollowOpacity ? config.shouldPreserveFollowOpacity(node) : void 0
        });
      }
      isLead() {
        const stack = this.getStack();
        return stack ? stack.lead === this : true;
      }
      getLead() {
        const { layoutId } = this.options;
        return layoutId ? this.getStack()?.lead || this : this;
      }
      getPrevLead() {
        const { layoutId } = this.options;
        return layoutId ? this.getStack()?.prevLead : void 0;
      }
      getStack() {
        const { layoutId } = this.options;
        if (layoutId)
          return this.root.sharedNodes.get(layoutId);
      }
      promote({ needsReset, transition, preserveFollowOpacity } = {}) {
        const stack = this.getStack();
        if (stack)
          stack.promote(this, preserveFollowOpacity);
        if (needsReset) {
          this.projectionDelta = void 0;
          this.needsReset = true;
        }
        if (transition)
          this.setOptions({ transition });
      }
      relegate() {
        const stack = this.getStack();
        if (stack) {
          return stack.relegate(this);
        } else {
          return false;
        }
      }
      resetSkewAndRotation() {
        const { visualElement } = this.options;
        if (!visualElement)
          return;
        let hasDistortingTransform = false;
        const { latestValues } = visualElement;
        if (latestValues.z || latestValues.rotate || latestValues.rotateX || latestValues.rotateY || latestValues.rotateZ || latestValues.skewX || latestValues.skewY) {
          hasDistortingTransform = true;
        }
        if (!hasDistortingTransform)
          return;
        const resetValues = {};
        if (latestValues.z) {
          resetDistortingTransform("z", visualElement, resetValues, this.animationValues);
        }
        for (let i = 0; i < transformAxes.length; i++) {
          resetDistortingTransform(`rotate${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
          resetDistortingTransform(`skew${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
        }
        visualElement.render();
        for (const key in resetValues) {
          visualElement.setStaticValue(key, resetValues[key]);
          if (this.animationValues) {
            this.animationValues[key] = resetValues[key];
          }
        }
        visualElement.scheduleRender();
      }
      applyProjectionStyles(targetStyle, styleProp) {
        if (!this.instance || this.isSVG)
          return;
        if (!this.isVisible) {
          targetStyle.visibility = "hidden";
          return;
        }
        const transformTemplate = this.getTransformTemplate();
        if (this.needsReset) {
          this.needsReset = false;
          targetStyle.visibility = "";
          targetStyle.opacity = "";
          targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || "";
          targetStyle.transform = transformTemplate ? transformTemplate(this.latestValues, "") : "none";
          return;
        }
        const lead = this.getLead();
        if (!this.projectionDelta || !this.layout || !lead.target) {
          if (this.options.layoutId) {
            targetStyle.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1;
            targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || "";
          }
          if (this.hasProjected && !hasTransform(this.latestValues)) {
            targetStyle.transform = transformTemplate ? transformTemplate({}, "") : "none";
            this.hasProjected = false;
          }
          return;
        }
        targetStyle.visibility = "";
        const valuesToRender = lead.animationValues || lead.latestValues;
        this.applyTransformsToTarget();
        let transform2 = buildProjectionTransform(this.projectionDeltaWithTransform, this.treeScale, valuesToRender);
        if (transformTemplate) {
          transform2 = transformTemplate(valuesToRender, transform2);
        }
        targetStyle.transform = transform2;
        const { x, y } = this.projectionDelta;
        targetStyle.transformOrigin = `${x.origin * 100}% ${y.origin * 100}% 0`;
        if (lead.animationValues) {
          targetStyle.opacity = lead === this ? valuesToRender.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : valuesToRender.opacityExit;
        } else {
          targetStyle.opacity = lead === this ? valuesToRender.opacity !== void 0 ? valuesToRender.opacity : "" : valuesToRender.opacityExit !== void 0 ? valuesToRender.opacityExit : 0;
        }
        for (const key in scaleCorrectors) {
          if (valuesToRender[key] === void 0)
            continue;
          const { correct, applyTo, isCSSVariable } = scaleCorrectors[key];
          const corrected = transform2 === "none" ? valuesToRender[key] : correct(valuesToRender[key], lead);
          if (applyTo) {
            const num = applyTo.length;
            for (let i = 0; i < num; i++) {
              targetStyle[applyTo[i]] = corrected;
            }
          } else {
            if (isCSSVariable) {
              this.options.visualElement.renderState.vars[key] = corrected;
            } else {
              targetStyle[key] = corrected;
            }
          }
        }
        if (this.options.layoutId) {
          targetStyle.pointerEvents = lead === this ? resolveMotionValue(styleProp?.pointerEvents) || "" : "none";
        }
      }
      clearSnapshot() {
        this.resumeFrom = this.snapshot = void 0;
      }
      // Only run on root
      resetTree() {
        this.root.nodes.forEach((node) => node.currentAnimation?.stop());
        this.root.nodes.forEach(clearMeasurements);
        this.root.sharedNodes.clear();
      }
    };
  }
  function updateLayout(node) {
    node.updateLayout();
  }
  function notifyLayoutUpdate(node) {
    const snapshot = node.resumeFrom?.snapshot || node.snapshot;
    if (node.isLead() && node.layout && snapshot && node.hasListeners("didUpdate")) {
      const { layoutBox: layout, measuredBox: measuredLayout } = node.layout;
      const { animationType } = node.options;
      const isShared = snapshot.source !== node.layout.source;
      if (animationType === "size") {
        eachAxis((axis) => {
          const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
          const length = calcLength(axisSnapshot);
          axisSnapshot.min = layout[axis].min;
          axisSnapshot.max = axisSnapshot.min + length;
        });
      } else if (animationType === "x" || animationType === "y") {
        const snapAxis = animationType === "x" ? "y" : "x";
        copyAxisInto(isShared ? snapshot.measuredBox[snapAxis] : snapshot.layoutBox[snapAxis], layout[snapAxis]);
      } else if (shouldAnimatePositionOnly(animationType, snapshot.layoutBox, layout)) {
        eachAxis((axis) => {
          const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
          const length = calcLength(layout[axis]);
          axisSnapshot.max = axisSnapshot.min + length;
          if (node.relativeTarget && !node.currentAnimation) {
            node.isProjectionDirty = true;
            node.relativeTarget[axis].max = node.relativeTarget[axis].min + length;
          }
        });
      }
      const layoutDelta = createDelta();
      calcBoxDelta(layoutDelta, layout, snapshot.layoutBox);
      const visualDelta = createDelta();
      if (isShared) {
        calcBoxDelta(visualDelta, node.applyTransform(measuredLayout, true), snapshot.measuredBox);
      } else {
        calcBoxDelta(visualDelta, layout, snapshot.layoutBox);
      }
      const hasLayoutChanged = !isDeltaZero(layoutDelta);
      let hasRelativeLayoutChanged = false;
      if (!node.resumeFrom) {
        const relativeParent = node.getClosestProjectingParent();
        if (relativeParent && !relativeParent.resumeFrom) {
          const { snapshot: parentSnapshot, layout: parentLayout } = relativeParent;
          if (parentSnapshot && parentLayout) {
            const anchor = node.options.layoutAnchor || void 0;
            const relativeSnapshot = createBox();
            calcRelativePosition(relativeSnapshot, snapshot.layoutBox, parentSnapshot.layoutBox, anchor);
            const relativeLayout = createBox();
            calcRelativePosition(relativeLayout, layout, parentLayout.layoutBox, anchor);
            if (!boxEqualsRounded(relativeSnapshot, relativeLayout)) {
              hasRelativeLayoutChanged = true;
            }
            if (relativeParent.options.layoutRoot) {
              node.relativeTarget = relativeLayout;
              node.relativeTargetOrigin = relativeSnapshot;
              node.relativeParent = relativeParent;
            }
          }
        }
      }
      node.notifyListeners("didUpdate", {
        layout,
        snapshot,
        delta: visualDelta,
        layoutDelta,
        hasLayoutChanged,
        hasRelativeLayoutChanged
      });
    } else if (node.isLead()) {
      const { onExitComplete } = node.options;
      onExitComplete && onExitComplete();
    }
    node.options.transition = void 0;
  }
  function propagateDirtyNodes(node) {
    if (statsBuffer.value) {
      metrics.nodes++;
    }
    if (!node.parent)
      return;
    if (!node.isProjecting()) {
      node.isProjectionDirty = node.parent.isProjectionDirty;
    }
    node.isSharedProjectionDirty || (node.isSharedProjectionDirty = Boolean(node.isProjectionDirty || node.parent.isProjectionDirty || node.parent.isSharedProjectionDirty));
    node.isTransformDirty || (node.isTransformDirty = node.parent.isTransformDirty);
  }
  function cleanDirtyNodes(node) {
    node.isProjectionDirty = node.isSharedProjectionDirty = node.isTransformDirty = false;
  }
  function clearSnapshot(node) {
    node.clearSnapshot();
  }
  function clearMeasurements(node) {
    node.clearMeasurements();
  }
  function forceLayoutMeasure(node) {
    node.isLayoutDirty = true;
    node.updateLayout();
  }
  function clearIsLayoutDirty(node) {
    node.isLayoutDirty = false;
  }
  function ensureDraggedNodesSnapshotted(node) {
    if (node.isAnimationBlocked && node.layout && !node.isLayoutDirty) {
      node.snapshot = node.layout;
      node.isLayoutDirty = true;
    }
  }
  function resetTransformStyle(node) {
    const { visualElement } = node.options;
    if (visualElement && visualElement.getProps().onBeforeLayoutMeasure) {
      visualElement.notify("BeforeLayoutMeasure");
    }
    node.resetTransform();
  }
  function finishAnimation(node) {
    node.finishAnimation();
    node.targetDelta = node.relativeTarget = node.target = void 0;
    node.isProjectionDirty = true;
  }
  function resolveTargetDelta(node) {
    node.resolveTargetDelta();
  }
  function calcProjection(node) {
    node.calcProjection();
  }
  function resetSkewAndRotation(node) {
    node.resetSkewAndRotation();
  }
  function removeLeadSnapshots(stack) {
    stack.removeLeadSnapshot();
  }
  function mixAxisDelta(output, delta, p) {
    output.translate = mixNumber$1(delta.translate, 0, p);
    output.scale = mixNumber$1(delta.scale, 1, p);
    output.origin = delta.origin;
    output.originPoint = delta.originPoint;
  }
  function mixAxis(output, from, to, p) {
    output.min = mixNumber$1(from.min, to.min, p);
    output.max = mixNumber$1(from.max, to.max, p);
  }
  function mixBox(output, from, to, p) {
    mixAxis(output.x, from.x, to.x, p);
    mixAxis(output.y, from.y, to.y, p);
  }
  function hasOpacityCrossfade(node) {
    return node.animationValues && node.animationValues.opacityExit !== void 0;
  }
  const defaultLayoutTransition = {
    duration: 0.45,
    ease: [0.4, 0, 0.1, 1]
  };
  const userAgentContains = (string) => typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(string);
  const roundPoint = userAgentContains("applewebkit/") && !userAgentContains("chrome/") ? Math.round : motionUtils.noop;
  function roundAxis(axis) {
    axis.min = roundPoint(axis.min);
    axis.max = roundPoint(axis.max);
  }
  function roundBox(box) {
    roundAxis(box.x);
    roundAxis(box.y);
  }
  function shouldAnimatePositionOnly(animationType, snapshot, layout) {
    return animationType === "position" || animationType === "preserve-aspect" && !isNear(aspectRatio(snapshot), aspectRatio(layout), 0.2);
  }
  function checkNodeWasScrollRoot(node) {
    return node !== node.root && node.scroll?.wasRoot;
  }
  const DocumentProjectionNode = createProjectionNode({
    attachResizeListener: (ref, notify2) => addDomEvent(ref, "resize", notify2),
    measureScroll: () => ({
      x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
      y: document.documentElement.scrollTop || document.body?.scrollTop || 0
    }),
    checkIsScrollRoot: () => true
  });
  const notify = (node) => !node.isLayoutDirty && node.willUpdate(false);
  function nodeGroup() {
    const nodes = /* @__PURE__ */ new Set();
    const subscriptions = /* @__PURE__ */ new WeakMap();
    const dirtyAll = () => nodes.forEach(notify);
    return {
      add: (node) => {
        nodes.add(node);
        subscriptions.set(node, node.addEventListener("willUpdate", dirtyAll));
      },
      remove: (node) => {
        nodes.delete(node);
        const unsubscribe = subscriptions.get(node);
        if (unsubscribe) {
          unsubscribe();
          subscriptions.delete(node);
        }
        dirtyAll();
      },
      dirty: dirtyAll
    };
  }
  const rootProjectionNode = {
    current: void 0
  };
  const HTMLProjectionNode = createProjectionNode({
    measureScroll: (instance) => ({
      x: instance.scrollLeft,
      y: instance.scrollTop
    }),
    defaultParent: () => {
      if (!rootProjectionNode.current) {
        const documentNode = new DocumentProjectionNode({});
        documentNode.mount(window);
        documentNode.setOptions({ layoutScroll: true });
        rootProjectionNode.current = documentNode;
      }
      return rootProjectionNode.current;
    },
    resetTransform: (instance, value) => {
      instance.style.transform = value !== void 0 ? value : "none";
    },
    checkIsScrollRoot: (instance) => Boolean(window.getComputedStyle(instance).position === "fixed")
  });
  const layoutSelector = "[data-layout], [data-layout-id]";
  const noop = () => {
  };
  function snapshotFromTarget(projection) {
    const target = projection.targetWithTransforms || projection.target;
    if (!target)
      return void 0;
    const measuredBox = createBox();
    const layoutBox = createBox();
    copyBoxInto(measuredBox, target);
    copyBoxInto(layoutBox, target);
    return {
      animationId: projection.root?.animationId ?? 0,
      measuredBox,
      layoutBox,
      latestValues: projection.animationValues || projection.latestValues || {},
      source: projection.id
    };
  }
  class LayoutAnimationBuilder {
    constructor(scope, updateDom, defaultOptions) {
      this.sharedTransitions = /* @__PURE__ */ new Map();
      this.notifyReady = noop;
      this.rejectReady = noop;
      this.scope = scope;
      this.updateDom = updateDom;
      this.defaultOptions = defaultOptions;
      this.readyPromise = new Promise((resolve, reject) => {
        this.notifyReady = resolve;
        this.rejectReady = reject;
      });
      frame.postRender(() => {
        this.start().then(this.notifyReady).catch(this.rejectReady);
      });
    }
    shared(id2, transition) {
      this.sharedTransitions.set(id2, transition);
      return this;
    }
    then(resolve, reject) {
      return this.readyPromise.then(resolve, reject);
    }
    async start() {
      const beforeElements = collectLayoutElements(this.scope);
      const beforeRecords = this.buildRecords(beforeElements);
      beforeRecords.forEach(({ projection }) => {
        const hasCurrentAnimation = Boolean(projection.currentAnimation);
        const isSharedLayout = Boolean(projection.options.layoutId);
        if (hasCurrentAnimation && isSharedLayout) {
          const snapshot = snapshotFromTarget(projection);
          if (snapshot) {
            projection.snapshot = snapshot;
          } else if (projection.snapshot) {
            projection.snapshot = void 0;
          }
        } else if (projection.snapshot && (projection.currentAnimation || projection.isProjecting())) {
          projection.snapshot = void 0;
        }
        projection.isPresent = true;
        projection.willUpdate();
      });
      await this.updateDom();
      const afterElements = collectLayoutElements(this.scope);
      const afterRecords = this.buildRecords(afterElements);
      this.handleExitingElements(beforeRecords, afterRecords);
      afterRecords.forEach(({ projection }) => {
        const instance = projection.instance;
        const resumeFromInstance = projection.resumeFrom?.instance;
        if (!instance || !resumeFromInstance)
          return;
        if (!("style" in instance))
          return;
        const currentTransform = instance.style.transform;
        const resumeFromTransform = resumeFromInstance.style.transform;
        if (currentTransform && resumeFromTransform && currentTransform === resumeFromTransform) {
          instance.style.transform = "";
          instance.style.transformOrigin = "";
        }
      });
      afterRecords.forEach(({ projection }) => {
        projection.isPresent = true;
      });
      const root = getProjectionRoot(afterRecords, beforeRecords);
      root?.didUpdate();
      await new Promise((resolve) => {
        frame.postRender(() => resolve());
      });
      const animations = collectAnimations(afterRecords);
      const animation = new GroupAnimation(animations);
      return animation;
    }
    buildRecords(elements) {
      const records = [];
      const recordMap = /* @__PURE__ */ new Map();
      for (const element of elements) {
        const parentRecord = findParentRecord(element, recordMap, this.scope);
        const { layout, layoutId } = readLayoutAttributes(element);
        const override = layoutId ? this.sharedTransitions.get(layoutId) : void 0;
        const transition = override || this.defaultOptions;
        const record2 = getOrCreateRecord(element, parentRecord?.projection, {
          layout,
          layoutId,
          animationType: typeof layout === "string" ? layout : "both",
          transition
        });
        recordMap.set(element, record2);
        records.push(record2);
      }
      return records;
    }
    handleExitingElements(beforeRecords, afterRecords) {
      const afterElementsSet = new Set(afterRecords.map((record2) => record2.element));
      beforeRecords.forEach((record2) => {
        if (afterElementsSet.has(record2.element))
          return;
        if (record2.projection.options.layoutId) {
          record2.projection.isPresent = false;
          record2.projection.relegate();
        }
        record2.visualElement.unmount();
        visualElementStore.delete(record2.element);
      });
      const beforeElementsSet = new Set(beforeRecords.map((record2) => record2.element));
      afterRecords.forEach(({ element, projection }) => {
        if (beforeElementsSet.has(element) && projection.resumeFrom && !projection.resumeFrom.instance && !projection.isLead()) {
          projection.resumeFrom = void 0;
          projection.snapshot = void 0;
        }
      });
    }
  }
  function parseAnimateLayoutArgs(scopeOrUpdateDom, updateDomOrOptions, options) {
    if (typeof scopeOrUpdateDom === "function") {
      return {
        scope: document,
        updateDom: scopeOrUpdateDom,
        defaultOptions: updateDomOrOptions
      };
    }
    const elements = resolveElements(scopeOrUpdateDom);
    const scope = elements[0] || document;
    return {
      scope,
      updateDom: updateDomOrOptions,
      defaultOptions: options
    };
  }
  function collectLayoutElements(scope) {
    const elements = Array.from(scope.querySelectorAll(layoutSelector));
    if (scope instanceof Element && scope.matches(layoutSelector)) {
      if (!elements.includes(scope)) {
        elements.unshift(scope);
      }
    }
    return elements;
  }
  function readLayoutAttributes(element) {
    const layoutId = element.getAttribute("data-layout-id") || void 0;
    const rawLayout = element.getAttribute("data-layout");
    let layout;
    if (rawLayout === "" || rawLayout === "true") {
      layout = true;
    } else if (rawLayout) {
      layout = rawLayout;
    }
    return {
      layout,
      layoutId
    };
  }
  function createVisualState() {
    return {
      latestValues: {},
      renderState: {
        transform: {},
        transformOrigin: {},
        style: {},
        vars: {}
      }
    };
  }
  function getOrCreateRecord(element, parentProjection, projectionOptions) {
    const existing = visualElementStore.get(element);
    const visualElement = existing ?? new HTMLVisualElement({
      props: {},
      presenceContext: null,
      visualState: createVisualState()
    }, { allowProjection: true });
    if (!existing || !visualElement.projection) {
      visualElement.projection = new HTMLProjectionNode(visualElement.latestValues, parentProjection);
    }
    visualElement.projection.setOptions({
      ...projectionOptions,
      visualElement
    });
    if (!visualElement.current) {
      visualElement.mount(element);
    } else if (!visualElement.projection.instance) {
      visualElement.projection.mount(element);
    }
    if (!existing) {
      visualElementStore.set(element, visualElement);
    }
    return {
      element,
      visualElement,
      projection: visualElement.projection
    };
  }
  function findParentRecord(element, recordMap, scope) {
    let parent = element.parentElement;
    while (parent) {
      const record2 = recordMap.get(parent);
      if (record2)
        return record2;
      if (parent === scope)
        break;
      parent = parent.parentElement;
    }
    return void 0;
  }
  function getProjectionRoot(afterRecords, beforeRecords) {
    const record2 = afterRecords[0] || beforeRecords[0];
    return record2?.projection.root;
  }
  function collectAnimations(afterRecords) {
    const animations = /* @__PURE__ */ new Set();
    afterRecords.forEach((record2) => {
      const animation = record2.projection.currentAnimation;
      if (animation)
        animations.add(animation);
    });
    return Array.from(animations);
  }
  const sync = frame;
  const cancelSync = stepsOrder.reduce((acc, key) => {
    acc[key] = (process2) => cancelFrame(process2);
    return acc;
  }, {});
  cjs$1.AsyncMotionValueAnimation = AsyncMotionValueAnimation;
  cjs$1.DOMKeyframesResolver = DOMKeyframesResolver;
  cjs$1.DOMVisualElement = DOMVisualElement;
  cjs$1.DocumentProjectionNode = DocumentProjectionNode;
  cjs$1.Feature = Feature;
  cjs$1.FlatTree = FlatTree;
  cjs$1.GroupAnimation = GroupAnimation;
  cjs$1.GroupAnimationWithThen = GroupAnimationWithThen;
  cjs$1.HTMLProjectionNode = HTMLProjectionNode;
  cjs$1.HTMLVisualElement = HTMLVisualElement;
  cjs$1.JSAnimation = JSAnimation;
  cjs$1.KeyframeResolver = KeyframeResolver;
  cjs$1.LayoutAnimationBuilder = LayoutAnimationBuilder;
  cjs$1.MotionValue = MotionValue;
  cjs$1.NativeAnimation = NativeAnimation;
  cjs$1.NativeAnimationExtended = NativeAnimationExtended;
  cjs$1.NativeAnimationWrapper = NativeAnimationWrapper;
  cjs$1.NodeStack = NodeStack;
  cjs$1.ObjectVisualElement = ObjectVisualElement;
  cjs$1.SVGVisualElement = SVGVisualElement;
  cjs$1.ViewTransitionBuilder = ViewTransitionBuilder;
  cjs$1.VisualElement = VisualElement;
  cjs$1.acceleratedValues = acceleratedValues;
  cjs$1.activeAnimations = activeAnimations;
  cjs$1.addAttrValue = addAttrValue;
  cjs$1.addDomEvent = addDomEvent;
  cjs$1.addScaleCorrector = addScaleCorrector;
  cjs$1.addStyleValue = addStyleValue;
  cjs$1.addValueToWillChange = addValueToWillChange;
  cjs$1.alpha = alpha;
  cjs$1.analyseComplexValue = analyseComplexValue;
  cjs$1.animateMotionValue = animateMotionValue;
  cjs$1.animateSingleValue = animateSingleValue;
  cjs$1.animateTarget = animateTarget;
  cjs$1.animateValue = animateValue;
  cjs$1.animateVariant = animateVariant;
  cjs$1.animateView = animateView;
  cjs$1.animateVisualElement = animateVisualElement;
  cjs$1.animationMapKey = animationMapKey;
  cjs$1.applyAxisDelta = applyAxisDelta;
  cjs$1.applyBoxDelta = applyBoxDelta;
  cjs$1.applyGeneratorOptions = applyGeneratorOptions;
  cjs$1.applyPointDelta = applyPointDelta;
  cjs$1.applyPxDefaults = applyPxDefaults;
  cjs$1.applyTreeDeltas = applyTreeDeltas;
  cjs$1.aspectRatio = aspectRatio;
  cjs$1.attachFollow = attachFollow;
  cjs$1.attachSpring = attachSpring;
  cjs$1.attrEffect = attrEffect;
  cjs$1.axisDeltaEquals = axisDeltaEquals;
  cjs$1.axisEquals = axisEquals;
  cjs$1.axisEqualsRounded = axisEqualsRounded;
  cjs$1.boxEquals = boxEquals;
  cjs$1.boxEqualsRounded = boxEqualsRounded;
  cjs$1.buildHTMLStyles = buildHTMLStyles;
  cjs$1.buildProjectionTransform = buildProjectionTransform;
  cjs$1.buildSVGAttrs = buildSVGAttrs;
  cjs$1.buildSVGPath = buildSVGPath;
  cjs$1.buildTransform = buildTransform;
  cjs$1.calcAxisDelta = calcAxisDelta;
  cjs$1.calcBoxDelta = calcBoxDelta;
  cjs$1.calcChildStagger = calcChildStagger;
  cjs$1.calcGeneratorDuration = calcGeneratorDuration;
  cjs$1.calcLength = calcLength;
  cjs$1.calcRelativeAxis = calcRelativeAxis;
  cjs$1.calcRelativeAxisPosition = calcRelativeAxisPosition;
  cjs$1.calcRelativeBox = calcRelativeBox;
  cjs$1.calcRelativePosition = calcRelativePosition;
  cjs$1.camelCaseAttributes = camelCaseAttributes;
  cjs$1.camelToDash = camelToDash;
  cjs$1.cancelFrame = cancelFrame;
  cjs$1.cancelMicrotask = cancelMicrotask;
  cjs$1.cancelSync = cancelSync;
  cjs$1.checkVariantsDidChange = checkVariantsDidChange;
  cjs$1.cleanDirtyNodes = cleanDirtyNodes;
  cjs$1.collectMotionValues = collectMotionValues;
  cjs$1.color = color;
  cjs$1.compareByDepth = compareByDepth;
  cjs$1.complex = complex;
  cjs$1.containsCSSVariable = containsCSSVariable;
  cjs$1.convertBoundingBoxToBox = convertBoundingBoxToBox;
  cjs$1.convertBoxToBoundingBox = convertBoxToBoundingBox;
  cjs$1.convertOffsetToTimes = convertOffsetToTimes;
  cjs$1.copyAxisDeltaInto = copyAxisDeltaInto;
  cjs$1.copyAxisInto = copyAxisInto;
  cjs$1.copyBoxInto = copyBoxInto;
  cjs$1.correctBorderRadius = correctBorderRadius;
  cjs$1.correctBoxShadow = correctBoxShadow;
  cjs$1.createAnimationState = createAnimationState;
  cjs$1.createAxis = createAxis;
  cjs$1.createAxisDelta = createAxisDelta;
  cjs$1.createBox = createBox;
  cjs$1.createDelta = createDelta;
  cjs$1.createGeneratorEasing = createGeneratorEasing;
  cjs$1.createProjectionNode = createProjectionNode;
  cjs$1.createRenderBatcher = createRenderBatcher;
  cjs$1.cubicBezierAsString = cubicBezierAsString;
  cjs$1.defaultEasing = defaultEasing;
  cjs$1.defaultOffset = defaultOffset;
  cjs$1.defaultTransformValue = defaultTransformValue;
  cjs$1.defaultValueTypes = defaultValueTypes;
  cjs$1.degrees = degrees;
  cjs$1.delay = delay;
  cjs$1.delayInSeconds = delayInSeconds;
  cjs$1.dimensionValueTypes = dimensionValueTypes;
  cjs$1.eachAxis = eachAxis;
  cjs$1.fillOffset = fillOffset;
  cjs$1.fillWildcards = fillWildcards;
  cjs$1.findDimensionValueType = findDimensionValueType;
  cjs$1.findValueType = findValueType;
  cjs$1.flushKeyframeResolvers = flushKeyframeResolvers;
  cjs$1.followValue = followValue;
  cjs$1.frame = frame;
  cjs$1.frameData = frameData;
  cjs$1.frameSteps = frameSteps;
  cjs$1.generateLinearEasing = generateLinearEasing;
  cjs$1.getAnimatableNone = getAnimatableNone;
  cjs$1.getAnimationMap = getAnimationMap;
  cjs$1.getComputedStyle = getComputedStyle$2;
  cjs$1.getDefaultTransition = getDefaultTransition;
  cjs$1.getDefaultValueType = getDefaultValueType;
  cjs$1.getFeatureDefinitions = getFeatureDefinitions;
  cjs$1.getFinalKeyframe = getFinalKeyframe;
  cjs$1.getMixer = getMixer;
  cjs$1.getOptimisedAppearId = getOptimisedAppearId;
  cjs$1.getOriginIndex = getOriginIndex;
  cjs$1.getValueAsType = getValueAsType;
  cjs$1.getValueTransition = getValueTransition;
  cjs$1.getVariableValue = getVariableValue;
  cjs$1.getVariantContext = getVariantContext;
  cjs$1.getViewAnimationLayerInfo = getViewAnimationLayerInfo;
  cjs$1.getViewAnimations = getViewAnimations;
  cjs$1.globalProjectionState = globalProjectionState;
  cjs$1.has2DTranslate = has2DTranslate;
  cjs$1.hasReducedMotionListener = hasReducedMotionListener;
  cjs$1.hasScale = hasScale;
  cjs$1.hasTransform = hasTransform;
  cjs$1.hex = hex;
  cjs$1.hover = hover;
  cjs$1.hsla = hsla;
  cjs$1.hslaToRgba = hslaToRgba;
  cjs$1.inertia = inertia;
  cjs$1.initPrefersReducedMotion = initPrefersReducedMotion;
  cjs$1.interpolate = interpolate;
  cjs$1.invisibleValues = invisibleValues;
  cjs$1.isAnimationControls = isAnimationControls;
  cjs$1.isCSSVariableName = isCSSVariableName;
  cjs$1.isCSSVariableToken = isCSSVariableToken;
  cjs$1.isControllingVariants = isControllingVariants;
  cjs$1.isDeltaZero = isDeltaZero;
  cjs$1.isDragActive = isDragActive;
  cjs$1.isDragging = isDragging;
  cjs$1.isElementKeyboardAccessible = isElementKeyboardAccessible;
  cjs$1.isElementTextInput = isElementTextInput;
  cjs$1.isForcedMotionValue = isForcedMotionValue;
  cjs$1.isGenerator = isGenerator;
  cjs$1.isHTMLElement = isHTMLElement;
  cjs$1.isKeyframesTarget = isKeyframesTarget;
  cjs$1.isMotionValue = isMotionValue;
  cjs$1.isNear = isNear;
  cjs$1.isNodeOrChild = isNodeOrChild;
  cjs$1.isPrimaryPointer = isPrimaryPointer;
  cjs$1.isSVGElement = isSVGElement;
  cjs$1.isSVGSVGElement = isSVGSVGElement;
  cjs$1.isSVGTag = isSVGTag;
  cjs$1.isTransitionDefined = isTransitionDefined;
  cjs$1.isVariantLabel = isVariantLabel;
  cjs$1.isVariantNode = isVariantNode;
  cjs$1.isWaapiSupportedEasing = isWaapiSupportedEasing;
  cjs$1.isWillChangeMotionValue = isWillChangeMotionValue;
  cjs$1.keyframes = keyframes;
  cjs$1.makeAnimationInstant = makeAnimationInstant;
  cjs$1.mapEasingToNativeEasing = mapEasingToNativeEasing;
  cjs$1.mapValue = mapValue;
  cjs$1.maxGeneratorDuration = maxGeneratorDuration;
  cjs$1.measurePageBox = measurePageBox;
  cjs$1.measureViewportBox = measureViewportBox;
  cjs$1.microtask = microtask;
  cjs$1.mix = mix;
  cjs$1.mixArray = mixArray;
  cjs$1.mixColor = mixColor;
  cjs$1.mixComplex = mixComplex;
  cjs$1.mixImmediate = mixImmediate;
  cjs$1.mixLinearColor = mixLinearColor;
  cjs$1.mixNumber = mixNumber$1;
  cjs$1.mixObject = mixObject;
  cjs$1.mixValues = mixValues;
  cjs$1.mixVisibility = mixVisibility;
  cjs$1.motionValue = motionValue;
  cjs$1.nodeGroup = nodeGroup;
  cjs$1.number = number;
  cjs$1.numberValueTypes = numberValueTypes;
  cjs$1.observeTimeline = observeTimeline;
  cjs$1.optimizedAppearDataAttribute = optimizedAppearDataAttribute;
  cjs$1.optimizedAppearDataId = optimizedAppearDataId;
  cjs$1.parseAnimateLayoutArgs = parseAnimateLayoutArgs;
  cjs$1.parseCSSVariable = parseCSSVariable;
  cjs$1.parseValueFromTransform = parseValueFromTransform;
  cjs$1.percent = percent;
  cjs$1.pixelsToPercent = pixelsToPercent;
  cjs$1.positionalKeys = positionalKeys;
  cjs$1.prefersReducedMotion = prefersReducedMotion;
  cjs$1.press = press;
  cjs$1.progressPercentage = progressPercentage;
  cjs$1.propEffect = propEffect;
  cjs$1.propagateDirtyNodes = propagateDirtyNodes;
  cjs$1.px = px;
  cjs$1.readTransformValue = readTransformValue;
  cjs$1.recordStats = recordStats;
  cjs$1.removeAxisDelta = removeAxisDelta;
  cjs$1.removeAxisTransforms = removeAxisTransforms;
  cjs$1.removeBoxTransforms = removeBoxTransforms;
  cjs$1.removePointDelta = removePointDelta;
  cjs$1.renderHTML = renderHTML;
  cjs$1.renderSVG = renderSVG;
  cjs$1.resize = resize;
  cjs$1.resolveElements = resolveElements;
  cjs$1.resolveMotionValue = resolveMotionValue;
  cjs$1.resolveTransition = resolveTransition;
  cjs$1.resolveVariant = resolveVariant;
  cjs$1.resolveVariantFromProps = resolveVariantFromProps;
  cjs$1.rgbUnit = rgbUnit;
  cjs$1.rgba = rgba;
  cjs$1.rootProjectionNode = rootProjectionNode;
  cjs$1.scale = scale;
  cjs$1.scaleCorrectors = scaleCorrectors;
  cjs$1.scalePoint = scalePoint;
  cjs$1.scrapeHTMLMotionValuesFromProps = scrapeMotionValuesFromProps$1;
  cjs$1.scrapeSVGMotionValuesFromProps = scrapeMotionValuesFromProps;
  cjs$1.setDragLock = setDragLock;
  cjs$1.setFeatureDefinitions = setFeatureDefinitions;
  cjs$1.setStyle = setStyle;
  cjs$1.setTarget = setTarget;
  cjs$1.spring = spring;
  cjs$1.springValue = springValue;
  cjs$1.stagger = stagger;
  cjs$1.startWaapiAnimation = startWaapiAnimation;
  cjs$1.statsBuffer = statsBuffer;
  cjs$1.styleEffect = styleEffect;
  cjs$1.supportedWaapiEasing = supportedWaapiEasing;
  cjs$1.supportsBrowserAnimation = supportsBrowserAnimation;
  cjs$1.supportsFlags = supportsFlags;
  cjs$1.supportsLinearEasing = supportsLinearEasing;
  cjs$1.supportsPartialKeyframes = supportsPartialKeyframes;
  cjs$1.supportsScrollTimeline = supportsScrollTimeline;
  cjs$1.supportsViewTimeline = supportsViewTimeline;
  cjs$1.svgEffect = svgEffect;
  cjs$1.sync = sync;
  cjs$1.testValueType = testValueType;
  cjs$1.time = time;
  cjs$1.transform = transform;
  cjs$1.transformAxis = transformAxis;
  cjs$1.transformBox = transformBox;
  cjs$1.transformBoxPoints = transformBoxPoints;
  cjs$1.transformPropOrder = transformPropOrder;
  cjs$1.transformProps = transformProps;
  cjs$1.transformValue = transformValue;
  cjs$1.transformValueTypes = transformValueTypes;
  cjs$1.translateAxis = translateAxis;
  cjs$1.updateMotionValuesFromProps = updateMotionValuesFromProps;
  cjs$1.variantPriorityOrder = variantPriorityOrder;
  cjs$1.variantProps = variantProps;
  cjs$1.vh = vh;
  cjs$1.visualElementStore = visualElementStore;
  cjs$1.vw = vw;
  return cjs$1;
}
var hasRequiredFeatureBundleBieBX2Jn;
function requireFeatureBundleBieBX2Jn() {
  if (hasRequiredFeatureBundleBieBX2Jn) return featureBundleBieBX2Jn;
  hasRequiredFeatureBundleBieBX2Jn = 1;
  var motionDom = /* @__PURE__ */ requireCjs$1();
  var React = requireReact();
  var jsxRuntime = requireJsxRuntime();
  var motionUtils = /* @__PURE__ */ requireCjs$2();
  const LayoutGroupContext = React.createContext({});
  function useConstant(init) {
    const ref = React.useRef(null);
    if (ref.current === null) {
      ref.current = init();
    }
    return ref.current;
  }
  const isBrowser = typeof window !== "undefined";
  const useIsomorphicLayoutEffect = isBrowser ? React.useLayoutEffect : React.useEffect;
  const PresenceContext = /* @__PURE__ */ React.createContext(null);
  const MotionConfigContext = React.createContext({
    transformPagePoint: (p) => p,
    isStatic: false,
    reducedMotion: "never"
  });
  function usePresence(subscribe = true) {
    const context = React.useContext(PresenceContext);
    if (context === null)
      return [true, null];
    const { isPresent: isPresent2, onExitComplete, register } = context;
    const id2 = React.useId();
    React.useEffect(() => {
      if (subscribe) {
        return register(id2);
      }
    }, [subscribe]);
    const safeToRemove = React.useCallback(() => subscribe && onExitComplete && onExitComplete(id2), [id2, onExitComplete, subscribe]);
    return !isPresent2 && onExitComplete ? [false, safeToRemove] : [true];
  }
  function useIsPresent() {
    return isPresent(React.useContext(PresenceContext));
  }
  function isPresent(context) {
    return context === null ? true : context.isPresent;
  }
  const LazyContext = React.createContext({ strict: false });
  const featureProps = {
    animation: [
      "animate",
      "variants",
      "whileHover",
      "whileTap",
      "exit",
      "whileInView",
      "whileFocus",
      "whileDrag"
    ],
    exit: ["exit"],
    drag: ["drag", "dragControls"],
    focus: ["whileFocus"],
    hover: ["whileHover", "onHoverStart", "onHoverEnd"],
    tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
    pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
    inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
    layout: ["layout", "layoutId"]
  };
  let isInitialized = false;
  function initFeatureDefinitions() {
    if (isInitialized)
      return;
    const initialFeatureDefinitions = {};
    for (const key in featureProps) {
      initialFeatureDefinitions[key] = {
        isEnabled: (props) => featureProps[key].some((name) => !!props[name])
      };
    }
    motionDom.setFeatureDefinitions(initialFeatureDefinitions);
    isInitialized = true;
  }
  function getInitializedFeatureDefinitions() {
    initFeatureDefinitions();
    return motionDom.getFeatureDefinitions();
  }
  function loadFeatures(features) {
    const featureDefinitions = getInitializedFeatureDefinitions();
    for (const key in features) {
      featureDefinitions[key] = {
        ...featureDefinitions[key],
        ...features[key]
      };
    }
    motionDom.setFeatureDefinitions(featureDefinitions);
  }
  const validMotionProps = /* @__PURE__ */ new Set([
    "animate",
    "exit",
    "variants",
    "initial",
    "style",
    "values",
    "variants",
    "transition",
    "transformTemplate",
    "custom",
    "inherit",
    "onBeforeLayoutMeasure",
    "onAnimationStart",
    "onAnimationComplete",
    "onUpdate",
    "onDragStart",
    "onDrag",
    "onDragEnd",
    "onMeasureDragConstraints",
    "onDirectionLock",
    "onDragTransitionEnd",
    "_dragX",
    "_dragY",
    "onHoverStart",
    "onHoverEnd",
    "onViewportEnter",
    "onViewportLeave",
    "globalTapTarget",
    "propagate",
    "ignoreStrict",
    "viewport"
  ]);
  function isValidMotionProp(key) {
    return key.startsWith("while") || key.startsWith("drag") && key !== "draggable" || key.startsWith("layout") || key.startsWith("onTap") || key.startsWith("onPan") || key.startsWith("onLayout") || validMotionProps.has(key);
  }
  let shouldForward = (key) => !isValidMotionProp(key);
  function loadExternalIsValidProp(isValidProp) {
    if (typeof isValidProp !== "function")
      return;
    shouldForward = (key) => key.startsWith("on") ? !isValidMotionProp(key) : isValidProp(key);
  }
  try {
    const emotionPkg = "@emotion/is-prop-valid";
    loadExternalIsValidProp(commonjsRequire(emotionPkg).default);
  } catch {
  }
  function filterProps(props, isDom, forwardMotionProps) {
    const filteredProps = {};
    for (const key in props) {
      if (key === "values" && typeof props.values === "object")
        continue;
      if (motionDom.isMotionValue(props[key]))
        continue;
      if (shouldForward(key) || forwardMotionProps === true && isValidMotionProp(key) || !isDom && !isValidMotionProp(key) || // If trying to use native HTML drag events, forward drag listeners
      props["draggable"] && key.startsWith("onDrag")) {
        filteredProps[key] = props[key];
      }
    }
    return filteredProps;
  }
  const lowercaseSVGElements = [
    "animate",
    "circle",
    "defs",
    "desc",
    "ellipse",
    "g",
    "image",
    "line",
    "filter",
    "marker",
    "mask",
    "metadata",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "rect",
    "stop",
    "switch",
    "symbol",
    "svg",
    "text",
    "tspan",
    "use",
    "view"
  ];
  function isSVGComponent(Component) {
    if (
      /**
       * If it's not a string, it's a custom React component. Currently we only support
       * HTML custom React components.
       */
      typeof Component !== "string" || /**
      * If it contains a dash, the element is a custom HTML webcomponent.
      */
      Component.includes("-")
    ) {
      return false;
    } else if (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      lowercaseSVGElements.indexOf(Component) > -1 || /**
      * If it contains a capital letter, it's an SVG component
      */
      /[A-Z]/u.test(Component)
    ) {
      return true;
    }
    return false;
  }
  const createDomVisualElement = (Component, options) => {
    const isSVG = options.isSVG ?? isSVGComponent(Component);
    return isSVG ? new motionDom.SVGVisualElement(options) : new motionDom.HTMLVisualElement(options, {
      allowProjection: Component !== React.Fragment
    });
  };
  const MotionContext = /* @__PURE__ */ React.createContext({});
  function getCurrentTreeVariants(props, context) {
    if (motionDom.isControllingVariants(props)) {
      const { initial, animate } = props;
      return {
        initial: initial === false || motionDom.isVariantLabel(initial) ? initial : void 0,
        animate: motionDom.isVariantLabel(animate) ? animate : void 0
      };
    }
    return props.inherit !== false ? context : {};
  }
  function useCreateMotionContext(props) {
    const { initial, animate } = getCurrentTreeVariants(props, React.useContext(MotionContext));
    return React.useMemo(() => ({ initial, animate }), [variantLabelsAsDependency(initial), variantLabelsAsDependency(animate)]);
  }
  function variantLabelsAsDependency(prop) {
    return Array.isArray(prop) ? prop.join(" ") : prop;
  }
  const createHtmlRenderState = () => ({
    style: {},
    transform: {},
    transformOrigin: {},
    vars: {}
  });
  function copyRawValuesOnly(target, source, props) {
    for (const key in source) {
      if (!motionDom.isMotionValue(source[key]) && !motionDom.isForcedMotionValue(key, props)) {
        target[key] = source[key];
      }
    }
  }
  function useInitialMotionValues({ transformTemplate }, visualState) {
    return React.useMemo(() => {
      const state = createHtmlRenderState();
      motionDom.buildHTMLStyles(state, visualState, transformTemplate);
      return Object.assign({}, state.vars, state.style);
    }, [visualState]);
  }
  function useStyle(props, visualState) {
    const styleProp = props.style || {};
    const style = {};
    copyRawValuesOnly(style, styleProp, props);
    Object.assign(style, useInitialMotionValues(props, visualState));
    return style;
  }
  function useHTMLProps(props, visualState) {
    const htmlProps = {};
    const style = useStyle(props, visualState);
    if (props.drag && props.dragListener !== false) {
      htmlProps.draggable = false;
      style.userSelect = style.WebkitUserSelect = style.WebkitTouchCallout = "none";
      style.touchAction = props.drag === true ? "none" : `pan-${props.drag === "x" ? "y" : "x"}`;
    }
    if (props.tabIndex === void 0 && (props.onTap || props.onTapStart || props.whileTap)) {
      htmlProps.tabIndex = 0;
    }
    htmlProps.style = style;
    return htmlProps;
  }
  const createSvgRenderState = () => ({
    ...createHtmlRenderState(),
    attrs: {}
  });
  function useSVGProps(props, visualState, _isStatic, Component) {
    const visualProps = React.useMemo(() => {
      const state = createSvgRenderState();
      motionDom.buildSVGAttrs(state, visualState, motionDom.isSVGTag(Component), props.transformTemplate, props.style);
      return {
        ...state.attrs,
        style: { ...state.style }
      };
    }, [visualState]);
    if (props.style) {
      const rawStyles = {};
      copyRawValuesOnly(rawStyles, props.style, props);
      visualProps.style = { ...rawStyles, ...visualProps.style };
    }
    return visualProps;
  }
  function useRender(Component, props, ref, { latestValues }, isStatic, forwardMotionProps = false, isSVG) {
    const useVisualProps = isSVG ?? isSVGComponent(Component) ? useSVGProps : useHTMLProps;
    const visualProps = useVisualProps(props, latestValues, isStatic, Component);
    const filteredProps = filterProps(props, typeof Component === "string", forwardMotionProps);
    const elementProps = Component !== React.Fragment ? { ...filteredProps, ...visualProps, ref } : {};
    const { children } = props;
    const renderedChildren = React.useMemo(() => motionDom.isMotionValue(children) ? children.get() : children, [children]);
    return React.createElement(Component, {
      ...elementProps,
      children: renderedChildren
    });
  }
  function makeState({ scrapeMotionValuesFromProps, createRenderState }, props, context, presenceContext) {
    const state = {
      latestValues: makeLatestValues(props, context, presenceContext, scrapeMotionValuesFromProps),
      renderState: createRenderState()
    };
    return state;
  }
  function makeLatestValues(props, context, presenceContext, scrapeMotionValues) {
    const values = {};
    const motionValues = scrapeMotionValues(props, {});
    for (const key in motionValues) {
      values[key] = motionDom.resolveMotionValue(motionValues[key]);
    }
    let { initial, animate } = props;
    const isControllingVariants = motionDom.isControllingVariants(props);
    const isVariantNode = motionDom.isVariantNode(props);
    if (context && isVariantNode && !isControllingVariants && props.inherit !== false) {
      if (initial === void 0)
        initial = context.initial;
      if (animate === void 0)
        animate = context.animate;
    }
    let isInitialAnimationBlocked = presenceContext ? presenceContext.initial === false : false;
    isInitialAnimationBlocked = isInitialAnimationBlocked || initial === false;
    const variantToSet = isInitialAnimationBlocked ? animate : initial;
    if (variantToSet && typeof variantToSet !== "boolean" && !motionDom.isAnimationControls(variantToSet)) {
      const list = Array.isArray(variantToSet) ? variantToSet : [variantToSet];
      for (let i = 0; i < list.length; i++) {
        const resolved = motionDom.resolveVariantFromProps(props, list[i]);
        if (resolved) {
          const { transitionEnd, transition, ...target } = resolved;
          for (const key in target) {
            let valueTarget = target[key];
            if (Array.isArray(valueTarget)) {
              const index = isInitialAnimationBlocked ? valueTarget.length - 1 : 0;
              valueTarget = valueTarget[index];
            }
            if (valueTarget !== null) {
              values[key] = valueTarget;
            }
          }
          for (const key in transitionEnd) {
            values[key] = transitionEnd[key];
          }
        }
      }
    }
    return values;
  }
  const makeUseVisualState = (config) => (props, isStatic) => {
    const context = React.useContext(MotionContext);
    const presenceContext = React.useContext(PresenceContext);
    const make = () => makeState(config, props, context, presenceContext);
    return isStatic ? make() : useConstant(make);
  };
  const useHTMLVisualState = /* @__PURE__ */ makeUseVisualState({
    scrapeMotionValuesFromProps: motionDom.scrapeHTMLMotionValuesFromProps,
    createRenderState: createHtmlRenderState
  });
  const useSVGVisualState = /* @__PURE__ */ makeUseVisualState({
    scrapeMotionValuesFromProps: motionDom.scrapeSVGMotionValuesFromProps,
    createRenderState: createSvgRenderState
  });
  const motionComponentSymbol = /* @__PURE__ */ Symbol.for("motionComponentSymbol");
  function useMotionRef(visualState, visualElement, externalRef) {
    const externalRefContainer = React.useRef(externalRef);
    React.useInsertionEffect(() => {
      externalRefContainer.current = externalRef;
    });
    const refCleanup = React.useRef(null);
    return React.useCallback((instance) => {
      if (instance) {
        visualState.onMount?.(instance);
      }
      const ref = externalRefContainer.current;
      if (typeof ref === "function") {
        if (instance) {
          const cleanup = ref(instance);
          if (typeof cleanup === "function") {
            refCleanup.current = cleanup;
          }
        } else if (refCleanup.current) {
          refCleanup.current();
          refCleanup.current = null;
        } else {
          ref(instance);
        }
      } else if (ref) {
        ref.current = instance;
      }
      if (visualElement) {
        instance ? visualElement.mount(instance) : visualElement.unmount();
      }
    }, [visualElement]);
  }
  const SwitchLayoutGroupContext = React.createContext({});
  function isRefObject(ref) {
    return ref && typeof ref === "object" && Object.prototype.hasOwnProperty.call(ref, "current");
  }
  function useVisualElement(Component, visualState, props, createVisualElement, ProjectionNodeConstructor, isSVG) {
    const { visualElement: parent } = React.useContext(MotionContext);
    const lazyContext = React.useContext(LazyContext);
    const presenceContext = React.useContext(PresenceContext);
    const motionConfig = React.useContext(MotionConfigContext);
    const reducedMotionConfig = motionConfig.reducedMotion;
    const skipAnimations = motionConfig.skipAnimations;
    const visualElementRef = React.useRef(null);
    const hasMountedOnce = React.useRef(false);
    createVisualElement = createVisualElement || lazyContext.renderer;
    if (!visualElementRef.current && createVisualElement) {
      visualElementRef.current = createVisualElement(Component, {
        visualState,
        parent,
        props,
        presenceContext,
        blockInitialAnimation: presenceContext ? presenceContext.initial === false : false,
        reducedMotionConfig,
        skipAnimations,
        isSVG
      });
      if (hasMountedOnce.current && visualElementRef.current) {
        visualElementRef.current.manuallyAnimateOnMount = true;
      }
    }
    const visualElement = visualElementRef.current;
    const initialLayoutGroupConfig = React.useContext(SwitchLayoutGroupContext);
    if (visualElement && !visualElement.projection && ProjectionNodeConstructor && (visualElement.type === "html" || visualElement.type === "svg")) {
      createProjectionNode(visualElementRef.current, props, ProjectionNodeConstructor, initialLayoutGroupConfig);
    }
    const isMounted = React.useRef(false);
    React.useInsertionEffect(() => {
      if (visualElement && isMounted.current) {
        visualElement.update(props, presenceContext);
      }
    });
    const optimisedAppearId = props[motionDom.optimizedAppearDataAttribute];
    const wantsHandoff = React.useRef(Boolean(optimisedAppearId) && typeof window !== "undefined" && !window.MotionHandoffIsComplete?.(optimisedAppearId) && window.MotionHasOptimisedAnimation?.(optimisedAppearId));
    useIsomorphicLayoutEffect(() => {
      hasMountedOnce.current = true;
      if (!visualElement)
        return;
      isMounted.current = true;
      window.MotionIsMounted = true;
      visualElement.updateFeatures();
      visualElement.scheduleRenderMicrotask();
      if (wantsHandoff.current && visualElement.animationState) {
        visualElement.animationState.animateChanges();
      }
    });
    React.useEffect(() => {
      if (!visualElement)
        return;
      if (!wantsHandoff.current && visualElement.animationState) {
        visualElement.animationState.animateChanges();
      }
      if (wantsHandoff.current) {
        queueMicrotask(() => {
          window.MotionHandoffMarkAsComplete?.(optimisedAppearId);
        });
        wantsHandoff.current = false;
      }
      visualElement.enteringChildren = void 0;
    });
    return visualElement;
  }
  function createProjectionNode(visualElement, props, ProjectionNodeConstructor, initialPromotionConfig) {
    const { layoutId, layout: layout2, drag: drag2, dragConstraints, layoutScroll, layoutRoot, layoutAnchor, layoutCrossfade } = props;
    visualElement.projection = new ProjectionNodeConstructor(visualElement.latestValues, props["data-framer-portal-id"] ? void 0 : getClosestProjectingNode(visualElement.parent));
    visualElement.projection.setOptions({
      layoutId,
      layout: layout2,
      alwaysMeasureLayout: Boolean(drag2) || dragConstraints && isRefObject(dragConstraints),
      visualElement,
      /**
       * TODO: Update options in an effect. This could be tricky as it'll be too late
       * to update by the time layout animations run.
       * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
       * ensuring it gets called if there's no potential layout animations.
       *
       */
      animationType: typeof layout2 === "string" ? layout2 : "both",
      initialPromotionConfig,
      crossfade: layoutCrossfade,
      layoutScroll,
      layoutRoot,
      layoutAnchor
    });
  }
  function getClosestProjectingNode(visualElement) {
    if (!visualElement)
      return void 0;
    return visualElement.options.allowProjection !== false ? visualElement.projection : getClosestProjectingNode(visualElement.parent);
  }
  function createMotionComponent(Component, { forwardMotionProps = false, type } = {}, preloadedFeatures, createVisualElement) {
    preloadedFeatures && loadFeatures(preloadedFeatures);
    const isSVG = type ? type === "svg" : isSVGComponent(Component);
    const useVisualState = isSVG ? useSVGVisualState : useHTMLVisualState;
    function MotionDOMComponent(props, externalRef) {
      let MeasureLayout2;
      const configAndProps = {
        ...React.useContext(MotionConfigContext),
        ...props,
        layoutId: useLayoutId(props)
      };
      const { isStatic } = configAndProps;
      const context = useCreateMotionContext(props);
      const visualState = useVisualState(props, isStatic);
      if (!isStatic && typeof window !== "undefined") {
        useStrictMode();
        const layoutProjection = getProjectionFunctionality(configAndProps);
        MeasureLayout2 = layoutProjection.MeasureLayout;
        context.visualElement = useVisualElement(Component, visualState, configAndProps, createVisualElement, layoutProjection.ProjectionNode, isSVG);
      }
      return jsxRuntime.jsxs(MotionContext.Provider, { value: context, children: [MeasureLayout2 && context.visualElement ? jsxRuntime.jsx(MeasureLayout2, { visualElement: context.visualElement, ...configAndProps }) : null, useRender(Component, props, useMotionRef(visualState, context.visualElement, externalRef), visualState, isStatic, forwardMotionProps, isSVG)] });
    }
    MotionDOMComponent.displayName = `motion.${typeof Component === "string" ? Component : `create(${Component.displayName ?? Component.name ?? ""})`}`;
    const ForwardRefMotionComponent = React.forwardRef(MotionDOMComponent);
    ForwardRefMotionComponent[motionComponentSymbol] = Component;
    return ForwardRefMotionComponent;
  }
  function useLayoutId({ layoutId }) {
    const layoutGroupId = React.useContext(LayoutGroupContext).id;
    return layoutGroupId && layoutId !== void 0 ? layoutGroupId + "-" + layoutId : layoutId;
  }
  function useStrictMode(configAndProps, preloadedFeatures) {
    React.useContext(LazyContext).strict;
  }
  function getProjectionFunctionality(props) {
    const featureDefinitions = getInitializedFeatureDefinitions();
    const { drag: drag2, layout: layout2 } = featureDefinitions;
    if (!drag2 && !layout2)
      return {};
    const combined = { ...drag2, ...layout2 };
    return {
      MeasureLayout: drag2?.isEnabled(props) || layout2?.isEnabled(props) ? combined.MeasureLayout : void 0,
      ProjectionNode: combined.ProjectionNode
    };
  }
  class AnimationFeature extends motionDom.Feature {
    /**
     * We dynamically generate the AnimationState manager as it contains a reference
     * to the underlying animation library. We only want to load that if we load this,
     * so people can optionally code split it out using the `m` component.
     */
    constructor(node) {
      super(node);
      node.animationState || (node.animationState = motionDom.createAnimationState(node));
    }
    updateAnimationControlsSubscription() {
      const { animate } = this.node.getProps();
      if (motionDom.isAnimationControls(animate)) {
        this.unmountControls = animate.subscribe(this.node);
      }
    }
    /**
     * Subscribe any provided AnimationControls to the component's VisualElement
     */
    mount() {
      this.updateAnimationControlsSubscription();
    }
    update() {
      const { animate } = this.node.getProps();
      const { animate: prevAnimate } = this.node.prevProps || {};
      if (animate !== prevAnimate) {
        this.updateAnimationControlsSubscription();
      }
    }
    unmount() {
      this.node.animationState.reset();
      this.unmountControls?.();
    }
  }
  let id = 0;
  class ExitAnimationFeature extends motionDom.Feature {
    constructor() {
      super(...arguments);
      this.id = id++;
      this.isExitComplete = false;
    }
    update() {
      if (!this.node.presenceContext)
        return;
      const { isPresent: isPresent2, onExitComplete } = this.node.presenceContext;
      const { isPresent: prevIsPresent } = this.node.prevPresenceContext || {};
      if (!this.node.animationState || isPresent2 === prevIsPresent) {
        return;
      }
      if (isPresent2 && prevIsPresent === false) {
        if (this.isExitComplete) {
          const { initial, custom } = this.node.getProps();
          if (typeof initial === "string") {
            const resolved = motionDom.resolveVariant(this.node, initial, custom);
            if (resolved) {
              const { transition, transitionEnd, ...target } = resolved;
              for (const key in target) {
                this.node.getValue(key)?.jump(target[key]);
              }
            }
          }
          this.node.animationState.reset();
          this.node.animationState.animateChanges();
        } else {
          this.node.animationState.setActive("exit", false);
        }
        this.isExitComplete = false;
        return;
      }
      const exitAnimation = this.node.animationState.setActive("exit", !isPresent2);
      if (onExitComplete && !isPresent2) {
        exitAnimation.then(() => {
          this.isExitComplete = true;
          onExitComplete(this.id);
        });
      }
    }
    mount() {
      const { register, onExitComplete } = this.node.presenceContext || {};
      if (onExitComplete) {
        onExitComplete(this.id);
      }
      if (register) {
        this.unmount = register(this.id);
      }
    }
    unmount() {
    }
  }
  const animations = {
    animation: {
      Feature: AnimationFeature
    },
    exit: {
      Feature: ExitAnimationFeature
    }
  };
  function extractEventInfo(event) {
    return {
      point: {
        x: event.pageX,
        y: event.pageY
      }
    };
  }
  const addPointerInfo = (handler) => (event) => motionDom.isPrimaryPointer(event) && handler(event, extractEventInfo(event));
  function addPointerEvent(target, eventName, handler, options) {
    return motionDom.addDomEvent(target, eventName, addPointerInfo(handler), options);
  }
  const getContextWindow = ({ current }) => {
    return current ? current.ownerDocument.defaultView : null;
  };
  const distance = (a, b) => Math.abs(a - b);
  function distance2D(a, b) {
    const xDelta = distance(a.x, b.x);
    const yDelta = distance(a.y, b.y);
    return Math.sqrt(xDelta ** 2 + yDelta ** 2);
  }
  const overflowStyles = /* @__PURE__ */ new Set(["auto", "scroll"]);
  class PanSession {
    constructor(event, handlers, { transformPagePoint, contextWindow = window, dragSnapToOrigin = false, distanceThreshold = 3, element } = {}) {
      this.startEvent = null;
      this.lastMoveEvent = null;
      this.lastMoveEventInfo = null;
      this.lastRawMoveEventInfo = null;
      this.handlers = {};
      this.contextWindow = window;
      this.scrollPositions = /* @__PURE__ */ new Map();
      this.removeScrollListeners = null;
      this.onElementScroll = (event2) => {
        this.handleScroll(event2.target);
      };
      this.onWindowScroll = () => {
        this.handleScroll(window);
      };
      this.updatePoint = () => {
        if (!(this.lastMoveEvent && this.lastMoveEventInfo))
          return;
        if (this.lastRawMoveEventInfo) {
          this.lastMoveEventInfo = transformPoint(this.lastRawMoveEventInfo, this.transformPagePoint);
        }
        const info2 = getPanInfo(this.lastMoveEventInfo, this.history);
        const isPanStarted = this.startEvent !== null;
        const isDistancePastThreshold = distance2D(info2.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
        if (!isPanStarted && !isDistancePastThreshold)
          return;
        const { point: point2 } = info2;
        const { timestamp: timestamp2 } = motionDom.frameData;
        this.history.push({ ...point2, timestamp: timestamp2 });
        const { onStart, onMove } = this.handlers;
        if (!isPanStarted) {
          onStart && onStart(this.lastMoveEvent, info2);
          this.startEvent = this.lastMoveEvent;
        }
        onMove && onMove(this.lastMoveEvent, info2);
      };
      this.handlePointerMove = (event2, info2) => {
        this.lastMoveEvent = event2;
        this.lastRawMoveEventInfo = info2;
        this.lastMoveEventInfo = transformPoint(info2, this.transformPagePoint);
        motionDom.frame.update(this.updatePoint, true);
      };
      this.handlePointerUp = (event2, info2) => {
        this.end();
        const { onEnd, onSessionEnd, resumeAnimation } = this.handlers;
        if (this.dragSnapToOrigin || !this.startEvent) {
          resumeAnimation && resumeAnimation();
        }
        if (!(this.lastMoveEvent && this.lastMoveEventInfo))
          return;
        const panInfo = getPanInfo(event2.type === "pointercancel" ? this.lastMoveEventInfo : transformPoint(info2, this.transformPagePoint), this.history);
        if (this.startEvent && onEnd) {
          onEnd(event2, panInfo);
        }
        onSessionEnd && onSessionEnd(event2, panInfo);
      };
      if (!motionDom.isPrimaryPointer(event))
        return;
      this.dragSnapToOrigin = dragSnapToOrigin;
      this.handlers = handlers;
      this.transformPagePoint = transformPagePoint;
      this.distanceThreshold = distanceThreshold;
      this.contextWindow = contextWindow || window;
      const info = extractEventInfo(event);
      const initialInfo = transformPoint(info, this.transformPagePoint);
      const { point } = initialInfo;
      const { timestamp } = motionDom.frameData;
      this.history = [{ ...point, timestamp }];
      const { onSessionStart } = handlers;
      onSessionStart && onSessionStart(event, getPanInfo(initialInfo, this.history));
      this.removeListeners = motionUtils.pipe(addPointerEvent(this.contextWindow, "pointermove", this.handlePointerMove), addPointerEvent(this.contextWindow, "pointerup", this.handlePointerUp), addPointerEvent(this.contextWindow, "pointercancel", this.handlePointerUp));
      if (element) {
        this.startScrollTracking(element);
      }
    }
    /**
     * Start tracking scroll on ancestors and window.
     */
    startScrollTracking(element) {
      let current = element.parentElement;
      while (current) {
        const style = getComputedStyle(current);
        if (overflowStyles.has(style.overflowX) || overflowStyles.has(style.overflowY)) {
          this.scrollPositions.set(current, {
            x: current.scrollLeft,
            y: current.scrollTop
          });
        }
        current = current.parentElement;
      }
      this.scrollPositions.set(window, {
        x: window.scrollX,
        y: window.scrollY
      });
      window.addEventListener("scroll", this.onElementScroll, {
        capture: true
      });
      window.addEventListener("scroll", this.onWindowScroll);
      this.removeScrollListeners = () => {
        window.removeEventListener("scroll", this.onElementScroll, {
          capture: true
        });
        window.removeEventListener("scroll", this.onWindowScroll);
      };
    }
    /**
     * Handle scroll compensation during drag.
     *
     * For element scroll: adjusts history origin since pageX/pageY doesn't change.
     * For window scroll: adjusts lastMoveEventInfo since pageX/pageY would change.
     */
    handleScroll(target) {
      const initial = this.scrollPositions.get(target);
      if (!initial)
        return;
      const isWindow = target === window;
      const current = isWindow ? { x: window.scrollX, y: window.scrollY } : {
        x: target.scrollLeft,
        y: target.scrollTop
      };
      const delta = { x: current.x - initial.x, y: current.y - initial.y };
      if (delta.x === 0 && delta.y === 0)
        return;
      if (isWindow) {
        if (this.lastMoveEventInfo) {
          this.lastMoveEventInfo.point.x += delta.x;
          this.lastMoveEventInfo.point.y += delta.y;
        }
      } else {
        if (this.history.length > 0) {
          this.history[0].x -= delta.x;
          this.history[0].y -= delta.y;
        }
      }
      this.scrollPositions.set(target, current);
      motionDom.frame.update(this.updatePoint, true);
    }
    updateHandlers(handlers) {
      this.handlers = handlers;
    }
    end() {
      this.removeListeners && this.removeListeners();
      this.removeScrollListeners && this.removeScrollListeners();
      this.scrollPositions.clear();
      motionDom.cancelFrame(this.updatePoint);
    }
  }
  function transformPoint(info, transformPagePoint) {
    return transformPagePoint ? { point: transformPagePoint(info.point) } : info;
  }
  function subtractPoint(a, b) {
    return { x: a.x - b.x, y: a.y - b.y };
  }
  function getPanInfo({ point }, history) {
    return {
      point,
      delta: subtractPoint(point, lastDevicePoint(history)),
      offset: subtractPoint(point, startDevicePoint(history)),
      velocity: getVelocity(history, 0.1)
    };
  }
  function startDevicePoint(history) {
    return history[0];
  }
  function lastDevicePoint(history) {
    return history[history.length - 1];
  }
  function getVelocity(history, timeDelta) {
    if (history.length < 2) {
      return { x: 0, y: 0 };
    }
    let i = history.length - 1;
    let timestampedPoint = null;
    const lastPoint = lastDevicePoint(history);
    while (i >= 0) {
      timestampedPoint = history[i];
      if (lastPoint.timestamp - timestampedPoint.timestamp > motionUtils.secondsToMilliseconds(timeDelta)) {
        break;
      }
      i--;
    }
    if (!timestampedPoint) {
      return { x: 0, y: 0 };
    }
    if (timestampedPoint === history[0] && history.length > 2 && lastPoint.timestamp - timestampedPoint.timestamp > motionUtils.secondsToMilliseconds(timeDelta) * 2) {
      timestampedPoint = history[1];
    }
    const time = motionUtils.millisecondsToSeconds(lastPoint.timestamp - timestampedPoint.timestamp);
    if (time === 0) {
      return { x: 0, y: 0 };
    }
    const currentVelocity = {
      x: (lastPoint.x - timestampedPoint.x) / time,
      y: (lastPoint.y - timestampedPoint.y) / time
    };
    if (currentVelocity.x === Infinity) {
      currentVelocity.x = 0;
    }
    if (currentVelocity.y === Infinity) {
      currentVelocity.y = 0;
    }
    return currentVelocity;
  }
  function applyConstraints(point, { min, max }, elastic) {
    if (min !== void 0 && point < min) {
      point = elastic ? motionDom.mixNumber(min, point, elastic.min) : Math.max(point, min);
    } else if (max !== void 0 && point > max) {
      point = elastic ? motionDom.mixNumber(max, point, elastic.max) : Math.min(point, max);
    }
    return point;
  }
  function calcRelativeAxisConstraints(axis, min, max) {
    return {
      min: min !== void 0 ? axis.min + min : void 0,
      max: max !== void 0 ? axis.max + max - (axis.max - axis.min) : void 0
    };
  }
  function calcRelativeConstraints(layoutBox, { top, left, bottom, right }) {
    return {
      x: calcRelativeAxisConstraints(layoutBox.x, left, right),
      y: calcRelativeAxisConstraints(layoutBox.y, top, bottom)
    };
  }
  function calcViewportAxisConstraints(layoutAxis, constraintsAxis) {
    let min = constraintsAxis.min - layoutAxis.min;
    let max = constraintsAxis.max - layoutAxis.max;
    if (constraintsAxis.max - constraintsAxis.min < layoutAxis.max - layoutAxis.min) {
      [min, max] = [max, min];
    }
    return { min, max };
  }
  function calcViewportConstraints(layoutBox, constraintsBox) {
    return {
      x: calcViewportAxisConstraints(layoutBox.x, constraintsBox.x),
      y: calcViewportAxisConstraints(layoutBox.y, constraintsBox.y)
    };
  }
  function calcOrigin(source, target) {
    let origin = 0.5;
    const sourceLength = motionDom.calcLength(source);
    const targetLength = motionDom.calcLength(target);
    if (targetLength > sourceLength) {
      origin = motionUtils.progress(target.min, target.max - sourceLength, source.min);
    } else if (sourceLength > targetLength) {
      origin = motionUtils.progress(source.min, source.max - targetLength, target.min);
    }
    return motionUtils.clamp(0, 1, origin);
  }
  function rebaseAxisConstraints(layout2, constraints) {
    const relativeConstraints = {};
    if (constraints.min !== void 0) {
      relativeConstraints.min = constraints.min - layout2.min;
    }
    if (constraints.max !== void 0) {
      relativeConstraints.max = constraints.max - layout2.min;
    }
    return relativeConstraints;
  }
  const defaultElastic = 0.35;
  function resolveDragElastic(dragElastic = defaultElastic) {
    if (dragElastic === false) {
      dragElastic = 0;
    } else if (dragElastic === true) {
      dragElastic = defaultElastic;
    }
    return {
      x: resolveAxisElastic(dragElastic, "left", "right"),
      y: resolveAxisElastic(dragElastic, "top", "bottom")
    };
  }
  function resolveAxisElastic(dragElastic, minLabel, maxLabel) {
    return {
      min: resolvePointElastic(dragElastic, minLabel),
      max: resolvePointElastic(dragElastic, maxLabel)
    };
  }
  function resolvePointElastic(dragElastic, label) {
    return typeof dragElastic === "number" ? dragElastic : dragElastic[label] || 0;
  }
  const elementDragControls = /* @__PURE__ */ new WeakMap();
  class VisualElementDragControls {
    constructor(visualElement) {
      this.openDragLock = null;
      this.isDragging = false;
      this.currentDirection = null;
      this.originPoint = { x: 0, y: 0 };
      this.constraints = false;
      this.hasMutatedConstraints = false;
      this.elastic = motionDom.createBox();
      this.latestPointerEvent = null;
      this.latestPanInfo = null;
      this.visualElement = visualElement;
    }
    start(originEvent, { snapToCursor = false, distanceThreshold } = {}) {
      const { presenceContext } = this.visualElement;
      if (presenceContext && presenceContext.isPresent === false)
        return;
      const onSessionStart = (event) => {
        if (snapToCursor) {
          this.snapToCursor(extractEventInfo(event).point);
        }
        this.stopAnimation();
      };
      const onStart = (event, info) => {
        const { drag: drag2, dragPropagation, onDragStart } = this.getProps();
        if (drag2 && !dragPropagation) {
          if (this.openDragLock)
            this.openDragLock();
          this.openDragLock = motionDom.setDragLock(drag2);
          if (!this.openDragLock)
            return;
        }
        this.latestPointerEvent = event;
        this.latestPanInfo = info;
        this.isDragging = true;
        this.currentDirection = null;
        this.resolveConstraints();
        if (this.visualElement.projection) {
          this.visualElement.projection.isAnimationBlocked = true;
          this.visualElement.projection.target = void 0;
        }
        motionDom.eachAxis((axis) => {
          let current = this.getAxisMotionValue(axis).get() || 0;
          if (motionDom.percent.test(current)) {
            const { projection } = this.visualElement;
            if (projection && projection.layout) {
              const measuredAxis = projection.layout.layoutBox[axis];
              if (measuredAxis) {
                const length = motionDom.calcLength(measuredAxis);
                current = length * (parseFloat(current) / 100);
              }
            }
          }
          this.originPoint[axis] = current;
        });
        if (onDragStart) {
          motionDom.frame.update(() => onDragStart(event, info), false, true);
        }
        motionDom.addValueToWillChange(this.visualElement, "transform");
        const { animationState } = this.visualElement;
        animationState && animationState.setActive("whileDrag", true);
      };
      const onMove = (event, info) => {
        this.latestPointerEvent = event;
        this.latestPanInfo = info;
        const { dragPropagation, dragDirectionLock, onDirectionLock, onDrag } = this.getProps();
        if (!dragPropagation && !this.openDragLock)
          return;
        const { offset } = info;
        if (dragDirectionLock && this.currentDirection === null) {
          this.currentDirection = getCurrentDirection(offset);
          if (this.currentDirection !== null) {
            onDirectionLock && onDirectionLock(this.currentDirection);
          }
          return;
        }
        this.updateAxis("x", info.point, offset);
        this.updateAxis("y", info.point, offset);
        this.visualElement.render();
        if (onDrag) {
          motionDom.frame.update(() => onDrag(event, info), false, true);
        }
      };
      const onSessionEnd = (event, info) => {
        this.latestPointerEvent = event;
        this.latestPanInfo = info;
        this.stop(event, info);
        this.latestPointerEvent = null;
        this.latestPanInfo = null;
      };
      const resumeAnimation = () => {
        const { dragSnapToOrigin: snap } = this.getProps();
        if (snap || this.constraints) {
          this.startAnimation({ x: 0, y: 0 });
        }
      };
      const { dragSnapToOrigin } = this.getProps();
      this.panSession = new PanSession(originEvent, {
        onSessionStart,
        onStart,
        onMove,
        onSessionEnd,
        resumeAnimation
      }, {
        transformPagePoint: this.visualElement.getTransformPagePoint(),
        dragSnapToOrigin,
        distanceThreshold,
        contextWindow: getContextWindow(this.visualElement),
        element: this.visualElement.current
      });
    }
    /**
     * @internal
     */
    stop(event, panInfo) {
      const finalEvent = event || this.latestPointerEvent;
      const finalPanInfo = panInfo || this.latestPanInfo;
      const isDragging = this.isDragging;
      this.cancel();
      if (!isDragging || !finalPanInfo || !finalEvent)
        return;
      const { velocity } = finalPanInfo;
      this.startAnimation(velocity);
      const { onDragEnd } = this.getProps();
      if (onDragEnd) {
        motionDom.frame.postRender(() => onDragEnd(finalEvent, finalPanInfo));
      }
    }
    /**
     * @internal
     */
    cancel() {
      this.isDragging = false;
      const { projection, animationState } = this.visualElement;
      if (projection) {
        projection.isAnimationBlocked = false;
      }
      this.endPanSession();
      const { dragPropagation } = this.getProps();
      if (!dragPropagation && this.openDragLock) {
        this.openDragLock();
        this.openDragLock = null;
      }
      animationState && animationState.setActive("whileDrag", false);
    }
    /**
     * Clean up the pan session without modifying other drag state.
     * This is used during unmount to ensure event listeners are removed
     * without affecting projection animations or drag locks.
     * @internal
     */
    endPanSession() {
      this.panSession && this.panSession.end();
      this.panSession = void 0;
    }
    updateAxis(axis, _point, offset) {
      const { drag: drag2 } = this.getProps();
      if (!offset || !shouldDrag(axis, drag2, this.currentDirection))
        return;
      const axisValue = this.getAxisMotionValue(axis);
      let next = this.originPoint[axis] + offset[axis];
      if (this.constraints && this.constraints[axis]) {
        next = applyConstraints(next, this.constraints[axis], this.elastic[axis]);
      }
      axisValue.set(next);
    }
    resolveConstraints() {
      const { dragConstraints, dragElastic } = this.getProps();
      const layout2 = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(false) : this.visualElement.projection?.layout;
      const prevConstraints = this.constraints;
      if (dragConstraints && isRefObject(dragConstraints)) {
        if (!this.constraints) {
          this.constraints = this.resolveRefConstraints();
        }
      } else {
        if (dragConstraints && layout2) {
          this.constraints = calcRelativeConstraints(layout2.layoutBox, dragConstraints);
        } else {
          this.constraints = false;
        }
      }
      this.elastic = resolveDragElastic(dragElastic);
      if (prevConstraints !== this.constraints && !isRefObject(dragConstraints) && layout2 && this.constraints && !this.hasMutatedConstraints) {
        motionDom.eachAxis((axis) => {
          if (this.constraints !== false && this.getAxisMotionValue(axis)) {
            this.constraints[axis] = rebaseAxisConstraints(layout2.layoutBox[axis], this.constraints[axis]);
          }
        });
      }
    }
    resolveRefConstraints() {
      const { dragConstraints: constraints, onMeasureDragConstraints } = this.getProps();
      if (!constraints || !isRefObject(constraints))
        return false;
      const constraintsElement = constraints.current;
      motionUtils.invariant(constraintsElement !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.", "drag-constraints-ref");
      const { projection } = this.visualElement;
      if (!projection || !projection.layout)
        return false;
      const constraintsBox = motionDom.measurePageBox(constraintsElement, projection.root, this.visualElement.getTransformPagePoint());
      let measuredConstraints = calcViewportConstraints(projection.layout.layoutBox, constraintsBox);
      if (onMeasureDragConstraints) {
        const userConstraints = onMeasureDragConstraints(motionDom.convertBoxToBoundingBox(measuredConstraints));
        this.hasMutatedConstraints = !!userConstraints;
        if (userConstraints) {
          measuredConstraints = motionDom.convertBoundingBoxToBox(userConstraints);
        }
      }
      return measuredConstraints;
    }
    startAnimation(velocity) {
      const { drag: drag2, dragMomentum, dragElastic, dragTransition, dragSnapToOrigin, onDragTransitionEnd } = this.getProps();
      const constraints = this.constraints || {};
      const momentumAnimations = motionDom.eachAxis((axis) => {
        if (!shouldDrag(axis, drag2, this.currentDirection)) {
          return;
        }
        let transition = constraints && constraints[axis] || {};
        if (dragSnapToOrigin === true || dragSnapToOrigin === axis)
          transition = { min: 0, max: 0 };
        const bounceStiffness = dragElastic ? 200 : 1e6;
        const bounceDamping = dragElastic ? 40 : 1e7;
        const inertia = {
          type: "inertia",
          velocity: dragMomentum ? velocity[axis] : 0,
          bounceStiffness,
          bounceDamping,
          timeConstant: 750,
          restDelta: 1,
          restSpeed: 10,
          ...dragTransition,
          ...transition
        };
        return this.startAxisValueAnimation(axis, inertia);
      });
      return Promise.all(momentumAnimations).then(onDragTransitionEnd);
    }
    startAxisValueAnimation(axis, transition) {
      const axisValue = this.getAxisMotionValue(axis);
      motionDom.addValueToWillChange(this.visualElement, axis);
      return axisValue.start(motionDom.animateMotionValue(axis, axisValue, 0, transition, this.visualElement, false));
    }
    stopAnimation() {
      motionDom.eachAxis((axis) => this.getAxisMotionValue(axis).stop());
    }
    /**
     * Drag works differently depending on which props are provided.
     *
     * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
     * - Otherwise, we apply the delta to the x/y motion values.
     */
    getAxisMotionValue(axis) {
      const dragKey = `_drag${axis.toUpperCase()}`;
      const props = this.visualElement.getProps();
      const externalMotionValue = props[dragKey];
      return externalMotionValue ? externalMotionValue : this.visualElement.getValue(axis, (props.initial ? props.initial[axis] : void 0) || 0);
    }
    snapToCursor(point) {
      motionDom.eachAxis((axis) => {
        const { drag: drag2 } = this.getProps();
        if (!shouldDrag(axis, drag2, this.currentDirection))
          return;
        const { projection } = this.visualElement;
        const axisValue = this.getAxisMotionValue(axis);
        if (projection && projection.layout) {
          const { min, max } = projection.layout.layoutBox[axis];
          const current = axisValue.get() || 0;
          axisValue.set(point[axis] - motionDom.mixNumber(min, max, 0.5) + current);
        }
      });
    }
    /**
     * When the viewport resizes we want to check if the measured constraints
     * have changed and, if so, reposition the element within those new constraints
     * relative to where it was before the resize.
     */
    scalePositionWithinConstraints() {
      if (!this.visualElement.current)
        return;
      const { drag: drag2, dragConstraints } = this.getProps();
      const { projection } = this.visualElement;
      if (!isRefObject(dragConstraints) || !projection || !this.constraints)
        return;
      this.stopAnimation();
      const boxProgress = { x: 0, y: 0 };
      motionDom.eachAxis((axis) => {
        const axisValue = this.getAxisMotionValue(axis);
        if (axisValue && this.constraints !== false) {
          const latest = axisValue.get();
          boxProgress[axis] = calcOrigin({ min: latest, max: latest }, this.constraints[axis]);
        }
      });
      const { transformTemplate } = this.visualElement.getProps();
      this.visualElement.current.style.transform = transformTemplate ? transformTemplate({}, "") : "none";
      projection.root && projection.root.updateScroll();
      projection.updateLayout();
      this.constraints = false;
      this.resolveConstraints();
      motionDom.eachAxis((axis) => {
        if (!shouldDrag(axis, drag2, null))
          return;
        const axisValue = this.getAxisMotionValue(axis);
        const { min, max } = this.constraints[axis];
        axisValue.set(motionDom.mixNumber(min, max, boxProgress[axis]));
      });
      this.visualElement.render();
    }
    addListeners() {
      if (!this.visualElement.current)
        return;
      elementDragControls.set(this.visualElement, this);
      const element = this.visualElement.current;
      const stopPointerListener = addPointerEvent(element, "pointerdown", (event) => {
        const { drag: drag2, dragListener = true } = this.getProps();
        const target = event.target;
        const isClickingTextInputChild = target !== element && motionDom.isElementTextInput(target);
        if (drag2 && dragListener && !isClickingTextInputChild) {
          this.start(event);
        }
      });
      let stopResizeObservers;
      const measureDragConstraints = () => {
        const { dragConstraints } = this.getProps();
        if (isRefObject(dragConstraints) && dragConstraints.current) {
          this.constraints = this.resolveRefConstraints();
          if (!stopResizeObservers) {
            stopResizeObservers = startResizeObservers(element, dragConstraints.current, () => this.scalePositionWithinConstraints());
          }
        }
      };
      const { projection } = this.visualElement;
      const stopMeasureLayoutListener = projection.addEventListener("measure", measureDragConstraints);
      if (projection && !projection.layout) {
        projection.root && projection.root.updateScroll();
        projection.updateLayout();
      }
      motionDom.frame.read(measureDragConstraints);
      const stopResizeListener = motionDom.addDomEvent(window, "resize", () => this.scalePositionWithinConstraints());
      const stopLayoutUpdateListener = projection.addEventListener("didUpdate", (({ delta, hasLayoutChanged }) => {
        if (this.isDragging && hasLayoutChanged) {
          motionDom.eachAxis((axis) => {
            const motionValue = this.getAxisMotionValue(axis);
            if (!motionValue)
              return;
            this.originPoint[axis] += delta[axis].translate;
            motionValue.set(motionValue.get() + delta[axis].translate);
          });
          this.visualElement.render();
        }
      }));
      return () => {
        stopResizeListener();
        stopPointerListener();
        stopMeasureLayoutListener();
        stopLayoutUpdateListener && stopLayoutUpdateListener();
        stopResizeObservers && stopResizeObservers();
      };
    }
    getProps() {
      const props = this.visualElement.getProps();
      const { drag: drag2 = false, dragDirectionLock = false, dragPropagation = false, dragConstraints = false, dragElastic = defaultElastic, dragMomentum = true } = props;
      return {
        ...props,
        drag: drag2,
        dragDirectionLock,
        dragPropagation,
        dragConstraints,
        dragElastic,
        dragMomentum
      };
    }
  }
  function skipFirstCall(callback) {
    let isFirst = true;
    return () => {
      if (isFirst) {
        isFirst = false;
        return;
      }
      callback();
    };
  }
  function startResizeObservers(element, constraintsElement, onResize) {
    const stopElement = motionDom.resize(element, skipFirstCall(onResize));
    const stopContainer = motionDom.resize(constraintsElement, skipFirstCall(onResize));
    return () => {
      stopElement();
      stopContainer();
    };
  }
  function shouldDrag(direction, drag2, currentDirection) {
    return (drag2 === true || drag2 === direction) && (currentDirection === null || currentDirection === direction);
  }
  function getCurrentDirection(offset, lockThreshold = 10) {
    let direction = null;
    if (Math.abs(offset.y) > lockThreshold) {
      direction = "y";
    } else if (Math.abs(offset.x) > lockThreshold) {
      direction = "x";
    }
    return direction;
  }
  class DragGesture extends motionDom.Feature {
    constructor(node) {
      super(node);
      this.removeGroupControls = motionUtils.noop;
      this.removeListeners = motionUtils.noop;
      this.controls = new VisualElementDragControls(node);
    }
    mount() {
      const { dragControls } = this.node.getProps();
      if (dragControls) {
        this.removeGroupControls = dragControls.subscribe(this.controls);
      }
      this.removeListeners = this.controls.addListeners() || motionUtils.noop;
    }
    update() {
      const { dragControls } = this.node.getProps();
      const { dragControls: prevDragControls } = this.node.prevProps || {};
      if (dragControls !== prevDragControls) {
        this.removeGroupControls();
        if (dragControls) {
          this.removeGroupControls = dragControls.subscribe(this.controls);
        }
      }
    }
    unmount() {
      this.removeGroupControls();
      this.removeListeners();
      if (!this.controls.isDragging) {
        this.controls.endPanSession();
      }
    }
  }
  const asyncHandler = (handler) => (event, info) => {
    if (handler) {
      motionDom.frame.update(() => handler(event, info), false, true);
    }
  };
  class PanGesture extends motionDom.Feature {
    constructor() {
      super(...arguments);
      this.removePointerDownListener = motionUtils.noop;
    }
    onPointerDown(pointerDownEvent) {
      this.session = new PanSession(pointerDownEvent, this.createPanHandlers(), {
        transformPagePoint: this.node.getTransformPagePoint(),
        contextWindow: getContextWindow(this.node)
      });
    }
    createPanHandlers() {
      const { onPanSessionStart, onPanStart, onPan, onPanEnd } = this.node.getProps();
      return {
        onSessionStart: asyncHandler(onPanSessionStart),
        onStart: asyncHandler(onPanStart),
        onMove: asyncHandler(onPan),
        onEnd: (event, info) => {
          delete this.session;
          if (onPanEnd) {
            motionDom.frame.postRender(() => onPanEnd(event, info));
          }
        }
      };
    }
    mount() {
      this.removePointerDownListener = addPointerEvent(this.node.current, "pointerdown", (event) => this.onPointerDown(event));
    }
    update() {
      this.session && this.session.updateHandlers(this.createPanHandlers());
    }
    unmount() {
      this.removePointerDownListener();
      this.session && this.session.end();
    }
  }
  let hasTakenAnySnapshot = false;
  class MeasureLayoutWithContext extends React.Component {
    /**
     * This only mounts projection nodes for components that
     * need measuring, we might want to do it for all components
     * in order to incorporate transforms
     */
    componentDidMount() {
      const { visualElement, layoutGroup, switchLayoutGroup, layoutId } = this.props;
      const { projection } = visualElement;
      if (projection) {
        if (layoutGroup.group)
          layoutGroup.group.add(projection);
        if (switchLayoutGroup && switchLayoutGroup.register && layoutId) {
          switchLayoutGroup.register(projection);
        }
        if (hasTakenAnySnapshot) {
          projection.root.didUpdate();
        }
        projection.addEventListener("animationComplete", () => {
          this.safeToRemove();
        });
        projection.setOptions({
          ...projection.options,
          layoutDependency: this.props.layoutDependency,
          onExitComplete: () => this.safeToRemove()
        });
      }
      motionDom.globalProjectionState.hasEverUpdated = true;
    }
    getSnapshotBeforeUpdate(prevProps) {
      const { layoutDependency, visualElement, drag: drag2, isPresent: isPresent2 } = this.props;
      const { projection } = visualElement;
      if (!projection)
        return null;
      projection.isPresent = isPresent2;
      if (prevProps.layoutDependency !== layoutDependency) {
        projection.setOptions({
          ...projection.options,
          layoutDependency
        });
      }
      hasTakenAnySnapshot = true;
      if (drag2 || prevProps.layoutDependency !== layoutDependency || layoutDependency === void 0 || prevProps.isPresent !== isPresent2) {
        projection.willUpdate();
      } else {
        this.safeToRemove();
      }
      if (prevProps.isPresent !== isPresent2) {
        if (isPresent2) {
          projection.promote();
        } else if (!projection.relegate()) {
          motionDom.frame.postRender(() => {
            const stack = projection.getStack();
            if (!stack || !stack.members.length) {
              this.safeToRemove();
            }
          });
        }
      }
      return null;
    }
    componentDidUpdate() {
      const { visualElement, layoutAnchor } = this.props;
      const { projection } = visualElement;
      if (projection) {
        projection.options.layoutAnchor = layoutAnchor;
        projection.root.didUpdate();
        motionDom.microtask.postRender(() => {
          if (!projection.currentAnimation && projection.isLead()) {
            this.safeToRemove();
          }
        });
      }
    }
    componentWillUnmount() {
      const { visualElement, layoutGroup, switchLayoutGroup: promoteContext } = this.props;
      const { projection } = visualElement;
      hasTakenAnySnapshot = true;
      if (projection) {
        projection.scheduleCheckAfterUnmount();
        if (layoutGroup && layoutGroup.group)
          layoutGroup.group.remove(projection);
        if (promoteContext && promoteContext.deregister)
          promoteContext.deregister(projection);
      }
    }
    safeToRemove() {
      const { safeToRemove } = this.props;
      safeToRemove && safeToRemove();
    }
    render() {
      return null;
    }
  }
  function MeasureLayout(props) {
    const [isPresent2, safeToRemove] = usePresence();
    const layoutGroup = React.useContext(LayoutGroupContext);
    return jsxRuntime.jsx(MeasureLayoutWithContext, { ...props, layoutGroup, switchLayoutGroup: React.useContext(SwitchLayoutGroupContext), isPresent: isPresent2, safeToRemove });
  }
  const drag = {
    pan: {
      Feature: PanGesture
    },
    drag: {
      Feature: DragGesture,
      ProjectionNode: motionDom.HTMLProjectionNode,
      MeasureLayout
    }
  };
  function handleHoverEvent(node, event, lifecycle) {
    const { props } = node;
    if (node.animationState && props.whileHover) {
      node.animationState.setActive("whileHover", lifecycle === "Start");
    }
    const eventName = "onHover" + lifecycle;
    const callback = props[eventName];
    if (callback) {
      motionDom.frame.postRender(() => callback(event, extractEventInfo(event)));
    }
  }
  class HoverGesture extends motionDom.Feature {
    mount() {
      const { current } = this.node;
      if (!current)
        return;
      this.unmount = motionDom.hover(current, (_element, startEvent) => {
        handleHoverEvent(this.node, startEvent, "Start");
        return (endEvent) => handleHoverEvent(this.node, endEvent, "End");
      });
    }
    unmount() {
    }
  }
  class FocusGesture extends motionDom.Feature {
    constructor() {
      super(...arguments);
      this.isActive = false;
    }
    onFocus() {
      let isFocusVisible = false;
      try {
        isFocusVisible = this.node.current.matches(":focus-visible");
      } catch (e) {
        isFocusVisible = true;
      }
      if (!isFocusVisible || !this.node.animationState)
        return;
      this.node.animationState.setActive("whileFocus", true);
      this.isActive = true;
    }
    onBlur() {
      if (!this.isActive || !this.node.animationState)
        return;
      this.node.animationState.setActive("whileFocus", false);
      this.isActive = false;
    }
    mount() {
      this.unmount = motionUtils.pipe(motionDom.addDomEvent(this.node.current, "focus", () => this.onFocus()), motionDom.addDomEvent(this.node.current, "blur", () => this.onBlur()));
    }
    unmount() {
    }
  }
  function handlePressEvent(node, event, lifecycle) {
    const { props } = node;
    if (node.current instanceof HTMLButtonElement && node.current.disabled) {
      return;
    }
    if (node.animationState && props.whileTap) {
      node.animationState.setActive("whileTap", lifecycle === "Start");
    }
    const eventName = "onTap" + (lifecycle === "End" ? "" : lifecycle);
    const callback = props[eventName];
    if (callback) {
      motionDom.frame.postRender(() => callback(event, extractEventInfo(event)));
    }
  }
  class PressGesture extends motionDom.Feature {
    mount() {
      const { current } = this.node;
      if (!current)
        return;
      const { globalTapTarget, propagate } = this.node.props;
      this.unmount = motionDom.press(current, (_element, startEvent) => {
        handlePressEvent(this.node, startEvent, "Start");
        return (endEvent, { success }) => handlePressEvent(this.node, endEvent, success ? "End" : "Cancel");
      }, {
        useGlobalTarget: globalTapTarget,
        stopPropagation: propagate?.tap === false
      });
    }
    unmount() {
    }
  }
  const observerCallbacks = /* @__PURE__ */ new WeakMap();
  const observers = /* @__PURE__ */ new WeakMap();
  const fireObserverCallback = (entry) => {
    const callback = observerCallbacks.get(entry.target);
    callback && callback(entry);
  };
  const fireAllObserverCallbacks = (entries) => {
    entries.forEach(fireObserverCallback);
  };
  function initIntersectionObserver({ root, ...options }) {
    const lookupRoot = root || document;
    if (!observers.has(lookupRoot)) {
      observers.set(lookupRoot, {});
    }
    const rootObservers = observers.get(lookupRoot);
    const key = JSON.stringify(options);
    if (!rootObservers[key]) {
      rootObservers[key] = new IntersectionObserver(fireAllObserverCallbacks, { root, ...options });
    }
    return rootObservers[key];
  }
  function observeIntersection(element, options, callback) {
    const rootInteresectionObserver = initIntersectionObserver(options);
    observerCallbacks.set(element, callback);
    rootInteresectionObserver.observe(element);
    return () => {
      observerCallbacks.delete(element);
      rootInteresectionObserver.unobserve(element);
    };
  }
  const thresholdNames = {
    some: 0,
    all: 1
  };
  class InViewFeature extends motionDom.Feature {
    constructor() {
      super(...arguments);
      this.hasEnteredView = false;
      this.isInView = false;
    }
    startObserver() {
      this.stopObserver?.();
      const { viewport = {} } = this.node.getProps();
      const { root, margin: rootMargin, amount = "some", once } = viewport;
      const options = {
        root: root ? root.current : void 0,
        rootMargin,
        threshold: typeof amount === "number" ? amount : thresholdNames[amount]
      };
      const onIntersectionUpdate = (entry) => {
        const { isIntersecting } = entry;
        if (this.isInView === isIntersecting)
          return;
        this.isInView = isIntersecting;
        if (once && !isIntersecting && this.hasEnteredView) {
          return;
        } else if (isIntersecting) {
          this.hasEnteredView = true;
        }
        if (this.node.animationState) {
          this.node.animationState.setActive("whileInView", isIntersecting);
        }
        const { onViewportEnter, onViewportLeave } = this.node.getProps();
        const callback = isIntersecting ? onViewportEnter : onViewportLeave;
        callback && callback(entry);
      };
      this.stopObserver = observeIntersection(this.node.current, options, onIntersectionUpdate);
    }
    mount() {
      this.startObserver();
    }
    update() {
      if (typeof IntersectionObserver === "undefined")
        return;
      const { props, prevProps } = this.node;
      const hasOptionsChanged = ["amount", "margin", "root"].some(hasViewportOptionChanged(props, prevProps));
      if (hasOptionsChanged) {
        this.startObserver();
      }
    }
    unmount() {
      this.stopObserver?.();
      this.hasEnteredView = false;
      this.isInView = false;
    }
  }
  function hasViewportOptionChanged({ viewport = {} }, { viewport: prevViewport = {} } = {}) {
    return (name) => viewport[name] !== prevViewport[name];
  }
  const gestureAnimations = {
    inView: {
      Feature: InViewFeature
    },
    tap: {
      Feature: PressGesture
    },
    focus: {
      Feature: FocusGesture
    },
    hover: {
      Feature: HoverGesture
    }
  };
  const layout = {
    layout: {
      ProjectionNode: motionDom.HTMLProjectionNode,
      MeasureLayout
    }
  };
  const featureBundle = {
    ...animations,
    ...gestureAnimations,
    ...drag,
    ...layout
  };
  featureBundleBieBX2Jn.LayoutGroupContext = LayoutGroupContext;
  featureBundleBieBX2Jn.LazyContext = LazyContext;
  featureBundleBieBX2Jn.MotionConfigContext = MotionConfigContext;
  featureBundleBieBX2Jn.MotionContext = MotionContext;
  featureBundleBieBX2Jn.PresenceContext = PresenceContext;
  featureBundleBieBX2Jn.SwitchLayoutGroupContext = SwitchLayoutGroupContext;
  featureBundleBieBX2Jn.addPointerEvent = addPointerEvent;
  featureBundleBieBX2Jn.addPointerInfo = addPointerInfo;
  featureBundleBieBX2Jn.animations = animations;
  featureBundleBieBX2Jn.createDomVisualElement = createDomVisualElement;
  featureBundleBieBX2Jn.createMotionComponent = createMotionComponent;
  featureBundleBieBX2Jn.distance = distance;
  featureBundleBieBX2Jn.distance2D = distance2D;
  featureBundleBieBX2Jn.drag = drag;
  featureBundleBieBX2Jn.featureBundle = featureBundle;
  featureBundleBieBX2Jn.filterProps = filterProps;
  featureBundleBieBX2Jn.gestureAnimations = gestureAnimations;
  featureBundleBieBX2Jn.isBrowser = isBrowser;
  featureBundleBieBX2Jn.isValidMotionProp = isValidMotionProp;
  featureBundleBieBX2Jn.layout = layout;
  featureBundleBieBX2Jn.loadExternalIsValidProp = loadExternalIsValidProp;
  featureBundleBieBX2Jn.loadFeatures = loadFeatures;
  featureBundleBieBX2Jn.makeUseVisualState = makeUseVisualState;
  featureBundleBieBX2Jn.motionComponentSymbol = motionComponentSymbol;
  featureBundleBieBX2Jn.useConstant = useConstant;
  featureBundleBieBX2Jn.useIsPresent = useIsPresent;
  featureBundleBieBX2Jn.useIsomorphicLayoutEffect = useIsomorphicLayoutEffect;
  featureBundleBieBX2Jn.usePresence = usePresence;
  return featureBundleBieBX2Jn;
}
var hasRequiredCjs;
function requireCjs() {
  if (hasRequiredCjs) return cjs$2;
  hasRequiredCjs = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var jsxRuntime = requireJsxRuntime();
    var React = requireReact();
    var featureBundle = /* @__PURE__ */ requireFeatureBundleBieBX2Jn();
    var motionDom = /* @__PURE__ */ requireCjs$1();
    var motionUtils = /* @__PURE__ */ requireCjs$2();
    function _interopNamespaceDefault(e) {
      var n = /* @__PURE__ */ Object.create(null);
      if (e) {
        Object.keys(e).forEach(function(k) {
          if (k !== "default") {
            var d = Object.getOwnPropertyDescriptor(e, k);
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: function() {
                return e[k];
              }
            });
          }
        });
      }
      n.default = e;
      return Object.freeze(n);
    }
    var React__namespace = /* @__PURE__ */ _interopNamespaceDefault(React);
    function setRef(ref, value) {
      if (typeof ref === "function") {
        return ref(value);
      } else if (ref !== null && ref !== void 0) {
        ref.current = value;
      }
    }
    function composeRefs(...refs) {
      return (node) => {
        let hasCleanup = false;
        const cleanups = refs.map((ref) => {
          const cleanup = setRef(ref, node);
          if (!hasCleanup && typeof cleanup === "function") {
            hasCleanup = true;
          }
          return cleanup;
        });
        if (hasCleanup) {
          return () => {
            for (let i = 0; i < cleanups.length; i++) {
              const cleanup = cleanups[i];
              if (typeof cleanup === "function") {
                cleanup();
              } else {
                setRef(refs[i], null);
              }
            }
          };
        }
      };
    }
    function useComposedRefs(...refs) {
      return React__namespace.useCallback(composeRefs(...refs), refs);
    }
    class PopChildMeasure extends React__namespace.Component {
      getSnapshotBeforeUpdate(prevProps) {
        const element = this.props.childRef.current;
        if (motionDom.isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
          const parent = element.offsetParent;
          const parentWidth = motionDom.isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
          const parentHeight = motionDom.isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
          const computedStyle = getComputedStyle(element);
          const size = this.props.sizeRef.current;
          size.height = parseFloat(computedStyle.height);
          size.width = parseFloat(computedStyle.width);
          size.top = element.offsetTop;
          size.left = element.offsetLeft;
          size.right = parentWidth - size.width - size.left;
          size.bottom = parentHeight - size.height - size.top;
        }
        return null;
      }
      /**
       * Required with getSnapshotBeforeUpdate to stop React complaining.
       */
      componentDidUpdate() {
      }
      render() {
        return this.props.children;
      }
    }
    function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
      const id2 = React.useId();
      const ref = React.useRef(null);
      const size = React.useRef({
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      });
      const { nonce } = React.useContext(featureBundle.MotionConfigContext);
      const childRef = children.props?.ref ?? children?.ref;
      const composedRef = useComposedRefs(ref, childRef);
      React.useInsertionEffect(() => {
        const { width, height, top, left, right, bottom } = size.current;
        if (isPresent || pop === false || !ref.current || !width || !height)
          return;
        const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
        const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
        ref.current.dataset.motionPopId = id2;
        const style = document.createElement("style");
        if (nonce)
          style.nonce = nonce;
        const parent = root ?? document.head;
        parent.appendChild(style);
        if (style.sheet) {
          style.sheet.insertRule(`
          [data-motion-pop-id="${id2}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
        }
        return () => {
          ref.current?.removeAttribute("data-motion-pop-id");
          if (parent.contains(style)) {
            parent.removeChild(style);
          }
        };
      }, [isPresent]);
      return jsxRuntime.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : React__namespace.cloneElement(children, { ref: composedRef }) });
    }
    const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
      const presenceChildren = featureBundle.useConstant(newChildrenMap);
      const id2 = React.useId();
      let isReusedContext = true;
      let context = React.useMemo(() => {
        isReusedContext = false;
        return {
          id: id2,
          initial,
          isPresent,
          custom,
          onExitComplete: (childId) => {
            presenceChildren.set(childId, true);
            for (const isComplete of presenceChildren.values()) {
              if (!isComplete)
                return;
            }
            onExitComplete && onExitComplete();
          },
          register: (childId) => {
            presenceChildren.set(childId, false);
            return () => presenceChildren.delete(childId);
          }
        };
      }, [isPresent, presenceChildren, onExitComplete]);
      if (presenceAffectsLayout && isReusedContext) {
        context = { ...context };
      }
      React.useMemo(() => {
        presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
      }, [isPresent]);
      React__namespace.useEffect(() => {
        !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
      }, [isPresent]);
      children = jsxRuntime.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
      return jsxRuntime.jsx(featureBundle.PresenceContext.Provider, { value: context, children });
    };
    function newChildrenMap() {
      return /* @__PURE__ */ new Map();
    }
    const getChildKey = (child) => child.key || "";
    function onlyElements(children) {
      const filtered = [];
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child))
          filtered.push(child);
      });
      return filtered;
    }
    const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
      const [isParentPresent, safeToRemove] = featureBundle.usePresence(propagate);
      const presentChildren = React.useMemo(() => onlyElements(children), [children]);
      const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
      const isInitialRender = React.useRef(true);
      const pendingPresentChildren = React.useRef(presentChildren);
      const exitComplete = featureBundle.useConstant(() => /* @__PURE__ */ new Map());
      const exitingComponents = React.useRef(/* @__PURE__ */ new Set());
      const [diffedChildren, setDiffedChildren] = React.useState(presentChildren);
      const [renderedChildren, setRenderedChildren] = React.useState(presentChildren);
      featureBundle.useIsomorphicLayoutEffect(() => {
        isInitialRender.current = false;
        pendingPresentChildren.current = presentChildren;
        for (let i = 0; i < renderedChildren.length; i++) {
          const key = getChildKey(renderedChildren[i]);
          if (!presentKeys.includes(key)) {
            if (exitComplete.get(key) !== true) {
              exitComplete.set(key, false);
            }
          } else {
            exitComplete.delete(key);
            exitingComponents.current.delete(key);
          }
        }
      }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
      const exitingChildren = [];
      if (presentChildren !== diffedChildren) {
        let nextChildren = [...presentChildren];
        for (let i = 0; i < renderedChildren.length; i++) {
          const child = renderedChildren[i];
          const key = getChildKey(child);
          if (!presentKeys.includes(key)) {
            nextChildren.splice(i, 0, child);
            exitingChildren.push(child);
          }
        }
        if (mode === "wait" && exitingChildren.length) {
          nextChildren = exitingChildren;
        }
        setRenderedChildren(onlyElements(nextChildren));
        setDiffedChildren(presentChildren);
        return null;
      }
      const { forceRender } = React.useContext(featureBundle.LayoutGroupContext);
      return jsxRuntime.jsx(jsxRuntime.Fragment, { children: renderedChildren.map((child) => {
        const key = getChildKey(child);
        const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
        const onExit = () => {
          if (exitingComponents.current.has(key)) {
            return;
          }
          if (exitComplete.has(key)) {
            exitingComponents.current.add(key);
            exitComplete.set(key, true);
          } else {
            return;
          }
          let isEveryExitComplete = true;
          exitComplete.forEach((isExitComplete) => {
            if (!isExitComplete)
              isEveryExitComplete = false;
          });
          if (isEveryExitComplete) {
            forceRender?.();
            setRenderedChildren(pendingPresentChildren.current);
            propagate && safeToRemove?.();
            onExitComplete && onExitComplete();
          }
        };
        return jsxRuntime.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
      }) });
    };
    const DeprecatedLayoutGroupContext = React.createContext(null);
    function useIsMounted() {
      const isMounted = React.useRef(false);
      featureBundle.useIsomorphicLayoutEffect(() => {
        isMounted.current = true;
        return () => {
          isMounted.current = false;
        };
      }, []);
      return isMounted;
    }
    function useForceUpdate() {
      const isMounted = useIsMounted();
      const [forcedRenderCount, setForcedRenderCount] = React.useState(0);
      const forceRender = React.useCallback(() => {
        isMounted.current && setForcedRenderCount(forcedRenderCount + 1);
      }, [forcedRenderCount]);
      const deferredForceRender = React.useCallback(() => motionDom.frame.postRender(forceRender), [forceRender]);
      return [deferredForceRender, forcedRenderCount];
    }
    const shouldInheritGroup = (inherit) => inherit === true;
    const shouldInheritId = (inherit) => shouldInheritGroup(inherit === true) || inherit === "id";
    const LayoutGroup = ({ children, id: id2, inherit = true }) => {
      const layoutGroupContext = React.useContext(featureBundle.LayoutGroupContext);
      const deprecatedLayoutGroupContext = React.useContext(DeprecatedLayoutGroupContext);
      const [forceRender, key] = useForceUpdate();
      const context = React.useRef(null);
      const upstreamId = layoutGroupContext.id || deprecatedLayoutGroupContext;
      if (context.current === null) {
        if (shouldInheritId(inherit) && upstreamId) {
          id2 = id2 ? upstreamId + "-" + id2 : upstreamId;
        }
        context.current = {
          id: id2,
          group: shouldInheritGroup(inherit) ? layoutGroupContext.group || motionDom.nodeGroup() : motionDom.nodeGroup()
        };
      }
      const memoizedContext = React.useMemo(() => ({ ...context.current, forceRender }), [key]);
      return jsxRuntime.jsx(featureBundle.LayoutGroupContext.Provider, { value: memoizedContext, children });
    };
    function LazyMotion({ children, features, strict = false }) {
      const [, setIsLoaded] = React.useState(!isLazyBundle(features));
      const loadedRenderer = React.useRef(void 0);
      if (!isLazyBundle(features)) {
        const { renderer, ...loadedFeatures } = features;
        loadedRenderer.current = renderer;
        featureBundle.loadFeatures(loadedFeatures);
      }
      React.useEffect(() => {
        if (isLazyBundle(features)) {
          features().then(({ renderer, ...loadedFeatures }) => {
            featureBundle.loadFeatures(loadedFeatures);
            loadedRenderer.current = renderer;
            setIsLoaded(true);
          });
        }
      }, []);
      return jsxRuntime.jsx(featureBundle.LazyContext.Provider, { value: { renderer: loadedRenderer.current, strict }, children });
    }
    function isLazyBundle(features) {
      return typeof features === "function";
    }
    function MotionConfig({ children, isValidProp, ...config }) {
      isValidProp && featureBundle.loadExternalIsValidProp(isValidProp);
      const parentConfig = React.useContext(featureBundle.MotionConfigContext);
      config = { ...parentConfig, ...config };
      config.transition = motionDom.resolveTransition(config.transition, parentConfig.transition);
      config.isStatic = featureBundle.useConstant(() => config.isStatic);
      const context = React.useMemo(() => config, [
        JSON.stringify(config.transition),
        config.transformPagePoint,
        config.reducedMotion,
        config.skipAnimations
      ]);
      return jsxRuntime.jsx(featureBundle.MotionConfigContext.Provider, { value: context, children });
    }
    const ReorderContext = React.createContext(null);
    function createMotionProxy(preloadedFeatures, createVisualElement) {
      if (typeof Proxy === "undefined") {
        return featureBundle.createMotionComponent;
      }
      const componentCache = /* @__PURE__ */ new Map();
      const factory = (Component, options) => {
        return featureBundle.createMotionComponent(Component, options, preloadedFeatures, createVisualElement);
      };
      const deprecatedFactoryFunction = (Component, options) => {
        return factory(Component, options);
      };
      return new Proxy(deprecatedFactoryFunction, {
        /**
         * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
         * The prop name is passed through as `key` and we can use that to generate a `motion`
         * DOM component with that name.
         */
        get: (_target, key) => {
          if (key === "create")
            return factory;
          if (!componentCache.has(key)) {
            componentCache.set(key, featureBundle.createMotionComponent(key, void 0, preloadedFeatures, createVisualElement));
          }
          return componentCache.get(key);
        }
      });
    }
    const motion = /* @__PURE__ */ createMotionProxy(featureBundle.featureBundle, featureBundle.createDomVisualElement);
    function checkReorder(order, value, offset, velocity) {
      if (!velocity)
        return order;
      const index = order.findIndex((item2) => item2.value === value);
      if (index === -1)
        return order;
      const nextOffset = velocity > 0 ? 1 : -1;
      const nextItem = order[index + nextOffset];
      if (!nextItem)
        return order;
      const item = order[index];
      const nextLayout = nextItem.layout;
      const nextItemCenter = motionDom.mixNumber(nextLayout.min, nextLayout.max, 0.5);
      if (nextOffset === 1 && item.layout.max + offset > nextItemCenter || nextOffset === -1 && item.layout.min + offset < nextItemCenter) {
        return motionUtils.moveItem(order, index, index + nextOffset);
      }
      return order;
    }
    function ReorderGroupComponent({ children, as = "ul", axis = "y", onReorder, values, ...props }, externalRef) {
      const Component = featureBundle.useConstant(() => motion[as]);
      const order = [];
      const isReordering = React.useRef(false);
      const groupRef = React.useRef(null);
      motionUtils.invariant(Boolean(values), "Reorder.Group must be provided a values prop", "reorder-values");
      const context = {
        axis,
        groupRef,
        registerItem: (value, layout) => {
          const idx = order.findIndex((entry) => value === entry.value);
          if (idx !== -1) {
            order[idx].layout = layout[axis];
          } else {
            order.push({ value, layout: layout[axis] });
          }
          order.sort(compareMin);
        },
        updateOrder: (item, offset, velocity) => {
          if (isReordering.current)
            return;
          const newOrder = checkReorder(order, item, offset, velocity);
          if (order !== newOrder) {
            isReordering.current = true;
            const newValues = [...values];
            for (let i = 0; i < newOrder.length; i++) {
              if (order[i].value !== newOrder[i].value) {
                const a = values.indexOf(order[i].value);
                const b = values.indexOf(newOrder[i].value);
                if (a !== -1 && b !== -1) {
                  [newValues[a], newValues[b]] = [newValues[b], newValues[a]];
                }
                break;
              }
            }
            onReorder(newValues);
          }
        }
      };
      React.useEffect(() => {
        isReordering.current = false;
      });
      const setRef2 = (element) => {
        groupRef.current = element;
        if (typeof externalRef === "function") {
          externalRef(element);
        } else if (externalRef) {
          externalRef.current = element;
        }
      };
      const groupStyle = {
        overflowAnchor: "none",
        ...props.style
      };
      return jsxRuntime.jsx(Component, { ...props, style: groupStyle, ref: setRef2, ignoreStrict: true, children: jsxRuntime.jsx(ReorderContext.Provider, { value: context, children }) });
    }
    const ReorderGroup = /* @__PURE__ */ React.forwardRef(ReorderGroupComponent);
    function compareMin(a, b) {
      return a.layout.min - b.layout.min;
    }
    function useMotionValue(initial) {
      const value = featureBundle.useConstant(() => motionDom.motionValue(initial));
      const { isStatic } = React.useContext(featureBundle.MotionConfigContext);
      if (isStatic) {
        const [, setLatest] = React.useState(initial);
        React.useEffect(() => value.on("change", setLatest), []);
      }
      return value;
    }
    function useCombineMotionValues(values, combineValues) {
      const value = useMotionValue(combineValues());
      const updateValue = () => value.set(combineValues());
      updateValue();
      featureBundle.useIsomorphicLayoutEffect(() => {
        const scheduleUpdate = () => motionDom.frame.preRender(updateValue, false, true);
        const subscriptions = values.map((v) => v.on("change", scheduleUpdate));
        return () => {
          subscriptions.forEach((unsubscribe) => unsubscribe());
          motionDom.cancelFrame(updateValue);
        };
      });
      return value;
    }
    function useComputed(compute) {
      motionDom.collectMotionValues.current = [];
      compute();
      const value = useCombineMotionValues(motionDom.collectMotionValues.current, compute);
      motionDom.collectMotionValues.current = void 0;
      return value;
    }
    function useTransform(input, inputRangeOrTransformer, outputRangeOrMap, options) {
      if (typeof input === "function") {
        return useComputed(input);
      }
      const isOutputMap = outputRangeOrMap !== void 0 && !Array.isArray(outputRangeOrMap) && typeof inputRangeOrTransformer !== "function";
      if (isOutputMap) {
        return useMapTransform(input, inputRangeOrTransformer, outputRangeOrMap, options);
      }
      const outputRange = outputRangeOrMap;
      const transformer = typeof inputRangeOrTransformer === "function" ? inputRangeOrTransformer : motionDom.transform(inputRangeOrTransformer, outputRange, options);
      const result = Array.isArray(input) ? useListTransform(input, transformer) : useListTransform([input], ([latest]) => transformer(latest));
      const inputAccelerate = !Array.isArray(input) ? input.accelerate : void 0;
      if (inputAccelerate && !inputAccelerate.isTransformed && typeof inputRangeOrTransformer !== "function" && Array.isArray(outputRangeOrMap) && options?.clamp !== false) {
        result.accelerate = {
          ...inputAccelerate,
          times: inputRangeOrTransformer,
          keyframes: outputRangeOrMap,
          isTransformed: true,
          ...options?.ease ? { ease: options.ease } : {}
        };
      }
      return result;
    }
    function useListTransform(values, transformer) {
      const latest = featureBundle.useConstant(() => []);
      return useCombineMotionValues(values, () => {
        latest.length = 0;
        const numValues = values.length;
        for (let i = 0; i < numValues; i++) {
          latest[i] = values[i].get();
        }
        return transformer(latest);
      });
    }
    function useMapTransform(inputValue, inputRange, outputMap, options) {
      const keys2 = featureBundle.useConstant(() => Object.keys(outputMap));
      const output = featureBundle.useConstant(() => ({}));
      for (const key of keys2) {
        output[key] = useTransform(inputValue, inputRange, outputMap[key], options);
      }
      return output;
    }
    const threshold = 50;
    const maxSpeed = 25;
    const overflowStyles = /* @__PURE__ */ new Set(["auto", "scroll"]);
    const initialScrollLimits = /* @__PURE__ */ new WeakMap();
    const activeScrollEdge = /* @__PURE__ */ new WeakMap();
    let currentGroupElement = null;
    function resetAutoScrollState() {
      if (currentGroupElement) {
        const scrollableAncestor = findScrollableAncestor(currentGroupElement, "y");
        if (scrollableAncestor) {
          activeScrollEdge.delete(scrollableAncestor);
          initialScrollLimits.delete(scrollableAncestor);
        }
        const scrollableAncestorX = findScrollableAncestor(currentGroupElement, "x");
        if (scrollableAncestorX && scrollableAncestorX !== scrollableAncestor) {
          activeScrollEdge.delete(scrollableAncestorX);
          initialScrollLimits.delete(scrollableAncestorX);
        }
        currentGroupElement = null;
      }
    }
    function isScrollableElement(element, axis) {
      const style = getComputedStyle(element);
      const overflow = axis === "x" ? style.overflowX : style.overflowY;
      const isDocumentScroll = element === document.body || element === document.documentElement;
      return overflowStyles.has(overflow) || isDocumentScroll;
    }
    function findScrollableAncestor(element, axis) {
      let current = element?.parentElement;
      while (current) {
        if (isScrollableElement(current, axis)) {
          return current;
        }
        current = current.parentElement;
      }
      return null;
    }
    function getScrollAmount(pointerPosition, scrollElement, axis) {
      const rect = scrollElement.getBoundingClientRect();
      const start = axis === "x" ? Math.max(0, rect.left) : Math.max(0, rect.top);
      const end = axis === "x" ? Math.min(window.innerWidth, rect.right) : Math.min(window.innerHeight, rect.bottom);
      const distanceFromStart = pointerPosition - start;
      const distanceFromEnd = end - pointerPosition;
      if (distanceFromStart < threshold) {
        const intensity = 1 - distanceFromStart / threshold;
        return { amount: -maxSpeed * intensity * intensity, edge: "start" };
      } else if (distanceFromEnd < threshold) {
        const intensity = 1 - distanceFromEnd / threshold;
        return { amount: maxSpeed * intensity * intensity, edge: "end" };
      }
      return { amount: 0, edge: null };
    }
    function autoScrollIfNeeded(groupElement, pointerPosition, axis, velocity) {
      if (!groupElement)
        return;
      currentGroupElement = groupElement;
      const scrollableAncestor = findScrollableAncestor(groupElement, axis);
      if (!scrollableAncestor)
        return;
      const viewportPointerPosition = pointerPosition - (axis === "x" ? window.scrollX : window.scrollY);
      const { amount: scrollAmount, edge } = getScrollAmount(viewportPointerPosition, scrollableAncestor, axis);
      if (edge === null) {
        activeScrollEdge.delete(scrollableAncestor);
        initialScrollLimits.delete(scrollableAncestor);
        return;
      }
      const currentActiveEdge = activeScrollEdge.get(scrollableAncestor);
      const isDocumentScroll = scrollableAncestor === document.body || scrollableAncestor === document.documentElement;
      if (currentActiveEdge !== edge) {
        const shouldStart = edge === "start" && velocity < 0 || edge === "end" && velocity > 0;
        if (!shouldStart)
          return;
        activeScrollEdge.set(scrollableAncestor, edge);
        const maxScroll = axis === "x" ? scrollableAncestor.scrollWidth - (isDocumentScroll ? window.innerWidth : scrollableAncestor.clientWidth) : scrollableAncestor.scrollHeight - (isDocumentScroll ? window.innerHeight : scrollableAncestor.clientHeight);
        initialScrollLimits.set(scrollableAncestor, maxScroll);
      }
      if (scrollAmount > 0) {
        const initialLimit = initialScrollLimits.get(scrollableAncestor);
        const currentScroll = axis === "x" ? isDocumentScroll ? window.scrollX : scrollableAncestor.scrollLeft : isDocumentScroll ? window.scrollY : scrollableAncestor.scrollTop;
        if (currentScroll >= initialLimit)
          return;
      }
      if (axis === "x") {
        if (isDocumentScroll) {
          window.scrollBy({ left: scrollAmount });
        } else {
          scrollableAncestor.scrollLeft += scrollAmount;
        }
      } else {
        if (isDocumentScroll) {
          window.scrollBy({ top: scrollAmount });
        } else {
          scrollableAncestor.scrollTop += scrollAmount;
        }
      }
    }
    function useDefaultMotionValue(value, defaultValue = 0) {
      return motionDom.isMotionValue(value) ? value : useMotionValue(defaultValue);
    }
    function ReorderItemComponent({ children, style = {}, value, as = "li", onDrag, onDragEnd, layout = true, ...props }, externalRef) {
      const Component = featureBundle.useConstant(() => motion[as]);
      const context = React.useContext(ReorderContext);
      const point2 = {
        x: useDefaultMotionValue(style.x),
        y: useDefaultMotionValue(style.y)
      };
      const zIndex = useTransform([point2.x, point2.y], ([latestX, latestY]) => latestX || latestY ? 1 : "unset");
      motionUtils.invariant(Boolean(context), "Reorder.Item must be a child of Reorder.Group", "reorder-item-child");
      const { axis, registerItem, updateOrder, groupRef } = context;
      return jsxRuntime.jsx(Component, { drag: axis, ...props, dragSnapToOrigin: true, style: { ...style, x: point2.x, y: point2.y, zIndex }, layout, onDrag: (event, gesturePoint) => {
        const { velocity, point: pointerPoint } = gesturePoint;
        const offset = point2[axis].get();
        updateOrder(value, offset, velocity[axis]);
        autoScrollIfNeeded(groupRef.current, pointerPoint[axis], axis, velocity[axis]);
        onDrag && onDrag(event, gesturePoint);
      }, onDragEnd: (event, gesturePoint) => {
        resetAutoScrollState();
        onDragEnd && onDragEnd(event, gesturePoint);
      }, onLayoutMeasure: (measured) => {
        registerItem(value, measured);
      }, ref: externalRef, ignoreStrict: true, children });
    }
    const ReorderItem = /* @__PURE__ */ React.forwardRef(ReorderItemComponent);
    var namespace = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      Group: ReorderGroup,
      Item: ReorderItem
    });
    function isDOMKeyframes(keyframes) {
      return typeof keyframes === "object" && !Array.isArray(keyframes);
    }
    function resolveSubjects(subject, keyframes, scope, selectorCache) {
      if (subject == null) {
        return [];
      }
      if (typeof subject === "string" && isDOMKeyframes(keyframes)) {
        return motionDom.resolveElements(subject, scope, selectorCache);
      } else if (subject instanceof NodeList) {
        return Array.from(subject);
      } else if (Array.isArray(subject)) {
        return subject.filter((s) => s != null);
      } else {
        return [subject];
      }
    }
    function calculateRepeatDuration(duration, repeat, _repeatDelay) {
      return duration * (repeat + 1);
    }
    function calcNextTime(current, next, prev, labels) {
      if (typeof next === "number") {
        return next;
      } else if (next.startsWith("-") || next.startsWith("+")) {
        return Math.max(0, current + parseFloat(next));
      } else if (next === "<") {
        return prev;
      } else if (next.startsWith("<")) {
        return Math.max(0, prev + parseFloat(next.slice(1)));
      } else {
        return labels.get(next) ?? current;
      }
    }
    function eraseKeyframes(sequence, startTime, endTime) {
      for (let i = 0; i < sequence.length; i++) {
        const keyframe = sequence[i];
        if (keyframe.at > startTime && keyframe.at < endTime) {
          motionUtils.removeItem(sequence, keyframe);
          i--;
        }
      }
    }
    function addKeyframes(sequence, keyframes, easing, offset, startTime, endTime) {
      eraseKeyframes(sequence, startTime, endTime);
      for (let i = 0; i < keyframes.length; i++) {
        sequence.push({
          value: keyframes[i],
          at: motionDom.mixNumber(startTime, endTime, offset[i]),
          easing: motionUtils.getEasingForSegment(easing, i)
        });
      }
    }
    function normalizeTimes(times, repeat) {
      for (let i = 0; i < times.length; i++) {
        times[i] = times[i] / (repeat + 1);
      }
    }
    function compareByTime(a, b) {
      if (a.at === b.at) {
        if (a.value === null)
          return 1;
        if (b.value === null)
          return -1;
        return 0;
      } else {
        return a.at - b.at;
      }
    }
    const defaultSegmentEasing = "easeInOut";
    const MAX_REPEAT = 20;
    function createAnimationsFromSequence(sequence, { defaultTransition = {}, ...sequenceTransition } = {}, scope, generators) {
      const defaultDuration = defaultTransition.duration || 0.3;
      const animationDefinitions = /* @__PURE__ */ new Map();
      const sequences = /* @__PURE__ */ new Map();
      const elementCache = {};
      const timeLabels = /* @__PURE__ */ new Map();
      let prevTime = 0;
      let currentTime = 0;
      let totalDuration = 0;
      for (let i = 0; i < sequence.length; i++) {
        const segment = sequence[i];
        if (typeof segment === "string") {
          timeLabels.set(segment, currentTime);
          continue;
        } else if (!Array.isArray(segment)) {
          timeLabels.set(segment.name, calcNextTime(currentTime, segment.at, prevTime, timeLabels));
          continue;
        }
        let [subject, keyframes, transition = {}] = segment;
        if (transition.at !== void 0) {
          currentTime = calcNextTime(currentTime, transition.at, prevTime, timeLabels);
        }
        let maxDuration = 0;
        const resolveValueSequence = (valueKeyframes, valueTransition, valueSequence, elementIndex = 0, numSubjects = 0) => {
          const valueKeyframesAsList = keyframesAsList(valueKeyframes);
          const { delay = 0, times = motionDom.defaultOffset(valueKeyframesAsList), type = defaultTransition.type || "keyframes", repeat, repeatType, repeatDelay = 0, ...remainingTransition } = valueTransition;
          let { ease = defaultTransition.ease || "easeOut", duration } = valueTransition;
          const calculatedDelay = typeof delay === "function" ? delay(elementIndex, numSubjects) : delay;
          const numKeyframes = valueKeyframesAsList.length;
          const createGenerator = motionDom.isGenerator(type) ? type : generators?.[type || "keyframes"];
          if (numKeyframes <= 2 && createGenerator) {
            let absoluteDelta = 100;
            if (numKeyframes === 2 && isNumberKeyframesArray(valueKeyframesAsList)) {
              const delta = valueKeyframesAsList[1] - valueKeyframesAsList[0];
              absoluteDelta = Math.abs(delta);
            }
            const springTransition = {
              ...defaultTransition,
              ...remainingTransition
            };
            if (duration !== void 0) {
              springTransition.duration = motionUtils.secondsToMilliseconds(duration);
            }
            const springEasing = motionDom.createGeneratorEasing(springTransition, absoluteDelta, createGenerator);
            ease = springEasing.ease;
            duration = springEasing.duration;
          }
          duration ?? (duration = defaultDuration);
          const startTime = currentTime + calculatedDelay;
          if (times.length === 1 && times[0] === 0) {
            times[1] = 1;
          }
          const remainder = times.length - valueKeyframesAsList.length;
          remainder > 0 && motionDom.fillOffset(times, remainder);
          valueKeyframesAsList.length === 1 && valueKeyframesAsList.unshift(null);
          if (repeat) {
            motionUtils.invariant(repeat < MAX_REPEAT, "Repeat count too high, must be less than 20", "repeat-count-high");
            duration = calculateRepeatDuration(duration, repeat);
            const originalKeyframes = [...valueKeyframesAsList];
            const originalTimes = [...times];
            ease = Array.isArray(ease) ? [...ease] : [ease];
            const originalEase = [...ease];
            for (let repeatIndex = 0; repeatIndex < repeat; repeatIndex++) {
              valueKeyframesAsList.push(...originalKeyframes);
              for (let keyframeIndex = 0; keyframeIndex < originalKeyframes.length; keyframeIndex++) {
                times.push(originalTimes[keyframeIndex] + (repeatIndex + 1));
                ease.push(keyframeIndex === 0 ? "linear" : motionUtils.getEasingForSegment(originalEase, keyframeIndex - 1));
              }
            }
            normalizeTimes(times, repeat);
          }
          const targetTime = startTime + duration;
          addKeyframes(valueSequence, valueKeyframesAsList, ease, times, startTime, targetTime);
          maxDuration = Math.max(calculatedDelay + duration, maxDuration);
          totalDuration = Math.max(targetTime, totalDuration);
        };
        if (motionDom.isMotionValue(subject)) {
          const subjectSequence = getSubjectSequence(subject, sequences);
          resolveValueSequence(keyframes, transition, getValueSequence("default", subjectSequence));
        } else {
          const subjects = resolveSubjects(subject, keyframes, scope, elementCache);
          const numSubjects = subjects.length;
          for (let subjectIndex = 0; subjectIndex < numSubjects; subjectIndex++) {
            keyframes = keyframes;
            transition = transition;
            const thisSubject = subjects[subjectIndex];
            const subjectSequence = getSubjectSequence(thisSubject, sequences);
            for (const key in keyframes) {
              resolveValueSequence(keyframes[key], getValueTransition(transition, key), getValueSequence(key, subjectSequence), subjectIndex, numSubjects);
            }
          }
        }
        prevTime = currentTime;
        currentTime += maxDuration;
      }
      sequences.forEach((valueSequences, element) => {
        for (const key in valueSequences) {
          const valueSequence = valueSequences[key];
          valueSequence.sort(compareByTime);
          const keyframes = [];
          const valueOffset = [];
          const valueEasing = [];
          for (let i = 0; i < valueSequence.length; i++) {
            const { at, value, easing } = valueSequence[i];
            keyframes.push(value);
            valueOffset.push(motionUtils.progress(0, totalDuration, at));
            valueEasing.push(easing || "easeOut");
          }
          if (valueOffset[0] !== 0) {
            valueOffset.unshift(0);
            keyframes.unshift(keyframes[0]);
            valueEasing.unshift(defaultSegmentEasing);
          }
          if (valueOffset[valueOffset.length - 1] !== 1) {
            valueOffset.push(1);
            keyframes.push(null);
          }
          if (!animationDefinitions.has(element)) {
            animationDefinitions.set(element, {
              keyframes: {},
              transition: {}
            });
          }
          const definition = animationDefinitions.get(element);
          definition.keyframes[key] = keyframes;
          const { type: _type, ...remainingDefaultTransition } = defaultTransition;
          definition.transition[key] = {
            ...remainingDefaultTransition,
            duration: totalDuration,
            ease: valueEasing,
            times: valueOffset,
            ...sequenceTransition
          };
        }
      });
      return animationDefinitions;
    }
    function getSubjectSequence(subject, sequences) {
      !sequences.has(subject) && sequences.set(subject, {});
      return sequences.get(subject);
    }
    function getValueSequence(name, sequences) {
      if (!sequences[name])
        sequences[name] = [];
      return sequences[name];
    }
    function keyframesAsList(keyframes) {
      return Array.isArray(keyframes) ? keyframes : [keyframes];
    }
    function getValueTransition(transition, key) {
      return transition && transition[key] ? {
        ...transition,
        ...transition[key]
      } : { ...transition };
    }
    const isNumber = (keyframe) => typeof keyframe === "number";
    const isNumberKeyframesArray = (keyframes) => keyframes.every(isNumber);
    function createDOMVisualElement(element) {
      const options = {
        presenceContext: null,
        props: {},
        visualState: {
          renderState: {
            transform: {},
            transformOrigin: {},
            style: {},
            vars: {},
            attrs: {}
          },
          latestValues: {}
        }
      };
      const node = motionDom.isSVGElement(element) && !motionDom.isSVGSVGElement(element) ? new motionDom.SVGVisualElement(options) : new motionDom.HTMLVisualElement(options);
      node.mount(element);
      motionDom.visualElementStore.set(element, node);
    }
    function createObjectVisualElement(subject) {
      const options = {
        presenceContext: null,
        props: {},
        visualState: {
          renderState: {
            output: {}
          },
          latestValues: {}
        }
      };
      const node = new motionDom.ObjectVisualElement(options);
      node.mount(subject);
      motionDom.visualElementStore.set(subject, node);
    }
    function isSingleValue(subject, keyframes) {
      return motionDom.isMotionValue(subject) || typeof subject === "number" || typeof subject === "string" && !isDOMKeyframes(keyframes);
    }
    function animateSubject(subject, keyframes, options, scope) {
      const animations = [];
      if (isSingleValue(subject, keyframes)) {
        animations.push(motionDom.animateSingleValue(subject, isDOMKeyframes(keyframes) ? keyframes.default || keyframes : keyframes, options ? options.default || options : options));
      } else {
        if (subject == null) {
          return animations;
        }
        const subjects = resolveSubjects(subject, keyframes, scope);
        const numSubjects = subjects.length;
        motionUtils.invariant(Boolean(numSubjects), "No valid elements provided.", "no-valid-elements");
        for (let i = 0; i < numSubjects; i++) {
          const thisSubject = subjects[i];
          const createVisualElement = thisSubject instanceof Element ? createDOMVisualElement : createObjectVisualElement;
          if (!motionDom.visualElementStore.has(thisSubject)) {
            createVisualElement(thisSubject);
          }
          const visualElement = motionDom.visualElementStore.get(thisSubject);
          const transition = { ...options };
          if ("delay" in transition && typeof transition.delay === "function") {
            transition.delay = transition.delay(i, numSubjects);
          }
          animations.push(...motionDom.animateTarget(visualElement, { ...keyframes, transition }, {}));
        }
      }
      return animations;
    }
    function animateSequence(sequence, options, scope) {
      const animations = [];
      const processedSequence = sequence.map((segment) => {
        if (Array.isArray(segment) && typeof segment[0] === "function") {
          const callback = segment[0];
          const mv = motionDom.motionValue(0);
          mv.on("change", callback);
          if (segment.length === 1) {
            return [mv, [0, 1]];
          } else if (segment.length === 2) {
            return [mv, [0, 1], segment[1]];
          } else {
            return [mv, segment[1], segment[2]];
          }
        }
        return segment;
      });
      const animationDefinitions = createAnimationsFromSequence(processedSequence, options, scope, { spring: motionDom.spring });
      animationDefinitions.forEach(({ keyframes, transition }, subject) => {
        animations.push(...animateSubject(subject, keyframes, transition));
      });
      return animations;
    }
    function isSequence(value) {
      return Array.isArray(value) && value.some(Array.isArray);
    }
    function createScopedAnimate(options = {}) {
      const { scope, reduceMotion } = options;
      function scopedAnimate(subjectOrSequence, optionsOrKeyframes, options2) {
        let animations = [];
        let animationOnComplete;
        if (isSequence(subjectOrSequence)) {
          const { onComplete, ...sequenceOptions } = optionsOrKeyframes || {};
          if (typeof onComplete === "function") {
            animationOnComplete = onComplete;
          }
          animations = animateSequence(subjectOrSequence, reduceMotion !== void 0 ? { reduceMotion, ...sequenceOptions } : sequenceOptions, scope);
        } else {
          const { onComplete, ...rest } = options2 || {};
          if (typeof onComplete === "function") {
            animationOnComplete = onComplete;
          }
          animations = animateSubject(subjectOrSequence, optionsOrKeyframes, reduceMotion !== void 0 ? { reduceMotion, ...rest } : rest, scope);
        }
        const animation = new motionDom.GroupAnimationWithThen(animations);
        if (animationOnComplete) {
          animation.finished.then(animationOnComplete);
        }
        if (scope) {
          scope.animations.push(animation);
          animation.finished.then(() => {
            motionUtils.removeItem(scope.animations, animation);
          });
        }
        return animation;
      }
      return scopedAnimate;
    }
    const animate = createScopedAnimate();
    function animateElements(elementOrSelector, keyframes, options, scope) {
      if (elementOrSelector == null) {
        return [];
      }
      const elements = motionDom.resolveElements(elementOrSelector, scope);
      const numElements = elements.length;
      motionUtils.invariant(Boolean(numElements), "No valid elements provided.", "no-valid-elements");
      const animationDefinitions = [];
      for (let i = 0; i < numElements; i++) {
        const element = elements[i];
        const elementTransition = { ...options };
        if (typeof elementTransition.delay === "function") {
          elementTransition.delay = elementTransition.delay(i, numElements);
        }
        for (const valueName in keyframes) {
          let valueKeyframes = keyframes[valueName];
          if (!Array.isArray(valueKeyframes)) {
            valueKeyframes = [valueKeyframes];
          }
          const valueOptions = {
            ...motionDom.getValueTransition(elementTransition, valueName)
          };
          valueOptions.duration && (valueOptions.duration = motionUtils.secondsToMilliseconds(valueOptions.duration));
          valueOptions.delay && (valueOptions.delay = motionUtils.secondsToMilliseconds(valueOptions.delay));
          const map = motionDom.getAnimationMap(element);
          const key = motionDom.animationMapKey(valueName, valueOptions.pseudoElement || "");
          const currentAnimation = map.get(key);
          currentAnimation && currentAnimation.stop();
          animationDefinitions.push({
            map,
            key,
            unresolvedKeyframes: valueKeyframes,
            options: {
              ...valueOptions,
              element,
              name: valueName,
              allowFlatten: !elementTransition.type && !elementTransition.ease
            }
          });
        }
      }
      for (let i = 0; i < animationDefinitions.length; i++) {
        const { unresolvedKeyframes, options: animationOptions } = animationDefinitions[i];
        const { element, name, pseudoElement } = animationOptions;
        if (!pseudoElement && unresolvedKeyframes[0] === null) {
          unresolvedKeyframes[0] = motionDom.getComputedStyle(element, name);
        }
        motionDom.fillWildcards(unresolvedKeyframes);
        motionDom.applyPxDefaults(unresolvedKeyframes, name);
        if (!pseudoElement && unresolvedKeyframes.length < 2) {
          unresolvedKeyframes.unshift(motionDom.getComputedStyle(element, name));
        }
        animationOptions.keyframes = unresolvedKeyframes;
      }
      const animations = [];
      for (let i = 0; i < animationDefinitions.length; i++) {
        const { map, key, options: animationOptions } = animationDefinitions[i];
        const animation = new motionDom.NativeAnimation(animationOptions);
        map.set(key, animation);
        animation.finished.finally(() => map.delete(key));
        animations.push(animation);
      }
      return animations;
    }
    const createScopedWaapiAnimate = (scope) => {
      function scopedAnimate(elementOrSelector, keyframes, options) {
        return new motionDom.GroupAnimationWithThen(animateElements(elementOrSelector, keyframes, options, scope));
      }
      return scopedAnimate;
    };
    const animateMini = /* @__PURE__ */ createScopedWaapiAnimate();
    function canUseNativeTimeline(target) {
      if (typeof window === "undefined")
        return false;
      return target ? motionDom.supportsViewTimeline() : motionDom.supportsScrollTimeline();
    }
    const maxElapsed = 50;
    const createAxisInfo = () => ({
      current: 0,
      offset: [],
      progress: 0,
      scrollLength: 0,
      targetOffset: 0,
      targetLength: 0,
      containerLength: 0,
      velocity: 0
    });
    const createScrollInfo = () => ({
      time: 0,
      x: createAxisInfo(),
      y: createAxisInfo()
    });
    const keys = {
      x: {
        length: "Width",
        position: "Left"
      },
      y: {
        length: "Height",
        position: "Top"
      }
    };
    function updateAxisInfo(element, axisName, info, time) {
      const axis = info[axisName];
      const { length, position } = keys[axisName];
      const prev = axis.current;
      const prevTime = info.time;
      axis.current = Math.abs(element[`scroll${position}`]);
      axis.scrollLength = element[`scroll${length}`] - element[`client${length}`];
      axis.offset.length = 0;
      axis.offset[0] = 0;
      axis.offset[1] = axis.scrollLength;
      axis.progress = motionUtils.progress(0, axis.scrollLength, axis.current);
      const elapsed = time - prevTime;
      axis.velocity = elapsed > maxElapsed ? 0 : motionUtils.velocityPerSecond(axis.current - prev, elapsed);
    }
    function updateScrollInfo(element, info, time) {
      updateAxisInfo(element, "x", info, time);
      updateAxisInfo(element, "y", info, time);
      info.time = time;
    }
    function calcInset(element, container) {
      const inset = { x: 0, y: 0 };
      let current = element;
      while (current && current !== container) {
        if (motionDom.isHTMLElement(current)) {
          inset.x += current.offsetLeft;
          inset.y += current.offsetTop;
          current = current.offsetParent;
        } else if (current.tagName === "svg") {
          const svgBoundingBox = current.getBoundingClientRect();
          current = current.parentElement;
          const parentBoundingBox = current.getBoundingClientRect();
          inset.x += svgBoundingBox.left - parentBoundingBox.left;
          inset.y += svgBoundingBox.top - parentBoundingBox.top;
        } else if (current instanceof SVGGraphicsElement) {
          const { x, y } = current.getBBox();
          inset.x += x;
          inset.y += y;
          let svg = null;
          let parent = current.parentNode;
          while (!svg) {
            if (parent.tagName === "svg") {
              svg = parent;
            }
            parent = current.parentNode;
          }
          current = svg;
        } else {
          break;
        }
      }
      return inset;
    }
    const namedEdges = {
      start: 0,
      center: 0.5,
      end: 1
    };
    function resolveEdge(edge, length, inset = 0) {
      let delta = 0;
      if (edge in namedEdges) {
        edge = namedEdges[edge];
      }
      if (typeof edge === "string") {
        const asNumber = parseFloat(edge);
        if (edge.endsWith("px")) {
          delta = asNumber;
        } else if (edge.endsWith("%")) {
          edge = asNumber / 100;
        } else if (edge.endsWith("vw")) {
          delta = asNumber / 100 * document.documentElement.clientWidth;
        } else if (edge.endsWith("vh")) {
          delta = asNumber / 100 * document.documentElement.clientHeight;
        } else {
          edge = asNumber;
        }
      }
      if (typeof edge === "number") {
        delta = length * edge;
      }
      return inset + delta;
    }
    const defaultOffset = [0, 0];
    function resolveOffset(offset, containerLength, targetLength, targetInset) {
      let offsetDefinition = Array.isArray(offset) ? offset : defaultOffset;
      let targetPoint = 0;
      let containerPoint = 0;
      if (typeof offset === "number") {
        offsetDefinition = [offset, offset];
      } else if (typeof offset === "string") {
        offset = offset.trim();
        if (offset.includes(" ")) {
          offsetDefinition = offset.split(" ");
        } else {
          offsetDefinition = [offset, namedEdges[offset] ? offset : `0`];
        }
      }
      targetPoint = resolveEdge(offsetDefinition[0], targetLength, targetInset);
      containerPoint = resolveEdge(offsetDefinition[1], containerLength);
      return targetPoint - containerPoint;
    }
    const ScrollOffset = {
      Enter: [
        [0, 1],
        [1, 1]
      ],
      Exit: [
        [0, 0],
        [1, 0]
      ],
      Any: [
        [1, 0],
        [0, 1]
      ],
      All: [
        [0, 0],
        [1, 1]
      ]
    };
    const point = { x: 0, y: 0 };
    function getTargetSize(target) {
      return "getBBox" in target && target.tagName !== "svg" ? target.getBBox() : { width: target.clientWidth, height: target.clientHeight };
    }
    function resolveOffsets(container, info, options) {
      const { offset: offsetDefinition = ScrollOffset.All } = options;
      const { target = container, axis = "y" } = options;
      const lengthLabel = axis === "y" ? "height" : "width";
      const inset = target !== container ? calcInset(target, container) : point;
      const targetSize = target === container ? { width: container.scrollWidth, height: container.scrollHeight } : getTargetSize(target);
      const containerSize = {
        width: container.clientWidth,
        height: container.clientHeight
      };
      info[axis].offset.length = 0;
      let hasChanged = !info[axis].interpolate;
      const numOffsets = offsetDefinition.length;
      for (let i = 0; i < numOffsets; i++) {
        const offset = resolveOffset(offsetDefinition[i], containerSize[lengthLabel], targetSize[lengthLabel], inset[axis]);
        if (!hasChanged && offset !== info[axis].interpolatorOffsets[i]) {
          hasChanged = true;
        }
        info[axis].offset[i] = offset;
      }
      if (hasChanged) {
        info[axis].interpolate = motionDom.interpolate(info[axis].offset, motionDom.defaultOffset(offsetDefinition), { clamp: false });
        info[axis].interpolatorOffsets = [...info[axis].offset];
      }
      info[axis].progress = motionUtils.clamp(0, 1, info[axis].interpolate(info[axis].current));
    }
    function measure(container, target = container, info) {
      info.x.targetOffset = 0;
      info.y.targetOffset = 0;
      if (target !== container) {
        let node = target;
        while (node && node !== container) {
          info.x.targetOffset += node.offsetLeft;
          info.y.targetOffset += node.offsetTop;
          node = node.offsetParent;
        }
      }
      info.x.targetLength = target === container ? target.scrollWidth : target.clientWidth;
      info.y.targetLength = target === container ? target.scrollHeight : target.clientHeight;
      info.x.containerLength = container.clientWidth;
      info.y.containerLength = container.clientHeight;
    }
    function createOnScrollHandler(element, onScroll, info, options = {}) {
      return {
        measure: (time) => {
          measure(element, options.target, info);
          updateScrollInfo(element, info, time);
          if (options.offset || options.target) {
            resolveOffsets(element, info, options);
          }
        },
        notify: () => onScroll(info)
      };
    }
    const scrollListeners = /* @__PURE__ */ new WeakMap();
    const resizeListeners = /* @__PURE__ */ new WeakMap();
    const onScrollHandlers = /* @__PURE__ */ new WeakMap();
    const scrollSize = /* @__PURE__ */ new WeakMap();
    const dimensionCheckProcesses = /* @__PURE__ */ new WeakMap();
    const getEventTarget = (element) => element === document.scrollingElement ? window : element;
    function scrollInfo(onScroll, { container = document.scrollingElement, trackContentSize = false, ...options } = {}) {
      if (!container)
        return motionUtils.noop;
      let containerHandlers = onScrollHandlers.get(container);
      if (!containerHandlers) {
        containerHandlers = /* @__PURE__ */ new Set();
        onScrollHandlers.set(container, containerHandlers);
      }
      const info = createScrollInfo();
      const containerHandler = createOnScrollHandler(container, onScroll, info, options);
      containerHandlers.add(containerHandler);
      if (!scrollListeners.has(container)) {
        const measureAll = () => {
          for (const handler of containerHandlers) {
            handler.measure(motionDom.frameData.timestamp);
          }
          motionDom.frame.preUpdate(notifyAll);
        };
        const notifyAll = () => {
          for (const handler of containerHandlers) {
            handler.notify();
          }
        };
        const listener2 = () => motionDom.frame.read(measureAll);
        scrollListeners.set(container, listener2);
        const target = getEventTarget(container);
        window.addEventListener("resize", listener2);
        if (container !== document.documentElement) {
          resizeListeners.set(container, motionDom.resize(container, listener2));
        }
        target.addEventListener("scroll", listener2);
        listener2();
      }
      if (trackContentSize && !dimensionCheckProcesses.has(container)) {
        const listener2 = scrollListeners.get(container);
        const size = {
          width: container.scrollWidth,
          height: container.scrollHeight
        };
        scrollSize.set(container, size);
        const checkScrollDimensions = () => {
          const newWidth = container.scrollWidth;
          const newHeight = container.scrollHeight;
          if (size.width !== newWidth || size.height !== newHeight) {
            listener2();
            size.width = newWidth;
            size.height = newHeight;
          }
        };
        const dimensionCheckProcess = motionDom.frame.read(checkScrollDimensions, true);
        dimensionCheckProcesses.set(container, dimensionCheckProcess);
      }
      const listener = scrollListeners.get(container);
      motionDom.frame.read(listener, false, true);
      return () => {
        motionDom.cancelFrame(listener);
        const currentHandlers = onScrollHandlers.get(container);
        if (!currentHandlers)
          return;
        currentHandlers.delete(containerHandler);
        if (currentHandlers.size)
          return;
        const scrollListener = scrollListeners.get(container);
        scrollListeners.delete(container);
        if (scrollListener) {
          getEventTarget(container).removeEventListener("scroll", scrollListener);
          resizeListeners.get(container)?.();
          window.removeEventListener("resize", scrollListener);
        }
        const dimensionCheckProcess = dimensionCheckProcesses.get(container);
        if (dimensionCheckProcess) {
          motionDom.cancelFrame(dimensionCheckProcess);
          dimensionCheckProcesses.delete(container);
        }
        scrollSize.delete(container);
      };
    }
    const presets = [
      [ScrollOffset.Enter, "entry"],
      [ScrollOffset.Exit, "exit"],
      [ScrollOffset.Any, "cover"],
      [ScrollOffset.All, "contain"]
    ];
    const stringToProgress = {
      start: 0,
      end: 1
    };
    function parseStringOffset(s) {
      const parts = s.trim().split(/\s+/);
      if (parts.length !== 2)
        return void 0;
      const a = stringToProgress[parts[0]];
      const b = stringToProgress[parts[1]];
      if (a === void 0 || b === void 0)
        return void 0;
      return [a, b];
    }
    function normaliseOffset(offset) {
      if (offset.length !== 2)
        return void 0;
      const result = [];
      for (const item of offset) {
        if (Array.isArray(item)) {
          result.push(item);
        } else if (typeof item === "string") {
          const parsed = parseStringOffset(item);
          if (!parsed)
            return void 0;
          result.push(parsed);
        } else {
          return void 0;
        }
      }
      return result;
    }
    function matchesPreset(offset, preset) {
      const normalised = normaliseOffset(offset);
      if (!normalised)
        return false;
      for (let i = 0; i < 2; i++) {
        const o = normalised[i];
        const p = preset[i];
        if (o[0] !== p[0] || o[1] !== p[1])
          return false;
      }
      return true;
    }
    function offsetToViewTimelineRange(offset) {
      if (!offset) {
        return { rangeStart: "contain 0%", rangeEnd: "contain 100%" };
      }
      for (const [preset, name] of presets) {
        if (matchesPreset(offset, preset)) {
          return { rangeStart: `${name} 0%`, rangeEnd: `${name} 100%` };
        }
      }
      return void 0;
    }
    const timelineCache = /* @__PURE__ */ new Map();
    function scrollTimelineFallback(options) {
      const currentTime = { value: 0 };
      const cancel = scrollInfo((info) => {
        currentTime.value = info[options.axis].progress * 100;
      }, options);
      return { currentTime, cancel };
    }
    function getTimeline({ source, container, ...options }) {
      const { axis } = options;
      if (source)
        container = source;
      let containerCache = timelineCache.get(container);
      if (!containerCache) {
        containerCache = /* @__PURE__ */ new Map();
        timelineCache.set(container, containerCache);
      }
      const targetKey = options.target ?? "self";
      let targetCache = containerCache.get(targetKey);
      if (!targetCache) {
        targetCache = {};
        containerCache.set(targetKey, targetCache);
      }
      const axisKey = axis + (options.offset ?? []).join(",");
      if (!targetCache[axisKey]) {
        if (options.target && canUseNativeTimeline(options.target)) {
          const range = offsetToViewTimelineRange(options.offset);
          if (range) {
            targetCache[axisKey] = new ViewTimeline({
              subject: options.target,
              axis
            });
          } else {
            targetCache[axisKey] = scrollTimelineFallback({
              container,
              ...options
            });
          }
        } else if (canUseNativeTimeline()) {
          targetCache[axisKey] = new ScrollTimeline({
            source: container,
            axis
          });
        } else {
          targetCache[axisKey] = scrollTimelineFallback({
            container,
            ...options
          });
        }
      }
      return targetCache[axisKey];
    }
    function attachToAnimation(animation, options) {
      const timeline = getTimeline(options);
      const range = options.target ? offsetToViewTimelineRange(options.offset) : void 0;
      const useNative = options.target ? canUseNativeTimeline(options.target) && !!range : canUseNativeTimeline();
      return animation.attachTimeline({
        timeline: useNative ? timeline : void 0,
        ...range && useNative && {
          rangeStart: range.rangeStart,
          rangeEnd: range.rangeEnd
        },
        observe: (valueAnimation) => {
          valueAnimation.pause();
          return motionDom.observeTimeline((progress) => {
            valueAnimation.time = valueAnimation.iterationDuration * progress;
          }, timeline);
        }
      });
    }
    function isOnScrollWithInfo(onScroll) {
      return onScroll.length === 2;
    }
    function attachToFunction(onScroll, options) {
      if (isOnScrollWithInfo(onScroll)) {
        return scrollInfo((info) => {
          onScroll(info[options.axis].progress, info);
        }, options);
      } else {
        return motionDom.observeTimeline(onScroll, getTimeline(options));
      }
    }
    function scroll(onScroll, { axis = "y", container = document.scrollingElement, ...options } = {}) {
      if (!container)
        return motionUtils.noop;
      const optionsWithDefaults = { axis, container, ...options };
      return typeof onScroll === "function" ? attachToFunction(onScroll, optionsWithDefaults) : attachToAnimation(onScroll, optionsWithDefaults);
    }
    const thresholds = {
      some: 0,
      all: 1
    };
    function inView(elementOrSelector, onStart, { root, margin: rootMargin, amount = "some" } = {}) {
      const elements = motionDom.resolveElements(elementOrSelector);
      const activeIntersections = /* @__PURE__ */ new WeakMap();
      const onIntersectionChange = (entries) => {
        entries.forEach((entry) => {
          const onEnd = activeIntersections.get(entry.target);
          if (entry.isIntersecting === Boolean(onEnd))
            return;
          if (entry.isIntersecting) {
            const newOnEnd = onStart(entry.target, entry);
            if (typeof newOnEnd === "function") {
              activeIntersections.set(entry.target, newOnEnd);
            } else {
              observer.unobserve(entry.target);
            }
          } else if (typeof onEnd === "function") {
            onEnd(entry);
            activeIntersections.delete(entry.target);
          }
        });
      };
      const observer = new IntersectionObserver(onIntersectionChange, {
        root,
        rootMargin,
        threshold: typeof amount === "number" ? amount : thresholds[amount]
      });
      elements.forEach((element) => observer.observe(element));
      return () => observer.disconnect();
    }
    const m = /* @__PURE__ */ createMotionProxy();
    function useUnmountEffect(callback) {
      return React.useEffect(() => () => callback(), []);
    }
    const domAnimation = {
      renderer: featureBundle.createDomVisualElement,
      ...featureBundle.animations,
      ...featureBundle.gestureAnimations
    };
    const domMax = {
      ...domAnimation,
      ...featureBundle.drag,
      ...featureBundle.layout
    };
    const domMin = {
      renderer: featureBundle.createDomVisualElement,
      ...featureBundle.animations
    };
    function useMotionValueEvent(value, event, callback) {
      React.useInsertionEffect(() => value.on(event, callback), [value, event, callback]);
    }
    const createScrollMotionValues = () => ({
      scrollX: motionDom.motionValue(0),
      scrollY: motionDom.motionValue(0),
      scrollXProgress: motionDom.motionValue(0),
      scrollYProgress: motionDom.motionValue(0)
    });
    const isRefPending = (ref) => {
      if (!ref)
        return false;
      return !ref.current;
    };
    function makeAccelerateConfig(axis, options, container, target) {
      return {
        factory: (animation) => scroll(animation, {
          ...options,
          axis,
          container: container?.current || void 0,
          target: target?.current || void 0
        }),
        times: [0, 1],
        keyframes: [0, 1],
        ease: (v) => v,
        duration: 1
      };
    }
    function canAccelerateScroll(target, offset) {
      if (typeof window === "undefined")
        return false;
      return target ? motionDom.supportsViewTimeline() && !!offsetToViewTimelineRange(offset) : motionDom.supportsScrollTimeline();
    }
    function useScroll({ container, target, ...options } = {}) {
      const values = featureBundle.useConstant(createScrollMotionValues);
      if (canAccelerateScroll(target, options.offset)) {
        values.scrollXProgress.accelerate = makeAccelerateConfig("x", options, container, target);
        values.scrollYProgress.accelerate = makeAccelerateConfig("y", options, container, target);
      }
      const scrollAnimation = React.useRef(null);
      const needsStart = React.useRef(false);
      const start = React.useCallback(() => {
        scrollAnimation.current = scroll((_progress, { x, y }) => {
          values.scrollX.set(x.current);
          values.scrollXProgress.set(x.progress);
          values.scrollY.set(y.current);
          values.scrollYProgress.set(y.progress);
        }, {
          ...options,
          container: container?.current || void 0,
          target: target?.current || void 0
        });
        return () => {
          scrollAnimation.current?.();
        };
      }, [container, target, JSON.stringify(options.offset)]);
      featureBundle.useIsomorphicLayoutEffect(() => {
        needsStart.current = false;
        if (isRefPending(container) || isRefPending(target)) {
          needsStart.current = true;
          return;
        } else {
          return start();
        }
      }, [start]);
      React.useEffect(() => {
        if (needsStart.current) {
          motionUtils.invariant(!isRefPending(container), "Container ref is defined but not hydrated", "use-scroll-ref");
          motionUtils.invariant(!isRefPending(target), "Target ref is defined but not hydrated", "use-scroll-ref");
          return start();
        } else {
          return;
        }
      }, [start]);
      return values;
    }
    function useElementScroll(ref) {
      return useScroll({ container: ref });
    }
    function useViewportScroll() {
      return useScroll();
    }
    function useMotionTemplate(fragments, ...values) {
      const numFragments = fragments.length;
      function buildValue() {
        let output = ``;
        for (let i = 0; i < numFragments; i++) {
          output += fragments[i];
          const value = values[i];
          if (value) {
            output += motionDom.isMotionValue(value) ? value.get() : value;
          }
        }
        return output;
      }
      return useCombineMotionValues(values.filter(motionDom.isMotionValue), buildValue);
    }
    function useFollowValue(source, options = {}) {
      const { isStatic } = React.useContext(featureBundle.MotionConfigContext);
      const getFromSource = () => motionDom.isMotionValue(source) ? source.get() : source;
      if (isStatic) {
        return useTransform(getFromSource);
      }
      const value = useMotionValue(getFromSource());
      React.useInsertionEffect(() => {
        return motionDom.attachFollow(value, source, options);
      }, [value, JSON.stringify(options)]);
      return value;
    }
    function useSpring(source, options = {}) {
      return useFollowValue(source, { type: "spring", ...options });
    }
    function useAnimationFrame(callback) {
      const initialTimestamp = React.useRef(0);
      const { isStatic } = React.useContext(featureBundle.MotionConfigContext);
      React.useEffect(() => {
        if (isStatic)
          return;
        const provideTimeSinceStart = ({ timestamp, delta }) => {
          if (!initialTimestamp.current)
            initialTimestamp.current = timestamp;
          callback(timestamp - initialTimestamp.current, delta);
        };
        motionDom.frame.update(provideTimeSinceStart, true);
        return () => motionDom.cancelFrame(provideTimeSinceStart);
      }, [callback]);
    }
    function useTime() {
      const time = useMotionValue(0);
      useAnimationFrame((t) => time.set(t));
      return time;
    }
    function useVelocity(value) {
      const velocity = useMotionValue(value.getVelocity());
      const updateVelocity = () => {
        const latest = value.getVelocity();
        velocity.set(latest);
        if (latest)
          motionDom.frame.update(updateVelocity);
      };
      useMotionValueEvent(value, "change", () => {
        motionDom.frame.update(updateVelocity, false, true);
      });
      return velocity;
    }
    class WillChangeMotionValue extends motionDom.MotionValue {
      constructor() {
        super(...arguments);
        this.isEnabled = false;
      }
      add(name) {
        if (motionDom.transformProps.has(name) || motionDom.acceleratedValues.has(name)) {
          this.isEnabled = true;
          this.update();
        }
      }
      update() {
        this.set(this.isEnabled ? "transform" : "auto");
      }
    }
    function useWillChange() {
      return featureBundle.useConstant(() => new WillChangeMotionValue("auto"));
    }
    function useReducedMotion() {
      !motionDom.hasReducedMotionListener.current && motionDom.initPrefersReducedMotion();
      const [shouldReduceMotion] = React.useState(motionDom.prefersReducedMotion.current);
      return shouldReduceMotion;
    }
    function useReducedMotionConfig() {
      const reducedMotionPreference = useReducedMotion();
      const { reducedMotion } = React.useContext(featureBundle.MotionConfigContext);
      if (reducedMotion === "never") {
        return false;
      } else if (reducedMotion === "always") {
        return true;
      } else {
        return reducedMotionPreference;
      }
    }
    function stopAnimation(visualElement) {
      visualElement.values.forEach((value) => value.stop());
    }
    function setVariants(visualElement, variantLabels) {
      const reversedLabels = [...variantLabels].reverse();
      reversedLabels.forEach((key) => {
        const variant = visualElement.getVariant(key);
        variant && motionDom.setTarget(visualElement, variant);
        if (visualElement.variantChildren) {
          visualElement.variantChildren.forEach((child) => {
            setVariants(child, variantLabels);
          });
        }
      });
    }
    function setValues(visualElement, definition) {
      if (Array.isArray(definition)) {
        return setVariants(visualElement, definition);
      } else if (typeof definition === "string") {
        return setVariants(visualElement, [definition]);
      } else {
        motionDom.setTarget(visualElement, definition);
      }
    }
    function animationControls() {
      let hasMounted = false;
      const subscribers = /* @__PURE__ */ new Set();
      const controls = {
        subscribe(visualElement) {
          subscribers.add(visualElement);
          return () => void subscribers.delete(visualElement);
        },
        start(definition, transitionOverride) {
          motionUtils.invariant(hasMounted, "controls.start() should only be called after a component has mounted. Consider calling within a useEffect hook.");
          const animations = [];
          subscribers.forEach((visualElement) => {
            animations.push(motionDom.animateVisualElement(visualElement, definition, {
              transitionOverride
            }));
          });
          return Promise.all(animations);
        },
        set(definition) {
          motionUtils.invariant(hasMounted, "controls.set() should only be called after a component has mounted. Consider calling within a useEffect hook.");
          return subscribers.forEach((visualElement) => {
            setValues(visualElement, definition);
          });
        },
        stop() {
          subscribers.forEach((visualElement) => {
            stopAnimation(visualElement);
          });
        },
        mount() {
          hasMounted = true;
          return () => {
            hasMounted = false;
            controls.stop();
          };
        }
      };
      return controls;
    }
    function useAnimate() {
      const scope = featureBundle.useConstant(() => ({
        current: null,
        // Will be hydrated by React
        animations: []
      }));
      const reduceMotion = useReducedMotionConfig() ?? void 0;
      const animate2 = React.useMemo(() => createScopedAnimate({ scope, reduceMotion }), [scope, reduceMotion]);
      useUnmountEffect(() => {
        scope.animations.forEach((animation) => animation.stop());
        scope.animations.length = 0;
      });
      return [scope, animate2];
    }
    function useAnimateMini() {
      const scope = featureBundle.useConstant(() => ({
        current: null,
        // Will be hydrated by React
        animations: []
      }));
      const animate2 = featureBundle.useConstant(() => createScopedWaapiAnimate(scope));
      useUnmountEffect(() => {
        scope.animations.forEach((animation) => animation.stop());
      });
      return [scope, animate2];
    }
    function useAnimationControls() {
      const controls = featureBundle.useConstant(animationControls);
      featureBundle.useIsomorphicLayoutEffect(controls.mount, []);
      return controls;
    }
    const useAnimation = useAnimationControls;
    function usePresenceData() {
      const context = React.useContext(featureBundle.PresenceContext);
      return context ? context.custom : void 0;
    }
    function useDomEvent(ref, eventName, handler, options) {
      React.useEffect(() => {
        const element = ref.current;
        if (handler && element) {
          return motionDom.addDomEvent(element, eventName, handler, options);
        }
      }, [ref, eventName, handler, options]);
    }
    class DragControls {
      constructor() {
        this.componentControls = /* @__PURE__ */ new Set();
      }
      /**
       * Subscribe a component's internal `VisualElementDragControls` to the user-facing API.
       *
       * @internal
       */
      subscribe(controls) {
        this.componentControls.add(controls);
        return () => this.componentControls.delete(controls);
      }
      /**
       * Start a drag gesture on every `motion` component that has this set of drag controls
       * passed into it via the `dragControls` prop.
       *
       * ```jsx
       * dragControls.start(e, {
       *   snapToCursor: true
       * })
       * ```
       *
       * @param event - PointerEvent
       * @param options - Options
       *
       * @public
       */
      start(event, options) {
        this.componentControls.forEach((controls) => {
          controls.start(event.nativeEvent || event, options);
        });
      }
      /**
       * Cancels a drag gesture.
       *
       * ```jsx
       * dragControls.cancel()
       * ```
       *
       * @public
       */
      cancel() {
        this.componentControls.forEach((controls) => {
          controls.cancel();
        });
      }
      /**
       * Stops a drag gesture.
       *
       * ```jsx
       * dragControls.stop()
       * ```
       *
       * @public
       */
      stop() {
        this.componentControls.forEach((controls) => {
          controls.stop();
        });
      }
    }
    const createDragControls = () => new DragControls();
    function useDragControls() {
      return featureBundle.useConstant(createDragControls);
    }
    function isMotionComponent(component) {
      return component !== null && typeof component === "object" && featureBundle.motionComponentSymbol in component;
    }
    function unwrapMotionComponent(component) {
      if (isMotionComponent(component)) {
        return component[featureBundle.motionComponentSymbol];
      }
      return void 0;
    }
    function useInstantLayoutTransition() {
      return startTransition;
    }
    function startTransition(callback) {
      if (!motionDom.rootProjectionNode.current)
        return;
      motionDom.rootProjectionNode.current.isUpdating = false;
      motionDom.rootProjectionNode.current.blockUpdate();
      callback && callback();
    }
    function useResetProjection() {
      const reset = React.useCallback(() => {
        const root = motionDom.rootProjectionNode.current;
        if (!root)
          return;
        root.resetTree();
      }, []);
      return reset;
    }
    function useCycle(...items) {
      const index = React.useRef(0);
      const [item, setItem] = React.useState(items[index.current]);
      const runCycle = React.useCallback(
        (next) => {
          index.current = typeof next !== "number" ? motionUtils.wrap(0, items.length, index.current + 1) : next;
          setItem(items[index.current]);
        },
        // The array will change on each call, but by putting items.length at
        // the front of this array, we guarantee the dependency comparison will match up
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [items.length, ...items]
      );
      return [item, runCycle];
    }
    function useInView(ref, { root, margin, amount, once = false, initial = false } = {}) {
      const [isInView, setInView] = React.useState(initial);
      React.useEffect(() => {
        if (!ref.current || once && isInView)
          return;
        const onEnter = () => {
          setInView(true);
          return once ? void 0 : () => setInView(false);
        };
        const options = {
          root: root && root.current || void 0,
          margin,
          amount
        };
        return inView(ref.current, onEnter, options);
      }, [root, ref, margin, once, amount]);
      return isInView;
    }
    function useInstantTransition() {
      const [forceUpdate, forcedRenderCount] = useForceUpdate();
      const startInstantLayoutTransition = useInstantLayoutTransition();
      const unlockOnFrameRef = React.useRef(-1);
      React.useEffect(() => {
        motionDom.frame.postRender(() => motionDom.frame.postRender(() => {
          if (forcedRenderCount !== unlockOnFrameRef.current)
            return;
          motionUtils.MotionGlobalConfig.instantAnimations = false;
        }));
      }, [forcedRenderCount]);
      return (callback) => {
        startInstantLayoutTransition(() => {
          motionUtils.MotionGlobalConfig.instantAnimations = true;
          forceUpdate();
          callback();
          unlockOnFrameRef.current = forcedRenderCount + 1;
        });
      };
    }
    function disableInstantTransitions() {
      motionUtils.MotionGlobalConfig.instantAnimations = false;
    }
    function usePageInView() {
      const [isInView, setIsInView] = React.useState(true);
      React.useEffect(() => {
        const handleVisibilityChange = () => setIsInView(!document.hidden);
        if (document.hidden) {
          handleVisibilityChange();
        }
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
          document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
      }, []);
      return isInView;
    }
    function transformViewBoxPoint(svgRef) {
      return (point2) => {
        const svg = svgRef.current;
        if (!svg) {
          return point2;
        }
        const viewBox = svg.viewBox?.baseVal;
        if (!viewBox || viewBox.width === 0 && viewBox.height === 0) {
          return point2;
        }
        const bbox = svg.getBoundingClientRect();
        if (bbox.width === 0 || bbox.height === 0) {
          return point2;
        }
        const scaleX = viewBox.width / bbox.width;
        const scaleY = viewBox.height / bbox.height;
        const svgX = bbox.left + window.scrollX;
        const svgY = bbox.top + window.scrollY;
        return {
          x: (point2.x - svgX) * scaleX + svgX,
          y: (point2.y - svgY) * scaleY + svgY
        };
      };
    }
    function correctParentTransform(parentRef) {
      return (point2) => {
        const parent = parentRef.current;
        if (!parent)
          return point2;
        const inv = getInverseMatrix(parent);
        if (!inv)
          return point2;
        const rect = parent.getBoundingClientRect();
        const cx = rect.left + window.scrollX + rect.width / 2;
        const cy = rect.top + window.scrollY + rect.height / 2;
        const dx = point2.x - cx;
        const dy = point2.y - cy;
        return {
          x: cx + inv.a * dx + inv.c * dy,
          y: cy + inv.b * dx + inv.d * dy
        };
      };
    }
    function getInverseMatrix(element) {
      const { transform } = getComputedStyle(element);
      if (!transform || transform === "none")
        return null;
      const match = transform.match(/^matrix3d\((.*)\)$/u) || transform.match(/^matrix\((.*)\)$/u);
      if (!match)
        return null;
      const v = match[1].split(",").map(Number);
      const is3d = transform.startsWith("matrix3d");
      const a = v[0], b = v[1];
      const c = is3d ? v[4] : v[2];
      const d = is3d ? v[5] : v[3];
      const det = a * d - b * c;
      if (Math.abs(det) < 1e-10)
        return null;
      return { a: d / det, b: -b / det, c: -c / det, d: a / det };
    }
    const appearAnimationStore = /* @__PURE__ */ new Map();
    const appearComplete = /* @__PURE__ */ new Map();
    const appearStoreId = (elementId, valueName) => {
      const key = motionDom.transformProps.has(valueName) ? "transform" : valueName;
      return `${elementId}: ${key}`;
    };
    function handoffOptimizedAppearAnimation(elementId, valueName, frame) {
      const storeId = appearStoreId(elementId, valueName);
      const optimisedAnimation = appearAnimationStore.get(storeId);
      if (!optimisedAnimation) {
        return null;
      }
      const { animation, startTime } = optimisedAnimation;
      function cancelAnimation() {
        window.MotionCancelOptimisedAnimation?.(elementId, valueName, frame);
      }
      animation.onfinish = cancelAnimation;
      if (startTime === null || window.MotionHandoffIsComplete?.(elementId)) {
        cancelAnimation();
        return null;
      } else {
        return startTime;
      }
    }
    let startFrameTime;
    let readyAnimation;
    const suspendedAnimations = /* @__PURE__ */ new Set();
    function resumeSuspendedAnimations() {
      suspendedAnimations.forEach((data) => {
        data.animation.play();
        data.animation.startTime = data.startTime;
      });
      suspendedAnimations.clear();
    }
    function startOptimizedAppearAnimation(element, name, keyframes, options, onReady) {
      if (window.MotionIsMounted) {
        return;
      }
      const id2 = element.dataset[motionDom.optimizedAppearDataId];
      if (!id2)
        return;
      window.MotionHandoffAnimation = handoffOptimizedAppearAnimation;
      const storeId = appearStoreId(id2, name);
      if (!readyAnimation) {
        readyAnimation = motionDom.startWaapiAnimation(
          element,
          name,
          [keyframes[0], keyframes[0]],
          /**
           * 10 secs is basically just a super-safe duration to give Chrome
           * long enough to get the animation ready.
           */
          { duration: 1e4, ease: "linear" }
        );
        appearAnimationStore.set(storeId, {
          animation: readyAnimation,
          startTime: null
        });
        window.MotionHandoffAnimation = handoffOptimizedAppearAnimation;
        window.MotionHasOptimisedAnimation = (elementId, valueName) => {
          if (!elementId)
            return false;
          if (!valueName) {
            return appearComplete.has(elementId);
          }
          const animationId = appearStoreId(elementId, valueName);
          return Boolean(appearAnimationStore.get(animationId));
        };
        window.MotionHandoffMarkAsComplete = (elementId) => {
          if (appearComplete.has(elementId)) {
            appearComplete.set(elementId, true);
          }
        };
        window.MotionHandoffIsComplete = (elementId) => {
          return appearComplete.get(elementId) === true;
        };
        window.MotionCancelOptimisedAnimation = (elementId, valueName, frame, canResume) => {
          const animationId = appearStoreId(elementId, valueName);
          const data = appearAnimationStore.get(animationId);
          if (!data)
            return;
          if (frame && canResume === void 0) {
            frame.postRender(() => {
              frame.postRender(() => {
                data.animation.cancel();
              });
            });
          } else {
            data.animation.cancel();
          }
          if (frame && canResume) {
            suspendedAnimations.add(data);
            frame.render(resumeSuspendedAnimations);
          } else {
            appearAnimationStore.delete(animationId);
            if (!appearAnimationStore.size) {
              window.MotionCancelOptimisedAnimation = void 0;
            }
          }
        };
        window.MotionCheckAppearSync = (visualElement, valueName, value) => {
          const appearId = motionDom.getOptimisedAppearId(visualElement);
          if (!appearId)
            return;
          const valueIsOptimised = window.MotionHasOptimisedAnimation?.(appearId, valueName);
          const externalAnimationValue = visualElement.props.values?.[valueName];
          if (!valueIsOptimised || !externalAnimationValue)
            return;
          const removeSyncCheck = value.on("change", (latestValue) => {
            if (externalAnimationValue.get() !== latestValue) {
              window.MotionCancelOptimisedAnimation?.(appearId, valueName);
              removeSyncCheck();
            }
          });
          return removeSyncCheck;
        };
      }
      const startAnimation = () => {
        readyAnimation.cancel();
        const appearAnimation = motionDom.startWaapiAnimation(element, name, keyframes, options);
        if (startFrameTime === void 0) {
          startFrameTime = performance.now();
        }
        appearAnimation.startTime = startFrameTime;
        appearAnimationStore.set(storeId, {
          animation: appearAnimation,
          startTime: startFrameTime
        });
        if (onReady)
          onReady(appearAnimation);
      };
      appearComplete.set(id2, false);
      if (readyAnimation.ready) {
        readyAnimation.ready.then(startAnimation).catch(motionUtils.noop);
      } else {
        startAnimation();
      }
    }
    const createObject = () => ({});
    class StateVisualElement extends motionDom.VisualElement {
      constructor() {
        super(...arguments);
        this.measureInstanceViewportBox = motionDom.createBox;
      }
      build() {
      }
      resetTransform() {
      }
      restoreTransform() {
      }
      removeValueFromRenderState() {
      }
      renderInstance() {
      }
      scrapeMotionValuesFromProps() {
        return createObject();
      }
      getBaseTargetFromProps() {
        return void 0;
      }
      readValueFromInstance(_state, key, options) {
        return options.initialState[key] || 0;
      }
      sortInstanceNodePosition() {
        return 0;
      }
    }
    const useVisualState = featureBundle.makeUseVisualState({
      scrapeMotionValuesFromProps: createObject,
      createRenderState: createObject
    });
    function useAnimatedState(initialState) {
      const [animationState, setAnimationState] = React.useState(initialState);
      const visualState = useVisualState({}, false);
      const element = featureBundle.useConstant(() => {
        return new StateVisualElement({
          props: {
            onUpdate: (v) => {
              setAnimationState({ ...v });
            }
          },
          visualState,
          presenceContext: null
        }, { initialState });
      });
      React.useLayoutEffect(() => {
        element.mount({});
        return () => element.unmount();
      }, [element]);
      const startAnimation = featureBundle.useConstant(() => (animationDefinition) => {
        return motionDom.animateVisualElement(element, animationDefinition);
      });
      return [animationState, startAnimation];
    }
    let id = 0;
    const AnimateSharedLayout = ({ children }) => {
      React__namespace.useEffect(() => {
        motionUtils.invariant(false, "AnimateSharedLayout is deprecated: https://www.framer.com/docs/guide-upgrade/##shared-layout-animations");
      }, []);
      return jsxRuntime.jsx(LayoutGroup, { id: featureBundle.useConstant(() => `asl-${id++}`), children });
    };
    const maxScale = 1e5;
    const invertScale = (scale) => scale > 1e-3 ? 1 / scale : maxScale;
    let hasWarned = false;
    function useInvertedScale(scale) {
      let parentScaleX = useMotionValue(1);
      let parentScaleY = useMotionValue(1);
      const { visualElement } = React.useContext(featureBundle.MotionContext);
      motionUtils.invariant(!!(scale || visualElement), "If no scale values are provided, useInvertedScale must be used within a child of another motion component.");
      motionUtils.warning(hasWarned, "useInvertedScale is deprecated and will be removed in 3.0. Use the layout prop instead.");
      hasWarned = true;
      if (scale) {
        parentScaleX = scale.scaleX || parentScaleX;
        parentScaleY = scale.scaleY || parentScaleY;
      } else if (visualElement) {
        parentScaleX = visualElement.getValue("scaleX", 1);
        parentScaleY = visualElement.getValue("scaleY", 1);
      }
      const scaleX = useTransform(parentScaleX, invertScale);
      const scaleY = useTransform(parentScaleY, invertScale);
      return { scaleX, scaleY };
    }
    exports.LayoutGroupContext = featureBundle.LayoutGroupContext;
    exports.MotionConfigContext = featureBundle.MotionConfigContext;
    exports.MotionContext = featureBundle.MotionContext;
    exports.PresenceContext = featureBundle.PresenceContext;
    exports.SwitchLayoutGroupContext = featureBundle.SwitchLayoutGroupContext;
    exports.addPointerEvent = featureBundle.addPointerEvent;
    exports.addPointerInfo = featureBundle.addPointerInfo;
    exports.animations = featureBundle.animations;
    exports.distance = featureBundle.distance;
    exports.distance2D = featureBundle.distance2D;
    exports.filterProps = featureBundle.filterProps;
    exports.isBrowser = featureBundle.isBrowser;
    exports.isValidMotionProp = featureBundle.isValidMotionProp;
    exports.makeUseVisualState = featureBundle.makeUseVisualState;
    exports.useIsPresent = featureBundle.useIsPresent;
    exports.useIsomorphicLayoutEffect = featureBundle.useIsomorphicLayoutEffect;
    exports.usePresence = featureBundle.usePresence;
    Object.defineProperty(exports, "VisualElement", {
      enumerable: true,
      get: function() {
        return motionDom.VisualElement;
      }
    });
    Object.defineProperty(exports, "addScaleCorrector", {
      enumerable: true,
      get: function() {
        return motionDom.addScaleCorrector;
      }
    });
    Object.defineProperty(exports, "animateVisualElement", {
      enumerable: true,
      get: function() {
        return motionDom.animateVisualElement;
      }
    });
    Object.defineProperty(exports, "buildTransform", {
      enumerable: true,
      get: function() {
        return motionDom.buildTransform;
      }
    });
    Object.defineProperty(exports, "calcLength", {
      enumerable: true,
      get: function() {
        return motionDom.calcLength;
      }
    });
    Object.defineProperty(exports, "createBox", {
      enumerable: true,
      get: function() {
        return motionDom.createBox;
      }
    });
    Object.defineProperty(exports, "delay", {
      enumerable: true,
      get: function() {
        return motionDom.delay;
      }
    });
    Object.defineProperty(exports, "optimizedAppearDataAttribute", {
      enumerable: true,
      get: function() {
        return motionDom.optimizedAppearDataAttribute;
      }
    });
    Object.defineProperty(exports, "resolveMotionValue", {
      enumerable: true,
      get: function() {
        return motionDom.resolveMotionValue;
      }
    });
    Object.defineProperty(exports, "visualElementStore", {
      enumerable: true,
      get: function() {
        return motionDom.visualElementStore;
      }
    });
    Object.defineProperty(exports, "MotionGlobalConfig", {
      enumerable: true,
      get: function() {
        return motionUtils.MotionGlobalConfig;
      }
    });
    exports.AnimatePresence = AnimatePresence;
    exports.AnimateSharedLayout = AnimateSharedLayout;
    exports.DeprecatedLayoutGroupContext = DeprecatedLayoutGroupContext;
    exports.DragControls = DragControls;
    exports.LayoutGroup = LayoutGroup;
    exports.LazyMotion = LazyMotion;
    exports.MotionConfig = MotionConfig;
    exports.PopChild = PopChild;
    exports.PresenceChild = PresenceChild;
    exports.Reorder = namespace;
    exports.WillChangeMotionValue = WillChangeMotionValue;
    exports.animate = animate;
    exports.animateMini = animateMini;
    exports.animationControls = animationControls;
    exports.correctParentTransform = correctParentTransform;
    exports.createScopedAnimate = createScopedAnimate;
    exports.disableInstantTransitions = disableInstantTransitions;
    exports.domAnimation = domAnimation;
    exports.domMax = domMax;
    exports.domMin = domMin;
    exports.inView = inView;
    exports.isMotionComponent = isMotionComponent;
    exports.m = m;
    exports.motion = motion;
    exports.scroll = scroll;
    exports.scrollInfo = scrollInfo;
    exports.startOptimizedAppearAnimation = startOptimizedAppearAnimation;
    exports.transformViewBoxPoint = transformViewBoxPoint;
    exports.unwrapMotionComponent = unwrapMotionComponent;
    exports.useAnimate = useAnimate;
    exports.useAnimateMini = useAnimateMini;
    exports.useAnimation = useAnimation;
    exports.useAnimationControls = useAnimationControls;
    exports.useAnimationFrame = useAnimationFrame;
    exports.useComposedRefs = useComposedRefs;
    exports.useCycle = useCycle;
    exports.useDeprecatedAnimatedState = useAnimatedState;
    exports.useDeprecatedInvertedScale = useInvertedScale;
    exports.useDomEvent = useDomEvent;
    exports.useDragControls = useDragControls;
    exports.useElementScroll = useElementScroll;
    exports.useFollowValue = useFollowValue;
    exports.useForceUpdate = useForceUpdate;
    exports.useInView = useInView;
    exports.useInstantLayoutTransition = useInstantLayoutTransition;
    exports.useInstantTransition = useInstantTransition;
    exports.useMotionTemplate = useMotionTemplate;
    exports.useMotionValue = useMotionValue;
    exports.useMotionValueEvent = useMotionValueEvent;
    exports.usePageInView = usePageInView;
    exports.usePresenceData = usePresenceData;
    exports.useReducedMotion = useReducedMotion;
    exports.useReducedMotionConfig = useReducedMotionConfig;
    exports.useResetProjection = useResetProjection;
    exports.useScroll = useScroll;
    exports.useSpring = useSpring;
    exports.useTime = useTime;
    exports.useTransform = useTransform;
    exports.useUnmountEffect = useUnmountEffect;
    exports.useVelocity = useVelocity;
    exports.useViewportScroll = useViewportScroll;
    exports.useWillChange = useWillChange;
    Object.keys(motionDom).forEach(function(k) {
      if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
        enumerable: true,
        get: function() {
          return motionDom[k];
        }
      });
    });
    Object.keys(motionUtils).forEach(function(k) {
      if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
        enumerable: true,
        get: function() {
          return motionUtils[k];
        }
      });
    });
  })(cjs$2);
  return cjs$2;
}
var cjsExports = requireCjs();
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const __iconNode = [
  ["path", { d: "M10 18v-7", key: "wt116b" }],
  [
    "path",
    {
      d: "M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z",
      key: "1m329m"
    }
  ],
  ["path", { d: "M14 18v-7", key: "vav6t3" }],
  ["path", { d: "M18 18v-7", key: "aexdmj" }],
  ["path", { d: "M3 22h18", key: "8prr45" }],
  ["path", { d: "M6 18v-7", key: "1ivflk" }]
];
const Landmark = createLucideIcon("landmark", __iconNode);
export {
  Landmark as L,
  cjsExports as a,
  createLucideIcon as c
};
