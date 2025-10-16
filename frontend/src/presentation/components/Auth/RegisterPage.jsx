import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRegisterForm from '../../hooks/useRegisterForm.js';
import { User, Mail, Lock, Calendar, Eye, EyeOff, CheckCircle, AlertCircle,Check } from 'lucide-react';
import InputWithIcon from '../../../components/ui/InputWithIcon';

/**
 * Página de registro profesional con Tailwind CSS v3.
 * Ya NO necesitas importar '../../../styles/RegisterPage.css'
 */
function RegisterPage() {
  const {
    username, setUsername, usernameError, setUsernameError, validateUsername,
    firstName, setFirstName, firstNameError, setFirstNameError, validateName,
    lastName, setLastName, lastNameError, setLastNameError,
    age, setAge, ageError, setAgeError, validateAge,
    email, setEmail, emailError, setEmailError, validateEmail,
    password, setPassword, passwordError, setPasswordError, validatePassword,
    confirmPassword, setConfirmPassword, confirmPasswordError, setConfirmPasswordError, validateConfirmPassword,
    error, success, loading,
    handleRegistration,
    navigate,
  } = useRegisterForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
          <p className="text-lg text-gray-600">Únete a nuestra comunidad y comienza tu experiencia</p>
        </div>

        {/* Contenedor principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Registro de Usuario</h2>
          
          {/* Mensajes de alerta */}
          {(error || success) && (
            <div className={`flex items-start gap-3 p-4 rounded-lg mb-6 ${
              error 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-green-50 border border-green-200'
            }`}>
              {error ? (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${error ? 'text-red-800' : 'text-green-800'}`}>
                {error || success}
              </p>
            </div>
          )}

          <form onSubmit={handleRegistration}>
            {/* Usuario y Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                <InputWithIcon
                  icon={User}
                  error={usernameError}
                  loading={loading}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameError(validateUsername(e.target.value));
                  }}
                  required
                  placeholder="Ingresa tu usuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <InputWithIcon
                  icon={Mail}
                  error={emailError}
                  loading={loading}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(validateEmail(e.target.value));
                  }}
                  required
                  placeholder="tu@email.com"
                  type="email"
                />
              </div>
            </div>

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <InputWithIcon
                  icon={User}
                  error={firstNameError}
                  loading={loading}
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setFirstNameError(validateName(e.target.value, 'nombre'));
                  }}
                  required
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                <InputWithIcon
                  icon={User}
                  error={lastNameError}
                  loading={loading}
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setLastNameError(validateName(e.target.value, 'apellido'));
                  }}
                  required
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            {/* Fecha de Nacimiento y Contraseña */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                <InputWithIcon
                  icon={Calendar}
                  error={ageError}
                  loading={loading}
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setAgeError(validateAge(e.target.value));
                  }}
                  required
                  type="date"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <InputWithIcon
                  icon={Lock}
                  error={passwordError}
                  loading={loading}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(validatePassword(e.target.value));
                    setConfirmPasswordError(validateConfirmPassword(confirmPassword, e.target.value));
                  }}
                  required
                  placeholder="Tu contraseña"
                  type={showPassword ? "text" : "password"}
                  rightElement={
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                />
              </div>
            </div>

           {/* Confirmar Contraseña */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <InputWithIcon
                icon={Lock}
                error={confirmPasswordError}
                loading={loading}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError(
                    validateConfirmPassword(e.target.value, password)
                  );
                }}
                required
                placeholder="Confirma tu contraseña"
                type={showConfirmPassword ? "text" : "password"}
                rightElement={
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
              />
            </div>


            {/* Botón de registro */}
            <button
              type="submit"
              className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all ${
                loading || usernameError || firstNameError || lastNameError || ageError || emailError || passwordError || confirmPasswordError
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
              disabled={loading || usernameError || firstNameError || lastNameError || ageError || emailError || passwordError || confirmPasswordError}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registrando...
                </span>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          {/* Footer del formulario */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <button
                onClick={() => handleNavigation('/login')}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Iniciar Sesión
              </button>
            </p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Al registrarte, aceptas nuestros{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
              Términos de Servicio
            </a>
            {' '}y{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
              Política de Privacidad
            </a>
          </p>
        </div>
        {/* Badge de confianza */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600" />
            </div>
            <span>Seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
              <Lock className="w-3 h-3 text-blue-600" />
            </div>
            <span>Encriptado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-purple-600" />
            </div>
            <span>Rápido</span>
          </div>
        </div>
  


        
      </div>
    </div>
  );
}

export default RegisterPage;
