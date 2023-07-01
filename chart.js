// chart container의 크기를 가져옵니다.
const chartContainer = document.querySelector(".chart-container");
const width = chartContainer.offsetWidth;
const height = chartContainer.offsetHeight;

// SVG 요소를 가져오고, 크기를 설정합니다.
const svg = document.querySelector(".chart-line");
svg.setAttribute("width", width);
svg.setAttribute("height", height);

// chart container의 위치를 가져옵니다.
const containerRect = chartContainer.getBoundingClientRect();

// chart items의 높이를 설정합니다.
const chartItems = Array.from(document.querySelectorAll(".chart-item"));
chartItems.forEach((item) => {
  const value = item.querySelector(".bar-chart").getAttribute("data-value");
  item.style.height = `${value}px`;
});

// mid-dot 요소들의 위치를 가져옵니다. 상단 기준으로 위치를 잡습니다.
const dots = chartItems.map((item) => {
  const dot = item.querySelector(".mid-dot");
  const rect = dot.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - containerRect.left,
    y: rect.top + rect.height / 2 - containerRect.top,
  };
});

// 위치를 이용하여 선을 그립니다.
const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
line.setAttribute("points", dots.map((dot) => `${dot.x},${dot.y}`).join(" "));
line.setAttribute("stroke", "#000000"); // 선 색깔
line.setAttribute("stroke-width", 2); // 선 두께
line.setAttribute("fill", "none"); // 채우기 없음
svg.appendChild(line);
