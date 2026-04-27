import {formatCurrency, formatDate, formatHours, median} from "./utils.js";

let _data = null;
export async function getPayrollData() {
    if (!_data) {
        const res = await fetch('/payroll_data.json');
        const json = await res.json();
        _data = json.employees;
    }
    return _data;
}

const RATE_LABELS = {
    standard: 'standard wage',
    overtime: 'overtime wage',
    benefits: 'benefits rate',
}

const DAY_LABELS = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
}

const getWeeklyHours = payPeriod => Object.values(payPeriod.daily_hours)
    .reduce((sum, hours) => sum + hours.standard + hours.overtime, 0);

const getDailyTotals = payPeriod => Object.entries(payPeriod.daily_hours)
    .map(([day, hours]) => ({
        day,
        standard: hours.standard,
        overtime: hours.overtime,
        total: hours.standard + hours.overtime,
    }));

const getEmployeeGroups = data => {
    const employees = {};

    for (const payPeriod of data) {
        if (!employees[payPeriod.employee_id]) {
            employees[payPeriod.employee_id] = {
                name: payPeriod.employee_name,
                id: payPeriod.employee_id,
                pay_periods: [],
            };
        }

        employees[payPeriod.employee_id].pay_periods.push(payPeriod);
    }

    return employees;
};

const getDirectionLabel = (value, baseline) => value > baseline ? 'high' : 'low';

const isRateOutlier = (value, baseline) => {
    if (baseline <= 0) {
        return false;
    }

    const difference = Math.abs(value - baseline);
    return difference >= 2 && difference / baseline >= 0.2;
};

const isWeeklyHoursOutlier = (value, baseline) => {
    if (baseline <= 0) {
        return false;
    }

    const difference = Math.abs(value - baseline);
    return difference >= 6 && difference / baseline >= 0.35;
};

const isDailyHoursOutlier = (value, baseline) => {
    if (baseline <= 0 || value <= 0) {
        return false;
    }

    const difference = Math.abs(value - baseline);
    return difference >= 3 && difference / baseline >= 0.5;
};

const normalizeName = name => name
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const levenshteinDistance = (left, right) => {
    if (left === right) {
        return 0;
    }

    if (!left.length) {
        return right.length;
    }

    if (!right.length) {
        return left.length;
    }

    const matrix = Array.from({ length: left.length + 1 }, (_, rowIndex) => {
        return Array.from({ length: right.length + 1 }, (_, columnIndex) => {
            if (rowIndex === 0) {
                return columnIndex;
            }

            if (columnIndex === 0) {
                return rowIndex;
            }

            return 0;
        });
    });

    for (let row = 1; row <= left.length; row += 1) {
        for (let column = 1; column <= right.length; column += 1) {
            const substitutionCost = left[row - 1] === right[column - 1] ? 0 : 1;
            matrix[row][column] = Math.min(
                matrix[row - 1][column] + 1,
                matrix[row][column - 1] + 1,
                matrix[row - 1][column - 1] + substitutionCost,
            );
        }
    }

    return matrix[left.length][right.length];
};

const areNamesSuspiciouslySimilar = (leftName, rightName) => {
    const normalizedLeft = normalizeName(leftName);
    const normalizedRight = normalizeName(rightName);

    if (!normalizedLeft || !normalizedRight) {
        return false;
    }

    if (normalizedLeft === normalizedRight) {
        return true;
    }

    const leftParts = normalizedLeft.split(' ');
    const rightParts = normalizedRight.split(' ');
    const leftFirst = leftParts[0];
    const rightFirst = rightParts[0];
    const leftLast = leftParts[leftParts.length - 1];
    const rightLast = rightParts[rightParts.length - 1];

    if (leftLast === rightLast) {
        if (leftFirst.startsWith(rightFirst) || rightFirst.startsWith(leftFirst)) {
            return true;
        }

        if (levenshteinDistance(leftFirst, rightFirst) <= 1) {
            return true;
        }
    }

    const maxLength = Math.max(normalizedLeft.length, normalizedRight.length);
    return maxLength >= 8 && levenshteinDistance(normalizedLeft, normalizedRight) <= Math.max(1, Math.floor(maxLength * 0.08));
};

