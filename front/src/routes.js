import {
  Home,
  Login,
  Matches,
  Ranking,
  Settings,
  Signup,
  ThemeTest,
  Users,
  Worlds
} from '@/pages';

export default [{
  path: '/',
  tKey: 'home',
  component: Home,
  auth: true
}, {
  path: '/login',
  tKey: 'login',
  component: Login
}, {
  path: '/matches',
  tKey: 'matches',
  component: Matches,
  auth: true
}, {
  path: '/ranking',
  tKey: 'ranking',
  component: Ranking,
  auth: true
}, {
  path: '/settings/:tab?',
  tKey: 'settings',
  component: Settings,
  auth: true
}, {
  path: '/signup',
  tKey: 'signup',
  component: Signup
}, {
  path: '/theme-test',
  tKey: 'themetest',
  component: ThemeTest
}, {
  path: '/users',
  tKey: 'users',
  component: Users,
  auth: true
}, {
  path: '/worlds/:action?',
  tKey: 'worlds',
  component: Worlds
}];
