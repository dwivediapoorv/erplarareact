<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PaymentController extends Controller
{
    public function index(): Response
    {
        $payments = Payment::select('id', 'title', 'amount', 'payment_date', 'status', 'payment_method', 'description')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('payments/index', [
            'payments' => $payments,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('payments/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'payment_date' => ['required', 'date'],
            'status' => ['required', 'in:pending,completed,failed'],
            'payment_method' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        Payment::create($validated);

        return redirect()->route('payments.index')
            ->with('success', 'Payment created successfully.');
    }
}
