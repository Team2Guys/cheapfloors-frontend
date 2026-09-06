export interface CCAvenuePaymentKey {
  encRequest: string;
  accessCode: string;
  actionUrl: string;
}

export const submitCCAvenueForm = (paymentKey: CCAvenuePaymentKey) => {
  const { encRequest, accessCode, actionUrl } = paymentKey;

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = actionUrl;
  form.style.display = 'none';

  const fields: Record<string, string> = {
    encRequest,
    access_code: accessCode
  };

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};
