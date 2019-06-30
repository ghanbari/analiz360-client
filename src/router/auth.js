import AuthLayout from '../layouts/AuthLayout'
const Login = () => import('../components/auth/Login')
const LoginHelper = () => import('../views/auth/LoginHelper')
const Register = () => import('../views/auth/Register')
const RegisterHelper = () => import('../views/auth/RegisterHelper')
const Recovery = () => import('../views/auth/Recovery')

export default {
  path: '/auth',
  redirect: '/auth/login',
  name: 'Auth',
  component: AuthLayout,
  children: [
    {
      path: 'login',
      name: 'Login',
      components: {
        default: Login,
        helper: LoginHelper
      },
      meta: {
        title: 'ورود'
      }
    },
    {
      path: 'register',
      name: 'Register',
      components: {
        default: Register,
        helper: RegisterHelper
      },
      meta: {
        title: 'ثبت نام'
      }
    },
    {
      path: 'recovery',
      name: 'Recovery',
      components: {
        default: Recovery,
        helper: RegisterHelper
      },
      meta: {
        title: 'بازیابی رمزعبور'
      }
    }
  ]
}
