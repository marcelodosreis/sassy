import { PASSWORD_STRENGTH_OPTIONS } from "@/constants/password-strength-options";

type PasswordStrengthProps = {
  password: string;
};

function calculatePasswordStrength(password: string): number {
  let strength = 0;
  if (password.length > 5) strength += 1;
  if (password.length > 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return strength;
}

function getStrengthLabel(strength: number): string {
  switch (strength) {
    case 1:
    case 2:
      return PASSWORD_STRENGTH_OPTIONS.Weak;
    case 3:
    case 4:
      return PASSWORD_STRENGTH_OPTIONS.Medium;
    case 5:
      return PASSWORD_STRENGTH_OPTIONS.Strong;
    default:
      return PASSWORD_STRENGTH_OPTIONS.Weak;
  }
}

function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = calculatePasswordStrength(password);
  const strengthLabel = getStrengthLabel(strength);

  return (
    <div>
      <div className="mt-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Password Strength:</span>
          <span className={password ? `font-semibold ${strength >= 3 ? 'text-green-500' : 'text-red-500'}` : ''}>
            {strengthLabel}
          </span>
        </div>
        <div className="h-1 mt-1 rounded-full bg-gray-300">
          <div
            className={`h-full rounded-full ${strength === 1
              ? 'bg-red-500'
              : strength === 2
              ? 'bg-yellow-500'
              : 'bg-green-500'
            }`}
            style={{
              width: `${(strength / 5) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PasswordStrength;