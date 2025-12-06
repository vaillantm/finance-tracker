// Function to draw the simple curved line graph for the Dashboard
const drawLineChart = (canvasId, data, lineColor = '#10b981') => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas drawing dimensions based on computed style
    const parentWidth = canvas.parentElement.clientWidth;
    canvas.width = Math.min(parentWidth - 16, 1000); 
    canvas.height = 320; 

    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);

    const normalizedData = data;
    const points = normalizedData.length;
    
    const labelColor = '#d1d5db'; 
    const textColor = '#9ca3af'; 
    const yLabels = ['$10,000', '$7,500', '$5,000', '$2,500', '$0'];
    
    const xMarginLeft = 60;
    const xMarginRight = 20;
    const yMarginTop = 20;
    const yMarginBottom = 40;
    
    const plotWidth = width - xMarginLeft - xMarginRight;
    const plotHeight = height - yMarginTop - yMarginBottom;

    // Draw Y-Axis Labels & Dashed Lines
    ctx.font = '12px Inter';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'right';

    yLabels.forEach((label, index) => {
        const y = yMarginTop + (index / (yLabels.length - 1)) * plotHeight;
        // Draw dashed line
        ctx.beginPath();
        ctx.strokeStyle = labelColor;
        ctx.setLineDash([4, 4]);
        ctx.moveTo(xMarginLeft, y);
        ctx.lineTo(width - xMarginRight, y);
        ctx.stroke();
        
        // Draw text label
        ctx.setLineDash([]); 
        ctx.fillText(label, xMarginLeft - 10, y + 4);
    });

    // Draw X-Axis Labels (months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4b5563';
    
    months.forEach((month, index) => {
        if (index < points) {
            const x = xMarginLeft + (index / (points - 1)) * plotWidth;
            ctx.fillText(month, x, height - 15);
        }
    });

    // Draw The Line Curve
    ctx.beginPath();
    ctx.strokeStyle = lineColor; 
    ctx.lineWidth = 3;
    ctx.setLineDash([]); 

    ctx.moveTo(xMarginLeft, yMarginTop + plotHeight * (1 - normalizedData[0]));

    for (let i = 1; i < points; i++) {
        const x1 = xMarginLeft + ((i - 1) / (points - 1)) * plotWidth;
        const y1 = yMarginTop + plotHeight * (1 - normalizedData[i - 1]);
        const x2 = xMarginLeft + (i / (points - 1)) * plotWidth;
        const y2 = yMarginTop + plotHeight * (1 - normalizedData[i]);
        
        // Use Bezier curve for smooth line
        const cp1x = x1 + (x2 - x1) / 3;
        const cp1y = y1;
        const cp2x = x2 - (x2 - x1) / 3;
        const cp2y = y2;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
    }

    ctx.stroke();

    // Draw gradient fill under the line
    const gradient = ctx.createLinearGradient(0, yMarginTop, 0, height - yMarginBottom);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)'); // emerald with opacity
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');   // transparent

    ctx.beginPath();
    ctx.moveTo(xMarginLeft, yMarginTop + plotHeight * (1 - normalizedData[0]));
    
    for (let i = 1; i < points; i++) {
        const x1 = xMarginLeft + ((i - 1) / (points - 1)) * plotWidth;
        const y1 = yMarginTop + plotHeight * (1 - normalizedData[i - 1]);
        const x2 = xMarginLeft + (i / (points - 1)) * plotWidth;
        const y2 = yMarginTop + plotHeight * (1 - normalizedData[i]);
        
        const cp1x = x1 + (x2 - x1) / 3;
        const cp1y = y1;
        const cp2x = x2 - (x2 - x1) / 3;
        const cp2y = y2;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
    }
    
    // Close the path to the bottom
    ctx.lineTo(xMarginLeft + plotWidth, height - yMarginBottom);
    ctx.lineTo(xMarginLeft, height - yMarginBottom);
    ctx.closePath();
    
    ctx.fillStyle = gradient;
    ctx.fill();
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Sample data representing balance over 10 months (normalized between 0 and 1)
    const data = [0.4, 0.5, 0.45, 0.2, 0.8, 0.65, 0.3, 0.55, 0.7, 0.85];
    
    const drawChart = () => drawLineChart('balance-chart', data);
    drawChart();
    
    // Redraw chart on window resize for responsiveness
    window.addEventListener('resize', drawChart);
});