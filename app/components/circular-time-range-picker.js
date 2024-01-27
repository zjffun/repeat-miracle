import { centerToEndpoint, getPointForAngle } from "svg-arc-center-endpoint";

const anglePerSecond = 360 / (24 * 60 * 60);

function createSvgElement(tagName) {
  return document.createElementNS("http://www.w3.org/2000/svg", tagName);
}

function getFixedNumberString(number) {
  return number.toFixed(6);
}

function svgArcPath(x, y, radius, startAngle, endAngle) {
  const {
    x1,
    x2,
    y1,
    y2,
    fa: largeArcFlag,
    fs: sweepFlag,
  } = centerToEndpoint({
    cx: x,
    cy: y,
    rx: radius,
    ry: radius,
    phi: 0,
    theta: startAngle,
    dTheta: mod(endAngle - startAngle, 360),
  });

  const path = `M ${getFixedNumberString(x1)} ${getFixedNumberString(
    y1
  )} A ${getFixedNumberString(radius)} ${getFixedNumberString(
    radius
  )} 0 ${largeArcFlag} ${sweepFlag} ${getFixedNumberString(
    x2
  )} ${getFixedNumberString(y2)}`;

  return path;
}

function angleFromPoint(x, y) {
  // make the range to 0 - 360
  const angle = mod((Math.atan2(y, x) * 180) / Math.PI, 360);

  return angle;
}

