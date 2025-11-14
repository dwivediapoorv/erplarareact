import { Head } from '@inertiajs/react';

interface SalarySlip {
    id: number;
    month: string;
    payment_date: string;
    basic_salary: string;
    hra: string;
    special_allowance: string;
    conveyance_allowance: string;
    deductions: string;
    gross_salary: string;
    net_salary: string;
    notes: string | null;
}

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    designation: string | null;
    date_of_joining: string | null;
    pan_number: string | null;
    uan_number: string | null;
    account_holder_name: string | null;
    account_number: string | null;
    user: {
        gender: string | null;
    };
}

interface ViewSalarySlipProps {
    salarySlip: SalarySlip;
    employee: Employee;
    cycleStart: string;
    cycleEnd: string;
}

export default function ViewSalarySlip({ salarySlip, employee, cycleStart, cycleEnd }: ViewSalarySlipProps) {
    const formatCurrency = (amount: string) => {
        return parseFloat(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'NOT AVAILABLE';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).replace(/ /g, '-');
    };

    return (
        <>
            <Head title={`Salary Slip - ${salarySlip.month}`} />
            <div className="min-h-screen bg-gray-100 p-4">
                <div className="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style={{ fontSize: '10px' }}>
                    {/* Header */}
                    <div className="mb-4 border border-black p-4 text-center relative">
                        <div className="absolute right-4 top-4 text-sm font-bold">DIGIROCKET</div>
                        <div className="text-xs font-bold mb-1">Salary Payslip for the Month of {salarySlip.month}</div>
                        <div className="text-[9px] mb-0.5">Pay Period {cycleStart} to {cycleEnd}</div>
                        <div className="text-[10px] font-bold">{employee.first_name.toUpperCase()} {employee.last_name.toUpperCase()}</div>
                    </div>

                    {/* Employee Details Table */}
                    <table className="w-full border-collapse mb-2" style={{ fontSize: '10px' }}>
                        <tbody>
                            <tr>
                                <td className="border border-black p-1 font-semibold w-[22.5%]">Employee ID</td>
                                <td className="border border-black p-1 w-[27.5%]">: {String(employee.id).padStart(8, '0')}</td>
                                <td className="border border-black p-1 font-semibold w-[22.5%]">Bank Name & Account No</td>
                                <td className="border border-black p-1 w-[27.5%]">
                                    : {employee.account_number
                                        ? `${employee.account_holder_name || 'NOT AVAILABLE'} - ${employee.account_number}`
                                        : 'NOT AVAILABLE'}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1 font-semibold">Person ID</td>
                                <td className="border border-black p-1">: {String(employee.id).padStart(8, '0')}</td>
                                <td className="border border-black p-1 font-semibold">Location (CWL)</td>
                                <td className="border border-black p-1">: HEAD OFFICE</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1 font-semibold">Designation</td>
                                <td className="border border-black p-1">: {employee.designation?.toUpperCase() || 'NOT AVAILABLE'}</td>
                                <td className="border border-black p-1 font-semibold">Department</td>
                                <td className="border border-black p-1">: NOT AVAILABLE</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1 font-semibold">DOJ / Gender</td>
                                <td className="border border-black p-1">
                                    : {formatDate(employee.date_of_joining)} / {employee.user?.gender?.toUpperCase() || 'NOT AVAILABLE'}
                                </td>
                                <td className="border border-black p-1 font-semibold">Band</td>
                                <td className="border border-black p-1">: NOT AVAILABLE</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1 font-semibold">PAN No</td>
                                <td className="border border-black p-1">: {employee.pan_number?.toUpperCase() || 'NOT AVAILABLE'}</td>
                                <td className="border border-black p-1 font-semibold">Days worked in month</td>
                                <td className="border border-black p-1">: 31.00</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1 font-semibold">PF / Pension No*</td>
                                <td className="border border-black p-1">: NOT AVAILABLE</td>
                                <td className="border border-black p-1 font-semibold">LWP Current/Previous Month</td>
                                <td className="border border-black p-1">: 0.00/0.00</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1 font-semibold">UAN No</td>
                                <td className="border border-black p-1">: {employee.uan_number?.toUpperCase() || 'NOT AVAILABLE'}</td>
                                <td className="border border-black p-1 font-semibold">Sabbatical Leave Current/Previous Mon</td>
                                <td className="border border-black p-1">: 0.00/0.00</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Main Salary Table */}
                    <table className="w-full border-collapse" style={{ fontSize: '10px' }}>
                        <thead>
                            <tr className="bg-gray-300">
                                <th className="border border-black p-1 text-center font-bold text-[9px]" colSpan={2}>Standard Monthly Salary</th>
                                <th className="border border-black p-1 text-center font-bold text-[9px] w-[8%]">INR</th>
                                <th className="border border-black p-1 text-center font-bold text-[9px]" colSpan={2}>Earnings</th>
                                <th className="border border-black p-1 text-center font-bold text-[9px] w-[8%]">INR</th>
                                <th className="border border-black p-1 text-center font-bold text-[9px]" colSpan={2}>Deductions</th>
                                <th className="border border-black p-1 text-center font-bold text-[9px] w-[8%]">INR</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-black p-1" colSpan={2}>Basic Salary</td>
                                <td className="border border-black p-1 text-right font-mono">{formatCurrency(salarySlip.basic_salary)}</td>
                                <td className="border border-black p-1" colSpan={2}>Basic Salary</td>
                                <td className="border border-black p-1 text-right font-mono">{formatCurrency(salarySlip.basic_salary)}</td>
                                <td className="border border-black p-1" colSpan={2}>Medical Prem. Recoverable</td>
                                <td className="border border-black p-1 text-right">-</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1" colSpan={2}>HRA</td>
                                <td className="border border-black p-1 text-right font-mono">{formatCurrency(salarySlip.hra)}</td>
                                <td className="border border-black p-1" colSpan={2}>HRA</td>
                                <td className="border border-black p-1 text-right font-mono">{formatCurrency(salarySlip.hra)}</td>
                                <td className="border border-black p-1" colSpan={2}>Prev. month salary hold</td>
                                <td className="border border-black p-1 text-right">-</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1" colSpan={2}>Special Allowance</td>
                                <td className="border border-black p-1 text-right font-mono">{formatCurrency(salarySlip.special_allowance)}</td>
                                <td className="border border-black p-1" colSpan={2}>Special Allowance</td>
                                <td className="border border-black p-1 text-right font-mono">{formatCurrency(salarySlip.special_allowance)}</td>
                                <td className="border border-black p-1" colSpan={2}>Ee PF contribution</td>
                                <td className="border border-black p-1 text-right">-</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1" colSpan={2}>Conveyance Allowance</td>
                                <td className="border border-black p-1 text-right font-mono">{formatCurrency(salarySlip.conveyance_allowance)}</td>
                                <td className="border border-black p-1" colSpan={2}>Conveyance Allowance</td>
                                <td className="border border-black p-1 text-right font-mono">{formatCurrency(salarySlip.conveyance_allowance)}</td>
                                <td className="border border-black p-1" colSpan={2}>Other Deductions</td>
                                <td className="border border-black p-1 text-right font-mono">{formatCurrency(salarySlip.deductions)}</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1" colSpan={2}>Medical Allowance</td>
                                <td className="border border-black p-1 text-right">-</td>
                                <td className="border border-black p-1" colSpan={2}>Medical Allowance</td>
                                <td className="border border-black p-1 text-right">-</td>
                                <td className="border border-black p-1" colSpan={2}></td>
                                <td className="border border-black p-1 text-right"></td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1" colSpan={2}>Process Allowance</td>
                                <td className="border border-black p-1 text-right">-</td>
                                <td className="border border-black p-1" colSpan={2}>Process Allowance</td>
                                <td className="border border-black p-1 text-right">-</td>
                                <td className="border border-black p-1" colSpan={2}></td>
                                <td className="border border-black p-1 text-right"></td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1" colSpan={2}>Compensatory Allowance</td>
                                <td className="border border-black p-1 text-right">-</td>
                                <td className="border border-black p-1" colSpan={2}>Compensatory Allowance</td>
                                <td className="border border-black p-1 text-right">-</td>
                                <td className="border border-black p-1" colSpan={2}></td>
                                <td className="border border-black p-1 text-right"></td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1" colSpan={2}></td>
                                <td className="border border-black p-1 text-right"></td>
                                <td className="border border-black p-1" colSpan={2}>Carry-over fr.prev.month</td>
                                <td className="border border-black p-1 text-right">-</td>
                                <td className="border border-black p-1" colSpan={2}></td>
                                <td className="border border-black p-1 text-right"></td>
                            </tr>
                            <tr className="bg-gray-200 font-bold">
                                <td className="border border-black p-1" colSpan={2}>Total Standard Salary</td>
                                <td className="border border-black p-1 text-right font-mono">{formatCurrency(salarySlip.gross_salary)}</td>
                                <td className="border border-black p-1" colSpan={2}>Gross Earnings</td>
                                <td className="border border-black p-1 text-right font-mono">{formatCurrency(salarySlip.gross_salary)}</td>
                                <td className="border border-black p-1" colSpan={2}>Gross Deductions</td>
                                <td className="border border-black p-1 text-right font-mono">{formatCurrency(salarySlip.deductions)}</td>
                            </tr>
                            <tr className="font-bold text-[9px]">
                                <td className="border border-black p-1" colSpan={6}></td>
                                <td className="border border-black p-1" colSpan={2}>Net Pay</td>
                                <td className="border border-black p-1 text-right font-mono">{formatCurrency(salarySlip.net_salary)}</td>
                            </tr>
                        </tbody>
                    </table>

                    {salarySlip.notes && (
                        <div className="mt-2 border border-black p-2" style={{ fontSize: '7px' }}>
                            <strong>Notes:</strong> {salarySlip.notes}
                        </div>
                    )}

                    {/* Footer Notes */}
                    <div className="mt-2 text-[7px] leading-tight">
                        <p>*This is a computer generated payslip and doesn't require signature or any company seal. All one time payments like PB, taxable LTA, variable pay etc will be subject to one time tax deduction at your applicable tax slab</p>
                        <p>*The current month pay slip has got generated after consideration of payroll input i.e. compensation letter, flexi declaration, one-timer payment input provided and approved transfers till {new Date(salarySlip.payment_date).getDate()}th of this month.</p>
                        <p>Generated on {new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(/\//g, '-').replace(',', '')}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