/**
 * Calculates and returns detailed metrics for each employee.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of employee metric objects.
 * Each object includes employee name, id, min/max/avg hours per day, min/max/avg wage rates, and last pay date.
 */
export async function getEmployeeMetrics() {
    const data = await getPayrollData();
    const employees = getEmployeeGroups(data);

    return Object.values(employees).map(emp => {
        const dailyHours = emp.pay_periods.flatMap(p => Object.values(p.daily_hours).map(h => h.standard + h.overtime));
        const standardRates = emp.pay_periods.map(p => p.rates.standard);
        const overtimeRates = emp.pay_periods.map(p => p.rates.overtime);
        const benefitsRates = emp.pay_periods.map(p => p.rates.benefits);
        const lastPayDate = emp.pay_periods.reduce((latest, p) => {
            const current = new Date(p.week_ending);
            return current > latest ? current : latest;
        }, new Date(0));

        return {
            name: emp.name,
            id: emp.id,
            max_hours_per_day: Math.max(...dailyHours),
            min_hours_per_day: Math.min(...dailyHours),
            avg_hours_per_day: dailyHours.reduce((a, b) => a + b, 0) / dailyHours.length,
            max_standard_rate: Math.max(...standardRates),
            min_standard_rate: Math.min(...standardRates),
            avg_standard_rate: standardRates.reduce((a, b) => a + b, 0) / standardRates.length,
            max_overtime_rate: Math.max(...overtimeRates),
            min_overtime_rate: Math.min(...overtimeRates),
            avg_overtime_rate: overtimeRates.reduce((a, b) => a + b, 0) / overtimeRates.length,
            max_benefits_rate: Math.max(...benefitsRates),
            min_benefits_rate: Math.min(...benefitsRates),
            avg_benefits_rate: benefitsRates.reduce((a, b) => a + b, 0) / benefitsRates.length,
            last_pay_date: formatDate(lastPayDate),
        };
    });
}

/**
 * Calculates and returns summary statistics for the entire payroll dataset.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing summary statistics.
 * This includes total unique employees, average wage rates, cumulative payroll spend, and the percentage of hours worked by apprentices.
 */
export async function getSummaryStatistics(){
    const data = await getPayrollData();
    const uniqueEmployees = new Set(data.map(d => d.employee_id)).size;
    const totalStandardHours = data.reduce((sum, d) => sum + Object.values(d.daily_hours).reduce((s, h) => s + h.standard, 0), 0);
    const totalOvertimeHours = data.reduce((sum, d) => sum + Object.values(d.daily_hours).reduce((s, h) => s + h.overtime, 0), 0);
    const apprenticeHours = data.filter(d => d.level === 'APPRENTICE').reduce((sum, d) => sum + Object.values(d.daily_hours).reduce((s, h) => s + h.standard + h.overtime, 0), 0);

    const cumulativePayroll = data.reduce((sum, d) => {
        const standardPay = Object.values(d.daily_hours).reduce((s, h) => s + h.standard, 0) * d.rates.standard;
        const overtimePay = Object.values(d.daily_hours).reduce((s, h) => s + h.overtime, 0) * d.rates.overtime;
        const benefitsPay = Object.values(d.daily_hours).reduce((s, h) => s + h.standard + h.overtime, 0) * d.rates.benefits;
        return sum + standardPay + overtimePay + benefitsPay;
    }, 0);

    return {
        total_unique_employees: uniqueEmployees,
        avg_standard_rate: data.map(d => d.rates.standard).reduce((a, b) => a + b, 0) / data.length,
        avg_overtime_rate: data.map(d => d.rates.overtime).reduce((a, b) => a + b, 0) / data.length,
        avg_benefits_rate: data.map(d => d.rates.benefits).reduce((a, b) => a + b, 0) / data.length,
        cumulative_payroll_spend: cumulativePayroll,
        apprentice_hours_percentage: (apprenticeHours / (totalStandardHours + totalOvertimeHours)) * 100,
    };
}

/**
 * Detects payroll anomalies and returns a flat list of human-readable messages.
 *
 * @returns {Promise<Array<string>>} A promise that resolves to anomaly messages.
 */
