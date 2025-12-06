// Function to draw the Bar Chart for Income vs Expense
const drawBarChart = (canvasId) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const parentWidth = canvas.parentElement.clientWidth;
    canvas.width = Math.min(parentWidth - 16, 1000); 
    canvas.height = 320; 

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const data = [
        { month: 'Jan', income: 4000, expense: 1500 },
        { month: 'Feb', income: 5500, expense: 2200 },
        { month: 'Mar', income: 2000, expense: 1000 },
        { month: 'Apr', income: 4500, expense: 3500 },
        { month: 'May', income: 3000, expense: 500 },
        { month: 'Jun', income: 6000, expense: 2500 },
        { month: 'Jul', income: 3500, expense: 1800 },
    ];
    
    const maxVal = 10000;
    const yLabels = ['10000', '7500', '5000', '2500', '0'];
    const barColors = { income: '#10b981', expense: '#ef4444' };
    const barWidthRatio = 0.35;

    const xMarginLeft = 60;
    const xMarginRight = 20;
    const yMarginTop = 20;
    const yMarginBottom = 40;
    
    const plotWidth = width - xMarginLeft - xMarginRight;
    const plotHeight = height - yMarginTop - yMarginBottom;
    const numGroups = data.length;
    const groupSpacing = plotWidth / numGroups;

    // Draw Y-Axis Labels & Dashed Lines
    ctx.font = '12px Inter';
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'right';
    ctx.strokeStyle = '#d1d5db';
    ctx.setLineDash([4, 4]);

    yLabels.forEach((label, index) => {
        const y = yMarginTop + (index / (yLabels.length - 1)) * plotHeight;
        ctx.beginPath();
        ctx.moveTo(xMarginLeft, y);
        ctx.lineTo(width - xMarginRight, y);
        ctx.stroke();
        
        ctx.setLineDash([]); 
        ctx.fillText(label, xMarginLeft - 10, y + 4);
    });

    // Draw X-Axis Labels and Bars
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4b5563';

    data.forEach((item, index) => {
        const groupCenter = xMarginLeft + (index + 0.5) * groupSpacing;
        const barWidth = groupSpacing * barWidthRatio;
        const barGap = (groupSpacing - 2 * barWidth) / 2;

        // X-axis label
        ctx.fillText(item.month, groupCenter, height - 10);

        // Income bar
        let incomeHeight = (item.income / maxVal) * plotHeight;
        let xIncome = groupCenter - barWidth - barGap / 2;
        let yIncome = yMarginTop + plotHeight - incomeHeight;
        
        ctx.fillStyle = barColors.income;
        ctx.fillRect(xIncome, yIncome, barWidth, incomeHeight);

        // Expense bar
        let expenseHeight = (item.expense / maxVal) * plotHeight;
        let xExpense = groupCenter + barGap / 2;
        let yExpense = yMarginTop + plotHeight - expenseHeight;

        ctx.fillStyle = barColors.expense;
        ctx.fillRect(xExpense, yExpense, barWidth, expenseHeight);
    });
};

// Function to draw the Pie Chart for Spending by Category
const drawPieChart = (canvasId) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const size = 300;
    canvas.width = size;
    canvas.height = size; 
    
    const center = size / 2;
    const radius = size * 0.35;

    ctx.clearRect(0, 0, size, size);
    
    const categories = [
        { name: 'Food', amount: 450.00, color: '#10b981' },
        { name: 'Transportation', amount: 320.00, color: '#3b82f6' },
        { name: 'Utilities', amount: 200.00, color: '#f56565' },
        { name: 'Entertainment', amount: 136.00, color: '#fcd34d' },
        { name: 'Other', amount: 150.00, color: '#a855f7' },
    ];

    const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
    let currentAngle = 0;

    categories.forEach(category => {
        const sliceAngle = (category.amount / total) * 2 * Math.PI;

        ctx.beginPath();
        ctx.fillStyle = category.color;
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();

        currentAngle += sliceAngle;
    });
};

// Initialize analytics charts
document.addEventListener('DOMContentLoaded', () => {
    const drawCharts = () => {
        drawBarChart('income-vs-expense-chart');
        drawPieChart('spending-by-category-chart');
    };
    
    drawCharts();
    window.addEventListener('resize', () => drawBarChart('income-vs-expense-chart'));
});