function secondToAngle(time) {
  return time * anglePerSecond;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function angleToSecond(angle) {
  return angle / anglePerSecond;
}

class CircularTimeRangePicker extends HTMLElement {
  static observedAttributes = ["start", "end"];

  constructor() {
    // Always call super first in constructor
    super();
  }

  width = parseInt(this.getAttribute("width"), 10) || 250;
  height = parseInt(this.getAttribute("height"), 10) || 250;
  radius = parseInt(this.getAttribute("radius"), 10) || 100;
  strokeWidth = parseInt(this.getAttribute("stroke-width"), 10) || 24;
  tickMargin = 6;
  textSize = 12;
  textMargin = 6;
  startAngle = 0;
  endAngle = 0;
  oldStartAngle = 0;
  oldEndAngle = 0;
  passed = null;
  calledConnectedCallback = false;

  svgEl = null;
  circleEl = null;
  pathEl = null;
  startEl = null;
  endEl = null;
  scalesGroupEl = null;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    // dom
    const svgEl = createSvgElement("svg");
    const circleEl = createSvgElement("circle");
    const pathEl = createSvgElement("path");
    const startEl = createSvgElement("circle");
    const endEl = createSvgElement("circle");
    const scalesGroupEl = createSvgElement("g");

    this.svgEl = svgEl;
    this.circleEl = circleEl;
    this.startEl = startEl;
    this.endEl = endEl;
    this.pathEl = pathEl;
    this.scalesGroupEl = scalesGroupEl;

    // init
    svgEl.setAttribute("class", "circular-time-range-picker");

    circleEl.setAttribute("class", "circular-time-range-picker__circle");
    circleEl.setAttribute("fill", "none");

    pathEl.setAttribute("class", "circular-time-range-picker__path");
    pathEl.setAttribute("stroke-linecap", "round");
    pathEl.setAttribute("fill", "none");
    pathEl.setAttribute("d", "");
    pathEl.dataset["pressedType"] = "path";

    startEl.setAttribute("class", "circular-time-range-picker__start");
    startEl.dataset["pressedType"] = "start";

    endEl.setAttribute("class", "circular-time-range-picker__end");
    endEl.dataset["pressedType"] = "end";

    this.resize();

    // append
    svgEl.appendChild(circleEl);
    svgEl.appendChild(pathEl);
    svgEl.appendChild(startEl);
    svgEl.appendChild(endEl);
    svgEl.appendChild(scalesGroupEl);

    // style
    const style = createSvgElement("style");

    style.textContent = `
      .circular-time-range-picker {

      }
      .circular-time-range-picker__circle {
        stroke: var(--md-sys-color-surface, #ccc);
      }
      .circular-time-range-picker__start, .circular-time-range-picker__end {
        fill: var(--md-sys-color-on-surface, #333);
      }
      .circular-time-range-picker__path {
        stroke: var(--md-sys-color-primary, #666);
      }
      .circular-time-range-picker__scales-group {
        pointer-events: none;
        user-select: none;
      }
      .circular-time-range-picker__scale-tick {
        stroke: var(--md-sys-color-on-surface, #333);
      }
      .circular-time-range-picker__scale-text {
        fill: var(--md-sys-color-on-surface, #333);
      }
    `;
    shadow.appendChild(style);
    shadow.appendChild(svgEl);

    // draw
    this.draw();

    // events
    pathEl.addEventListener("mousedown", this.handleMouseDown);
    startEl.addEventListener("mousedown", this.handleMouseDown);
    endEl.addEventListener("mousedown", this.handleMouseDown);
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);

    pathEl.addEventListener("touchstart", this.handleMouseDown);
    startEl.addEventListener("touchstart", this.handleMouseDown);
    endEl.addEventListener("touchstart", this.handleMouseDown);
    document.addEventListener("touchmove", this.handleMouseMove, {
      // prevent touch scroll
      // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#passive
      passive: false,
    });
    document.addEventListener("touchend", this.handleMouseUp);

    this.calledConnectedCallback = true;
  }

  disconnectedCallback() {
    // events
    this.pathEl.removeEventListener("mousedown", this.handleMouseDown);
    this.startEl.removeEventListener("mousedown", this.handleMouseDown);
    this.endEl.removeEventListener("mousedown", this.handleMouseDown);
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);

    this.pathEl.removeEventListener("touchstart", this.handleMouseDown);
    this.startEl.removeEventListener("touchstart", this.handleMouseDown);
    this.endEl.removeEventListener("touchstart", this.handleMouseDown);
    document.removeEventListener("touchmove", this.handleMouseMove);
    document.removeEventListener("touchend", this.handleMouseUp);
  }

  adoptedCallback() {
    // TODO: implement
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "start") {
      this.startAngle = secondToAngle(newValue);
    }

    if (name === "end") {
      this.endAngle = secondToAngle(newValue);
    }

    if (name === "width") {
      this.width = parseInt(newValue, 10);
      this.resize();
    }

    if (name === "height") {
      this.height = parseInt(newValue, 10);
      this.resize();
    }

    if (name === "radius") {
      this.radius = parseInt(newValue, 10);
      this.resize();
    }

    if (name === "stroke-width") {
      this.strokeWidth = parseInt(newValue, 10);
      this.resize();
    }
    console.log(
      "circular-time-range-picker.js:215",
      name,
      this.getAttribute("stroke-width")
    );

    if (this.calledConnectedCallback && oldValue !== newValue) {
      this.draw();
    }
  }

  getAngle({ clientX, clientY }) {
    const boundingClientRect = this.circleEl.getBoundingClientRect();

    const angle = angleFromPoint(
      clientX - boundingClientRect.left - boundingClientRect.width / 2,
      clientY - boundingClientRect.top - boundingClientRect.height / 2
    );

    return angle;
  }

  resize() {
    // dom
    const { svgEl, circleEl, pathEl, startEl, endEl, scalesGroupEl } = this;

    // init
    svgEl.setAttribute("viewBox", `0 0 ${this.width} ${this.height}`);
    svgEl.setAttribute("width", this.width);
    svgEl.setAttribute("height", this.height);

    circleEl.setAttribute("cx", this.width / 2);
    circleEl.setAttribute("cy", this.height / 2);
    circleEl.setAttribute("r", this.radius);
    circleEl.setAttribute("stroke-width", this.strokeWidth);

    pathEl.setAttribute("stroke-width", this.strokeWidth);

    startEl.setAttribute("cx", this.width / 2);
    startEl.setAttribute("cy", this.height / 2);
    startEl.setAttribute("r", this.strokeWidth / 2);

    endEl.setAttribute("cx", this.width / 2);
    endEl.setAttribute("cy", this.height / 2);
    endEl.setAttribute("r", this.strokeWidth / 2);

    // scales
    scalesGroupEl.innerHTML = "";
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 4; j++) {
        // line
        let lineLength = 1;
        if (j === 0) {
          lineLength = 3;
        }

        const angle = i * (360 / 24) + j * (360 / 24 / 4);
        const scale = createSvgElement("line");

        const lineY =
          this.height / 2 -
          this.radius +
          this.strokeWidth / 2 +
          this.tickMargin;

        scale.setAttribute("class", "circular-time-range-picker__scale-tick");
        scale.setAttribute("x1", this.width / 2);
        scale.setAttribute("y1", lineY);
        scale.setAttribute("x2", this.width / 2);
        scale.setAttribute("y2", lineY + lineLength);
        scale.setAttribute("stroke-width", 1);
        scale.setAttribute(
          "transform",
          `rotate(${angle} ${this.width / 2} ${this.height / 2})`
        );
        scalesGroupEl.appendChild(scale);

        // text
        if (j === 0 && i % 2 === 0) {
          const text = createSvgElement("text");

          const r =
            this.radius -
            this.strokeWidth / 2 -
            this.tickMargin -
            this.textSize -
            this.textMargin;

          const [x, y] = getPointForAngle({
            cx: this.width / 2,
            cy: this.height / 2,
            rx: r,
            ry: r,
            phi: 0,
            theta: angle - 90,
          });

          text.setAttribute("class", "circular-time-range-picker__scale-text");
          text.setAttribute("x", x);
          text.setAttribute("y", y + this.textSize / 2);
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("font-size", `${this.textSize}px`);
          text.textContent = i;
          scalesGroupEl.appendChild(text);
        }
      }
    }
  }

  draw() {
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;

    this.pathEl.setAttribute(
      "d",
      svgArcPath(
        halfWidth,
        halfHeight,
        this.radius,
        this.startAngle - 90,
        this.endAngle - 90
      )
    );

    const [startX, startY] = getPointForAngle({
      cx: halfWidth,
      cy: halfHeight,
      rx: this.radius,
      ry: this.radius,
      phi: 0,
      theta: this.startAngle - 90,
    });
    this.startEl.setAttribute("cx", getFixedNumberString(startX));
    this.startEl.setAttribute("cy", getFixedNumberString(startY));

    const [endX, endY] = getPointForAngle({
      cx: halfWidth,
      cy: halfHeight,
      rx: this.radius,
      ry: this.radius,
      phi: 0,
      theta: this.endAngle - 90,
    });
    this.endEl.setAttribute("cx", getFixedNumberString(endX));
    this.endEl.setAttribute("cy", getFixedNumberString(endY));
  }

  handleMouseDown = function (e) {
    const pressed = e.currentTarget.dataset.pressedType;

    if (!pressed) {
      return;
    }

    this.pressed = pressed;

    this.angle = this.getAngle({
      clientX: e.clientX || e.targetTouches[0].clientX,
      clientY: e.clientY || e.targetTouches[0].clientY,
    });
    this.oldStartAngle = this.startAngle;
    this.oldEndAngle = this.endAngle;
  }.bind(this);

  handleMouseMove = function (e) {
    if (!this.pressed) {
      return;
    }

    // prevent touch scroll
    e.preventDefault();

    if (this.pressed) {
      const newAngle = this.getAngle({
        clientX: e.clientX || e.targetTouches[0].clientX,
        clientY: e.clientY || e.targetTouches[0].clientY,
      });
      var diff = this.angle - newAngle;

      if (this.pressed == "path") {
        this.startAngle = mod(this.oldStartAngle - diff, 360);
        this.endAngle = mod(this.oldEndAngle - diff, 360);
      } else if (this.pressed == "start") {
        this.startAngle = mod(this.oldStartAngle - diff, 360);
      } else if (this.pressed == "end") {
        this.endAngle = mod(this.oldEndAngle - diff, 360);
      }

      requestAnimationFrame(() => {
        this.draw();
      });

      this.dispatchEvent(
        new InputEvent("input", {
          detail: {
            start: angleToSecond(this.startAngle),
            end: angleToSecond(this.endAngle),
          },
        })
      );

      this.dispatchEvent(
        new CustomEvent("input", {
          detail: {
            start: angleToSecond(this.startAngle),
            end: angleToSecond(this.endAngle),
          },
        })
      );
    }
  }.bind(this);

  handleMouseUp = function (e) {
    if (!this.pressed) {
      return;
    }

    this.pressed = null;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          start: angleToSecond(this.startAngle),
          end: angleToSecond(this.endAngle),
        },
      })
    );
  }.bind(this);
}

customElements.define("circular-time-range-picker", CircularTimeRangePicker);

export default CircularTimeRangePicker;
