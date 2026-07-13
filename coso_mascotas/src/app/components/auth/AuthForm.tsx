interface AuthFormProps {
  authMode: "login" | "register";
  email: string;
  password: string;
  confirmPassword: string;
  loginError: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function AuthForm({
  authMode,
  email,
  password,
  confirmPassword,
  loginError,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onCancel,
}: AuthFormProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-lg rounded-[32px] border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-2xl shadow-slate-900/10">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-foreground">{authMode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {authMode === "login"
              ? "Accede para gestionar tus favoritos y pedidos."
              : "Regístrate para comenzar a comprar en Lily Pets."}
          </p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-foreground">Correo electrónico</span>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-input-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="correo@ejemplo.com"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-foreground">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-input-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="Contraseña"
            />
          </label>
          {authMode === "register" && (
            <label className="block">
              <span className="text-sm font-medium text-foreground">Confirmar contraseña</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-border bg-input-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                placeholder="Repite la contraseña"
              />
            </label>
          )}
          {loginError && <p className="text-sm text-destructive">{loginError}</p>}
          <button
            onClick={onSubmit}
            className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            {authMode === "login" ? "Iniciar sesión" : "Registrar"}
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
