<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskComment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TaskCommentController extends Controller
{
    /**
     * Store a new comment on a task.
     */
    public function store(Request $request, Task $task): RedirectResponse
    {
        $validated = $request->validate([
            'comment' => ['required', 'string', 'max:2000'],
        ]);

        $task->comments()->create([
            'user_id' => auth()->id(),
            'comment' => $validated['comment'],
        ]);

        return back()->with('success', 'Comment added.');
    }

    /**
     * Delete a comment (only the author can delete their own).
     */
    public function destroy(Task $task, TaskComment $comment): RedirectResponse
    {
        if ($comment->user_id !== auth()->id()) {
            abort(403, 'You can only delete your own comments.');
        }

        $comment->delete();

        return back()->with('success', 'Comment deleted.');
    }
}
