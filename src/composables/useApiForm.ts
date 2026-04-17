import { ref } from "vue";
import { isApiError, type ApiError } from "../lib/http";

/**
 * Minimal surface we need from a form - matches VeeValidate's useForm()
 * return shape, but doesn't import it so the composable stays reusable.
 */
export interface FormBinding {
  values: Record<string, unknown>;
  setFieldError: (field: string, message: string | undefined) => void;
}

/**
 * Wrap an API call. On rejection, map DRF field errors onto matching
 * form fields via setFieldError, and surface anything left over as a
 * page-level formError.
 */
export function useApiForm(form: FormBinding) {
  const submitting = ref(false);
  const formError = ref<string | null>(null);

  async function submit<T>(fn: () => Promise<T>): Promise<T | undefined> {
    submitting.value = true;
    formError.value = null;
    try {
      return await fn();
    } catch (err) {
      const api: ApiError = isApiError(err)
        ? err
        : {
            status: 0,
            fieldErrors: {},
            formError: "Unexpected error",
            raw: err,
          };

      let mappedAny = false;
      for (const [field, message] of Object.entries(api.fieldErrors)) {
        if (field in form.values) {
          form.setFieldError(field, message);
          mappedAny = true;
        }
      }
      if (api.formError || !mappedAny) {
        formError.value =
          api.formError ??
          Object.values(api.fieldErrors)[0] ??
          "Request failed";
      }
      return undefined;
    } finally {
      submitting.value = false;
    }
  }

  function resetFormError() {
    formError.value = null;
  }

  return { submitting, formError, submit, resetFormError };
}
