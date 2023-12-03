const anglePerSecond = 360 / (24 * 60 * 60);

function createSvgElement(tagName) {
  return document.createElementNS("http://www.w3.org/2000/svg", tagName);
}

function getFixedNumberString(number) {
  return number.toFixed(6);
}

function polarToCartesian(radius, angle) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return [radius * Math.cos(radians), radius * Math.sin(radians)];
}

function svgArcPath(x, y, radius, startAngle, endAngle) {
  const start_xy = polarToCartesian(radius, startAngle);
  const end_xy = polarToCartesian(radius, endAngle);

  const long = mod(endAngle - startAngle, 360) > 180;

  // end to start is clockwise
  const sweep = false;

  const path = `M ${getFixedNumberString(x + end_xy[0])} ${getFixedNumberString(
    y + end_xy[1]
  )} A ${getFixedNumberString(radius)} ${getFixedNumberString(radius)} 0 ${
    long ? "1" : "0"
  } ${sweep ? "1" : "0"} ${getFixedNumberString(
    x + start_xy[0]
  )} ${getFixedNumberString(y + start_xy[1])}`;

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

  width = 300;
  height = 300;
  radius = 100;
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

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    // dom
    const svgEl = createSvgElement("svg");
    const circleEl = createSvgElement("circle");
    const pathEl = createSvgElement("path");
    const startEl = createSvgElement("circle");
    const endEl = createSvgElement("circle");
    const scalesGroupEl = createSvgElement("g");

    // init
    svgEl.setAttribute("viewBox", "0 0 300 300");
    svgEl.setAttribute("width", "300");
    svgEl.setAttribute("height", "300");
    svgEl.setAttribute("class", "circular-time-range-picker");

    circleEl.setAttribute("cx", 150);
    circleEl.setAttribute("cy", 150);
    circleEl.setAttribute("r", 100);
    circleEl.setAttribute("stroke", "#ddd");
    circleEl.setAttribute("fill", "none");
    circleEl.setAttribute("stroke-width", 24);

    pathEl.setAttribute("class", "circular-time-range-picker__path");
    pathEl.setAttribute("stroke-linecap", "round");
    pathEl.setAttribute("stroke", "#666");
    pathEl.setAttribute("stroke-width", 24);
    pathEl.setAttribute("fill", "none");
    pathEl.setAttribute("d", "");
    pathEl.dataset["pressedType"] = "path";

    startEl.setAttribute("class", "circular-time-range-picker__start");
    startEl.setAttribute("cx", 150);
    startEl.setAttribute("cy", 150);
    startEl.setAttribute("r", 12);
    startEl.setAttribute("fill", "#000");
    startEl.dataset["pressedType"] = "start";

    endEl.setAttribute("class", "circular-time-range-picker__end");
    endEl.setAttribute("cx", 150);
    endEl.setAttribute("cy", 150);
    endEl.setAttribute("r", 12);
    endEl.setAttribute("fill", "#000");
    endEl.dataset["pressedType"] = "end";

    // scales
    scalesGroupEl.setAttribute(
      "class",
      "circular-time-range-picker__scales-group"
    );
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 4; j++) {
        // line
        let lineLength = 1;
        if (j === 0) {
          lineLength = 3;
        }

        const angle = i * (360 / 24) + j * (360 / 24 / 4);
        const scale = createSvgElement("line");

        const lineY = this.height / 2 - this.radius + 24;

        scale.setAttribute("x1", this.width / 2);
        scale.setAttribute("y1", lineY);
        scale.setAttribute("x2", this.width / 2);
        scale.setAttribute("y2", lineY + lineLength);
        scale.setAttribute("stroke", "#000");
        scale.setAttribute("stroke-width", 1);
        scale.setAttribute(
          "transform",
          `rotate(${angle} ${this.width / 2} ${this.height / 2})`
        );
        scalesGroupEl.appendChild(scale);

        // text
        if (j === 0 && i % 2 === 0) {
          const text = createSvgElement("text");

          const cartesian = polarToCartesian(this.radius - 40, angle);

          text.setAttribute("x", this.width / 2 + cartesian[0]);
          text.setAttribute("y", this.height / 2 + cartesian[1] + 6);
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("fill", "#000");
          text.setAttribute("font-size", "12px");
          text.textContent = i;
          scalesGroupEl.appendChild(text);
        }
      }
    }

    // append
    svgEl.appendChild(circleEl);
    svgEl.appendChild(pathEl);
    svgEl.appendChild(startEl);
    svgEl.appendChild(endEl);
    svgEl.appendChild(scalesGroupEl);

    this.svgEl = svgEl;
    this.circleEl = circleEl;
    this.startEl = startEl;
    this.endEl = endEl;
    this.pathEl = pathEl;

    // style
    const style = createSvgElement("style");

    style.textContent = `
      .circular-time-range-picker__scales-group {
	pointer-events: none;
	user-select: none;
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

    this.calledConnectedCallback = true;
  }

  disconnectedCallback() {
    // events
    this.pathEl.removeEventListener("mousedown", this.handleMouseDown);
    this.startEl.removeEventListener("mousedown", this.handleMouseDown);
    this.endEl.removeEventListener("mousedown", this.handleMouseDown);
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
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

  draw() {
    this.pathEl.setAttribute(
      "d",
      svgArcPath(
        this.width / 2,
        this.height / 2,
        this.radius,
        this.startAngle,
        this.endAngle
      )
    );

    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;

    const startCartesian = polarToCartesian(this.radius, this.startAngle);
    this.startEl.setAttribute(
      "cx",
      getFixedNumberString(halfWidth + startCartesian[0])
    );
    this.startEl.setAttribute(
      "cy",
      getFixedNumberString(halfHeight + startCartesian[1])
    );

    const endCartesian = polarToCartesian(this.radius, this.endAngle);
    this.endEl.setAttribute(
      "cx",
      getFixedNumberString(halfWidth + endCartesian[0])
    );
    this.endEl.setAttribute(
      "cy",
      getFixedNumberString(halfHeight + endCartesian[1])
    );
  }

  handleMouseDown = function (e) {
    const pressed = e.currentTarget.dataset.pressedType;

    if (!pressed) {
      return;
    }

    this.pressed = pressed;

    this.angle = this.getAngle({
      clientX: e.clientX,
      clientY: e.clientY,
    });
    this.oldStartAngle = this.startAngle;
    this.oldEndAngle = this.endAngle;
  }.bind(this);

  handleMouseMove = function (e) {
    if (this.pressed) {
      const newAngle = this.getAngle({
        clientX: e.clientX,
        clientY: e.clientY,
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
