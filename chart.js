function animateChartHeight() {
  const chartItems = Array.from(document.querySelectorAll(".chart-item"));

  chartItems.forEach((item) => {
    const barChart = item.querySelector(".bar-chart");
    const value = Number(barChart.getAttribute("data-value"));
    let height = 0;

    const interval = setInterval(() => {
      if (height < value) {
        height++;
        item.style.height = `${height}px`;
      } else {
        clearInterval(interval);
      }
    }, 2);
  });
}

function animateMidDot() {
  const midDots = Array.from(document.querySelectorAll(".mid-dot"));

  midDots.forEach((dot, index) => {
    setTimeout(() => {
      dot.style.opacity = 1;
      dot.style.transition = "opacity 1s";
    }, index * 300); // 1000ms 간격으로 middot이 나타납니다.
  });
}

function generateSvgChart() {
  const chartContainer = document.querySelector(".chart-container");
  const width = chartContainer.offsetWidth;
  const height = chartContainer.offsetHeight;

  const svg = document.querySelector(".chart-line");
  while (svg.firstChild) {
    svg.firstChild.remove();
  }

  svg.setAttribute("width", width);
  svg.setAttribute("height", height);

  const containerRect = chartContainer.getBoundingClientRect();
  const chartItems = Array.from(document.querySelectorAll(".chart-item"));
  chartItems.forEach((item) => {
    const value = item.querySelector(".bar-chart").getAttribute("data-value");
    item.style.height = `${value}px`;
  });

  const dots = chartItems.map((item) => {
    const dot = item.querySelector(".mid-dot");
    const rect = dot.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top,
    };
  });

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("stroke", "#000000");
  path.setAttribute("stroke-width", 2);
  path.setAttribute("fill", "none");

  svg.style.opacity = 0;
  svg.appendChild(path);

  const pathData = dots.reduce((acc, dot, index) => {
    if (index < dots.length - 1) {
      const nextDot = dots[index + 1];
      return acc + `${dot.x},${dot.y} `;
    }
    return acc;
  }, "");

  const lastDot = dots[dots.length - 1];
  const secondLastDot = dots[dots.length - 2];

  const redDottedLine = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );
  redDottedLine.setAttribute("stroke", "#CCCCCC");
  redDottedLine.setAttribute("stroke-dasharray", "4 2");
  redDottedLine.setAttribute("x1", secondLastDot.x);
  redDottedLine.setAttribute("y1", secondLastDot.y);
  redDottedLine.setAttribute("x2", lastDot.x);
  redDottedLine.setAttribute("y2", lastDot.y);
  svg.appendChild(redDottedLine);

  path.setAttribute("d", `M${pathData}`);
}

function debounce(func, wait) {
  let timeout;
  return function delayedFunction(...params) {
    clearTimeout(timeout);
    const callLater = () => {
      timeout = null;
      func(...params);
    };
    timeout = setTimeout(callLater, wait);
  };
}

const debouncedGenerateSvgChart = debounce(generateSvgChart, 200);

window.addEventListener("resize", debouncedGenerateSvgChart);

// 애니메이션을 순차적으로 실행합니다.
animateChartHeight();
setTimeout(animateMidDot, 1000);
setTimeout(debouncedGenerateSvgChart, 2000);
