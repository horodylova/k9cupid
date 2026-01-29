// File: submitForm function
export interface FormSubmissionResponse {
  ok: boolean;
  error?: string;
}

const DEFAULT_FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? 'https://formspree.io/f/mqebkzrw';

export async function submitForm(
  endpoint: string,
  formData: FormData
): Promise<FormSubmissionResponse> {
  try {
    const target = endpoint || DEFAULT_FORMSPREE_ENDPOINT;

    const response = await fetch(target, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      return { ok: true };
    } else {
      // Try to get error message from response
      const data = await response.json().catch(() => ({}));
      return {
        ok: false,
        error: data.error || 'There was an error sending your message. Please try again later.'
      };
    }
  } catch (error) {
    console.error('Failed to submit form:', error);
    return {
      ok: false,
      error: 'There was an error sending your message. Please try again later.'
    };
  }
}