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
  component: Home,
  auth: true
}, {
  path: '/login',
  component: Login
}, {
  path: '/matches',
  component: Matches,
  auth: true
}, {
  path: '/ranking',
  component: Ranking,
  auth: true
}, {
  path: '/settings',
  component: Settings,
  auth: true
}, {
  path: '/signup',
  component: Signup
}, {
  path: '/theme-test',
  component: ThemeTest
}, {
  path: '/users',
  component: Users,
  auth: true
}, {
  path: '/worlds',
  component: Worlds
}];
