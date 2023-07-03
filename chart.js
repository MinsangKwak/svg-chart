// svgChart 만들기
function generateSvgChart() {

    // chart container의 크기를 가져옵니다.
    const chartContainer = document.querySelector('.chart-container');
    const width = chartContainer.offsetWidth;
    const height = chartContainer.offsetHeight;

    // SVG 요소를 가져오고, 크기를 설정합니다.
    const svg = document.querySelector('.chart-line');

    // 초기화 -> svg내 모든 자식 요소들을 삭제한다. 차트를 새로 그릴 떄, 이전 차트를 초기화하는 역할을 한다.
    while (svg.firstChild) { 
        svg.firstChild.remove();
    }

    svg.setAttribute('width', width); // svg요소의 가로 길이를 chartContainer의 가로 길이로 설정한다.
    svg.setAttribute('height', height); // svg요소의 세로길이를 chartContainer의 세로 길이로 설정한다.

    // chart container의 위치를 가져옵니다.
    const containerRect = chartContainer.getBoundingClientRect(); // chartContainer의 위치와 크기에 대한 정보를 가져온다.

    // chart items의 높이를 설정합니다.
    const chartItems = Array.from(document.querySelectorAll('.chart-item')); // chart-item이라는 클래스를 가진 모든 요소를 배열로 가져온다.
    chartItems.forEach(item => {
        const value = item.querySelector('.bar-chart').getAttribute('data-value'); // chart요소 내에 bar-chart라는 클래스를 가진 요소의 data-value속성값을 가져온다.
        item.style.height = `${value}px`; // chart-item요소의 높이를 data-value의 값에 해당하는 픽셀로 설정한다.
    });

    // mid-dot 요소들의 위치를 가져옵니다. 상단 기준으로 위치를 잡습니다.
    const dots = chartItems.map(item => {
        const dot = item.querySelector('.mid-dot');
        const rect = dot.getBoundingClientRect(); 
        return { // mid-dot의 좌표 객체를 반환한다.
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.top + rect.height / 2 - containerRect.top
        };
    });

    // 위치를 이용하여 선을 그립니다.
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline'); // svg내의 polyline 요소를 생선한다. -> polyline은 여러개의 점을 이어 선을 그린다.
    line.setAttribute('points', dots.map(dot => `${dot.x},${dot.y}`).join(' '));
    line.setAttribute('stroke', '#000000');  // 선 색깔
    line.setAttribute('stroke-width', 2);  // 선 두께
    line.setAttribute('fill', 'none');  // 채우기 없음
    svg.appendChild(line); // 생성한 polyline요소를 svg에 추가한다.
}

// debounce
// 이벤트가 매우 빈번하게 발생했을 때
// 이벤트 처리함수가 너무 자주 호출되는 것을 막는 기능입니다.

function debounce(func, wait) {
    let timeout;
    return function delayedFunction(...params) {
        // 아직 대기 중인 이전 타임아웃을 모두 제거합니다.
        clearTimeout(timeout);
        // 'wait' 시간 후에 호출될 새 함수를 정의합니다.
        const callLater = () => {
            // 타임아웃을 초기화합니다.
            timeout = null;
            // 원래의 함수를 원래의 매개변수로 호출합니다.
            func(...params);
        };
        // 새 타임아웃을 설정합니다.
        timeout = setTimeout(callLater, wait);
    };
};

// generateSvgChart 함수를 떨어트리기 합니다. (여기서는 200ms로 설정했습니다.)
const debouncedGenerateSvgChart = debounce(generateSvgChart, 200);

// 창 크기가 변경될 때마다 차트를 재생성하는 이벤트 리스너를 추가합니다.
window.addEventListener('resize', debouncedGenerateSvgChart);

// 최초 차트 생성
generateSvgChart();
