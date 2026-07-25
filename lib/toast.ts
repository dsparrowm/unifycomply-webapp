import { getErrorMessage } from "@/lib/api/errors";
import { useToastStore } from "@/store/toast.store";

export function toastSuccess(message: string) {
  useToastStore.getState().push("success", message);
}

export function toastError(error: unknown, fallback = "Something went wrong") {
  useToastStore.getState().push("error", getErrorMessage(error, fallback));
}

export function toastInfo(message: string) {
  useToastStore.getState().push("info", message);
}

/** Run an async action and toast success or failure. Re-throws after error toast. */
export async function runAction<T>(
  action: () => Promise<T>,
  messages: { success: string; error?: string },
): Promise<T> {
  try {
    const result = await action();
    toastSuccess(messages.success);
    return result;
  } catch (error) {
    toastError(error, messages.error ?? "Something went wrong");
    throw error;
  }
}