export async function getAnomalyMessages () {
    const data = await getPayrollData();
    const employees = Object.values(getEmployeeGroups(data));
    const messages = [];

    for (const payPeriod of data) {
        for (const [rateType, rateValue] of Object.entries(payPeriod.rates)) {
            if (rateValue < 0) {
                messages.push(
                    `${payPeriod.employee_name} (ID ${payPeriod.employee_id}) has a negative ${RATE_LABELS[rateType]} of ${formatCurrency(rateValue)} on ${formatDate(payPeriod.week_ending)}.`,
                );
            }
        }

        for (const dailyTotal of getDailyTotals(payPeriod)) {
            if (dailyTotal.standard < 0) {
                messages.push(
                    `${payPeriod.employee_name} (ID ${payPeriod.employee_id}) has negative standard hours on ${DAY_LABELS[dailyTotal.day]} of the week ending ${formatDate(payPeriod.week_ending)}.`,
                );
            }

            if (dailyTotal.overtime < 0) {
                messages.push(
                    `${payPeriod.employee_name} (ID ${payPeriod.employee_id}) has negative overtime hours on ${DAY_LABELS[dailyTotal.day]} of the week ending ${formatDate(payPeriod.week_ending)}.`,
                );
            }
        }
    }

    for (const employee of employees) {
        const standardBaseline = median(employee.pay_periods.map(payPeriod => payPeriod.rates.standard));
        const overtimeBaseline = median(employee.pay_periods.map(payPeriod => payPeriod.rates.overtime));
        const benefitsBaseline = median(employee.pay_periods.map(payPeriod => payPeriod.rates.benefits));
        const weeklyBaseline = median(employee.pay_periods.map(getWeeklyHours));
        const positiveDailyHours = employee.pay_periods
            .flatMap(getDailyTotals)
            .map(day => day.total)
            .filter(total => total > 0);
        const dailyBaseline = median(positiveDailyHours);

        for (const payPeriod of employee.pay_periods) {
            const weekEnding = formatDate(payPeriod.week_ending);
            const rateBaselines = {
                standard: standardBaseline,
                overtime: overtimeBaseline,
                benefits: benefitsBaseline,
            };

            for (const [rateType, rateValue] of Object.entries(payPeriod.rates)) {
                const baseline = rateBaselines[rateType];

                if (isRateOutlier(rateValue, baseline)) {
                    messages.push(
                                    `${employee.name} (ID ${employee.id}) has a ${RATE_LABELS[rateType]} that is ${getDirectionLabel(rateValue, baseline)} than usual (${formatCurrency(rateValue)}) on ${weekEnding}, compared to their typical ${formatCurrency(baseline)}.`,
                    );
                }
            }

            const weeklyHours = getWeeklyHours(payPeriod);
            if (isWeeklyHoursOutlier(weeklyHours, weeklyBaseline)) {
                messages.push(
                    `${employee.name} (ID ${employee.id}) logged weekly hours that are ${getDirectionLabel(weeklyHours, weeklyBaseline)} than usual (${formatHours(weeklyHours)}) on ${weekEnding}, compared to their typical ${formatHours(weeklyBaseline)}.`,
                );
            }

            for (const dailyTotal of getDailyTotals(payPeriod)) {
                if (isDailyHoursOutlier(dailyTotal.total, dailyBaseline)) {
                    messages.push(
                        `${employee.name} (ID ${employee.id}) logged ${getDirectionLabel(dailyTotal.total, dailyBaseline)} hours than usual on ${DAY_LABELS[dailyTotal.day]} of the week ending ${weekEnding} (${formatHours(dailyTotal.total)} vs ${formatHours(dailyBaseline)}).`,
                    );
                }
            }
        }
    }

    const uniqueEmployees = employees.map(({ name, id }) => ({ name, id }));
    for (let index = 0; index < uniqueEmployees.length; index += 1) {
        for (let comparisonIndex = index + 1; comparisonIndex < uniqueEmployees.length; comparisonIndex += 1) {
            const current = uniqueEmployees[index];
            const comparison = uniqueEmployees[comparisonIndex];

            if (current.id !== comparison.id && areNamesSuspiciouslySimilar(current.name, comparison.name)) {
                messages.push(
                    `Employees "${current.name}" (ID ${current.id}) and "${comparison.name}" (ID ${comparison.id}) have very similar names but different IDs.`,
                );
            }
        }
    }

    return messages;
}


