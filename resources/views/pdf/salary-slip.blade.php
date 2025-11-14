<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Salary Slip - {{ $salarySlip->month }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 8px;
            color: #000;
            padding: 15px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td, th {
            border: 1px solid #000;
            padding: 3px 5px;
            vertical-align: top;
        }

        .header-section {
            text-align: center;
            margin-bottom: 10px;
            padding: 8px;
            border: 1px solid #000;
        }

        .company-logo {
            float: right;
            font-weight: bold;
            font-size: 14px;
        }

        .title {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 3px;
        }

        .subtitle {
            font-size: 9px;
            margin-bottom: 2px;
        }

        .employee-name {
            font-size: 10px;
            font-weight: bold;
        }

        .label {
            font-weight: bold;
            width: 45%;
        }

        .value {
            width: 55%;
        }

        .amount {
            text-align: right;
            font-family: DejaVu Sans Mono, monospace;
        }

        .section-header {
            background-color: #d3d3d3;
            font-weight: bold;
            text-align: center;
            padding: 4px;
            font-size: 9px;
        }

        .total-row {
            font-weight: bold;
            background-color: #e8e8e8;
        }

        .net-pay {
            font-weight: bold;
            font-size: 10px;
            text-align: right;
        }

        .footer-notes {
            margin-top: 8px;
            font-size: 7px;
            line-height: 1.3;
        }

        .no-border {
            border: none;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header-section">
        <div class="company-logo">DIGIROCKET</div>
        <div class="title">Salary Payslip for the Month of {{ $salarySlip->month }}</div>
        <div class="subtitle">Pay Period {{ $cycleStart }} to {{ $cycleEnd }}</div>
        <div class="employee-name">{{ strtoupper($employee->first_name . ' ' . $employee->last_name) }}</div>
    </div>

    <!-- Employee Details Table -->
    <table style="margin-bottom: 8px;">
        <tr>
            <td class="label">Employee ID</td>
            <td class="value">: {{ str_pad($employee->id, 8, '0', STR_PAD_LEFT) }}</td>
            <td class="label">Bank Name & Account No</td>
            <td class="value">: {{ $employee->account_number ? ($employee->account_holder_name ?? 'NOT AVAILABLE') . ' - ' . $employee->account_number : 'NOT AVAILABLE' }}</td>
        </tr>
        <tr>
            <td class="label">Person ID</td>
            <td class="value">: {{ str_pad($employee->id, 8, '0', STR_PAD_LEFT) }}</td>
            <td class="label">Location (CWL)</td>
            <td class="value">: HEAD OFFICE</td>
        </tr>
        <tr>
            <td class="label">Designation</td>
            <td class="value">: {{ strtoupper($employee->designation ?? 'NOT AVAILABLE') }}</td>
            <td class="label">Department</td>
            <td class="value">: NOT AVAILABLE</td>
        </tr>
        <tr>
            <td class="label">DOJ / Gender</td>
            <td class="value">: {{ $employee->date_of_joining ? $employee->date_of_joining->format('d-M-Y') : 'NOT AVAILABLE' }} / {{ strtoupper($employee->user->gender ?? 'NOT AVAILABLE') }}</td>
            <td class="label">Band</td>
            <td class="value">: NOT AVAILABLE</td>
        </tr>
        <tr>
            <td class="label">PAN No</td>
            <td class="value">: {{ strtoupper($employee->pan_number ?? 'NOT AVAILABLE') }}</td>
            <td class="label">Days worked in month</td>
            <td class="value">: 31.00</td>
        </tr>
        <tr>
            <td class="label">PF / Pension No*</td>
            <td class="value">: NOT AVAILABLE</td>
            <td class="label">LWP Current/Previous Month</td>
            <td class="value">: 0.00/0.00</td>
        </tr>
        <tr>
            <td class="label">UAN No</td>
            <td class="value">: {{ strtoupper($employee->uan_number ?? 'NOT AVAILABLE') }}</td>
            <td class="label">Sabbatical Leave Current/Previous Mon</td>
            <td class="value">: 0.00/0.00</td>
        </tr>
    </table>

    <!-- Main Salary Table -->
    <table>
        <tr class="section-header">
            <th colspan="2">Standard Monthly Salary</th>
            <th style="width: 8%;">INR</th>
            <th colspan="2">Earnings</th>
            <th style="width: 8%;">INR</th>
            <th colspan="2">Deductions</th>
            <th style="width: 8%;">INR</th>
        </tr>
       
        <tr>
            <td colspan="2">Basic Salary</td>
            <td class="amount">{{ number_format($salarySlip->basic_salary, 2) }}</td>
            <td colspan="2">Basic Salary</td>
            <td class="amount">{{ number_format($salarySlip->basic_salary, 2) }}</td>
            <td colspan="2">Medical Prem. Recoverable</td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td colspan="2">HRA</td>
            <td class="amount">{{ number_format($salarySlip->hra, 2) }}</td>
            <td colspan="2">HRA</td>
            <td class="amount">{{ number_format($salarySlip->hra, 2) }}</td>
            <td colspan="2">Prev. month salary hold</td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td colspan="2">Special Allowance</td>
            <td class="amount">{{ number_format($salarySlip->special_allowance, 2) }}</td>
            <td colspan="2">Special Allowance</td>
            <td class="amount">{{ number_format($salarySlip->special_allowance, 2) }}</td>
            <td colspan="2">Ee PF contribution</td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td colspan="2">Conveyance Allowance</td>
            <td class="amount">{{ number_format($salarySlip->conveyance_allowance, 2) }}</td>
            <td colspan="2">Conveyance Allowance</td>
            <td class="amount">{{ number_format($salarySlip->conveyance_allowance, 2) }}</td>
            <td colspan="2">Other Deductions</td>
            <td class="amount">{{ number_format($salarySlip->deductions, 2) }}</td>
        </tr>
        <tr>
            <td colspan="2">Medical Allowance</td>
            <td class="amount">-</td>
            <td colspan="2">Medical Allowance</td>
            <td class="amount">-</td>
            <td colspan="2"></td>
            <td class="amount"></td>
        </tr>
        <tr>
            <td colspan="2">Process Allowance</td>
            <td class="amount">-</td>
            <td colspan="2">Process Allowance</td>
            <td class="amount">-</td>
            <td colspan="2"></td>
            <td class="amount"></td>
        </tr>
        <tr>
            <td colspan="2">Compensatory Allowance</td>
            <td class="amount">-</td>
            <td colspan="2">Compensatory Allowance</td>
            <td class="amount">-</td>
            <td colspan="2"></td>
            <td class="amount"></td>
        </tr>
        <tr>
            <td colspan="2"></td>
            <td class="amount"></td>
            <td colspan="2">Carry-over fr.prev.month</td>
            <td class="amount">-</td>
            <td colspan="2"></td>
            <td class="amount"></td>
        </tr>
        <tr class="total-row">
            <td colspan="2">Total Standard Salary</td>
            <td class="amount">{{ number_format($salarySlip->gross_salary, 2) }}</td>
            <td colspan="2">Gross Earnings</td>
            <td class="amount">{{ number_format($salarySlip->gross_salary, 2) }}</td>
            <td colspan="2">Gross Deductions</td>
            <td class="amount">{{ number_format($salarySlip->deductions, 2) }}</td>
        </tr>
        <tr style="font-weight: bold; font-size: 9px;">
            <td colspan="6"></td>
            <td colspan="2">Net Pay</td>
            <td class="amount">{{ number_format($salarySlip->net_salary, 2) }}</td>
        </tr>
    </table>

    <!-- Income Tax Computation Section -->
    <!-- <table style="margin-top: 8px;">
        <tr>
            <th colspan="9" class="section-header">Income Tax Computation</th>
        </tr>
        <tr>
            <th colspan="3" style="text-align: center; font-size: 8px;">Exemption U/S 10</th>
            <th colspan="3" style="text-align: center; font-size: 8px;">Projected / Actual Taxable Salary</th>
            <th colspan="3" style="text-align: center; font-size: 8px;">Contribution under Chapter VI A</th>
        </tr>
        <tr>
            <td>HRA Annual Exemption</td>
            <td></td>
            <td class="amount">-</td>
            <td>Months remaining till March</td>
            <td></td>
            <td class="amount">0</td>
            <td>Provident Fund</td>
            <td></td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td class="amount"></td>
            <td>Taxable Income till Pr. Month</td>
            <td></td>
            <td class="amount">-</td>
            <td>Voluntary PF</td>
            <td></td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td>Total</td>
            <td></td>
            <td class="amount">-</td>
            <td>Current Mth Taxable income</td>
            <td></td>
            <td class="amount">{{ number_format($salarySlip->gross_salary, 2) }}</td>
            <td>Payment towards Life Insurance Policy</td>
            <td></td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td colspan="3" style="text-align: center; font-weight: bold;">HRA Exemption</td>
            <td>Projected Standard Salary</td>
            <td></td>
            <td class="amount">-</td>
            <td></td>
            <td></td>
            <td class="amount"></td>
        </tr>
        <tr>
            <td>Metro -HRA Rcvd / Proj</td>
            <td></td>
            <td class="amount">-</td>
            <td>Taxable Ann Perks</td>
            <td></td>
            <td class="amount">-</td>
            <td>Total</td>
            <td></td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td>* Metro - 50% of Basic</td>
            <td></td>
            <td class="amount">-</td>
            <td>Annual Medical Exemption</td>
            <td></td>
            <td class="amount">-</td>
            <td colspan="3" style="text-align: center; font-weight: bold;">Monthly Tax Deduction</td>
        </tr>
        <tr>
            <td>Metro -Rent Paid - 10 % B</td>
            <td></td>
            <td class="amount">-</td>
            <td>Gross Salary</td>
            <td></td>
            <td class="amount">{{ number_format($salarySlip->gross_salary, 2) }}</td>
            <td>April</td>
            <td></td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td>Least of Metro/NMetro is exempt</td>
            <td></td>
            <td class="amount">-</td>
            <td>Exemption U/S 10</td>
            <td></td>
            <td class="amount">-</td>
            <td>May</td>
            <td></td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td class="amount"></td>
            <td>Tax on Employment (Prof. Tax)</td>
            <td></td>
            <td class="amount">-</td>
            <td>June</td>
            <td></td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td class="amount"></td>
            <td>Income under Head Salary</td>
            <td></td>
            <td class="amount">{{ number_format($salarySlip->gross_salary, 2) }}</td>
            <td>July</td>
            <td></td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td class="amount"></td>
            <td>Interest on House Property</td>
            <td></td>
            <td class="amount">-</td>
            <td>August</td>
            <td></td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td class="amount"></td>
            <td>Gross Total Income</td>
            <td></td>
            <td class="amount">{{ number_format($salarySlip->gross_salary, 2) }}</td>
            <td>September</td>
            <td></td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td class="amount"></td>
            <td>Agg of Chapter VI</td>
            <td></td>
            <td class="amount">-</td>
            <td>October</td>
            <td></td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td class="amount"></td>
            <td>Total Income</td>
            <td></td>
            <td class="amount">{{ number_format($salarySlip->gross_salary, 2) }}</td>
            <td>November</td>
            <td></td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td class="amount"></td>
            <td>Tax on Total Income</td>
            <td></td>
            <td class="amount">-</td>
            <td>December</td>
            <td></td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td class="amount"></td>
            <td>Tax Credit</td>
            <td></td>
            <td class="amount">-</td>
            <td>January</td>
            <td></td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td class="amount"></td>
            <td>Education Cess</td>
            <td></td>
            <td class="amount">-</td>
            <td>February</td>
            <td></td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td class="amount"></td>
            <td>Tax payable</td>
            <td></td>
            <td class="amount">-</td>
            <td>March</td>
            <td></td>
            <td class="amount">-</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td class="amount"></td>
            <td>Tax deducted so far</td>
            <td></td>
            <td class="amount">-</td>
            <td></td>
            <td></td>
            <td class="amount"></td>
        </tr>
        <tr class="total-row">
            <td></td>
            <td></td>
            <td class="amount"></td>
            <td>Balance Tax</td>
            <td></td>
            <td class="amount">-</td>
            <td>Total</td>
            <td></td>
            <td class="amount">-</td>
        </tr>
    </table> -->

    @if($salarySlip->notes)
    <!-- Notes Section -->
    <div style="margin-top: 8px; padding: 5px; border: 1px solid #000; font-size: 7px;">
        <strong>Notes:</strong> {{ $salarySlip->notes }}
    </div>
    @endif

    <!-- Footer Notes -->
    <div class="footer-notes">
        *This is a computer generated payslip and doesn't require signature or any company seal. All one time payments like PB, taxable LTA, variable pay etc will be subject to one time tax deduction at your applicable tax slab<br>
        *The current month pay slip has got generated after consideration of payroll input i.e. compensation letter, flexi declaration, one-timer payment input provided and approved transfers till {{ \Carbon\Carbon::parse($salarySlip->payment_date)->format('jS') }} of this month.<br>
        Generated on {{ now()->format('d-m-Y H:i:s') }}
    </div>
</body>
</html>
